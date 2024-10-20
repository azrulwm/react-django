import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constant";
import { isUserLoggedIn } from "../../util";
import { useEffect, useState } from "react";
function Navbar() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  useEffect(() => {
    const response = isUserLoggedIn();
    if (response) {
      setIsAuthorized(true);
    }
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(REFRESH_TOKEN);
    setIsAuthorized(false);
    return navigate("/login");
  };

  return (
    <header>
      <div className="container">
        <h1
          onClick={() => {
            navigate("/");
          }}
        >
          ARBA's Blog
        </h1>
        <nav>
          {isAuthorized && (
            <div>
              <button onClick={handleLogout}>Log out</button>
            </div>
          )}
          {!isAuthorized && (
            <div>
              {" "}
              <h2
                onClick={() => {
                  navigate("/login");
                }}
              >
                Log in
              </h2>
              <h2
                onClick={() => {
                  navigate("/register");
                }}
              >
                Sign up
              </h2>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;