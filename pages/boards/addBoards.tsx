import React, { useState, useRef, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import styles from "@/styles/addBoards.module.css";
import { useRouter } from "next/router";
import { articleRegisterValidation } from "@/utils/validations";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { postArticle, getImageUrl } from "@/lib/apis/api";

interface Props {
  name: string;
  value: File | null;
  onChange: (name: string, value: File | null) => void;
}

function ArticleImg({ name, value, onChange }: Props) {
  const [preview, setPreview] = useState<string | StaticImport>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextImg = e.target.files?.[0];
    if (nextImg) {
      onChange(name, nextImg);
    }
  };

  const handleClearClick = useCallback(() => {
    const inputNode = inputRef.current;
    if (inputNode) {
      inputNode.value = "";
      onChange(name, null);
    }
  }, [name, onChange]);

  useEffect(() => {
    if (!value) return;
    const blob = typeof value === "string" ? new Blob([value], { type: "text/plain" }) : value;

    const nextPreview = URL.createObjectURL(blob);
    setPreview(nextPreview);

    return () => {
      URL.revokeObjectURL(nextPreview);
    };
  }, [value]);

  return (
    <div className={styles["article-img container"]}>
      <h3>상품 이미지</h3>
      <div className={styles["article-img"]}>
        <input
          type="file"
          name="iamge"
          id="article-img-input"
          onChange={handleFileChange}
          ref={inputRef}
          className={styles["article-img-input"]}
        />
        <label htmlFor="article-img-input" className={styles["article-img-label"]}>
          <Image
            className={styles["article-image-tag"]}
            src="/images/Articles/plus-icon.svg"
            alt="파일 이미지 선택"
            width={48}
            height={48}
          />
          <p className={styles["article-img-register-text"]}>이미지 등록</p>
        </label>
        {value && (
          <div className={styles["prev-img"]}>
            {preview && (
              <Image
                className={styles["article-prev-image-tag"]}
                src={preview}
                alt="파일 이미지 미리보기"
                fill
                style={{ objectFit: "cover" }}
              />
            )}
            <button type="button" onClick={handleClearClick}>
              X
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export interface ArticleValue {
  title: string;
  content: string;
  image: File | null;
}

interface formData {
  title?: string;
  content?: string;
  image?: string | null;
}

interface ImageUrl {
  image: string | File | null;
}

const WriteArticle = () => {
  const [articleValue, setArticleValue] = useState<ArticleValue>({
    image: null,
    content: "",
    title: "",
  });
  const [formData, setFormData] = useState<formData>({
    title: "",
    content: "",
    image: null,
  });
  const [imageUrl, setImageUrl] = useState<ImageUrl>({
    image: null,
  });
  const [isValidBtn, setIsValidBtn] = useState<boolean>(true);
  const router = useRouter();

  const handleChange = (name: string, value: string | File | null) => {
    setArticleValue((prevArticleValue) => ({
      ...prevArticleValue,
      [name]: value,
    }));
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    if (name === "image") {
      setImageUrl((prevImageUrl) => ({
        ...prevImageUrl,
        image: value,
      }));
    }
  };

  const handleInputValuesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleTextAreaValuesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    try {
      const res = await getImageUrl(imageUrl, token);
      const url = res?.url;
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: url,
      }));
      try {
        await postArticle(formData, token);
        router.push("/boards");
      } catch (e) {
        console.error(`error : ${e}`);
        alert("등록에 실패했습니다.");
      }
    } catch (e) {
      console.error(`error : ${e}`);
      alert("잘못된 파일 형식입니다.");
    }
  };

  useEffect(() => {
    const isValidInput = articleRegisterValidation({ ...articleValue });
    setIsValidBtn(isValidInput);
  }, [articleValue]);

  return (
    <form className={styles["article-form"]} onSubmit={handleSubmit}>
      <div className={styles["article-form-top"]}>
        <h2 className={styles["article-form-top-title"]}>게시글 쓰기</h2>
        <button
          id="register-btn"
          className={styles[isValidBtn ? "register-btn" : "active"]}
          disabled={isValidBtn}
          type="submit"
        >
          등록
        </button>
      </div>
      <div className={styles["article-name container"]}>
        <h3>
          <span className={styles["article-name-span"]}>*</span>제목
        </h3>
        <label htmlFor="article-title" className={styles["article-title-label"]}></label>
        <input
          name="title"
          type="text"
          id="article-title"
          className={styles["article-title-input"]}
          placeholder="제목을 입력해주세요"
          onChange={handleInputValuesChange}
          value={articleValue.title}
        />
      </div>
      <div className={styles["article-content container"]}>
        <h3>
          <span className={styles["article-content-span"]}>*</span>내용
        </h3>
        <label htmlFor="article-content" className={styles["article-content-label"]}></label>
        <textarea
          name="content"
          className={styles["article-content-textarea"]}
          id="article-content"
          placeholder="내용을 입력해주세요"
          onChange={handleTextAreaValuesChange}
          value={articleValue.content}
        ></textarea>
      </div>
      <ArticleImg name="image" value={articleValue.image} onChange={handleChange} />
    </form>
  );
};

export default WriteArticle;
