import { readFileSync, writeFileSync } from 'node:fs';
import type { Contact, GuessOutcome } from './types.js';

/** Minimal RFC-4180-ish CSV parser (handles quoted fields and commas). */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      field = '';
      row = [];
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const nonEmpty = rows.filter((r) => r.some((cell) => cell.trim() !== ''));
  if (nonEmpty.length === 0) return [];

  const header = nonEmpty[0].map((h) => h.trim());
  return nonEmpty.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, idx) => {
      obj[h] = (r[idx] ?? '').trim();
    });
    return obj;
  });
}

function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function toCsv(headers: string[], rows: string[][]): string {
  const lines = [headers.map(csvCell).join(',')];
  for (const r of rows) lines.push(r.map(csvCell).join(','));
  return lines.join('\n') + '\n';
}

/** Read contacts.csv -> Contact[]. Expects columns: company, first_name, last_name, domain. */
export function readContacts(path: string): Contact[] {
  const text = readFileSync(path, 'utf8');
  const records = parseCsv(text);
  return records
    .map((r) => ({
      company: r.company ?? '',
      first_name: r.first_name ?? '',
      last_name: r.last_name ?? '',
      domain: r.domain ?? '',
    }))
    .filter((c) => c.first_name && c.last_name && c.domain);
}

export function writeContacts(path: string, contacts: Contact[]): void {
  const rows = contacts.map((c) => [c.company, c.first_name, c.last_name, c.domain]);
  writeFileSync(path, toCsv(['company', 'first_name', 'last_name', 'domain'], rows), 'utf8');
}

export function writeResultsCsv(path: string, outcomes: GuessOutcome[]): void {
  const rows = outcomes.map((o) => [
    o.company,
    o.first_name,
    o.last_name,
    o.domain,
    o.found ? 'yes' : 'no',
    o.email ?? '',
    o.provider ?? '',
    String(o.attempts),
  ]);
  const headers = [
    'company',
    'first_name',
    'last_name',
    'domain',
    'found',
    'email',
    'provider',
    'attempts',
  ];
  writeFileSync(path, toCsv(headers, rows), 'utf8');
}
