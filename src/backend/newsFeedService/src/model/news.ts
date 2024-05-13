import mongoose from "mongoose";
import MONGO_CONFIG from "src/config/mongo.config";

interface INews {
    [key: string]: any,
    title: string,
    description: string,
    content: string,
    category: string,
    author: string,
    keywords: string,
    country: string,
    language: string,
    source: string,
    url: string,
    publishedAt: Date,
}

const newsSchema = new mongoose.Schema<INews>({
    title: { type: String, required: true},
    description: { type: String, required: true},
    content: { type: String, required: true },
    category: { type: String, required: false, default: "General" },
    author: { type: String, required: false, default: "Anonymous" },
    keywords: { type: String, required: false, default: "" },
    country: { type: String, required: false, default: "Unknown" },
    language: { type: String, required: false, default: "English" },
    source: { type: String, required: false, default: "Unknown"},
    url: { type: String, required: false, default: ""},
    publishedAt: { type: Date, required: false, default: Date.now() },
    createdAt: { type: Date, required: false, default: Date.now(), expires: +MONGO_CONFIG.NEWS_EXPIRE},
})

const NewsModel = mongoose.model<INews>('News', newsSchema)
export default NewsModel;