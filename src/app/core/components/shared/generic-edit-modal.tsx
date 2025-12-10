"use client";

import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  Trash2,
  Loader2,
  DollarSign,
  Tag,
  Calendar,
  FileText,
  Globe,
  Edit3,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface EditModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: T | null;

  isDeleteConfirmOpen: boolean;
  openDeleteConfirm: () => void;
  closeDeleteConfirm: () => void;

  // Data & operations
  updateItem: (params: { id: string; data: any }) => Promise<any>;
  deleteItem: (id: string) => Promise<any>;
  categories?: Array<{ id: string; name: string }>;

  // Loading states
  isUpdating: boolean;
  isDeleting: boolean;

  // Configuration
  title: string;
  description: string;
  itemType: "expense" | "income" | "transaction";

  // Schema & form
  schema: any;
  defaultValues: any;

  // Field configuration
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
  extraFields?: Array<{
    name: string;
    label: string;
    type: "text" | "select" | "textarea" | "number";
    placeholder?: string;
    icon?: React.ReactNode;
    options?: Array<{ value: string; label: string }>;
  }>;

  // Formatting
  formatAmount?: (amount: number) => string;
  getItemId?: (item: T) => string;
  getItemAmount?: (item: T) => number;
  getItemNote?: (item: T) => string;
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
  isUpdating,
  isDeleting,
  title,
  description,
  itemType,
  schema,
  defaultValues,
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
  extraFields = [],
  formatAmount = (amount) => `$${amount.toFixed(2)}`,
  getItemId = (item: any) => item.id,
  getItemAmount = (item: any) => item.amount,
  getItemNote = (item: any) => item.note || "",
}: EditModalProps<T>) {
  // Form Setup
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // State for responsive layout
  const [isMobile, setIsMobile] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Watchers
  const watchedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });

  const watchedCurrency = useWatch({
    control: form.control,
    name: "currency",
  });

  // FIX: Use ref to track the last synced item ID to prevent unnecessary resets
  const lastSyncedItemId = useRef<string | null>(null);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // FIX: Sync form data only when selectedItem actually changes
  useEffect(() => {
    if (!selectedItem) {
      lastSyncedItemId.current = null;
      return;
    }

    const currentItemId = getItemId(selectedItem);

    // Only reset if this is a different item than what we last synced
    if (currentItemId === lastSyncedItemId.current) {
      return;
    }

    const itemData: any = {
      amount: getItemAmount(selectedItem),
      currency: (selectedItem as any).currency || "USD",
      note: getItemNote(selectedItem),
      categoryId: (selectedItem as any).categoryId ?? "none",
      [dateField.fieldName]: new Date(
        (selectedItem as any)[dateField.fieldName] || (selectedItem as any).date
      )
        .toISOString()
        .slice(0, 16),
    };

    // Add extra fields
    extraFields.forEach((field) => {
      if ((selectedItem as any)[field.name] !== undefined) {
        itemData[field.name] = (selectedItem as any)[field.name];
      }
    });

    form.reset(itemData);
    lastSyncedItemId.current = currentItemId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]); // CRITICAL: Only depend on selectedItem!

  // Handlers
  const handleCategoryChange = (value: string) => {
    form.setValue("categoryId", value);
  };

  const onSubmit = async (data: any) => {
    if (!selectedItem) return;

    const normalizedCategoryId =
      data.categoryId === "none" || data.categoryId === "uncategorized"
        ? null
        : data.categoryId;

    try {
      await updateItem({
        id: getItemId(selectedItem),
        data: {
          ...data,
          categoryId: normalizedCategoryId,
        },
      });

      toast.success(
        `${itemType === "income" ? "Income" : "Expense"} updated successfully!`
      );
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
      onClose();
      toast.success(
        `${itemType === "income" ? "Income" : "Expense"} deleted successfully!`
      );
    } catch (error) {
      console.error(error);
      toast.error(`Failed to delete ${itemType}`);
    }
  };

  if (!isOpen) return null;

  // Get icon for field type
  const getFieldIcon = (
    icon: React.ReactNode,
    defaultIcon: React.ReactNode,
    colorClass: string
  ) => {
    const IconComponent = icon || defaultIcon;
    return (
      <div
        className={`w-8 h-8 rounded-lg bg-linear-to-br ${colorClass} flex items-center justify-center`}
      >
        {IconComponent}
      </div>
    );
  };

  return (
    <>
      {/* Edit Modal */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="p-0 border-0 overflow-hidden bg-transparent max-w-[95vw] md:max-w-lg lg:max-w-xl mx-2 md:mx-0">
          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-[80vh]">
            {/* Blue linear header - Sticky */}
            <div className="relative bg-linear-to-r from-blue-500 to-cyan-500 p-4 md:p-6 shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl hidden md:block" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-2xl hidden md:block" />

              <DialogHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Edit3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
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

            {/* Form content with vertical scrolling */}
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
                {/* Amount */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-2">
                    {getFieldIcon(
                      amountField.icon,
                      <DollarSign className="w-4 h-4" />,
                      "from-blue-100 to-cyan-100"
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
                        $
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

                {/* Extra Fields */}
                {extraFields.map((field) => (
                  <div key={field.name} className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-2">
                      {getFieldIcon(
                        field.icon,
                        <FileText className="w-4 h-4" />,
                        "from-purple-100 to-pink-100"
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
                        value={form.watch(field.name)}
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
                      <Input
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        className="h-12 md:h-14 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20 w-full"
                        {...form.register(field.name)}
                      />
                    )}
                    {form.formState.errors[field.name] && (
                      <p className="text-red-500 text-sm px-1">
                        {(form.formState.errors[field.name] as any).message}
                      </p>
                    )}
                  </div>
                ))}

                {/* Category & Currency Row - Responsive grid */}
                <div
                  className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"}`}
                >
                  {/* Category */}
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-2">
                      {getFieldIcon(
                        categoryField.icon,
                        <Tag className="w-4 h-4" />,
                        "from-purple-100 to-pink-100"
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
                        <SelectItem
                          value="none"
                          className="rounded-lg hover:bg-slate-100/50"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                              <Tag className="w-3 h-3 text-slate-500" />
                            </div>
                            No category
                          </div>
                        </SelectItem>

                        {categories?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            className="rounded-lg hover:bg-slate-100/50"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                                <Tag className="w-3 h-3 text-blue-500" />
                              </div>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Currency */}
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-2">
                      {getFieldIcon(
                        <Globe className="w-4 h-4" />,
                        <Globe className="w-4 h-4" />,
                        "from-green-100 to-emerald-100"
                      )}
                      <Label className="text-sm font-semibold text-slate-700">
                        Currency
                      </Label>
                    </div>
                    <Select
                      onValueChange={(value) =>
                        form.setValue("currency", value)
                      }
                      value={watchedCurrency}
                    >
                      <SelectTrigger className="h-12 md:h-14 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500/20 w-full">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200/50 bg-white/90 backdrop-blur-md shadow-2xl max-h-60 overflow-y-auto">
                        <SelectItem
                          value="USD"
                          className="rounded-lg hover:bg-slate-100/50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">$</span>
                            <span className="truncate">
                              USD (United States Dollar)
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="EUR"
                          className="rounded-lg hover:bg-slate-100/50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">€</span>
                            <span className="truncate">EUR (Euro)</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="GBP"
                          className="rounded-lg hover:bg-slate-100/50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">£</span>
                            <span className="truncate">
                              GBP (British Pound)
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="CAD"
                          className="rounded-lg hover:bg-slate-100/50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">$</span>
                            <span className="truncate">
                              CAD (Canadian Dollar)
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="AUD"
                          className="rounded-lg hover:bg-slate-100/50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">$</span>
                            <span className="truncate">
                              AUD (Australian Dollar)
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-2">
                    {getFieldIcon(
                      dateField.icon,
                      <Calendar className="w-4 h-4" />,
                      "from-amber-100 to-orange-100"
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
                  {form.formState.errors[dateField.fieldName] && (
                    <p className="text-red-500 text-sm px-1">
                      {
                        (form.formState.errors[dateField.fieldName] as any)
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Note */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-2">
                    {getFieldIcon(
                      noteField.icon,
                      <FileText className="w-4 h-4" />,
                      "from-slate-100 to-gray-100"
                    )}
                    <Label
                      htmlFor="note"
                      className="text-sm font-semibold text-slate-700"
                    >
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

            {/* Footer - Sticky */}
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
                  Delete {itemType === "income" ? "Income" : "Expense"}
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
                  className="rounded-xl h-12 px-3 md:px-6 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group flex-1 md:flex-none"
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteConfirmOpen}
        onOpenChange={(open) => !open && closeDeleteConfirm()}
      >
        <DialogContent className="p-0 border-0 overflow-hidden bg-transparent max-w-[95vw] sm:max-w-[400px] mx-2 md:mx-0">
          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 flex flex-col max-h-[90vh] md:max-h-auto">
            {/* Red linear header */}
            <div className="relative bg-linear-to-r from-red-500 to-pink-500 p-4 md:p-6 shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl hidden md:block" />

              <DialogHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-xl md:text-2xl font-bold text-white truncate">
                      Delete {itemType === "income" ? "Income" : "Expense"}
                    </DialogTitle>
                    <DialogDescription className="text-red-100/80 text-sm md:text-base">
                      This action cannot be undone
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <div className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-linear-to-r from-red-50/50 to-pink-50/50 border border-red-100/30">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-linear-to-br from-red-100 to-pink-100 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-700 font-medium text-sm md:text-base">
                    Are you sure you want to delete this {itemType}?
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-red-600 mt-1 truncate">
                    {formatAmount(getItemAmount(selectedItem!))}
                  </p>
                  {getItemNote(selectedItem!) && (
                    <p className="text-sm text-gray-500 mt-1 italic truncate">
                      &ldquo;{getItemNote(selectedItem!)}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-500 px-2">
                This {itemType} will be permanently removed from your records
                and cannot be recovered.
              </p>
            </div>

            <DialogFooter className="flex gap-2 p-4 md:p-6 border-t border-slate-200/30 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={closeDeleteConfirm}
                className="rounded-xl h-12 px-3 md:px-6 border-slate-300/50 hover:bg-slate-100/50 flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-xl h-12 px-3 md:px-6 bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 flex-1"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="hidden md:inline">Deleting...</span>
                    <span className="md:hidden">Delete</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">
                      Delete {itemType === "income" ? "Income" : "Expense"}
                    </span>
                    <span className="md:hidden">Delete</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
