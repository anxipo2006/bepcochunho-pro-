import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PendingApprovalPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-offwhite px-4">
      <Card className="max-w-lg">
        <CardHeader
          title="Tài khoản đang chờ duyệt"
          description="Bếp cần xác minh hợp đồng trước khi mở quyền đặt món, xem công nợ và quản lý đơn hàng."
        />
        <CardContent>
          <p className="text-sm leading-6 text-slate-600">
            Vui lòng liên hệ hotline/Zalo 0337 998 639 nếu cần duyệt gấp.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
