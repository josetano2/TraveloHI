import { useEffect, useState } from "react";
import Container from "../../../components/container/container";
import Textarea from "../../../components/textarea/textarea";
import AdminTemplate from "../../../templates/admin-template/admin-template";
import Text from "../../../components/text/text";
import Button from "../../../components/button/button";
import styles from "./send-newsletter.module.scss";
import { IUser } from "../../../interfaces/user-interface";
import Textfield from "../../../components/textfield/textfield";
import { useSnackbar } from "../../../context/snackbar-context";
import Snackbar, { SnackbarType } from "../../../components/snackbar/snackbar";

export default function AdminSendNewsletterPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);
  const {
    message: snackbarMessage,
    isSnackbarOpen,
    setIsSnackbarOpen,
    handleSnackbar,
    snackbarType,
  } = useSnackbar();

  const getAllSubscribedUsers = async () => {
    const response = await fetch(
      "http://localhost:8080/api/get_all_subscribed_users",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  const handleNewsletter = async () => {
    const response = await fetch("http://localhost:8080/api/send_newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        title,
        message,
      }),
    });
    if (response.ok) {
      const res = await response.json();
      handleSnackbar(res.message, SnackbarType.Success);
    }
  };

  useEffect(() => {
    getAllSubscribedUsers();
  }, []);

  return (
    <AdminTemplate>
      {/* <div className={styles.newsletter_container}> */}
        <Snackbar
          message={snackbarMessage}
          isOpen={isSnackbarOpen}
          onClose={() => setIsSnackbarOpen(false)}
          type={snackbarType}
        />
        <Text text="Send Newsletter to Subscriber" size="1.5rem" weight="700" />
        <Container className={styles.newsletter_container}>
          <Textfield
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
          />
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Newsletter"
          />
          <Button
            text="Send Newsletter"
            onClick={
              message === "" || title === "" ? () => {} : handleNewsletter
            }
            className={`${
              message === "" || title === "" ? styles.button_loading : ""
            }`}
          />
        </Container>
        <Text text="List of Subscribers" size="1.5rem" weight="700" />
        <Container className={styles.newsletter_container}>
          <>
            {users.length > 0 ? (
              users.map((user: IUser, idx) => {
                if (user.Newsletter === "true") {
                  return (
                    <Text
                      key={idx}
                      text={`${user.FirstName} ${user.LastName}`}
                      size="1.2rem"
                      weight="700"
                    />
                  );
                }
              })
            ) : (
              <Text text="No Subscriber" size="1.2rem" weight="700" />
            )}
          </>
        </Container>
      {/* </div> */}
    </AdminTemplate>
  );
}
