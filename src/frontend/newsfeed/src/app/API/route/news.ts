import { URLGenerator } from "../conf/main.conf";
import { NEWS_CONFIG } from "../conf/news.conf";
import { NewsModel } from "../model/news";

const getNews = async ({ ...props }: NewsModel) => {
  try {
    const result = await NEWS_CONFIG.getNews.method(
      URLGenerator(NEWS_CONFIG.getNews.endpoint, NEWS_CONFIG.getNews.path, '8004'),
      {
          params: {
            page: props.page
          },
          withCredentials: true
      },
    );
    if(result.status !== 200) return null;
    return result.data;
  } catch (error) {
    return null
  }
};

const countNews = async () => {

  try {
    const result = await NEWS_CONFIG.countNews.method(
      URLGenerator(NEWS_CONFIG.countNews.endpoint, NEWS_CONFIG.countNews.path, '8004'),
      {
          withCredentials: true
      } 
    );
    if(result.status !== 200) return null;
    return result.data;
  } catch (error) {
    return null
  }
}

export { getNews, countNews };
