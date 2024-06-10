import styles from "./textfield.module.scss";

export interface ITextfield {
  placeholder: string;
  type: string;
  className?: string;
  value: string;
  onChange: (e: any) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement> 
}

export default function Textfield({
  placeholder,
  type,
  className,
  value,
  onChange,
  onKeyDown,
  onBlur,
  onFocus,
}: ITextfield) {
  const combinedClassName = `${styles.textfield} ${className || ""}`.trim();

  return (
    <input
      className={combinedClassName}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
}
