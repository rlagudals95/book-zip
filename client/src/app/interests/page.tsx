'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

// 관심사 목록
const INTERESTS = [
  { id: "development", label: "개발/프로그래밍" },
  { id: "business", label: "경영/비즈니스" },
  { id: "marketing", label: "마케팅/세일즈" },
  { id: "self-improvement", label: "자기계발" },
  { id: "investment", label: "투자/재테크" },
  { id: "science", label: "과학/기술" },
  { id: "history", label: "역사/문화" },
  { id: "philosophy", label: "철학/심리학" },
  { id: "art", label: "예술/디자인" },
  { id: "health", label: "건강/웰빙" },
  { id: "fiction", label: "소설/문학" },
  { id: "biography", label: "인물/자서전" },
];

const interestSchema = z.object({
  interests: z.array(z.string()).min(1, {
    message: "최소 1개 이상의 관심사를 선택해주세요."
  }),
});

type InterestFormValues = z.infer<typeof interestSchema>;

export default function InterestsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<InterestFormValues>({
    resolver: zodResolver(interestSchema),
    defaultValues: {
      interests: [],
    },
  });

  const onSubmit = async (values: InterestFormValues) => {
    setIsLoading(true);
    try {
      // 여기에 실제 관심사 저장 API 요청 코드가 들어갑니다
      console.log(values);
      
      // 임시로 성공 처리
      setTimeout(() => {
        toast.success("관심사가 저장되었습니다!");
        router.push("/subscription");
      }, 1500);
    } catch (error) {
      toast.error("관심사 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">관심사 선택</CardTitle>
          <CardDescription className="text-center">
            관심 있는 분야를 선택하시면 맞춤형 책 요약을 추천해드립니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {INTERESTS.map((interest) => (
                        <FormField
                          key={interest.id}
                          control={form.control}
                          name="interests"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={interest.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md hover:bg-muted/50"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(interest.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, interest.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== interest.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {interest.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "저장 중..." : "선택 완료"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            관심사는 나중에 언제든지 변경할 수 있습니다.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 