import { useEffect, useState } from "react";
import { colors } from "../../../components/colors";
import Text from "../../../components/text/text";
import Textfield from "../../../components/textfield/textfield";
import UserTemplate from "../../../templates/user-template/user-template";
import styles from "./my-account.module.scss";
import { useUser } from "../../../context/user-context";
import Button from "../../../components/button/button";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../../../config/config";
import Loading from "../../../components/loader/loader";
import Container from "../../../components/container/container";
import { useSnackbar } from "../../../context/snackbar-context";
import Snackbar, { SnackbarType } from "../../../components/snackbar/snackbar";

export default function MyAccountPage() {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [pfp, setPfp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [fileLabel, setFileLabel] = useState("Click here to upload");

  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const { message, isSnackbarOpen, setIsSnackbarOpen, handleSnackbar, snackbarType } =
    useSnackbar();

  useEffect(() => {
    if (user?.ID) {
      setId(user.ID.toString());
      setPfp(user.ProfilePicture);
      setFirstName(user.FirstName);
      setLastName(user.LastName);
      setDob(user.DOB);
      setEmail(user.Email);
      setPhoneNumber(user.PhoneNumber);
      setAddress(user.Address);
      setNewsletter(user.Newsletter === "true" ? true : false);
    }
  }, [user?.ID]);

  const handlePfp = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validatedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (validatedFileTypes.includes(file.type)) {
        setFileLabel(file.name);

        try {
          const url = await uploadImage(file, setLoading);
          if (url) {
            setPfp(url);
          } else {
            throw new Error("Failed to upload image.");
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        e.target.value = "";
        setFileLabel("Choose Profile Picture");
        setPfp("");
      }
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/api/update_profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id,
        firstName,
        lastName,
        email,
        dob,
        pfp,
        address,
        phoneNumber,
        newsletter: newsletter.toString(),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      handleSnackbar(data.message, SnackbarType.Success);
      window.location.reload();
    } else {
      const error = await response.json();
      handleSnackbar(error.message, SnackbarType.Error);
    }
  };

  return (
    <UserTemplate>
      <Snackbar
        message={message}
        isOpen={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        type={snackbarType}
      />
      <Text text="My Profile" size="1.5rem" weight="700" />
      <Container>
        <div className={styles.profile_container}>
          {!loading ? (
            <img src={pfp} className={styles.pfp} alt="pfp" />
          ) : (
            <Loading type={1}/>
          )}

          <div className={styles.file_container}>
            <input
              className={styles.pfp_button}
              type="file"
              id="file"
              accept="image/jpg image/jpeg image/png"
              onChange={handlePfp}
            ></input>
            <label className={styles.pfp_label} htmlFor="file">
              {fileLabel}
            </label>
          </div>
        </div>
        <div className={styles.split_container}>
          <div className={styles.field_container}>
            <Text text="First Name" size="1rem" color={colors.secondaryText} />
            <Textfield
              className={styles.field}
              placeholder="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className={styles.field_container}>
            <Text text="Last Name" size="1rem" color={colors.secondaryText} />
            <Textfield
              className={styles.field}
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className={styles.field_container}>
            <Text
              text="Date of Birth"
              size="1rem"
              color={colors.secondaryText}
            />
            <Textfield
              className={styles.field}
              placeholder="Date of Birth"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.field_container}>
          <Text text="Email" size="1rem" color={colors.secondaryText} />
          <Textfield
            className={styles.field}
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.field_container}>
          <Text text="Phone Number" size="1rem" color={colors.secondaryText} />
          <Textfield
            className={styles.field}
            placeholder="Phone Number"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className={styles.field_container}>
          <Text text="Address" size="1rem" color={colors.secondaryText} />
          <Textfield
            className={styles.field}
            placeholder="Address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className={styles.newsletter_container}>
          <input
            id="newsletter"
            type="checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
          />
          <label className={styles.component_label} htmlFor="newsletter">
            Subsribe to Newsletter
          </label>
        </div>
        <div className={styles.button_container}>
          {!loading ? (
            <Button
              text="Save"
              className={styles.button}
              onClick={handleSave}
            />
          ) : (
            <Button
              text="Save"
              className={styles.button_loading}
            />
          )}
        </div>
      </Container>
    </UserTemplate>
  );
}
