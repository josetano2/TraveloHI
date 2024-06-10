import { IChildren } from "../../interfaces/children-interface";
import styles from "./dialog.module.scss";

interface IDialog extends IChildren {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export default function Dialog({ open, setOpen, className, children }: IDialog) {
  const combinedClassName = `${styles.dialog_container} ${className || ""}`.trim();
  return (
    <>
      {open && (
        <>
          {/* bg */}
          <div onClick={() => setOpen(false)} className={styles.bg} />
          {/* container */}
          <div className={styles.main_container}>
            <div className={combinedClassName}>{children}</div>
          </div>
        </>
      )}
    </>
  );
}
