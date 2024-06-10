import { useNavigate } from "react-router-dom";
import styles from "./camera.module.scss";
import { useTheme } from "../../context/theme-context";
import { IoCameraOutline } from "react-icons/io5";
import { colors } from "../colors";
import { MdOutlineCameraAlt } from "react-icons/md";

interface ICamera {
  type?: number;
}

export default function Camera({ type }: ICamera) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handlePredict = (e: any) => {
    e.preventDefault();
    navigate(`/predict-image`);
  };

  return (
    <button onClick={handlePredict} className={styles.camera}>
      <MdOutlineCameraAlt
        size={24}
        color={theme === "dark" || type === 1 ? colors.white : colors.black}
      />
    </button>
  );
}
