import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useParams } from "react-router-dom";
import NavigateButton from "~/components/shared/NavigateButton";
import { blogPosts } from "~/utils/data/blog.data";

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find((post) => post.id === Number(id));

  if (!post) {
    return <div className="container mx-auto mt-8 px-4">Post not found</div>;
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <NavigateButton
        icon={<FontAwesomeIcon icon={faArrowLeft} />}
        text="Back to Blog"
        to="/blog"
        className="mb-4 text-blue-500"
      />
      <article className="prose prose-lg mx-auto">
        <h1>{post.title}</h1>
        <img src={post.image} alt={post.title} className="mb-4 rounded-lg" />
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
};

export default BlogPost;
