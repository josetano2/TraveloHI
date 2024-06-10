import styles from "./icon-text.module.scss"
import Text from "../text/text";
import { colors } from "../colors";

interface IRoomDetailIconText {
  icon: JSX.Element;
  text: string | undefined;
  textColor?: string;
}

export default function IconText({
  icon,
  text,
  textColor
}: IRoomDetailIconText) {
  return (
    <div className={styles.icon_text_container}>
      {icon}
      <Text text={text} size="0.9rem" color={textColor} />
    </div>
  );
}
