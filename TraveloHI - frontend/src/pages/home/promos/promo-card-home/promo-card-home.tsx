import styles from "./promo-card-home.module.scss"
import { colors } from "../../../../components/colors"; 
import Text from "../../../../components/text/text";

interface IPromoCard {
  code?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  percentage?: string;
  length?: number;
}

export default function PromoCardHome({
  code,
  startDate,
  endDate,
  image = "",
  percentage,
  length
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
          className={`${styles.promo_image} ${length && length < 3 ? length < 2 ? styles.one_promo : styles.two_promos : styles.full_promos}`}
          src={image === "" ? imgUrl : image}
          alt=""
        />
        <div className={styles.text_container}>
          <div className={styles.main_text_container}>
            <Text
              text={`${percentage}%`}
              weight="700"
              size="2rem"
              color={colors.white}
            />
            <Text
              text=" / "
              weight="700"
              size="2rem"
              color={colors.white}
            />
            <Text
              text={code}
              weight="700"
              size="2rem"
              color={colors.white}
            />
          </div>
          <Text
            text={`${sDate.toLocaleDateString("en-UK") ?? "DD/MM/YYYY"} - ${
              eDate.toLocaleDateString("en-UK") ?? "DD/MM/YYYY"
            }`}
            weight="500"
            size="0.8rem"
            color={colors.promoDate}
          />
        </div>
      </div>
    </div>
  );
}
