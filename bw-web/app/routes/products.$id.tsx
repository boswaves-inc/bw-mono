import ProductList from "~/components/sections/product/list";
import type { Route } from "./+types/products.$id";
import ProductOverview from "~/components/sections/product/overview";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function renderer() {
  return (
    <div>
      <ProductOverview/>
      <ProductList heading="Others also bought"/>
    </div>
  );
}
