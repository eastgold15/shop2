import { StatisticsContract } from "@repo/contract";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api-client";

export const statisticsKeys = {
  all: ["statistics"] as const,
  main: () => [...statisticsKeys.all, "main"] as const,
  notifications: () => [...statisticsKeys.all, "notifications"] as const,
};

export function useStatistics() {
  return useQuery({
    queryKey: statisticsKeys.main(),
    queryFn: () =>
      api.get<StatisticsContract["Response"]>("/api/v1/statistics"),
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: statisticsKeys.notifications(),
    queryFn: () =>
      api.get<StatisticsContract["NotificationsResponse"]>(
        "/api/v1/statistics/notifications"
      ),
  });
}
