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

import { CustomError } from "@/shared/error/Error";
import { Interest } from "@/entities/interest/model/types";
import { requestVerification, subscribe, verifyEmail } from "@/entities/subscription/api/subscription.client";
import { SERVICE_NAME } from "@/shared/const";

// 스키마 정의
const emailSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
});

const verificationSchema = z.object({
  code: z.string().length(6, "인증 코드는 6자리여야 합니다"),
});

const subscriptionFormSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  interests: z.array(z.string()),
});

// 관심사 옵션
const interestsOptions: { id: Interest; label: string }[] = [
  { id: 'self-improvement', label: '자기계발' },
  { id: 'business', label: '마케팅' },
  { id: 'startup', label: '스타트업' },
  { id: 'it', label: 'IT' },
];

// 이메일 입력 단계 컴포넌트
const EmailStep = ({ 
  onSubmit, 
  isSubmitting 
}: { 
  onSubmit: (email: string) => void; 
  isSubmitting: boolean;
}) => {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof emailSchema>) => {
    onSubmit(values.email);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="xl" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "전송 중..." : "인증 코드 받기"}
        </Button>
      </form>
    </Form>
  );
};

// 인증 코드 입력 단계 컴포넌트
const VerificationStep = ({ 
  email,
  onSubmit, 
  isSubmitting,
  onResend,
  isResending,
}: { 
  email: string;
  onSubmit: (code: string) => void;
  isSubmitting: boolean;
  onResend: () => void;
  isResending: boolean;
}) => {
  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof verificationSchema>) => {
    onSubmit(values.code);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="mb-4 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">{email}</span>로 인증 코드를 전송했습니다
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>인증 코드</FormLabel>
              <FormControl>
                <Input
                  placeholder="6자리 코드 입력"
                  {...field}
                  maxLength={6}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3">
          <Button type="submit" size="xl" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "확인 중..." : "인증 확인"}
          </Button>
          
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={onResend}
            disabled={isResending}
            className="w-full"
          >
            {isResending ? "재전송 중..." : "인증 코드 재전송"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

// 관심사 선택 단계 컴포넌트
const InterestsStep = ({ 
  email,
  onSubmit, 
  isSubmitting 
}: { 
  email: string;
  onSubmit: (interests: string[]) => void; 
  isSubmitting: boolean;
}) => {
  const form = useForm<z.infer<typeof subscriptionFormSchema>>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      email: email,
      interests: [],
    },
  });

  const handleSubmit = (values: z.infer<typeof subscriptionFormSchema>) => {
    onSubmit(values.interests);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="mb-4 text-center">
          <p className="text-sm text-muted-foreground">
            이메일 인증이 완료되었습니다! 관심 분야를 선택해주세요.
          </p>
        </div>
        
        <div className="space-y-3 gap-2 flex flex-col">
          <FormLabel>관심사 (선택하지 않으면 모든 책을 받아보실 수 있습니다.)</FormLabel>
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
        </div>

        <Button type="submit" size="xl" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "처리 중..." : "구독하기"}
        </Button>
      </form>
    </Form>
  );
};

// 구독 워크플로우 관리 컴포넌트
const SubscriptionFlow = ({ onSuccess }: { onSuccess: () => void }) => {
  const [step, setStep] = useState<'email' | 'verification' | 'interests'>('email');
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // 1단계: 이메일 제출 및 인증 코드 요청
  const handleEmailSubmit = async (emailValue: string) => {
    setIsLoading(true);
    try {
  
      await requestVerification(emailValue);
      setEmail(emailValue);
      setStep('verification');
      toast.success("인증 코드가 이메일로 전송되었습니다.");
    } catch (error) {
      toast.error(
        error instanceof CustomError ? error.message : "인증 코드 전송에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 코드 재전송
  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await requestVerification(email);
      toast.success("인증 코드가 다시 전송되었습니다.");
    } catch (error) {
      toast.error(error instanceof CustomError ? error.message : "인증 코드 재전송에 실패했습니다.");
    } finally {
      setIsResending(false);
    }
  };

  // 2단계: 인증 코드 확인
  const handleVerificationSubmit = async (code: string) => {
    setIsLoading(true);
    try {
      await verifyEmail(email, code);
      setStep('interests');
      toast.success("이메일 인증이 완료되었습니다.");
    } catch (error) {
      toast.error(error instanceof CustomError ? error.message : "인증 코드가 유효하지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3단계: 관심사 선택 및 구독 완료
  const handleInterestsSubmit = async (interests: string[]) => {
    setIsLoading(true);
    try {
      await subscribe({ email, interests });
      toast.success("구독이 완료되었습니다!");
      onSuccess();
    } catch (error) {

      toast.error(error instanceof CustomError ? error.message : "구독 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 단계에 맞는 컴포넌트 렌더링
  if (step === 'email') {
    return <EmailStep onSubmit={handleEmailSubmit} isSubmitting={isLoading} />;
  } else if (step === 'verification') {
    return (
      <VerificationStep 
        email={email} 
        onSubmit={handleVerificationSubmit} 
        isSubmitting={isLoading}
        onResend={handleResendCode}
        isResending={isResending}
      />
    );
  } else {
    return (
      <InterestsStep 
        email={email} 
        onSubmit={handleInterestsSubmit} 
        isSubmitting={isLoading} 
      />
    );
  }
};

// 구독 버튼 컴포넌트
export const SubscriptionButton = () => {
  const { openModal, closeModal } = useModal();
  
  const handleOpenSubscriptionModal = () => {
    openModal(
      <SubscriptionFlow onSuccess={closeModal} />,
      {
        title: `${SERVICE_NAME} 구독하기`,
        description: "책 요약본을 이메일로 받아보세요",
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