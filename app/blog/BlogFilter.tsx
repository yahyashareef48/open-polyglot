"use client";

import { useState, useMemo } from "react";
import { Search, X, Filter } from "lucide-react";
import { BlogPost } from "@/lib/blog";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

interface BlogFilterProps {
  posts: BlogPost[];
}

export default function BlogFilter({ posts }: BlogFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Extract all unique tags from posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts based on search query and selected tags
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Tag filter
      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => post.tags?.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [posts, searchQuery, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery !== "" || selectedTags.length > 0;

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search posts by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
              showFilters || selectedTags.length > 0
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <Filter size={20} />
            <span className="hidden sm:inline">Filters</span>
            {selectedTags.length > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium">{selectedTags.length}</span>
            )}
          </button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <X size={20} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>

        {/* Tag Filters */}
        {showFilters && allTags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Filter by Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <p>
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredPosts.length}</span> of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{posts.length}</span> posts
        </p>
        {hasActiveFilters && (
          <p className="text-blue-600 dark:text-blue-400 font-medium">
            {selectedTags.length > 0 && `${selectedTags.length} tag${selectedTags.length > 1 ? "s" : ""} selected`}
          </p>
        )}
      </div>

      {/* Filtered Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <Search size={64} className="text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No posts found</h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            Try adjusting your search or filter criteria
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <X size={20} />
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post: BlogPost) => (
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
                {post.excerpt && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-grow">{post.excerpt}</p>
                )}

                {/* Tags & Read More */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                      {post.tags &&
                        post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs"
                          >
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
  );
}
