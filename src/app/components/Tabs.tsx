import React from "react";
import styles from "./Tabs.module.css";

interface TabsProps {
  activeTab: "deposit" | "position";
  onTabChange: (tab: "deposit" | "position") => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles["tab-container"]}>
      <button
        className={`${styles["tab"]} ${
          activeTab === "deposit" ? styles["active-tab"] : ""
        }`}
        onClick={() => onTabChange("deposit")}
      >
        Deposit
      </button>
      <button
        className={`${styles["tab"]} ${
          activeTab === "position" ? styles["active-tab"] : ""
        }`}
        onClick={() => onTabChange("position")}
      >
        Position
      </button>
    </div>
  );
};

export default Tabs;
