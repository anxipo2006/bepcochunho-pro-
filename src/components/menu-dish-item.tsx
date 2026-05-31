"use client";

import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

type MenuDishItemProps = {
  dishName: string;
  itemId?: string;
  style?: {
    text: string;
    dot: string;
  };
};

export function MenuDishItem({ dishName, itemId, style }: MenuDishItemProps) {
  const setQuantity = useCartStore((state) => state.setQuantity);
  const quantities = useCartStore((state) => state.quantities);

  const handleClick = () => {
    if (itemId) {
      const currentQty = quantities[itemId] ?? 0;
      setQuantity(itemId, currentQty + 1);
    }
  };

  if (!itemId) {
    return (
      <div className={cn("flex items-start gap-1.5 text-sm font-semibold leading-5", style?.text ?? "text-slate-700")}>
        <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", style?.dot ?? "bg-slate-400")} />
        {dishName}
      </div>
    );
  }

  const qty = quantities[itemId] ?? 0;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group flex w-full items-start gap-1.5 rounded-md px-1.5 py-1 text-left text-sm font-semibold leading-5 transition-all active:scale-95",
        style?.text ?? "text-slate-700",
        "hover:bg-black/5"
      )}
      title="Bấm để thêm 1 phần vào giỏ hàng"
    >
      <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-all group-hover:scale-150", style?.dot ?? "bg-slate-400")} />
      <span className="flex-1">{dishName}</span>
      {qty > 0 && (
        <span className="ml-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral-dark text-[10px] font-bold text-white shadow-sm">
          {qty}
        </span>
      )}
    </button>
  );
}
