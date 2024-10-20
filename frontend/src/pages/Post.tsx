import { useParams } from "react-router-dom";
import api from "../api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface Post {
  id: number;
  title: string;
  content: string;
  author_username: string;
  updated_at: Date;
  comments: unknown[];
}
function Post() {
  const { id } = useParams<{ id: string }>();
  const [postDetail, setPostDetail] = useState<Post>({
    id: 0,
    title: "",
    content: "",
    author_username: "",
    updated_at: new Date(),
    comments: [],
  });
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    getPost();
    getCurrentUser();
  }, []);
  const getPost = async () => {
    try {
      const response = await api.get(`/api/posts/${id}/`);
      setPostDetail(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (id: number) => {
    try {
      const response = await api.delete(`/api/posts/delete/${id}/`);
      if (response.status === 204) {
        alert(`The post has been deleted!`);
      }
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Failed to delete post");
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await api.get("/api/current_user/");
      setCurrentUsername(response.data.username);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="post pages">
      <h2>{postDetail.title}</h2>
      <p className="post-content">{postDetail.content}</p>
      <div className="post-meta">
        <p>Author: {postDetail.author_username}</p>
        <p>Updated at: {new Date(postDetail.updated_at).toLocaleString()}</p>
        <p>
          {postDetail.comments.length}
          {postDetail.comments.length <= 1 ? " comment" : " comments"}
        </p>
      </div>
      {postDetail.author_username === currentUsername && (
        <>
          {/* <button onClick={() => handleEditClick(post)}>Edit</button> */}
          <button
            className="delete-button"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this post?")
              ) {
                deletePost(postDetail.id);
              }
            }}
          >
            Delete
          </button>
        </>
      )}

      {/* {editingPostId === postDetail.id && (
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
      )} */}
    </div>
  );
}

export default Post;
