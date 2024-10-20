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
  created_at: Date;
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
    <div className="container">
      <h1>Post</h1>

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
        <form className="auth-form" onSubmit={createOrUpdatePost}>
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
          <h2>{post.id}</h2>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Author: {post.author_username}</p>
          <p>Created at: {new Date(post.created_at).toLocaleString()}</p>
          {post.author_username === currentUsername && (
            <>
              <button onClick={() => handleEditClick(post)}>Edit</button>
              <button onClick={() => deletePost(post.id)}>Delete</button>
            </>
          )}

          {editingPostId === post.id && (
            <form className="auth-form" onSubmit={createOrUpdatePost}>
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
                Update Post
              </button>
              <button
                type="button"
                className="form-button"
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
