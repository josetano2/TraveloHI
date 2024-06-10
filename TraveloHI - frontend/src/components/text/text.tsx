import { useNavigate } from "react-router-dom";

interface IText {
  text: string | undefined;
  size: string;
  weight?: string;
  color?: string;
  className?: string;
  onClick?: (e: any) => void;
  redirect?: string;
  external?: string;
}

export default function Text({
  text,
  size,
  weight = "500",
  color = "",
  className,
  onClick,
  redirect = "",
  external = "",
}: IText) {
  color = color === "" ? "var(--body_color)" : color;

  const style = {
    fontSize: size,
    fontWeight: weight,
    color: color,
  };

  const navigate = useNavigate();

  const handleRedirect = (dest: string) => {
    navigate(`${dest}`);
  };
  const handleExternal = (dest: string) => {
    window.location.href = dest;
  };

  const handleClick = (e: any) => {
    if (onClick) {
      onClick(e);
    }
    if (redirect !== "") {
      handleRedirect(redirect as string);
    }
    if (external !== "") {
      handleExternal(external as string);
    }
  };
  return (
    <p className={className} style={style} onClick={handleClick}>
      {text}
    </p>
  );
}
