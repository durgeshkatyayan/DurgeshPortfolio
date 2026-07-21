import { MetadataRoute } from 'next';
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Project from "@/models/Project";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myportfolio.com';
  
  await connectToDatabase();
  
  // Fetch dynamic slugs
  const [blogs, projects] = await Promise.all([
    Blog.find({ isPublished: true }).select('slug updatedAt'),
    Project.find().select('_id updatedAt')
  ]);

  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects/${project._id}`,
    lastModified: project.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Static routes
  const routes = ['', '/about', '/projects', '/blog', '/contact', '/gallery', '/booking', '/experience'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...routes, ...blogUrls, ...projectUrls];
}