<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Rules & Constraints
- **UI Dialogs**: Tuyệt đối KHÔNG sử dụng hàm mặc định của trình duyệt như `alert()` hay `confirm()` trong toàn bộ dự án. Luôn sử dụng Custom Modal hoặc giao diện thông báo tùy chỉnh.
- **Icons**: Tuyệt đối KHÔNG sử dụng emoji hay bất kỳ thư viện icon nào khác ngoài **`lucide-react`**. Tất cả icon trong giao diện phải được import từ thư viện `lucide-react`.
