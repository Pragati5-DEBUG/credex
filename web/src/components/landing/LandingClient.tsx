"use client";

import { LandingBodyMarkup } from "./LandingBodyMarkup";
import { useLandingEffects } from "./useLandingEffects";

export function LandingClient() {
  useLandingEffects();
  return <LandingBodyMarkup />;
}
