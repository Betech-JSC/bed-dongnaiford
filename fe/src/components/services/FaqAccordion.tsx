"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

const defaultFaqs: FaqItem[] = [
  {
    question: "Điều gì tạo nên sự nổi bật thương hiệu Dongnaiford?",
    answer: "Showroom được đầu tư khá quy mô về trang thiết bị hiện đại, cơ sở hạ tầng khang trang, rộng rãi, đội ngũ kỹ thuật viên đông đảo, tay nghề cao, nhiệt tình, nhiều năm kinh nghiệm, được đào tạo chuyên nghiệp."
  },
  {
    question: "Sự sáng tạo trong thiết kế sản phẩm",
    answer: "Sản phẩm Ford luôn mang tính đột phá, thiết kế hiện đại, thông minh, tích hợp các công nghệ an toàn tiên tiến nhất."
  },
  {
    question: "Chất lượng dịch vụ khách hàng xuất sắc",
    answer: "Đội ngũ chăm sóc khách hàng của chúng tôi hoạt động 24/7, luôn lắng nghe và giải quyết kịp thời mọi thắc mắc của quý khách."
  },
  {
    question: "Cam kết bảo vệ môi trường",
    answer: "Ford cam kết phát triển các dòng xe thân thiện với môi trường, sử dụng các vật liệu tái chế và công nghệ động cơ tiết kiệm nhiên liệu."
  },
  {
    question: "Chiến lược marketing hiệu quả",
    answer: "Chúng tôi tập trung vào việc đem lại giá trị thực tế cho khách hàng, minh bạch về thông tin và chính sách giá trị dịch vụ."
  },
  {
    question: "Đội ngũ nhân viên chuyên nghiệp và tận tâm",
    answer: "Kỹ thuật viên được đào tạo và cấp chứng chỉ từ Ford Việt Nam, sẵn sàng đáp ứng mọi yêu cầu bảo dưỡng kỹ thuật cao với sự tận tụy lớn nhất."
  }
];

export default function FaqAccordion({ faqs = defaultFaqs }: { faqs?: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-white py-16 px-4 md:px-8">
      <div className="max-w-[1152px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Side Title */}
        <div className="lg:col-span-1">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 tracking-tight leading-tight">
            Các câu hỏi <span className="text-[#0562d2]">thường gặp</span>
          </h2>
        </div>

        {/* Right Side Accordion Grid */}
        <div className="lg:col-span-2 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`relative overflow-hidden border transition-all duration-300 bg-white rounded-xl group ${isOpen
                  ? "border-[#00095B] shadow-md -translate-y-0.5"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm hover:-translate-y-0.5"
                }`}
              >
                {/* Header/Question Trigger */}
                <button
                  onClick={() => toggle(index)}
                  className={`w-full flex items-center justify-between text-left px-6 py-5 transition-all duration-300 cursor-pointer select-none gap-4 ${isOpen
                    ? "bg-[#00095B] text-white"
                    : "bg-white text-gray-800 hover:bg-gray-50/50"
                  }`}
                >
                  <span className="text-base md:text-lg font-bold tracking-tight leading-snug pr-4">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-white flex-shrink-0 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#00095B] flex-shrink-0 transition-transform duration-300" />
                  )}
                </button>

                {/* Content Panel with smooth transition */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 py-5 text-sm text-gray-600 leading-relaxed font-normal bg-white border-t border-gray-100">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
