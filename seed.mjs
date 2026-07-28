import { PrismaClient } from '@prisma/client';
import { scryptSync, randomBytes } from 'crypto';
const prisma = new PrismaClient();

async function main() {
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = salt + ':' + scryptSync('123456', salt, 64).toString('hex');
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: { password: hashedPassword },
    create: { username: 'admin', password: hashedPassword }
  });
  console.log('Đã tạo/cập nhật tài khoản admin thành công (admin / 123456)');

  // Clear existing posts
  await prisma.post.deleteMany({});
  
  await prisma.post.createMany({
    data: [
      {
        title: 'Bắt đầu với Next.js và Prisma',
        content: 'Đây là bài viết đầu tiên của tôi về việc sử dụng Next.js kết hợp với Prisma. Rất tuyệt vời!\n\n## Tại sao chọn Next.js?\nVì nó có App Router, Server Components và rất nhiều tính năng hiện đại. Bạn có thể dễ dàng quản lý SSR và RSC.\n\n```js\nconsole.log("Hello Next.js");\n```',
        author: 'Admin',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
      },
      {
        title: 'Cách làm giao diện Blog siêu đẹp',
        content: 'Hôm nay chúng ta sẽ tìm hiểu cách sử dụng Glassmorphism và CSS Modules để tạo ra một giao diện độc đáo cho Blog.\n\n### Glassmorphism là gì?\nGlassmorphism là phong cách thiết kế sử dụng độ mờ (blur) để tạo hiệu ứng như kính.\n\n- Đẹp mắt\n- Tinh tế\n- Hiện đại',
        author: 'John Doe',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
      },
      {
        title: 'Lập trình viên và Cà phê',
        content: 'Có một sự thật không thể chối cãi là hầu hết lập trình viên đều thích cà phê. Tại sao lại như vậy?\n\n- Giúp tỉnh táo\n- Tạo cảm hứng code\n- Thói quen mỗi buổi sáng',
        author: 'Jane Smith',
        imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop',
      },
      {
        title: 'Khám phá bí ẩn của React 19',
        content: 'React 19 mang đến rất nhiều tính năng mới như `use`, `useActionState` và hàng loạt cải tiến về hiệu suất. Hãy cùng tìm hiểu chi tiết trong bài viết này nhé.',
        author: 'Admin',
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
      },
      {
        title: 'Tối ưu hóa hiệu suất website với Next.js App Router',
        content: 'Hiệu suất trang web là yếu tố sống còn để giữ chân người dùng và tăng xếp hạng SEO. Với **Next.js App Router**, chúng ta có các ưu điểm tuyệt vời:\n\n### 1. Server Components mặc định\nGiảm thiểu lượng JavaScript gửi xuống client, giúp thời gian tải trang nhanh hơn đáng kể.\n\n### 2. Streaming & Suspense\nHiển thị từng phần giao diện ngay khi dữ liệu sẵn sàng mà không cần chờ đợi toàn bộ trang.\n\n```jsx\n<Suspense fallback={<Loading />}>\n  <PostList />\n</Suspense>\n```\n\nHãy áp dụng ngay cho dự án của bạn!',
        author: 'Admin',
        imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop',
      },
      {
        title: 'Tại sao TypeScript là tiêu chuẩn bắt buộc cho dự án lớn?',
        content: 'Trong các dự án lập trình hiện đại, **TypeScript** đã trở thành tiêu chuẩn công nghiệp không thể thiếu.\n\n- **Phát hiện lỗi sớm:** Tìm ra lỗi ngay trong quá trình viết code (compile-time) thay vì lúc chạy app (runtime).\n- **Tự động gợi ý code:** IDE hỗ trợ intellisense cực tốt, giúp tăng tốc độ gõ và chính xác.\n- **Dễ bảo trì:** Khi làm việc nhóm lớn, kiểu dữ liệu rõ ràng chính là bộ tài liệu sống tốt nhất.',
        author: 'Alex Nguyen',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
      },
      {
        title: 'Nghệ thuật thiết kế Glassmorphism trong UI/UX hiện đại',
        content: 'Phong cách kính mờ (**Glassmorphism**) đang thống trị các giao diện ứng dụng từ macOS, iOS cho đến web app hiện đại.\n\n### Bí quyết tạo hiệu ứng kính chuẩn:\n1. Nền bán trong suốt (`rgba` hoặc `hex` có alpha)\n2. Thuộc tính `backdrop-filter: blur(12px)`\n3. Đường viền mỏng sáng (`border: 1px solid rgba(255, 255, 255, 0.5)`)\n4. Bóng đổ mềm mại để tạo độ sâu và nổi bật bề mặt.',
        author: 'Elena Tran',
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
      },
      {
        title: 'Học tiếng Anh cho Lập trình viên: Bí quyết đọc tài liệu thần tốc',
        content: 'Rào cản lớn nhất của nhiều lập trình viên khi tiếp cận công nghệ mới chính là tiếng Anh. Dưới đây là phương pháp học hiệu quả:\n\n- **Học theo ngữ cảnh (Context):** Không học từ vựng riêng lẻ, hãy đọc trực tiếp Official Documentation của các framework.\n- **Sử dụng công cụ hỗ trợ:** Sử dụng từ điển tích hợp trên trình duyệt để tra nhanh thuật ngữ.\n- **Viết nhật ký code bằng tiếng Anh:** Tập đặt tên biến, viết commit và comment hoàn toàn bằng tiếng Anh.',
        author: 'John Doe',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop',
      },
      {
        title: 'Cơ sở dữ liệu Quan hệ vs NoSQL: Khi nào chọn Prisma & PostgreSQL?',
        content: 'Việc lựa chọn cơ sở dữ liệu ảnh hưởng rất lớn đến kiến trúc hệ thống về sau.\n\n### Khi nào chọn Relational (PostgreSQL/MySQL)?\n- Dữ liệu có cấu trúc chặt chẽ, nhiều mối quan hệ (E-commerce, Blog, Tài chính).\n- Cần đảm bảo tính toàn vẹn dữ liệu (ACID).\n\n### Kết hợp cùng Prisma ORM:\nPrisma đem lại trải nghiệm truy vấn an toàn tuyệt đối với TypeScript, giúp thao tác database dễ dàng như làm việc với object thông thường.',
        author: 'Admin',
        imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1000&auto=format&fit=crop',
      },
      {
        title: 'Làm chủ Trí tuệ Nhân tạo (AI) trong lập trình hàng ngày',
        content: 'Sự bùng nổ của AI Coding Assistants đang thay đổi cách chúng ta viết code. Thay vì lo sợ bị thay thế, hãy biến AI thành trợ thủ đắc lực.\n\n- **Tạo khung dự án nhanh chóng:** Dùng AI để dựng boilerplate code, viết unit test tự động.\n- **Debug lỗi phức tạp:** Dán stack trace hoặc mô tả bug để AI phân tích nguyên nhân tiềm ẩn.\n- **Học ngôn ngữ mới:** Hỏi AI giải thích cấu trúc cú pháp của một ngôn ngữ lạ theo cách liên tưởng đến ngôn ngữ bạn đã biết.',
        author: 'David Pham',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
      },
      {
        title: 'Kiến trúc Microservices và Những cạm bẫy cần tránh',
        content: 'Microservices nghe rất hấp dẫn nhưng không phải lúc nào cũng là giải pháp "vàng".\n\n### Những khó khăn thực tế:\n- **Độ phức tạp quản lý:** Phải theo dõi hàng chục dịch vụ độc lập.\n- **Độ trễ mạng (Network Latency):** Giao tiếp giữa các service qua HTTP/gRPC tốn thời gian hơn gọi hàm cục bộ.\n\n**Lời khuyên:** Hãy bắt đầu với một Monolith được thiết kế tốt (Modular Monolith) trước khi tách thành Microservices!',
        author: 'Jane Smith',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop',
      },
      {
        title: 'CSS Variables và Bí quyết tạo Dark Mode cực mượt',
        content: 'Sử dụng biến CSS (CSS Custom Properties) là cách linh hoạt nhất để xây dựng hệ thống giao diện hỗ trợ đa chế độ sáng/tối.\n\n```css\n:root {\n  --bg-color: #ffffff;\n  --text-color: #0f172a;\n}\n\n[data-theme="dark"] {\n  --bg-color: #0f172a;\n  --text-color: #f8fafc;\n}\n```\n\nChỉ cần thay đổi thuộc tính `data-theme` trên thẻ `html`, toàn bộ trang web sẽ tự động chuyển màu siêu mượt mà!',
        author: 'Minh Le',
        imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
      },
      {
        title: 'Kinh nghiệm phỏng vấn vị trí Senior Frontend Engineer',
        content: 'Để vượt qua vòng phỏng vấn cho các vị trí cấp cao, kỹ năng code giỏi là chưa đủ.\n\n### Bạn cần chuẩn bị gì?\n1. **System Design cho Frontend:** Hiểu sâu về cách thiết kế kiến trúc ứng dụng web quy mô lớn, quản lý state, caching và phân phối qua CDN.\n2. **Tối ưu Web Vitals:** Nắm vững LCP, FID, CLS và cách chẩn đoán nghẽn cổ chai bằng Chrome DevTools.\n3. **Kỹ năng mềm:** Khả năng giao tiếp, dẫn dắt đội ngũ và ra quyết định công nghệ hợp lý.',
        author: 'Sarah Vu',
        imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000&auto=format&fit=crop',
      },
      {
        title: 'Bảo mật web cơ bản: XSS, CSRF và SQL Injection',
        content: 'Bảo mật luôn là nguyên tắc tối thượng khi phát triển ứng dụng web web.\n\n- **XSS (Cross-Site Scripting):** Luôn mã hóa (sanitize) dữ liệu đầu vào và đầu ra trước khi hiển thị lên DOM.\n- **CSRF:** Sử dụng SameSite cookies và anti-CSRF tokens để xác thực yêu cầu hợp lệ.\n- **SQL Injection:** Luôn sử dụng Parameterized Queries hoặc ORM như Prisma để tự động thoát (escape) các chuỗi ký tự nguy hiểm.',
        author: 'Admin',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
      }
    ]
  });
  console.log('Đã tạo thành công 14 bài viết mẫu!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
