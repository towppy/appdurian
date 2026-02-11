import React from 'react';
import { View, Text } from 'react-native';
import { useAdminStyles } from '@/styles/admin_styles/index.styles';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Fonts, Palette } from '@/constants/theme';

export default function UserManage() {
    return (
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: Palette.linenWhite }}>
            <AdminSidebar />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: Palette.linenWhite }}>
                <View style={{ backgroundColor: Palette.mutedSage, padding: 32, borderRadius: 24, alignItems: 'center', width: '100%', maxWidth: 500 }}>
                    <Text style={{ fontSize: 32, fontFamily: Fonts.bold, color: Palette.linenWhite }}>User Management</Text>
                <Text style={{ marginTop: 12, fontSize: 16, color: 'rgba(250, 249, 246, 0.8)', fontFamily: Fonts.medium, textAlign: 'center' }}>
                    Manage roles, permissions, and account status for all Durianostics users.
                </Text>
              </View>
            </View>
        </View>
    );
}
