"use client";

import { usePrivy } from "@privy-io/react-auth";
import styles from "./WalletConnectButton.module.css";
import { prettyAddress } from "../utils/index";

export function WalletConnectButton() {
  const { login, logout, authenticated, user } = usePrivy();

  if (authenticated) {
    return (
      <button className={styles.button} onClick={logout}>
        {user?.wallet?.address
          ? prettyAddress(user?.wallet?.address)
          : "Connect"}
      </button>
    );
  }

  return (
    <button className={styles.button} onClick={login}>
      Connect
    </button>
  );
}
