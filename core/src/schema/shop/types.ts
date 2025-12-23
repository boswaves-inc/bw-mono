

import type { InferEnum } from "drizzle-orm";
import { customType, pgEnum } from "drizzle-orm/pg-core";

export const citext = customType<{ data: string }>({
    dataType() {
        return 'citext';
    },
});

export const Status = pgEnum('status', [
    'archived',
    'deleted',
    'active',
])

export const PeriodUnit = pgEnum('period_unit', [
    'day',
    'week',
    "month",
    'year'
])

export const OtpType = pgEnum('otp_type', [
    'verify_account',
    'reset_password'
])

export type Status = InferEnum<typeof Status>
export type OtpType = InferEnum<typeof OtpType>
export type PeriodUnit = InferEnum<typeof PeriodUnit>
