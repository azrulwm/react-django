import { useParams } from "react-router-dom";
import api from "../api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormData } from "./Home";

export interface Post {
  id: number;
  title: string;
  content: string;
  author_username: string;
  updated_at: Date;
  comments: Comment[];
}

interface Comment {
  id: number;
  content: string;
  author_username: string;
  updated_at: Date;
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
  const [isEditHide, setIsEditHide] = useState(true);
  const [postFormData, setPostFormData] = useState<FormData>({
    title: "",
    content: "",
  });
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
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

  const updatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, content } = postFormData;
    try {
      const response = await api.put(`/api/posts/update/${id}/`, {
        title,
        content,
      });
      if (response.status === 200) alert("Post updated!");
      setPostFormData({
        title: "",
        content: "",
      });
      setIsEditHide(true);
      getPost();
    } catch (error) {
      console.log(error);
      alert("Failed to save post");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostFormData({
      ...postFormData,
      [name]: value,
    });
  };

  const handleCancelEdit = () => {
    setPostFormData({
      title: "",
      content: "",
    });
    setIsEditHide(true);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  const submitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post(`/api/comments/`, {
        post: id,
        content: newComment,
      });
      if (response.status === 201) {
        setNewComment("");
        getPost();
      }
    } catch (error) {
      console.log(error);
      alert("Failed to add comment");
    }
  };

  const handleEditCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingCommentContent(e.target.value);
  };

  const handleCancelCommentEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  const handleSubmitCommentEdit = async (commentId: number) => {
    try {
      const response = await api.put(`/api/comments/${commentId}/`, {
        post: id,
        content: editingCommentContent,
      });
      if (response.status === 200) {
        setEditingCommentId(null);
        setEditingCommentContent("");
        getPost();
      }
    } catch (error) {
      console.log(error);
      alert("Failed to update comment");
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      const response = await api.delete(`/api/comments/${commentId}/`);
      if (response.status === 204) {
        alert(`The comment has been deleted!`);
        getPost();
      }
    } catch (error) {
      console.log(error);
      alert("Failed to delete comment");
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
          <button onClick={() => setIsEditHide(false)}>Edit</button>
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

      {!isEditHide && (
        <form className="post-form" onSubmit={updatePost}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={postFormData.title}
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
              value={postFormData.content}
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

      {postDetail.comments.map((comment) => (
        <div className="comment-wrapper" key={comment.id}>
          <div className="comment-content">
            {editingCommentId !== comment.id ? (
              <>
                <p className="comment-author">
                  {comment.author_username} says:
                </p>
                <p>{comment.content}</p>
              </>
            ) : (
              <form>
                <input
                  type="text"
                  id="edit-comment"
                  name="edit-comment"
                  value={editingCommentContent}
                  onChange={handleEditCommentChange}
                  className="form-input"
                  placeholder="Edit your comment..."
                  required
                />
              </form>
            )}
          </div>
          {comment.author_username === currentUsername && (
            <div className="comment-button">
              {editingCommentId !== comment.id ? (
                <>
                  <button
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditingCommentContent(comment.content);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this comment?"
                        )
                      ) {
                        deleteComment(comment.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleCancelCommentEdit}>Cancel</button>
                  <button onClick={() => handleSubmitCommentEdit(comment.id)}>
                    Submit
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}

      <form onSubmit={submitComment}>
        <input
          type="text"
          id="new-comment"
          name="new-comment"
          value={newComment}
          onChange={handleCommentChange}
          className="form-input"
          placeholder="Add a comment..."
          required
        />
        <button type="submit" className="post-button">
          Submit Comment
        </button>
      </form>
    </div>
  );
}

export default Post;
