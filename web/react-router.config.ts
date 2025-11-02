import type { Config } from "@react-router/dev/config";

const arg = process.argv.find(arg => arg.startsWith('--mode='))
const mode = arg?.split('=')[1] || 'store'

if(!['store' , 'admin'].includes(mode)){
  throw new Error(`Invalid runtime mode: ${mode}`)
}

export default {
  ssr: true,
  appDirectory: `./lib/store`,
  // buildDirectory: `lib/${mode}`
} satisfies Config;