"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/app/core/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/core/components/ui/card";
import { Input } from "@/app/core/components/ui/input";
import { Label } from "@/app/core/components/ui/label";
import { Mail, User2, Save } from "lucide-react";
import { updateUser } from "../lib/api";
import { User } from "../types";
import { cn } from "@/app/core/lib/utils";

const nameSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

interface PersonalInfoSectionProps {
  user: User;
}

export default function PersonalInfoSection({ user }: PersonalInfoSectionProps) {
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: user.name || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { name: string }) => updateUser(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      reset({ name: data.user.name || "" });
      toast.success("Name updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: { name: string }) => {
    updateMutation.mutate(data);
  };

  return (
    <Card className="border-slate-200/50 shadow-sm hover:shadow-md transition-shadow rounded-xl md:rounded-2xl">
      <CardHeader className="px-4 py-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
          <User2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          Personal Information
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Update your personal details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 pb-4 sm:p-6 pt-0">
        {/* Email (Read Only) */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs sm:text-sm">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
            Email Address
          </Label>
          <div className="relative">
            <Input
              value={user.email}
              disabled
              className={cn(
                "bg-slate-50 border-slate-200 text-slate-600 pl-8 sm:pl-10",
                "text-sm sm:text-base",
                "h-9 sm:h-10"
              )}
            />
            <Mail className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Email cannot be changed
          </p>
        </div>

        {/* Name Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs sm:text-sm">
              Display Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter your name"
              className={cn(
                errors.name ? "border-red-300" : "",
                "text-sm sm:text-base",
                "h-9 sm:h-10"
              )}
            />
            {errors.name && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              This is how your name will appear throughout the app
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <Button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
              className={cn(
                "rounded-full bg-linear-to-r from-blue-500 to-cyan-500",
                "hover:from-blue-600 hover:to-cyan-600",
                "shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30",
                "w-full sm:w-auto",
                "text-xs sm:text-sm",
                "h-9 sm:h-10 px-4 sm:px-6",
                updateMutation.isPending && "opacity-90"
              )}
            >
              {updateMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Save Changes</span>
                </div>
              )}
            </Button>
            
            {isDirty && !updateMutation.isPending && (
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                className="rounded-full text-xs sm:text-sm h-9 sm:h-10 px-4 w-full sm:w-auto"
              >
                Cancel
              </Button>
            )}
          </div>
          
          {/* Form status indicator */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {isDirty && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Unsaved changes</span>
              </div>
            )}
            {!isDirty && updateMutation.isSuccess && (
              <div className="flex items-center gap-1 text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Changes saved</span>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}