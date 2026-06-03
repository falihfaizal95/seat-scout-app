import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { dob, country, zipCode } = await req.json() as {
    dob: string;
    country: string;
    zipCode?: string;
  };

  if (!dob || !country) {
    return NextResponse.json({ error: "dob and country are required" }, { status: 400 });
  }

  const client = await clerkClient();

  try {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        dob,
        country,
        zipCode: country === "US" ? (zipCode ?? null) : null,
      },
    });
  } catch (err) {
    console.error("Clerk metadata update failed:", err);
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }

  try {
    await prisma.user.upsert({
      where:  { clerkId: userId },
      update: {
        dateOfBirth: new Date(dob),
        country,
        zipCode: country === "US" ? (zipCode ?? null) : null,
      },
      create: {
        clerkId:     userId,
        email:       "",
        dateOfBirth: new Date(dob),
        country,
        zipCode: country === "US" ? (zipCode ?? null) : null,
      },
    });
  } catch (err) {
    console.error("Prisma upsert failed:", err);
  }

  return NextResponse.json({ success: true });
}
