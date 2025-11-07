import Section from "~/components/section";
import { data, Form, Link, useFetcher } from "react-router";
import Button from "~/components/core/button";
import type { Route } from "./+types/cart";
import { formData } from "zod-form-data";
import { object, z } from "zod/v4";

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
    const schema = formData(object({
        id: z.uuidv4(),
        type: z.string().refine(x => x == 'coupon' || x == 'item', { error: 'invalid type' }),
    }))

    switch (request.method) {
        case 'PUT': {
            const form = await request.formData()
            const result = await schema.parseAsync(form)

            console.log(result, request.method)

            return data({ items: [], coupons: [] })
        };
        case 'DELETE': {
            const form = await request.formData()
            const result = schema.parseAsync(form)

            console.log(result, request.method)

            return data({ items: [], coupons: [] })
        };
    }
}

export default function renderer() {
    const cart = useFetcher({ key: 'cart' })

    return (
        <div>
            <Section>
                <Link to={'/checkout'}>
                    <Button>Checkout</Button>
                </Link>
            </Section>
        </div>
    );
}