import type { LoaderFunctionArgs, MetaArgs } from "react-router";

export function meta({ }: MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ }: LoaderFunctionArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function renderer() {
  return (
    <div className="">
      Welcom
    </div>
  );
}
