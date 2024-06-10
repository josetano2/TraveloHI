import { useEffect, useState } from "react";
import styles from "./admin-navbar.module.scss";
import logoWhite from "../../../assets/image/logo_white.png";
import logoBlack from "../../../assets/image/logo_black.png";
import Button from "../../button/button";
import ToggleTheme from "../../themes/toggle-theme";
import { useTheme } from "../../../context/theme-context";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/user-context";

export default function AdminNavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async (e: any) => {
    e.preventDefault();

    await logout();
    navigate(`/login`);
  };

  const handleAdminPageRedirect = (e: any) => {
    e.preventDefault();
    navigate(`/admin/hotel`);
  };

  return (
    <div className={styles.main_container}>
      <div
        className={`${styles.navbar_container} ${
          isScrolled ? styles.scrolled : styles.static
        }`}
      >
        <div className={styles.navbar_left_container}>
          <img
            className={styles.logo}
            src={theme === "dark" ? logoWhite : logoBlack}
            alt="logo"
          />
        </div>
        <div className={styles.navbar_right_container}>
          <ToggleTheme />
          {user && (
            <div className={styles.profile_container}>
              <div
                onClick={handleAdminPageRedirect}
                className={styles.sub_profile_container}
              >
                <img
                  className={styles.pfp}
                  src={user.ProfilePicture}
                  alt="User Profile"
                />
                <label className={styles.profile_name}>{user.FirstName}</label>
              </div>
              <Button
                text="Logout"
                onClick={handleLogout}
                className={styles.logout_button}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
