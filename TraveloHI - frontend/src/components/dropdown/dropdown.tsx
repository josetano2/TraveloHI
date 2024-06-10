import { useState } from "react";
import styles from "./dropdown.module.scss";
import Text from "../text/text";
import { colors } from "../colors";
import Container from "../container/container";
import { FaChevronDown } from "react-icons/fa";

interface IDropdown {
  menus: string[];
  onActiveChange: (item: string) => void;
}

export default function Dropdown({ menus, onActiveChange }: IDropdown) {
  const [active, setActive] = useState(menus[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.main_container}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={styles.active_container}
      >
        <Text text={active} weight="700" size="1rem" color={colors.blue} />
      </div>
      {isOpen && (
        <div className={styles.dropdown_menu_container}>
          {menus.map((item, idx) => {
            return (
              <div
                onClick={() => {
                  setIsOpen(false);
                  setActive(item);
                  onActiveChange(item);
                }}
                key={idx}
                className={styles.dropdown_item}
              >
                {item}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
