import mongoose from "mongoose";

interface IKeywords {
    title: string,
    createdAt: Date,
}

const KeywordsSchema = new mongoose.Schema<IKeywords>({
    title: { type: String, required: true, unique: true, index: true},
    createdAt: { type: Date, required: true, default: Date.now }  
})

const KeywordsModel = mongoose.model<IKeywords>("Keywords", KeywordsSchema)
export default KeywordsModel