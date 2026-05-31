"use client";

import { useFormStatus } from "react-dom";
import { cancelOrderAction } from "@/actions/order";

function SubmitCancel() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {pending ? "Đang hủy..." : "Hủy đơn hàng"}
    </button>
  );
}

export function ClientCancelButton({ orderId }: { orderId: string }) {
  return (
    <form
      action={cancelOrderAction}
      onSubmit={(e) => {
        if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="orderId" value={orderId} />
      <SubmitCancel />
    </form>
  );
}
