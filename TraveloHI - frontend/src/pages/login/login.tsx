import { useEffect, useState } from "react";
import Button from "../../components/button/button";
import { colors } from "../../components/colors";
import Text from "../../components/text/text";
import Textfield from "../../components/textfield/textfield";
import styles from "./login.module.scss";
import Divider from "../../components/divider/divider";
import bgImg from "../../assets/image/bg.png";
import logoImg from "../../assets/image/logo_white.png";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/theme-context";
import { useUser } from "../../context/user-context";
import Snackbar, { SnackbarType } from "../../components/snackbar/snackbar";
import { ADMIN_MENU } from "../../settings/admin-settings";
import Loading from "../../components/loader/loader";
import { useSnackbar } from "../../context/snackbar-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const { theme } = useTheme();
  const { user, loading, login, getUser } = useUser();
  const { message, isSnackbarOpen, setIsSnackbarOpen, handleSnackbar, snackbarType } =
    useSnackbar();

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
    const result = await login(email, password);
    if (typeof result === "boolean") {
      if (!loading) {
        if (user?.Role === "user") {
          navigate(`/`);
        }
      }
    } else if (typeof result === "string") {
      handleSnackbar(result, SnackbarType.Error);
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
          <Text text="Log In" size="2rem" weight="700" />
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
              <Text text="Password" size="1rem" color={colors.secondaryText} />
              <Textfield
                className={styles.field}
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="center">
              <ReCAPTCHA
                sitekey="6LePf1kpAAAAAN9gW5tov9cndMmfsxUr8BsDU_T6"
                onChange={onCaptchaChange}
                theme={theme === "dark" ? "dark" : "light"}
              />
            </div>
            <div>
              <Button
                className={styles.first_button}
                text="Log In"
                onClick={handleSubmit}
              />
            </div>
            <Divider text="or login/register" />
            <div>
              <Button
                className={styles.second_button}
                text="Login with OTP"
                redirect="/otp"
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