"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { urlFor } from "@/lib/sanity";
import { SanityImage } from "@/types";

interface BannerCardProps {
  title: string;
  subtitle: string;
  image?: SanityImage;
  imageUrl?: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor?: string;
  direction?: "row" | "row-reverse" | "column";
  className?: string;
  priority?: boolean;
}

export function BannerCard({
  title,
  subtitle,
  image,
  imageUrl,
  ctaText,
  ctaLink,
  backgroundColor = "bg-blue-50 dark:bg-blue-950",
  direction = "row",
  className,
  priority = false,
}: BannerCardProps) {
  // Determine the final image URL based on props
  const finalImageUrl = image 
    ? urlFor(image).width(800).url() 
    : imageUrl;
  
  const isColumn = direction === "column";
  
  return (
    <Card 
      className={cn(
        backgroundColor, 
        "overflow-hidden border-0 shadow-lg",
        className
      )}
    >
      <CardContent className="p-0">
        <div 
          className={cn(
            "flex items-center justify-between",
            isColumn ? "flex-col" : `flex-${direction}`,
            isColumn ? "text-center" : ""
          )}
        >
          <motion.div 
            className={cn(
              "p-8 md:p-10 flex flex-col justify-center",
              isColumn ? "w-full" : "w-full md:w-1/2"
            )}
            initial={{ opacity: 0, x: direction === "row" ? -20 : (direction === "row-reverse" ? 20 : 0), y: isColumn ? -20 : 0 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{subtitle}</p>
            <div className={cn(isColumn ? "mx-auto" : "")}>
              <Button asChild>
                <Link href={ctaLink}>{ctaText}</Link>
              </Button>
            </div>
          </motion.div>

          {finalImageUrl && (
            <motion.div 
              className={cn(
                "relative",
                isColumn ? "w-full h-60" : "hidden md:block w-1/2 h-full"
              )}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src={finalImageUrl}
                alt={title}
                width={600}
                height={400}
                priority={priority}
                className="object-cover h-full w-full"
              />
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}