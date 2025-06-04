import { redirect } from "next/navigation";
import { getBrowserCountry } from "@/lib/utils";

// Default home page redirects to country-specific page based on browser country
export default function HomePage() {
  // Since this is a Server Component, we'll handle this with redirect
  // Client-side detection will happen in the country component
  return redirect(`/in`);
}