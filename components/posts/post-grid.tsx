import { getAllPosts } from "@/lib/blog";
import PostItem from "./post-item";

const PostGrid = async () => {
  const posts = await getAllPosts();

  return (
    <div className="space-y-12">
      {posts.map((post) => (
        <PostItem key={post.slug} post={post} />
      ))}
    </div>
  );
};

export default PostGrid;
