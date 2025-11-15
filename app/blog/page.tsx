import { ArrowLeft, Twitter, Linkedin, User, Github } from "lucide-react";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import BlogFilter from "./BlogFilter";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
              Development Blog
            </h1>

            {/* Author Info */}
            <div className="flex items-center justify-center gap-6 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span className="font-medium">Yahya Shareef</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://x.com/shareef_yahya1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
                  title="Follow on X/Twitter"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/yahiya-shareef/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
                  title="Connect on LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://github.com/yahyashareef48"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
                  title="Follow on GitHub"
                >
                  <Github size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts List with Filters */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlogFilter posts={posts} />
      </div>
    </div>
  );
}
