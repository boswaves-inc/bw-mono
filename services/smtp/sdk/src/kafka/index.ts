// AUTO-GENERATED - DO NOT EDIT

import { CompressionTypes, Kafka, KafkaConfig, Message, Partitioners, Producer } from "kafkajs";
import type { Topic, SendArgs } from "./routes";

export class Smtp {
  private _producer: Producer;

  private constructor(producer: Producer) {
    this._producer = producer;
  }

  private async _send(topic: Topic, input: Message | Message[]) {
    const messages = Array.isArray(input) ? input : [input];
    return await this._producer.send({
      topic,
      messages,
      compression: CompressionTypes.None,
    });
  }

  public async send(body: SendArgs) {
    return await this._send('smtp.send', {
      value: JSON.stringify(body)
    });
  }

  public static async connect({ clientId = '@boswaves-inc/smtp-sdk', ...config }: KafkaConfig): Promise<Smtp> {
    const client = new Kafka({ ...config, clientId });
    const producer = client.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
      allowAutoTopicCreation: false
    });
    await producer.connect();
    return new Smtp(producer);
  }

}

