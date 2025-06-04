import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/lib/sanity";
import { BlogPost } from "@/types";

interface BlogPreviewCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogPreviewCard({ post, className }: BlogPreviewCardProps) {
  const formattedDate = formatDistanceToNow(new Date(post.publishedAt), { 
    addSuffix: true 
  });

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative h-48 w-full">
        {post.mainImage && (
          <Image
            src={urlFor(post.mainImage).width(600).height(400).url()}
            alt={post.title}
            fill
            className="object-cover"
          />
        )}
      </div>
      
      <CardContent className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.categories?.map((category, index) => (
            <Badge key={index} variant="secondary">
              {category.title}
            </Badge>
          ))}
        </div>
        
        <Link href={`/blog/${post.slug.current}`} className="group">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 pb-5 px-5 text-sm text-gray-500">
        {formattedDate}
      </CardFooter>
    </Card>
  );
}