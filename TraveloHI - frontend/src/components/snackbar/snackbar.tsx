import { useEffect, useState } from "react";
import styles from "./snackbar.module.scss";

export enum SnackbarType {
  Success = "success",
  Error = "error",
}

export interface ISnackbar {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  type: SnackbarType;
}

export default function Snackbar({ message, isOpen, onClose, type }: ISnackbar) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2900);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const snackbarColor = type === "success" ? styles.success : styles.error

  const combinedClassName = `${styles.snackbar} ${snackbarColor} ${
    show ? styles.show : ""
  }`.trim();

  if (!show) {
    return null;
  } else {
    return (
      <div className={combinedClassName} onClick={onClose}>
        {message}
      </div>
    );
  }
}
