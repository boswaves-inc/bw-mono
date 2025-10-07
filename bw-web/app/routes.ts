import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes() satisfies RouteConfig

// export default [
//     index("routes/home.tsx"),
//     layout("")
// ] satisfies RouteConfig;
