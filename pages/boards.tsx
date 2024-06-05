import React, { useEffect, useState } from "react";
import BoardNavBar from "@/components/BoardNavBar";
import styles from "@/styles/Board.module.css";
import Article from "@/components/Article";
import BestArticle from "@/components/BestArticle";
import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import { getArticles, getBestArticles, ArticleResponse } from "../lib/apis/api";
import useMediaQuery from "@/hooks/useMatchMedia";
import Link from "next/link";

export interface QueryOption {
  orderBy?: string | string[];
  keyword?: string | string[];
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const orderBy = context.query["orderBy"];
  const keyword = context.query["keyword"];

  const res = await getArticles({ orderBy, keyword });
  const articles = res.list ?? [];

  return {
    props: {
      articles,
    },
  };
}

type Articles = {
  articles: ArticleResponse[];
};

const Board = ({ articles }: Articles) => {
  const [bestArticles, setBestArticles] = useState<ArticleResponse[]>([]);
  const [pageSize, setPageSize] = useState<number>(3);

  const isSmallScreen = useMediaQuery("(min-width: 380px) and (max-width: 767px)");
  const isMediumScreen = useMediaQuery("(min-width: 768px) and (max-width: 1199px)");
  const isLargeScreen = useMediaQuery("(min-width: 1200px)");

  const getBestArticleList = async (option: number) => {
    const { list } = await getBestArticles(option);
    setBestArticles(list);
  };

  useEffect(() => {
    if (isLargeScreen) {
      setPageSize(3);
    } else if (isMediumScreen) {
      setPageSize(2);
    } else if (isSmallScreen) {
      setPageSize(1);
    }
  }, [isLargeScreen, isMediumScreen, isSmallScreen]);

  useEffect(() => {
    getBestArticleList(pageSize);
  }, [pageSize]);

  return (
    <>
      <Head>
        <title>자유게시판</title>
      </Head>
      <div className={styles.container}>
        <h2 className={styles["article-top-text"]}>베스트 게시글</h2>
        <section className={styles["best-article-list"]}>
          {bestArticles.map((article) => {
            return (
              <Link href={`/boards/${article.id}`} key={article.title}>
                <BestArticle {...article} />
              </Link>
            );
          })}
        </section>
        <BoardNavBar />
        <section className={styles["all-article-list"]}>
          {articles.map((article) => {
            return (
              <Link href={`/boards/${article.id}`} key={article.title}>
                <Article {...article} />
              </Link>
            );
          })}
        </section>
      </div>
    </>
  );
};

export default Board;
