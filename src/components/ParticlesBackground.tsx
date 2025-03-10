
import { useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const ParticlesBackground = () => {
  const { settings } = useSiteSettings();

  // Component no longer displays particles
  return null;
};
