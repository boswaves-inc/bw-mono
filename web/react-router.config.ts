import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  appDirectory: 'lib',
  serverBundles: ({branch}) => {

      console.log(branch)
    return 'index'
  },
} satisfies Config;
