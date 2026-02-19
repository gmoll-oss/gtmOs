import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "gtm-region";

export function useRegion() {
  const [region, setRegionState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || "todas";
    }
    return "todas";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, region);
  }, [region]);

  const setRegion = useCallback((r: string) => {
    setRegionState(r);
  }, []);

  return { region, setRegion };
}
