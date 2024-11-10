import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { generateBlogPostsPreview } from "~/utils/data/blog.data";

const BlogList: React.FC = () => {
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-xl ring-1 ring-black/5 mb-8">
          <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent text-center">
            Koi Blog
          </h1>
          <p className="mt-4 text-center text-gray-600">
            Latest updates, news and insights from the world of Koi
          </p>
        </motion.div>

        <div className="space-y-8">
          {generateBlogPostsPreview(20).map((post, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={post.id}
              className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-xl ring-1 ring-black/5"
            >
              <Link to={`/blog/${post.id}`} className="group">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <p className="text-gray-600">{post.excerpt}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BlogList;
