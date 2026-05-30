import { approveUserAction } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function AdminClientsPage() {
  const users = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
  });

  return (
    <Card>
      <CardHeader title="Khách hàng doanh nghiệp" description="Duyệt tài khoản sau khi gọi xác minh hợp đồng." />
      <CardContent className="grid gap-3">
        {users.map((user) => (
          <div key={user.id} className="grid gap-4 rounded-lg border border-slate-200 p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-slate-950">{user.companyName}</h2>
                <Badge tone={user.isApproved ? "green" : "amber"}>
                  {user.isApproved ? "ĐÃ DUYỆT" : "CHỜ DUYỆT"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {user.email} · {user.phone} · Công nợ {formatCurrency(user.debtBalance.toString())}
              </p>
              {user.deliveryTimeRequest ? (
                <p className="mt-1 text-sm font-medium text-slate-700">
                  Yêu cầu giờ giao: {user.deliveryTimeRequest}
                </p>
              ) : null}
            </div>
            <form action={approveUserAction}>
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="isApproved" value={String(!user.isApproved)} />
              <Button variant={user.isApproved ? "secondary" : "primary"}>
                {user.isApproved ? "Tạm khóa" : "Duyệt tài khoản"}
              </Button>
            </form>
          </div>
        ))}
        {users.length === 0 ? <p className="text-sm text-slate-500">Chưa có khách hàng.</p> : null}
      </CardContent>
    </Card>
  );
}
