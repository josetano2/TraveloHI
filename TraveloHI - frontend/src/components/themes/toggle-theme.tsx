import { useTheme } from "../../context/theme-context";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";
import styles from "./toogle-theme.module.scss";
import { colors } from "../colors";

interface IToggleTheme {
  type?: number;
}

export default function ToggleTheme({ type = 0 }: IToggleTheme) {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = (e: any) => {
    e.preventDefault();
    toggleTheme();
  };

  return (
    <button onClick={handleToggle} className={styles.toggle}>
      {theme === "dark" ? (
        <IoMoonOutline size={24} color={colors.white} />
      ) : type === 1 ? (
        <MdOutlineWbSunny size={24} color={colors.white} />
      ) : (
        <MdOutlineWbSunny size={24} color={colors.black} />
      )}
    </button>
  );
}
