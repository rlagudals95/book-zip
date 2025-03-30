"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/shared/hooks/use-modal";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// 구독 폼 스키마 정의
const subscriptionFormSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  interests: z.array(z.string()),
});

const interestsOptions = [
  { id: "self-improvement", label: "자기계발" },
  { id: "business", label: "마케팅" },
  { id: "startup", label: "스타트업" },
  { id: "it", label: "IT" },
];

// 구독 폼 컴포넌트
const SubscriptionForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof subscriptionFormSchema>>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      email: "",
      interests: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof subscriptionFormSchema>) => {
    setIsSubmitting(true);
    try {
      // 여기에 API 호출 로직 추가
      console.log("구독 정보:", values);
      
      // 임시 지연 (실제로는 API 호출로 대체)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("구독이 완료되었습니다!");
      onSuccess();
    } catch (error) {
      toast.error("구독 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("구독 에러:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  placeholder="your-email@example.com"
                  {...field}
                  type="email"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <FormLabel>관심사 (하나 이상 선택)</FormLabel>
          <div className="grid grid-cols-2 gap-2">
            {interestsOptions.map((option) => (
              <FormField
                key={option.id}
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem
                    key={option.id}
                    className="flex flex-row items-start space-x-2 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, option.id])
                            : field.onChange(
                                field.value.filter(
                                  (value) => value !== option.id
                                )
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          {form.formState.errors.interests && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.interests.message}
            </p>
          )}
        </div>

        <Button type="submit" size="xl" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "처리 중..." : "구독하기"}
        </Button>
      </form>
    </Form>
  );
};

export const SubscriptionButton = () => {
  const { openModal, closeModal } = useModal();
  
  const handleOpenSubscriptionModal = () => {
    openModal(
      <SubscriptionForm onSuccess={closeModal} />,
      {
        title: "매일 Book Zip 구독하기",
        description: "관심 분야를 선택하고 매일 책 요약본을 이메일로 받아보세요",
      }
    );
  };
  
  return (
    <Button 
      size="xxl"  
      onClick={handleOpenSubscriptionModal}
    >
      구독하기
    </Button>
  );
};