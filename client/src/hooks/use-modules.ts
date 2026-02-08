import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useModules(courseId: number) {
  return useQuery({
    queryKey: [api.modules.listByCourse.path, courseId],
    queryFn: async () => {
      const url = buildUrl(api.modules.listByCourse.path, { id: courseId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch modules");
      return api.modules.listByCourse.responses[200].parse(await res.json());
    },
    enabled: !!courseId,
  });
}

export function useModule(moduleId: number) {
  return useQuery({
    queryKey: [api.modules.get.path, moduleId],
    queryFn: async () => {
      const url = buildUrl(api.modules.get.path, { id: moduleId });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch module");
      return api.modules.get.responses[200].parse(await res.json());
    },
    enabled: !!moduleId,
  });
}
