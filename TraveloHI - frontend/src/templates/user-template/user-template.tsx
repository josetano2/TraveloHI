import Button from "../../components/button/button";
import { IChildren } from "../../interfaces/children-interface";
import MainTemplate from "../main-template/main-template";
import styles from "./user-template.module.scss";
import { useUser } from "../../context/user-context";
import Divider from "../../components/divider/divider";
import { cloneElement, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { USER_MENU } from "../../settings/user-settings";
import Text from "../../components/text/text";
import { colors } from "../../components/colors";

export default function UserTemplate({ children }: IChildren) {
  const [active, setActive] = useState<string | undefined>("");
  const { user, loading, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        const activePath = location.pathname.split("/").pop();
        setActive(activePath);
      } else {
        navigate(`/login`);
      }
    }
  }, [loading, user]);

  return (
    <MainTemplate>
      <div className={styles.user_container}>
        {/* sisi kiri */}
        <div className={styles.navigation_container}>
          <div className={styles.upper_container}>
            <div className={styles.profile_container}>
              <img
                src={user?.ProfilePicture}
                className={styles.pfp}
                alt="pfp"
              />
              <div className={styles.name_container}>
                <Text
                  size="1.5rem"
                  text={`${user?.FirstName} ${user?.LastName}`}
                  weight="700"
                />
              </div>
            </div>
            <div className={styles.name_container}>
              <Text text="Balance: " size="1.5rem" weight="700" />
              <Text
                text={`Rp. ${user?.WalletAmount.toLocaleString()}`}
                size="1.5rem"
                weight="700"
                color={colors.orange}
              />
            </div>
          </div>
          {USER_MENU.map((m, idx) => {
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
                  onClick={async () => {
                    if (m.text === "Log Out") {
                      await logout();
                      // getUser();
                      if (!loading) {
                        navigate(`/login`);
                      }
                    } else {
                      navigate(`/user/${m.path}`);
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
    </MainTemplate>
  );
}
