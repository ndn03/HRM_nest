# 🚀 HƯỚNG DẪN SETUP DOCKER CHO TEAM

## 📋 CÀI ĐẶT BAN ĐẦU (CHỈ LÀM MỘT LẦN)

### 1️⃣ **Tạo docker-compose.yml từ template**

```bash
# Copy template file
cp docker-compose.yml.example docker-compose.yml

# Hoặc trên Windows
copy docker-compose.yml.example docker-compose.yml
```

### 2️⃣ **Tạo file environment**

```bash
# Copy env template
cp .env/.env.nest-app.example .env/.env.nest-app
```

### 3️⃣ **Cấu hình mật khẩu trong docker-compose.yml**

Mở file `docker-compose.yml` và thay thế các biến môi trường:

```yaml
# THAY ĐỔI NHỮNG DÒNG NÀY:
MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}  # -> MYSQL_ROOT_PASSWORD: MẬT_KHẨU_MẠNH_CỦA_BẠN
MYSQL_DATABASE: ${MYSQL_DATABASE}            # -> MYSQL_DATABASE: hrm_nest
MYSQL_USER: ${MYSQL_USER}                    # -> MYSQL_USER: hrm_user
MYSQL_PASSWORD: ${MYSQL_PASSWORD}            # -> MYSQL_PASSWORD: MẬT_KHẨU_USER_CỦA_BẠN

# VÀ SỬA HEALTH CHECK:
test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${MYSQL_ROOT_PASSWORD}"]
# THÀNH:
test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-pMẬT_KHẨU_ROOT_CỦA_BẠN"]
```

### 4️⃣ **Cập nhật file .env/.env.nest-app**

```env
# Cập nhật mật khẩu database
MYSQL_PASSWORD=MẬT_KHẨU_USER_CỦA_BẠN

# Thêm các thông tin khác nếu cần
JWT_SECRET=jwt-secret-key-cua-ban
```

## 🔐 YÊU CẦU MẬT KHẨU

### ✅ **Mật khẩu mạnh phải có:**

- Tối thiểu 12 ký tự
- Chứa chữ hoa (A-Z)
- Chứa chữ thường (a-z)
- Chứa số (0-9)
- Chứa ký tự đặc biệt (!@#$%^&\*)

### 💡 **Ví dụ mật khẩu mạnh:**

```
MyProject@2024!
HRM_SecurePass123!
DevTeam@Strong2024
```

## 🚀 **CHẠY DỰ ÁN**

```bash
# Khởi động tất cả services
docker-compose up --build -d

# Kiểm tra trạng thái
docker-compose ps

# Xem logs
docker-compose logs -f nest-app
```

## ❗ **LƯU Ý QUAN TRỌNG**

1. **KHÔNG BAO GIỜ** commit file `docker-compose.yml` lên Git (đã được thêm vào .gitignore)
2. **KHÔNG** chia sẻ mật khẩu qua email/chat công khai
3. **NÊN** sử dụng mật khẩu khác nhau cho mỗi môi trường (dev/staging/prod)
4. **NÊN** backup file cấu hình cá nhân ở nơi an toàn

## 🆘 **KHI GẶP LỖI**

### MySQL không kết nối được:

```bash
# Kiểm tra container MySQL
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

### NestJS không start được:

```bash
# Kiểm tra logs
docker-compose logs nest-app

# Kiểm tra env file
cat .env/.env.nest-app
```

### Reset toàn bộ:

```bash
# Dừng và xóa tất cả
docker-compose down -v

# Khởi động lại
docker-compose up --build -d
```

---

📞 **Hỗ trợ:** Liên hệ team lead nếu gặp khó khăn trong setup
