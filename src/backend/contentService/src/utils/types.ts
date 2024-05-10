import OpenAI from 'openai';

export type ChatCompletion_t = OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming
export type ChatReplyChoice_t = OpenAI.Chat.Completions.ChatCompletion.Choice
export type ChatCompletionMessageParam_t = OpenAI.Chat.Completions.ChatCompletionMessageParam