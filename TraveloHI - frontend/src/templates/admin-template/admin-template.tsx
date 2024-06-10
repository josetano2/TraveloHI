import { IChildren } from "../../interfaces/children-interface";
import styles from "./admin-template.module.scss";
import { useState, useEffect, cloneElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/button/button";
import Divider from "../../components/divider/divider";
import { useUser } from "../../context/user-context";
import AdminMainTemplate from "../admin-main-template/admin-main-template";
import Text from "../../components/text/text";
import { ADMIN_MENU } from "../../settings/admin-settings";
import Loading from "../../components/loader/loader";

export default function AdminTemplate({ children }: IChildren) {
  const [active, setActive] = useState<string | undefined>("");
  const { user, loading, logout, getUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const activePath = location.pathname.split("/").pop();
    setActive(activePath);
  }, []);

  useEffect(() => {
    // getUser(); 
    if (!user || user.Role !== "admin") {
      navigate(`/`);
    }
  }, [user, loading]);

  // if (loading) return <Loading type={3} />;

  return (
    <AdminMainTemplate>
      <div className={styles.user_container}>
        <div className={styles.navigation_container}>
          <div className={styles.profile_container}>
            <img src={user?.ProfilePicture} className={styles.pfp} alt="pfp" />
            <div className={styles.name_container}>
              <Text text="Admin" size="1.5rem" weight="700" />
            </div>
          </div>
          {ADMIN_MENU.map((m, idx) => {
            if (m.divider) {
              return <Divider key={idx} text="" />;
            }
            return (
              <div key={idx} className={styles.button_container}>
                <Button
                  className={`${
                    m.path === active ? styles.active : styles.not_active
                  } ${styles.button} `}
                  text={m.text}
                  onClick={() => {
                    if (m.text === "Log Out") {
                      logout();
                      navigate(`/`);
                    } else {
                      navigate(`/admin/${m.path}`);
                    }
                  }}
                >
                  {m.icon &&
                    cloneElement(m.icon, {
                      color: m.path === active ? "#ffffff" : "#1ba0e2",
                    })}
                </Button>
              </div>
            );
          })}
        </div>
        {/* sisi kanan */}
        <div className={styles.content_container}>{children}</div>
      </div>
    </AdminMainTemplate>
  );
}