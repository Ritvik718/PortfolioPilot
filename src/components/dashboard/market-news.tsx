
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { MarketNews } from '@/lib/market-data';
import { Newspaper } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type MarketNewsFeedProps = {
  news: MarketNews[];
};

export function MarketNewsFeed({ news }: MarketNewsFeedProps) {
  if (!news || news.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Newspaper /> Stocks in the News</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">No market news available at the moment.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Newspaper /> Stocks in the News</CardTitle>
            <CardDescription>The latest headlines impacting the market.</CardDescription>
        </CardHeader>
        <CardContent>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                 className="w-full"
            >
                <CarouselContent>
                    {news.map((article) => (
                        <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1 h-full">
                                <Card className="h-full flex flex-col">
                                    <CardHeader>
                                        <div className="aspect-video relative">
                                            <Image
                                                src={article.image}
                                                alt={article.headline}
                                                fill
                                                className="rounded-t-lg object-cover"
                                                unoptimized
                                            />
                                        </div>
                                         <CardTitle className="text-lg leading-tight pt-4">{article.headline}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {article.summary}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between items-center">
                                        <p className="text-xs text-muted-foreground font-semibold">{article.source}</p>
                                         <Link href={article.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                            Read More
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12" />
                <CarouselNext className="mr-12" />
            </Carousel>
        </CardContent>
    </Card>
  );
}
