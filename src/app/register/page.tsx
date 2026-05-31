import Link from "next/link";
import { registerAction } from "@/actions/auth";
import { AuthCard } from "@/components/auth-card";
import { SubmitButton } from "@/components/ui/submit-button";
import { Field, inputClassDark } from "@/components/ui/form";

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
          <Link href="/login" className="font-semibold text-coral">
            Đăng nhập
          </Link>
        </>
      }
    >
      {message ? (
        <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm font-medium text-red-200">
          ✗ {message}
        </div>
      ) : null}
      <form action={registerAction} className="grid gap-4">
        <Field label="Tên công ty" dark>
          <input className={inputClassDark} name="companyName" autoComplete="organization" required />
        </Field>
        <Field label="Email" dark>
          <input className={inputClassDark} name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Số điện thoại" dark>
          <input className={inputClassDark} name="phone" autoComplete="tel" required />
        </Field>
        <Field label="Địa chỉ giao hàng" dark>
          <input className={inputClassDark} name="address" autoComplete="street-address" />
        </Field>
        <Field label="Yêu cầu thời gian giao hàng" dark>
          <input className={inputClassDark} name="deliveryTimeRequest" placeholder="Ví dụ: giao trước 10:45" />
        </Field>
        <Field label="Mật khẩu" dark>
          <input
            className={inputClassDark}
            name="password"
            type="password"
            minLength={8}
            autoComplete="off"
            required
          />
        </Field>
        <SubmitButton className="mt-3 w-full h-12 rounded-xl text-base" pendingLabel="Đang gửi...">
          Gửi đăng ký
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
