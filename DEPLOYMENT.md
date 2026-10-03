# Triển khai Cơm Văn Phòng Mến trên VPS NAT

## Trạng thái cần xác nhận

- VPS `trong-an-06` đang ở trạng thái **STOPPED** khi kiểm tra ngày 03/10/2026.
- `tiay.click` đang phục vụ một website khác. Chỉ cập nhật DNS sau khi xác nhận hostname dành cho Cơm Văn Phòng Mến; `men.tiay.click` là một lựa chọn không ảnh hưởng website gốc.
- Kết nối tới MySQL đang cấu hình trong máy phát triển chưa hoạt động tại thời điểm kiểm tra. Trang chủ vẫn hiển thị, nhưng menu động, đăng nhập và biểu mẫu liên hệ cần database hoạt động.

## Kiến trúc phù hợp

- VPS NAT chạy một tiến trình Next.js `standalone` trên `127.0.0.1:3000` dưới tài khoản Linux riêng; quản lý bằng `systemd`.
- Công khai qua Cloudflare Tunnel hoặc cổng HTTP/HTTPS được cấp trong panel NAT, kèm HTTPS ở điểm truy cập công khai. Không trỏ bản ghi A của tên miền tới IP NAT nội bộ.
- MySQL được quản lý bên ngoài VPS, có sao lưu. VPS hiện có 1 GiB RAM; tránh chạy đồng thời cả ứng dụng, MySQL và bản build tại đây.
- Chỉ cho phép truy cập SSH từ các nguồn cần thiết nếu panel hỗ trợ; tắt đăng nhập root bằng mật khẩu sau khi đã thiết lập khóa SSH và tài khoản quản trị khác.

## Chuẩn bị môi trường production

Tạo file môi trường ngoài Git trên máy chủ, quyền đọc chỉ dành cho tài khoản chạy ứng dụng:

```env
NODE_ENV="production"
PORT="3000"
HOSTNAME="127.0.0.1"
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
AUTH_SECRET="generate-a-long-random-secret"
AUTH_URL="https://men.tiay.click"
AUTH_TRUST_HOST="true"
```

Thay hostname bằng tên miền được chọn thực tế. `AUTH_TRUST_HOST` chỉ dùng sau khi đặt ứng dụng sau reverse proxy/Tunnel do mình kiểm soát. Không đưa mật khẩu VPS, database hoặc secret vào repo. Thay mật khẩu VPS đã được chia sẻ qua chat sau khi hoàn tất cấu hình truy cập mới.

## Bản build Linux

Chạy `npm ci` và `npm run build` trong môi trường Linux tương thích với VPS. Prisma Client chứa mã native nên không sao chép `node_modules` hoặc bản build từ Windows lên Linux. Chép `.next/standalone`, `.next/static` và `public` theo cấu trúc Next.js standalone; khởi chạy bằng `node server.js` dưới tài khoản ứng dụng. Dùng `systemd` để tự khởi động lại và xem log.

Trước khi bật biểu mẫu/đăng nhập, kiểm tra kết nối `DATABASE_URL`, áp dụng schema sau khi đã sao lưu database (`npm run db:push` trong môi trường tin cậy), rồi tạo tài khoản quản trị với `SEED_ADMIN_EMAIL` và `SEED_ADMIN_PASSWORD` riêng (ít nhất 16 ký tự). Không chạy seed vào database hiện có nếu chưa xem dữ liệu mẫu mà script sẽ tạo.

## Kiểm tra sau triển khai

1. Kiểm tra HTTPS, trang chủ, logo và các trang đăng nhập/đăng ký trên desktop và điện thoại.
2. Xác nhận header bảo mật và không có thông tin nhạy cảm trong log/trang lỗi.
3. Thử biểu mẫu liên hệ, menu và đăng nhập khi database đã sẵn sàng.
4. Cấu hình sao lưu database, giám sát tiến trình và cập nhật bảo mật định kỳ.

Giới hạn tần suất đăng nhập hiện lưu trong bộ nhớ tiến trình. Nếu chạy nhiều instance, chuyển sang Redis hoặc kho lưu trữ chung để giới hạn có hiệu lực xuyên instance.
