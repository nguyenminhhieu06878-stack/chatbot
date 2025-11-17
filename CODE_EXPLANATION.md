# Giải Thích Code - Dự Án StudyBot

Chào mừng đến với tài liệu giải thích mã nguồn của dự án StudyBot! Tài liệu này sẽ giúp bạn hiểu rõ hơn về cấu trúc dự án và cách hoạt động của thành phần cốt lõi: giao diện chat.

## 1. Cấu Trúc Thư Mục

Dự án được xây dựng bằng React và TypeScript, sử dụng Vite làm công cụ build. Dưới đây là cấu trúc các thư mục và tệp quan trọng:

```
/
├── public/              # Chứa các tệp tĩnh (ví dụ: file âm thanh thông báo).
├── src/                 # Thư mục chứa toàn bộ mã nguồn của ứng dụng.
│   ├── components/      # Chứa các thành phần (components) React có thể tái sử dụng.
│   │   └── StudyBotChat.tsx # Component cốt lõi, chứa toàn bộ logic và giao diện của chatbot.
│   ├── App.tsx          # Component gốc của ứng dụng, nơi StudyBotChat được hiển thị.
│   └── main.tsx         # Điểm vào của ứng dụng, nơi React được render vào DOM.
├── package.json         # Định nghĩa các gói phụ thuộc và các script của dự án.
└── vite.config.ts       # Tệp cấu hình cho Vite.
```

## 2. Thành Phần Cốt Lõi: `StudyBotChat.tsx`

Đây là tệp quan trọng nhất, quản lý toàn bộ trạng thái và giao diện của cuộc trò chuyện. Các chú thích chi tiết đã được thêm trực tiếp vào code, dưới đây là tóm tắt các phần chính:

### a. Quản Lý Trạng Thái (State Management)

Chúng tôi sử dụng `useState` của React để quản lý các trạng thái động của giao diện:

-   `messages`: Một mảng chứa tất cả các tin nhắn. Dữ liệu được lưu vào `localStorage` của trình duyệt để cuộc trò chuyện không bị mất khi người dùng tải lại trang.
-   `input`: Lưu trữ văn bản mà người dùng đang gõ trong ô nhập liệu.
-   `isThinking`: Kiểm soát việc hiển thị thông báo "Học Tốt Bot đang suy nghĩ...".
-   `isSending`: Vô hiệu hóa nút gửi để ngăn người dùng gửi nhiều tin nhắn cùng lúc.

### b. Logic Gửi Tin Nhắn (`handleSend` function)

Đây là hàm xử lý chính khi người dùng gửi một tin nhắn. Quy trình như sau:

1.  **Cập nhật giao diện:** Thêm tin nhắn của người dùng vào danh sách và hiển thị ngay lập tức.
2.  **Gọi API:** Gửi tin nhắn của người dùng cùng với lịch sử trò chuyện đến mô hình ngôn ngữ (GPT-4o).
3.  **Hiển thị phản hồi:** Nhận phản hồi từ API và hiển thị dưới dạng tin nhắn của bot với hiệu ứng gõ chữ.
4.  **Xử lý lỗi:** Nếu có lỗi xảy ra, một tin nhắn thông báo lỗi sẽ được hiển thị.

### c. Giao Diện Người Dùng (JSX)

Phần giao diện được chia thành các khối logic:

-   **Màn hình chào mừng:** Chỉ hiển thị khi chưa có tin nhắn nào.
-   **Danh sách tin nhắn:** Lặp qua mảng `messages` để hiển thị cuộc trò chuyện.
-   **Chỉ báo suy nghĩ:** Hiển thị khi `isThinking` là `true`.
-   **Ô nhập liệu:** Nơi người dùng nhập và gửi tin nhắn.
