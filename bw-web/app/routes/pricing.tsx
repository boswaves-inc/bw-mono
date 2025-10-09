import FaqAccordion from "~/components/sections/faq/accordion";
import type { Route } from "./+types/pricing";
import ProductList from "~/components/sections/product/list";
import ProductOverview from "~/components/sections/product/overview";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import FeatureScreenshot from "~/components/sections/feature/screenshot";
import HeroCentered from "~/components/sections/hero/centered";
import NewsletterPanel from "~/components/sections/newsletter/card";
import ContentTiles from "~/components/sections/content/tiles";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function renderer() {
    return (
        <div>
            <HeroCentered/>
            {/* <FeatureScreenshot/> */}
            <ContentTiles/>
            <NewsletterPanel/>
            <FaqAccordion />
        
        </div>
    );
}
