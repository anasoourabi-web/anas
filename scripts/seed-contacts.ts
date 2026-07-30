import type { Contact } from '../src/types.js';

/**
 * Seed data parsed from the pasted list of Luxembourgish construction firms
 * and their leadership. One row per person.
 *
 * ⚠️  The `domain` values are BEST-GUESS .lu domains derived from each company
 * name. REVIEW AND CORRECT THEM before spending verification credits — a wrong
 * domain guarantees a failed lookup no matter how good the name permutation is.
 */
export const SEED_CONTACTS: Contact[] = [
  // 1 — CDCL (Compagnie de Construction Luxembourgeoise)
  { company: 'CDCL', first_name: 'Max', last_name: 'Didier', domain: 'cdcl.lu' },
  { company: 'CDCL', first_name: 'Daniel', last_name: 'Kling', domain: 'cdcl.lu' },
  { company: 'CDCL', first_name: 'Jean-Marc', last_name: 'Kieffer', domain: 'cdcl.lu' },

  // 2 — Karp-Kneip
  { company: 'Karp-Kneip', first_name: 'François', last_name: 'Thiry', domain: 'karp-kneip.lu' },
  { company: 'Karp-Kneip', first_name: 'Christophe', last_name: 'Thiry', domain: 'karp-kneip.lu' },

  // 3 — Félix Giorgetti
  { company: 'Félix Giorgetti', first_name: 'Paul', last_name: 'Giorgetti', domain: 'giorgetti.lu' },
  { company: 'Félix Giorgetti', first_name: 'Marc', last_name: 'Giorgetti', domain: 'giorgetti.lu' },

  // 4 — Tralux Construction
  { company: 'Tralux Construction', first_name: 'Michaël', last_name: 'Repplinger', domain: 'tralux.lu' },

  // 5 — CLE (Compagnie Luxembourgeoise d'Entreprises)
  { company: 'CLE', first_name: 'Christophe', last_name: 'Herrmann', domain: 'cle.lu' },

  // 6 — Soludec
  { company: 'Soludec', first_name: 'Jacques', last_name: 'Brauch', domain: 'soludec.lu' },

  // 7 — Entreprise Poeckes
  { company: 'Entreprise Poeckes', first_name: 'Paul', last_name: 'Nathan', domain: 'poeckes.lu' },

  // 8 — Prefalux Construction
  { company: 'Prefalux Construction', first_name: 'Christian', last_name: 'Nilles', domain: 'prefalux.lu' },

  // 9 — Entrapaulus Construction
  { company: 'Entrapaulus Construction', first_name: 'Louis', last_name: 'Wagner', domain: 'entrapaulus.lu' },

  // 10 — Groupe Sopinor
  { company: 'Groupe Sopinor', first_name: 'Orlando', last_name: 'Pinto', domain: 'sopinor.lu' },

  // 11 — Baatz Constructions
  { company: 'Baatz Constructions', first_name: 'Laurent', last_name: 'Baatz', domain: 'baatz.lu' },
  { company: 'Baatz Constructions', first_name: 'Paul', last_name: 'Baatz', domain: 'baatz.lu' },

  // 12 — Kuhn Construction
  { company: 'Kuhn Construction', first_name: 'Roland', last_name: 'Kuhn', domain: 'kuhn.lu' },

  // 13 — Thomas & Piron Bau
  { company: 'Thomas & Piron Bau', first_name: 'Olivier', last_name: 'Vanderdeelen', domain: 'thomas-piron.lu' },

  // 14 — Wickler Frères
  { company: 'Wickler Frères', first_name: 'André', last_name: 'Weiler', domain: 'wickler.lu' },

  // 15 — Perrard
  { company: 'Perrard', first_name: 'Alain', last_name: 'Pütz', domain: 'perrard.lu' },

  // 16 — CBL
  { company: 'CBL', first_name: 'Eric', last_name: 'Doff-Sotta', domain: 'cbl.lu' },
  { company: 'CBL', first_name: 'Georgios', last_name: 'Karageorgos', domain: 'cbl.lu' },

  // 17 — Contern (Chaux de Contern)
  { company: 'Contern', first_name: 'Eric', last_name: 'Kluckers', domain: 'contern.lu' },
  { company: 'Contern', first_name: 'Robert', last_name: 'Dennewald', domain: 'contern.lu' },
];
