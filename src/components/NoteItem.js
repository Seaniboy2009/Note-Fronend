import React from "react";
import { Link } from "react-router-dom";
import style from "../styles/NoteItem.module.css";
import appStyle from "../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useTheme } from "../contexts/ThemeSelection";

const NoteItem = (props) => {
  const {
    docId,
    title,
    // image,
    image_url,
    details,
    detailPage,
    is_private,
    toggle,
    date_created,
    category,
  } = props;
  const { activeTheme, theme } = useTheme();
  console.log("date_created:", date_created);
  const created = new Date(date_created.seconds * 1000).toLocaleDateString();
  const formattedCreated = new Date(Date.parse(date_created)).toLocaleString();
  console.log("formattedCreated:", formattedCreated);
  // const imageContainer = (
  //   <Container
  //     style={{
  //       backgroundColor: theme[activeTheme].panelColor,
  //       border: theme[activeTheme].border,
  //     }}
  //     className={` text-left  ${appStyle.BackgroundContainer}`}
  //   >
  //     <Row style={{ fontWeight: 700, fontfamily: "Gill Sans", fontSize: 25 }}>
  //       <Col>Note Image</Col>
  //     </Row>
  //     <Row>
  //       <Col>
  //         {image_url ? (
  //           <img
  //             src={image_url}
  //             className={style.ImageDetail}
  //             alt="Note image Missing"
  //           />
  //         ) : (
  //           <img
  //             src={image}
  //             className={style.ImageDetail}
  //             alt="Note image Missing"
  //           />
  //         )}
  //       </Col>
  //     </Row>
  //   </Container>
  // );
  const editModeDisabled = (
    <>
      <Container
        style={{
          backgroundColor: theme[activeTheme].panelColor,
          border: theme[activeTheme].border,
        }}
        className={` text-left  ${appStyle.BackgroundContainer}`}
      >
        <Row style={{ fontWeight: 700, fontfamily: "Gill Sans", fontSize: 25 }}>
          <Col>Note</Col>
        </Row>
        <Row style={{ fontWeight: 600, fontfamily: "Gill Sans" }}>
          <Col>
            <p>Title</p>
          </Col>
          <Col>
            <p>Category</p>
          </Col>
          <Col>
            <p>Private</p>
          </Col>
        </Row>
        <Row style={{ fontWeight: 400, fontfamily: "Gill Sans" }}>
          <Col>
            <p>{title}</p>
          </Col>
          <Col>
            <p>{category}</p>
          </Col>
          <Col>
            <p>{is_private ? "Yes" : "No"}</p>
          </Col>
        </Row>
        <Row style={{ fontWeight: 600, fontfamily: "Gill Sans" }}>
          <Col>
            <p>Created</p>
          </Col>
        </Row>
        <Row style={{ fontWeight: 400, fontfamily: "Gill Sans" }}>
          <Col>
            <p>{created}</p>
          </Col>
        </Row>
      </Container>
      <Container
        style={{
          backgroundColor: theme[activeTheme].panelColor,
          border: theme[activeTheme].border,
        }}
        className={` text-left  ${appStyle.BackgroundContainer}`}
      >
        <Row style={{ fontWeight: 700, fontfamily: "Gill Sans", fontSize: 25 }}>
          <Col>Details</Col>
        </Row>
        <Row style={{ fontWeight: 600, fontfamily: "Gill Sans" }}>
          <Col>
            <p>details</p>
          </Col>
        </Row>
        <Row style={{ fontWeight: 400, fontfamily: "Gill Sans" }}>
          <Col>
            <p>{details}</p>
          </Col>
        </Row>
      </Container>
    </>
  );

  const noteListPage = (
    <Link to={`note/${docId}`}>
      <Row
        style={{
          backgroundColor: theme[activeTheme].panelColor,
          color: theme[activeTheme].color,
          border: theme[activeTheme].border,
        }}
        className={style.NoteListItem}
      >
        <Col xs={12}>{title}</Col>
        <Col style={{ fontSize: "70%" }}>{created}</Col>
      </Row>
    </Link>
  );

  return detailPage ? (
    <>
      <Container>
        {" "}
        <Row>
          <Col xs={8}>
            <Link to={"/notes/"}>
              <i className="fa-solid fa-arrow-left" />
              &nbsp;
            </Link>
          </Col>
        </Row>
        {editModeDisabled}
        {/* {imageContainer} */}
      </Container>
    </>
  ) : (
    <>{noteListPage}</>
  );
};

export default NoteItem;
