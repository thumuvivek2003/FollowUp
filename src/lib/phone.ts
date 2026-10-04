/** Country code assumed for local numbers typed without one (India). */
const DEFAULT_COUNTRY_CODE = '91';
const LOCAL_LENGTH = 10;

const digitsOnly = (value: string) => value.replace(/\D/g, '');

/**
 * Normalises any user-typed number to international digits without "+".
 *   "98765 43210"     -> "919876543210"
 *   "098765 43210"    -> "919876543210"
 *   "+1 415 555 0100" -> "14155550100"
 */
export function toInternational(phone: string): string {
  const digits = digitsOnly(phone);
  if (phone.trim().startsWith('+')) return digits;
  if (digits.length === LOCAL_LENGTH) return DEFAULT_COUNTRY_CODE + digits;
  if (digits.length === LOCAL_LENGTH + 1 && digits.startsWith('0')) {
    return DEFAULT_COUNTRY_CODE + digits.slice(1);
  }
  return digits;
}

export function isValidPhone(phone: string): boolean {
  const length = digitsOnly(phone).length;
  return length >= 7 && length <= 15;
}

/** Pretty display: "+91 98765 43210" for Indian numbers, raw input otherwise. */
export function formatPhone(phone: string): string {
  const intl = toInternational(phone);
  if (intl.length === 12 && intl.startsWith(DEFAULT_COUNTRY_CODE)) {
    const local = intl.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return phone.trim();
}

export const contactLinks = (phone: string) => {
  const intl = toInternational(phone);
  return {
    call: `tel:+${intl}`,
    sms: `sms:+${intl}`,
    whatsapp: `https://wa.me/${intl}`,
  };
};
