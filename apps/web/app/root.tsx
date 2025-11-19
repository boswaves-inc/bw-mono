import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "react-router";
import "./root.css";
import { twMerge } from "tailwind-merge";
import type { Route } from "./+types/root";
import Footer from "./components/footer";
import Header from "./components/header";
import { CartProvider } from "./context/cart";
import { ScrollProvider } from "./context/scroll";
import type { CSSProperties } from "react";
import { getSession } from "./utils/session";
import { cartSession } from "./cookie";
// import { CartData } from "@bw/core/schema/cart.ts";
import { count, countDistinct, eq, sql } from "drizzle-orm";
import { Cart, CartData, CartItem } from "@bw/core";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "preload",
    href: "https://js.chargebee.com/v2/chargebee.js",
    as: "script",
  },
];

export async function loader({ request, context }: Route.LoaderArgs) {
  const session =  await getSession(request, cartSession);

  const cart = await new Promise<CartData | undefined>(async resolve => {
    if (context.cart) {
      const result = await context.postgres.select().from(CartData).where(
        eq(CartData.id, context.cart)
      ).limit(1).then(x => x.at(0));

      if(result == undefined){
        session.unset('id')
      }

      return resolve(result)
    }

    return resolve(undefined)
  })

  return data({ theme: context.theme, cart }, {
    headers: [
      ["Set-Cookie", await cartSession.commitSession(session)]
    ]
  })
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>()

  return (
    <html lang="en" className={twMerge('dark', '')} style={{ "--scroll-y": 0 } as CSSProperties}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased relative  dark:bg-gray-900 dark:text-white text-gray-900 bg-white">
        <CartProvider cart={data?.cart}>
          <Header />
          {children}
          <Footer />
        </CartProvider>
        <ScrollProvider />
        <Scripts />
        <script src="https://js.chargebee.com/v2/chargebee.js" defer />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto overflow-hidden antialiased relative  ">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4">
          <code className="whitespace-break-spaces">{stack}</code>
        </pre>
      )}
    </main>
  );
}

export default function App() {
  return (
    <Outlet />
  );
}

