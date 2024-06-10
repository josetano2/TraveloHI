import styles from "./textarea.module.scss";

export interface ITextArea {
  placeholder: string;
  className?: string;
  value: string;
  // onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: any) => void;
}

export default function Textarea({
  placeholder,
  className,
  value,
  onChange,
}: ITextArea) {
  const combinedClassName = `${styles.textarea} ${className || ""}`.trim();

  return (
    <textarea
      className={combinedClassName}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
