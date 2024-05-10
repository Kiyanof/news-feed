import * as Types from "./types"

const makeBody = (contents: Array<string>, keywords: string): Types.ChatCompletion_t => {
    const messages: Array<Types.ChatCompletionMessageParam_t> = []

    messages.push({ role: "system", content: "The following is a user's input from which we need to summarize related news articles." })
    
    for (const content of contents) 
        messages.push({ role: "user", content: content })
    
    messages.push({ role: "assistant", content: keywords })

    const body = {
    messages: messages,
    model: "gpt-3.5-turbo",
    n: 1
  }

  return body
}

export default makeBody