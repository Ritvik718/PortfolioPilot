import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function AssetsPage() {
    return (
        <>
            <DashboardHeader />
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Your Assets</h2>
                <p className="text-muted-foreground">
                    A list of all assets in your portfolio.
                </p>
                {/* Asset list will go here */}
            </div>
        </>
    )
}
