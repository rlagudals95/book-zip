'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookSummary } from "@/entities/book/model/types";

interface SummaryListProps {
  summaries: BookSummary[];
  showViewAllButton?: boolean;
}

export const SummaryList = ({ summaries, showViewAllButton = false }: SummaryListProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaries.map((summary) => (
          <Card key={summary.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src={summary.coverImage}
                alt={summary.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-1">{summary.title}</CardTitle>
              <CardDescription>{summary.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                배송일: {summary.date}
              </p>
              <p className="line-clamp-3 text-sm">{summary.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/summary/${summary.id}`} className="w-full">
                <Button variant="outline" className="w-full">자세히 보기</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {showViewAllButton && (
        <div className="mt-6 text-center">
          <Link href="/library">
            <Button variant="outline">모든 요약본 보기</Button>
          </Link>
        </div>
      )}
    </div>
  );
}; 