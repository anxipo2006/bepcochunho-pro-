# Cơm Văn Phòng Mến

Web app B2B cho doanh nghiệp đặt suất ăn công nghiệp, quản lý menu tuần, duyệt khách hàng, theo dõi đơn hàng và chốt công nợ.

## Tính năng chính

- Trang chủ giới thiệu dịch vụ, menu, quy trình đặt cơm và thông tin liên hệ.
- Đăng ký doanh nghiệp, đăng nhập email/mật khẩu, phân quyền Admin/Client.
- Client xem menu tuần, đặt món theo ngày, theo dõi đơn hàng và công nợ.
- Admin duyệt khách hàng, tạo món, nhập/sửa/xuất menu tuần bằng CSV.
- Admin tổng hợp số lượng món cần nấu, quản lý trạng thái đơn hàng.
- Admin chốt công nợ theo tháng và xác nhận invoice đã thanh toán.

Tài khoản quản trị được tạo từ biến môi trường khi chạy seed. Mã nguồn không chứa mật khẩu quản trị mặc định.

## Cài đặt local

```bash
npm install
copy .env.example .env
# Sửa .env: tạo secret ngẫu nhiên và thay email/mật khẩu quản trị mẫu.
docker compose up -d
npm run db:push
npm run db:seed
npm run dev
```

Mở `http://localhost:3000`.

## Biến môi trường

Xem [.env.example](./.env.example).

Local Docker MySQL mặc định. Tạo `AUTH_SECRET` và `NEXTAUTH_SECRET` bằng `npx auth secret`; đặt email quản trị và mật khẩu riêng trước khi chạy seed. Mật khẩu seed cần ít nhất 16 ký tự.

```env
DATABASE_URL="mysql://cochunho:cochunho_pass@localhost:3307/cochunho_db"
AUTH_SECRET="replace-with-a-long-random-secret"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="your-unique-password-at-least-16-characters"
```

Giữ giá trị bí mật trong `.env` hoặc secret manager, không commit lên Git. Không dùng mật khẩu minh họa trong môi trường thật.

## Lệnh hữu ích

```bash
npm run dev          # chạy môi trường phát triển
npm run build        # prisma generate + build production
npm run lint         # kiểm tra lint
npm run clean        # xóa .next và cache
npm run db:generate  # generate Prisma Client
npm run db:push      # đẩy Prisma schema lên MySQL
npm run db:seed      # tạo dữ liệu mẫu
npm run studio       # mở Prisma Studio
```

## Deploy production

Mã nguồn có bản build `standalone` cho VPS. Với VPS NAT, cần xác nhận hostname và cách công khai dịch vụ trước khi cấu hình DNS. Dùng MySQL riêng có sao lưu; Docker Compose trong repo chỉ phục vụ môi trường local.

Xem checklist chi tiết trong [DEPLOYMENT.md](./DEPLOYMENT.md).
