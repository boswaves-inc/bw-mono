import compression from "compression";
import express from "express";
import morgan from "morgan";

const DEVELOPMENT = process.env.NODE_ENV === "development";
const PORT = Number.parseInt(process.env.PORT || "3000");

const init = async () => {
    if (DEVELOPMENT) {
        console.log("Starting development server");

        const vite = await import("vite").then((vite) => vite.createServer({
            server: { middlewareMode: true },
        }));

        const server = async () => {
            const app = express();

            app.use(compression());
            app.disable("x-powered-by");

            app.use(vite.middlewares);
            app.use(async (req, res, next) => {
                try {
                    const source = await vite.ssrLoadModule("./server/index.ts");

                    return await source.default(req, res, next)
                }
                catch (error) {
                    if (typeof error === "object" && error instanceof Error) {
                        vite.ssrFixStacktrace(error);
                    }

                    next(error);
                }
            });

            return app
        }

        return Promise.all([
            server(),
            server()
        ])
    }
    else {
        console.log("Starting production server");

        const server = async (/** @type {string} */ build) => {
            const app = express();

            app.use(compression());
            app.disable("x-powered-by");

            app.use("/assets", express.static("build/client/assets", {
                immutable: true,
                maxAge: "1y"
            }));

            app.use(morgan("tiny"));
            app.use(express.static("build/client", { maxAge: "1h" }));

            app.use(await import(build).then((mod) => mod.default));

            return app
        }

        return Promise.all([
            server('./build/server/index.js'),
            server('./build/server/index.js')
        ])
    }
}

init().then(([store, studio]) => {
    store.listen(PORT, "0.0.0.0", () => {
        console.log(`Store is running on http://localhost:${PORT}`);
    })
    
    studio.listen(3001, "0.0.0.0", () => {
        console.log(`Studio is running on http://localhost:${3001}`);
    })
})