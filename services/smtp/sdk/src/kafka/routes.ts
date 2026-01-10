// AUTO-GENERATED - DO NOT EDIT

import type { Primitive, Element } from "./elements";

export const TOPICS = [
  'smtp.send',
] as const;

export type SendArgs = {
  to_emails: string[];
  cc_emails: string[] | undefined;
  bcc_emails: string[] | undefined;
} & { content: (Element | Primitive)[] | Element | Primitive; };

export type TopicArgsMap = {
  'smtp.send': SendArgs,
};

export type Topic = (typeof TOPICS)[number];

export type TopicArgs<T extends Topic> = TopicArgsMap[T];

