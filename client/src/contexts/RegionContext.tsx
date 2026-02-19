import { createContext, useContext, type ReactNode } from "react";
import { useRegion } from "@/hooks/useRegion";
import { zones, getZoneById, type Zone } from "@/lib/zones";

interface RegionContextType {
  region: string;
  setRegion: (r: string) => void;
  currentZone: Zone | undefined;
  allZones: Zone[];
}

const RegionContext = createContext<RegionContextType | null>(null);

export function RegionProvider({ children }: { children: ReactNode }) {
  const { region, setRegion } = useRegion();
  const currentZone = region === "todas" ? undefined : getZoneById(region);

  return (
    <RegionContext.Provider value={{ region, setRegion, currentZone, allZones: zones }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegionContext() {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegionContext must be used within RegionProvider");
  return ctx;
}
