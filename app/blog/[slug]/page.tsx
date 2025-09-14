import { Calendar, ArrowLeft, Twitter, Linkedin, User, Share2, Clock, Github } from 'lucide-react';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Blog
            </Link>
          </div>

          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Calendar size={16} />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Clock size={16} />
              <span>5 min read</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <User size={16} />
              <span>Yahya Shareef</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Social Share */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Share this post:</span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 text-gray-500 dark:text-gray-400 transition-colors"
                  title="Share on X/Twitter"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 text-gray-500 dark:text-gray-400 transition-colors"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Follow me:</span>
              <a
                href="https://x.com/shareef_yahya1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 text-gray-500 dark:text-gray-400 transition-colors"
                title="Follow on X/Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/yahiya-shareef/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 text-gray-500 dark:text-gray-400 transition-colors"
                title="Connect on LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://github.com/yahyashareef48"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 text-gray-500 dark:text-gray-400 transition-colors"
                title="Follow on GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 md:p-12">
          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>


        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back to All Posts
          </Link>
        </div>
      </article>
    </div>
  );
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}