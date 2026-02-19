export interface Zone {
  id: string;
  name: string;
  flag: string;
  ambassador: {
    name: string;
    initials: string;
    role: string;
  };
  countries: string[];
}

export const zones: Zone[] = [
  {
    id: "espana",
    name: "España",
    flag: "ES",
    ambassador: { name: "Federico Cifre", initials: "FC", role: "Embajador España" },
    countries: ["Spain"],
  },
  {
    id: "mexico",
    name: "México",
    flag: "MX",
    ambassador: { name: "Juan José Da Silva", initials: "JD", role: "Embajador México" },
    countries: ["Mexico"],
  },
  {
    id: "colombia",
    name: "Colombia",
    flag: "CO",
    ambassador: { name: "Daniela Jiménez", initials: "DJ", role: "Embajadora Colombia" },
    countries: ["Colombia", "Peru", "Panama"],
  },
  {
    id: "portugal",
    name: "Portugal",
    flag: "PT",
    ambassador: { name: "Joao Freitas", initials: "JF", role: "Embajador Portugal" },
    countries: ["Portugal"],
  },
];

export function getZoneByCountry(country: string): Zone | undefined {
  return zones.find((z) => z.countries.includes(country));
}

export function getZoneById(id: string): Zone | undefined {
  return zones.find((z) => z.id === id);
}
