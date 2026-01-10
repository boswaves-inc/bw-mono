import { Outlet } from "react-router";
import { Container } from "~/components/v3/container";
import { Footer } from "~/components/layout/footer";
import { GradientBackground } from "~/components/v3/gradient";
import { Navigation } from "~/components/v3/navbar";
import type { Route } from "./+types/pricing";


export default ({ loaderData }: Route.ComponentProps) => (
    <main className="overflow-hidden">
        <GradientBackground />
        <Container>
            <Navigation />
        </Container>

        <Outlet />

        <Footer />
    </main>
)