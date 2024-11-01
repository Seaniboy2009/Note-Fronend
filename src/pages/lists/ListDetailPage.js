import React, { useEffect, useState, useContext } from "react";
import style from "../../styles/ListDetailPage.module.css";
import { useParams, useNavigate } from "react-router-dom";
import appStyle from "../../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../api/axiosDefaults";
import Modal from "react-bootstrap/Modal";
import Loader from "../../components/Loader";
import ListItem from "../../components/ListItem";
import { getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { dbLists, dbListItems, db } from "../../firebase";
import { useUser } from "../../contexts/UserContext";
import { addDoc } from "firebase/firestore";
import { useTheme } from "../../contexts/ThemeSelection";
import ThemedButton from "../../components/ThemedButton";
const useNewDb = true; // ***********TODO remove this once new db is fully implemented**********

const ListDetailPage = () => {
  const navigate = useNavigate();
  const { docId } = useParams();
  const [list, setList] = useState({});
  const [items, setItems] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const userFirestore = useUser();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { activeTheme, theme } = useTheme();
  const [formData, setFormData] = useState({
    content: "",
  });

  const { content } = formData;

  const getLists = async () => {
    console.log("Get list detail called");
    console.log("docId:", docId);
    try {
      if (useNewDb) {
        const docRef = doc(db, "lists", docId);
        const docSnap = await getDoc(docRef);
        let listResponse;
        console.log(docSnap);
        if (docSnap.exists()) {
          // Convert document data into an object
          listResponse = {
            docId: docSnap.id, // Firestore document ID
            ...docSnap.data(), // Document data
          };
          console.log(listResponse);
          setList(listResponse);
        }
        const queryListItems = query(
          dbListItems,
          where("listId", "==", listResponse.docId)
        );
        const querySnapshot = await getDocs(queryListItems);
        const listItemsResponse = querySnapshot.docs.map((doc) => ({
          docId: doc.id, // Firestore document ID
          ...doc.data(), // Document data
        }));
        console.log(listItemsResponse);
        setItems(listItemsResponse);
        setHasLoaded(true);
      } else {
        const [{ data: list }, { data: items }] = await Promise.all([
          axiosInstance.get(`/api/lists/${docId}`),
          axiosInstance.get(`/api/listitems/?list=${docId}`),
        ]);
        setList(list);
        console.log(items);
        setItems(items);
        setHasLoaded(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateItem = async () => {
    if (!userFirestore) return;
    if (!userFirestore.user) return;
    console.log("userFirestore", userFirestore);
    const formData = new FormData();
    formData.append("title", content);

    try {
      const listItemCreatedResponse = await addDoc(dbListItems, {
        content: content,
        date_created: new Date(),
        listId: docId,
      });
      setEdit(false);
      getLists();
      console.log("noteCreatedResponse", listItemCreatedResponse);
    } catch (error) {
      console.log("Error updating payment db:", error);
    }
  };

  const handleChange = (event) => {
    console.log("Handle change called");
    setFormData({ ...formData, content: event.target.value });
  };

  const handleDelete = async (e) => {
    console.log("Handle delete called");
    try {
      await axiosInstance.delete(`/api/lists/${list.id}`);
      navigate("/lists/");
    } catch (error) {}
  };

  const handleDeleteItem = async (itemToDelete) => {
    console.log("Handle delete item called");
    try {
      await axiosInstance.delete(`/api/listitems/${itemToDelete.id}`);
      getLists();
    } catch (error) {}
  };

  const toggleEditMode = () => {
    setEdit(!edit);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getLists();
    }, 1000);

    setHasLoaded(false);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const modelShow = (
    <>
      <Modal show={show} onHide={handleClose} className={style.Modal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please confirm you want to delete this list</Modal.Body>
        <Modal.Footer>
          <button className={appStyle.Button} onClick={handleClose}>
            Cancel
          </button>
          <button className={appStyle.Button} onClick={handleDelete}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );

  return (
    <Container className={appStyle.Container}>
      <>{modelShow}</>
      {hasLoaded ? (
        <>
          <Row>
            <Col xs={1}>
              <Link to={"/lists/"}>
                <i className="fa-solid fa-arrow-left" />
              </Link>
            </Col>
            <Col xs={6}>
              <h5>List: {list.title}</h5>
            </Col>
            <Col xs={2}>
              <button onClick={handleShow} className={appStyle.ButtonLists}>
                <i className="fa-solid fa-trash" />
              </button>
            </Col>
            <Col xs={2}>
              <button
                onClick={toggleEditMode}
                className={`${appStyle.ButtonLists}`}
              >
                <i className=" fa-solid fa-pen-to-square" />
              </button>
            </Col>
          </Row>
          {edit ? (
            <Container
              className={style.ListContainer}
              style={{
                backgroundColor: theme[activeTheme].pannelColor,
                border: theme[activeTheme].border,
              }}
            >
              <Row>
                <Col>
                  <input
                    id="textInput"
                    onChange={handleChange}
                    // className={style.InputArea}
                    autofocus
                    placeholder="Type here"
                  ></input>
                </Col>
                <Col>
                  <ThemedButton size="small" onClick={handleCreateItem}>
                    Add
                  </ThemedButton>
                </Col>
              </Row>
            </Container>
          ) : null}
          {items?.map((item, index) => (
            <ListItem getLists={getLists} key={index} item={item} edit={edit} />
          ))}
          <br />
        </>
      ) : (
        <Loader spinner text="Loading lists, please wait" />
      )}
    </Container>
  );
};

export default ListDetailPage;
