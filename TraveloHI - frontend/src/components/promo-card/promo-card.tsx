import styles from "./promo-card.module.scss";
import Text from "../text/text";
import { colors } from "../colors";

interface IPromoCard {
  code?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  percentage?: string;
}

export default function PromoCard({
  code,
  startDate,
  endDate,
  image = "",
  percentage,
}: IPromoCard) {
  const sDate = new Date(startDate!);
  const eDate = new Date(endDate!);

  const imgUrl =
    "https://res.cloudinary.com/dau03r7yn/image/upload/v1708586580/pfo19ywkvyqlj0zw2vlk.jpg";
  return (
    <div className={styles.main_container}>
      <div className={styles.image_container}>
        <div className={styles.darken} />
        <img
          className={styles.promo_image}
          src={image === "" ? imgUrl : image}
          alt=""
        />
        <div className={styles.text_container}>
          <div className={styles.main_text_container}>
            <Text
              text={`${percentage}%`}
              weight="700"
              size="2.5rem"
              color={colors.white}
            />
            <Text
              text=" / "
              weight="700"
              size="2.5rem"
              color={colors.white}
            />
            <Text
              text={code}
              weight="700"
              size="2.5rem"
              color={colors.white}
            />
          </div>
          <Text
            text={`${sDate.toLocaleDateString("en-UK") ?? "DD/MM/YYYY"} - ${
              eDate.toLocaleDateString("en-UK") ?? "DD/MM/YYYY"
            }`}
            weight="500"
            size="1rem"
            color={colors.promoDate}
          />
        </div>
      </div>
    </div>
  );
}
