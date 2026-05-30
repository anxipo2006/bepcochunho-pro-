import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ClientBillingPage() {
  const session = await auth();
  const [user, invoices] = await Promise.all([
    prisma.user.findUnique({ where: { id: session?.user.id } }),
    prisma.invoice.findMany({
      where: { userId: session?.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader title="Số dư công nợ" description="Thanh toán chuyển khoản rồi chờ Bếp xác nhận đã thanh toán." />
        <CardContent>
          <div className="text-3xl font-bold text-coral-dark">
            {formatCurrency(user?.debtBalance.toString() ?? 0)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Invoice" description="Các kỳ công nợ đã chốt." />
        <CardContent className="grid gap-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold text-slate-950">Tháng {invoice.billingMonth}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {formatCurrency(invoice.totalAmount.toString())}
                  {invoice.paidAt ? ` · Thanh toán ${formatDate(invoice.paidAt)}` : ""}
                </div>
              </div>
              <Badge tone={invoice.status === "PAID" ? "green" : "amber"}>
                {invoice.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
              </Badge>
            </div>
          ))}
          {invoices.length === 0 ? <p className="text-sm text-slate-500">Chưa có invoice.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
