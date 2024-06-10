import React, { useEffect, useState } from "react";
import AdminTemplate from "../../../templates/admin-template/admin-template";
import Text from "../../../components/text/text";
import { IPromo } from "../../../interfaces/promo-interface";
import styles from "./update-promo.module.scss";
import SelectedPromo from "./selected-promo/selected-promo";

export default function AdminUpdatePromoPage() {
  const [promoSelected, setPromoSelected] = useState(false);

  const [promos, setPromos] = useState<IPromo[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<IPromo>();

  const getPromos = async () => {
    const response = await fetch("http://localhost:8080/api/get_all_promos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      setPromos(data);
      console.log(data);
    }
  };

  useEffect(() => {
    getPromos();
  }, []);

  return (
    <AdminTemplate>
      <>
        {!promoSelected && (
          <>
            <Text text="Select Promo" size="1.5rem" weight="700" />
            <div className={styles.promo_container}>
              {promos &&
                promos.map((promo, idx) => {
                  return (
                    <div
                      onClick={() => {
                        setPromoSelected(true);
                        setSelectedPromo(promo);
                      }}
                      className={styles.select_container}
                      key={idx}
                    >
                      {promo.Code}
                    </div>
                  );
                })}
            </div>
          </>
        )}
        {promoSelected && selectedPromo && (
          <>
            <SelectedPromo
              ID={selectedPromo.ID}
              Code={selectedPromo.Code}
              Image={selectedPromo.Image}
              StartDate={selectedPromo.StartDate}
              EndDate={selectedPromo.EndDate}
              Percentage={selectedPromo.Percentage}
            />
          </>
        )}
      </>
    </AdminTemplate>
  );
}
