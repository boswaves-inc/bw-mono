import ProductList from "~/components/sections/product/list";
import type { Route } from "./+types/_store.library.$id";
import ProductOverview from "~/components/sections/product/overview";
import Section from "~/components/core/section";
import Paragraph from "~/components/core/paragraph";
import Heading from "~/components/core/heading";
import { Check, ChevronLeft, ChevronRight, Flame, LinkIcon, Share, Star } from "lucide-react";
import ContentPanel from "~/components/sections/content/panel";
import FaqAccordion from "~/components/sections/faq/accordion";
import { data, Form, Link, useFetcher } from "react-router";
import ContentTiles from "~/components/sections/content/tiles";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "~/components/core/tab";
import Button from "~/components/core/button";
import Panel from "~/components/core/panel";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function loader({ }: Route.LoaderArgs) {
    
    return data({})
}

export async function action({ request }: Route.ActionArgs) {
    

    return data({})
}

export default function renderer() {
    const cart = useFetcher({ key: 'cart' })

    return (
        <div>
            <Section>
                    <Form action="./" method="post">
                        <Button>test</Button>
                    </Form>
            </Section>
        </div>
    );
}