import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ClientCancelButton } from "@/components/client-cancel-button";

function isPastCutoffTime(deliveryDate: Date) {
  return false;
}

const statusTone = {
  PENDING: "amber",
  CONFIRMED: "teal",
  DELIVERED: "green",
  CANCELLED: "red",
} as const;

const statusLabel = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

export default async function ClientOrdersPage() {
  const session = await auth();
  const orders = await prisma.order.findMany({
    where: { userId: session?.user.id },
    orderBy: { deliveryDate: "desc" },
    include: { orderItems: { include: { menuItem: true } } },
  });

  return (
    <Card>
      <CardHeader title="Đơn hàng" description="Theo dõi lịch giao và trạng thái xác nhận." />
      <CardContent className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold text-slate-950">Giao {formatDate(order.deliveryDate)}</div>
                <div className="mt-1 text-sm text-slate-500">{formatCurrency(order.totalAmount.toString())}</div>
                {order.note ? <div className="mt-1 text-sm text-slate-600">Ghi chú: {order.note}</div> : null}
                {order.status === "PENDING" && !isPastCutoffTime(order.deliveryDate) ? (
                  <div className="mt-2">
                    <ClientCancelButton orderId={order.id} />
                  </div>
                ) : null}
              </div>
              <Badge tone={statusTone[order.status]}>{statusLabel[order.status]}</Badge>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between gap-3">
                  <span>{item.menuItem.name}</span>
                  <span className="font-semibold">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {orders.length === 0 ? <p className="text-sm text-slate-500">Chưa có đơn hàng.</p> : null}
      </CardContent>
    </Card>
  );
}
