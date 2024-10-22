import { useNavigate } from "react-router-dom";
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
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setIsAuthorized(false);
    return navigate("/login");
  };

  return (
    <header>
      <div className="container">
        <h1
          className="home-logo"
          onClick={() => {
            navigate("/");
          }}
        >
          ARBA's Shoutout!
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
