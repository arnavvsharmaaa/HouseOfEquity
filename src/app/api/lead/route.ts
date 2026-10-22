import { NextResponse, type NextRequest } from "next/server";
import { checkUpload, fieldErrors, leadSchema, UPLOAD_MAX_BYTES } from "@/lib/lead-schema";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Hidden field real people never see or fill. Bots that fill it get a quiet "ok".
const HONEYPOT = "company";

// Magic numbers for the accepted upload types, so a renamed file can't slip through.
const SIGNATURES: Record<string, (b: Uint8Array) => boolean> = {
  "application/pdf": (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46, // %PDF
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  "image/webp": (b) => String.fromCharCode(...b.slice(8, 12)) === "WEBP",
  "image/heic": (b) => String.fromCharCode(...b.slice(4, 8)) === "ftyp",
  "image/heif": (b) => String.fromCharCode(...b.slice(4, 8)) === "ftyp",
};

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

const bad = (errors: Record<string, string>, status = 400) => NextResponse.json({ ok: false, errors }, { status });

export async function POST(req: NextRequest) {
  // Reject oversized bodies before parsing (10 MB file + form fields).
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > UPLOAD_MAX_BYTES + 512 * 1024) {
    return bad({ file: "That file is larger than 10 MB. Please upload a smaller file or a photo of each page." }, 413);
  }

  const limit = rateLimit(clientIp(req));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, errors: { form: "Too many requests. Please wait a few minutes or call 949-569-7945." } },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad({ form: "We couldn't read that submission. Please try again." });
  }

  // Honeypot: pretend success, forward nothing.
  if (String(form.get(HONEYPOT) ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = leadSchema.safeParse({
    name: form.get("name") ?? "",
    phone: form.get("phone") ?? "",
    email: form.get("email") ?? "",
    goal: form.get("goal") ?? "",
    message: form.get("message") ?? "",
    consent: form.get("consent") === "on" || form.get("consent") === "true",
    formType: form.get("formType") ?? "",
    source: form.get("source") ?? "/",
    utm_source: form.get("utm_source") ?? undefined,
    utm_medium: form.get("utm_medium") ?? undefined,
    utm_campaign: form.get("utm_campaign") ?? undefined,
    utm_term: form.get("utm_term") ?? undefined,
    utm_content: form.get("utm_content") ?? undefined,
  });

  const errors: Record<string, string> = parsed.success ? {} : (fieldErrors(parsed.error) as Record<string, string>);

  // Optional Loan Estimate (Rate Match only).
  const upload = form.get("file");
  let file: { name: string; type: string; size: number; base64: string } | null = null;
  if (upload instanceof File && upload.size > 0) {
    const problem = parsed.success && parsed.data.formType !== "rate_match" ? "File uploads are only accepted on Rate Match." : checkUpload(upload);
    if (problem) {
      errors.file = problem;
    } else {
      const bytes = new Uint8Array(await upload.arrayBuffer());
      if (!SIGNATURES[upload.type]?.(bytes)) {
        errors.file = "That file doesn't look like a PDF or photo. Please try another file.";
      } else {
        file = { name: upload.name.slice(0, 200), type: upload.type, size: upload.size, base64: Buffer.from(bytes).toString("base64") };
      }
    }
  }

  if (!parsed.success || Object.keys(errors).length) return bad(errors);

  const lead = { ...parsed.data, submittedAt: new Date().toISOString() };
  const webhook = process.env.STUDIO_ESCROW_WEBHOOK_URL;

  if (!webhook) {
    // Local development: log what would be sent (file contents omitted).
    console.info("[lead] STUDIO_ESCROW_WEBHOOK_URL not set; payload not forwarded:", {
      ...lead,
      file: file ? { name: file.name, type: file.type, size: file.size } : null,
    });
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, file }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("[lead] forwarding failed:", err instanceof Error ? err.message : err);
    return bad({ form: "Something went wrong on our side. Please try again, or call 949-569-7945." }, 502);
  }

  return NextResponse.json({ ok: true });
}
