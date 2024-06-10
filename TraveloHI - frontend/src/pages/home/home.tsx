import MainTemplate from "../../templates/main-template/main-template";
import styles from "./home.module.scss";
import Promos from "./promos/promos";
import { useTheme } from "../../context/theme-context";
import { useUser } from "../../context/user-context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_MENU } from "../../settings/admin-settings";
import bgImg from "../../assets/image/bg.png";
import Search from "./search/search-field";
import Loading from "../../components/loader/loader";
import Text from "../../components/text/text";
import { colors } from "../../components/colors";
import Footer from "../../components/footer/footer";
import WhyTraveloka from "./why-traveloka/why-traveloka";

export default function HomePage() {
  const { user, getUser, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.Role === "admin") {
      navigate(`/admin/${ADMIN_MENU[0].path}`);
    }
  }, [user, navigate]);

  return (
    <MainTemplate>
      <>
        <Search />
        <div className={styles.darken}></div>
        <img src={bgImg} alt="bg" className={styles.bg} />
        <div className={styles.home_container}>
          <div>
            <Text text="Ongoing Promos" size="2rem" weight="700" />
            <Promos />
          </div>
          <div>
            <Text text="Why book with Traveloka?" size="2rem" weight="700" />
            <WhyTraveloka />
          </div>
        </div>
      </>
    </MainTemplate>
  );
}
