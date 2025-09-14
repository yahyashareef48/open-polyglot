import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  author: string;
  excerpt: string;
  content: string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  // Check if posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const { data, content } = matter(fileContents);

        // Process markdown content to HTML
        const processedContent = await remark()
          .use(html)
          .process(content);
        const contentHtml = processedContent.toString();

        return {
          slug,
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString().split('T')[0],
          tags: data.tags || [],
          author: data.author || 'Open Polyglot Team',
          excerpt: data.excerpt || '',
          content: contentHtml,
        } as BlogPost;
      })
  );

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);

    // Process markdown content to HTML
    const processedContent = await remark()
      .use(html)
      .process(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      tags: data.tags || [],
      author: data.author || 'Open Polyglot Team',
      excerpt: data.excerpt || '',
      content: contentHtml,
    };
  } catch (error) {
    return null;
  }
}