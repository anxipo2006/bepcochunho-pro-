"use client";

import { ShoppingCart } from "lucide-react";
import { createOrderAction } from "@/actions/order";
import { SubmitButton } from "@/components/ui/submit-button";
import { inputClass } from "@/components/ui/form";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: string;
};

export function OrderForm({
  deliveryDate,
  items,
}: {
  deliveryDate: string;
  items: MenuItem[];
}) {
  const quantities = useCartStore((state) => state.quantities);
  const notes = useCartStore((state) => state.notes);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const setNote = useCartStore((state) => state.setNote);
  const total = items.reduce((sum, item) => sum + Number(item.price) * (quantities[item.id] ?? 0), 0);

  return (
    <form action={createOrderAction} className="grid gap-4">
      <input type="hidden" name="deliveryDate" value={deliveryDate} />
      {items.map((item) => (
        <div
          key={item.id}
          className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_120px_1fr]"
        >
          <div>
            <div className="font-semibold text-slate-950">{item.name}</div>
            <div className="mt-1 text-sm text-slate-500">
              {item.category} · {formatCurrency(item.price)}
            </div>
          </div>
          <input
            className={inputClass}
            type="number"
            min={0}
            name={`qty:${item.id}`}
            value={quantities[item.id] ?? 0}
            onChange={(event) => setQuantity(item.id, Number(event.target.value))}
          />
          <input
            className={inputClass}
            name={`note:${item.id}`}
            placeholder="Ghi chú: ít cơm, không hành..."
            value={notes[item.id] ?? ""}
            onChange={(event) => setNote(item.id, event.target.value)}
          />
        </div>
      ))}
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Ghi chú toàn đơn
        <textarea
          className={`${inputClass} min-h-24 py-3`}
          name="orderNote"
          placeholder="Ví dụ: giao tại cổng bảo vệ, chia theo phòng ban..."
        />
      </label>
      <div className="sticky bottom-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm text-slate-500">Tổng tạm tính</div>
          <div className="text-2xl font-bold text-coral-dark">{formatCurrency(total)}</div>
        </div>
        <SubmitButton className="h-12 px-6" disabled={total <= 0} pendingLabel="Đang tạo đơn...">
          <ShoppingCart size={18} />
          Tạo đơn hàng
        </SubmitButton>
      </div>
    </form>
  );
}
