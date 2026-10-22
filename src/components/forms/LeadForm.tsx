"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CircleAlert, CircleCheck, FileText, LoaderCircle, Upload, X } from "lucide-react";
import { buttonClass, cx } from "@/components/ui/primitives";
import { track, type FinancingGoal } from "@/lib/analytics";
import {
  UPLOAD_ACCEPT,
  checkUpload,
  fieldErrors,
  goalOptions,
  leadSchema,
  type LeadField,
} from "@/lib/lead-schema";
import { site } from "@/lib/site";
import { readUtm } from "@/lib/utm";

type FormType = "contact" | "get_started" | "rate_match";
type Errors = Partial<Record<LeadField | "form", string>>;

const fieldOrder: Array<LeadField> = ["name", "phone", "email", "goal", "file", "message", "consent"];

const inputClass =
  "mt-1 block min-h-12 w-full rounded-[12px] border border-field bg-white px-4 text-[19px] text-ink aria-[invalid=true]:border-error aria-[invalid=true]:border-2";

function Field({
  id,
  label,
  optional,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[17px] font-medium text-ink">
        {label}
        {optional && <span className="font-normal text-body"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-[15px] text-body">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 flex items-start gap-1.5 text-[16px] font-medium text-error">
          <CircleAlert aria-hidden className="mt-0.5 size-[18px] shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const formatBytes = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export function LeadForm({
  formType,
  defaultGoal = "equity",
  allowUpload = false,
  submitLabel = "Send My Request",
}: {
  formType: FormType;
  defaultGoal?: FinancingGoal;
  allowUpload?: boolean;
  submitLabel?: string;
}) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const pathname = usePathname();
  const [goal, setGoal] = useState<string>(defaultGoal);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [firstName, setFirstName] = useState("");
  // Bumped on every failed submit; focusing happens after React has rendered the summary.
  const [errorFocusTick, setErrorFocusTick] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setGoal(defaultGoal), [defaultGoal]);
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);
  useEffect(() => {
    if (errorFocusTick) summaryRef.current?.focus();
  }, [errorFocusTick]);

  const describedBy = (name: LeadField, hint = false) =>
    [hint && id(`${name}-hint`), errors[name] && id(`${name}-error`)].filter(Boolean).join(" ") || undefined;

  function showErrors(next: Errors) {
    setErrors(next);
    // Move focus to the summary so screen-reader and keyboard users hear what to fix.
    setErrorFocusTick((t) => t + 1);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;
    const data = new FormData(form);

    // Same rules as the server, checked here for instant feedback.
    const parsed = leadSchema.safeParse({
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      goal: data.get("goal"),
      message: data.get("message") ?? "",
      consent: data.get("consent") === "on",
      formType,
      source: pathname,
    });
    const next: Errors = parsed.success ? {} : fieldErrors(parsed.error);
    const fileProblem = allowUpload ? checkUpload(file) : null;
    if (fileProblem) next.file = fileProblem;
    if (Object.keys(next).length) return showErrors(next);

    data.delete("file");
    if (allowUpload && file) data.set("file", file);
    data.set("formType", formType);
    data.set("source", pathname);
    for (const [k, v] of Object.entries(readUtm())) if (v) data.set(k, v);

    setStatus("submitting");
    setErrors({});
    try {
      const res = await fetch("/api/lead", { method: "POST", body: data });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: Errors };
      if (!res.ok || !body.ok) {
        setStatus("idle");
        return showErrors(body.errors ?? { form: `Something went wrong. Please try again, or call ${site.phone.display}.` });
      }
      setFirstName(String(data.get("name") ?? "").trim().split(/\s+/)[0] ?? "");
      track("consultation_request_submit", { form: formType, goal: parsed.data!.goal });
      setStatus("success");
    } catch {
      setStatus("idle");
      showErrors({ form: `We couldn't reach the server. Please check your connection, or call ${site.phone.display}.` });
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-card border border-line bg-white p-6 sm:p-8">
        <CircleCheck aria-hidden className="size-10 text-success" />
        <h2 ref={successRef} tabIndex={-1} className="mt-4 text-[28px] font-medium leading-tight text-ink">
          Thank you{firstName ? `, ${firstName}` : ""}. We received your request.
        </h2>
        <p className="mt-3 text-[19px] leading-[30px] text-body">
          {formType === "rate_match"
            ? "Mohamad will review your offer personally and get back to you with a straight answer."
            : "Mohamad will personally review it and reach out by phone or text to talk through your goal."}{" "}
          If you&apos;d rather talk now, call{" "}
          <a href={site.phone.href} className="font-medium text-navy underline underline-offset-2">
            {site.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  const errorList = fieldOrder.filter((f) => errors[f]);

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-busy={status === "submitting"}
      className="space-y-5 rounded-card border border-line bg-white p-5 sm:p-8"
      data-track-location={`form_${formType}`}
    >
      {(errorList.length > 0 || errors.form) && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-[14px] border-2 border-error bg-white p-4 text-[17px] text-ink"
        >
          <p className="flex items-center gap-2 font-semibold text-error">
            <CircleAlert aria-hidden className="size-5 shrink-0" />
            {errors.form ?? `Please fix ${errorList.length === 1 ? "this" : `these ${errorList.length}`} to continue:`}
          </p>
          {errorList.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-6">
              {errorList.map((f) => (
                <li key={f}>
                  <a
                    href={`#${id(f)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(id(f))?.focus();
                    }}
                    className="text-navy underline underline-offset-2"
                  >
                    {errors[f]}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id("name")} label="Your name" error={errors.name}>
          <input id={id("name")} name="name" type="text" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={describedBy("name")} className={inputClass} />
        </Field>
        <Field id={id("phone")} label="Phone" error={errors.phone}>
          <input id={id("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" required aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} className={inputClass} />
        </Field>
        <Field id={id("email")} label="Email" error={errors.email}>
          <input id={id("email")} name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={describedBy("email")} className={inputClass} />
        </Field>
        <Field id={id("goal")} label="What would you like to do?" error={errors.goal}>
          <select id={id("goal")} name="goal" value={goal} onChange={(e) => setGoal(e.target.value)} aria-invalid={!!errors.goal} aria-describedby={describedBy("goal")} className={inputClass}>
            {goalOptions.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {allowUpload && (
        <Field id={id("file")} label="Your Loan Estimate" optional error={errors.file} hint="PDF or photo, up to 10 MB. You can also email it to us later.">
          {file ? (
            <div className={cx("mt-1 flex items-center justify-between gap-3 rounded-[12px] border bg-panel p-3", errors.file ? "border-2 border-error" : "border-field")}>
              <span className="flex min-w-0 items-center gap-2 text-[17px] text-ink">
                <FileText aria-hidden className="size-5 shrink-0 text-navy" />
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-body">({formatBytes(file.size)})</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setErrors((e) => ({ ...e, file: undefined }));
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="flex min-h-11 shrink-0 items-center gap-1 rounded-full px-3 text-[16px] font-medium text-navy hover:bg-white"
              >
                <X aria-hidden className="size-4" />
                Remove<span className="sr-only"> {file.name}</span>
              </button>
            </div>
          ) : null}
          <label
            htmlFor={id("file")}
            className={cx(
              "mt-1 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-field bg-panel px-4 py-3 text-[17px] font-medium text-ink transition-colors hover:border-navy has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy",
              file && "sr-only",
            )}
          >
            <Upload aria-hidden className="size-5 text-navy" />
            Choose a file
            <input
              ref={fileInputRef}
              id={id("file")}
              name="file"
              type="file"
              accept={UPLOAD_ACCEPT}
              aria-invalid={!!errors.file}
              aria-describedby={describedBy("file", true)}
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                setErrors((prev) => ({ ...prev, file: checkUpload(f) ?? undefined }));
              }}
            />
          </label>
        </Field>
      )}

      <Field id={id("message")} label="Anything you'd like Mohamad to know?" optional error={errors.message}>
        <textarea id={id("message")} name="message" rows={3} maxLength={2000} aria-invalid={!!errors.message} aria-describedby={describedBy("message")} className={cx(inputClass, "py-3")} />
      </Field>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill every field. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("company")}>Company</label>
        <input id={id("company")} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id={id("consent")}
            name="consent"
            type="checkbox"
            aria-invalid={!!errors.consent}
            aria-describedby={describedBy("consent")}
            className="mt-1 size-6 shrink-0 cursor-pointer rounded-[6px] accent-ink"
          />
          <label htmlFor={id("consent")} className="cursor-pointer text-[16px] leading-relaxed text-body">
            I agree that Mohamad Fardous of House of Equity may call or text me at the number above
            about my request, including by automated means. Consent is not a condition of any loan.
            Message and data rates may apply. Reply STOP to opt out.
          </label>
        </div>
        {errors.consent && (
          <p id={id("consent-error")} className="mt-1 flex items-start gap-1.5 pl-9 text-[16px] font-medium text-error">
            <CircleAlert aria-hidden className="mt-0.5 size-[18px] shrink-0" />
            {errors.consent}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={status === "submitting"} className={buttonClass("primary", "disabled:cursor-progress disabled:opacity-80")}>
          {status === "submitting" ? (
            <>
              <LoaderCircle aria-hidden className="size-5 motion-safe:animate-spin" />
              Sending…
            </>
          ) : (
            submitLabel
          )}
        </button>
        <p className="text-[15px] text-body">
          Prefer to talk?{" "}
          <a href={site.phone.href} className="font-medium text-navy underline underline-offset-2">
            Call {site.phone.display}
          </a>
        </p>
      </div>
    </form>
  );
}
