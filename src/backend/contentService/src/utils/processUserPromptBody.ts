import * as Types from "./types"

const makeBody = (content: string): Types.ChatCompletion_t => ({
    messages: [
      { role: "system", content: "The following is a user's input from which we need to extract keywords related to their interests in news topics." },
      { role: "user", content: content },
      { role: "assistant", content: "Find keywords related to the user's interests in news." }
    ],
    model: "gpt-3.5-turbo",
    n: 1
  })

export default makeBody