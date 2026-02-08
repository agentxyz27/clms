import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useOnlineUsers() {
  return useQuery({
    queryKey: [api.users.online.path],
    queryFn: async () => {
      const res = await fetch(api.users.online.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch online users");
      return api.users.online.responses[200].parse(await res.json());
    },
    refetchInterval: 30000, // Refresh every 30s
  });
}
