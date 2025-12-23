import { data, Outlet } from "react-router";
import { GradientBackground } from "~/components/v3/gradient";
import type { Route } from "./+types/auth";

export const loader = async ({ context }: Route.LoaderArgs) => {
    

    return data({})
}

export default () => (
    <main className="overflow-hidden bg-gray-50">
        <GradientBackground />
        <Outlet />
    </main>
)