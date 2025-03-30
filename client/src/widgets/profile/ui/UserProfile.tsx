'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/entities/user/model/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfileProps {
  user: User;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const router = useRouter();

  const handleCancelSubscription = () => {
    toast.success("구독 취소 요청이 접수되었습니다.");
  };

  const handleEditInterests = () => {
    router.push("/interests");
  };

  return (
    <div>
      {/* 환영 메시지 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">안녕하세요, {user.name}님!</h1>
        <p className="text-muted-foreground">오늘도 지식이 풍부한 하루 되세요.</p>
      </div>

      {/* 탭 메뉴 */}
      <Tabs defaultValue="구독" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="구독">구독 관리</TabsTrigger>
          <TabsTrigger value="관심사">관심사 관리</TabsTrigger>
        </TabsList>

        {/* 구독 관리 탭 */}
        <TabsContent value="구독">
          <Card>
            <CardHeader>
              <CardTitle>구독 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">현재 플랜</h3>
                  <p className="text-2xl font-bold capitalize">{user.subscription?.type}</p>
                  <p className="text-sm text-muted-foreground">상태: {user.subscription?.status === 'active' ? '활성화' : '비활성화'}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">다음 결제일</h3>
                  <p className="text-2xl font-bold">{user.subscription?.nextBillingDate}</p>
                  <p className="text-sm text-muted-foreground">자동 갱신됩니다</p>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">플랜 혜택</h3>
                <ul className="space-y-1 text-sm">
                  <li>• 매일 2권의 책 요약본</li>
                  <li>• 무제한 관심사 설정</li>
                  <li>• 오디오 요약본 지원</li>
                  <li>• 핵심 문장 하이라이팅</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="w-full sm:w-auto" onClick={handleCancelSubscription}>
                구독 취소
              </Button>
              <Link href="/subscription" className="w-full sm:w-auto">
                <Button className="w-full">플랜 변경</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 관심사 관리 탭 */}
        <TabsContent value="관심사">
          <Card>
            <CardHeader>
              <CardTitle>내 관심사</CardTitle>
              <CardDescription>
                관심사에 맞는 책 요약이 매일 제공됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {interest}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleEditInterests}>
                관심사 편집
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 