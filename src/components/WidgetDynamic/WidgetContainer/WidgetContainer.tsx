import React from "react";
import { DynamicEmbeddedWidget } from "@dynamic-labs/sdk-react-core";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import ExtraContent from "../ExtraContent/ExtraContent";
import styles from "./WidgetContainer.module.scss";

const WidgetContainer = () => {
  const isLoggedIn = useIsLoggedIn();

  return (
    <div className={styles.widgetContainer}>
      {true && <ExtraContent />}
      <DynamicEmbeddedWidget />
    </div>
  );
};

export default WidgetContainer;
