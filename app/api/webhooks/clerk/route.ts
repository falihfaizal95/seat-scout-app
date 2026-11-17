import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { prisma } from "@/lib/prisma";

// Clerk webhook handler — syncs users to our DB.
// Every request must carry a valid Svix signature from Clerk; anything else is rejected.
export async function POST(req: NextRequest) {
  const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET || process.env.CLERK_WEBHOOK_SECRET;
  if (!signingSecret) {
    console.error("[Webhook] CLERK_WEBHOOK_SIGNING_SECRET is not set; refusing webhook");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  let payload;
  try {
    payload = await verifyWebhook(req, { signingSecret });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    if (payload.type === "user.created" || payload.type === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url, unsafe_metadata } = payload.data;
      const email = email_addresses?.[0]?.email_address;
      if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

      const meta = (unsafe_metadata ?? {}) as Record<string, unknown>;

      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email,
          name:        [first_name, last_name].filter(Boolean).join(" ") || null,
          imageUrl:    image_url || null,
          dateOfBirth: meta.dateOfBirth ? new Date(meta.dateOfBirth as string) : undefined,
          country:     (meta.country  as string) || undefined,
          zipCode:     (meta.zipCode  as string) || undefined,
        },
        create: {
          clerkId:     id,
          email,
          name:        [first_name, last_name].filter(Boolean).join(" ") || null,
          imageUrl:    image_url || null,
          dateOfBirth: meta.dateOfBirth ? new Date(meta.dateOfBirth as string) : null,
          country:     (meta.country  as string) || null,
          zipCode:     (meta.zipCode  as string) || null,
        },
      });
    }

    if (payload.type === "user.deleted" && payload.data.id) {
      await prisma.user.deleteMany({ where: { clerkId: payload.data.id } });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Webhook] Clerk webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
