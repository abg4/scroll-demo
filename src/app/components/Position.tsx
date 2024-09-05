"use client";

import React from "react";
import { prettyAaveValue } from "../utils";
import styles from "./Position.module.css";

interface AccountData {
  totalCollateralBase: bigint;
  totalDebtBase: bigint;
  availableBorrowsBase: bigint;
  currentLiquidationThreshold: bigint;
  ltv: bigint;
  healthFactor: bigint;
}

interface PositionProps {
  accountData: AccountData;
}

const Position: React.FC<PositionProps> = ({ accountData }) => {
  const { totalCollateralBase, availableBorrowsBase, totalDebtBase, ltv } =
    accountData;

  return (
    <div>
      <div className={styles.position}>
        <strong>Total Collateral Base:</strong>
        <span>
          {prettyAaveValue(totalCollateralBase.toString()) || "N/A"}
        </span>{" "}
      </div>
      <div className={styles.position}>
        <strong>Available Borrow Base:</strong>
        <span>{prettyAaveValue(availableBorrowsBase.toString()) || "N/A"}</span>
      </div>
      <div className={styles.position}>
        <strong>Total Debt Base:</strong>
        <span>{prettyAaveValue(totalDebtBase.toString()) || "N/A"}</span>
      </div>
      <div className={styles.position}>
        <strong>LTV:</strong>
        <span>{ltv.toString() || "N/A"}</span>
      </div>
    </div>
  );
};

export default Position;
