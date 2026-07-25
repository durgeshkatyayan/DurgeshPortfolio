"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { ImagePlus, Save } from "lucide-react";

interface BlogForm {
  title: string;
  slug: string;
  category: string;
  tags: string;
  content: string;
  isPublished: boolean;
  metaTitle: string;
  metaDescription: string;
}

export default function NewBlogPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<BlogForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const onSubmit = async (data: BlogForm) => {
    setIsSubmitting(true);
    let uploadedImageUrl = "";

    try {
      // 1. Upload Cover Image to Cloudinary if selected
      if (coverImage) {
        const formData = new FormData();
        formData.append("file", coverImage);
        const uploadRes = await axios.post("/api/upload", formData);
        uploadedImageUrl = uploadRes.data.url;
      } else {
        toast.error("Cover image is required");
        setIsSubmitting(false);
        return;
      }

      // 2. Format tags and submit to DB
      const blogData = {
        ...data,
        tags: data.tags.split(",").map(t => t.trim()),
        coverImage: uploadedImageUrl
      };

      await axios.post("/api/blogs", blogData);
      toast.success("Blog post published!");
      router.push("/admin/blogs");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mb-8">Write New Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
          
          <div>
            <label className="block text-sm font-medium mb-2">Post Title</label>
            <input
              {...register("title", { required: true })}
              className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
              placeholder="The Future of Next.js"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                {...register("category", { required: true })}
                className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
                placeholder="Engineering"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
              <input
                {...register("tags")}
                className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
                placeholder="React, Frontend, Web"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cover Image</label>
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 text-center flex flex-col items-center justify-center">
              <ImagePlus className="text-neutral-400 mb-2" size={32} />
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                className="text-sm text-neutral-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content (Markdown or HTML)</label>
            <textarea
              {...register("content", { required: true })}
              rows={15}
              className="w-full p-4 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent font-mono text-sm"
              placeholder="Write your content here..."
            />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
          <h2 className="text-xl font-bold mb-4">SEO Settings</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Meta Title</label>
            <input
              {...register("metaTitle")}
              className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meta Description</label>
            <textarea
              {...register("metaDescription")}
              rows={3}
              className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2 pt-4">
            <input type="checkbox" {...register("isPublished")} id="isPublished" className="w-5 h-5" />
            <label htmlFor="isPublished" className="font-medium">Publish Immediately</label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <Save size={20} />
          {isSubmitting ? "Saving..." : "Save Blog Post"}
        </button>
      </form>
    </div>
  );
}