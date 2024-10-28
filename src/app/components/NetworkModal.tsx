import React from "react";
import styles from "./Deposit.module.css";
import { Network } from "../types";

interface NetworkModalProps {
  networks: Network[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (network: Network) => void;
}

const NetworkModal: React.FC<NetworkModalProps> = ({
  networks,
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles["modal-content"]}>
        <h2>Select a Network</h2>
        <ul className={styles["network-list"]}>
          {networks.map((network) => (
            <li key={network.id} onClick={() => onSelect(network)}>
              <img
                src={network.imgUrl}
                alt={network.name}
                className={styles["network-logo"]}
              />
              {network.name}
            </li>
          ))}
        </ul>
        <button onClick={onClose} className={styles["close-modal-btn"]}>
          Close
        </button>
      </div>
    </div>
  );
};

export default NetworkModal;
