import { AuditJsonArray, AuditJsonObject, AuditJsonValue } from './audit.types';

const REDACTED_VALUE = '[REDACTED]';
const SENSITIVE_KEYS = [
  'password',
  'senha',
  'token',
  'refreshToken',
  'authorization',
  'tokenHash',
  'token_hash',
];
const CPF_KEYS = ['cpf'];

function isSensitiveKey(key: string): boolean {
  const normalizedKey = key.toLowerCase();
  return SENSITIVE_KEYS.some((fragment) => normalizedKey.includes(fragment.toLowerCase()));
}

function isCpfKey(key: string): boolean {
  const normalizedKey = key.toLowerCase();
  return CPF_KEYS.some((fragment) => normalizedKey.includes(fragment));
}

function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return REDACTED_VALUE;
  }

  return `***.***.${digits.slice(-3, -1)}-${digits.slice(-2)}`;
}

function sanitizeObject(value: Record<string, unknown>): AuditJsonObject {
  const output: AuditJsonObject = {};

  for (const [key, currentValue] of Object.entries(value)) {
    if (typeof currentValue === 'undefined') {
      continue;
    }

    if (isSensitiveKey(key)) {
      output[key] = REDACTED_VALUE;
      continue;
    }

    if (isCpfKey(key) && typeof currentValue === 'string') {
      output[key] = maskCpf(currentValue);
      continue;
    }

    output[key] = sanitizeAuditValue(currentValue);
  }

  return output;
}

export function sanitizeAuditValue(value: unknown): AuditJsonValue {
  if (value === null) {
    return null;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeAuditValue(item)) as AuditJsonArray;
  }

  if (typeof value === 'object') {
    return sanitizeObject(value as Record<string, unknown>);
  }

  return String(value);
}
