import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="dark" />
            
            {/* ─── Header ─── */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="chevron-left" size={28} color="#C4175C" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account & Settings</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="settings" size={24} color="#C4175C" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* ─── Profile Avatar ─── */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        {/* Placeholder image for user */}
                        <Image 
                            source={{ uri: 'https://i.pravatar.cc/150?img=68' }} 
                            style={styles.avatarImage} 
                        />
                        <View style={styles.nameBadge}>
                            <Text style={styles.nameBadgeText}>ALEX</Text>
                        </View>
                    </View>
                    <Text style={styles.profileName}>Alex Smith</Text>
                    <Text style={styles.memberSince}>MEMBER SINCE JUNE 2022</Text>
                </View>

                {/* ─── OUR PARTNERSHIP (or ACCOUNT DETAILS) ─── */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>ACCOUNT DETAILS</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#FFF0F3' }]}>
                                <MaterialIcons name="stars" size={20} color="#C4175C" />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>Subscription Status</Text>
                                <Text style={styles.rowSubtitle}>Premium Member</Text>
                            </View>
                            <View style={styles.activeBadge}>
                                <Text style={styles.activeBadgeText}>ACTIVE</Text>
                            </View>
                        </View>
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#FFF0F3' }]}>
                                <MaterialIcons name="qr-code" size={20} color="#C4175C" />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>Personal Code</Text>
                            </View>
                            <Text style={styles.rowValue}>TGT-8829</Text>
                            <MaterialIcons name="content-copy" size={16} color="#A1A1AA" style={{ marginLeft: 8 }} />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#FFF0F3' }]}>
                                <MaterialIcons name="calendar-today" size={20} color="#C4175C" />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>Joined Together</Text>
                            </View>
                            <Text style={styles.rowValue}>October 12th</Text>
                        </View>
                    </View>
                </View>

                {/* ─── PREFERENCES ─── */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>PREFERENCES</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#F4F4F5' }]}>
                                <MaterialIcons name="notifications" size={20} color="#3F3F46" />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>Notifications</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="#A1A1AA" />
                        </TouchableOpacity>
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#F4F4F5' }]}>
                                <Ionicons name="moon" size={18} color="#3F3F46" />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>Theme</Text>
                            </View>
                            <View style={styles.themeToggle}>
                                <View style={styles.themeToggleActive}>
                                    <Feather name="sun" size={14} color="#09090B" />
                                </View>
                                <View style={styles.themeToggleInactive}>
                                    <Feather name="moon" size={14} color="#71717A" />
                                </View>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#F4F4F5' }]}>
                                <MaterialIcons name="language" size={20} color="#3F3F46" />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>Language</Text>
                            </View>
                            <Text style={styles.rowValueLight}>English</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#A1A1AA" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ─── SUPPORT ─── */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>SUPPORT</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#F4F4F5' }]}>
                                <MaterialIcons name="help" size={20} color="#3F3F46" />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>Help Center</Text>
                            </View>
                            <Feather name="external-link" size={18} color="#71717A" />
                        </TouchableOpacity>
                        
                        <View style={styles.divider} />
                        
                        <TouchableOpacity style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#F4F4F5' }]}>
                                <MaterialIcons name="description" size={20} color="#3F3F46" />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>Privacy Policy</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="#A1A1AA" />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#F4F4F5' }]}>
                                <MaterialIcons name="gavel" size={20} color="#3F3F46" />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>Terms of Service</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="#A1A1AA" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ─── ACCOUNT ─── */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>ACCOUNT</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#F4F4F5' }]}>
                                <MaterialIcons name="email" size={20} color="#3F3F46" />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>Change Email</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="#A1A1AA" />
                        </TouchableOpacity>
                        
                        <View style={styles.divider} />
                        
                        <TouchableOpacity style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: '#F4F4F5' }]}>
                                <MaterialIcons name="lock-reset" size={20} color="#3F3F46" />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>Reset Password</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="#A1A1AA" />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: 'transparent' }]}>
                                <MaterialIcons name="logout" size={20} color="#E11D48" style={{ transform: [{ scaleX: -1 }] }} />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={[styles.rowTitle, { color: '#E11D48' }]}>Logout</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footerVersion}>TOGETHER APP V2.4.0</Text>
                
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCF8F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#8B1D41',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    nameBadge: {
        position: 'absolute',
        bottom: -6,
        alignSelf: 'center',
        backgroundColor: '#C4175C',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    nameBadgeText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 10,
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    profileName: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 24,
        color: '#8B1D41',
        marginBottom: 6,
    },
    memberSince: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 11,
        color: '#C4175C',
        letterSpacing: 1.5,
        opacity: 0.8,
    },
    sectionContainer: {
        marginBottom: 28,
    },
    sectionHeader: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 12,
        color: '#8B1D41',
        letterSpacing: 1.5,
        marginBottom: 12,
        paddingLeft: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    rowContent: {
        flex: 1,
        justifyContent: 'center',
    },
    rowTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 15,
        color: '#09090B',
    },
    rowSubtitle: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 13,
        color: '#71717A',
        marginTop: 2,
    },
    rowValue: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#3F3F46',
    },
    rowValueLight: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#A1A1AA',
    },
    activeBadge: {
        backgroundColor: '#FFF0F3',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    activeBadgeText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 11,
        color: '#C4175C',
        letterSpacing: 0.5,
    },
    themeToggle: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E7',
        borderRadius: 20,
        padding: 4,
    },
    themeToggleActive: {
        backgroundColor: '#FFFFFF',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    themeToggleInactive: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#F4F4F5',
        marginLeft: 66,
        marginRight: 16,
    },
    footerVersion: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 11,
        color: '#A1A1AA',
        textAlign: 'center',
        letterSpacing: 1.5,
        marginTop: 20,
    }
});
