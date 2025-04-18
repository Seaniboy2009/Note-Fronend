import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import appStyle from "../../styles/App.module.css";
import { useTheme } from "../../contexts/ThemeSelection";
import { updateDoc, getDocs } from "firebase/firestore";
import { useUser } from "../../contexts/UserContext";
import { dbUsers, auth } from "../../firebase";
import ThemedButton from "../../components/ThemedButton";
import AdminPage from "./AdminPage";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUserSettings } from "../../contexts/UserSettingsContext";

const AccountPage = () => {
  const { userData } = useUser();
  const { isDarkMode, changeTheme, activeTheme, theme } = useTheme();
  const admin = userData?.admin || false;
  const [userEmailToGrantAccess, setUserEmailToGrantAccess] = useState("");
  const calendarsSharedWithUser = userData?.sharedCalendars || [];
  const [calendarsWithAccess, setCalendarsWithAccess] = useState([]);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [removingAccess, setRemovingAccess] = useState(false);
  const [requestingRemovingAccess, setRequestingRemovingAccess] =
    useState(false);
  const advancedFeatures = userData?.advancedUser || false;

  const { settings, updateSettings } = useUserSettings();

  const handleUpdateIcons = (newValue) => {
    updateSettings({ useIcons: newValue });
  };

  let navigate = useNavigate();

  useEffect(() => {
    const fetchCalendarsYouHaveAccessTo = async () => {
      try {
        const snapshot = await getDocs(dbUsers);
        const calendars = [];

        snapshot.docs.forEach((doc) => {
          const userData = doc.data();
          const sharedCalendars = userData.sharedCalendars || [];

          // Check if your user ID is in their sharedCalendars
          const isSharedWithYou = sharedCalendars.some(
            (sharedCalendar) => sharedCalendar.userId === userData.user.uid
          );

          if (isSharedWithYou) {
            calendars.push({
              userId: doc.id, // Owner of the calendar
              email: userData.email, // Email of the calendar owner
              removalRequested: sharedCalendars.some(
                (sharedCalendar) =>
                  sharedCalendar.userId === userData.user.uid &&
                  sharedCalendar.removalRequested
              ),
            });
          }
        });

        setCalendarsWithAccess(calendars);
      } catch (error) {
        console.error("Error fetching calendars you have access to: ", error);
      }
    };

    fetchCalendarsYouHaveAccessTo();
  }, [userData]);

  const handleGrantAccess = () => {
    console.log("Grant access to calendar");
    setLoadingData(true);

    if (!userEmailToGrantAccess) {
      console.error("Email address is required");
      setError("Email address is required");
      setLoadingData(false);
      return;
    }

    if (userEmailToGrantAccess === userData.user.email) {
      console.error("You cannot grant access to yourself");
      setError("You cannot grant access to yourself");
      setLoadingData(false);
      return;
    }

    try {
      getDocs(dbUsers).then((snapshot) => {
        let userFound = false;
        let alreadyHasAccess = false;

        snapshot.docs.forEach((doc) => {
          const userData = doc.data();

          if (userData.email === userEmailToGrantAccess) {
            userFound = true;

            const currentSharedCalendars = userData.sharedCalendars || [];
            alreadyHasAccess = currentSharedCalendars.some(
              (sharedCalendar) => sharedCalendar.userId === userData.user.uid
            );

            if (alreadyHasAccess) {
              console.error("This user already has access to your calendar");
              setError("This user already has access to your calendar");
              return;
            }

            const newCalendar = {
              userId: userData.user.uid,
              name: userData.user.email || "Your Calendar",
            };

            const updatedSharedCalendars = [
              ...currentSharedCalendars,
              newCalendar,
            ];

            updateDoc(doc.ref, { sharedCalendars: updatedSharedCalendars })
              .then(() => {
                console.log("Calendar access granted");
                setError("");

                // Update calendarsWithAccess
                setCalendarsWithAccess((prev) => [
                  ...prev,
                  { userId: doc.id, email: userEmailToGrantAccess },
                ]);
              })
              .catch((error) => {
                console.error("Error granting access: ", error);
                setError("Error granting access. Please try again.");
              });
          }
        });

        if (!userFound) {
          console.error("User with the specified email was not found");
          setError("User with the specified email was not found");
        }
      });
    } catch (error) {
      console.error("Error granting access: ", error);
      setLoadingData(false);
      setError("An error occurred while granting access. Please try again.");
    }
    setLoadingData(false);
  };

  //Request to be removed from other users calendar
  const handleRequestRemoval = (calendar) => {
    console.log("Remove access requested");
    setRequestingRemovingAccess(true);

    // First, update the calendar owner’s sharedCalendars
    try {
      getDocs(dbUsers).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          if (doc.data().userId === userData.user.uid) {
            const currentSharedCalendars = doc.data().sharedCalendars || [];

            // Find the calendar to mark for removal request
            const updatedSharedCalendars = currentSharedCalendars.map(
              (sharedCalendar) => {
                if (sharedCalendar.name === calendar.name) {
                  return {
                    ...sharedCalendar,
                    removalRequested: true, // Add the removalRequested flag
                  };
                }
                return sharedCalendar;
              }
            );

            updateDoc(doc.ref, { sharedCalendars: updatedSharedCalendars })
              .then(() =>
                console.log("Removal request marked on owner’s shared calendar")
              )
              .catch((error) =>
                console.error(
                  "Error marking removal request on owner’s shared calendar: ",
                  error
                )
              );
          }

          // Now, update the user’s sharedCalendars to mark removal request
          if (doc.data().email === calendar.email) {
            const currentSharedCalendars = doc.data().sharedCalendars || [];

            // Find the shared calendar and mark it as requested for removal
            const updatedSharedCalendars = currentSharedCalendars.map(
              (sharedCalendar) => {
                if (sharedCalendar.name === calendar.name) {
                  return {
                    ...sharedCalendar,
                    removalRequested: true, // Add the removalRequested flag
                  };
                }
                return sharedCalendar;
              }
            );

            updateDoc(doc.ref, { sharedCalendars: updatedSharedCalendars })
              .then(() =>
                console.log("Removal request marked on user's shared calendar")
              )
              .catch((error) =>
                console.error(
                  "Error marking removal request on user’s shared calendar: ",
                  error
                )
              );
          }
        });
      });
      setRequestingRemovingAccess(false);
    } catch (error) {
      console.error("Error handling removal request: ", error);
      setRequestingRemovingAccess(false);
    }
  };

  //Remove access from a user
  const handleRemoveAccessFromUser = (calendar) => {
    console.log("Remove user access");
    setRemovingAccess(true);
    try {
      getDocs(dbUsers).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const userData = doc.data();

          if (userData.email === calendar.email) {
            const currentSharedCalendars = userData.sharedCalendars || [];
            const updatedSharedCalendars = currentSharedCalendars.filter(
              (sharedCalendar) => sharedCalendar.userId !== userData.user.uid
            );

            updateDoc(doc.ref, { sharedCalendars: updatedSharedCalendars })
              .then(() => {
                console.log("Removed user access");
                setError(""); // Reset error message on success
                // Update the `calendarsWithAccess` state after removing access
                setCalendarsWithAccess((prev) =>
                  prev.filter((cal) => cal.userId !== calendar.userId)
                );
              })
              .catch((error) => {
                console.error("Error removing user access: ", error);
                setError("Error removing user access. Please try again.");
              });
          }
        });
      });
      setRemovingAccess(false);
    } catch (error) {
      console.error("Error removing access: ", error);
      setError("Error removing access. Please try again.");
      setRemovingAccess(false);
    }
  };

  const handleSignOut = async () => {
    try {
      signOut(auth)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (userData) {
    return (
      <Container style={{ marginBottom: admin ? "10vh" : undefined }}>
        <Row>
          <Col>
            <p>Welcome back,</p>
            <p>
              <bold>{userData?.user?.email}</bold>
            </p>
          </Col>
          <Col>
            <ThemedButton onClick={handleSignOut}>Sign out</ThemedButton>
          </Col>
        </Row>
        {/* Account details */}
        <Container
          style={{
            backgroundColor: theme[activeTheme].panelColor,
            border: theme[activeTheme].border,
          }}
          className={appStyle.BackgroundContainer}
        >
          <Row>
            <Col>
              <p>Account Details</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>Created: {userData?.dateCreated}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>Email: {userData?.user?.email}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                Advanced Features: {advancedFeatures ? "Enabled" : "Disabled"}
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <p>Enable Icons</p>
            </Col>
            <Col xs={6}>
              <input
                name="theme"
                className={isDarkMode ? appStyle.TextTest : appStyle.TextRed}
                checked={settings.useIcons}
                type="checkbox"
                onChange={() => handleUpdateIcons(!settings.useIcons)}
              />
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              {settings.useIcons ? (
                <i className="fa-solid fa-palette"></i>
              ) : (
                <p>Theme's</p>
              )}
            </Col>
            {Object.entries(theme)
              .filter(
                ([themeName]) =>
                  advancedFeatures ||
                  themeName === "Basic" ||
                  themeName === "BasicLessContrast"
              )
              .map(([themeName], index) => (
                <>
                  <Col xs={6} key={index}>
                    <p>{themeName}</p>
                  </Col>
                  <Col xs={6}>
                    <input
                      name="theme"
                      checked={activeTheme === themeName}
                      type="radio"
                      onChange={() => changeTheme(themeName)}
                    />
                  </Col>
                </>
              ))}
          </Row>
        </Container>
        {/* Shared Access */}
        {advancedFeatures ? (
          <>
            <Container
              style={{
                backgroundColor: theme[activeTheme].panelColor,
                border: theme[activeTheme].border,
                paddingBottom: 10,
              }}
              className={appStyle.BackgroundContainer}
            >
              <Row>
                <Col>
                  <h5>Shared Access</h5>
                </Col>
              </Row>
              <Row>
                <Col>
                  {" "}
                  <p>Grant Access to Your Calendar</p>
                </Col>
              </Row>
              <Row
                className="justify-content-md-center"
                style={{ marginBottom: 10 }}
              >
                <Col>
                  <input
                    type="email"
                    value={userEmailToGrantAccess}
                    onChange={(e) => setUserEmailToGrantAccess(e.target.value)}
                    placeholder="Enter email address"
                    style={{
                      padding: "8px",
                      backgroundColor: theme[activeTheme].panelColor,
                      color: theme[activeTheme].color,
                      border: "1px solid",
                    }}
                  />
                </Col>
              </Row>
              <Row>
                {error ? (
                  <Col>
                    <p style={{ color: "red" }}>{error}</p>
                  </Col>
                ) : null}
              </Row>
              <Row>
                <Col>
                  <ThemedButton
                    onClick={handleGrantAccess}
                    disabled={loadingData}
                    fullWidth={false}
                  >
                    {loadingData ? "Loading..." : "Grant Access"}
                  </ThemedButton>
                </Col>
              </Row>
            </Container>
            {/* Users with Access to Your Calendar */}
            <Container
              style={{
                backgroundColor: theme[activeTheme].panelColor,
                border: theme[activeTheme].border,
                paddingBottom: 10,
              }}
              className={appStyle.BackgroundContainer}
            >
              <Row>
                <Col>
                  <h5>Users with Access to Your Calendar</h5>
                </Col>
              </Row>
              {calendarsWithAccess.length > 0 ? (
                calendarsWithAccess?.map((calendar) => (
                  <>
                    <Row
                      key={calendar.userId}
                      xs={1}
                      md={3}
                      style={{
                        borderTop: "2px solid",
                        borderColor: `${theme[activeTheme].altColor}`,
                        paddingTop: "5px",
                      }}
                    >
                      <Col>
                        {calendar.name ? "Name: " || calendar.email : "Email: "}
                        {calendar.name || calendar.email}
                      </Col>
                      <Col>
                        {calendar.removalRequested
                          ? "Requested to be removed"
                          : null}
                      </Col>
                      <Col>
                        <ThemedButton
                          onClick={() => handleRemoveAccessFromUser(calendar)}
                          disabled={removingAccess}
                        >
                          {removingAccess ? "Loading..." : "Remove Access"}
                        </ThemedButton>
                      </Col>
                    </Row>
                    <br />
                  </>
                ))
              ) : (
                <p>You have not shared any Calendars</p>
              )}
            </Container>

            {/* Calendars You Have Access To */}
            <Container
              style={{
                backgroundColor: theme[activeTheme].panelColor,
                border: theme[activeTheme].border,
                paddingBottom: 10,
              }}
              className={appStyle.BackgroundContainer}
            >
              <Row>
                <Col>
                  <h5>Calendars Shared With You</h5>
                </Col>
              </Row>
              {calendarsSharedWithUser.length > 0 ? (
                calendarsSharedWithUser?.map((calendar) => (
                  <Row
                    key={calendar.userId}
                    xs={1}
                    md={3}
                    style={{
                      borderTop: "2px solid",
                      borderColor: `${theme[activeTheme].altColor}`,
                      paddingTop: "5px",
                    }}
                  >
                    <Col>{calendar.name || calendar.email}</Col>
                    {console.log("calendars shared with user", calendar)}
                    <Col></Col>
                    <Col>
                      {calendar.removalRequested ? (
                        <span>Removal requested</span>
                      ) : (
                        <ThemedButton
                          onClick={() => handleRequestRemoval(calendar)}
                          disabled={requestingRemovingAccess}
                        >
                          {requestingRemovingAccess
                            ? "Loading..."
                            : "Request Removal"}
                        </ThemedButton>
                      )}
                    </Col>
                  </Row>
                ))
              ) : (
                <p>No one has shared there Calendar with you</p>
              )}
            </Container>
          </>
        ) : (
          <Container
            style={{
              backgroundColor: theme[activeTheme].panelColor,
              border: theme[activeTheme].border,
            }}
            className={appStyle.BackgroundContainer}
          >
            <Row>
              <Col>
                <p>Shared Access</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>Advanced features are required to access this page</p>
              </Col>
            </Row>
          </Container>
        )}
        {/* Admin for testing only*/}
        {/* {admin && (
          <Container
            style={{
              backgroundColor: theme[activeTheme].panelColor,
              border: theme[activeTheme].border,
            }}
            className={appStyle.BackgroundContainer}
          >
            <Row>
              <Col>{admin && <p>Admin</p>}</Col>
            </Row>

            {Object.entries(userData).map(([key, value]) => (
              <Row
                key={`${value} ${key}`}
                style={{ padding: "5px", textAlign: "left" }}
              >
                {" "}
                <Col>
                  <strong>{key}:</strong>{" "}
                  {typeof value === "object" && !Array.isArray(value) ? (
                    // If it's an object, format its properties
                    <pre>{JSON.stringify(value, null, 2)}</pre>
                  ) : Array.isArray(value) ? (
                    // If it's an array, handle accordingly
                    <pre>{JSON.stringify(value, null, 2)}</pre>
                  ) : (
                    // For primitive values
                    value.toString()
                  )}
                </Col>
              </Row>
            ))}
          </Container>
        )} */}
        {/* Admin Page */}
        {admin && <AdminPage />}
      </Container>
    );
  }
};

export default AccountPage;
