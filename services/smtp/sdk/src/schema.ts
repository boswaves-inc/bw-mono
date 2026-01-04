// AUTO-GENERATED - DO NOT EDIT
export type QueueArgs = {
  template: string;
  to_emails: string[];
  cc_emails: string[] | undefined;
  bcc_emails: string[] | undefined;
};
export type ScheduleArgs = {
  template: string;
  to_emails: string[];
  cc_emails: string[] | undefined;
  bcc_emails: string[] | undefined;
};

export const TOPICS = [
  'smtp.queue',
  'smtp.schedule',
] as const;

export type Topic = (typeof TOPICS)[number];
