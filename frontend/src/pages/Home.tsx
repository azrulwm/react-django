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
  author: string;
  created_at: Date;
}
function Home() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
  });

  const [postList, setPostList] = useState<Post[]>([]);

  const [isHideForm, setIsHideForm] = useState(true);
  useEffect(() => {
    getPosts();
  }, []);

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

  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, content } = formData;
    try {
      const response = await api.post("/api/posts/", { title, content });
      if (response.status === 201) alert("Post created!");
      setFormData({
        title: "",
        content: "",
      });
      setIsHideForm(true);
      getPosts();
    } catch (error) {
      console.log(error);
      alert("Failed to create post");
    }
  };

  return (
    <div className="container">
      <h1>Post</h1>
      {!isHideForm && (
        <form className="auth-form" onSubmit={createPost}>
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

      <button
        onClick={() => {
          setIsHideForm((prev) => !prev);
        }}
      >
        {isHideForm ? "Add New Post" : " Hmm.. maybe next time.."}
      </button>

      {postList.map((post, index) => (
        <div key={index} className="post">
          <h2>{post.id}</h2>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Author: {post.author}</p>
          <p>Created at: {new Date(post.created_at).toLocaleString()}</p>
          <button onClick={() => deletePost(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Home;
