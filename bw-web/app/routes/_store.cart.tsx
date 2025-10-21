import type { Route } from "./+types/_store.library.$id";
import Section from "~/components/core/section";
import { data, Form, Link, useFetcher } from "react-router";
import Button from "~/components/core/button";

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