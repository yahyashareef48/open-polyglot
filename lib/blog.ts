import matter from "gray-matter";
import { marked } from "marked";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  author: string;
  excerpt: string;
  content: string;
}

// List of blog post files (you'll need to maintain this manually or create a build script)
const blogPosts = ["2025-09-19-project-initiation.md"];

export async function getAllPosts(): Promise<BlogPost[]> {
  const allPostsData = await Promise.all(
    blogPosts.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, "");

      try {
        const response = await fetch(`/content/blog/${fileName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${fileName}`);
        }

        const fileContents = await response.text();
        const { data, content } = matter(fileContents);

        // Process markdown content to HTML using marked
        const contentHtml = marked(content);

        return {
          slug,
          title: data.title || "Untitled",
          date: data.date || new Date().toISOString().split("T")[0],
          tags: data.tags || [],
          author: data.author || "Open Polyglot Team",
          excerpt: data.excerpt || "",
          content: contentHtml,
        } as BlogPost;
      } catch (error) {
        console.error(`Error loading blog post ${fileName}:`, error);
        return null;
      }
    })
  );

  // Filter out failed posts and sort by date (newest first)
  return allPostsData.filter((post): post is BlogPost => post !== null).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Find the filename that matches this slug
    const fileName = blogPosts.find((file) => file.replace(/\.md$/, "") === slug);
    if (!fileName) {
      return null;
    }

    const response = await fetch(`/content/blog/${fileName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${fileName}`);
    }

    const fileContents = await response.text();
    const { data, content } = matter(fileContents);

    // Process markdown content to HTML using marked
    const contentHtml = await marked(content);

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString().split("T")[0],
      tags: data.tags || [],
      author: data.author || "Open Polyglot Team",
      excerpt: data.excerpt || "",
      content: contentHtml,
    };
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}
