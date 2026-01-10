import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SearchClient query={searchParams.q} />
    </Suspense>
  );
}
