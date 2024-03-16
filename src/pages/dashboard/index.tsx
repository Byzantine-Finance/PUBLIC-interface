import Link from "next/link";

import styles from "./index.module.scss";

const listModules = [
  {
    address: "0x0953e7aca371ce71ee673382fda8b75976b24630",
    openedon: "2020-06-02 15:29",
    status: "exiting",
    withdraw: 0.015878,
  },
  {
    address: "0x6e497a83c9d5db09861810e0cab549298ba6e49f",
    openedon: "2023-01-21 02:36",
    status: "active",
    withdraw: 0.0164123,
  },
  {
    address: "0x8fb18f64d620cea7b2714ee6f3cf86e718b6ae1e",
    openedon: "2023-10-01 03:41",
    status: "pending",
    withdraw: 0.0035037,
  },
  {
    address: "0xcb8e70b471202f3b5f726ce90052071b46579120",
    openedon: "2015-01-25 05:52",
    status: "exiting",
    withdraw: 0.0087259,
  },
  {
    address: "0xa80014548b6c2f6058758503f223b471180e6e4b",
    openedon: "2019-06-18 20:55",
    status: "active",
    withdraw: 0.0187183,
  },
];

export default function Page() {
  return (
    <div className={styles.container}>
      <table className={styles.dashboard}>
        <div className={styles.titleTab}>Strategy module</div>
        <td className={`${styles.lineTab} ${styles.legend}`}>
          <tr className={styles.itemLineTab}>Address</tr>
          <tr className={styles.itemLineTab}>Opened on</tr>
          <tr className={styles.itemLineTab}>Status</tr>
          <tr className={styles.itemLineTab}>Withdrawable</tr>
        </td>
        {listModules.map((e) => (
          <td className={styles.lineTab}>
            <tr className={styles.itemLineTab}>{e.address}</tr>
            <tr className={styles.itemLineTab}>{e.openedon}</tr>
            <tr className={styles.itemLineTab}>{e.status}</tr>
            <tr className={styles.itemLineTab}>{e.withdraw}</tr>
          </td>
        ))}
      </table>
    </div>
  );
}
