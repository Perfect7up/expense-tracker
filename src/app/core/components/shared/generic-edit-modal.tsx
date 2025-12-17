"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, UseFormWatch, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/core/components/ui/input";
import { Button } from "@/app/core/components/ui/button";
import { Textarea } from "@/app/core/components/ui/textarea";
import { Label } from "@/app/core/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/app/core/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/core/components/ui/alert-dialog";
import {
  Trash2,
  Loader2,
  DollarSign,
  Tag,
  Calendar,
  FileText,
  Globe,
  Edit3,
  ArrowRight,
  Repeat,
} from "lucide-react";
import { toast } from "sonner";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  cycle: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "QUARTERLY" | "BIANNUALLY";
  nextBilling: string;
  isActive: boolean;
  category: string;
  startDate: string;
  endDate: string | null;
  note: string | null;
  autoExpense: boolean;
}

// Helper type for category options to support both {id, name} and {value, label}
type CategoryOption = { id: string; name: string } | { value: string; label: string };

interface EditModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: T | null;

  isDeleteConfirmOpen: boolean;
  openDeleteConfirm: () => void;
  closeDeleteConfirm: () => void;

  updateItem: (params: { id: string; data: any }) => Promise<any>;
  deleteItem: (id: string) => Promise<any>;
  
  // Updated to accept both formats
  categories?: CategoryOption[];
  subscriptions?: Subscription[];

  isUpdating: boolean;
  isDeleting: boolean;

  title: string;
  description: string;
  itemType: "expense" | "income" | "transaction" | "subscription" | "investment";

  schema: any;
  defaultValues: any;

  // Visual Customization
  modalGradient?: string;
  modalIcon?: React.ReactNode;
  deleteConfirmMessage?: string;

  amountField?: {
    label: string;
    icon?: React.ReactNode;
  };
  categoryField?: {
    label: string;
    icon?: React.ReactNode;
  };
  dateField?: {
    label: string;
    fieldName: string;
    icon?: React.ReactNode;
  };
  noteField?: {
    label: string;
    placeholder: string;
    icon?: React.ReactNode;
  };
  subscriptionField?: {
    label: string;
    icon?: React.ReactNode;
  };
  extraFields?: Array<{
    name: string;
    label: string;
    type: "text" | "select" | "textarea" | "number";
    placeholder?: string;
    icon?: React.ReactNode;
    options?: Array<{ value: string; label: string }>;
    // Added properties to fix TypeScript errors
    step?: string;
    min?: string;
    required?: boolean;
    prefix?: string;
  }>;

  // Custom renderer for things like live investment summaries
  renderAdditionalInfo?: (item: T, watch: UseFormWatch<any>) => React.ReactNode;

  formatAmount?: (amount: number) => string;
  getItemId?: (item: T) => string;
  getItemAmount?: (item: T) => number;
  getItemNote?: (item: T) => string;
  getItemCategory?: (item: T) => string | null;
  getItemSubscription?: (item: T) => string | null;
}

