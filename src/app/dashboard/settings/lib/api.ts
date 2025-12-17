import { User } from "../types";

export const updateUser = async (data: {
  name?: string;
  avatar?: File | null;
  resetPassword?: boolean;
}): Promise<{ user: User; message?: string }> => {
  const formData = new FormData();
  
  if (data.name) formData.append("name", data.name);
  
  // Handle avatar removal vs upload
  if (data.avatar === null) {
    formData.append("removeAvatar", "true");
  } else if (data.avatar) {
    formData.append("avatar", data.avatar);
  }
  
  if (data.resetPassword) formData.append("resetPassword", "true");

  const res = await fetch("/api/user", {
    method: "PATCH",
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || json.details || "Failed to update");
  }
  return json;
};

export const deleteUser = async (): Promise<{ message: string }> => {
  const res = await fetch("/api/user", { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to delete account");
  return json;
};