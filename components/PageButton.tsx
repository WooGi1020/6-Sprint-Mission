import React, { useState, useEffect } from "react";
import styles from "@/styles/PageButton.module.css";

interface Props {
  page: number;
  handlePage: (value: number) => void;
  totalCount: number;
}

const PAGE_SIZE = 5;

const PageButton = ({ totalCount, handlePage, page }: Props) => {
  const [isPageDownBtnDisabled, setIsPageDownBtnDisabled] = useState(true);
  const [isPageUpBtnDisabled, setIsPageUpBtnDisabled] = useState(false);
  const totalPages = totalCount / PAGE_SIZE;

  const pageArr = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getButtonValue = (value: number) => {
    handlePage(value);
  };

  const pageDown = () => {
    if (page > 1) {
      handlePage(page - 1);
    }
  };
  const pageUp = () => {
    if (page < pageArr.length) {
      handlePage(page + 1);
    }
  };

  const pageDownMax = () => {
    if (page > 1) {
      handlePage(1);
    }
  };
  const pageUpMax = () => {
    if (page < pageArr.length) {
      handlePage(pageArr.length);
    }
  };

  useEffect(() => {
    if (page > 1) {
      setIsPageDownBtnDisabled(false);
    } else {
      setIsPageDownBtnDisabled(true);
    }
    if (page >= pageArr.length && pageArr.length !== 0) {
      setIsPageUpBtnDisabled(true);
    } else {
      setIsPageUpBtnDisabled(false);
    }
  }, [pageArr, page]);

  return (
    <div className={styles.button}>
      <button disabled={isPageDownBtnDisabled} className={styles["page-side-btn"]} onClick={pageDownMax}>
        &lt;&lt;
      </button>
      <button disabled={isPageDownBtnDisabled} className={styles["page-side-btn"]} onClick={pageDown}>
        &lt;
      </button>
      {pageArr.map((num) => {
        const isVisible = page > 6 ? num >= page - 5 && num <= page + 4 : num >= 1 && num <= 10;
        return (
          isVisible && (
            <button
              className={styles[page === num ? "page-btn-active" : "page-btn"]}
              key={num}
              onClick={() => getButtonValue(num)}
              value={num}
            >
              {num}
            </button>
          )
        );
      })}
      <button disabled={isPageUpBtnDisabled} className={styles["page-side-btn"]} onClick={pageUp}>
        &gt;
      </button>
      <button disabled={isPageUpBtnDisabled} className={styles["page-side-btn"]} onClick={pageUpMax}>
        &gt;&gt;
      </button>
    </div>
  );
};

export default PageButton;
