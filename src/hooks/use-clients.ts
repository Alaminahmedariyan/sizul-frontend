import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Add this import at the top, alongside existing imports from "@/lib/api/clients":
import {
  type Client,
  createClient,
  deleteClient,
  getClientById,
  getClients,
  getMyClientProfile,
  updateClient,
  updateClientActiveStatus,
} from "@/lib/api/clients";
import { getProjects } from "@/lib/api/projects";
import { getProposals } from "@/lib/api/proposals";

// Add this new hook anywhere in the file:
export function useMyClientProfile() {
  return useQuery({
    queryKey: ["clients", "me"],
    queryFn: () => getMyClientProfile(),
  });
}

export function useClients(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: () => getClients(params),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => getClientById(id),
    enabled: !!id,
  });
}

/** Projects belonging to this client — reuses the projects API with a filter. */
export function useClientProjects(clientId: string) {
  return useQuery({
    queryKey: ["projects", { clientId }],
    queryFn: () => getProjects({ clientId }),
    enabled: !!clientId,
  });
}

/** Proposals belonging to this client — reuses the proposals API with a filter. */
export function useClientProposals(clientId: string) {
  return useQuery({
    queryKey: ["proposals", { clientId }],
    queryFn: () => getProposals({ clientId }),
    enabled: !!clientId,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateClient(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: Partial<Pick<Client, "notes" | "company" | "phone">>,
    ) => updateClient(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", id] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateClientActiveStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isActive: boolean) => updateClientActiveStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", id] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
