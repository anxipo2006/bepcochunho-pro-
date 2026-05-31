import { closeInvoicesAction, markInvoicePaidAction } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { inputClass } from "@/components/ui/form";
import { prisma } from "@/lib/prisma";
import { billingMonthFromDate, formatCurrency } from "@/lib/utils";

export default async function AdminBillingPage({ searchParams }: { searchParams: { closed?: string } }) {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader title="Chốt công nợ" description="Gom các đơn đã xác nhận hoặc đã giao nhưng chưa có invoice theo tháng." />
        <CardContent>
          {searchParams.closed ? (
            <div className="mb-4 rounded-md bg-teal-50 px-3 py-2 text-sm text-teal-700">
              Đã chốt công nợ tháng {searchParams.closed}.
            </div>
          ) : null}
          <form action={closeInvoicesAction} className="flex flex-col gap-3 sm:flex-row">
            <input className={inputClass} name="billingMonth" defaultValue={billingMonthFromDate()} placeholder="06-2026" />
            <SubmitButton pendingLabel="Đang chốt...">Chốt công nợ</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Invoice doanh nghiệp" description="Xác nhận đã thanh toán sau khi nhận chuyển khoản." />
        <CardContent className="grid gap-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="grid gap-4 rounded-lg border border-slate-200 p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <div>
                <div className="font-semibold text-slate-950">{invoice.user.companyName}</div>
                <p className="mt-1 text-sm text-slate-500">
                  Tháng {invoice.billingMonth} · {formatCurrency(invoice.totalAmount.toString())}
                </p>
              </div>
              <Badge tone={invoice.status === "PAID" ? "green" : "amber"}>
                {invoice.status === "PAID" ? "ĐÃ THANH TOÁN" : "CHƯA THANH TOÁN"}
              </Badge>
              {invoice.status === "UNPAID" ? (
                <form action={markInvoicePaidAction}>
                  <input type="hidden" name="invoiceId" value={invoice.id} />
                  <SubmitButton pendingLabel="Đang xác nhận...">Xác nhận đã thanh toán</SubmitButton>
                </form>
              ) : null}
            </div>
          ))}
          {invoices.length === 0 ? <p className="text-sm text-slate-500">Chưa có invoice.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
