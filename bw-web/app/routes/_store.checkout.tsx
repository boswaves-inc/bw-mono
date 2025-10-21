import type { Route } from "./+types/_store.library.$id";
import { data, Outlet, } from "react-router";
import { ChargebeeProvider } from "~/libs/chargebee/react";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function loader({ }: Route.LoaderArgs) {
    return data({})
}


export default function renderer() {
    return (
        <ChargebeeProvider pubKey="test_ScuCuJ1Km3hzhDpVTcuVjTNrNpv35860IS" site="seaszn-test">
            <Outlet />
        </ChargebeeProvider>
        // <Elements options={{ mode: 'setup', currency: 'usd' }} stripe={stripe}>
        // </Elements>

    );
}