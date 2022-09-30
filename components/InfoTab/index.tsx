import React from "react";
import styles from "./InfoTab.module.css";

const InfoTab = ({contentList}) => {
  return (
    <>
      <div className={styles.InfoTabContainer}>
        <p className={styles.InfoTabTitle}>{contentList[0].leftTitle}</p>

        <div className={styles.InfoTabBlock}>
          <p className={styles.InfoTabTitle}>{contentList[0].rightTitle}</p>
          <p className={styles.InfoTabContent}>{contentList[0].rightContent}</p>

          <button onClick={contentList[0].onClick}>{contentList[0].buttonTitle.toLocaleUpperCase()} ➔</button>

        </div>
      </div>
      <div className={styles.InfoTabContainerBlack}>
        <p className={styles.InfoTabTitleBlack}>{contentList[1].leftTitle}</p>

        <div className={styles.InfoTabBlockBlack}>
          <p className={styles.InfoTabTitleBlack}>{contentList[1].rightTitle}</p>
          <p className={styles.InfoTabContentBlack}>{contentList[1].rightContent}</p>

          <button onClick={contentList[1].onClick}>{contentList[1].buttonTitle.toLocaleUpperCase()}➔</button> 

        </div>
      </div>
    </>
  );
};

export { InfoTab };