import { useEffect, useState } from "react";
import Button from "../../components/button/button";
import { colors } from "../../components/colors";
import Text from "../../components/text/text";
import Textfield from "../../components/textfield/textfield";
import styles from "./forget-password.module.scss";
import Divider from "../../components/divider/divider";
import bgImg from "../../assets/image/bg.png";
import logoImg from "../../assets/image/logo_white.png";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/user-context";
import Loading from "../../components/loader/loader";
import { useSnackbar } from "../../context/snackbar-context";
import Snackbar, { SnackbarType } from "../../components/snackbar/snackbar";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confNewPassword, setConfNewPassword] = useState("");
  const { user, loading, getUser } = useUser();

  const [emailValid, setEmailValid] = useState(false);
  const [qnaValid, setQnaValid] = useState(false);

  const navigate = useNavigate();
  const {
    message,
    isSnackbarOpen,
    setIsSnackbarOpen,
    handleSnackbar,
    snackbarType,
  } = useSnackbar();

  useEffect(() => {
    getUser();
    if (user) {
      navigate(`/`);
    }
  }, [user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/api/question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      setEmailValid(true);
      setQuestion(data.Question);
    } else {
      const error = await response.json();
      handleSnackbar(error.message, SnackbarType.Error);
    }
  };

  const handleAnswer = async (e: any) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        answer,
      }),
    });

    if (response.status === 200) {
      setQnaValid(true);
    } else {
      const error = await response.json();
      handleSnackbar(error.message, SnackbarType.Error);
    }
  };

  const handleChangePassword = async (e: any) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/api/change_password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        newPassword,
        confNewPassword,
      }),
    });

    if (response.status === 200) {
      navigate(`/login`);
    } else {
      const error = await response.json();
      handleSnackbar(error.message, SnackbarType.Error);
    }
  };

  if (loading) return <Loading type={3} />;

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
          <Text text="Forget Password" size="2rem" weight="700" />
          <div className={styles.field_container}>
            {!emailValid && (
              <div className={styles.field_container}>
                <div>
                  <Text text="Email" size="1rem" color={colors.secondaryText} />
                  <Textfield
                    className={styles.field}
                    placeholder="Email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Button
                    className={styles.first_button}
                    text="Verify Email"
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            )}
            {emailValid && !qnaValid && (
              <div className={styles.field_container}>
                <div>
                  <Text
                    text={question}
                    size="1rem"
                    color={colors.secondaryText}
                  />
                  <Textfield
                    className={styles.field}
                    placeholder="Answer"
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
                <div>
                  <Button
                    className={styles.first_button}
                    text="Submit Answer"
                    onClick={handleAnswer}
                  />
                </div>
              </div>
            )}
            {qnaValid && (
              <div className={styles.field_container}>
                <div>
                  <Text
                    text="New Password"
                    size="1rem"
                    color={colors.secondaryText}
                  />
                  <Textfield
                    className={styles.field}
                    placeholder="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Text
                    text="Confirm New Password"
                    size="1rem"
                    color={colors.secondaryText}
                  />
                  <Textfield
                    className={styles.field}
                    placeholder="Confirm New Password"
                    type="password"
                    value={confNewPassword}
                    onChange={(e) => setConfNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Button
                    className={styles.first_button}
                    text="Change Password"
                    onClick={handleChangePassword}
                  />
                </div>
              </div>
            )}
            <Divider text="or login" />
            <div>
              <Button
                className={styles.third_button}
                text="Login with Password"
                redirect="/login"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <img
          className={styles.blob}
          src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/4/44de1c047b775679395479a7637ebf83.svg"
          alt="blob"
        />
        <img
          onClick={() => navigate(`/`)}
          className={styles.logo}
          src={logoImg}
          alt="logo"
        />
      </div>
      <img className={styles.bg} src={bgImg} alt="background" />
    </div>
  );
}
