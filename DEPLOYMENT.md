# Deployment Plan

## Chot phuong an

- App: Vercel.
- Source code: GitHub.
- Database production: MySQL managed/cloud, vi du Railway MySQL hoac Aiven MySQL.
- Docker: chi dung local development de chay MySQL tren may ca nhan.
- Domain: mua sau van duoc. Deploy truoc bang domain tam cua Vercel, sau do add domain that vao Vercel.

## Vi sao day la phuong an toi uu hien tai

- Khong can tu quan tri VPS, SSL, firewall, process manager.
- Vercel deploy nhanh, co preview deployment cho moi lan push.
- MySQL cloud chay rieng, Vercel truy cap duoc qua `DATABASE_URL`.
- Docker local giu moi truong dev giong production ma khong lam phuc tap deploy.

## Local development

```bash
npm install
copy .env.example .env
docker compose up -d
npm run db:push
npm run db:seed
npm run dev
```

Mo `http://localhost:3000`.

## Vercel deployment

1. Push code len GitHub.
2. Tao MySQL cloud database.
3. Lay connection string dang:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

4. Vao Vercel -> Project -> Settings -> Environment Variables, them:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
AUTH_SECRET="long-random-secret"
AUTH_URL="https://your-project.vercel.app"
NEXTAUTH_URL="https://your-project.vercel.app"
NEXTAUTH_SECRET="same-as-auth-secret"
```

5. Deploy tren Vercel.
6. Sau khi deploy lan dau, chay schema vao database production tu may local:

```bash
$env:DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
npm run db:push
npm run db:seed
```

Neu dung macOS/Linux:

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE" npm run db:push
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE" npm run db:seed
```

## Them domain sau

Sau khi mua domain:

1. Vercel -> Project -> Settings -> Domains.
2. Add domain, vi du `bepcochunho.vn`.
3. Lam theo DNS records Vercel dua ra.
4. Cap nhat env production:

```env
AUTH_URL="https://bepcochunho.vn"
NEXTAUTH_URL="https://bepcochunho.vn"
```

5. Redeploy.

## Luu y production

- Khong commit `.env`.
- Doi mat khau admin seed sau khi deploy.
- Khong dung MySQL Docker local lam production database.
- Nen bat backup tu nha cung cap MySQL cloud.
- Rate limit hien la in-memory; khi traffic cao nen chuyen sang Redis/Upstash.
