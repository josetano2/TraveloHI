import { useEffect, useState } from "react";
import styles from "./navbar.module.scss";
import logoWhite from "../../assets/image/logo_white.png";
import logoBlack from "../../assets/image/logo_black.png";
import flag_id from "../../assets/image/flag_id.png";
import flag_us from "../../assets/image/flag_us.png";
import Button from "../button/button";
import ToggleTheme from "../themes/toggle-theme";
import { useTheme } from "../../context/theme-context";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/user-context";
import Textfield from "../textfield/textfield";
import Container from "../container/container";
import { useFetch } from "../../context/fetch-context";
import debounce from "lodash.debounce";
import SearchNavbar from "./search-hotel-navbar/search-hotel-navbar";
import {
  ADDITIONAL_MENU_WITH_EXTRA_FLIGHT_NAVBAR,
  ADDITIONAL_MENU_WITH_EXTRA_HOTEL_NAVBAR,
} from "../../settings/menu-settings";
import { IoCameraOutline } from "react-icons/io5";
import Camera from "../camera/camera";
import SearchHotelNavbar from "./search-hotel-navbar/search-hotel-navbar";
import SearchFlightPage from "../../pages/search-flight/search-flight";
import SearchFlightNavbar from "./search-flight-navbar/search-flight-navbar";
import IconText from "../icon-text/icon-text";
import { CiWallet } from "react-icons/ci";
import { colors } from "../colors";
import { PiCreditCardLight } from "react-icons/pi";
import Text from "../text/text";

export default function NavBar() {
  // main navbar var
  const [active, setActive] = useState<string | undefined>("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [total, setTotal] = useState(0);
  const { theme } = useTheme();
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payActive, setPayActive] = useState(false);
  const [currencyActive, setCurrencyActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!userLoading) {
      if (user) {
        const activePath = location.pathname.split("/").pop();
        setActive(activePath);
      }
    }
  }, [userLoading, user]);

  useEffect(() => {
    const activePath = location.pathname.split("/").pop();
    setActive(activePath);
  }, [])

  useEffect(() => {
    if (user?.ID) {
      getTotalActiveTickets();
    }
  }, [user?.ID]);

  const getTotalActiveTickets = async () => {
    const url = `http://localhost:8080/api/get_total_active_tickets/?id=${user?.ID}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const res = await response.json();
        setTotal(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfile = () => {
    navigate(`/user/my-account`);
  };

  const handleLoginRedirect = () => {
    navigate(`/login`);
  };

  const handleRegisterRedirect = () => {
    navigate(`/register`);
  };

  const handleHomeRedirect = () => {
    navigate(`/`);
  };

  return (
    <div className={styles.main_container}>
      <div
        className={`${styles.navbar_container} ${
          isScrolled || active !== "" ? styles.scrolled : styles.static
        }`}
      >
        <div className={styles.navbar_left_container}>
          <img
            className={styles.logo}
            src={
              theme === "dark" || (!isScrolled && active === "")
                ? logoWhite
                : logoBlack
            }
            alt="logo"
            onClick={handleHomeRedirect}
          />
        </div>
        {/* {styles.navbar_right_container} */}
        <div
          className={`${styles.navbar_right_container} ${
            !isScrolled && active === "" ? styles.white_text : styles.theme_text
          }`}
        >
          <ToggleTheme type={!isScrolled && active === "" ? 1 : 0} />
          <Camera type={!isScrolled && active === "" ? 1 : 0} />
          <div className={styles.dropdown_container}>
            <div
              className={styles.navbar_small_container}
              onClick={() => {
                setCurrencyActive(!currencyActive);
                setPayActive(false);
              }}
            >
              <img className={styles.flag} src={flag_id} alt="" />
              <Button
                text="IDR"
                onClick={() => {}}
                className={`${styles.language_button} ${
                  !isScrolled && active === ""
                    ? styles.white_text
                    : styles.theme_text
                }`}
              />
            </div>
            {currencyActive && (
              <div className={styles.option_container}>
                <div className={styles.navbar_small_container}>
                  <img className={styles.flag} src={flag_id} alt="" />
                  <Button
                    text="IDR"
                    onClick={() => {}}
                    className={`${styles.language_button} ${styles.theme_text}`}
                  />
                </div>
                <div className={styles.navbar_small_container}>
                  <img className={styles.flag} src={flag_us} alt="" />
                  <Button
                    text="USD"
                    onClick={() => {}}
                    className={`${styles.language_button} ${styles.theme_text}`}
                  />
                </div>
              </div>
            )}
          </div>
          {user && (
            <div className={styles.profile_container}>
              <div className={styles.dropdown_container}>
                <Button
                  text="Pay"
                  onClick={() => {
                    setPayActive(!payActive);
                    setCurrencyActive(false);
                  }}
                  className={`${styles.navbar_button} ${
                    !isScrolled && active === ""
                      ? styles.white_text
                      : styles.theme_text
                  }`}
                />
                {payActive && (
                  <div className={styles.option_container}>
                    <IconText
                      icon={<CiWallet color={colors.blue} size={25} />}
                      text="HI-Wallet"
                    />
                    <IconText
                      icon={<PiCreditCardLight color={colors.blue} size={25} />}
                      text="Credit Card"
                    />
                  </div>
                )}
              </div>
              <Button
                text={`${total} Orders`}
                redirect="/user/my-ticket"
                className={`${styles.navbar_button} ${
                  !isScrolled && active === ""
                    ? styles.white_text
                    : styles.theme_text
                }`}
              />
              <div onClick={handleProfile} className={styles.user_container}>
                <img
                  className={styles.pfp}
                  src={user.ProfilePicture}
                  alt="User Profile"
                />
                <label className={styles.profile_name}>{user.FirstName}</label>
              </div>
            </div>
          )}
          {!user && (
            <div className={styles.profile_unauth_container}>
              <Button
                text="Log In"
                onClick={handleLoginRedirect}
                className={`${styles.login_button} ${
                  !isScrolled && active === ""
                    ? styles.white_text
                    : styles.theme_text
                }
                ${
                  !isScrolled && active === ""
                    ? styles.white_border
                    : styles.theme_border
                }`}
              />
              <Button
                text="Register"
                onClick={handleRegisterRedirect}
                className={styles.register_button}
              />
            </div>
          )}
        </div>
      </div>
      {ADDITIONAL_MENU_WITH_EXTRA_HOTEL_NAVBAR.includes(active as string) && (
        <SearchHotelNavbar />
      )}
      {ADDITIONAL_MENU_WITH_EXTRA_FLIGHT_NAVBAR.includes(active as string) && (
        <SearchFlightNavbar />
      )}
    </div>
  );
}
