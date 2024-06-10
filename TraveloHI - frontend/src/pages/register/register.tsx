import { useEffect, useState } from "react";
import styles from "./register.module.scss";
import bgImg from "../../assets/image/bg.png";
import logoImg from "../../assets/image/logo_white.png";
import Text from "../../components/text/text";
import Textfield from "../../components/textfield/textfield";
import { colors } from "../../components/colors";
import Button from "../../components/button/button";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/theme-context";
import Snackbar, { SnackbarType } from "../../components/snackbar/snackbar";
import { uploadImage } from "../../config/config";
import Loading from "../../components/loader/loader";
import { useSnackbar } from "../../context/snackbar-context";
import { useUser } from "../../context/user-context";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [question, setQuestion] = useState(questions[0]);
  const [answer, setAnswer] = useState("");
  const [fileLabel, setFileLabel] = useState("Choose Profile Picture");
  const [pfp, setPfp] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const { theme } = useTheme();
  const { message, isSnackbarOpen, setIsSnackbarOpen, handleSnackbar, snackbarType } =
    useSnackbar();

  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {user, loading: userLoading, getUser} = useUser();

  const navigate = useNavigate();

  const onCaptchaChange = (value: any) => {
    setCaptchaValue(value);
  };

  useEffect(() => {
    getUser();
    if (user) {
      navigate(`/`);
    }
  }, [user]);

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (captchaValue == null) {
      handleSnackbar("Captcha must be filled!", SnackbarType.Error);
      return;
    }

    const response = await fetch("http://localhost:8080/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        dob,
        gender,
        password,
        confirmPassword,
        question,
        answer,
        pfp,
        newsletter: newsletter.toString(),
      }),
    });

    if (response.status === 200) {
      navigate(`/login`);
    } else {
      const error = await response.json();
      handleSnackbar(error.message, SnackbarType.Error);
    }
  };

  if(userLoading) return <Loading type={3}/>

  return (
    <div className={styles.main_container}>
      <Snackbar
        message={message}
        isOpen={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        type={snackbarType}
      />
      <div className={styles.login_container}>
        <div className={styles.text_container}>
          <Text
            text="From Southeast Asia to the World, All Yours"
            size="3rem"
            color="#ffffff"
            weight="700"
          />
        </div>
        <div className={styles.form_container}>
          <Text text="Register" size="2rem" weight="700" />
          <div className={styles.split_container}>
            <div>
              <Text
                text="First Name"
                size="1rem"
                color={colors.secondaryText}
              />
              <Textfield
                className={styles.field}
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <Text text="Last Name" size="1rem" color={colors.secondaryText} />
              <Textfield
                className={styles.field}
                placeholder="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
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
          <div className={styles.email_radio_container}>
            <div className={styles.email_container}>
              <Text text="Email" size="1rem" color={colors.secondaryText} />
              <Textfield
                className={styles.field}
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.radio_container}>
              <Text text="Gender" size="1rem" color={colors.secondaryText} />
              <div className={styles.radio_gap}>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={(e) => setGender(e.target.value)}
                  checked={gender === "Male"}
                />
                <label className={styles.component_label} htmlFor="male">
                  Male
                </label>{" "}
                <br />
              </div>
              <div className={styles.radio_gap}>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={(e) => setGender(e.target.value)}
                  checked={gender === "Female"}
                />
                <label className={styles.component_label} htmlFor="female">
                  Female
                </label>
              </div>
            </div>
          </div>
          <div className={styles.split_container}>
            <div>
              <Text text="Password" size="1rem" color={colors.secondaryText} />
              <Textfield
                className={styles.field}
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Text
                text="Confirm Password"
                size="1rem"
                color={colors.secondaryText}
              />
              <Textfield
                className={styles.field}
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Text text="Question" size="1rem" color={colors.secondaryText} />
            <select
              className={styles.combo_box}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            >
              {questions.map((q, idx) => (
                <option key={idx} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Text text="Answer" size="1rem" color={colors.secondaryText} />
            <Textfield
              className={styles.field}
              placeholder="Answer"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
          <div className={styles.bottom_container}>
            <div className={styles.bottom_left_container}>
              {!loading ? (
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
              ) : (
                <Loading type={2} />
              )}

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
            </div>
            <ReCAPTCHA
              sitekey="6LePf1kpAAAAAN9gW5tov9cndMmfsxUr8BsDU_T6"
              onChange={onCaptchaChange}
              theme={theme === "dark" ? "dark" : "light"}
            />
          </div>
          <div>
            <Button
              className={styles.button}
              text="Register"
              onClick={handleSubmit}
            />
            <Button
              className={styles.hyperlink}
              text="Have an account? Click here!"
              redirect="/login"
            />
          </div>
        </div>
      </div>
      <div>
        <img
          className={styles.blob}
          src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/4/44de1c047b775679395479a7637ebf83.svg"
          alt="blob"
        />
        <img className={styles.logo} src={logoImg} alt="logo" />
      </div>
      <img
        onClick={() => navigate(`/`)}
        className={styles.bg}
        src={bgImg}
        alt="background"
      />
    </div>
  );
}

const questions = [
  "What is your favorite childhood pet's name?",
  "In which city where you are born?",
  "What is the name of your favorite book or movie?",
  "What is the name of the elementary school you attended?",
  "What is the model of your first car?",
];
