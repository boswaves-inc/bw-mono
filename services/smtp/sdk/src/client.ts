import { CompressionTypes, Kafka, KafkaConfig, Message, Partitioners, Producer } from "kafkajs";
import { QueueArgs, ScheduleArgs, Topic } from "./gen/routes";

export class Smtp {
    private _producer: Producer;

    private constructor(producer: Producer) {
        this._producer = producer
    }

    // [n: Topic]: (body: QueueArgs) => {
    //     // const records = await this._send('smtp.queue', {
    //     //     value: JSON.stringify(body)
    //     // })
    // }

    private async _send(topic: Topic, input: Message | Message[]) {
        const messages = Array.isArray(input) ? input : [input]

        return await this._producer.send({
            topic,
            messages,
            compression: CompressionTypes.None,
        })
    }


    public async queue(body: QueueArgs) {
        const records = await this._send('smtp.queue', {
            value: JSON.stringify(body)
        })
    }

    public async schedule(body: ScheduleArgs) {
        const records = await this._send('smtp.schedule', {
            value: JSON.stringify(body)
        })
    }

    public static async connect({ clientId = '@boswaves-inc/smtp-sdk', ...config }: KafkaConfig) {
        const client = new Kafka({ ...config, clientId })
        const producer = client.producer({
            createPartitioner: Partitioners.DefaultPartitioner,
            allowAutoTopicCreation: false
        })

        await producer.connect()

        return new Smtp(producer)
    }
}