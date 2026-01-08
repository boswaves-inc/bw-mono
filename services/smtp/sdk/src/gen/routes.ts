// AUTO-GENERATED - DO NOT EDIT
import type { Primitive, Element } from "./elements";

export const TOPICS = [
  'smtp.queue',
] as const;

export type QueueArgs = {
  to_emails: string[];
  cc_emails: string[] | undefined;
  bcc_emails: string[] | undefined;
} & { content: (Element | Primitive)[] | Element | Primitive; };
export type TopicArgsMap = {
  'smtp.queue': QueueArgs,
};
export type Topic = (typeof TOPICS)[number];
export type TopicArgs<T extends Topic> = TopicArgsMap[T];
