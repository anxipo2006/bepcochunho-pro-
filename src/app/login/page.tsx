import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form";

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
          <Link href="/register" className="font-semibold text-coral-dark">
            Đăng ký doanh nghiệp
          </Link>
        </>
      }
    >
      {searchParams.registered ? (
        <div className="mb-4 rounded-md bg-teal-50 px-3 py-2 text-sm text-teal-700">
          Đăng ký thành công. Bếp sẽ liên hệ xác minh và duyệt tài khoản sau khi chốt hợp đồng.
        </div>
      ) : null}
      {searchParams.error ? (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin đăng nhập.
        </div>
      ) : null}
      <form action={loginAction} className="grid gap-4">
        <Field label="Email">
          <input className={inputClass} name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Mật khẩu">
          <input
            className={inputClass}
            name="password"
            type="password"
            minLength={6}
            autoComplete="current-password"
            required
          />
        </Field>
        <Button className="mt-2 w-full">Đăng nhập</Button>
      </form>
    </AuthCard>
  );
}
