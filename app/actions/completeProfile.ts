"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function completeProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const firstName   = (formData.get("firstName")   as string | null)?.trim() ?? "";
  const lastName    = (formData.get("lastName")     as string | null)?.trim() ?? "";
  const dateOfBirth = (formData.get("dateOfBirth")  as string | null)?.trim() ?? "";
  const country     = (formData.get("country")      as string | null)?.trim() ?? "";
  const zipCode     = (formData.get("zipCode")      as string | null)?.trim() ?? "";

  await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      name:        [firstName, lastName].filter(Boolean).join(" ") || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      country:     country     || null,
      zipCode:     country === "US" ? (zipCode || null) : null,
    },
    create: {
      clerkId:     userId,
      email:       "",
      name:        [firstName, lastName].filter(Boolean).join(" ") || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      country:     country     || null,
      zipCode:     country === "US" ? (zipCode || null) : null,
    },
  });

  redirect("/search");
}
