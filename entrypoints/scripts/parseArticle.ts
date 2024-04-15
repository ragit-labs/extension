import { Readability } from "@mozilla/readability";

export const parseArticle = () => {
  const article = new Readability(document).parse();
  console.log(article);
};

export const getDocument = () => {
  return document;
};

export default {};
