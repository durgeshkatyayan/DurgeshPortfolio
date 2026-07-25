"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blogs");
      setBlogs(data);
    } catch (error) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`/api/blogs/${id}`);
      toast.success("Blog deleted successfully");
      setBlogs(blogs.filter(b => b._id !== id));
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
        <Link 
          href="/admin/blogs/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <Plus size={20} /> Write Post
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse bg-white dark:bg-neutral-900 rounded-xl h-64 border border-neutral-200 dark:border-neutral-800"></div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition">
                  <td className="p-4 font-medium">{blog.title}</td>
                  <td className="p-4 text-neutral-500">{blog.category}</td>
                  <td className="p-4 text-neutral-500">{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-700'}`}>
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-3">
                    <Link href={`/blog/${blog.slug}`} target="_blank" className="text-neutral-400 hover:text-blue-500 transition">
                      <Eye size={18} />
                    </Link>
                    <button className="text-neutral-400 hover:text-emerald-500 transition">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(blog._id)} className="text-neutral-400 hover:text-red-500 transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {blogs.length === 0 && <div className="p-8 text-center text-neutral-500">No blog posts found.</div>}
        </div>
      )}
    </div>
  );
}