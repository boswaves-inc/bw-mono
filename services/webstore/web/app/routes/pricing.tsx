import { data, Link, Outlet } from "react-router";
import { Container } from "~/components/v3/container";
import { Heading, Lead, Subheading } from "~/components/v3/core/typography";
import { Footer } from "~/components/v3/footer";
import { Gradient, GradientBackground } from "~/components/v3/gradient";
import { Navigation } from "~/components/v3/navbar";
import { LogoCloud } from "~/components/v3/sections/logo-cloud";
import type { Route } from "./+types/pricing";
import dayjs from "dayjs";
import { and, eq, getTableColumns } from "drizzle-orm";
import { Item, ItemPrice, ItemScript, PeriodUnit, Script } from "@boswaves-inc/webstore-core";
import { Button } from "~/components/v3/core/button";
import { Plus } from "lucide-react";


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