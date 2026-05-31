import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { AuthCard } from "@/components/auth-card";
import { SubmitButton } from "@/components/ui/submit-button";
import { Field, inputClassDark } from "@/components/ui/form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; registered?: string };
}) {
  return (
    <AuthCard
      title="Đăng nhập"
      description="Vào cổng thông tin để đặt suất ăn, theo dõi đơn hàng và quản lý công nợ."
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-semibold text-coral">
            Đăng ký doanh nghiệp
          </Link>
        </>
      }
    >
      {searchParams.registered ? (
        <div className="mb-5 rounded-xl border border-teal-400/30 bg-teal-500/15 px-4 py-3 text-sm font-medium text-teal-200">
          ✓ Đăng ký thành công. Bếp sẽ liên hệ xác minh và duyệt tài khoản sau khi chốt hợp đồng.
        </div>
      ) : null}
      {searchParams.error ? (
        <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm font-medium text-red-200">
          ✗ Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.
        </div>
      ) : null}
      <form action={loginAction} className="grid gap-4">
        <Field label="Email" dark>
          <input className={inputClassDark} name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Mật khẩu" dark>
          <input
            className={inputClassDark}
            name="password"
            type="password"
            minLength={6}
            autoComplete="off"
            required
          />
        </Field>
        <SubmitButton className="mt-3 w-full h-12 rounded-xl text-base" pendingLabel="Đang đăng nhập...">Đăng nhập</SubmitButton>
      </form>
    </AuthCard>
  );
}
