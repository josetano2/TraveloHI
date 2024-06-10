import { IChildren } from "../../interfaces/children-interface";
import NavBar from "../../components/navbar/navbar";
import styles from "./main-template.module.scss";
import { useUser } from "../../context/user-context";
import { useEffect } from "react";
import Footer from "../../components/footer/footer";

export default function MainTemplate({ children }: IChildren) {
  const { user, getUser } = useUser();

  useEffect(() => {
    getUser();
  }, [user]);

  return (
    <>
      <NavBar />
      {/* {user && user.Role === "admin" ? <AdminNavBar /> : <NavBar />} */}
      <div className={styles.main_container}>{children}</div>
      <Footer />
    </>
  );
}
