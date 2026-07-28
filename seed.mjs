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

  // Clear existing posts and comments
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  
  await prisma.post.createMany({
    data: [
      {
        title: 'Bắt đầu với Next.js 16 và Prisma ORM: Sức mạnh Fullstack hoàn hảo',
        author: 'Admin',
        tags: 'nextjs, prisma, react, fullstack',
        likes: 128,
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
        content: `Chào mừng bạn đến với hướng dẫn toàn diện về lập trình Web Fullstack hiện đại với **Next.js 16** và **Prisma ORM**. Sự kết hợp giữa kiến trúc Server Components của Next.js và khả năng truy vấn an toàn kiểu dữ liệu (type-safe) của Prisma đã tạo nên một chuẩn mực mới trong phát triển phần mềm.

![Kiến trúc Web Hiện đại](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop)

## 1. Tại sao Next.js App Router lại thay đổi cuộc chơi?

Trước đây, với các ứng dụng Single Page Application (SPA) truyền thống như Create React App, toàn bộ JavaScript phải được tải xuống trình duyệt của người dùng trước khi trang web có thể hiển thị. Điều này gây ra thời gian tải ban đầu (Initial Load) rất chậm và ảnh hưởng xấu đến SEO.

Với **App Router** trong Next.js, chúng ta có kiến trúc **React Server Components (RSC)** mặc định:
- **Zero Bundle Size:** Các component chạy trên server không gửi JavaScript thừa xuống client.
- **Truy cập Database trực tiếp:** Bạn có thể gọi Prisma ngay bên trong component mà không cần tạo thêm tầng API trung gian.
- **Tối ưu SEO tuyệt đối:** HTML được render sẵn từ máy chủ, các robot tìm kiếm có thể cào dữ liệu ngay lập tức.

![Đội ngũ lập trình làm việc với Next.js](https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop)

## 2. Prisma ORM: Cầu nối hoàn hảo cho Cơ sở dữ liệu

Nếu bạn từng làm việc với SQL thuần hoặc các ORM cũ như Sequelize, bạn sẽ hiểu nỗi đau khi tên bảng hay tên cột bị sai chính tả mà chỉ phát hiện được khi ứng dụng bị crash lúc đang chạy (runtime error).

Prisma giải quyết triệt để vấn đề này nhờ file cấu hình \`schema.prisma\` và tính năng tự tạo TypeScript client:

\`\`\`prisma
model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String
  author    String    @default("Admin")
  likes     Int       @default(0)
  createdAt DateTime  @default(now())
}
\`\`\`

Khi bạn gõ code trong IDE như VS Code hay Cursor, bạn sẽ nhận được gợi ý (Intellisense) chính xác đến từng thuộc tính của bảng:

![Giao diện lập trình TypeScript và Prisma](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop)

## 3. Thực hành: Truy vấn dữ liệu trong 3 dòng code

Hãy xem việc lấy danh sách bài viết trên Server Component đơn giản và sạch sẽ như thế nào:

\`\`\`tsx
import prisma from "@/lib/prisma";

export default async function BlogHomePage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="grid">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
\`\`\`

![Tối ưu hóa tốc độ truy vấn](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop)

## 4. Lời khuyên cho người mới bắt đầu

1. **Nắm vững TypeScript:** Prisma phát huy 200% sức mạnh khi bạn viết code có định nghĩa kiểu rõ ràng.
2. **Sử dụng Connection Pooling:** Khi deploy lên các nền tảng Serverless như Vercel kết hợp với Neon PostgreSQL, hãy đảm bảo bạn dùng connection pool để tránh cạn kiệt kết nối.
3. **Thường xuyên cập nhật Schema:** Mỗi khi thêm cột mới, chỉ cần chạy \`npx prisma db push\` là mọi thứ sẵn sàng!

![Thành công với dự án đầu tiên](https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop)

Chúc các bạn xây dựng được những ứng dụng web thật tuyệt vời với bộ đôi Next.js và Prisma!`
      },
      {
        title: 'Nghệ thuật thiết kế Giao diện Glassmorphism trong UI/UX hiện đại',
        author: 'Elena Tran',
        tags: 'design, css, uiux, frontend',
        likes: 95,
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
        content: `Phong cách **Glassmorphism (Kính mờ)** đã và đang thống trị thế giới thiết kế giao diện từ hệ điều hành macOS, iOS cho đến các trang web và ứng dụng web cao cấp hiện nay. Sự kết hợp giữa độ trong suốt, màu sắc rực rỡ và hiệu ứng làm mờ hậu cảnh mang đến cảm giác chiều sâu cực kỳ tinh tế.

![Giao diện phong cách kính mờ Glassmorphism](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop)

## 1. 4 Yếu tố cốt lõi của Glassmorphism

Để tạo ra hiệu ứng kính chuẩn mực, bạn không thể bỏ qua 4 thành phần sau:
- **Độ bán trong suốt (Translucency):** Sử dụng nền dạng \`rgba\` hoặc \`hsla\` có độ alpha từ 0.6 đến 0.85.
- **Làm mờ hậu cảnh (Background Blur):** Thuộc tính thần thánh \`backdrop-filter: blur(16px)\` tạo nên cảm giác kính thật.
- **Đường viền sáng (Subtle Light Border):** Một đường viền 1px siêu mỏng với màu trắng độ mờ 20% giúp tách biệt khối kính với hậu cảnh.
- **Bóng đổ mềm (Soft Shadow):** Tạo khoảng cách và chiều sâu trong không gian 3D của giao diện.

![Phối màu và bố cục giao diện](https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop)

## 2. Viết code CSS cho thẻ Glass Panel chuẩn mực

Dưới đây là đoạn code CSS mà DevVibe Blog sử dụng cho các thẻ bài viết và thanh điều hướng:

\`\`\`css
.glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.glass-panel:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px 0 rgba(37, 99, 235, 0.15);
  border-color: rgba(37, 99, 235, 0.3);
}
\`\`\`

![Trải nghiệm người dùng tuyệt hảo trên đa thiết bị](https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop)

## 3. Những lỗi sai thường gặp khi áp dụng Glassmorphism

1. **Lạm dụng quá nhiều lớp kính chồng lên nhau:** Khiến giao diện bị rối mắt và làm giảm hiệu suất render của trình duyệt (đặc biệt trên thiết bị di động cấu hình thấp).
2. **Thiếu độ tương phản văn bản:** Chữ màu nhạt trên nền kính mờ rất khó đọc. Hãy luôn đảm bảo tiêu đề và văn bản tuân thủ tiêu chuẩn tương phản WCAG 2.1 AA.
3. **Hậu cảnh phía sau quá đơn điệu:** Hiệu ứng kính mờ chỉ thực sự đẹp khi phía sau nó có các mảng màu gradient rực rỡ hoặc hình ảnh chuyển động sinh động.

![Không gian làm việc sáng tạo của Designer](https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop)

## 4. Tương lai của thiết kế Giao diện

Với sự phát triển của công nghệ thực tế ảo mixed reality (như Apple Vision Pro), phong cách Glassmorphism sẽ còn phát triển mạnh mẽ hơn nữa thành **Spatial Design (Thiết kế không gian)**. Hãy nắm vững các kỹ năng CSS này ngay hôm nay để dẫn đầu xu hướng!`
      },
      {
        title: 'Làm chủ Trí tuệ Nhân tạo (AI) trong lập trình hàng ngày: Trợ thủ hay Đối thủ?',
        author: 'David Pham',
        tags: 'ai, coding, chatgpt, productivity',
        likes: 210,
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
        content: `Sự ra đời của các công cụ lập trình hỗ trợ bởi Trí tuệ Nhân tạo (AI Coding Assistants) như GitHub Copilot, Cursor và Claude 3.7 Sonnet đã thay đổi mãi mãi cách các lập trình viên viết code hàng ngày. Thay vì lo sợ bị AI thay thế công việc, lập trình viên thông thái đang biến AI thành một "đối tác lập trình đôi" (Pair Programmer) siêu việt.

![Trí tuệ nhân tạo và tương lai lập trình](https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop)

## 1. 3 Bước tự động hóa công việc nhàm chán với AI

AI cực kỳ xuất sắc trong việc thực hiện các tác vụ lặp đi lặp lại hoặc đòi hỏi tra cứu cú pháp nhanh:
- **Viết Unit Test tự động:** Chỉ cần đưa hàm xử lý logic cho AI, nó có thể tạo ra hàng loạt test case bao phủ cả Happy Path lẫn Edge Cases trong vài giây.
- **Chuyển đổi ngôn ngữ (Code Translation):** Chuyển một module từ Python sang TypeScript hoặc từ React Component cũ (Class) sang Functional Component dùng Hooks.
- **Tạo khung dự án (Boilerplate):** Tạo cấu trúc thư mục chuẩn cho một feature mới kèm các file type định nghĩa sẵn.

![AI giúp tăng hiệu suất làm việc gấp 3 lần](https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop)

## 2. Nghệ thuật Prompt Engineering cho Lập trình viên

AI chỉ trả lời thông minh khi bạn đặt câu hỏi (prompt) thông minh. Một prompt code chất lượng cần tuân theo công thức **4C**:
1. **Context (Bối cảnh):** Nói rõ bạn đang dùng framework gì, phiên bản bao nhiêu (VD: Next.js 16 App Router, Prisma, TypeScript).
2. **Constraint (Ràng buộc):** Yêu cầu không dùng thư viện ngoài, phải xử lý lỗi try/catch, tối ưu hiệu suất.
3. **Code snippet:** Dán đoạn code hiện tại và mô tả chính xác chỗ cần sửa.
4. **Clear Goal (Mục tiêu rõ ràng):** Bạn muốn fix bug, refactor cho dễ đọc hay tối ưu tốc độ chạy?

\`\`\`markdown
[Prompt mẫu]
Tôi đang dùng Next.js 16 App Router và Prisma. 
Hãy giúp tôi viết một API route POST /api/posts/[id]/like để tăng số lượt thích của bài viết.
Ràng buộc:
- Sử dụng TypeScript an toàn
- Kiểm tra bài viết tồn tại trong DB trước khi update
- Trả về JSON chứa số likes mới và xử lý lỗi 500 nếu thất bại.
\`\`\`

![Tương tác làm việc cùng máy tính và AI](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop)

## 3. Những vùng cấm địa không nên giao hoàn toàn cho AI

Dù AI rất mạnh, bạn **tuyệt đối không được nhắm mắt copy-paste** trong các trường hợp sau:
- **Kiến trúc bảo mật cốt lõi:** Các thuật toán mã hóa mật khẩu, phân quyền hệ thống (RBAC), xác thực JWT/HMAC. Hãy luôn rà soát thủ công từng dòng code.
- **Quyết định kiến trúc hệ thống:** Chọn cơ sở dữ liệu nào, phân chia Microservices ra sao... Đây là những quyết định phụ thuộc vào bài toán kinh doanh thực tế mà AI không nắm rõ.

![Kiểm tra và đánh giá code cẩn thận](https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop)

## 4. Lập trình viên của tương lai: Kỹ sư Điều phối AI

Trong 5 năm tới, giá trị của lập trình viên không nằm ở việc ai gõ phím nhanh hơn hay nhớ nhiều cú pháp hơn, mà nằm ở **tư duy hệ thống, khả năng giải quyết vấn đề và năng lực điều khiển các agent AI** để biến ý tưởng thành sản phẩm thực tế với tốc độ ánh sáng!

![Thành công và làm chủ công nghệ mới](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop)`
      },
      {
        title: 'Tại sao TypeScript là tiêu chuẩn bắt buộc cho mọi dự án Web chuyên nghiệp?',
        author: 'Alex Nguyen',
        tags: 'typescript, javascript, webdev, bestpractices',
        likes: 164,
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
        content: `Cách đây 10 năm, JavaScript thuần (Vanilla JS) từng là "vua" của thế giới web. Nhưng khi quy mô các ứng dụng ngày càng phình to với hàng nghìn dòng code và hàng chục lập trình viên làm việc chung, JavaScript bộc lộ yếu điểm chí mạng: **Không có kiểu dữ liệu tĩnh (Dynamic Typing)**.

![Code TypeScript an toàn và bảo trì dễ dàng](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop)

## 1. Nỗi đau mang tên "Cannot read property of undefined"

Bất kỳ ai từng code JS đều ít nhất một lần gặp ám ảnh với lỗi runtime kinh điển:
\`Uncaught TypeError: Cannot read properties of undefined (reading 'name')\`

Với **TypeScript**, 90% những lỗi vớ vẩn này được phát hiện ngay từ lúc bạn đang gõ code (Compile-time):

\`\`\`ts
interface User {
  id: number;
  name: string;
  avatar?: string; // Optional property
}

function getAvatarUrl(user: User): string {
  // TypeScript sẽ cảnh báo nếu bạn không check null cho avatar!
  return user.avatar?.toLowerCase() || "/default-avatar.png";
}
\`\`\`

![Phát hiện lỗi sớm ngay trên IDE VS Code](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop)

## 2. Tài liệu sống cho cả đội ngũ (Living Documentation)

Khi bạn tham gia vào một công ty mới hoặc đọc code của người khác sau 6 tháng, việc đoán xem một hàm nhận vào đối số gì và trả về cấu trúc dữ liệu ra sao là cực kỳ mệt mỏi.

Với TypeScript, các \`interface\` và \`type\` đóng vai trò như bản hợp đồng dữ liệu rõ ràng nhất, không cần viết thêm tài liệu Word hay PDF giải thích.

![Làm việc nhóm hiệu quả nhờ định nghĩa kiểu](https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop)

## 3. Khả năng Refactor (Tái cấu trúc code) tự tin 100%

Giả sử bạn muốn đổi tên trường \`imageUrl\` thành \`avatarUrl\` trên toàn bộ dự án 50 file.
- Với JavaScript: Bạn dùng tính năng Find & Replace của trình soạn thảo và cầu nguyện không sửa nhầm biến của module khác.
- Với TypeScript: Chỉ cần bấm F2 (Rename Symbol), trình biên dịch sẽ tự động sửa đúng những chỗ cần sửa và báo lỗi ngay lập tức nếu còn sót chỗ nào.

![Sự tự tin khi thay đổi kiến trúc hệ thống](https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop)

## 4. Lời khuyên khi chuyển từ JS sang TS

Đừng cố gắng áp dụng các kiểu dữ liệu nâng cao (Generics phức tạp, Conditional Types) ngay từ đầu. Hãy bắt đầu bằng cách định nghĩa kiểu cho các **Props của Component, Kết quả trả về của API và Models trong Database**. Đó là nơi đem lại giá trị bảo vệ cao nhất cho dự án của bạn!`
      },
      {
        title: 'Cơ sở dữ liệu Quan hệ vs NoSQL: Khi nào chọn PostgreSQL & Prisma?',
        author: 'Jane Smith',
        tags: 'database, postgresql, mongodb, backend',
        likes: 142,
        imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1000&auto=format&fit=crop',
        content: `Việc lựa chọn hệ quản trị cơ sở dữ liệu (DBMS) là một trong những quyết định kiến trúc quan trọng nhất khi bắt đầu một dự án mới. Nên chọn cơ sở dữ liệu quan hệ truyền thống như **PostgreSQL/MySQL** hay nhảy sang xu hướng NoSQL như **MongoDB/DynamoDB**?

![Hệ thống cơ sở dữ liệu đám mây](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop)

## 1. Khi nào NoSQL (MongoDB) là lựa chọn tốt?

NoSQL phù hợp nhất cho các hệ thống có đặc thù:
- **Dữ liệu không có cấu trúc cố định:** Mỗi bản ghi (document) có thể có các thuộc tính hoàn toàn khác nhau.
- **Tốc độ ghi cực lớn (High Write Throughput):** Các hệ thống lưu vết nhật ký (Logging, IoT Sensor Data).
- **Phát triển MVP siêu nhanh:** Không cần thiết kế schema trước, cứ đẩy object JSON lên là lưu được.

![Máy chủ lưu trữ dữ liệu quy mô lớn](https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop)

## 2. Tại sao PostgreSQL vẫn là "vị vua không ngai"?

Đối với 85% các ứng dụng thực tế hiện nay (Mạng xã hội, Thương mại điện tử, Blog, Tài chính), **dữ liệu luôn có mối quan hệ chặt chẽ với nhau**:
- Một Người dùng (\`User\`) viết nhiều Bài blog (\`Post\`).
- Một Bài blog có nhiều Bình luận (\`Comment\`) và Lượt thích (\`Like\`).

PostgreSQL đảm bảo:
- **Tính toàn vẹn ACID:** Đảm bảo không bao giờ xảy ra tình trạng mất dữ liệu hay lỗi đồng bộ giao dịch.
- **Ràng buộc khóa ngoại (Foreign Keys):** Không thể xóa một User nếu không xử lý các bài viết liên quan theo đúng quy tắc Cascade.
- **Hỗ trợ JSONB:** Bạn thậm chí có thể lưu trữ và truy vấn dữ liệu JSON siêu nhanh ngay bên trong PostgreSQL mà không cần đến MongoDB!

![An toàn dữ liệu tuyệt đối với PostgreSQL](https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000&auto=format&fit=crop)

## 3. Sức mạnh gấp bội khi kết hợp với Prisma ORM

Khi sử dụng PostgreSQL cùng Prisma ORM trên Next.js, bạn có được trải nghiệm viết câu truy vấn Joins phức tạp một cách dễ dàng:

\`\`\`ts
const postWithComments = await prisma.post.findUnique({
  where: { id: 1 },
  include: {
    author: true,
    comments: {
      include: { user: true },
      orderBy: { createdAt: "desc" },
    },
  },
});
\`\`\`

![Tối ưu hóa hiệu suất cơ sở dữ liệu](https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop)

Hãy chọn công cụ đúng cho bài toán của bạn. Với các ứng dụng web hiện đại, PostgreSQL kết hợp Prisma chính là tiêu chuẩn vàng!`
      },
      {
        title: 'Docker & Kubernetes: Bí kíp đóng gói và triển khai Microservices trên Cloud',
        author: 'Kevin Nguyen',
        tags: 'docker, kubernetes, devops, cloud',
        likes: 95,
        imageUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1000&auto=format&fit=crop',
        content: `Trong kỷ nguyên Cloud Native hiện nay, việc phát triển ứng dụng không chỉ dừng lại ở viêt code chạy tốt trên máy cá nhân mà còn phải đảm bảo chạy ổn định trên mọi môi trường máy chủ. **Docker** và **Kubernetes** chính là hai công cụ sống còn giúp lập trình viên giải quyết bài toán này.

![Hệ sinh thái Docker](https://images.unsplash.com/photo-1618401471353-b98aedd04e11?q=80&w=1000&auto=format&fit=crop)

## 1. Docker là gì và tại sao chúng ta cần nó?

Trước đây, câu nói kinh điển của lập trình viên khi code bị lỗi trên server là: *"Nhưng nó chạy bình thường trên máy của em mà!"*. Sự khác biệt về hệ điều hành, phiên bản Node.js hay thư viện hệ thống gây ra vô số lỗi khó chịu.

Docker đóng gói ứng dụng cùng toàn bộ phụ thuộc của nó vào các **Container** độc lập. Một khi ứng dụng đã chạy được trong Container trên laptop của bạn, nó chắc chắn sẽ chạy chính xác như vậy trên máy chủ AWS, Google Cloud hay Azure!

![Đóng gói container chuyên nghiệp](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop)

## 2. Kubernetes (K8s) - Nhạc trưởng điều phối Container

Khi hệ thống của bạn mở rộng lên hàng trăm, hàng nghìn Container, việc tự quản lý bằng tay là bất khả thi. Kubernetes ra đời như một vị nhạc trưởng thông minh:
- **Tự động phục hồi (Self-healing):** Nếu một container bị sập, K8s sẽ tự động khởi động container mới thay thế trong tích tắc.
- **Tự động mở rộng (Auto-scaling):** Khi lượng truy cập tăng đột biến, hệ thống tự tăng số lượng container để chịu tải.
- **Cập nhật không gián đoạn (Rolling update):** Nâng cấp phiên bản phần mềm mới mà người dùng không hề nhận ra sự bất tiện nào.

![Quản lý cụm Kubernetes](https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop)

## 3. Lời khuyên khi bắt đầu với DevOps

Đừng cố gắng học tất cả cùng một lúc! Hãy bắt đầu từ việc viết file \`Dockerfile\` cho một ứng dụng Node.js nhỏ, sau đó tập dùng \`docker-compose\` để chạy chung với Database, và cuối cùng mới khám phá thế giới rộng lớn của Kubernetes.`
      },
      {
        title: 'TypeScript 5.x: Những tính năng đột phá giúp viết code an toàn tuyệt đối',
        author: 'Elena Tran',
        tags: 'typescript, javascript, frontend, backend',
        likes: 142,
        imageUrl: 'https://images.unsplash.com/photo-1516116218213-31f827f8a7fe?q=80&w=1000&auto=format&fit=crop',
        content: `**TypeScript** đã trở thành tiêu chuẩn không thể thiếu trong phát triển phần mềm quy mô lớn. Với các phiên bản 5.x mới nhất, Microsoft tiếp tục mang đến những cải tiến mạnh mẽ về hiệu năng trình biên dịch (compiler speed) và độ tiện dụng trong cú pháp.

![Trải nghiệm viết code với TypeScript](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop)

## 1. Decorators chuẩn hóa (Standardized Decorators)

Sau nhiều năm ở dạng thử nghiệm (experimental), Decorators trong TypeScript 5 đã được chuẩn hóa theo đúng đặc tả của ECMAScript. Bạn có thể dễ dàng viết các bộ gia cố (wrapper functions) để log dữ liệu, kiểm tra quyền hoặc đo hiệu năng hàm mà không làm bẩn code chính.

## 2. const Type Parameters

Trước đây khi truyền một object hoặc marray vào generic function, TypeScript thường suy luận kiểu dữ liệu ở mức rộng (như \`string\` thay vì \`"hello"\`). Với từ khóa \`const\` trước type parameter, bạn nhận được tính năng suy luận siêu chi tiết (literal types) mà không cần phải gọi \`as const\` thủ công ở phía client.

![Tối ưu hóa kiểu dữ liệu](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop)

## 3. Tốc độ dịch siêu tốc

Nhờ việc viết lại các mô-đun cốt lõi và tối ưu bộ nhớ, TypeScript 5.x giảm thời gian build dự án xuống đáng kể, giúp trải nghiệm Hot Module Replacement (HMR) trong các framework như Next.js hay Vite trở nên mượt mà hơn bao giờ hết!`
      },
      {
        title: 'Trí tuệ nhân tạo (AI & LLM) trong Lập trình: Trợ lý 10x hay kẻ thay thế?',
        author: 'Admin',
        tags: 'ai, llm, chatgpt, programming',
        likes: 310,
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000&auto=format&fit=crop',
        content: `Sự bùng nổ của các mô hình ngôn ngữ lớn (LLM) như **ChatGPT, Claude** và các công cụ hỗ trợ lập trình như **GitHub Copilot, Cursor** đang làm rung chuyển ngành công nghệ phần mềm. Lập trình viên hiện đại cần làm gì để thích nghi?

![AI hỗ trợ lập trình](https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop)

## 1. AI không thay thế lập trình viên, nó thay thế người không dùng AI

AI rất giỏi trong việc tạo ra boilerplate code, viết unit test, dịch mã từ ngôn ngữ này sang ngôn ngữ khác và giải thích các thuật toán phức tạp. Khi tận dụng AI, một lập trình viên có thể làm việc với năng suất của một nhóm 3-5 người trước đây.

![Tương tác giữa người và máy](https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop)

## 2. Tầm quan trọng của tư duy kiến trúc (Architecture Thinking)

AI có thể viết ra một hàm hoàn hảo, nhưng nó không biết hệ thống của bạn cần kiến trúc Microservices hay Monolithic, dùng SQL hay NoSQL cho bài toán nghiệp vụ đặc thù. Do đó, vai trò của lập trình viên chuyển dần từ "người thợ gõ code" sang "kiến trúc sư và người kiểm duyệt".

## 3. Lời khuyên thiết thực

Hãy dùng AI như một người đồng nghiệp Pair-programming: để AI gợi ý giải pháp, nhưng bạn phải là người hiểu rõ từng dòng code trước khi đưa vào môi trường Production!`
      },
      {
        title: 'Tailwind CSS vs Vanilla CSS & CSS Modules: Lựa chọn nào cho năm 2026?',
        author: 'Minh Chau',
        tags: 'css, tailwind, frontend, design',
        likes: 88,
        imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
        content: `Cuộc tranh luận về cách viết CSS chưa bao giờ hạ nhiệt. Trong khi **Tailwind CSS** thống trị với tư duy Utility-first, thì **Vanilla CSS hiện đại** (với CSS Variables, Nesting, Container Queries) đang hồi sinh mạnh mẽ hơn bao giờ hết.

![Thiết kế giao diện hiện đại](https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1000&auto=format&fit=crop)

## 1. Điểm mạnh của Tailwind CSS
- **Tốc độ phát triển thần tốc:** Không cần suy nghĩ đặt tên class (BEM hay gì khác), không cần chuyển qua lại giữa file HTML và CSS.
- **Hệ thống Design Token nhất quán:** Khoảng cách, màu sắc và font chữ được chuẩn hóa theo hệ thống của Tailwind.
- **Dung lượng CSS siêu nhỏ:** Nhờ PurgeCSS (Purge engine), chỉ những class nào thực sự dùng mới được build vào file cuối cùng.

![Viết CSS chuyên nghiệp](https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1000&auto=format&fit=crop)

## 2. Khi Vanilla CSS & CSS Modules tỏa sáng
Với những ứng dụng đòi hỏi tính tùy biến mỹ thuật cực cao như trang blog **DevVibe** của chúng ta, việc viết Vanilla CSS / CSS Modules mang lại sự tự do vô tận:
- Dễ dàng tạo các hiệu ứng **Glassmorphism**, bóng đổ phức tạp và animations tùy chỉnh.
- Mã nguồn HTML sạch sẽ, dễ đọc, không bị ngập lụt bởi hàng chục class dài dằng dặc.

**Kết luận:** Đừng rập khuôn! Sử dụng Tailwind cho các dashboard nhanh chóng, và dùng CSS Modules/Vanilla cho các trang Landing Page đậm chất nghệ thuật!`
      },
      {
        title: 'Git & GitHub Workflows: Quy trình làm việc nhóm chuẩn Kỹ sư phần mềm',
        author: 'Kevin Nguyen',
        tags: 'git, github, teamwork, workflow',
        likes: 76,
        imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?q=80&w=1000&auto=format&fit=crop',
        content: `Biết dùng git để add, commit và push là chưa đủ! Khi làm việc trong các dự án hàng chục thành viên, việc tuân thủ một quy trình quản lý nhánh (Branching Workflow) là yếu tố quyết định sự thành bại của dự án.

![Quy trình làm việc nhóm](https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop)

## 1. Trunk-based Development vs Gitflow

- **Gitflow:** Tách bạch rõ ràng các nhánh \`main\`, \`develop\`, \`feature\`, \`release\`, \`hotfix\`. Phù hợp cho các phần mềm đóng gói theo phiên bản (Versioning) nhưng có nhược điểm là tốc độ ra mắt chậm.
- **Trunk-based Development:** Tất cả lập trình viên merge code liên tục hàng ngày vào một nhánh chính (\`main\`). Phù hợp cho các mô hình CI/CD và các công ty công nghệ nhịp độ nhanh như Google, Meta.

![Hợp tác trên GitHub](https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop)

## 2. Viết Commit Message có tâm
Hãy sử dụng chuẩn **Conventional Commits**:
- \`feat: Thêm tính năng nút Thích bài viết\`
- \`fix: Sửa lỗi trượt vị trí cuộn trang trong Next.js\`
- \`docs: Cập nhật tài liệu hướng dẫn cài đặt\`

Một lịch sử commit rõ ràng chính là tấm gương phản chiếu tính chuyên nghiệp của lập trình viên!`
      },
      {
        title: 'Web Performance Optimization: Bí quyết đạt điểm tuyệt đối 100/100 Lighthouse',
        author: 'Elena Tran',
        tags: 'performance, optimization, nextjs, lighthouse',
        likes: 215,
        imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop',
        content: `Một trang web tải chậm 1 giây có thể làm giảm 20% doanh thu bán hàng! Tối ưu hóa hiệu năng không phải là việc làm cuối cùng khi dự án xong, mà phải là tư duy trong từng dòng code.

![Kiểm tra hiệu năng Web](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop)

## 1. Chỉ số Core Web Vitals (CWV)
Google đánh giá chất lượng trang web dựa trên 3 chỉ số vàng:
- **LCP (Largest Contentful Paint):** Thời gian tải phần nội dung lớn nhất (dưới 2.5s là tốt).
- **INP (Interaction to Next Paint):** Độ trễ phản hồi khi người dùng bấm nút hoặc tương tác.
- **CLS (Cumulative Layout Shift):** Độ dịch chuyển giao diện bất ngờ (dưới 0.1 là chuẩn).

![Tối ưu hóa hình ảnh](https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1000&auto=format&fit=crop)

## 2. Các kỹ thuật tối ưu cốt lõi
- **Tối ưu hình ảnh:** Sử dụng định dạng hiện đại như WebP, AVIF và định rõ \`width\`, \`height\` hoặc \`aspect-ratio\` để chống lỗi CLS.
- **Lazy Loading:** Chỉ tải hình ảnh và component nằm trong tầm mắt người dùng (Viewport).
- **Tối ưu Font chữ:** Dùng \`next/font\` để tự động lưu trữ font local, loại bỏ hiện tượng nháy chữ (FOUT/FOIT).`
      },
      {
        title: 'Bảo mật Web ứng dụng: Phòng chống OWASP Top 10 và bảo vệ người dùng',
        author: 'Admin',
        tags: 'security, owasp, web, hack',
        likes: 180,
        imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop',
        content: `An toàn thông tin trong lập trình Web là lằn ranh sống còn giữa một ứng dụng uy tín và một thảm họa rò rỉ dữ liệu. Hãy cùng điểm qua các nguyên tắc bảo mật quan trọng nhất.

![Bảo mật hệ thống thông tin](https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop)

## 1. Phòng chống XSS (Cross-Site Scripting)
Kẻ tấn công thường chèn mã độc JavaScript vào các ô nhập liệu (như bình luận, tìm kiếm). Khi người dùng khác đọc bài, mã độc sẽ tự động chạy và đánh cắp Cookie phiên làm việc!
- **Giải pháp:** Luôn sử dụng \`HttpOnly\` cho Cookie xác thực (như cách chúng ta làm với \`user_session\` trong DevVibe), và không bao giờ dùng \`dangerouslySetInnerHTML\` khi hiển thị dữ liệu từ người dùng.

![Phòng chống mã độc](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop)

## 2. Phòng chống CSRF (Cross-Site Request Forgery)
Đảm bảo tất cả các API thay đổi dữ liệu (POST, PUT, DELETE) đều kiểm tra kỹ chữ ký HMAC, Session Cookie và Header xác thực hợp lệ trước khi cho phép thực thi!`
      },
      {
        title: 'GraphQL vs REST API: Khi nào nên chọn kiến trúc nào cho hệ thống?',
        author: 'Minh Chau',
        tags: 'graphql, rest, api, backend',
        likes: 112,
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
        content: `Thiết kế API là xương sống của mọi ứng dụng. Nên trung thành với **REST API** quen thuộc hay chuyển mình sang sự uyển chuyển của **GraphQL**?

![Kết nối dữ liệu API](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop)

## 1. REST API - Sự tin cậy qua năm tháng
- **Ưu điểm:** Tận dụng tối đa bộ nhớ đệm (HTTP Caching), chuẩn hóa theo các phương thức HTTP rõ ràng (GET, POST, PUT, DELETE), rất dễ học và tích hợp.
- **Nhược điểm:** Dễ gặp tình trạng thừa dữ liệu (Over-fetching) hoặc thiếu dữ liệu phải gọi nhiều request (Under-fetching).

![Kiến trúc dữ liệu hiện đại](https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop)

## 2. GraphQL - Quyền lực thuộc về Client
- **Ưu điểm:** Client cần trường dữ liệu nào thì yêu cầu chính xác trường đó, giảm thiểu tối đa băng thông. Gom nhóm nhiều nguồn dữ liệu chỉ trong 1 endpoint duy nhất.
- **Nhược điểm:** Khó caching ở tầng HTTP hơn, cần bảo vệ kỹ trước các câu truy vấn lồng nhau quá sâu (Query Depth Limiting).`
      },
      {
        title: 'Kiến trúc Micro-Frontends: Chia nhỏ ứng dụng Frontend khổng lồ',
        author: 'Kevin Nguyen',
        tags: 'microfrontends, react, architecture, frontend',
        likes: 64,
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop',
        content: `Khi một dự án Frontend lớn dần lên với sự tham gia của 50 - 100 lập trình viên, việc build và test trên một repository duy nhất (Monolith Frontend) trở thành cơn ác mộng. Đó là lúc **Micro-Frontends** phát huy sức mạnh.

![Chia nhỏ ứng dụng frontend](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop)

## 1. Ý tưởng cốt lõi
Tương tự như Microservices ở Backend, Micro-Frontends chia nhỏ giao diện người dùng thành các ứng dụng nhỏ độc lập. Ví dụ:
- Nhóm A chịu trách nhiệm làm Header và Navigation.
- Nhóm B chịu trách nhiệm làm trang Danh sách bài viết.
- Nhóm C chịu trách nhiệm làm trang Thanh toán.

![Hợp nhất các module](https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop)

## 2. Công cụ hỗ trợ
Với sự hỗ trợ của **Module Federation** trong Webpack 5 hoặc Rspack, việc ghép nối các ứng dụng React/Vue độc lập lại với nhau tại thời gian thực (Runtime) trở nên cực kỳ liền mạch!`
      },
      {
        title: 'Zustand vs Redux Toolkit vs TanStack Query: Quản lý State trong React 19',
        author: 'Elena Tran',
        tags: 'react, zustand, redux, state',
        likes: 198,
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
        content: `Trong những năm gần đây, tư duy quản lý trạng thái (State Management) trong React đã thay đổi hoàn toàn. Chúng ta không còn nhét mọi thứ vào Redux như trước đây nữa.

![Quản lý dữ liệu React](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop)

## 1. Tách biệt Server State và Client State
- **Server State (Dữ liệu từ API):** Hãy để **TanStack Query (React Query)** hoặc **SWR** lo! Các thư viện này tự động quản lý caching, background refetching và đồng bộ dữ liệu siêu mượt mà.
- **Client State (Trạng thái giao diện local):** Với các state như đóng/mở sidebar, chế độ Dark Mode, **Zustand** đã trở thành ngôi sao mới nhờ cú pháp siêu gọn nhẹ, không cần boilerplate Provider cồng kềnh như Redux.

![Viết code gọn gàng hiệu quả](https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop)

Sự kết hợp giữa Server Components trong Next.js và Zustand cho client-side interactivity chính là công thức hoàn hảo nhất hiện nay!`
      }
    ]
  });
  console.log('Đã nạp thành công các bài blog với nội dung chuyên sâu và 5 hình ảnh/bài!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
