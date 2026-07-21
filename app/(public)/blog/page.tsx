import { connectToDatabase } from "@/lib/mongodb";
import Blog, { type BlogDocument } from "@/models/Blog";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function BlogListingPage() {
  await connectToDatabase();
  const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 }).lean<BlogDocument[]>();

  if (!blogs) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Thoughts & Writings</h1>
        <p className="text-neutral-400">Articles on software engineering, design, and my journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <Link href={`/blog/${blog.slug}`} key={blog._id.toString()}>
            <article className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition group h-full flex flex-col">
              <div className="relative h-48 w-full overflow-hidden">
                <Image 
                  src={blog.coverImage} 
                  alt={blog.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition duration-500" 
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-4 text-xs text-neutral-400 mb-3">
                  <span className="text-blue-400 font-semibold">{blog.category}</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-3 text-white line-clamp-2">{blog.title}</h2>
                <p className="text-neutral-400 text-sm line-clamp-3 mb-4 flex-grow">
                  {blog.metaDescription || "Read more about this topic inside..."}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {blog.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-xs bg-neutral-950 px-2 py-1 rounded text-neutral-500">#{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
      
      {blogs.length === 0 && (
        <div className="text-center text-neutral-500 py-20">No articles published yet.</div>
      )}
    </main>
  );
}