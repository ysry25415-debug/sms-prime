import { env, requireSmsBowerApiKey } from "@/lib/env";

export type SmsBowerTextResponse =
  | { ok: true; raw: string }
  | { ok: false; raw: string; error: string };

export type SmsBowerJsonResponse<T> = {
  ok: true;
  raw: string;
  data: T;
};

export type SmsBowerBalance = {
  balance: string;
};

export type SmsBowerNumber = {
  activationId: string;
  phoneNumber: string;
};

export type SmsBowerNumberV2 = {
  activationId: string | number;
  phoneNumber: string;
  activationCost?: number | string;
  countryCode?: string | number;
  canGetAnotherSms?: boolean | string;
  activationTime?: number | string;
  activationOperator?: string;
};

export type SmsBowerStatus = {
  status: string;
  code?: string;
};

export class SmsBowerError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly raw?: string
  ) {
    super(message);
    this.name = "SmsBowerError";
  }
}

function buildUrl(params: Record<string, string | number | undefined>) {
  const url = new URL(env.smsBowerBaseUrl);
  const apiKey = requireSmsBowerApiKey();
  url.searchParams.set("api_key", apiKey);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

function buildPaymentUrl(params: Record<string, string | number | undefined>) {
  const url = new URL("https://smsbower.page/api/payment/getActualWalletAddress");
  const apiKey = requireSmsBowerApiKey();
  url.searchParams.set("api_key", apiKey);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

function tryParseJson<T>(raw: string): T | undefined {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

async function requestText(params: Record<string, string | number | undefined>) {
  const response = await fetch(buildUrl(params), {
    method: "GET",
    headers: { Accept: "application/json, text/plain;q=0.9, */*;q=0.8" },
    cache: "no-store"
  });

  const raw = await response.text();

  if (!response.ok) {
    throw new SmsBowerError("SMSBower request failed", response.status, raw);
  }

  return raw.trim();
}

async function requestJson<T>(params: Record<string, string | number | undefined>) {
  const raw = await requestText(params);
  const data = tryParseJson<T>(raw);

  if (data === undefined) {
    throw new SmsBowerError("Expected JSON response from SMSBower", undefined, raw);
  }

  return { ok: true as const, raw, data };
}

export async function getBalance() {
  const raw = await requestText({ action: "getBalance" });

  if (!raw.startsWith("ACCESS_BALANCE:")) {
    throw new SmsBowerError("Unexpected balance response", undefined, raw);
  }

  return {
    ok: true as const,
    raw,
    data: { balance: raw.replace("ACCESS_BALANCE:", "").trim() }
  };
}

export async function getNumber(input: {
  service: string;
  country: string;
  maxPrice?: string | number;
  providerIds?: string;
  exceptProviderIds?: string;
  phoneException?: string;
  ref?: string;
  userID?: string;
  minPrice?: string | number;
}) {
  const raw = await requestText({ action: "getNumber", ...input });

  if (!raw.startsWith("ACCESS_NUMBER:")) {
    throw new SmsBowerError("Unexpected getNumber response", undefined, raw);
  }

  const [, activationId = "", phoneNumber = ""] = raw.split(":");

  return {
    ok: true as const,
    raw,
    data: { activationId, phoneNumber } satisfies SmsBowerNumber
  };
}

export async function getNumberV2(input: {
  service: string;
  country: string;
  maxPrice?: string | number;
  providerIds?: string;
  exceptProviderIds?: string;
  userID?: string;
  minPrice?: string | number;
}) {
  return requestJson<SmsBowerNumberV2>({ action: "getNumberV2", ...input });
}

export async function getStatus(id: string) {
  const raw = await requestText({ action: "getStatus", id });

  if (raw.startsWith("STATUS_OK:")) {
    return {
      ok: true as const,
      raw,
      data: {
        status: "STATUS_OK",
        code: raw.replace("STATUS_OK:", "").trim().replace(/^'|'$/g, "")
      }
    };
  }

  if (raw.includes(":")) {
    const [status, code] = raw.split(":", 2);
    return { ok: true as const, raw, data: { status, code } satisfies SmsBowerStatus };
  }

  return { ok: true as const, raw, data: { status: raw } satisfies SmsBowerStatus };
}

export async function setStatus(id: string, status: "1" | "3" | "6" | "8") {
  const raw = await requestText({ action: "setStatus", id, status });
  return { ok: true as const, raw, data: { result: raw } };
}

export async function getPrices(input: { service?: string; country?: string } = {}) {
  return requestJson<Record<string, unknown>>({ action: "getPrices", ...input });
}

export async function getPricesV2(input: { service?: string; country?: string } = {}) {
  return requestJson<Record<string, unknown>>({ action: "getPricesV2", ...input });
}

export async function getPricesV3(input: { service?: string; country?: string } = {}) {
  return requestJson<Record<string, unknown>>({ action: "getPricesV3", ...input });
}

export async function getServicesList() {
  return requestJson<{ status?: string; services?: Array<{ code: string; name: string }> }>({
    action: "getServicesList"
  });
}

export async function getCountries() {
  return requestJson<Record<string, { id?: number; rus?: string; eng?: string; chn?: string }>>({
    action: "getCountries"
  });
}

export async function getTopCountriesByService(service: string) {
  return requestJson<Record<string, Record<string, { price?: number; count?: number }>>>({
    action: "getTopCountriesByService",
    service
  });
}

export async function getActualWalletAddress(input: { coin: "usdt" | "trx"; network: "tron" }) {
  const response = await fetch(buildPaymentUrl({ coin: input.coin, network: input.network }), {
    method: "GET",
    headers: { Accept: "application/json, text/plain;q=0.9, */*;q=0.8" },
    cache: "no-store"
  });

  const raw = await response.text();

  if (!response.ok) {
    throw new SmsBowerError("SMSBower wallet request failed", response.status, raw);
  }

  const data = tryParseJson<{ wallet_address?: string }>(raw);

  if (!data) {
    throw new SmsBowerError("Expected JSON response from SMSBower wallet endpoint", undefined, raw);
  }

  return { ok: true as const, raw, data };
}
