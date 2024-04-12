export async function getProduct(order = "recent") {
  try {
    let query = `orderBy=${order}`;
    if (order !== "recent" && order !== "favorite") {
      query = `keyword=${order}`;
    }
    const response = await fetch(`https://panda-market-api.vercel.app/products/?${query}`);
    const data = response.json();
    return data;
  } catch (error) {
    console.error(`${error} : error`);
  }
}

export async function getBestProduct() {
  try {
    const response = await fetch(`https://panda-market-api.vercel.app/products/?orderBy=favorite`);
    const data = response.json();
    return data;
  } catch (error) {
    console.error(`${error} : error`);
  }
}
