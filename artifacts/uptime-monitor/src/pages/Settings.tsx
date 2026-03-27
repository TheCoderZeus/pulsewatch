import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetMe } from "@workspace/api-client-react";

export function Settings() {
  const { data: user, isLoading } = useGetMe();

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and subscription plan.</p>
        </div>

        {isLoading ? (
          <div className="animate-pulse h-64 bg-card rounded-2xl"></div>
        ) : (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Full Name</label>
                  <div className="px-4 py-3 bg-secondary rounded-xl font-medium">{user?.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Email Address</label>
                  <div className="px-4 py-3 bg-secondary rounded-xl font-medium">{user?.email}</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Subscription Plan</h3>
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-bold uppercase tracking-wide">
                  {user?.plan} PLAN
                </span>
              </div>
              <p className="text-muted-foreground mb-6">You are currently on the {user?.plan} plan. Upgrade to unlock more monitors, faster check intervals, and status pages.</p>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Upgrade Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
