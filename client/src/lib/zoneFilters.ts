import { hotels, conversations, type Hotel, type Conversation } from "./mockData";
import { getZoneById, type Zone } from "./zones";

export function getHotelsByZone(zoneId: string): Hotel[] {
  if (zoneId === "todas") return hotels;
  const zone = getZoneById(zoneId);
  if (!zone) return hotels;
  return hotels.filter((h) => zone.countries.includes(h.country));
}

export function getConversationsByZone(zoneId: string): Conversation[] {
  if (zoneId === "todas") return conversations;
  const zoneHotels = getHotelsByZone(zoneId);
  const hotelIds = new Set(zoneHotels.map((h) => h.id));
  return conversations.filter((c) => hotelIds.has(c.hotelId));
}

export function getZoneStats(zoneId: string) {
  const zoneHotels = getHotelsByZone(zoneId);
  const totalHotels = zoneHotels.length;
  const inCadence = zoneHotels.filter((h) => h.status === "in_cadence").length;
  const nurturing = zoneHotels.filter((h) => h.status === "nurturing").length;
  const sqls = zoneHotels.filter((h) => h.status === "sql").length;
  const newLeads = zoneHotels.filter((h) => h.status === "new").length;
  const avgIcp = totalHotels > 0 ? Math.round(zoneHotels.reduce((s, h) => s + h.icpScore, 0) / totalHotels) : 0;
  const avgCv = totalHotels > 0 ? Math.round(zoneHotels.reduce((s, h) => s + h.contactValue, 0) / totalHotels) : 0;

  return { totalHotels, inCadence, nurturing, sqls, newLeads, avgIcp, avgCv };
}
