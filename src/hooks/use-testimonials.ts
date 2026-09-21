import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	createTestimonial,
	deleteTestimonial,
	getTestimonialByIdForManage,
	getTestimonialsForManage,
	updateTestimonial,
	updateTestimonialStatus,
	type ContentStatus,
	type Testimonial,
} from "@/lib/api/testimonials";

export function useTestimonialsForManage() {
	return useQuery({
		queryKey: ["testimonials", "manage"],
		queryFn: () => getTestimonialsForManage(),
	});
}

export function useTestimonialForManage(id: string) {
	return useQuery({
		queryKey: ["testimonials", "manage", id],
		queryFn: () => getTestimonialByIdForManage(id),
		enabled: !!id,
	});
}

export function useCreateTestimonial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTestimonial,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["testimonials"] });
		},
	});
}

export function useUpdateTestimonial(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: Partial<Omit<Testimonial, "id" | "createdAt" | "updatedAt">>) => updateTestimonial(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["testimonials", "manage", id] });
			queryClient.invalidateQueries({ queryKey: ["testimonials"] });
		},
	});
}

export function useUpdateTestimonialStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: ContentStatus }) => updateTestimonialStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["testimonials"] });
		},
	});
}

export function useDeleteTestimonial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteTestimonial,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["testimonials"] });
		},
	});
}