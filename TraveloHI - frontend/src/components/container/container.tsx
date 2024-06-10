import { IChildren } from "../../interfaces/children-interface";
import styles from "./container.module.scss";

export interface IContainer extends IChildren {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function Container({ children, className, onClick }: IContainer) {
  const combinedClassName = `${styles.container} ${className || ""}`.trim();

  return (
    <div onClick={onClick} className={combinedClassName}>
      {children}
    </div>
  );
}
