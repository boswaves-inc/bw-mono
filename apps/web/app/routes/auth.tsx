import { Outlet } from "react-router";
import { GradientBackground } from "~/components/v3/gradient";

export default () => (
    <main className="overflow-hidden bg-gray-50">
        <GradientBackground />
        <Outlet />
    </main>
)