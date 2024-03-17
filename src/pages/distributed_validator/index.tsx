"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

import Popup from "reactjs-popup";

import styles from "./index.module.scss";

import { createObolCluster } from "../../sdk/obol-sdk";

const OPERATORS_NEEDED = 4;
const FEE_RECIPIENT_ADDRESS = "0x3CD4958e76C317abcEA19faDd076348808424F99";
const WITHDRAWAL_ADDRESS = "0x3CD4958e76C317abcEA19faDd076348808424F99";

export default function DV() {

  const { isConnected, address } = useAccount();

  const [operatorsList, setOperatorsList] = useState<string[]>([]);
  const [createClusterPopup, setCreateClusterPopup] = useState<boolean>(false);
  const [invitationLink, setInvitationLink] = useState<string>("");
  const [invitationLinkPopup, setInvitationLinkPopup] = useState<boolean>(false);

  useEffect(() => {
    if (invitationLink != "") {
      setInvitationLinkPopup(true);
    }
  }, [invitationLink]);

  const CURRENT_OPERATORS = operatorsList.length;

  function joinCluster(address: string) {
    if (!operatorsList.includes(address)) {
      setOperatorsList((prev) => [...prev, address]);
    } else {
      alert("You are already on the waiting list");
    }
  }

  function prepareCreateCluster() {
    if (isConnected) {
      if (operatorsList.length < OPERATORS_NEEDED) {
        alert("You need at least 4 operators to create a cluster");
      } else {
        setCreateClusterPopup(true);
      }
    } else {
      alert("Connect your wallet to create a cluster");
    }
  }

  function activateCluster() {
    console.log("todo create cluster");
  }

  function jauge(level: number, max: number) {
    return (
      <div className={styles.jauge}>
        <div
          className={styles.level}
          style={{ width: (level / max) * 100 + "%" }}
        ></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        className={
          isConnected
            ? styles.joinClusterButtonEnable
            : styles.joinClusterButtonDisable
        }
        onClick={async () => {
          if (address) {
            joinCluster(address);
          } else {
            alert("Please connect your wallet");
          }
        }}
      >
        Join a Cluster
      </button>
      <table className={styles.tab}>
        <caption className={styles.caption}>
          Operators willing to join a DV cluster
        </caption>

        <tr className={styles.head}>
          <th className={styles.opCol}>Operators</th>
          <th className={styles.addressCol}>Addresses</th>
        </tr>

        <tbody>
          {operatorsList.map((addr, index) => (
            <tr key={index}>
              <td className={styles.opCell}>{`Op${index}`}</td>
              <td className={styles.addrCell}>{addr}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.sdkIntercation}>
        <div className={styles.containerRightObol}>
          <button
            className={styles.btnCreateCluster}
            onClick={() => {
              prepareCreateCluster();
            }}
          >
            Create a cluster
          </button>
          {createClusterPopup && (
            <CreateClusterPopup
              createClusterPopup={createClusterPopup}
              setCreateClusterPopup={setCreateClusterPopup}
              operatorsList={operatorsList}
              setInvitationLink={setInvitationLink}
            />
          )}
          {jauge(CURRENT_OPERATORS, OPERATORS_NEEDED)}
          <button
            className={styles.btnActivateCluster}
            onClick={activateCluster}
            disabled={CURRENT_OPERATORS % OPERATORS_NEEDED == 0 ? false : true}
            style={{ opacity: CURRENT_OPERATORS / OPERATORS_NEEDED }}
          >
            Activate Distributed Validator
          </button>
        </div>
      </div>
      {invitationLinkPopup && (
        <Popup
          open={invitationLinkPopup}
          closeOnDocumentClick={false}
          position={"top center"}
          trigger={<div></div>}
          arrow={false}
          offsetY={10}
        >
          <div>
            <button
              className={styles.close}
              onClick={() => {
                setInvitationLinkPopup(false);
              }}
            >
              &times;
            </button>
            <div className={styles.invitationContent}>
              Direct the operators to{" "}
              <a
                href={invitationLink}
                target="_blank"
                className={styles.linkColor}
              >
                {invitationLink}
              </a>{" "}
              to complete the key generation process
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
}

const CreateClusterPopup: React.FC<{
  createClusterPopup: boolean;
  setCreateClusterPopup: React.Dispatch<React.SetStateAction<boolean>>;
  operatorsList: string[];
  setInvitationLink: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  createClusterPopup,
  setCreateClusterPopup,
  operatorsList,
  setInvitationLink,
}) => {
  async function createCluster(operatorsList: string[], clusterName: string) {
    const clusterConfig = {
      name: clusterName,
      operators: [
        { address: operatorsList[0] },
        { address: operatorsList[1] },
        { address: operatorsList[2] },
        { address: operatorsList[3] },
      ],
      validators: [
        {
          fee_recipient_address: FEE_RECIPIENT_ADDRESS,
          withdrawal_address: WITHDRAWAL_ADDRESS,
        },
      ],
    };

    let configHash = await createObolCluster(clusterConfig);
    console.log("configHash", configHash);
    const invitationLink = `https://goerli.launchpad.obol.tech/dv?configHash=${configHash}`;
    return invitationLink;
  }

  const [clusterName, setClusterName] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClusterName(e.target.value);
  };

  return (
    <>
      <Popup
        open={createClusterPopup}
        closeOnDocumentClick={false}
        position={"top center"}
        trigger={<div></div>}
        arrow={false}
        offsetY={60}
      >
        <div>
          <button
            className={styles.close}
            onClick={() => {
              setCreateClusterPopup(false);
            }}
          >
            &times;
          </button>
          <div className={styles.popupContainer}>
            <div className={styles.header}>Create a Cluster</div>
            <div className={styles.content}>
              <p className={styles.mainMessage}>
                You are about to create a cluster with the following operators:
                <br />
              </p>
              {operatorsList.map((addr, index) => (
                <li key={index}>
                  Op{index}: {addr}
                </li>
              ))}
              <div className={styles.clusterNameDiv}>
                <b>Please choose a cluster name:</b>
                <input
                  className={styles.clusterNameInput}
                  type="text"
                  spellCheck={false}
                  placeholder="cluster_name"
                  value={clusterName}
                  onChange={handleInputChange}
                ></input>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              {!isCreating ? (
                <>
                  <button
                    className={styles.button}
                    onClick={async () => {
                      const invitationLink = await createCluster(
                        operatorsList,
                        clusterName
                      );
                      console.log("invitationLink", invitationLink);
                      setInvitationLink(invitationLink);
                      setCreateClusterPopup(false);
                    }}
                    disabled={clusterName == ""}
                  >
                    Create
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => {
                      setCreateClusterPopup(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button className={styles.buttonWhenDeploying}>
                  Creating...
                </button>
              )}
            </div>
          </div>
        </div>
      </Popup>
    </>
  );
};
