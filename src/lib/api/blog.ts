import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";
import type { ContentStatus } from "./testimonials";

export type { ContentStatus } from "./testimonials";

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogPost = {
  id: string;
  categoryId: string | null;
  authorId: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  status: ContentStatus;
  publishedAt: string | null;
  tags?: { tag: BlogTag }[];
  createdAt: string;
  updatedAt: string;
};

export type CreateBlogPostInput = {
  categoryId?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  tagIds?: string[];
};

// ---- Categories ----
export const getBlogCategories = () =>
  apiClient<ApiSuccessResponse<BlogCategory[]>>("/api/v1/blog-categories");

export const createBlogCategory = (payload: {
  name: string;
  slug: string;
}) =>
  apiClient<ApiSuccessResponse<BlogCategory>>("/api/v1/blog-categories", {
    method: "POST",
    body: payload,
  });

export const updateBlogCategory = (
  id: string,
  payload: Partial<Pick<BlogCategory, "name" | "isActive">>,
) =>
  apiClient<ApiSuccessResponse<BlogCategory>>(
    `/api/v1/blog-categories/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );

export const deleteBlogCategory = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/blog-categories/${id}`, {
    method: "DELETE",
  });

// ---- Tags ----
export const getBlogTags = () =>
  apiClient<ApiSuccessResponse<BlogTag[]>>("/api/v1/blog-tags");

export const createBlogTag = (payload: { name: string; slug: string }) =>
  apiClient<ApiSuccessResponse<BlogTag>>("/api/v1/blog-tags", {
    method: "POST",
    body: payload,
  });

export const updateBlogTag = (
  id: string,
  payload: Partial<Pick<BlogTag, "name">>,
) =>
  apiClient<ApiSuccessResponse<BlogTag>>(`/api/v1/blog-tags/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const deleteBlogTag = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/blog-tags/${id}`, {
    method: "DELETE",
  });

// ---- Posts (Public) ----
export const getBlogPosts = () =>
  apiClient<ApiSuccessResponse<BlogPost[]>>("/api/v1/blog-posts");

export const getBlogPostBySlug = (slug: string) =>
  apiClient<ApiSuccessResponse<BlogPost>>(`/api/v1/blog-posts/${slug}`);

// ---- Posts (Admin) ----
export const getBlogPostsForManage = () =>
  apiClient<ApiSuccessResponse<BlogPost[]>>("/api/v1/blog-posts/manage");

export const getBlogPostByIdForManage = (id: string) =>
  apiClient<ApiSuccessResponse<BlogPost>>(
    `/api/v1/blog-posts/manage/${id}`,
  );

export const createBlogPost = (payload: CreateBlogPostInput) =>
  apiClient<ApiSuccessResponse<BlogPost>>("/api/v1/blog-posts", {
    method: "POST",
    body: payload,
  });

export const updateBlogPost = (
  id: string,
  payload: Partial<
    Pick<
      BlogPost,
      | "title"
      | "excerpt"
      | "content"
      | "categoryId"
      | "featuredImage"
      | "seoTitle"
      | "seoDescription"
      | "canonicalUrl"
    >
  > & {
    tagIds?: string[];
  },
) =>
  apiClient<ApiSuccessResponse<BlogPost>>(`/api/v1/blog-posts/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const updateBlogPostStatus = (id: string, status: ContentStatus) =>
  apiClient<ApiSuccessResponse<BlogPost>>(
    `/api/v1/blog-posts/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );

export const deleteBlogPost = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/blog-posts/${id}`, {
    method: "DELETE",
  });