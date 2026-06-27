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
  setStatus
} from "@/lib/providers/smsbower";

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

  try {
    switch (action) {
      case "getBalance":
        return NextResponse.json(await getBalance());
      case "getNumber":
        return NextResponse.json(
          await getNumber({
            service: String(body.service ?? ""),
            country: String(body.country ?? ""),
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
            service: String(body.service ?? ""),
            country: String(body.country ?? ""),
            maxPrice: body.maxPrice as string | number | undefined,
            providerIds: body.providerIds as string | undefined,
            exceptProviderIds: body.exceptProviderIds as string | undefined,
            userID: body.userID as string | undefined,
            minPrice: body.minPrice as string | number | undefined
          })
        );
      case "getStatus":
        return NextResponse.json(await getStatus(String(body.id ?? "")));
      case "setStatus":
        return NextResponse.json(
          await setStatus(String(body.id ?? ""), String(body.status ?? "") as "1" | "3" | "6" | "8")
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
    const raw = error instanceof Error && "raw" in error ? String((error as { raw?: string }).raw ?? "") : undefined;

    return NextResponse.json(
      {
        ok: false,
        error: safeMessage,
        raw
      },
      { status: 500 }
    );
  }
}
