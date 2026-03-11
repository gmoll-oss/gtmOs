"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useLeads() {
  return useQuery({ queryKey: ["leads"], queryFn: () => api.leads.list() });
}

export function useLead(id: string) {
  return useQuery({ queryKey: ["leads", id], queryFn: () => api.leads.get(id), enabled: !!id });
}

export function useCompanies() {
  return useQuery({ queryKey: ["companies"], queryFn: () => api.companies.list() });
}

export function useCampaigns() {
  return useQuery({ queryKey: ["campaigns"], queryFn: () => api.campaigns.list() });
}

export function useLists() {
  return useQuery({ queryKey: ["lists"], queryFn: () => api.lists.list() });
}

export function useIdentities() {
  return useQuery({ queryKey: ["identities"], queryFn: () => api.identities.list() });
}

export function useInboxThreads() {
  return useQuery({ queryKey: ["inbox"], queryFn: () => api.inbox.list() });
}

export function useActivityFeed() {
  return useQuery({ queryKey: ["activity"], queryFn: () => api.activity.list() });
}

export function useAnalytics() {
  return useQuery({ queryKey: ["analytics"], queryFn: () => api.analytics.summary() });
}

export function usePlaybook() {
  return useQuery({ queryKey: ["playbook"], queryFn: () => api.playbook.get() });
}

export function useSearchJobs() {
  return useQuery({ queryKey: ["find", "jobs"], queryFn: () => api.find.jobs() });
}

export function useExclusionRules() {
  return useQuery({ queryKey: ["settings", "exclusion-rules"], queryFn: () => api.settings.exclusionRules() });
}

export function useSuppressions() {
  return useQuery({ queryKey: ["settings", "suppressions"], queryFn: () => api.settings.suppressions() });
}

export function useEnrichmentQueue() {
  return useQuery({ queryKey: ["enrichment", "queue"], queryFn: () => api.enrichment.queue() });
}

export function useEnrichmentAttempts(leadId: string) {
  return useQuery({ queryKey: ["enrichment", "attempts", leadId], queryFn: () => api.enrichment.attempts(leadId), enabled: !!leadId });
}

export function useAllEnrichmentAttempts() {
  return useQuery({ queryKey: ["enrichment", "attempts-all"], queryFn: () => api.enrichment.allAttempts() });
}

export function useEventLogs(leadId: string) {
  return useQuery({ queryKey: ["events", leadId], queryFn: () => api.events.byLead(leadId), enabled: !!leadId });
}
