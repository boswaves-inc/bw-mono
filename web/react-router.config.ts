import type { Config } from "@react-router/dev/config";

const arg = process.argv.find(arg => arg.startsWith('--mode='))
const mode = arg?.split('=')[1] || 'public'

if(!['public' , 'admin'].includes(mode)){
  throw new Error(`Invalid runtime mode: ${mode}`)
}

export default {
  ssr: true,
  appDirectory: `./lib/${mode}`,
  buildDirectory: `./build/${mode}`,
} satisfies Config;