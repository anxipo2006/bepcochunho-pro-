"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  pendingLabel?: React.ReactNode;
};

export function SubmitButton({ children, pendingLabel = "Đang xử lý...", disabled, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} disabled={pending || disabled}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
