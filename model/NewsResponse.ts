import news from "./news";

type NewsResponse = {
    status: string,
    totalResults: number,
    articles: news[],
    refetch: () => void,
    loadMore: () => void
  }

  export default NewsResponse;
