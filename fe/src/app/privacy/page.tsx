import Link from "next/link";
import { Info, Target, CalendarRange, Lock, UserCheck, Shield } from "lucide-react";

export const metadata = {
  title: "Chính sách Bảo mật | Đồng Nai Ford",
  description: "Chính sách bảo mật thông tin khách hàng của Đồng Nai Ford. Cam kết bảo vệ thông tin cá nhân của khách hàng khi đăng ký lái thử, đặt hẹn bảo dưỡng.",
};

const sections = [
  {
    id: "info-collection",
    title: "1. Mục đích thu thập thông tin",
    icon: Info,
    content: (
      <>
        <p className="mb-4 text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Để hỗ trợ quý khách hàng tốt nhất trong quá trình mua xe và sử dụng dịch vụ bảo dưỡng, <strong>Đồng Nai Ford</strong> tiến hành thu thập một số thông tin cá nhân cơ bản khi quý khách đăng ký thông tin qua website bao gồm:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2 font-['Ford_Antenna',sans-serif]">
          <li>Họ và tên khách hàng</li>
          <li>Số điện thoại liên hệ</li>
          <li>Địa chỉ Email (nếu có)</li>
          <li>Dòng xe khách hàng quan tâm (Ranger, Everest, Territory...)</li>
          <li>Yêu cầu chi tiết (đăng ký lái thử, nhận báo giá, đặt hẹn dịch vụ hoặc tư vấn trả góp)</li>
        </ul>
        <p className="text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Các thông tin này giúp chúng tôi phân loại đúng nhu cầu và liên hệ phản hồi kịp thời trong vòng 15 phút sau khi nhận được yêu cầu.
        </p>
      </>
    ),
  },
  {
    id: "info-usage",
    title: "2. Phạm vi sử dụng thông tin",
    icon: Target,
    content: (
      <>
        <p className="mb-4 text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Chúng tôi cam kết chỉ sử dụng thông tin cá nhân thu thập được của quý khách hàng trong nội bộ đại lý Đồng Nai Ford cho các mục đích sau:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2 font-['Ford_Antenna',sans-serif]">
          <li>Liên hệ trực tiếp để tư vấn giá xe, chiết khấu và các chương trình khuyến mãi đang áp dụng.</li>
          <li>Xác nhận lịch đăng ký lái thử xe hoặc đặt lịch hẹn đưa xe vào xưởng dịch vụ bảo dưỡng/sửa chữa.</li>
          <li>Gửi các email/tin nhắn thông báo định kỳ về việc bảo dưỡng định kỳ xe, các chương trình chăm sóc khách hàng đặc biệt của đại lý.</li>
          <li>Cung cấp dữ liệu đăng ký dịch vụ bảo hiểm hoặc thủ tục đăng ký xe cho cơ quan liên quan khi hoàn tất thủ tục mua bán.</li>
        </ul>
      </>
    ),
  },
  {
    id: "storage-time",
    title: "3. Thời gian lưu trữ thông tin",
    icon: CalendarRange,
    content: (
      <>
        <p className="text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Dữ liệu cá nhân của quý khách hàng sẽ được hệ thống CRM lưu trữ bảo mật trong suốt quá trình hoạt động của đại lý Đồng Nai Ford phục vụ việc chăm sóc và theo dõi lịch sử bảo dưỡng xe định kỳ của khách hàng, hoặc cho đến khi có yêu cầu hủy bỏ chính thức từ chính khách hàng.
        </p>
      </>
    ),
  },
  {
    id: "security-commitment",
    title: "4. Cam kết bảo mật thông tin",
    icon: Lock,
    content: (
      <>
        <p className="mb-4 text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Sự riêng tư của quý khách hàng là ưu tiên hàng đầu của chúng tôi. <strong>Đồng Nai Ford</strong> cam kết:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2 font-['Ford_Antenna',sans-serif]">
          <li>Tuyệt đối không bán, trao đổi hoặc chia sẻ thông tin cá nhân của quý khách cho bất kỳ bên thứ ba nào vì mục đích thương mại ngoài phạm vi dịch vụ.</li>
          <li>Thông tin có thể được chia sẻ giới hạn với <strong>Ford Việt Nam</strong> (hãng xe chủ quản) nhằm phục vụ công tác giám sát chất lượng chăm sóc khách hàng và bảo hành xe tiêu chuẩn toàn cầu.</li>
          <li>Áp dụng các công nghệ bảo mật tiên tiến (mã hóa dữ liệu, tường lửa hệ thống) để bảo vệ dữ liệu tránh bị truy cập trái phép hoặc rò rỉ thông tin.</li>
        </ul>
      </>
    ),
  },
  {
    id: "user-rights",
    title: "5. Quyền lợi của khách hàng",
    icon: UserCheck,
    content: (
      <>
        <p className="mb-4 text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Quý khách hàng hoàn toàn có các quyền sau đối với thông tin cá nhân của mình:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2 font-['Ford_Antenna',sans-serif]">
          <li>Yêu cầu nhân viên bán hàng kiểm tra, cập nhật hoặc đính chính thông tin cá nhân khi có thay đổi.</li>
          <li>Yêu cầu ngừng nhận các thông tin quảng cáo, khuyến mãi từ đại lý qua SMS/Email bất cứ lúc nào.</li>
          <li>Yêu cầu xóa bỏ hoàn toàn dữ liệu thông tin cá nhân khỏi hệ thống dữ liệu khách hàng của đại lý bằng cách gửi văn bản hoặc gọi điện trực tiếp tới số Hotline hỗ trợ.</li>
        </ul>
      </>
    ),
  },
  {
    id: "collection-unit",
    title: "6. Đơn vị quản lý và thông tin liên hệ",
    icon: Shield,
    content: (
      <>
        <p className="mb-4 text-gray-700 leading-relaxed font-['Ford_Antenna',sans-serif]">
          Mọi thắc mắc, khiếu nại hoặc yêu cầu liên quan đến chính sách bảo mật dữ liệu, quý khách hàng vui lòng liên hệ trực tiếp với chúng tôi theo thông tin sau:
        </p>
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200/80 font-['Ford_Antenna',sans-serif] space-y-2.5 text-sm">
          <p><strong>CÔNG TY TNHH DỊCH VỤ – THƯƠNG MẠI TẤN PHÁT ĐẠT (ĐỒNG NAI FORD)</strong></p>
          <p>• Địa chỉ: Số B04, Khu thương mại Amata, Khu phố 29, Phường Long Bình, Thành Phố Biên Hòa, Đồng Nai.</p>
          <p>• Hotline hỗ trợ chăm sóc khách hàng: <strong>1800 55 68 58</strong></p>
          <p>• Email liên hệ: <strong>marketing@dongnaiford.com.vn</strong></p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a]">
      {/* Banner Header */}
      <section className="bg-[#00095B] text-white py-16 px-4">
        <div className="max-w-[1152px] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0562D2] bg-[#0562D2]/10 px-4 py-1.5 rounded-full">
            Chính sách bảo mật
          </span>
          <h1 className="font-['Ford_Antenna',sans-serif] font-bold text-[36px] md:text-[48px] tracking-tight uppercase mt-4 mb-2 leading-tight">
            Chính sách bảo mật thông tin
          </h1>
          <p className="text-sm text-white/70 max-w-[600px] mx-auto font-['Ford_Antenna',sans-serif] font-normal">
            Cam kết bảo vệ dữ liệu cá nhân của quý khách hàng khi truy cập và đăng ký dịch vụ tại Dongnaiford.com.vn. Cập nhật mới nhất: Ngày 02 tháng 06 năm 2026.
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
