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
import { CartProvider } from "./context/cart";
import { Container } from "./components/v3/container";
import { GradientBackground } from "./components/v3/gradient";
import { Navigation } from "./components/v3/navbar";
import { Editor } from "./components/layout/editor";

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
    <html lang="en" className={twMerge('', '')}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased relative text-foreground">
        {children}
        <ScrollRestoration />
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
    <main className="overflow-hidden min-h-svh">
      <GradientBackground />
      <Container >
        <Navigation />
      </Container>
      <Container className="mt-16">
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
          <pre className="w-full">
            <code className="whitespace-break-spaces">{stack}</code>
          </pre>
        )}
      </Container>
    </main>
  );
}

export default function App({ loaderData: { cart } }: Route.ComponentProps) {
  return (
    <Editor editMode state={{ globals: {}, headerNavigation: {}, footerNavigation: {} }} >
      <CartProvider cart={cart}>
        {/* <Header /> */}
        <Outlet />
        {/* <Footer /> */}
      </CartProvider>
    </Editor>
  );
}

