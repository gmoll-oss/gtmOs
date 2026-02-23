import { createContext, useContext } from "react";
import { prospectLists, type ProspectList } from "./mockData";

export interface ApolloContact {
  id: string;
  name: string;
  title: string;
  email: string;
  email_status: string;
  phone: string;
  linkedin_url: string;
  city: string;
  country: string;
  company: string;
  domain: string;
  website: string;
  industry: string;
  employees: number;
}

export interface DynamicList {
  id: string;
  name: string;
  contactCount: number;
  source: "search" | "import" | "ai" | "manual";
  contacts: ApolloContact[];
  createdAt: string;
}

export function isDynamicList(list: ProspectList | DynamicList): list is DynamicList {
  return "contacts" in list && Array.isArray((list as DynamicList).contacts);
}

export interface ListsContextType {
  dynamicLists: DynamicList[];
  addList: (list: DynamicList) => void;
  removeList: (id: string) => void;
  getAllLists: () => (ProspectList | DynamicList)[];
  getDynamicList: (id: string) => DynamicList | undefined;
}

export const ListsContext = createContext<ListsContextType>({
  dynamicLists: [],
  addList: () => {},
  removeList: () => {},
  getAllLists: () => prospectLists,
  getDynamicList: () => undefined,
});

export function useLists() {
  return useContext(ListsContext);
}
