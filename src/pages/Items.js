import { useEffect, useState, useRef } from "react";
import "./Items.css";
import ShowBestProducts from "../components/ShowBestProducts";
import ShowProducts from "../components/ShowProducts";
import PageButton from "../components/PageButton";
import { getProduct, getBestProduct } from "../components/api";
import debounce from "../components/common/debounce";

function App() {
  const [products, setProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [selectValue, setSelectValue] = useState("최신순");
  const [totalCount, setTotalCount] = useState();
  const [width, setWidth] = useState();
  const [order, setOrder] = useState({
    order: "recent",
    page: 1,
    pageSize: 10,
  });
  const handleLoad = async (orderQuery) => {
    const { list } = await getProduct(orderQuery);
    setProducts(list);
  };

  const handleBestLoad = async () => {
    const { list } = await getBestProduct();
    setBestProducts(list);
  };

  function onChangeSelect(e) {
    const value = e.target.value;
    setSelectValue(value);
    value === "좋아요순"
      ? setOrder((prevOrder) => ({ ...prevOrder, order: "favorite" }))
      : setOrder((prevOrder) => ({ ...prevOrder, order: "recent" }));
  }

  const getSelectValue = (value) => {
    return value;
  };

  function onChangeInput(e) {
    const value = e.target.value;
    value === ""
      ? setOrder((prevOrder) =>
          selectValue === "좋아요순" ? { ...prevOrder, order: "favorite" } : { ...prevOrder, order: "recent" }
        )
      : setOrder((prevOrder) => ({ ...prevOrder, order: value }));
  }

  const getTotalCount = async () => {
    const { totalCount } = await getBestProduct();
    setTotalCount(totalCount);
  };

  const handlePageNum = () => {
    if (!isNaN(totalCount)) {
      const pageNum = Math.ceil(totalCount / order.pageSize);
      return pageNum;
    }
  };

  const handlePage = (value) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      page: value,
    }));
  };
  const handlePageSize = (width) => {
    if (width >= 1200) {
      return 10;
    } else if (width >= 768 && width <= 1199) {
      return 6;
    } else if (width >= 380 && width <= 767) {
      return 4;
    }
  };

  const handleResize = debounce(() => {
    setWidth(window.innerWidth);
  }, 200);

  useEffect(() => {
    const pageSize = handlePageSize(width);
    setOrder((prevOrder) => ({ ...prevOrder, pageSize }));
  }, [width]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    handleLoad(order);
  }, [order]);

  useEffect(() => {
    handleBestLoad();
    getTotalCount();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <ShowBestProducts products={bestProducts} />
        <ShowProducts
          onChangeSelect={onChangeSelect}
          onChangeInput={onChangeInput}
          products={products}
          getSelectValue={getSelectValue}
        />
      </div>
      <PageButton handlePageNum={handlePageNum} handlePage={handlePage} />
    </div>
  );
}

export default App;
