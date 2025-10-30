import type { ApiVersionEnum, ChargeModelEnum, EntityTypeEnum, PeriodUnitEnum, SourceEnum } from "chargebee";
import type { Request } from "express";

export enum EventType {
    PLAN_CREATED = 'plan_created',
    PLAN_UPDATED = 'plan_updated',
    PLAN_DELETED = 'plan_deleted',

    ADDON_CREATED = 'addon_created',
    ADDON_UPDATED = 'addon_updated',
    ADDON_DELETED = 'addon_deleted',
}

export interface WebhookAddonEvent {
    id: string,
    name: string,
    price: number,
    period: number,
    period_unit: PeriodUnitEnum,
    charge_model: ChargeModelEnum,
    free_quantity: 0,
    status: string,
    enabled_in_hosted_pages: boolean,
    enabled_in_portal: boolean,
    updated_at: number,
    resource_version: number,
    object: EntityTypeEnum,
    taxable: boolean,
    currency_code: string
}

export interface WebhookPlanEvent {
    id: string,
    name: string,
    price: number,
    period: number,
    period_unit: PeriodUnitEnum,
    charge_model: ChargeModelEnum,
    free_quantity: 0,
    status: string,
    enabled_in_hosted_pages: boolean,
    enabled_in_portal: boolean,
    updated_at: number,
    resource_version: number,
    object: EntityTypeEnum,
    taxable: boolean,
    currency_code: string
}

export type WebhookRequest<T extends EventType = EventType> = Request<any, any, {
    id: string;
    occurred_at: number;
    source: SourceEnum;
    user?: string;
    webhook_status:
    | 'not_configured'
    | 'scheduled'
    | 'succeeded'
    | 're_scheduled'
    | 'failed'
    | 'skipped'
    | 'not_applicable'
    | 'disabled';
    webhook_failure_reason?: string;
    event_type?: T;
    api_version?: ApiVersionEnum;
    origin_user?: string;
    content: {
        plan: T extends EventType.PLAN_CREATED | EventType.PLAN_DELETED | EventType.PLAN_UPDATED ? WebhookPlanEvent : never
        addon: T extends EventType.ADDON_CREATED | EventType.ADDON_DELETED | EventType.ADDON_UPDATED ? WebhookPlanEvent : never
    }
}>