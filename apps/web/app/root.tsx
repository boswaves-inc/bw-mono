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
import countryToCurrency, { type Currencies, type Countries } from "country-to-currency";
import { ISO3166 } from "./components/iso";
import Page from "./components/page";

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
    rel: "stylesheet",
    href: "https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap",
  },
  {
    rel: "preload",
    href: "https://js.chargebee.com/v2/chargebee.js",
    as: "script",
  },
];

export async function loader({ request, context: { theme, cart, geo } }: Route.LoaderArgs) {
  return data({ theme, currency: geo.currency, cart })
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={twMerge('', '')} style={{ "--scroll-y": 0 } as CSSProperties}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased relative text-foreground">
        {children}
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
    <Page>
      <main className="container mx-auto overflow-hidden antialiased relative  ">
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
          <pre className="w-full">
            <code className="whitespace-break-spaces">{stack}</code>
          </pre>
        )}
      </main>
    </Page>
  );
}

export default function App({ loaderData: { cart } }: Route.ComponentProps) {
  return (
    <CartProvider cart={cart}>
      {/* <Header /> */}
      <Outlet />
      {/* <Footer /> */}
    </CartProvider>
  );
}

