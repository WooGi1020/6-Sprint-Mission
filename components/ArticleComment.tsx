import React, { ChangeEvent, useState } from "react";
import styles from "@/styles/ArticleComment.module.css";
import { CommentsResponse, CommentResponse } from "@/lib/apis/api";
import Image from "next/image";
import formatTimeAgo from "@/utils/formatTimeAgo";
import Link from "next/link";
import { commentRegisterValidation } from "@/utils/validations";

function CommentList({ content, createdAt, writer }: CommentResponse) {
  return (
    <div className={styles["comment-container"]}>
      <div className={styles["comment-container__top"]}>
        <p className={styles["comment-content"]}>{content}</p>
        <button className={styles["comment-edit-btn"]}>
          <Image src="/images/Articles/hamburger-icon.svg" alt="게시글 수정 버튼" width={24} height={24} />
        </button>
      </div>
      <div className={styles["comment-container__bottom"]}>
        <Image src="/images/Articles/profile.png" alt="댓글 작성자 프로필 이미지" width={32} height={32}></Image>
        <div className={styles["comment-writer__info"]}>
          <span className={styles["comment-writer__nickname"]}>{writer.nickname}</span>
          <span className={styles["comment-writer__time"]}>{formatTimeAgo(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function ArticleComment({ list, nextCursor }: CommentsResponse) {
  const [isButtonDisabled, setisButtonDisabled] = useState(true);

  const handleTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    const validate = commentRegisterValidation(value);
    setisButtonDisabled(validate);
  };

  return (
    <div className={styles["comment-wrapper"]}>
      <label htmlFor="comment-textarea" className={styles["comment-input-label"]}>
        댓글 달기
      </label>
      <textarea
        onChange={handleTextarea}
        name="comment-textarea"
        id="comment-textarea"
        className={styles["comment-textarea"]}
        placeholder="댓글을 입력해주세요."
      ></textarea>
      <button
        id="comment-register-btn"
        className={styles[isButtonDisabled ? "comment-register-btn" : "active"]}
        disabled={isButtonDisabled}
      >
        등록
      </button>
      {list.length !== 0 ? (
        list.map((comment) => {
          return <CommentList key={comment.id} {...comment} />;
        })
      ) : (
        <Image
          className={styles["no-comment-img"]}
          src="/images/Articles/no-comment.png"
          alt="댓글이 없을 때 출력되는 이미지"
          width={151}
          height={195}
        />
      )}
      <Link href="/boards" className={styles["go-back-btn"]}>
        목록으로 돌아가기
        <Image src="/images/Articles/go-back-icon.svg" alt="목록으로 돌아가기 버튼 아이콘" width={24} height={24} />
      </Link>
    </div>
  );
}

export default ArticleComment;
