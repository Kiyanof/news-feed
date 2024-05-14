import { parsePromptProducer } from "content-service"
import { Channel } from "rabbitmq"
import logger from "../config/logger"
import KeywordsModel from "../model/keywords"

type Response = {
    state: boolean,
    msg: string,
    body: {
        result: string
    }
}

const parsePrompt = async (channel: Channel,{content}: {content: string}): Promise<string | null> => {
    let result = null 
    await parsePromptProducer(channel, {content}, (response) => {
        return new Promise((resolve, _reject) => {
            if(response){
                result = (response as Response).body.result
                resolve(result)
            } else {
                resolve(null)
            }
        })
    })
    return result
}

const addKeyword = async (prompt: string): Promise<boolean> => {
    logger.info(`Adding keyword: ${prompt}`)
    try {
        const keywords = Array.from(new Set(prompt.split(' '))).join(' ')
        for (const keyword of keywords) {
            try {
                const newKeyword = new KeywordsModel({ title: keyword })
                const result = await newKeyword.save() 
                logger.debug(`Keyword added successfully: ${result}`)
            } catch (error) {
                logger.error(`Error adding keyword: ${error.message}`)
            }
        }
        return true
    } catch (error) {
        logger.error(`Error adding keyword: ${error.message}`)
        return false
    }
}

const readAllKeywords = async (): Promise<{result: Array<string> | null}> => {
    logger.info('Reading all keywords...')
    try {
        const keywords = await KeywordsModel.find({}).select('title')
        if(keywords.length === 0) throw new Error('No keywords found')
        
        const result = keywords.map(keyword => keyword.title)
        logger.info('Keywords read successfully')
        return {result: result}
    } catch (error) {
        logger.error(`Error reading keywords: ${error.message}`)
        return {result: null}
    }
}



export {
    parsePrompt,
    addKeyword,
    readAllKeywords
}