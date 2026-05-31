import { LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
          <form action={logoutAction} className="mt-6 border-t border-slate-100 pt-6">
            <Button variant="secondary" className="w-full">
              <LogOut size={16} />
              Đăng xuất
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

