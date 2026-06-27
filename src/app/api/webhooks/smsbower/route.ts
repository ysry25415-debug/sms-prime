import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor ?? request.headers.get("x-real-ip") ?? "";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const isDev = process.env.NODE_ENV !== "production";

  if (!isDev && ip && ip !== env.smsBowerWebhookIp) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const payload = (await request.json()) as {
    activationId?: number | string;
    service?: string;
    text?: string;
    code?: string;
    country?: number | string;
    receivedAt?: string;
  };

  try {
    await prisma.smsMessage.create({
      data: {
        activationId: payload.activationId ? String(payload.activationId) : null,
        service: payload.service ?? null,
        text: payload.text ?? null,
        code: payload.code ?? null,
        country: payload.country ? String(payload.country) : null,
        receivedAt: payload.receivedAt ? new Date(payload.receivedAt) : new Date(),
        status: "RECEIVED"
      }
    });
  } catch {
    // Database may not be ready yet. The webhook still needs a 200 response.
  }

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}
