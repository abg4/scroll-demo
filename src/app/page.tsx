import styles from "./page.module.css";
import Deposit from "./components/Deposit";

export default function Home() {
  return (
    <main className={styles.main}>
      <Deposit />
    </main>
  );
}
