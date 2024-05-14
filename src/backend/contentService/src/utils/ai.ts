import OpenAI from 'openai';
import logger from "../config/logger"
import * as Types from "./types"
import processUserPromptBody from "./processUserPromptBody"
import summarizeArticleBody from "./summarizeArticleBody"

export type Response = null | string | {result: string | null}

export default class Ai {
  private _openAi: OpenAI
  private _apiKey: string

  get apiKey(){
    return this._apiKey
  }

  set apiKey(key: string){
    this._apiKey = key
  }

  constructor(){
    this._openAi = new OpenAI({ apiKey: this._apiKey});
  }

  public async getKeywords({content}:{content: string}): Promise<Response> {
    try{
      const body = processUserPromptBody(content)
      const reply = await this.sendPrompt(body)
      return {
        result: reply.message.content
      }
    } catch (error) {
      logger.error(error)
      return {
        result: null
      }
    }
  }

  public async summarizeArticles({contents, keywords}:{contents: Array<string>, keywords: string}){
    try{
      const body = summarizeArticleBody(contents, keywords)
      const reply = await this.sendPrompt(body)
      return {
        result: reply.message.content
      }
    } catch (error) {
      logger.error(error)
      return {
        result: null
      }
    }
  }

  private async sendPrompt(body: Types.ChatCompletion_t): Promise<Types.ChatReplyChoice_t> {
    logger.info("Sending Prompt...")
    const chatCompletion = await this._openAi.chat.completions.create(body)
    const reply = chatCompletion.choices[0]
    logger.info(reply)
    return reply
  }
}