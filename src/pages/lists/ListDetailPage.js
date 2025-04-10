import React, { useEffect, useState } from "react";
import style from "../../styles/ListDetailPage.module.css";
import { useParams, useNavigate } from "react-router-dom";
import appStyle from "../../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import ListItem from "../../components/ListItem";
import {
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { dbListItems, db } from "../../firebase";
import { useUser } from "../../contexts/UserContext";
import { addDoc } from "firebase/firestore";
import { useTheme } from "../../contexts/ThemeSelection";
import ThemedButton from "../../components/ThemedButton";
import DeleteModal from "../../components/DeleteModal";
import ThemedInput from "../../components/ThemedInput";

const ListDetailPage = () => {
  const navigate = useNavigate();
  const { docId } = useParams();
  const [list, setList] = useState({});
  const [items, setItems] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [acendingOrder, setAcendingOrder] = useState(true);
  const userFirestore = useUser();
  const { activeTheme, theme } = useTheme();
  const [content, setContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);

  const getLists = async () => {
    if (!userFirestore) return;
    try {
      const docRef = doc(db, "lists", docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setList({ docId: docSnap.id, ...docSnap.data() });
      }

      // Fetch list items
      const queryListItems = query(dbListItems, where("listId", "==", docId));
      const querySnapshot = await getDocs(queryListItems);
      const listItems = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        let dateCreated = null;

        // Check if date_created is a Firestore Timestamp
        if (data.date_created instanceof Timestamp) {
          dateCreated = new Date(
            data.date_created.seconds * 1000
          ).toISOString();
        }
        // If date_created is already an ISO string, just use it directly
        else if (typeof data.date_created === "string") {
          dateCreated = data.date_created;
        }

        return {
          docId: doc.id,
          ...data,
          dateCreated, // Safe assignment of formatted dateCreated
        };
      });

      // Sort items
      const sortedItems = listItems.sort((a, b) => {
        const dateA = new Date(a.dateCreated);
        const dateB = new Date(b.dateCreated);
        return acendingOrder ? dateA - dateB : dateB - dateA;
      });

      console.log("sortedItems", sortedItems);
      setItems(sortedItems);

      setHasLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateItem = async () => {
    if (!userFirestore) return;
    if (!userFirestore.user) return;

    if (!content) {
      console.log("Content is empty");
      setError("Content is empty");
      return;
    }

    const newEntryData = {
      content: content,
      date_created: new Date().toISOString(),
      listId: docId,
    };

    try {
      const listItemCreatedResponse = await addDoc(dbListItems, newEntryData);
      setContent(""); // Clear the input field
      setError(null); // Clear any error message
      getLists(); // Refresh the list items
      console.log("noteCreatedResponse", listItemCreatedResponse);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleDeleteList = async () => {
    try {
      const listRef = doc(db, "lists", list.docId);
      const listItemsQuery = query(
        dbListItems,
        where("listId", "==", list.docId)
      );
      const querySnapshot = await getDocs(listItemsQuery);

      if (!querySnapshot.empty) {
        const batch = writeBatch(db);

        querySnapshot.forEach((docSnap) => {
          const listItemRef = doc(dbListItems, docSnap.id);
          batch.delete(listItemRef);
        });

        await batch.commit();
      }

      await deleteDoc(listRef);

      navigate("/lists/");
    } catch (error) {
      console.error("Error deleting list and items:", error);
    }
  };

  const handleToggleItem = async (itemToUpdate) => {
    try {
      const docRef = doc(dbListItems, itemToUpdate.docId);
      const newToggleState = !itemToUpdate.toggle;

      // Define the fields to update
      const updateData = {
        toggle: newToggleState,
        completedDate: newToggleState
          ? new Date().toISOString() // Set current date when toggle is true
          : null, // Reset to null if toggle is false
      };

      // Update Firestore document
      await updateDoc(docRef, updateData);

      // Update state locally
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.docId === itemToUpdate.docId
            ? { ...item, ...updateData } // Merge updated fields into the item
            : item
        )
      );

      console.log(
        `Item ${itemToUpdate.docId} toggle updated successfully. New state: ${newToggleState}`
      );
    } catch (error) {
      console.error("Error updating toggle state:", error);
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      // Delete the list item from Firestore
      await deleteDoc(doc(dbListItems, item.docId));
      console.log(`Item ${item.docId} deleted successfully`);

      // Update local state to remove the deleted item from the UI
      setItems((prevItems) => prevItems.filter((i) => i.docId !== item.docId));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleShowDeleteListModal = () => {
    console.log("Show delete list modal");
    setShowDeleteModal(true);
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

  return (
    <Container className={appStyle.Container} style={{ paddingBottom: "25px" }}>
      {hasLoaded ? (
        <>
          <Row>
            <Col xs={1}>
              <Link to={"/lists/"}>
                <i className="fa-solid fa-arrow-left" />
              </Link>
            </Col>
            <Col xs={7}>
              <h5>
                {console.log("list", list)}
                {list.title}
              </h5>
              <p>
                {" "}
                {new Date(list.date_created).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </Col>
            <Col xs={4}>
              <ThemedButton onClick={() => handleShowDeleteListModal()}>
                Delete
              </ThemedButton>
            </Col>
          </Row>
          <br />
          <Container
            className={style.ListContainer}
            style={{
              backgroundColor: theme[activeTheme].panelColor,
              border: theme[activeTheme].border,
            }}
          >
            <Row>
              <Col xs={9}>
                <ThemedInput value={content} onChange={handleChange} />
                {error ? <span style={{ color: "red" }}>{error}</span> : null}
              </Col>
              <Col xs={3}>
                <ThemedButton size="small" onClick={handleCreateItem}>
                  Add
                </ThemedButton>
              </Col>
            </Row>
          </Container>
          {items?.map((listItem, index) => (
            <ListItem
              getLists={getLists}
              key={listItem.docId}
              listItem={listItem}
              onToggle={handleToggleItem}
              onDelete={handleDeleteItem}
            />
          ))}
          <br />
          <div>
            <DeleteModal
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              onDelete={handleDeleteList}
              message={`Are you sure you want to delete the list: ${list.title}?`}
            ></DeleteModal>
          </div>
        </>
      ) : (
        <Loader spinner text="Loading lists, please wait" />
      )}
    </Container>
  );
};

export default ListDetailPage;
