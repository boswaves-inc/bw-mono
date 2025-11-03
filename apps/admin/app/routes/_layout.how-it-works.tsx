import FaqAccordion from "~/sections/faq/accordion";
import ProductList from "~/sections/product/list";
import ProductOverview from "~/sections/product/overview";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import FeatureScreenshot from "~/sections/feature/screenshot";
import HeroCentered from "~/sections/hero/centered";
import NewsletterPanel from "~/sections/newsletter/card";
import ContentTiles from "~/sections/content/tiles";


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function renderer() {
    return (
        <div>
            <HeroCentered />
            {/* <FeatureScreenshot/> */}
            <ContentTiles />
            <NewsletterPanel />
            <FaqAccordion />

        </div>
    );
}
