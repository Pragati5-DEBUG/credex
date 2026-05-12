/** Shipped product name (credex.pdf allows custom naming). */
export const PRODUCT_NAME = "AiTookMySalary";

/** Credex as infrastructure-credits vendor — use in high-savings promo copy per brief. */
export const CREDIT_VENDOR_NAME = "Credex";

/** Default Credex site when `NEXT_PUBLIC_CREDEX_CONSULT_URL` is unset — https://www.credex.rocks/ */
export const CREDEX_CONSULTATION_URL_DEFAULT = "https://www.credex.rocks/";

/**
 * Credex site / consult entry (override with `NEXT_PUBLIC_CREDEX_CONSULT_URL` if needed).
 */
export const CREDEX_CONSULTATION_URL =
  process.env.NEXT_PUBLIC_CREDEX_CONSULT_URL?.trim() || CREDEX_CONSULTATION_URL_DEFAULT;
