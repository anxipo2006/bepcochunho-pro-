# Bếp Cô Chủ Nhỏ

Web app B2B cho doanh nghiệp đặt suất ăn công nghiệp, quản lý menu tuần, duyệt khách hàng, theo dõi đơn hàng và chốt công nợ.

## Tính năng chính

- Trang chủ giới thiệu dịch vụ, menu, quy trình đặt cơm và thông tin liên hệ.
- Đăng ký doanh nghiệp, đăng nhập email/mật khẩu, phân quyền Admin/Client.
- Client xem menu tuần, đặt món theo ngày, theo dõi đơn hàng và công nợ.
- Admin duyệt khách hàng, tạo món, nhập/sửa/xuất menu tuần bằng CSV.
- Admin tổng hợp số lượng món cần nấu, quản lý trạng thái đơn hàng.
- Admin chốt công nợ theo tháng và xác nhận invoice đã thanh toán.

## Tài khoản admin mẫu

```txt
Email: admin@cochunho.vn
Mật khẩu: admin123
```

Chạy seed để tạo tài khoản này và dữ liệu menu mẫu. Khi deploy production, hãy đổi mật khẩu admin.

## Cài đặt local

```bash
npm install
copy .env.example .env
docker compose up -d
npm run db:push
npm run db:seed
npm run dev
```

Mở `http://localhost:3000`.

## Biến môi trường

Xem [.env.example](./.env.example).

Local Docker MySQL mặc định:

```env
DATABASE_URL="mysql://cochunho:cochunho_pass@localhost:3307/cochunho_db"
AUTH_SECRET="replace-with-a-long-random-secret"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
```

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

Phương án khuyến nghị: Vercel + MySQL managed/cloud. Docker chỉ dùng để chạy MySQL local khi phát triển.

Xem checklist chi tiết trong [DEPLOYMENT.md](./DEPLOYMENT.md).
