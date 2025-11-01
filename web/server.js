import compression from "compression";
import express from "express";
import morgan from "morgan";

const BUILD_PATH = "./build/server/index.js";
const DEVELOPMENT = process.env.NODE_ENV === "development";
const PORT = Number.parseInt(process.env.PORT || "3000");

const store = express();

store.use(compression());
store.disable("x-powered-by");

if (DEVELOPMENT) {
    console.log("Starting development server");

    const viteDevServer = await import("vite").then((vite) => vite.createServer({
        server: { middlewareMode: true },
    }));

    store.use(viteDevServer.middlewares);
    store.use(async (req, res, next) => {
        try {
            const source = await viteDevServer.ssrLoadModule("./server/index.ts");

            return await source.default(req, res, next)
        }
        catch (error) {
            if (typeof error === "object" && error instanceof Error) {
                viteDevServer.ssrFixStacktrace(error);
            }

            next(error);
        }
    });
}
else {
    console.log("Starting production server");

    store.use("/assets", express.static("build/client/assets", {
        immutable: true,
        maxAge: "1y"
    }));

    store.use(morgan("tiny"));
    store.use(express.static("build/client", { maxAge: "1h" }));

    store.use(await import(BUILD_PATH).then((mod) => mod.default));
}

store.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});