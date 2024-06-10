import styles from "./checkbox.module.scss";

interface ICheckbox {
  id: string;
  text?: string;
  checked: boolean;
  onChange: (e: any) => void;
}

export default function Checkbox({ id, text, checked, onChange }: ICheckbox) {
  return (
    <div className={styles.checkbox_container}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label className={styles.component_label} htmlFor={id}>
        {text}
      </label>
    </div>
  );
}
