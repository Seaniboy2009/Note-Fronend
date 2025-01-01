import React, { useContext, useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import appStyle from "../../styles/App.module.css";
import { useTheme } from "../../contexts/ThemeSelection";
import { getDocs } from "firebase/firestore";
import { useUser } from "../../contexts/UserContext";
import { dbUsers } from "../../firebase";
import ThemedButton from "../../components/ThemedButton";

const AdminPage = ({ props }) => {
  const userFirestore = useUser();
  const { activeTheme, theme } = useTheme();
  const admin = userFirestore?.admin || false;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (admin) {
      // Fetch all users from Firestore
      getDocs(dbUsers)
        .then((snapshot) => {
          let users = [];

          snapshot.docs.forEach((doc) => {
            console.log("User", doc.data());
            const email = doc.data()?.email;
            const userId = doc.data()?.userId;
            const admin = doc.data()?.admin;
            users.push({
              ...doc.data(),
              id: doc.id || "No id",
              email: email || "No email",
              userId: userId || "No userId",
              admin: admin || false,
            });
          });
          setUsers(users);
          console.log("users:", users);
        })
        .catch((error) => {
          console.log("Error getting documents:", error);
        });
      console.log("users:", users);
    }
  }, [admin]);

  return (
    <Container
      style={{
        backgroundColor: theme[activeTheme].pannelColor,
        border: theme[activeTheme].border,
      }}
      className={appStyle.BackgroundContainer}
    >
      <Row>
        <Col>{admin && <p>Users</p>}</Col>
      </Row>

      {users.map((user) => (
        <Row
          key={`${user.userId} ${user.email}`}
          style={{ padding: "5px", textAlign: "left" }}
        >
          {" "}
          <Col>
            <strong>
              Email: {user.email} {user.admin ? "A" : null}{" "}
              {user.advancedUser ? "/ U" : null}
            </strong>{" "}
            <ThemedButton onClick={() => console.log("Edit user")}>
              {user.admin ? "Remove admin" : "Make admin"}
            </ThemedButton>
            <ThemedButton onClick={() => console.log("Edit user")}>
              {user.advancedUser
                ? "Remove advanced user"
                : "Make advanced user"}
            </ThemedButton>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default AdminPage;
