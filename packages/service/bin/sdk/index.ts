#!/usr/bin/env tsx

import { ViteNodeRunner } from 'vite-node/client'
import { ViteNodeServer } from 'vite-node/server'
import { installSourcemapsSupport } from 'vite-node/source-map'
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
import { createServer } from "vite"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const run = async () => {
    const server = await createServer({
        logLevel: 'error',
        server: {
            hmr: false,
            preTransformRequests: false
        },
        optimizeDeps: {
            exclude: ['@boswaves-inc/*']
        }
    })

    await server.pluginContainer.buildStart()
    const node = new ViteNodeServer(server)

    installSourcemapsSupport({
        getSourceMap: (source) => node.getSourceMap(source),
    })

    const client = new ViteNodeRunner({
        root: server.config.root,
        fetchModule(id) {
            return node.fetchModule(id)
        },
        resolveId(id, importer) {
            return node.resolveId(id, importer)
        },
    })

    await client.executeFile(resolve(__dirname, './codegen.ts'))
    await server.close()
}

run()