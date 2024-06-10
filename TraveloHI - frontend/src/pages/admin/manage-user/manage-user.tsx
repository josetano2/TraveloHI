import React, { useEffect, useState } from "react";
import AdminTemplate from "../../../templates/admin-template/admin-template";
import { IUser } from "../../../interfaces/user-interface";
import Text from "../../../components/text/text";
import Container from "../../../components/container/container";
import styles from "./manage-user.module.scss";
import { colors } from "../../../components/colors";
import Button from "../../../components/button/button";

export default function AdminManageUserPage() {
  const [users, setUsers] = useState<IUser[]>([]);

  const getAllUsers = async () => {
    const response = await fetch("http://localhost:8080/api/get_all_users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleBan = async (id: number) => {
    const response = await fetch(
      `http://localhost:8080/api/ban_user/?id=${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setUsers(
        users.map(user => {
          if (user.ID === id) {
            return { ...user, IsBanned: data.IsBanned };
          } else {
            return user;
          }
        })
      );
    }
  };

  return (
    <AdminTemplate>
      <Text text="Ban/Unban User(s)" size="1.5rem" weight="700" />
      <Container className={styles.main_container}>
        <>
          {users.map((user, idx) => {
            if (user.FirstName !== "Admin") {
              return (
                <div key={idx} className={styles.user_container}>
                  <div className={styles.left_container}>
                    <img
                      className={styles.pfp}
                      src={user.ProfilePicture ?? null}
                      alt=""
                    />
                    <div className={styles.email_name_container}>
                      <Text
                        text={`${user.FirstName} ${user.LastName}`}
                        size="1.2rem"
                        weight="700"
                      />
                      <Text
                        text={user.Email}
                        size="1.1rem"
                        weight="500"
                        color={colors.secondaryText}
                      />
                    </div>
                  </div>
                  <div className={styles.right_container}>
                    <Button
                      text={`${user.IsBanned ? "Unban User" : "Ban User"}`}
                      onClick={() => handleBan(user.ID)}
                    />
                  </div>
                </div>
              );
            }
          })}
        </>
      </Container>
    </AdminTemplate>
  );
}
