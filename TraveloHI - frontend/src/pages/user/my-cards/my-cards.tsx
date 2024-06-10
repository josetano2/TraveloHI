import React, { useEffect, useState } from "react";
import UserTemplate from "../../../templates/user-template/user-template";
import styles from "./my-cards.module.scss";
import Text from "../../../components/text/text";
import Container from "../../../components/container/container";
import DefaultDropdown from "../../../components/default-dropdown/default-dropdown";
import { colors } from "../../../components/colors";
import Textfield from "../../../components/textfield/textfield";
import Button from "../../../components/button/button";
import Snackbar, { SnackbarType } from "../../../components/snackbar/snackbar";
import { useSnackbar } from "../../../context/snackbar-context";
import { useUser } from "../../../context/user-context";

export default function MyCardsPage() {
  const [bankNames, setBankNames] = useState<string[]>([]);
  const [selectedBankName, setSelectedBankName] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [CVV, setCVV] = useState("");
  const [expiredMonth, setExpiredMonth] = useState("");
  const [expiredYear, setExpiredYear] = useState("");
  const {
    message,
    isSnackbarOpen,
    setIsSnackbarOpen,
    handleSnackbar,
    snackbarType,
  } = useSnackbar();
  const { user } = useUser();

  const getAllBanks = async () => {
    const response = await fetch("http://localhost:8080/api/get_all_banks", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      const formatted = data.map((bank: IBank) => bank.Name);
      setBankNames(formatted);
      if (data.length > 0) {
        setSelectedBankName(formatted[0]);
      }
    }
  };

  const handleAddCreditCard = async () => {
    const response = await fetch("http://localhost:8080/api/add_credit_card", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        selectedBankName,
        userID: user?.ID,
        name,
        number,
        CVV,
        expiredMonth,
        expiredYear,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      handleSnackbar(data.message, SnackbarType.Success);
    } else {
      handleSnackbar(data.message, SnackbarType.Error);
    }
  };

  useEffect(() => {
    getAllBanks();
  }, []);

  return (
    <UserTemplate>
      <Snackbar
        message={message}
        isOpen={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        type={snackbarType}
      />
      <div className={styles.height}>
        <Text text="My Cards" size="1.5rem" weight="700" />
        <Container>
          <div>
            <Text text="Bank" size="1rem" color={colors.secondaryText} />
            <DefaultDropdown
              onChange={(e) => setSelectedBankName(e.target.value)}
              options={bankNames}
              value={selectedBankName}
            />
          </div>
          <div>
            <Text text="Card Name" size="1rem" color={colors.secondaryText} />
            <Textfield
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Card Name"
            />
          </div>
          <div>
            <Text text="Card Number" size="1rem" color={colors.secondaryText} />
            <Textfield
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Card Number"
            />
          </div>
          <div className={styles.split_container}>
            <div className={styles.field_container}>
              <Text text="CVV" size="1rem" color={colors.secondaryText} />
              <Textfield
                className={styles.field}
                placeholder="CVV"
                type="number"
                value={CVV}
                onChange={(e) => setCVV(e.target.value)}
              />
            </div>
            <div className={styles.field_container}>
              <Text
                text="Expired Month"
                size="1rem"
                color={colors.secondaryText}
              />
              <Textfield
                className={styles.field}
                placeholder="Expired Month"
                type="text"
                value={expiredMonth}
                onChange={(e) => setExpiredMonth(e.target.value)}
              />
            </div>
            <div className={styles.field_container}>
              <Text
                text="Expired Year"
                size="1rem"
                color={colors.secondaryText}
              />
              <Textfield
                className={styles.field}
                placeholder="Expired Year"
                type="text"
                value={expiredYear}
                onChange={(e) => setExpiredYear(e.target.value)}
              />
            </div>
          </div>
          <Button text="Add Credit Card" onClick={handleAddCreditCard} />
        </Container>
      </div>
    </UserTemplate>
  );
}
