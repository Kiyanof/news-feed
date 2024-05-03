import amqp, { Channel, Message } from "amqplib"
import createLogger from "../logger";

const logger = createLogger("rabbitmq-service")

class Rabbit {

    private static _instance: Rabbit | null = null;
    private _connection: amqp.Connection | null = null;
    private _channel: amqp.Channel | null = null;

    private _max_attemp: number = 10

    public static new({...props}){
        logger.debug(` `)
        if(!Rabbit._instance) return new Rabbit(props);
        return Rabbit._instance;
    }

    private constructor({...props}){
        logger.debug(`A new rabbit instance has been created.`)
        this.connect(props).then(async () => {
            logger.debug(`Rabbit: connection established.`)
            logger.debug(`Rabbit: channel creating...`)
            try {
                this._channel = await this.createChannel()
                logger.info(`Rabbit: Channel created successfully`)
            } catch (error) {
                logger.error(`Rabbit: Error while creating channel, Error: ${error}`)
            }            
        })
    }

    private static response(channel: Channel, req: Message, res: {state: boolean, msg: string, body: any}) {
        channel.sendToQueue(req.properties.replyTo, Buffer.from(JSON.stringify(res)), {correlationId: req.properties.correlationId})
        channel.ack(req)
    }
    
    public static handleSuccess (channel: Channel, req: Message, msg: string, body: any) {
      const result = {
        state: true,
        msg,
        body,
      };
      logger.info(msg);
      this.response(channel, req, result)
    };
    
    public static handleError(channel: Channel, req: Message, msg: string, body: any) {
      const result = {
        state: false,
        msg,
        body,
      };
      logger.error(msg + ' with error: ' + body);
      this.response(channel, req, result)
    };
    
    
    public static initQueue (channel: Channel, queue: string, prefetchCount: number) {
        channel.assertQueue(queue, {
            durable: false,
          });
        channel.prefetch(prefetchCount); 
        logger.info(
            `RABBITMQ: ${JSON.stringify(channel)} channel Awaiting RPC requests... with prefetch: ${prefetchCount}`
          );
    }

    private async connect({...props}) {
        const url = `${props.protocol ?? 'amqp'}://${props.username ?? 'guest'}:${props.password ?? 'guest'}@${props.host ?? 'localhost'}:${props.port ?? 5672}/${props.vhost}`
        logger.debug(`Connecting to RabbitMQ at ${url}`)
        try {
            this._connection = await amqp.connect(url)
            logger.info(`Connected to RabbitMQ at ${url}`)
        } catch (error) {
            logger.error(`Failed to connect to RabbitMQ at ${url}`)
            this._connection = null
        }
    }

    private async createChannel() {
        if(!this._connection) return null
        return await this._connection.createChannel()
    }

    public isReady() {
        return new Promise((resolve, _reject) => {
            let i = 0;
            const checkReady = () => {
                i++;
                if(i < this._max_attemp) {
                    logger.debug(`Rabbit: ${i} attemp to checking channel exist`)
                    if(this._channel) {
                        logger.info(`Rabbit: channel is ready`)
                        return resolve(true)
                    } else {
                        logger.warn(`Rabbit: channel is not ready...`)
                    }

                    setTimeout(checkReady, 500)
                } else {
                    logger.warn(`Rabbit: channel not!!`)
                    resolve(false)
                }
            }

            checkReady()
        })
    }

    public async callProcedure(cb: (channel: Channel, {...props}) => Promise<any>, {...props}) {
        if(this._channel){
            logger.debug(`Rabbit: Processing a procedure call.`)
            try {
                const result = await cb(this._channel, props)
                logger.debug(`Rabbit: CB result = ${JSON.stringify(result)}`)
                if(result.state){
                    logger.info(`Rabbit: ${cb.name} procedure called successfully`)
                    return result
                }
                else throw new Error(`consumer send me error`)
            } catch (error) {
                logger.error(`Rabbit: ${cb.name} procudure error happened: ${error}`)
            }
        }
        else logger.warn(`Rabbit: channel not exist!`)
    }

    public addToQueue(consumer: (channel: Channel) => any) {
        if(this._channel){
            consumer(this._channel)
        }
        else logger.warn(`Rabbit: channel not exist!`)
    }

    destroy() {
        try {
            this._channel?.close()
            this._connection?.close()
        } catch (error) {
            logger.error(`Rabbit: error happened while RabbitMQ Instance destructing..., Error: ${error} `)
        }
        Rabbit._instance = null
    }

}

export { Channel }
export default Rabbit