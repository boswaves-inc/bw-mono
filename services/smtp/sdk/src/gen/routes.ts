// AUTO-GENERATED - DO NOT EDIT
export const TOPICS = [
  'smtp.queue',
  'smtp.schedule',
] as const;

export type QueueArgs = {
  to_emails: string[];
  cc_emails: string[] | undefined;
  bcc_emails: string[] | undefined;
  content: any;
};
export type ScheduleArgs = {
  to_emails: string[];
  cc_emails: string[] | undefined;
  bcc_emails: string[] | undefined;
  content: any;
};
export type TopicArgsMap = {
  'smtp.queue': QueueArgs,
  'smtp.schedule': ScheduleArgs,
};
export type Topic = (typeof TOPICS)[number];
export type TopicArgs<T extends Topic> = TopicArgsMap[T];
