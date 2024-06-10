import { useEffect, useState } from "react";
import Button from "../../components/button/button";
import { colors } from "../../components/colors";
import Text from "../../components/text/text";
import Textfield from "../../components/textfield/textfield";
import styles from "./otp.module.scss";
import Divider from "../../components/divider/divider";
import bgImg from "../../assets/image/bg.png";
import logoImg from "../../assets/image/logo_white.png";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/theme-context";
import { useUser } from "../../context/user-context";
import { useSnackbar } from "../../context/snackbar-context";
import Snackbar, { SnackbarType } from "../../components/snackbar/snackbar";
import Loading from "../../components/loader/loader";

export default function OTPPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const { theme } = useTheme();
  const { user, loading, getUser } = useUser();
  const { message, isSnackbarOpen, setIsSnackbarOpen, handleSnackbar, snackbarType } =
    useSnackbar();

  const [emailValid, setEmailValid] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    if (user) {
      navigate(`/`);
    }
  }, [user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (captchaValue == null) {
      handleSnackbar("Captcha must be filled!", SnackbarType.Error);
      return;
    }

    const response = await fetch("http://localhost:8080/api/send_otp", {
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
      // munculin otp bar
      setEmailValid(true);
    } else {
      const error = await response.json();
      handleSnackbar(error.message, SnackbarType.Error);
      console.log(error.message);
    }
  };

  const handleOTPSubmit = async (e: any) => {
    e.preventDefault();
    if (captchaValue == null) {
      handleSnackbar("Captcha must be filled!", SnackbarType.Error);
      return;
    }
    const response = await fetch("http://localhost:8080/api/verify_otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        otp,
      }),
    });

    if (response.status === 200) {
      // redirect
      navigate(`/`);
    } else {
      const error = await response.json();
      handleSnackbar(error.message, SnackbarType.Error);
      console.log(error.message);
    }
  };

  const onCaptchaChange = (e: any) => {
    setCaptchaValue(e);
  };

  if (loading) return <Loading type={3} />

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
          <Text text="Login with OTP" size="2rem" weight="700" />
          <div className={styles.field_container}>
            {!emailValid && (
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
            )}
            {emailValid && (
              <div>
                <Text
                  text="Check your email for OTP"
                  size="1rem"
                  color={colors.secondaryText}
                />
                <Textfield
                  className={styles.field}
                  placeholder="OTP"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}
            <div className="center">
              <ReCAPTCHA
                sitekey="6LePf1kpAAAAAN9gW5tov9cndMmfsxUr8BsDU_T6"
                onChange={onCaptchaChange}
                theme={theme === "dark" ? "dark" : "light"}
              />
            </div>
            {!emailValid && (
              <div>
                <Button
                  className={styles.first_button}
                  text="Send OTP Code"
                  onClick={handleSubmit}
                />
              </div>
            )}
            {emailValid && (
              <div>
                <Button
                  className={styles.first_button}
                  text="Submit OTP"
                  onClick={handleOTPSubmit}
                />
              </div>
            )}
            <Divider text="or login/register" />
            <div>
              <Button
                className={styles.second_button}
                text="Login with Password"
                redirect="/login"
              />
            </div>
            <div>
              <Button
                className={styles.third_button}
                text="Register Account"
                redirect="/register"
              />
            </div>
            <div>
              <Button
                className={styles.forget_password}
                text="Forget Password?"
                redirect="/forget-password"
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
