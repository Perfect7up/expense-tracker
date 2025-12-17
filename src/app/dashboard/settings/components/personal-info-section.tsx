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
import { Mail, User2 } from "lucide-react";
import { updateUser } from "../lib/api";
import { User } from "../types";

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
    <Card className="border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User2 className="w-5 h-5 text-blue-500" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Update your personal details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email (Read Only) */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </Label>
          <div className="relative">
            <Input
              value={user.email}
              disabled
              className="bg-slate-50 border-slate-200 text-slate-600 pl-10"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Name Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter your name"
              className={errors.name ? "border-red-300" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={updateMutation.isPending || !isDirty}
            className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/20"
          >
            {updateMutation.isPending ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}