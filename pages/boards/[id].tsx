import React from "react";
import { getArticles } from "@/lib/apis/getArticle.api";
import { GetStaticPropsContext } from "next";
import { ArticleResponse, getArticle } from "@/lib/apis/getArticle.api";
import { CommentsResponse, getArticleComments } from "@/lib/apis/getComment.api";
import styles from "@/styles/DetailArticle.module.css";
import Image from "next/image";
import formatTime from "@/utils/formatTime";
import ArticleComment from "@/components/ArticleComment";

export async function getStaticPaths() {
  const res = await getArticles({});
  const articles = res.list;
  const paths = articles.map((article) => ({
    params: {
      id: String(article.id),
    },
  }));
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  if (!context.params || !context.params.id) {
    return {
      notFound: true,
    };
  }

  const articleId = context.params.id;
  let article;
  let comments;

  try {
    const articleRes = await getArticle(articleId);
    const commentRes = await getArticleComments(articleId, 10);
    article = articleRes;
    comments = commentRes;
  } catch {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      article,
      comments,
    },
    revalidate: 10, // Revalidate the page every 10 seconds (if needed)
  };
}

type Props = {
  article: ArticleResponse;
  comments: CommentsResponse;
};

const ArticleWithComment = ({ article, comments }: Props) => {
  return (
    <div className={styles["article-with-comments-wrapper"]}>
      <article className={styles["article-container"]}>
        <div className={styles["article-info__top"]}>
          <h1 className={styles["article-info__top-title"]}>{article.title}</h1>
          <button className={styles["article-info__top-edit-btn"]}>
            <Image src="/images/Articles/hamburger-icon.svg" alt="게시글 수정 버튼" width={24} height={24} />
          </button>
        </div>

        <div className={styles["article-info__bottom"]}>
          <div className={styles["article-info__bottom-left"]}>
            <Image
              className={styles["article-info__bottom-profile"]}
              src="/images/Articles/profile.png"
              alt="게시글 작성자 프로필 이미지"
              width={24}
              height={24}
            ></Image>
            <p className={styles["article-info__bottom-writer"]}>{article.writer.nickname}</p>
            <p className={styles["article-info__bottom-createdAt"]}>{formatTime(article.createdAt)}</p>
          </div>
          <div className={styles["article-info__bottom-right"]}>
            <Image
              className={styles["article-info__bottom-like-icon"]}
              src="/images/Articles/likeIcon.svg"
              alt="게시글 좋아요 아이콘"
              width={24}
              height={24}
            ></Image>
            <span className={styles["article-info__bottom-likeCount"]}>{article.likeCount}</span>
          </div>
        </div>
        <div className={styles["article-content"]}>
          <p className={styles["article-content-text"]}>{article.content}</p>
          {article.image && (
            <div className={styles["article-content-img"]}>
              <Image src={article.image} alt="게시글 등록 이미지" fill style={{ objectFit: "contain" }}></Image>
            </div>
          )}
        </div>
      </article>
      <ArticleComment {...comments} />
    </div>
  );
};

export default ArticleWithComment;