export function GenericEditModal<T>({
  isOpen,
  onClose,
  selectedItem,
  isDeleteConfirmOpen,
  openDeleteConfirm,
  closeDeleteConfirm,
  updateItem,
  deleteItem,
  categories = [],
  subscriptions = [],
  isUpdating,
  isDeleting,
  title,
  description,
  itemType,
  schema,
  defaultValues,
  modalGradient = "bg-linear-to-r from-blue-500 to-cyan-500",
  modalIcon,
  deleteConfirmMessage,
  amountField = { label: "Amount", icon: <DollarSign className="w-4 h-4" /> },
  categoryField = { label: "Category", icon: <Tag className="w-4 h-4" /> },
  dateField = {
    label: "Date & Time",
    fieldName: "occurredAt",
    icon: <Calendar className="w-4 h-4" />,
  },
  noteField = {
    label: "Note (Optional)",
    placeholder: "Add a note...",
    icon: <FileText className="w-4 h-4" />,
  },
  subscriptionField = {
    label: "Subscription",
    icon: <Repeat className="w-4 h-4" />,
  },
  extraFields = [],
  renderAdditionalInfo,
  formatAmount = (amount) => `$${amount.toFixed(2)}`,
  getItemId = (item: any) => item.id,
  getItemAmount = (item: any) => item.amount || item.averageBuyPrice || 0,
  getItemNote = (item: any) => item.note || "",
  getItemCategory = (item: any) => item.categoryId || null,
  getItemSubscription = (item: any) => item.subscriptionId || null,
}: EditModalProps<T>) {
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [isMobile, setIsMobile] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastSyncedItemId = useRef<string | null>(null);

  const typeLabel = itemType.charAt(0).toUpperCase() + itemType.slice(1);

  const watchedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });

  const watchedCurrency = useWatch({
    control: form.control,
    name: "currency",
  });

  const watchedSubscriptionId = useWatch({
    control: form.control,
    name: "subscriptionId",
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!selectedItem) {
      lastSyncedItemId.current = null;
      return;
    }

    const currentItemId = getItemId(selectedItem);
    if (currentItemId === lastSyncedItemId.current) {
      return;
    }

    const itemData: any = {
      amount: getItemAmount(selectedItem),
      currency: (selectedItem as any).currency || "USD",
      note: getItemNote(selectedItem),
      categoryId: getItemCategory(selectedItem) || "none",
      subscriptionId: getItemSubscription(selectedItem) || "none",
      // Handle cases where item might not have the date field (e.g. investments)
      [dateField.fieldName]: (selectedItem as any)[dateField.fieldName] || (selectedItem as any).date || (selectedItem as any).createdAt
        ? new Date((selectedItem as any)[dateField.fieldName] || (selectedItem as any).date || (selectedItem as any).createdAt).toISOString().slice(0, 16)
        : undefined, 
    };

    extraFields.forEach((field) => {
      let val = (selectedItem as any)[field.name];
      // Handle boolean to string conversion for Select inputs
      if (typeof val === 'boolean' && field.type === 'select') {
        val = val ? "true" : "false";
      }
      if (val !== undefined) {
        itemData[field.name] = val;
      }
    });

    form.reset(itemData);
    lastSyncedItemId.current = currentItemId;
  }, [selectedItem, getItemId, getItemAmount, getItemNote, getItemCategory, getItemSubscription, dateField.fieldName, extraFields, form]);

  const handleCategoryChange = (value: string) => {
    form.setValue("categoryId", value);
  };

  const handleSubscriptionChange = (value: string) => {
    form.setValue("subscriptionId", value);
  };

  const onSubmit = async (data: any) => {
    if (!selectedItem) return;

    const normalizedCategoryId =
      data.categoryId === "none" || data.categoryId === "uncategorized"
        ? null
        : data.categoryId;

    const normalizedSubscriptionId =
      data.subscriptionId === "none" ? null : data.subscriptionId;

    const processedData = { ...data };
    extraFields.forEach((field) => {
        if (field.type === 'select') {
            if (processedData[field.name] === "true") {
                processedData[field.name] = true;
            } else if (processedData[field.name] === "false") {
                processedData[field.name] = false;
            }
        }
    });

    try {
      await updateItem({
        id: getItemId(selectedItem),
        data: {
          ...processedData,
          categoryId: normalizedCategoryId,
          subscriptionId: normalizedSubscriptionId,
        },
      });

      toast.success(`${typeLabel} updated successfully!`);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to update ${itemType}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteItem(getItemId(selectedItem));
      closeDeleteConfirm();
      onClose();
      toast.success(`${typeLabel} deleted successfully!`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to delete ${itemType}`);
    }
  };

  if (!isOpen) return null;

  const getFieldIcon = (
    icon: React.ReactNode,
    defaultIcon: React.ReactNode,
    colorClass: string
  ) => {
    const IconComponent = icon || defaultIcon;
    return (
      <div
        className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center`}
      >
        {IconComponent}
      </div>
    );
  };

  const formatSubscriptionDisplay = (subscription: Subscription) => {
    const cycleMap: Record<string, string> = {
      "DAILY": "/day",
      "WEEKLY": "/week", 
      "MONTHLY": "/month",
      "QUARTERLY": "/quarter",
      "BIANNUALLY": "/6mo",
      "YEARLY": "/year"
    };
    return `${subscription.name} (${subscription.currency}${subscription.amount}${cycleMap[subscription.cycle] || ''})`;
  };

  // Helper to get ID and Name from mixed category types
  const getCategoryValue = (cat: CategoryOption) => (cat as any).id || (cat as any).value;
  const getCategoryLabel = (cat: CategoryOption) => (cat as any).name || (cat as any).label;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="p-0 border-0 overflow-hidden bg-transparent max-w-[95vw] md:max-w-lg lg:max-w-xl mx-2 md:mx-0">
          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-[80vh]">
            {/* Header */}
            <div className={`relative ${modalGradient} p-4 md:p-6 shrink-0`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl hidden md:block" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-2xl hidden md:block" />

              <DialogHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    {modalIcon || <Edit3 className="w-5 h-5 md:w-6 md:h-6 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-xl md:text-2xl font-bold text-white truncate">
                      {title}
                    </DialogTitle>
                    <DialogDescription className="text-blue-100/80 text-sm md:text-base truncate">
                      {description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            {/* Content */}
            <div
              ref={contentRef}
              className="overflow-y-auto flex-1 p-4 md:p-6"
              style={{
                maxHeight: "calc(90vh - 140px)",
                scrollbarWidth: "thin",
                scrollbarColor: "#CBD5E1 #F8FAFC",
              }}
            >
              <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 md:space-y-6"
              >
                {/* Standard Amount Field - Only show if using standard expense/income logic, 
                    Investments usually use extraFields for quantity/price */}
                {itemType !== 'investment' && (
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-2">
                    {getFieldIcon(
                      amountField.icon,
                      <DollarSign className="w-4 h-4" />,
                      "bg-linear-to-br from-blue-100 to-cyan-100"
                    )}
                    <Label
                      htmlFor="amount"
                      className="text-sm font-semibold text-slate-700"
                    >
                      {amountField.label} *
                    </Label>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-cyan-500/10 rounded-xl blur group-hover:blur-sm transition-all duration-300" />
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                        {watchedCurrency === "EUR" ? "€" : watchedCurrency === "GBP" ? "£" : "$"}
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="pl-10 h-12 md:h-14 text-lg font-semibold rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20 w-full"
                        {...form.register("amount", { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                  {form.formState.errors.amount && (
                    <p className="text-red-500 text-sm px-1">
                      {(form.formState.errors.amount as any).message}
                    </p>
                  )}
                </div>
                )}

                {/* Extra Fields */}
                {extraFields.map((field) => (
                  <div key={field.name} className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-2">
                      {getFieldIcon(
                        field.icon,
                        <FileText className="w-4 h-4" />,
                        "bg-linear-to-br from-purple-100 to-pink-100"
                      )}
                      <Label
                        htmlFor={field.name}
                        className="text-sm font-semibold text-slate-700"
                      >
                        {field.label}
                      </Label>
                    </div>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.name}
                        rows={3}
                        placeholder={field.placeholder}
                        className="rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20 resize-none w-full"
                        {...form.register(field.name)}
                      />
                    ) : field.type === "select" ? (
                      <Select
                        onValueChange={(value) =>
                          form.setValue(field.name, value)
                        }
                        value={form.watch(field.name)?.toString()}
                      >
                        <SelectTrigger className="h-12 md:h-14 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 w-full">
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200/50 bg-white/90 backdrop-blur-md shadow-2xl max-h-60 overflow-y-auto">
                          {field.options?.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="rounded-lg hover:bg-slate-100/50"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="relative">
                        {field.prefix && (
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">
                            {field.prefix}
                          </span>
                        )}
                        <Input
                          id={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          step={field.step}
                          min={field.min}
                          className={`h-12 md:h-14 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20 w-full ${field.prefix ? "pl-10" : ""}`}
                          {...form.register(field.name)}
                        />
                      </div>
                    )}
                    {form.formState.errors[field.name] && (
                      <p className="text-red-500 text-sm px-1">
                        {(form.formState.errors[field.name] as any).message}
                      </p>
                    )}
                  </div>
                ))}

                {/* Standard Category & Currency Row */}
                <div
                  className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"}`}
                >
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-2">
                      {getFieldIcon(
                        categoryField.icon,
                        <Tag className="w-4 h-4" />,
                        "bg-linear-to-br from-purple-100 to-pink-100"
                      )}
                      <Label className="text-sm font-semibold text-slate-700">
                        {categoryField.label}
                      </Label>
                    </div>

                    <Select
                      value={watchedCategoryId || "none"}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger className="h-12 md:h-14 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200/50 bg-white/90 backdrop-blur-md shadow-2xl max-h-60 overflow-y-auto">
                        <SelectItem value="none">No category</SelectItem>
                        {categories?.map((category) => (
                          <SelectItem key={getCategoryValue(category)} value={getCategoryValue(category)}>
                            {getCategoryLabel(category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Currency - Only show if itemType is standard monetary type that uses the global currency field */}
                  {itemType !== "investment" && (
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center gap-2">
                        {getFieldIcon(
                          <Globe className="w-4 h-4" />,
                          <Globe className="w-4 h-4" />,
                          "bg-linear-to-br from-green-100 to-emerald-100"
                        )}
                        <Label className="text-sm font-semibold text-slate-700">Currency</Label>
                      </div>
                      <Select
                        onValueChange={(value) => form.setValue("currency", value)}
                        value={watchedCurrency}
                      >
                        <SelectTrigger className="h-12 md:h-14 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500/20 w-full">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200/50 bg-white/90 backdrop-blur-md shadow-2xl max-h-60 overflow-y-auto">
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="CAD">CAD ($)</SelectItem>
                          <SelectItem value="AUD">AUD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Subscription Field */}
                {subscriptions.length > 0 && (
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-2">
                      {getFieldIcon(
                        subscriptionField.icon,
                        <Repeat className="w-4 h-4" />,
                        "bg-linear-to-br from-indigo-100 to-violet-100"
                      )}
                      <Label className="text-sm font-semibold text-slate-700">
                        {subscriptionField.label} (Optional)
                      </Label>
                    </div>

                    <Select
                      value={watchedSubscriptionId || "none"}
                      onValueChange={handleSubscriptionChange}
                    >
                      <SelectTrigger className="h-12 md:h-14 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500/20 w-full">
                        <SelectValue placeholder="Select subscription" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200/50 bg-white/90 backdrop-blur-md shadow-2xl max-h-60 overflow-y-auto">
                        <SelectItem value="none">No subscription</SelectItem>
                        {subscriptions?.map((subscription) => (
                          <SelectItem key={subscription.id} value={subscription.id}>
                            {formatSubscriptionDisplay(subscription)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Date - Only show if dateField matches an actual field on the object or if not investment */}
                {itemType !== 'investment' && (
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-2">
                      {getFieldIcon(
                        dateField.icon,
                        <Calendar className="w-4 h-4" />,
                        "bg-linear-to-br from-amber-100 to-orange-100"
                      )}
                      <Label
                        htmlFor={dateField.fieldName}
                        className="text-sm font-semibold text-slate-700"
                      >
                        {dateField.label} *
                      </Label>
                    </div>
                    <Input
                      id={dateField.fieldName}
                      type="datetime-local"
                      className="h-12 md:h-14 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm text-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-500/20 w-full"
                      {...form.register(dateField.fieldName)}
                    />
                  </div>
                )}

                {/* Custom Additional Info (like Investment Summary) */}
                {renderAdditionalInfo && selectedItem && (
                   renderAdditionalInfo(selectedItem, form.watch)
                )}

                {/* Note */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-2">
                    {getFieldIcon(
                      noteField.icon,
                      <FileText className="w-4 h-4" />,
                      "bg-linear-to-br from-slate-100 to-gray-100"
                    )}
                    <Label htmlFor="note" className="text-sm font-semibold text-slate-700">
                      {noteField.label}
                    </Label>
                  </div>
                  <Textarea
                    id="note"
                    rows={3}
                    placeholder={noteField.placeholder}
                    className="rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:border-slate-300 focus:ring-2 focus:ring-slate-500/20 resize-none w-full"
                    {...form.register("note")}
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <DialogFooter className="flex justify-between p-4 md:p-6 gap-2 border-t border-slate-200/30 shrink-0 bg-white/50 backdrop-blur-sm">
              <Button
                type="button"
                variant="destructive"
                onClick={openDeleteConfirm}
                disabled={isDeleting}
                className="rounded-xl h-12 px-3 md:px-4 bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 text-sm md:text-base flex-1 md:flex-none"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">
                  Delete {typeLabel}
                </span>
                <span className="md:hidden">Delete</span>
              </Button>
              <div className="flex gap-2 flex-1 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-xl h-12 px-3 md:px-6 border-slate-300/50 hover:bg-slate-100/50 flex-1 md:flex-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isUpdating}
                  className={`rounded-xl h-12 px-3 md:px-6 ${modalGradient} text-white shadow-lg transition-all duration-300 group flex-1 md:flex-none hover:opacity-90`}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="hidden md:inline">Saving...</span>
                      <span className="md:hidden">Save</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden md:inline">Save Changes</span>
                      <span className="md:hidden">Save</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform hidden md:inline" />
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog */}
      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={closeDeleteConfirm}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirmMessage || `This action cannot be undone. This will permanently delete this ${itemType}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteConfirm} className="rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : `Delete ${typeLabel}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}