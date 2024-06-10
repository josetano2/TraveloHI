import React, { useEffect, useState } from "react";
import styles from "./searting-chart.module.scss";

interface ISeatingChart {
  seats: ISeat[];
  selectedSeatsNumber: number[];
  setSelectedSeatsNumber: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectedSeats: React.Dispatch<React.SetStateAction<ISeat[]>>;
}

export default function SeatingCart({
  seats,
  selectedSeatsNumber,
  setSelectedSeatsNumber,
  setSelectedSeats,
}: ISeatingChart) {
  const totalLength = Math.floor(seats.length / 2);
  // misal 204 / 2 = 102
  // 102 / 6 = 17
  const firstHalf = seats.slice(0, totalLength);
  const secondHalf = seats.slice(totalLength);

  const handleClick = (seat: ISeat, id: number) => {
    setSelectedSeats((prevArr) => {
      const isSeatSelected = prevArr.some((s) => s.ID === seat.ID);
      if (isSeatSelected) {
        return prevArr.filter((s) => s.ID !== seat.ID);
      } else {
        return [...prevArr, seat];
      }
    });
    setSelectedSeatsNumber((prevArr) => {
      if (prevArr.includes(id)) {
        return prevArr.filter((currID) => currID !== id);
      } else {
        return [...prevArr, id];
      }
    });
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.seat_container}>
        {firstHalf.map((seat: ISeat, idx) => {
          return (
            <div
              key={idx}
              className={`${styles.seat} ${
                seat.IsAvailable
                  ? selectedSeatsNumber.includes(seat.ID)
                    ? styles.selected
                    : styles.available
                  : styles.not_available
              }`}
              onClick={
                seat.IsAvailable ? () => handleClick(seat, seat.ID) : () => {}
              }
            >
              {seat.Code}
            </div>
          );
        })}
      </div>
      <div className={styles.seat_container}>
        {secondHalf.map((seat: ISeat, idx) => {
          return (
            <div
              key={idx}
              className={`${styles.seat} ${
                seat.IsAvailable
                  ? selectedSeatsNumber.includes(seat.ID)
                    ? styles.selected
                    : styles.available
                  : styles.not_available
              }`}
              onClick={
                seat.IsAvailable ? () => handleClick(seat, seat.ID) : () => {}
              }
            >
              {seat.Code}
            </div>
          );
        })}
      </div>
    </div>
  );
}
