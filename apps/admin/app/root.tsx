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
import { Sidebar, SidebarInset, SidebarProvider } from "./components/sidebar";
import { cn } from "./utils";

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

export async function loader({ request, context }: LoaderFunctionArgs) {
  return data({ theme: context.theme })
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
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <RefineKbarProvider>
      <Refine
        // notificationProvider={useNotificationProvider()}
        routerProvider={routerProvider}
        // dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
        resources={[
          {
            name: "products",
            list: "/blog-posts",
            create: "/blog-posts/create",
            edit: "/blog-posts/edit/:id",
            show: "/blog-posts/show/:id",
            meta: {
              canDelete: true,
            },
          },
          {
            name: "categories",
            list: "/categories",
            create: "/categories/create",
            edit: "/categories/edit/:id",
            show: "/categories/show/:id",
            meta: {
              canDelete: true,
            },
          },
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
          projectId: "BFoPS7-foKdd1-GQ4vpm",
        }}
      >
        <SidebarProvider>
          <Sidebar />
          <SidebarInset>
            {/* <Header /> */}
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
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>






        {/* <Routes>
        <Route
          element={
            <Layout>
            </Layout>
          }
        >
          <Route
            index
            element={<NavigateToResource resource="blog_posts" />}
          />
          <Route path="/blog-posts">
            <Route index element={<BlogPostList />} />
            <Route path="create" element={<BlogPostCreate />} />
            <Route path="edit/:id" element={<BlogPostEdit />} />
            <Route path="show/:id" element={<BlogPostShow />} />
          </Route>
          <Route path="/categories">
            <Route index element={<CategoryList />} />
            <Route path="create" element={<CategoryCreate />} />
            <Route path="edit/:id" element={<CategoryEdit />} />
            <Route path="show/:id" element={<CategoryShow />} />
          </Route>
          <Route path="*" element={<ErrorComponent />} />
        </Route>
      </Routes> */}

        {/* <Toaster /> */}
        <RefineKbar />
        <UnsavedChangesNotifier />
        <DocumentTitleHandler />
      </Refine>
    </RefineKbarProvider>
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
