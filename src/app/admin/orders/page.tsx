import { updateOrderStatusAction } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { inputClass } from "@/components/ui/form";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusLabel = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  DELIVERED: "Đã giao (Cũ)",
  PAID: "Đã thanh toán",
  DEBT: "Ghi công nợ",
  CANCELLED: "Đã hủy",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    take: 50,
    orderBy: { deliveryDate: "desc" },
    include: {
      user: true,
      orderItems: { include: { menuItem: true } },
    },
  });

  return (
    <Card>
      <CardHeader title="Quản lý đơn hàng" description="Xác nhận, hoàn tất hoặc hủy đơn hàng." />
      <CardContent className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-slate-200 p-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-slate-950">{order.user.companyName}</h2>
                  <Badge tone="slate">{statusLabel[order.status]}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Giao {formatDate(order.deliveryDate)} · {formatCurrency(order.totalAmount.toString())}
                </p>
                {order.note ? <p className="mt-2 text-sm font-medium text-slate-700">Ghi chú đơn: {order.note}</p> : null}
                <div className="mt-3 grid gap-1 text-sm text-slate-600">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between gap-3">
                      <span>
                        {item.menuItem.name}
                        {item.note ? ` · ${item.note}` : ""}
                      </span>
                      <span className="font-semibold">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              <form action={updateOrderStatusAction} className="flex gap-2">
                <input type="hidden" name="orderId" value={order.id} />
                <select className={inputClass} name="status" defaultValue={order.status}>
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="PAID">Đã thanh toán</option>
                  <option value="DEBT">Ghi công nợ</option>
                  {order.status === "DELIVERED" ? <option value="DELIVERED">Đã giao (Cũ)</option> : null}
                  <option value="CANCELLED">Đã hủy</option>
                </select>
                <SubmitButton pendingLabel="Đang lưu...">Lưu</SubmitButton>
              </form>
            </div>
          </div>
        ))}
        {orders.length === 0 ? <p className="text-sm text-slate-500">Chưa có đơn hàng.</p> : null}
      </CardContent>
    </Card>
  );
}
