import { pixelBasedPreset } from "@react-email/components"
import type { Config } from "tailwindcss"

const config: Config = {
    presets: [
        pixelBasedPreset
    ],
    theme: {
        extend: {
            colors: {
                brand: "#1eb8e2ff",
            },
        },
    },
}