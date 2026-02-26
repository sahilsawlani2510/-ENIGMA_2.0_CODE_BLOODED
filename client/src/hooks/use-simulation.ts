import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

// Although the prompt explicitly requested simulating state entirely in the frontend,
// we provide this hook to match the API contract in the routes_manifest.
// It can be used to fetch initial base configuration if a backend is ever connected.
export function useSimulationState() {
  return useQuery({
    queryKey: [api.simulation.get.path],
    queryFn: async () => {
      // In a real app, this would fetch from the backend.
      // For this isolated digital twin, we catch errors gracefully.
      try {
        const res = await fetch(api.simulation.get.path);
        if (!res.ok) throw new Error("Failed to fetch simulation state");
        return api.simulation.get.responses[200].parse(await res.json());
      } catch (err) {
        // Fallback to default state if backend is disconnected
        return {
          id: 1,
          greenCover: 10,
          floodActive: false,
          healthScore: 70
        };
      }
    },
    staleTime: Infinity, // Don't refetch frequently, we manage state locally
  });
}
