import { useNavigate } from "react-router-dom";
import styles from "./button.module.scss";

interface IButton {
  text?: string;
  className?: string;
  onClick?: (e: any) => void;
  redirect?: string;
  children?: JSX.Element[] | JSX.Element;
}

export default function Button({
  text,
  className,
  onClick,
  redirect = "",
  children
}: IButton) {
  const combinedClassName = `${styles.button} ${className || ""}`.trim();

  const navigate = useNavigate();

  const handleRedirect = (dest: string) => {
    navigate(`${dest}`);
  };

  const handleClick = (e: any) => {
    if (onClick) {
      onClick(e);
    }
    if (redirect !== "") {
      handleRedirect(redirect);
    }
  };

  return (
    <button className={combinedClassName} onClick={handleClick}>
      {children}
      {text}
    </button>
  );
}
