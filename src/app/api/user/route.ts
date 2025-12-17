import { NextResponse } from "next/server";
import prisma from "@/app/core/lib/prisma";
import { getAuthenticatedUser, createServerSupabase } from "@/app/core/lib/supabase/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const updateNameSchema = z.string().min(1).max(100);

const validateImage = (file: File) => {
  const MAX_SIZE = 5 * 1024 * 1024; 
  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (file.size > MAX_SIZE) return "File size must be less than 5MB";
  if (!ACCEPTED_TYPES.includes(file.type)) return "Only .jpg, .jpeg, .png and .webp formats are supported";
  return null;
};

// GET - Fetch user profile
export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    console.log("Fetching user with supabaseId:", authUser.id);

    const user = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
      select: { 
        email: true, 
        name: true, 
        avatarUrl: true 
      },
    });

    console.log("Found user:", user);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update user profile
export async function PATCH(request: Request) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      console.error("No authenticated user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Authenticated user:", authUser.id);

    const formData = await request.formData();
    const name = formData.get("name") as string | null;
    const avatarFile = formData.get("avatar") as File | null;
    const removeAvatar = formData.get("removeAvatar") === "true";
    const requestPasswordReset = formData.get("resetPassword") === "true";

    console.log("Form data received:", { 
      name, 
      hasAvatar: !!avatarFile, 
      avatarName: avatarFile?.name,
      avatarSize: avatarFile?.size,
      avatarType: avatarFile?.type,
      removeAvatar,
      requestPasswordReset 
    });

    const supabase = await createServerSupabase();

    // Handle password reset
    if (requestPasswordReset) {
      const { error } = await supabase.auth.resetPasswordForEmail(authUser.email!, {
        redirectTo: `${new URL(request.url).origin}/account/reset-password`,
      });
      if (error) {
        console.error("Password reset error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      // If only password reset was requested, return early
      if (!name && !avatarFile && !removeAvatar) {
        return NextResponse.json({ success: true, message: "Password reset email sent." });
      }
    }

    const dataToUpdate: Prisma.UserUncheckedUpdateInput = {};

    // Validate and update name
    if (name) {
      const validation = updateNameSchema.safeParse(name);
      if (!validation.success) {
        console.error("Name validation failed:", validation.error);
        return NextResponse.json({ error: "Invalid name" }, { status: 400 });
      }
      dataToUpdate.name = name;
      console.log("Name will be updated to:", name);
    }

    // Handle avatar removal
    if (removeAvatar) {
      console.log("Removing avatar...");
      
      // Get current user to find existing avatar
      const currentUser = await prisma.user.findUnique({
        where: { supabaseId: authUser.id },
        select: { avatarUrl: true },
      });

      // Delete old avatar from storage if it exists
      if (currentUser?.avatarUrl) {
        try {
          // Extract file path from URL
          const url = new URL(currentUser.avatarUrl);
          const pathParts = url.pathname.split('/avatars/');
          if (pathParts.length > 1) {
            const filePath = pathParts[1];
            console.log("Deleting old avatar:", filePath);
            await supabase.storage.from("avatars").remove([filePath]);
          }
        } catch (err) {
          console.warn("Could not delete old avatar from storage:", err);
          // Continue anyway - we'll still remove the URL from database
        }
      }

      dataToUpdate.avatarUrl = null;
      console.log("Avatar will be removed");
    }
    // Handle avatar upload
    else if (avatarFile && avatarFile.size > 0) {
      console.log("Processing avatar file...");
      const fileError = validateImage(avatarFile);
      if (fileError) {
        console.error("Avatar validation failed:", fileError);
        return NextResponse.json({ error: fileError }, { status: 400 });
      }

      try {
        // Get current user to find existing avatar
        const currentUser = await prisma.user.findUnique({
          where: { supabaseId: authUser.id },
          select: { avatarUrl: true },
        });

        // Delete old avatar from storage if it exists
        if (currentUser?.avatarUrl) {
          try {
            const url = new URL(currentUser.avatarUrl);
            const pathParts = url.pathname.split('/avatars/');
            if (pathParts.length > 1) {
              const filePath = pathParts[1];
              console.log("Deleting old avatar:", filePath);
              await supabase.storage.from("avatars").remove([filePath]);
            }
          } catch (err) {
            console.warn("Could not delete old avatar from storage:", err);
          }
        }

        const fileName = `${authUser.id}/${Date.now()}-${avatarFile.name}`;
        console.log("Uploading to:", fileName);
        
        // Supabase can accept File object directly in Next.js API routes
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, { 
            contentType: avatarFile.type,
            upsert: true 
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        console.log("Upload successful:", uploadData);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);
        
        console.log("Public URL:", publicUrl);
        dataToUpdate.avatarUrl = publicUrl;
      } catch (uploadErr) {
        console.error("File processing error:", uploadErr);
        return NextResponse.json({ error: "Failed to process avatar file" }, { status: 500 });
      }
    }

    // Update user in database if there are changes
    if (Object.keys(dataToUpdate).length > 0) {
      console.log("Updating user with data:", dataToUpdate);
      const updatedUser = await prisma.user.update({
        where: { supabaseId: authUser.id },
        data: dataToUpdate,
        select: { email: true, name: true, avatarUrl: true },
      });
      console.log("User updated successfully:", updatedUser);
      return NextResponse.json({ success: true, user: updatedUser });
    }

    console.log("No updates needed, password reset only");
    return NextResponse.json({ success: true, message: "Password reset email sent." });
  } catch (error) {
    console.error("PATCH /api/user error:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

// DELETE - Delete user account
export async function DELETE() {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    console.log("Deleting user:", authUser.id);

    // 1. Delete user from Prisma database
    try {
      await prisma.user.delete({ 
        where: { supabaseId: authUser.id } 
      });
      console.log("User deleted from Prisma");
    } catch (dbError) {
      console.log("User might already be deleted from Prisma:", dbError);
    }

    // 2. Create an ADMIN Supabase client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, 
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 3. Delete user from Supabase Auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(authUser.id);
    
    if (error) {
      console.error("Supabase Auth Delete Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("User deleted from Supabase Auth");

    // 4. Sign out the user session
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}