import styles from "./star.module.scss";

interface IStar {
  rating: number;
  size?: number;
}

export default function Star({ rating, size }: IStar) {
  const stars = [];
  let imgFullSrc =
    "https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/e/e4cb5ddfa3d1399bc496ee6b6539a5a7.svg";
  let imgHalfSrc =
    "https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/5/50ebd00a57a4a3f5c2414dab877609f6.svg";

  // 4.3
  let temp = Math.floor(rating)
  for (let i = 0; i < temp; i++) {
    stars.push(<img key={i} className={`${styles.star} ${size === 1 ? styles.big : styles.small}`} src={imgFullSrc} alt="star" />);
  }

  let remainder = rating - Math.floor(rating);
  if (remainder >= 0.3) {
    stars.push(<img key={temp+1} className={styles.star} src={imgHalfSrc} alt="star" />);
  }

  return <div className={styles.star_container}>{stars}</div>;
}
