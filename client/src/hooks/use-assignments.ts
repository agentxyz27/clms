import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useAssignments(courseId: number) {
  return useQuery({
    queryKey: [api.assignments.listByCourse.path, courseId],
    queryFn: async () => {
      const url = buildUrl(api.assignments.listByCourse.path, { id: courseId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch assignments");
      return api.assignments.listByCourse.responses[200].parse(await res.json());
    },
    enabled: !!courseId,
  });
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const url = buildUrl(api.assignments.submit.path, { id });
      const validated = api.assignments.submit.input.parse({ content });
      
      const res = await fetch(url, {
        method: api.assignments.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) throw new Error("Invalid submission");
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to submit assignment");
      }
      return api.assignments.submit.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries (assignments list, specific assignment status)
      // Since we don't have exact query keys for specific assignment status in this limited example,
      // we might want to invalidate the course assignments
      // queryClient.invalidateQueries({ queryKey: [api.assignments.listByCourse.path] });
    },
  });
}
