import React from "react";
import styles from "./ExtraContent.module.scss";
import ByzantineLogo from "@/assets/logo.png";
import Image from "next/image";
import { Tooltip } from "@nextui-org/tooltip";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

interface SliderProps {
  step: number;
  max: number;
}

const Slider: React.FC<SliderProps> = ({ step, max }) => {
  return (
    <div className={styles.sliderDiv}>
      {[...Array(max)].map((_, index) => (
        <div
          key={index}
          className={`${styles.step} ${
            index + 1 === step ? styles.active : ""
          }`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

const ExtraContent = () => {
  const { user } = useDynamicContext();
  console.log(user);
  return (
    <div className={styles.extraContent}>
      <Image
        src={ByzantineLogo}
        height={40}
        className={styles.logoClariFi}
        alt="Logo of ClariFi"
      />
      <div className={styles.titleExtra}>Connect your wallet</div>
      <div>
        Connecting your wallet is like "logging in" to Web3. Select your wallet
        from the options to get started.
      </div>
      <div className={styles.dontHave}>
        I dont have a wallet
        <Tooltip
          content={<div className="tooltip">Create it on metamask.io</div>}
        >
          <div className={styles.info}>i</div>
        </Tooltip>
      </div>
      <div className={styles.empty}></div>
      <div className={styles.sliderDiv}>
        <Slider step={3} max={4} />
      </div>
    </div>
  );
};

export default ExtraContent;
