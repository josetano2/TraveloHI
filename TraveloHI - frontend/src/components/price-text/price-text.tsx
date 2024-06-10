import { colors } from "../colors";
import Text from "../text/text";

interface IPriceText {
  price: number | string;
  size: string;
  className?: string;
}

export default function PriceText({ price, size, className }: IPriceText) {
  return (
    <Text
      text={`Rp. ${price.toLocaleString()}`}
      size={size}
      weight="700"
      color={colors.orange}
      className={className}
    />
  );
}
