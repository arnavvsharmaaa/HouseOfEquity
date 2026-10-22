import { z } from "zod";

// One schema for the lead forms, used in the browser (instant feedback) and in /api/lead
// (the source of truth). Messages are written for the visitor, not the developer.

export const goalOptions = [
  { value: "equity", label: "Access my home equity" },
  { value: "debt", label: "Consolidate debt" },
  { value: "renovation", label: "Home improvements" },
  { value: "buy", label: "Buy a home" },
  { value: "refinance", label: "Refinance my mortgage" },
  { value: "other", label: "Something else" },
] as const;

export const goalValues = goalOptions.map((g) => g.value) as [
  (typeof goalOptions)[number]["value"],
  ...(typeof goalOptions)[number]["value"][],
];

export const formTypes = ["contact", "get_started", "rate_match"] as const;

export const UPLOAD_MAX_BYTES = 10 * 1024 * 1024;
export const UPLOAD_TYPES = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/heic": "HEIC",
  "image/heif": "HEIF",
  "image/webp": "WEBP",
} as const;
export const UPLOAD_ACCEPT = ".pdf,.jpg,.jpeg,.png,.heic,.heif,.webp,application/pdf,image/*";

/** Keeps digits only; drops a leading US country code. */
export function normalizePhone(input: string) {
  const digits = input.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

const utm = z.string().trim().max(200).optional();

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Please shorten your name to 100 characters."),
  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .refine((d) => d.length === 10, "Please enter a 10-digit US phone number."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address, like name@example.com."),
  goal: z.enum(goalValues, { message: "Please choose what you'd like to do." }),
  message: z.string().trim().max(2000, "Please keep your message under 2,000 characters.").optional().default(""),
  consent: z.literal(true, { message: "Please check the box so Mohamad can call or text you." }),
  formType: z.enum(formTypes),
  source: z.string().trim().max(200).default("/"),
  utm_source: utm,
  utm_medium: utm,
  utm_campaign: utm,
  utm_term: utm,
  utm_content: utm,
});

export type Lead = z.infer<typeof leadSchema>;
export type LeadField = keyof Lead | "file";

/** Flattens zod issues into { field: firstMessage }. */
export function fieldErrors(error: z.ZodError): Partial<Record<LeadField, string>> {
  const out: Partial<Record<LeadField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as LeadField;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** Client and server share this check; the server also sniffs the file's first bytes. */
export function checkUpload(file: { size: number; type: string } | null | undefined): string | null {
  if (!file || file.size === 0) return null;
  if (!(file.type in UPLOAD_TYPES)) return "Please upload a PDF or a photo (JPG, PNG, HEIC or WEBP).";
  if (file.size > UPLOAD_MAX_BYTES) return "That file is larger than 10 MB. Please upload a smaller file or a photo of each page.";
  return null;
}
