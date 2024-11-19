import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useParams } from "react-router-dom";
import NavigateButton from "~/components/shared/NavigateButton";
import { generateBlogPosts } from "~/utils/data/blog.data";
import { motion } from "framer-motion";

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = generateBlogPosts(20).find((post) => post.id === Number(id));

  if (!post) {
    return <div className="container mx-auto mt-8 px-4">Post not found</div>;
  }

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <NavigateButton
          icon={<FontAwesomeIcon icon={faArrowLeft} />}
          text="Blogs"
          to="/blog"
          className="mb-8 text-blue-600 hover:text-blue-700"
        />

        <motion.div
          className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-xl ring-1 ring-black/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="prose prose-lg mx-auto">
            <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-600 mt-4 mb-8">
              <span>{post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>

            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded-lg object-cover mb-8"
            />

            <div
              className="text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;
