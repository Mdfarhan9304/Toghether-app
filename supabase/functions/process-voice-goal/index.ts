import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      console.log('not working')
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured. Add OPENAI_API_KEY to Supabase secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const contentType = req.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return new Response(
        JSON.stringify({ error: 'Invalid content type. Expected multipart/form-data.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const reqFormData = await req.formData();
    const file = reqFormData.get('file');

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'No audio file provided.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build form data for Whisper
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
    formData.append('response_format', 'json');

    // Step 1: Transcribe with Whisper
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      console.error('Whisper error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Transcription failed.', details: errorText }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const whisperData = await whisperResponse.json();
    const transcript = whisperData.text || '';

    if (!transcript.trim()) {
      return new Response(
        JSON.stringify({ error: 'Could not transcribe audio. Please speak clearly and try again.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Extract structured goal with GPT-4o-mini
    const today = new Date().toISOString().split('T')[0];
    const systemPrompt = `You are a helpful assistant for a couple's goal-tracking app called Toghether.
Today's date is ${today}.

Extract goal information from the user's speech and return a JSON object with these exact fields:
- name: (string) A clear, concise goal name (max 60 chars)
- category: (string) One of exactly: "Finance", "Travel", "Health", "Fitness", "Home", "Knowledge", "Milestone"
- goal_type: (string) "Shared" if the goal involves both partners/a couple (uses "we", "us", "our", "together"), otherwise "Individual"
- tracking_type: (string) One of: "boolean" (yes/no daily check), "number" (count something), "amount" (money), "progress" (percentage)
- target_value: (number or null) Numeric target if applicable (e.g., 5000 for $5000, 30 for 30 days)
- target_date: (string or null) Target date in YYYY-MM-DD format. Interpret relative dates like "by December" or "in 3 months" based on today's date.
- unit: (string or null) Unit label for number tracking (e.g., "steps", "pages", "hours"). Null for other types.
- currency: (string or null) Currency code if amount type: "USD", "EUR", "GBP", "INR", "JPY". Default to "USD" if not specified.
- reason: (string) A motivational why statement for this goal (1-2 sentences)
- transcript: (string) The original transcription of what the user said

IMPORTANT: Respond with ONLY a valid JSON object. No markdown, no explanation, just raw JSON.`;

    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Extract goal from this speech: "${transcript}"` },
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!gptResponse.ok) {
      const errorText = await gptResponse.text();
      console.error('GPT error:', errorText);
      return new Response(
        JSON.stringify({ transcript, error: 'Goal extraction failed.', details: errorText }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const gptData = await gptResponse.json();
    const rawContent = gptData.choices?.[0]?.message?.content || '{}';
    const goalData = JSON.parse(rawContent);

    // Make sure transcript is always included
    goalData.transcript = transcript;

    return new Response(
      JSON.stringify({ success: true, goal: goalData }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred.', details: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
