import { NextResponse } from "next/server";
import {
  getActualWalletAddress,
  getBalance,
  getCountries,
  getNumber,
  getNumberV2,
  getPrices,
  getPricesV2,
  getPricesV3,
  getServicesList,
  getStatus,
  getTopCountriesByService,
  setStatus,
  SmsBowerError
} from "@/lib/providers/smsbower";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const writeActions = new Set(["getNumber", "getNumberV2", "setStatus"]);
const privateActions = new Set(["getBalance", "getNumber", "getNumberV2", "getStatus", "setStatus", "getActualWalletAddress"]);

function requiredField(value: unknown, name: string) {
  const result = typeof value === "string" ? value.trim() : "";
  if (!result) throw new SmsBowerError(`Missing required field: ${name}`, 400);
  return result;
}

async function hasAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  return !error && Boolean(data.user);
}

async function readInput(request: Request) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  if (request.method === "POST") {
    try {
      const body = (await request.json()) as Record<string, unknown>;
      return { action: (body.action as string | undefined) ?? action, body };
    } catch {
      return { action, body: {} as Record<string, unknown> };
    }
  }

  return { action, body: Object.fromEntries(url.searchParams.entries()) as Record<string, string> };
}

export async function GET(request: Request) {
  return handleRequest(request);
}

export async function POST(request: Request) {
  return handleRequest(request);
}

async function handleRequest(request: Request) {
  const { action, body } = await readInput(request);

  if (!action) {
    return NextResponse.json({ ok: false, error: "Missing action" }, { status: 400 });
  }

  if (request.method === "GET" && writeActions.has(action)) {
    return NextResponse.json({ ok: false, error: "Use POST for this action." }, { status: 405 });
  }

  try {
    if (privateActions.has(action) && !(await hasAuthenticatedUser())) {
      return NextResponse.json({ ok: false, error: "Authentication is required for this action." }, { status: 401 });
    }

    switch (action) {
      case "getBalance":
        return NextResponse.json(await getBalance());
      case "getNumber":
        return NextResponse.json(
          await getNumber({
            service: requiredField(body.service, "service"),
            country: requiredField(body.country, "country"),
            maxPrice: body.maxPrice as string | number | undefined,
            providerIds: body.providerIds as string | undefined,
            exceptProviderIds: body.exceptProviderIds as string | undefined,
            phoneException: body.phoneException as string | undefined,
            ref: body.ref as string | undefined,
            userID: body.userID as string | undefined,
            minPrice: body.minPrice as string | number | undefined
          })
        );
      case "getNumberV2":
        return NextResponse.json(
          await getNumberV2({
            service: requiredField(body.service, "service"),
            country: requiredField(body.country, "country"),
            maxPrice: body.maxPrice as string | number | undefined,
            providerIds: body.providerIds as string | undefined,
            exceptProviderIds: body.exceptProviderIds as string | undefined,
            userID: body.userID as string | undefined,
            minPrice: body.minPrice as string | number | undefined
          })
        );
      case "getStatus":
        return NextResponse.json(await getStatus(requiredField(body.id, "id")));
      case "setStatus":
        if (!(["1", "3", "6", "8"] as string[]).includes(String(body.status ?? ""))) {
          return NextResponse.json({ ok: false, error: "Unsupported activation status." }, { status: 400 });
        }
        return NextResponse.json(
          await setStatus(requiredField(body.id, "id"), String(body.status) as "1" | "3" | "6" | "8")
        );
      case "getPrices":
        return NextResponse.json(
          await getPrices({
            service: body.service as string | undefined,
            country: body.country as string | undefined
          })
        );
      case "getPricesV2":
        return NextResponse.json(
          await getPricesV2({
            service: body.service as string | undefined,
            country: body.country as string | undefined
          })
        );
      case "getPricesV3":
        return NextResponse.json(
          await getPricesV3({
            service: body.service as string | undefined,
            country: body.country as string | undefined
          })
        );
      case "getServicesList":
        return NextResponse.json(await getServicesList());
      case "getCountries":
        return NextResponse.json(await getCountries());
      case "getTopCountriesByService":
        return NextResponse.json(await getTopCountriesByService(String(body.service ?? "")));
      case "getActualWalletAddress":
        return NextResponse.json(
          await getActualWalletAddress({
            coin: String(body.coin ?? "usdt") as "usdt" | "trx",
            network: String(body.network ?? "tron") as "tron"
          })
        );
      default:
        return NextResponse.json({ ok: false, error: `Unsupported action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown provider error";
    const safeMessage = message.includes("SMSBOWER_API_KEY")
      ? "Provider API key is not configured yet."
      : message;
    const providerError = error instanceof SmsBowerError ? error : undefined;
    const status = providerError?.status ?? 500;

    return NextResponse.json(
      {
        ok: false,
        error: safeMessage
      },
      { status }
    );
  }
}
