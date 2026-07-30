import type { Contact } from '../src/types.js';

/**
 * Seed data parsed from the pasted list of Luxembourgish construction firms
 * and their leadership. One row per person.
 *
 * Domains below were CORRECTED from live MX-record lookups (2026), so they are
 * the real mail domains, not raw guesses. Two are still uncertain and marked
 * TODO — confirm those before relying on them:
 *   - Félix Giorgetti: giorgetti.eu resolves (M365) but is unconfirmed
 *   - CBL: no domain could be MX-confirmed; left blank so it is skipped
 */
export const SEED_CONTACTS: Contact[] = [
  // 1 — CDCL (Compagnie de Construction Luxembourgeoise)  [M365]
  { company: 'CDCL', first_name: 'Max', last_name: 'Didier', domain: 'cdclux.lu' },
  { company: 'CDCL', first_name: 'Daniel', last_name: 'Kling', domain: 'cdclux.lu' },
  { company: 'CDCL', first_name: 'Jean-Marc', last_name: 'Kieffer', domain: 'cdclux.lu' },

  // 2 — Karp-Kneip  [own mail server]
  { company: 'Karp-Kneip', first_name: 'François', last_name: 'Thiry', domain: 'karpkneip.lu' },
  { company: 'Karp-Kneip', first_name: 'Christophe', last_name: 'Thiry', domain: 'karpkneip.lu' },

  // 3 — Félix Giorgetti  [M365 — TODO confirm domain]
  { company: 'Félix Giorgetti', first_name: 'Paul', last_name: 'Giorgetti', domain: 'giorgetti.eu' },
  { company: 'Félix Giorgetti', first_name: 'Marc', last_name: 'Giorgetti', domain: 'giorgetti.eu' },

  // 4 — Tralux Construction  [M365]
  { company: 'Tralux Construction', first_name: 'Michaël', last_name: 'Repplinger', domain: 'tralux.lu' },

  // 5 — CLE (Compagnie Luxembourgeoise d'Entreprises)  [M365]
  { company: 'CLE', first_name: 'Christophe', last_name: 'Herrmann', domain: 'cle.lu' },

  // 6 — Soludec  [M365]
  { company: 'Soludec', first_name: 'Jacques', last_name: 'Brauch', domain: 'soludec.lu' },

  // 7 — Entreprise Poeckes  [cel.lu]
  { company: 'Entreprise Poeckes', first_name: 'Paul', last_name: 'Nathan', domain: 'poeckes.lu' },

  // 8 — Prefalux Construction  [Cloudbizz]
  { company: 'Prefalux Construction', first_name: 'Christian', last_name: 'Nilles', domain: 'prefalux.lu' },

  // 9 — Entrapaulus Construction  [M365]
  { company: 'Entrapaulus Construction', first_name: 'Louis', last_name: 'Wagner', domain: 'entrapaulus.lu' },

  // 10 — Groupe Sopinor  [M365]
  { company: 'Groupe Sopinor', first_name: 'Orlando', last_name: 'Pinto', domain: 'sopinor.lu' },

  // 11 — Baatz Constructions  [own mail server]
  { company: 'Baatz Constructions', first_name: 'Laurent', last_name: 'Baatz', domain: 'baatz.lu' },
  { company: 'Baatz Constructions', first_name: 'Paul', last_name: 'Baatz', domain: 'baatz.lu' },

  // 12 — Kuhn Construction  [M365]
  { company: 'Kuhn Construction', first_name: 'Roland', last_name: 'Kuhn', domain: 'kuhn.lu' },

  // 13 — Thomas & Piron Bau  [M365]
  { company: 'Thomas & Piron Bau', first_name: 'Olivier', last_name: 'Vanderdeelen', domain: 'thomas-piron.lu' },

  // 14 — Wickler Frères  [dclux/xion — dedicated MX on wickler-freres.lu]
  { company: 'Wickler Frères', first_name: 'André', last_name: 'Weiler', domain: 'wickler-freres.lu' },

  // 15 — Perrard  [vo.lu]
  { company: 'Perrard', first_name: 'Alain', last_name: 'Pütz', domain: 'perrard.lu' },

  // 16 — CBL  [TODO: no domain MX-confirmed — left blank so this row is skipped]
  { company: 'CBL', first_name: 'Eric', last_name: 'Doff-Sotta', domain: '' },
  { company: 'CBL', first_name: 'Georgios', last_name: 'Karageorgos', domain: '' },

  // 17 — Contern (Chaux de Contern)  [M365]
  { company: 'Contern', first_name: 'Eric', last_name: 'Kluckers', domain: 'contern.lu' },
  { company: 'Contern', first_name: 'Robert', last_name: 'Dennewald', domain: 'contern.lu' },
];
