# HealthAI-App

HealthAI-App là ứng dụng di động giúp phân tích dinh dưỡng từ hình ảnh món ăn bằng AI.  
Ứng dụng hỗ trợ đa ngôn ngữ: Tiếng Việt, Tiếng Anh và Tiếng Nhật.

---

## Tính năng

- Nhập **tuổi, cân nặng, chiều cao** của người dùng  
- Chụp hoặc chọn ảnh món ăn từ thư viện  
- AI phân tích và hiển thị thông tin dinh dưỡng:
  - Calo
  - Protein
  - Carbs
  - Chất béo
  - Nguyên liệu
  - Lợi ích dinh dưỡng
- Gợi ý mức vận động cần thiết để cân bằng năng lượng  
- Onboarding hướng dẫn cho người dùng lần đầu sử dụng  
- Hỗ trợ chuyển đổi ngôn ngữ **VN / EN / JP**  

---

## Công nghệ sử dụng

- **React Native** với **Expo**
- **Google Gemini API** để phân tích hình ảnh món ăn  
- **AsyncStorage** để lưu trạng thái onboarding  
- **expo-image-picker** để chọn hoặc chụp ảnh món ăn  

---

## Cài đặt & Chạy dự án

### 1. Clone repo

```bash
git clone https://github.com/tuyen-icd/HealthAI-App.git
cd HealthAI-App
````

### 2. Cài Dependencies
```
npm install
# hoặc
yarn install
```

### 3. Thiết lập biến môi trường (Nếu source đã có file .env rồi thì bỏ qua bước này HOẶC bạn có thể dùng GEMINI_API_KEY của riêng bạn )
```
Tạo file .env ở thư mục gốc với nội dung:
EXPO_PUBLIC_GEMINI_API_KEY=<your_gemini_api_key>
```

### 4. Chạy app trong môi trường phát triển
```
npx expo start

Quét QR code bằng Expo Go trên điện thoại
Hoặc chạy trên Android/iOS simulator
```
