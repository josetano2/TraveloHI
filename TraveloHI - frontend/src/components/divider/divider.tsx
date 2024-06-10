import styles from "./divider.module.scss"

interface IDivider {
  text: string;
}

export default function Divider({ text }: IDivider) {

  const dividerClass = text === "" ? `${styles.divider} ${styles.full}` : styles.divider;
  return (
    <div className={dividerClass}>
        {text}
    </div>

  )
}
