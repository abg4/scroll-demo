"use client";

import styles from './Header.module.css';
import { WalletConnectButton } from './WalletButton';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        Across + Scroll Demo
      </div>
      <WalletConnectButton />
    </header>
  );
}