import OpenAI from 'openai';
import logger from "../config/logger"
import * as Types from "./types"
import processUserPromptBody from "./processUserPromptBody"
import summarizeArticleBody from "./summarizeArticleBody"

export type Response = null | string | {result: string | null}

export default class Ai {
  private _openAi: OpenAI | null = null

  constructor(private readonly _apiKey?: string){
    this._openAi = this._apiKey ? new OpenAI({ apiKey: this._apiKey}) : null
  }

  private async sendPrompt(body: Types.ChatCompletion_t): Promise<Types.ChatReplyChoice_t | any | null> { // For test adding any type
    logger.info("Sending Prompt...")
    try {
      if(this._openAi) {
        const chatCompletion = await this._openAi.chat.completions.create(body)
        if(!chatCompletion.choices || chatCompletion.choices.length === 0) throw new Error("Error sending prompt")
        logger.info("Prompt sent successfully")
        const reply = chatCompletion.choices[0]
        return reply
      }
      
      const reply = {
        message: {
          content: 'this is a test reply'
        }
      }
      logger.info(`Reply received successfully`)
      logger.debug(`Reply: ${reply.message.content}`)
      return reply
    } catch (error) {
      logger.error(`Error sending prompt: ${error.message}`)
      return null
    }
  }

  public async getKeywords({content}:{content: string}): Promise<Response> {
    logger.info("Getting Keywords...")
    try{
      logger.debug(`processing content for body prompt...: ${content}`)
      const body = processUserPromptBody(content)
      if(!body) throw new Error("Error processing content for body prompt")
      logger.info(`body prompt generated successfully`)
      logger.debug("Sending Prompt...")
      const reply = await this.sendPrompt(body)
      if(!reply) throw new Error("Error sending prompt")
      logger.info(`reply received successfully`)
      return {
        result: reply.message.content
      }
    } catch (error) {
      logger.error(`Error getting keywords: ${error.message}`)
      return {
        result: null
      }
    }
  }

  public async summarizeArticles({content, keywords}:{content: Array<string>, keywords: string}){
    logger.info("Summarizing Articles...")
    try{
      logger.debug(`Summarizing articles with keywords: ${keywords}`)
      const body = summarizeArticleBody(content, keywords)
      if(!body) throw new Error("Error summarizing articles")
      logger.info(`body prompt generated successfully`)
      logger.debug("Sending Prompt...")
      const reply = await this.sendPrompt(body)
      if(!reply) throw new Error("Error sending prompt")
      logger.info(`reply received successfully`)
      return {
        result: reply.message.content
      }
    } catch (error) {
      logger.error(`Error summarizing articles: ${error.message}`)
      return {
        result: null
      }
    }
  }
}