import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { generateBlogPostsPreview } from "~/utils/data/blog.data";

const BlogList: React.FC = () => {
  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="mb-8 text-4xl font-bold">Koi Blog</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {generateBlogPostsPreview(20).map((post, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={post.id}
          >
            <Link to={`/blog/${post.id}`} className="group">
              <div className="overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-4">
                  <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
                  <p className="text-gray-600">{post.excerpt}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
