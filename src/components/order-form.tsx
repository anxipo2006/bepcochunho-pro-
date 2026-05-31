"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
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
  const totalItems = items.reduce((sum, item) => sum + (quantities[item.id] ?? 0), 0);

  return (
    <form action={createOrderAction} className="grid gap-4">
      <input type="hidden" name="deliveryDate" value={deliveryDate} />
      {(() => {
        const categories = [
          { key: "MAN", label: "Món mặn", items: items.filter((item) => item.category === "MAN") },
          { key: "CHAY", label: "Món chay", items: items.filter((item) => item.category === "CHAY") },
          { key: "NUOC", label: "Món nước", items: items.filter((item) => item.category === "NUOC") },
          { key: "THEM", label: "Món thêm", items: items.filter((item) => item.category === "THEM") },
        ].filter((group) => group.items.length > 0);

        return categories.map((category) => (
          <div key={category.key} className="mb-4 last:mb-0">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">{category.label}</h3>
            <div className="grid gap-4">
              {category.items.map((item) => {
                const qty = quantities[item.id] ?? 0;
                const itemTotal = qty * Number(item.price);
                return (
                  <div
                    key={item.id}
                    className={`group rounded-2xl border bg-white p-4 transition-all duration-200 ${
                      qty > 0
                        ? "border-coral/30 bg-coral-soft/30 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    {/* Hidden input for form submission */}
                    <input type="hidden" name={`qty:${item.id}`} value={qty} />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      {/* Item info */}
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-950">{item.name}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-semibold text-coral-dark">
                            {formatCurrency(item.price)}/phần
                          </span>
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, Math.max(0, qty - 1))}
                          className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-150 hover:border-coral/40 hover:bg-coral-soft hover:text-coral-dark active:scale-95 disabled:opacity-40"
                          disabled={qty <= 0}
                        >
                          <Minus size={16} />
                        </button>
                        <span className={`w-8 text-center text-lg font-extrabold ${qty > 0 ? "text-coral-dark" : "text-slate-300"}`}>
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, qty + 1)}
                          className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-150 hover:border-coral/40 hover:bg-coral-soft hover:text-coral-dark active:scale-95"
                        >
                          <Plus size={16} />
                        </button>
                        {qty > 0 && (
                          <span className="ml-1 min-w-[64px] text-right text-sm font-bold text-teal-700">
                            {formatCurrency(itemTotal)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Note field - only show when qty > 0 */}
                    {qty > 0 && (
                      <div className="mt-3 border-t border-coral/10 pt-3">
                        <input
                          className={`${inputClass} text-xs`}
                          name={`note:${item.id}`}
                          placeholder="Ghi chú: ít cơm, không hành..."
                          value={notes[item.id] ?? ""}
                          onChange={(event) => setNote(item.id, event.target.value)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ));
      })()}

      {/* Order note */}
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Ghi chú toàn đơn
        <textarea
          className={`${inputClass} min-h-24 py-3`}
          name="orderNote"
          placeholder="Ví dụ: giao tại cổng bảo vệ, chia theo phòng ban..."
        />
      </label>

      {/* Sticky footer */}
      <div className="sticky bottom-4 overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 p-4 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tổng tạm tính</div>
            <div className={`mt-1 text-3xl font-extrabold transition-colors ${total > 0 ? "text-coral-dark" : "text-slate-300"}`}>
              {formatCurrency(total)}
            </div>
            {totalItems > 0 && (
              <div className="mt-0.5 text-xs text-slate-500">{totalItems} phần</div>
            )}
          </div>
          <SubmitButton
            className="h-12 rounded-xl px-8 text-base font-bold"
            disabled={total <= 0}
            pendingLabel="Đang tạo đơn..."
          >
            <ShoppingCart size={18} />
            Tạo đơn hàng
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
