interface INewsArticle {
    [key: string]: any,
    title: string,
    description: string,
    content: string,
    url: string,
    publishedAt: Date,
    source: {
        name: string,
        url: string
    }
}

interface INews {
    [key: string]: any,
    
}

interface INewsdataArticle extends INewsArticle {
    [key: string]: any,
    pubDate: Date,
    language: string,
    country: string,
    category: string,
    link: string,
}

interface INewsdata extends INews {
    [key: string]: any,
    status: string,
    totalResults: number,
    results: Array<INewsdataArticle>
    nextPage: string

}

interface INewsapiArticle extends INewsArticle {
    [key: string]: any,
}

interface INewsapi extends INews {
    [key: string]: any,
    status: string,
    totalResults: number,
    articles: Array<INewsArticle>
}

interface IGnewArticle extends INewsArticle {
    [key: string]: any,
}

interface IGnews {
    [key: string]: any,
    totalArticles: number,
    articles: Array<IGnewArticle>
}

export {
    INewsdataArticle,
    INewsdata,
    INewsapiArticle,
    INewsapi,
    IGnewArticle,
    IGnews
}