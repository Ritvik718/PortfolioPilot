import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function SettingsPage() {
    return (
        <>
            <DashboardHeader />
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings.
                </p>
                {/* Settings content will go here */}
            </div>
        </>
    )
}
