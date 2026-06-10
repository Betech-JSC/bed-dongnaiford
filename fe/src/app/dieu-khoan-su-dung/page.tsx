import Link from "next/link";
import { ShieldCheck, BookOpen, UserCheck, AlertTriangle, RefreshCw, Scale } from "lucide-react";

export const metadata = {
  title: "Điều khoản và Điều kiện | Đồng Nai Ford",
  description: "Quy định và điều khoản sử dụng website chính thức của Đồng Nai Ford. Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ.",
};

const sections = [
  {
    id: "general-terms",
    title: "1. Quy định chung",
    icon: BookOpen,
    content: (
      <>
        <p className="mb-4 text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Chào mừng quý khách đến với website chính thức của <strong>Đồng Nai Ford</strong> (địa chỉ tại Số B04, Khu thương mại Amata, Phường Long Bình, Thành Phố Biên Hòa, Đồng Nai). Khi quý khách truy cập và sử dụng trang web này, đồng nghĩa với việc quý khách đã đồng ý tuân thủ các điều khoản và điều kiện dưới đây.
        </p>
        <p className="text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Đồng Nai Ford có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Điều khoản sử dụng này vào bất kỳ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website mà không cần thông báo trước. Việc quý khách tiếp tục sử dụng website sau khi có các thay đổi đồng nghĩa với việc đồng ý với những thay đổi đó.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "2. Quyền sở hữu trí tuệ",
    icon: ShieldCheck,
    content: (
      <>
        <p className="mb-4 text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Tất cả nội dung hiển thị trên website bao gồm nhưng không giới hạn ở: logo, nhãn hiệu thương mại, hình ảnh xe, video, thông số kỹ thuật, bài viết, mã nguồn, thiết kế đồ họa đều thuộc quyền sở hữu trí tuệ của <strong>Đồng Nai Ford</strong> hoặc được cấp phép hợp pháp bởi <strong>Ford Việt Nam</strong>.
        </p>
        <p className="text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Nghiêm cấm mọi hành vi sao chép, phân phối, xuất bản, tải lên, đăng tải hoặc khai thác thương mại bất kỳ nội dung nào từ website này mà không có sự đồng ý trước bằng văn bản của ban quản trị Đồng Nai Ford.
        </p>
      </>
    ),
  },
  {
    id: "user-behavior",
    title: "3. Quy định sử dụng website",
    icon: UserCheck,
    content: (
      <>
        <p className="mb-4 text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Khi sử dụng website của chúng tôi, quý khách cam kết:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2 font-['Ford_Antenna',sans-serif]">
          <li>Không sử dụng website vào mục đích vi phạm pháp luật Việt Nam hoặc gây cản trở hoạt động của hệ thống mạng.</li>
          <li>Không gửi hoặc truyền tải các tài liệu chứa virus máy tính, mã độc hoặc phần mềm gây hại cho website và người sử dụng khác.</li>
          <li>Cung cấp thông tin chính xác, đầy đủ khi đăng ký lái thử, yêu cầu báo giá hoặc gửi yêu cầu liên hệ dịch vụ.</li>
          <li>Không mạo danh cá nhân hoặc tổ chức khác để thực hiện các giao dịch hoặc gửi thông tin sai sự thật.</li>
        </ul>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: "4. Tuyên bố miễn trừ trách nhiệm",
    icon: AlertTriangle,
    content: (
      <>
        <p className="mb-4 text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          <strong>Đồng Nai Ford</strong> luôn nỗ lực đảm bảo thông tin về các dòng xe (Ranger, Everest, Territory, Transit, Mustang...), giá bán, chương trình khuyến mãi và phụ kiện trên website được chính xác nhất tại thời điểm đăng tải.
        </p>
        <p className="mb-4 text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Tuy nhiên, thông số kỹ thuật thực tế của xe hoặc giá bán thực tế tại showroom có thể thay đổi tùy theo quy định của nhà sản xuất Ford Việt Nam hoặc tùy thuộc vào thời điểm giao dịch thực tế. Các hình ảnh hiển thị có thể bao gồm những trang bị tùy chọn không đi kèm phiên bản tiêu chuẩn.
        </p>
        <p className="text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Vì vậy, quý khách vui lòng liên hệ trực tiếp Hotline Kinh doanh <strong>0918 90 90 60</strong> hoặc đến Showroom để nhận báo giá chi tiết, thông số kỹ thuật chuẩn xác và các điều khoản hợp đồng chính thức.
        </p>
      </>
    ),
  },
  {
    id: "term-changes",
    title: "5. Thay đổi điều khoản",
    icon: RefreshCw,
    content: (
      <>
        <p className="text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Chúng tôi có quyền sửa đổi các điều khoản này theo thời điểm để phản ánh sự thay đổi trong chính sách dịch vụ của đại lý hoặc các quy định pháp luật hiện hành. Ngày cập nhật cuối cùng sẽ được ghi nhận rõ ràng ở phần đầu trang của tài liệu.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "6. Luật áp dụng và giải quyết tranh chấp",
    icon: Scale,
    content: (
      <>
        <p className="text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Các điều khoản sử dụng này được điều chỉnh và giải thích theo các quy định của pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp phát sinh liên quan đến việc sử dụng website này sẽ được giải quyết thông qua thương lượng hòa giải, hoặc đưa ra Tòa án có thẩm quyền tại tỉnh Đồng Nai để giải quyết nếu không đạt được sự đồng thuận chung.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a]">
      {/* Banner Header */}
      <section className="bg-[#00095B] text-white py-16 px-4">
        <div className="max-w-[1152px] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0562D2] bg-[#0562D2]/10 px-4 py-1.5 rounded-full">
            Chính sách & Quy định
          </span>
          <h1 className="font-['Ford_Antenna',sans-serif] font-bold text-[36px] md:text-[48px] tracking-tight uppercase mt-4 mb-2 leading-tight">
            Điều khoản và Điều kiện
          </h1>
          <p className="text-sm text-white/70 max-w-[600px] mx-auto font-['Ford_Antenna',sans-serif] font-normal">
            Áp dụng cho khách hàng sử dụng dịch vụ và truy cập website Dongnaiford.com.vn. Cập nhật mới nhất: Ngày 02 tháng 06 năm 2026.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-[1152px] mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-[280px] lg:sticky lg:top-[120px] bg-white border border-gray-200/80 rounded-xl p-5 shadow-xs shrink-0">
            <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-sm uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Mục lục nội dung
            </h3>
            <nav className="flex flex-col gap-1">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-gray-600 hover:text-[#0562d2] hover:bg-gray-50 py-2.5 px-3 rounded-md transition-all duration-200 block"
                >
                  {sec.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Detailed Content */}
          <div className="flex-1 space-y-12">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="bg-white border border-gray-250/60 rounded-2xl p-6 md:p-8 shadow-xs scroll-mt-28"
                >
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-[#0562d2]/10 text-[#0562d2] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="font-['Ford_Antenna',sans-serif] font-bold text-xl md:text-2xl text-[#00095B] leading-tight">
                      {sec.title}
                    </h2>
                  </div>
                  <div className="leading-relaxed text-sm md:text-base text-gray-700">
                    {sec.content}
                  </div>
                </section>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}
