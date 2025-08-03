import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function ReportsPage() {
    return (
        <>
            <DashboardHeader />
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
                <p className="text-muted-foreground">
                    Your portfolio performance reports.
                </p>
                {/* Reports content will go here */}
            </div>
        </>
    )
}
