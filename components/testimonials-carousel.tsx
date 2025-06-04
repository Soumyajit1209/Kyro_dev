"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Testimonial } from "@/types";
import { urlFor } from "@/lib/sanity";

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export function TestimonialsCarousel({
  testimonials,
  autoPlay = true,
  interval = 5000,
  className,
}: TestimonialsCarouselProps) {
  const [current, setCurrent] = useState(0);
  const length = testimonials.length;

  const nextSlide = useCallback(() => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  }, [current, length]);

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoPlay, interval, nextSlide]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex justify-center">
        <Card className="w-full max-w-3xl relative overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonials[current].rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                
                <blockquote className="text-lg md:text-xl mb-6 italic">
                  "{testimonials[current].quote}"
                </blockquote>
                
                <Avatar className="h-16 w-16 mb-4">
                  {testimonials[current].image && (
                    <AvatarImage 
                      src={urlFor(testimonials[current].image).width(200).url()} 
                      alt={testimonials[current].name} 
                    />
                  )}
                  <AvatarFallback>
                    {testimonials[current].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="font-semibold">{testimonials[current].name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonials[current].location}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-center mt-4 space-x-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={prevSlide}
          className="rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>
        
        <div className="flex items-center space-x-1">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all ${
                current === index 
                  ? "w-6 bg-blue-600" 
                  : "w-2 bg-gray-300 dark:bg-gray-700"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={nextSlide}
          className="rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  );
}