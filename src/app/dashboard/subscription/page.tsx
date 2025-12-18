"use client";

import { useState } from "react";
import { RefreshCcw, CreditCard, Calendar, Wallet } from "lucide-react";

import { BackgroundEffects, PageHeader, StatsGrid } from "@/app/core/components/shared/layout";

import { GenericEditModal } from "@/app/core/components/shared/generic-edit-modal";
import { SubscriptionForm } from "./components/subscription-form";
import { SubscriptionList } from "./components/subscription-list";
import { useSubscription } from "@/app/dashboard/subscription/hooks/use-subscription";
import { subscriptionSchema } from "@/app/dashboard/subscription/schema/subscription";
import { DEFAULT_SUBSCRIPTION_CATEGORIES } from "@/app/core/hooks/use-categories";

const CYCLE_OPTIONS = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "BIANNUALLY", label: "Every 6 Months" },
  { value: "YEARLY", label: "Yearly" },
];

export default function SubscriptionsPage() {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<any | null>(null);
  
  const { 
    isLoading, 
    stats,
    refetch,
    deleteSubscription,
    updateSubscription,
    isDeleting,
    isUpdating,
  } = useSubscription();

  const openEditModal = (subscription: any) => setEditingSubscription(subscription);
  const closeEditModal = () => setEditingSubscription(null);

  const openDeleteConfirm = () => setIsDeleteConfirmOpen(true);
  const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false);

  const totalSubs = stats?.allSubscriptions?.length || 0;
  const activeSubs = stats?.activeCount || 0;
  const inactiveCount = totalSubs - activeSubs;

  const pageStats = [
    {
      title: "Active Subscriptions",
      value: activeSubs.toString(),
      description: "Running services",
      icon: "checkCircle" as const,
      iconBg: "bg-linear-to-br from-blue-500 to-cyan-400",
      loading: isLoading,
    },
    {
      title: "Inactive Subscriptions",
      value: inactiveCount.toString(),
      description: "Paused services",
      icon: "xCircle" as const, // Now valid
      iconBg: "bg-linear-to-br from-slate-500 to-gray-400",
      loading: isLoading,
      // No prefix
    },
    {
      title: "Monthly Cost",
      value: stats.monthlyCost.toFixed(2), 
      description: "Recurring per month",
      icon: "wallet" as const,
      iconBg: "bg-linear-to-br from-purple-500 to-pink-400",
      loading: isLoading,
      prefix: "$" // Dollar sign added
    },
    {
      title: "Yearly Projection",
      value: stats.yearlyCost.toFixed(2),
      description: "Est. annual total",
      icon: "trendingUp" as const,
      iconBg: "bg-linear-to-br from-green-500 to-emerald-400",
      loading: isLoading,
      prefix: "$" // Dollar sign added
    },
  ];

  return (
    <div className="relative min-h-screen px-4 py-8 overflow-hidden">
      <BackgroundEffects />

      <div className="container mx-auto space-y-8">
        {/* HEADER */}
        <PageHeader
          title="SUBSCRIPTIONS"
          description="Manage recurring payments, track billing cycles, and optimize your fixed expenses."
          icon={<RefreshCcw className="w-4 h-4" />}
          tagline="Recurring Expenses"
        >
           <SubscriptionForm onSuccess={refetch} />
        </PageHeader>

        {/* STATS */}
        {/* Type assertion might be needed if your TS config is strict, 
            but the interface update in StatsGrid handles it naturally now */}
        <StatsGrid stats={pageStats} />

        {/* LIST SECTION */}
        <SubscriptionList 
          onEdit={openEditModal}
        />

        {editingSubscription && (
          <GenericEditModal
            isOpen={!!editingSubscription}
            onClose={closeEditModal}
            selectedItem={editingSubscription}
            isDeleteConfirmOpen={isDeleteConfirmOpen}
            openDeleteConfirm={openDeleteConfirm}
            closeDeleteConfirm={closeDeleteConfirm}
            updateItem={async ({ id, data }) => {
              const formattedData = {
                ...data,
                startDate: new Date(data.startDate).toISOString(),
                nextBilling: new Date(data.nextBilling).toISOString(),
                endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
                isActive: data.isActive === "true" || data.isActive === true,
              };
              return updateSubscription({ id, data: formattedData });
            }}
            deleteItem={deleteSubscription}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            title="Edit Subscription"
            description="Modify subscription details"
            itemType="subscription"
            schema={subscriptionSchema}
            defaultValues={{
              name: editingSubscription.name,
              amount: editingSubscription.amount,
              currency: editingSubscription.currency,
              cycle: editingSubscription.cycle,
              note: editingSubscription.note,
              category: editingSubscription.category,
              startDate: editingSubscription.startDate,
              nextBilling: editingSubscription.nextBilling,
              endDate: editingSubscription.endDate,
              isActive: editingSubscription.isActive ? "true" : "false",
              autoExpense: editingSubscription.autoExpense,
            }}
            amountField={{
              label: "Amount",
              icon: <Wallet className="w-4 h-4" />
            }}
            dateField={{
              label: "Next Billing",
              fieldName: "nextBilling",
              icon: <Calendar className="w-4 h-4" />
            }}
            categoryField={{
              label: "Category",
              icon: <CreditCard className="w-4 h-4" />
            }}
            extraFields={[
              {
                name: "name",
                label: "Service Name",
                type: "text",
                placeholder: "e.g., Netflix",
              },
              {
                name: "cycle",
                label: "Billing Cycle",
                type: "select",
                placeholder: "Select cycle",
                options: CYCLE_OPTIONS,
              },
              {
                name: "isActive",
                label: "Status",
                type: "select",
                options: [
                  { value: "true", label: "Active" }, 
                  { value: "false", label: "Inactive" }
                ]
              }
            ]}
            categories={DEFAULT_SUBSCRIPTION_CATEGORIES.map(c => ({ id: c, name: c }))}
            getItemId={(item) => item.id}
            getItemAmount={(item) => item.amount}
            getItemNote={(item) => item.note || ""}
          />
        )}
      </div>
    </div>
  );
}