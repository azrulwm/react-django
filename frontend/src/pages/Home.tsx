import { useEffect, useState } from "react";
import api from "../api";

interface FormData {
  title: string;
  content: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author_username: string;
  updated_at: Date;
  comments: unknown[];
}

function Home() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
  });

  const [postList, setPostList] = useState<Post[]>([]);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [currentUsername, setCurrentUsername] = useState<string>("");

  useEffect(() => {
    getPosts();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await api.get("/api/current_user/");
      setCurrentUsername(response.data.username);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getPosts = async () => {
    try {
      const response = await api.get("/api/posts/");
      setPostList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (id: number) => {
    try {
      const response = await api.delete(`/api/posts/delete/${id}/`);
      if (response.status === 204) {
        alert(`The post has been deleted!`);
        getPosts();
      }
    } catch (error) {
      console.log(error);
      alert("Failed to delete post");
    }
  };

  const createOrUpdatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, content } = formData;
    try {
      if (editingPostId !== null) {
        const response = await api.put(`/api/posts/update/${editingPostId}/`, {
          title,
          content,
        });
        if (response.status === 200) alert("Post updated!");
      } else {
        const response = await api.post("/api/posts/", { title, content });
        if (response.status === 201) alert("Post created!");
      }
      setFormData({
        title: "",
        content: "",
      });
      setEditingPostId(null);
      setIsFormVisible(false);
      getPosts();
    } catch (error) {
      console.log(error);
      alert("Failed to save post");
    }
  };

  const handleEditClick = (post: Post) => {
    setFormData({
      title: post.title,
      content: post.content,
    });
    setEditingPostId(post.id);
    setIsFormVisible(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      title: "",
      content: "",
    });
    setEditingPostId(null);
    setIsFormVisible(false);
  };

  return (
    <div className="pages">
      <h1>Posts</h1>

      <button
        onClick={() => {
          setIsFormVisible((prev) => !prev);
          setFormData({ title: "", content: "" });
          setEditingPostId(null);
        }}
      >
        {isFormVisible ? "Cancel" : "Add New Post"}
      </button>

      {isFormVisible && editingPostId === null && (
        <form className="post-form" onSubmit={createOrUpdatePost}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Content:
            </label>
            <input
              type="content"
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="form-button">
            Add Post
          </button>
        </form>
      )}

      {postList.map((post) => (
        <div key={post.id} className="post">
          <h2>{post.title}</h2>
          <p className="post-content">{post.content}</p>
          <div className="post-meta">
            <p>Author: {post.author_username}</p>
            <p>Updated at: {new Date(post.updated_at).toLocaleString()}</p>
            <p>
              {post.comments.length}
              {post.comments.length <= 1 ? " comment" : " comments"}
            </p>
          </div>
          {post.author_username === currentUsername && (
            <>
              <button onClick={() => handleEditClick(post)}>Edit</button>
              <button
                className="delete-button"
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this post?")
                  ) {
                    deletePost(post.id);
                  }
                }}
              >
                Delete
              </button>
            </>
          )}

          {editingPostId === post.id && (
            <form className="post-form" onSubmit={createOrUpdatePost}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="content" className="form-label">
                  Content:
                </label>
                <input
                  type="content"
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <button type="submit" className="post-button">
                Update Post
              </button>
              <button
                type="button"
                className="post-button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}

export default Home;
