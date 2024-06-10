import { IChildren } from "../../interfaces/children-interface";
import styles from "./admin-main-template.module.scss"
import AdminNavBar from "../../components/navbar/admin-navbar/admin-navbar";

export default function AdminMainTemplate({ children }: IChildren) {
  return (
    <div>
      <AdminNavBar />
      <div className={styles.main_container}>{children}</div>
    </div>
  );
}
