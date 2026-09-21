import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type BlogCategory,
  type BlogPost,
  type BlogTag,
  createBlogCategory,
  createBlogPost,
  createBlogTag,
  deleteBlogCategory,
  deleteBlogPost,
  deleteBlogTag,
  getBlogCategories,
  getBlogPostByIdForManage,
  getBlogPostsForManage,
  getBlogTags,
  updateBlogCategory,
  updateBlogPost,
  updateBlogPostStatus,
  updateBlogTag,
} from "@/lib/api/blog";
import { ContentStatus } from "@/lib/api/testimonials";

// ---- Categories ----
export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => getBlogCategories(),
  });
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlogCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog-categories"],
      });
    },
  });
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Pick<BlogCategory, "name" | "isActive">>;
    }) => updateBlogCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog-categories"],
      });
    },
  });
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlogCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog-categories"],
      });
    },
  });
}

// ---- Tags ----
export function useBlogTags() {
  return useQuery({
    queryKey: ["blog-tags"],
    queryFn: () => getBlogTags(),
  });
}

export function useCreateBlogTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlogTag,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog-tags"],
      });
    },
  });
}

export function useUpdateBlogTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Pick<BlogTag, "name">>;
    }) => updateBlogTag(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog-tags"],
      });
    },
  });
}

export function useDeleteBlogTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlogTag,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog-tags"],
      });
    },
  });
}

// ---- Posts ----
export function useBlogPostsForManage() {
  return useQuery({
    queryKey: ["blog-posts", "manage"],
    queryFn: () => getBlogPostsForManage(),
  });
}

export function useBlogPostForManage(id: string) {
  return useQuery({
    queryKey: ["blog-posts", "manage", id],
    queryFn: () => getBlogPostByIdForManage(id),
    enabled: !!id,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog-posts"],
      });
    },
  });
}

export function useUpdateBlogPost(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof updateBlogPost>[1]) =>
      updateBlogPost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog-posts", "manage", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["blog-posts"],
      });
    },
  });
}

export function useUpdateBlogPostStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: ContentStatus) =>
      updateBlogPostStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog-posts", "manage", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["blog-posts"],
      });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog-posts"],
      });
    },
  });
}