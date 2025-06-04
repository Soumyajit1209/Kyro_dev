import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Country Not Found</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md">
        Sorry, we couldn&#39;t find the country you&#39;re looking for or it&#39;s not supported yet.
      </p>
      <Button asChild>
        <Link href="/">
          Go to Homepage
        </Link>
      </Button>
    </div>
  );
}