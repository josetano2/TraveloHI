import Container from "../../../components/container/container";
import Text from "../../../components/text/text";
import styles from "./why-traveloka.module.scss";

interface IInfo {
  image: string;
  title: string;
  content: string;
}

export default function WhyTraveloka() {
  return (
    <div className={styles.main_container}>
      {infos &&
        infos.map((info: IInfo, idx) => {
          return (
            <div key={idx} className={styles.content_container}>
              <img className={styles.image} src={info.image} alt="" />
              <div className={styles.text_container}>
                <Text text={info.title} size="1.2rem" weight="700" />
                <Text text={info.content} size="1rem" />
              </div>
            </div>
          );
        })}
    </div>
  );
}

const infos: IInfo[] = [
  {
    image:
      "https://ik.imagekit.io/tvlk/image/imageResource/2023/06/14/1686717876390-f8c5c3c3a19ab6bf8fbd9efc9a168f8a.webp?tr=dpr-2,h-64,q-75,w-64",
    title: "One place for all your needs",
    content:
      "From flights, stays, to sights, just count on our complete products and Travel Guides.",
  },
  {
    image:
      "https://ik.imagekit.io/tvlk/image/imageResource/2023/06/14/1686717879180-0b20eabf785084d44f89225f881a0784.webp?tr=dpr-2,h-64,q-75,w-64",
    title: "Flexible booking options",
    content:
      "Sudden change of plan? No worries! Reschedule or Refund without hassle.",
  },
  {
    image:
      "https://ik.imagekit.io/tvlk/image/imageResource/2023/06/14/1686717882046-98e3f26be236426c75fab95bb3e26f25.webp?tr=dpr-2,h-64,q-75,w-64",
    title: "Secure & convenient payment",
    content:
      "Enjoy many secure ways to pay, in the currency that's most convenient for you.",
  },
];
