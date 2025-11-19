import type { NextFunction, Response } from 'express';
import express from 'express'
import { EventType, type WebhookPlanEvent, type WebhookRequest } from './types';
import type { Postgres } from '@bw/core/postgres';

export default ({ postgres }: { postgres: Postgres }) => {
    const router = express.Router()

    const onDeleted = async (body: WebhookPlanEvent, res: Response) => {
        console.log('on deleted')
        
        return res.sendStatus(200)
    }

    const onUpdated = async (body: WebhookPlanEvent, res: Response) => {
        console.log('on updated')

        return res.sendStatus(200)
    }

    const onCreated = async (req: WebhookPlanEvent, res: Response) => {
        console.log('on created')

        return res.sendStatus(200)
    }

    router.post('/', async (req: WebhookRequest, res: Response, next: NextFunction) => {
        const { event_type, content } = req.body;

        switch (event_type) {
            case EventType.ADDON_CREATED: return await onCreated(content.plan, res);
            case EventType.ADDON_UPDATED: return await onUpdated(content.plan, res);
            case EventType.ADDON_DELETED: return await onDeleted(content.plan, res);
            default: return next()
        }
    })

    return router;
}