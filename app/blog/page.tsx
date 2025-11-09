import { Calendar, ArrowLeft, ArrowRight, Twitter, Linkedin, User, Github } from "lucide-react";
import Link from "next/link";
import { getAllPosts, BlogPost } from "@/lib/blog";

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

      {/* Blog Posts List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <Calendar size={64} className="text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No posts yet</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Check back soon for development updates and insights!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post: BlogPost) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 p-4 transition-all duration-300 hover:scale-[1.01] hover:bg-white/80 dark:hover:bg-gray-800/80 h-full flex flex-col">
                  {/* Post Meta */}
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar size={12} />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span>•</span>
                    <span>5 min</span>
                  </div>

                  {/* Post Title */}
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-grow">{post.excerpt}</p>}

                  {/* Tags & Read More */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {post.tags &&
                          post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium">
                        <span>Read</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
