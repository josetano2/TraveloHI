import { colors } from "../colors";
import Text from "../text/text";
import styles from "./footer.module.scss";
import logo from "../../assets/image/footer_logo.svg";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <img className={styles.logo} src={logo} alt="" />
      </div>
      <div className={styles.container}>
        <Text
          text="About Traveloka"
          size="1.2rem"
          color={colors.white}
          weight="700"
        />
        <Text
          text="How to Book"
          size="1.1rem"
          color={colors.secondaryText}
          weight="300"
          className={styles.text}
        />
        <Text
          text="About Us"
          size="1.1rem"
          color={colors.secondaryText}
          weight="300"
          className={styles.text}
        />
        <Text
          text="Careers"
          size="1.1rem"
          color={colors.secondaryText}
          weight="300"
          className={styles.text}
        />
      </div>
      <div className={styles.container}>
        <Text
          text="Follow us on"
          size="1.2rem"
          color={colors.white}
          weight="700"
        />
        <Text
          text="Facebook"
          size="1.1rem"
          color={colors.secondaryText}
          weight="300"
          className={styles.text}
          external="https://www.facebook.com/TravelokaSG/?_rdc=1&_rdr"
        />
        <Text
          text="Instagram"
          size="1.1rem"
          color={colors.secondaryText}
          weight="300"
          className={styles.text}
          external="https://www.instagram.com/traveloka.sg/"
        />
        <Text
          text="Youtube"
          size="1.1rem"
          color={colors.secondaryText}
          weight="300"
          className={styles.text}
          external="https://www.youtube.com/@traveloka.global"
        />
        <Text
          text="Twitter"
          size="1.1rem"
          color={colors.secondaryText}
          weight="300"
          className={styles.text}
          external="https://twitter.com/traveloka?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
        />
        <Text
          text="LinkedIn"
          size="1.1rem"
          color={colors.secondaryText}
          weight="300"
          className={styles.text}
          external="https://www.linkedin.com/company/traveloka?originalSubdomain=id"
        />
      </div>
      <div className={styles.container}>
        <Text
          text="Our Products"
          size="1.2rem"
          color={colors.white}
          weight="700"
        />
        <Text
          text="Hotel"
          size="1.1rem"
          color={colors.secondaryText}
          weight="300"
          className={styles.text}
          redirect="/search-hotel?query="
        />
        <Text
          text="Flight"
          size="1.1rem"
          color={colors.secondaryText}
          weight="300"
          className={styles.text}
          redirect="/search-flight"
        />
        <Text
          text="Game"
          size="1.1rem"
          color={colors.secondaryText}
          weight="300"
          className={styles.text}
          redirect="/game"
        />
        <Text
          text="Predict Image (Beta)"
          size="1.1rem"
          color={colors.secondaryText}
          weight="300"
          className={styles.text}
          redirect="/predict-image"
        />
      </div>
    </footer>
  );
}
