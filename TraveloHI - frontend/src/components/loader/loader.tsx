import styles from "./loader.module.scss";

interface ILoading {
  type: number;
}

export default function Loading({ type }: ILoading) {

  const className = `${styles[`loader${type}`]}`;
  const containerClassName = `${styles[`container${type}`]}`;
  return (
    <div className={containerClassName}>
      <div className={className} />
    </div>
  );
}
