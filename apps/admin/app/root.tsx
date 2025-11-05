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
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { Refine } from "@refinedev/core";
import routerProvider, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { SidebarInset, SidebarProvider } from "./components/core/sidebar";
import { cn } from "./utils";
import { Header } from "./components/header";
import { ThemeProvider } from "./components/theme/provider";
import { Sidebar } from "./components/sidebar";
import dataProvider from "@refinedev/simple-rest";
import { Box, FileText, Users } from "lucide-react";

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
];

export function loader({ request, context }: Route.LoaderArgs) {
  const { origin } = new URL(request.url)

  return data({ origin, theme: context.theme })
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>()

  return (
    <html lang="en" className={twMerge(data?.theme, '')}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body className="antialiased">
        <RefineKbarProvider>
          <ThemeProvider theme={data?.theme}>
            <Refine
              // notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              dataProvider={dataProvider('http://localhost:3000/api')}
              resources={[
                {
                  name: 'CMS',
                  meta: {
                    icon: <FileText />,
                    label: "CMS"
                  }
                },
                {
                  name: "images",
                  list: "/images",
                  show: "/images/:id",
                  edit: "/images/:id/edit",
                  create: "/images/create",
                  meta: {
                    parent: 'CMS',
                    canDelete: true,
                  },
                },
                {
                  name: 'CRM',
                  meta: {

                    icon: <Users />,
                    label: "CRM"
                  }
                },
                {
                  name: "users",
                  list: "/users",
                  show: "/users/:id",
                  edit: "/users/:id/edit",
                  create: "/users/create",
                  meta: {
                    parent: 'CRM',
                    canDelete: true,
                  },
                },
                {
                  name: 'PIM',
                  meta: {

                    icon: <Box />,
                    label: "PIM"
                  }
                },
                {
                  name: "scripts",
                  list: "/scripts",
                  show: "/scripts/:id",
                  edit: "/scripts/:id/edit",
                  create: "/scripts/create",
                  meta: {
                    parent: 'PIM',
                    canDelete: true,
                  },
                },
              ]}
              options={{
                title: {
                  text: "BOSWaves Admin"
                },
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "BFoPS7-foKdd1-GQ4vpm",
              }}
            >
              <SidebarProvider>
                <Sidebar />
                <SidebarInset>
                  <Header />
                  <main
                    className={cn(
                      "@container/main",
                      "container",
                      "mx-auto",
                      "relative",
                      "w-full",
                      "flex",
                      "flex-col",
                      "flex-1",
                      "px-2",
                      "pt-4",
                      "md:p-4",
                      "lg:px-6",
                      "lg:pt-6"
                    )}
                  >
                    {children}
                  </main>
                </SidebarInset>
              </SidebarProvider>
              {/* <Toaster /> */}
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </ThemeProvider>
        </RefineKbarProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Outlet />
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
