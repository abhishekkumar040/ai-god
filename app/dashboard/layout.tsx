import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/custom/dashboard/AppSidebar';

function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            <div className="flex-1">
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarTrigger />
                    {children}
                </SidebarProvider>

            </div>
        </div>
    );
}

export default DashboardLayout;