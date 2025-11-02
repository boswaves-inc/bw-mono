import { route, type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";
import { existsSync } from "node:fs";
import path from "node:path";

const router = async ({ directory }: { directory: `./${string}` }): Promise<RouteConfig> => {
    const content = await flatRoutes({ rootDirectory: `${directory}/routes`, });

    if (existsSync(path.resolve(`${directory}/root.tsx`))) {
        return [route('/', `${directory}/root.tsx`, content)]
    }

    throw new Error(`bundle '${directory}/root.tsx' does not exist `)
}

const store = await router({ directory: './store' })

export default store satisfies RouteConfig