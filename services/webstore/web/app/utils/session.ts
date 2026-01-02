import type { SessionData, SessionStorage } from "react-router";

export const getSession = <Data = SessionData, FlashData = Data>(req: Request, storage: SessionStorage<Data, FlashData>) => {
    return storage.getSession(req.headers.get('Cookie'))
}