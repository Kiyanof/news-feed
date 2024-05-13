export interface SubscribeModel {
    email: string,
    frequency: 'daily' | 'weekly' | 'monthly'
    prompt: string
    password: string
}