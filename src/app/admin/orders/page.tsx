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

  const dateGroups = orders.reduce((acc, order) => {
    const dateStr = formatDate(order.deliveryDate);
    
    let dateGroup = acc.find((g) => g.dateStr === dateStr);
    if (!dateGroup) {
      dateGroup = { dateStr, customers: [] };
      acc.push(dateGroup);
    }
    
    let customerGroup = dateGroup.customers.find((c) => c.userId === order.userId);
    if (!customerGroup) {
      customerGroup = { userId: order.userId, companyName: order.user.companyName, orders: [] };
      dateGroup.customers.push(customerGroup);
    }
    
    customerGroup.orders.push(order);
    return acc;
  }, [] as { dateStr: string; customers: { userId: string; companyName: string; orders: typeof orders }[] }[]);

  return (
    <Card>
      <CardHeader title="Quản lý đơn hàng" description="Xác nhận, hoàn tất hoặc hủy đơn hàng." />
      <CardContent className="grid gap-6">
        {dateGroups.map((dateGroup) => (
          <div key={dateGroup.dateStr} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
              <h2 className="text-base font-extrabold text-slate-800">📅 Ngày giao: {dateGroup.dateStr}</h2>
            </div>
            
            <div className="p-5 grid gap-6 bg-white">
              {dateGroup.customers.map((customer) => (
                <div key={customer.userId} className="rounded-xl border border-teal-100 bg-teal-50/20 p-4">
                  <h3 className="mb-4 font-bold text-teal-800 text-lg flex items-center gap-2">
                    🏢 {customer.companyName}
                  </h3>
                  <div className="grid gap-3">
                    {customer.orders.map((order) => (
                      <div key={order.id} className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start bg-white rounded-lg border border-slate-200 p-4 shadow-sm transition-all hover:border-teal-300">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <Badge tone="slate">{statusLabel[order.status]}</Badge>
                            <span className="text-sm font-bold text-coral-dark">
                              Tổng: {formatCurrency(order.totalAmount.toString())}
                            </span>
                          </div>
                          {order.note ? <p className="mb-3 text-sm font-medium text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">Ghi chú đơn: {order.note}</p> : null}
                          <div className="grid gap-1.5 text-sm text-slate-700 font-medium">
                            {order.orderItems.map((item) => (
                              <div key={item.id} className="flex justify-between gap-3 border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                                <span>
                                  {item.menuItem.name}
                                  {item.note ? <span className="text-slate-500 font-normal italic"> ({item.note})</span> : ""}
                                </span>
                                <span className="font-bold text-slate-900">x{item.quantity}</span>
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
                          <SubmitButton pendingLabel="Lưu...">Lưu</SubmitButton>
                        </form>
                      </div>
                    ))}
                  </div>
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
