import { useState } from "react";
import "./authForm.css";
import api from "../../api";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constant";

interface AuthFormProps {
  mode: "register" | "login";
}

interface FormData {
  username: string;
  password: string;
}

function AuthForm({ mode }: AuthFormProps) {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password } = formData;

    try {
      let response;
      if (mode === "register") {
        response = await api.post("api/user/register/", {
          username,
          password,
        });
      } else {
        response = await api.post("api/token/", { username, password });
      }

      Cookies.set(ACCESS_TOKEN, response.data.access, {
        expires: new Date(new Date().getTime() + 30 * 60 * 1000),
        path: "/",
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set(REFRESH_TOKEN, response.data.refresh, {
        expires: 7,
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">
        {mode === "register" ? "Register" : "Login"}
      </h1>
      <form className="auth-form" onSubmit={onFormSubmit}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="form-button">
          {mode === "register" ? "Register" : "Login"}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;
