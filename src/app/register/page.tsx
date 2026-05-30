import Link from "next/link";
import { registerAction } from "@/actions/auth";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form";

const errorMessage = {
  exists: "Email này đã tồn tại. Vui lòng dùng email khác hoặc đăng nhập.",
  invalid: "Thông tin chưa hợp lệ. Mật khẩu cần tối thiểu 8 ký tự, số điện thoại 8-20 chữ số/ký tự hợp lệ.",
  "rate-limit": "Bạn gửi đăng ký quá nhanh. Vui lòng thử lại sau.",
} as const;

export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
  const message = searchParams.error
    ? errorMessage[searchParams.error as keyof typeof errorMessage] ?? errorMessage.invalid
    : null;

  return (
    <AuthCard
      title="Đăng ký tài khoản doanh nghiệp"
      description="Tài khoản mới cần được Bếp xác minh trước khi có thể đặt hàng."
      footer={
        <>
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-semibold text-coral-dark">
            Đăng nhập
          </Link>
        </>
      }
    >
      {message ? (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {message}
        </div>
      ) : null}
      <form action={registerAction} className="grid gap-4">
        <Field label="Tên công ty">
          <input className={inputClass} name="companyName" autoComplete="organization" required />
        </Field>
        <Field label="Email">
          <input className={inputClass} name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Số điện thoại">
          <input className={inputClass} name="phone" autoComplete="tel" required />
        </Field>
        <Field label="Địa chỉ giao hàng">
          <input className={inputClass} name="address" autoComplete="street-address" />
        </Field>
        <Field label="Yêu cầu thời gian giao hàng">
          <input className={inputClass} name="deliveryTimeRequest" placeholder="Ví dụ: giao trước 10:45" />
        </Field>
        <Field label="Mật khẩu">
          <input
            className={inputClass}
            name="password"
            type="password"
            minLength={8}
            autoComplete="new-password"
            required
          />
        </Field>
        <Button className="mt-2 w-full">Gửi đăng ký</Button>
      </form>
    </AuthCard>
  );
}
