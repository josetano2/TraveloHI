import styles from "./default-dropdown.module.scss";

interface IDefaultDropdown {
  options: string[];
  value: string;
  onChange: (e: any) => void;
}

export default function DefaultDropdown({
  options,
  value,
  onChange,
}: IDefaultDropdown) {
  return (
    <select
      className={styles.combo_box}
      value={value}
      onChange={onChange}
    >
      {options.map((option, idx) => (
        <option key={idx} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
