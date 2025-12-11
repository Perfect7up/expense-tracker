"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import Image from "next/image";

// --- Types ---
type User = {
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
};

// --- Zustand Store ---
type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// --- Schemas ---
const updateNameSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

// --- API Calls ---
const fetchUser = async (): Promise<User> => {
  const res = await fetch("/api/user");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch user");
  }
  return res.json();
};

const updateUser = async (data: { 
  name?: string; 
  avatar?: File; 
  resetPassword?: boolean 
}) => {
  const formData = new FormData();
  
  if (data.name) formData.append("name", data.name);
  if (data.avatar) formData.append("avatar", data.avatar);
  if (data.resetPassword) formData.append("resetPassword", "true");

  const res = await fetch("/api/user", {
    method: "PATCH",
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) {
    console.error("Update error response:", json);
    throw new Error(json.error || json.details || "Failed to update");
  }
  return json;
};

const deleteUser = async () => {
  const res = await fetch("/api/user", { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to delete account");
  return json;
};

// --- Settings Page Component ---
export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { user, setUser } = useUserStore();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch User Data
  const { data: fetchedUser, isLoading, error: fetchError } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: 1,
  });

  // Debug fetched user
  useEffect(() => {
    console.log("Fetched user data:", fetchedUser);
    if (fetchError) {
      console.error("Fetch user error:", fetchError);
    }
  }, [fetchedUser, fetchError]);

  // Sync fetched data to store and forms
  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
      nameForm.reset({ name: fetchedUser.name || "" });
      setAvatarPreview(fetchedUser.avatarUrl || null);
    }
  }, [fetchedUser]);

  // --- Mutations ---
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      console.log("Update success:", data);
      if (data.user) {
        queryClient.setQueryData(["user"], data.user);
        setUser(data.user);
        setAvatarPreview(data.user.avatarUrl || null);
      } else {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }

      if (data.message) {
        toast.success(data.message);
      } else {
        toast.success("Profile updated successfully!");
      }
      
      // Reset file input
      setSelectedFile(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    },
    onError: (err: any) => {
      console.error("Update mutation error:", err);
      toast.error(err.message || "Update failed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("Account deleted successfully");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    },
    onError: (err: any) => {
      toast.error(err.message || "Delete failed");
      console.error("Delete error:", err);
    },
  });

  // --- Forms ---
  const nameForm = useForm({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: "" },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("File selected:", file);
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleAvatarUpload = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile.name, selectedFile.size, selectedFile.type);
      updateMutation.mutate({ avatar: selectedFile });
    } else {
      toast.error("Please select an image first");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg text-red-600">Error loading settings</div>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ["user"] })}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold">Account Settings</h1>

     

      {/* --- 1. Avatar Section --- */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b pb-2">Profile Picture</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
            {avatarPreview ? (
              <Image 
                src={avatarPreview} 
                alt="Avatar" 
                fill 
                className="object-cover" 
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <span className="text-xs">No Image</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <p className="text-xs text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
            <button 
              type="button"
              onClick={handleAvatarUpload}
              disabled={updateMutation.isPending || !selectedFile}
              className="w-fit px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? "Uploading..." : "Upload New Photo"}
            </button>
          </div>
        </div>
      </section>

      {/* --- 2. Personal Information --- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Personal Information</h2>
        
        {/* Email (Read Only) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="text"
            value={fetchedUser?.email || "No email found"}
            disabled
            className="w-full p-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          {!fetchedUser?.email && (
            <p className="text-xs text-red-600">Email not found in database. Check your Prisma schema and data.</p>
          )}
        </div>

        {/* Name Form */}
        <form
          onSubmit={nameForm.handleSubmit((data) => {
            console.log("Submitting name update:", data);
            updateMutation.mutate({ name: data.name });
          })}
          className="space-y-2"
        >
          <label className="text-sm font-medium text-gray-700">Display Name</label>
          <div className="flex gap-2">
            <input
              {...nameForm.register("name")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Your name"
            />
            <button
              type="submit"
              disabled={updateMutation.isPending || !nameForm.formState.isDirty}
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {updateMutation.isPending ? "Saving..." : "Save Name"}
            </button>
          </div>
          {nameForm.formState.errors.name && (
            <p className="text-red-500 text-sm">{nameForm.formState.errors.name.message}</p>
          )}
        </form>
      </section>

      {/* --- 3. Security (Password) --- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Security</h2>
        <div className="flex items-center justify-between p-4 border rounded bg-gray-50">
          <div>
            <p className="font-medium text-gray-900">Password</p>
            <p className="text-sm text-gray-500">
              Receive a link via email to reset your password.
            </p>
          </div>
          <button
            onClick={() => updateMutation.mutate({ resetPassword: true })}
            disabled={updateMutation.isPending}
            className="px-4 py-2 border border-gray-300 bg-white rounded hover:bg-gray-50 text-sm font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? "Sending..." : "Reset Password"}
          </button>
        </div>
      </section>

      {/* --- 4. Danger Zone --- */}
      <section className="pt-6">
        <div className="border border-red-200 rounded p-4 bg-red-50 flex items-center justify-between">
          <div>
            <p className="font-medium text-red-900">Delete Account</p>
            <p className="text-sm text-red-700">
              Permanently delete your account and all data.
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </section>
    </div>
  );
}