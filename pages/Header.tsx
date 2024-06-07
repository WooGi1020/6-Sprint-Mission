import React, { use, useEffect, useState } from "react";
import styles from "@/styles/Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Header = (): JSX.Element => {
  const pathname = usePathname();
  const [isLogined, setIsLogined] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setIsLogined(true);
    }
  }, []);

  return (
    <>
      <header className={styles.Header}>
        <div className={styles["Header-container"]}>
          <Link href="/">
            <Image
              className={styles["Header-long-img"]}
              src="/images/Header/logoWithIcon.png"
              alt="판다 아이콘이 포함된 로고"
              width={153}
              height={51}
              quality={100}
              priority={true}
            />
            <Image
              className={styles["Header-short-img"]}
              src="/images/Header/logoWithNone.png"
              alt="판다 아이콘이 포함되지 않은 모바일용 로고"
              width={81}
              height={27}
              quality={100}
            />
          </Link>
          <ul className={styles["Header-btns"]}>
            <Link href="/boards" className={styles[pathname.includes("/boards") ? "Header-btn-active" : "Header-btn"]}>
              <li>자유게시판</li>
            </Link>
            <Link href="/Items" className={styles[pathname.includes("/Items") ? "Header-btn-active" : "Header-btn"]}>
              <li>중고마켓</li>
            </Link>
          </ul>
        </div>
        {isLogined ? (
          <Image src="/images/Header/userProfile.png" alt="헤더 프로필 이미지" width={40} height={40} />
        ) : (
          <Link href="/SignIn" className={styles["Header-login-btn"]}>
            로그인
          </Link>
        )}
      </header>
    </>
  );
};

export default Header;
