import express from "express"
import plans from "./plans";
import addon from "./addon";
import type { Postgres } from "@boswaves/core/postgres";

export default ({ postgres }: { postgres: Postgres }) => {
    const router = express.Router()

    router.use(express.json());
    // router.use(express.urlencoded({ extended: true }))

    // Middleware routing
    router.use(plans({ postgres }))
    router.use(addon({ postgres }))

    // Webhook
    // router.post('/', async <T extends EventType>(req: WebhookRequest<T>, res: Response, next: NextFunction) => {
    //     const { event_type, content } = req.body

    //     console.log('second')


    //     // if (event_type != undefined) {
    //     //     switch (event_type) {
    //     //         case WebhookEventType.PLAN_CREATED: await plans.onCreated(content, res); break;
    //     //         case WebhookEventType.PLAN_UPDATED: await plans.onUpdated(content, res); break;
    //     //         case WebhookEventType.PLAN_DELETED: await plans.onDeleted(content, res); break;
    //     //     }
    //     // }

    //     return res.json({ success: true }).status(200)
    // })

    return router;
}