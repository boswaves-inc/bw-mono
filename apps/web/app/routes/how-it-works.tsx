import HeroCentered from "~/sections/hero/centered";
import NewsletterPanel from "~/sections/newsletter/card";
import ContentTiles from "~/sections/content/tiles";
import FaqAccordion from "~/sections/faq/accordion";
import type { Route } from "./+types/how-it-works";
import Page from "~/components/page";


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function renderer() {
    return (
        <Page>
            <HeroCentered />
            {/* <FeatureScreenshot/> */}
            <ContentTiles />
            <NewsletterPanel />
            <FaqAccordion />
        </Page>
    );
}
