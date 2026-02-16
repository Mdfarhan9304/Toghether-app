import WidgetKit
import SwiftUI

// MARK: - Timeline Provider

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) {
        let entry = SimpleEntry(date: Date())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> Void) {
        let entry = SimpleEntry(date: Date())
        // Refresh every hour
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
}

// MARK: - Timeline Entry

struct SimpleEntry: TimelineEntry {
    let date: Date
}

// MARK: - Widget View

struct TogetherWidgetEntryView: View {
    var entry: Provider.Entry

    @Environment(\.widgetFamily) var widgetFamily

    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.29, green: 0.56, blue: 0.85),
                    Color(red: 0.58, green: 0.38, blue: 0.82)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(spacing: widgetFamily == .systemSmall ? 8 : 12) {
                // App icon/emoji
                Text("💑")
                    .font(.system(size: widgetFamily == .systemSmall ? 32 : 40))

                // App name
                Text("Toghether")
                    .font(.system(size: widgetFamily == .systemSmall ? 18 : 22, weight: .bold, design: .rounded))
                    .foregroundColor(.white)

                // Static tagline
                Text("Stronger together, every day")
                    .font(.system(size: widgetFamily == .systemSmall ? 11 : 14, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.85))
                    .multilineTextAlignment(.center)
                    .lineLimit(2)

                if widgetFamily != .systemSmall {
                    // Extra detail for medium/large
                    Text("Open to connect with your partner ❤️")
                        .font(.system(size: 12, weight: .regular, design: .rounded))
                        .foregroundColor(.white.opacity(0.7))
                        .padding(.top, 4)
                }
            }
            .padding()
        }
    }
}

// MARK: - Widget Configuration

@main
struct TogetherWidget: Widget {
    let kind: String = "TogetherWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            if #available(iOS 17.0, *) {
                TogetherWidgetEntryView(entry: entry)
                    .containerBackground(for: .widget) {
                        Color.clear
                    }
            } else {
                TogetherWidgetEntryView(entry: entry)
            }
        }
        .configurationDisplayName("Toghether")
        .description("Stay connected with your partner")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// MARK: - Preview

#Preview(as: .systemSmall) {
    TogetherWidget()
} timeline: {
    SimpleEntry(date: .now)
}

#Preview(as: .systemMedium) {
    TogetherWidget()
} timeline: {
    SimpleEntry(date: .now)
}
