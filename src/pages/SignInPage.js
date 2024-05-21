import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import appStyle from "../styles/App.module.css";
import AuthContext from "../contexts/AuthContext";
import { useTheme } from "../utils/ThemeSelection";

const SignInForm = () => {
  let { handleLogIn } = useContext(AuthContext);
  let { handleLogOut } = useContext(AuthContext);
  let { handleChange } = useContext(AuthContext);
  let { user, signInErrors } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <>
      {!user ? (
        <form onSubmit={handleLogIn}>
          <Row>
            <Col>
              <h3>Welcome</h3>
            </Col>
          </Row>
          <Row>
            <Col>{signInErrors != null ? <p>{signInErrors}</p> : null}</Col>
          </Row>
          <Row style={{ paddingBottom: "10px" }}>
            <Col>
              <p>Username</p>
              <input
                className={`${
                  isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed
                } ${appStyle.ButtonLarge}`}
                type="text"
                name="username"
                placeholder="Enter Username"
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <p>Password</p>
              <input
                className={`${
                  isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed
                } ${appStyle.ButtonLarge}`}
                type="password"
                name="password"
                placeholder="Enter Password"
                onChange={handleChange}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <button
                className={`${
                  isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed
                }`}
                type="submit"
              >
                Log in
              </button>
            </Col>
          </Row>
          <br />
          <Row style={{ paddingBottom: "10px" }}>
            <Col>
              <button
                className={`${
                  isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed
                }`}
                type="submit"
              >
                <Link to={"/register/"}>Create new accout</Link>
              </button>
            </Col>
          </Row>
        </form>
      ) : (
        <Row style={{ paddingBottom: "10px" }}>
          <Col>
            <button
              className={`${
                isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed
              }`}
              onClick={handleLogOut}
            >
              Log out
            </button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default SignInForm;
