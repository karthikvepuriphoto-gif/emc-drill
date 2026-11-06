import type { TopicId } from "./types";

export type TopicMeta = {
  id: TopicId;
  code: string;
  title: string;
  family: string;
  blurb: string;
};

export const TOPICS: TopicMeta[] = [
  {
    id: "re",
    code: "RE",
    title: "Radiated emissions",
    family: "CISPR 16 · CISPR 32 · ANSI C63.4",
    blurb:
      "Chamber setup, detectors, distance, and the limit shapes labs actually compare against.",
  },
  {
    id: "ce",
    code: "CE",
    title: "Conducted emissions",
    family: "CISPR 16 · LISN / AMN · mains ports",
    blurb:
      "Mains-terminal voltage from 150 kHz to 30 MHz: network, detectors, and the usual ways a scan goes wrong.",
  },
  {
    id: "esd",
    code: "ESD",
    title: "ESD immunity",
    family: "IEC 61000-4-2",
    blurb:
      "Contact and air discharge, coupling planes, and what a transient pass actually allows.",
  },
  {
    id: "ri",
    code: "RI",
    title: "Radiated immunity",
    family: "IEC 61000-4-3 · EN 301 489-1",
    blurb:
      "Field uniformity, modulation, dwell, and the radio exclusion band around the carrier.",
  },
  {
    id: "fcc",
    code: "FCC",
    title: "FCC Part 15 (A and B)",
    family: "47 CFR Part 15 Subparts A and B",
    blurb:
      "Unintentional radiators: classes, limits, authorization, exemptions, and the measurement rules.",
  },
  {
    id: "ices",
    code: "ICES",
    title: "ICES-002 and ICES-003",
    family: "ISED ICES-003 issue 7 · ICES-002 issue 7",
    blurb:
      "Canadian ITE and vehicle rules: one limit set, two methods, and who stays responsible after a modification.",
  },
  {
    id: "red",
    code: "RED",
    title: "RED, EMCD, and DoC",
    family: "2014/53/EU · EN 301 489-1 · REDCA TGN 01",
    blurb:
      "Essential requirements, modules, the declaration, and why a certified module is not a certified product.",
  },
];

export function topicById(id: string): TopicMeta | undefined {
  return TOPICS.find((t) => t.id === id);
}

export const AREA_LABELS: Record<string, string> = {
  distance: "Measurement distance",
  detector: "Detectors",
  antenna: "Antennas and polarization",
  site: "Sites and validation",
  arrangement: "EUT arrangement",
  limits: "Limit values",
  fails: "Common fails",
  "frequency-range": "Frequency range",
  lisn: "LISN / AMN",
  ports: "Ports",
  method: "Test method",
  levels: "Test levels",
  setup: "Setup",
  waveform: "Waveform",
  criteria: "Pass / fail criteria",
  modulation: "Modulation and dwell",
  uniformity: "Field uniformity",
  exclusion: "Exclusion bands",
  definitions: "Definitions",
  "radiated-limits": "Radiated limits",
  "conducted-limits": "Conducted limits",
  authorization: "Authorization and labels",
  exemptions: "Exemptions",
  measurement: "Measurement rules",
  scope: "Scope",
  methods: "Test methods",
  admin: "Labels and admin",
  vehicles: "Vehicles and charging",
  operators: "Economic operators",
  conformity: "Conformity modules",
  "emc-standard": "EN 301 489-1",
  doc: "DoC and technical file",
  modules: "Radio modules",
};

export function areaLabel(area: string): string {
  return AREA_LABELS[area] ?? area;
}
