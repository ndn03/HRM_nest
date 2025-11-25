# 🏢 HRM SYSTEM - HỆ THỐNG QUẢN LÝ NHÂN SỰ

## 📋 TỔNG QUAN DỰ ÁN

Hệ thống quản lý nhân sự (HRM) được xây dựng bằng NestJS, MySQL, Redis và Nginx. Dự án sử dụng Docker để đóng gói và triển khai tất cả các dịch vụ.

## 🛠️ CÔNG NGHỆ SỬ DỤNG

| Công nghệ  | Phiên bản | Mục đích                 |
| ---------- | --------- | ------------------------ |
| **NestJS** | Latest    | Framework backend chính  |
| **MySQL**  | 8.1       | Cơ sở dữ liệu            |
| **Redis**  | 6.2       | Cache và session storage |
| **Nginx**  | Alpine    | Reverse proxy            |
| **Docker** | Latest    | Containerization         |

## 🚀 CÁCH CHẠY DỰ ÁN

### Yêu cầu hệ thống:

- Docker & Docker Compose đã được cài đặt
- Port 7710, 7713, 7714, 3308 chưa bị sử dụng

### Khởi động nhanh:

```bash
# Cách 1: Sử dụng script tự động (Windows)
start-dev.bat

# Cách 2: Chạy thủ công
docker-compose up --build -d
```

### Kiểm tra trạng thái:

```bash
# Xem tất cả container
docker-compose ps

# Xem log của từng service
docker-compose logs -f nest-app
docker-compose logs -f mysql
docker-compose logs -f redis
docker-compose logs -f nginx
```

## 🌐 TRUY CẬP CÁC DỊCH VỤ

| Dịch vụ            | URL/Endpoint          | Mô tả               |
| ------------------ | --------------------- | ------------------- |
| **Ứng dụng chính** | http://localhost:7710 | API NestJS          |
| **Nginx Proxy**    | http://localhost:7714 | Load balancer       |
| **MySQL**          | localhost:3308        | Database connection |
| **Redis**          | localhost:7713        | Cache connection    |

## 📁 CẤU TRÚC DỰ ÁN

```
HRM-company/
├── 📁 nest-app/              # Source code NestJS
│   ├── 📁 src/               # Mã nguồn chính
│   ├── 📄 Dockerfile         # Build image NestJS
│   └── 📄 package.json       # Dependencies
├── 📁 .docker/               # Cấu hình Docker
│   ├── 📁 db/                # Cấu hình MySQL
│   └── 📁 nginx/             # Cấu hình Nginx
├── 📁 .env/                  # Biến môi trường
├── 📄 docker-compose.yml     # Orchestration
└── 📄 start-dev.bat          # Script khởi động
```

## ⚙️ CẤU HÌNH BIẾN MÔI TRƯỜNG

File: `.env/.env.nest-app`

```env
# Database
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USERNAME=hrm_user
MYSQL_PASSWORD=123456
MYSQL_DATABASE=hrm_nest

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## 🛑 DỪNG VÀ DỌN DẸP

```bash
# Dừng tất cả container
docker-compose down

# Dừng và xóa volumes (mất dữ liệu)
docker-compose down -v

# Dừng và xóa cả images
docker-compose down --rmi all
```

## 🔧 TROUBLESHOOTING

### Lỗi thường gặp:

1. **Port đã được sử dụng**

   ```bash
   # Kiểm tra port đang sử dụng
   netstat -an | findstr "7710"
   ```

2. **Container không khởi động được**

   ```bash
   # Kiểm tra log lỗi
   docker-compose logs [service-name]
   ```

3. **Database connection failed**
   ```bash
   # Kiểm tra MySQL đã sẵn sàng chưa
   docker-compose exec mysql mysqladmin ping -u root -p
   ```

## 📞 HỖ TRỢ

- 📧 Email: support@hrm-system.com
- 🐛 Issues: GitHub Issues
- 📖 Docs: Wiki project

---

**Phát triển bởi:** Team HRM Development  
**Cập nhật lần cuối:** ${new Date().toLocaleDateString('vi-VN')}
