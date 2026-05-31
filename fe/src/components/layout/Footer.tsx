import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#00095b] text-white pt-[40px] pb-[20px] px-4 lg:px-[144px] border-t border-[#00095b] mt-auto">
      {/* Upper Grid Area */}
      <div className="max-w-[1152px] mx-auto flex flex-col lg:flex-row gap-12 justify-between items-start mb-12">
        
        {/* Column 1: Company Profile Info */}
        <div className="space-y-4 lg:w-[383px]">
          <h3 className="text-[22px] font-semibold tracking-tight text-white uppercase font-display leading-[1.3]">
            CÔNG TY TNHH DỊCH VỤ – THƯƠNG MẠI TẤN PHÁT ĐẠT
          </h3>
          <div className="text-xs text-white/80 space-y-2 font-normal">
            <p>
              <strong className="text-white font-bold">Mã số thuế:</strong> 3600843328
            </p>
            <p>
              <strong className="text-white font-bold">Địa chỉ:</strong> Số B04, Khu thương mại Amata, Khu phố 29, Phường Long Bình, Thành Phố Đồng Nai
            </p>
            <p>
              <strong className="text-white font-bold">Hotline KD:</strong> 0918 90 90 60
            </p>
            <p>
              <strong className="text-white font-bold">Hotline Dv:</strong> 1800 55 68 58
            </p>
            <p>
              <strong className="text-white font-bold">ĐT:</strong> (0251) 3857 130 – (0251) 3857 131
            </p>
            <p>
              <strong className="text-white font-bold">Email:</strong> marketing@dongnaiford.com.vn
            </p>
            <p>
              <strong className="text-white font-bold">Website:</strong> dongnaiford.com.vn
            </p>
          </div>
        </div>

        {/* Right Area columns */}
        <div className="flex-1 flex flex-col md:flex-row gap-16 justify-between w-full lg:max-w-[650px]">
          
          {/* Sub-column 1: Dòng xe & Dịch vụ */}
          <div className="space-y-8 flex-1">
            {/* CÁC DÒNG XE */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold tracking-wider text-white uppercase font-display border-b border-white/10 pb-2">
                CÁC DÒNG XE
              </h4>
              <ul className="space-y-2.5 text-xs text-white/70">
                <li>
                  <Link href="/#showroom" className="hover:text-[#0562d2] transition-colors block">
                    Xe SUV
                  </Link>
                </li>
                <li>
                  <Link href="/#showroom" className="hover:text-[#0562d2] transition-colors block">
                    Xe Thương Mại
                  </Link>
                </li>
                <li>
                  <Link href="/#showroom" className="hover:text-[#0562d2] transition-colors block">
                    Xe Bán Chạy
                  </Link>
                </li>
              </ul>
            </div>

            {/* DỊCH VỤ & BẢO DƯỠNG */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold tracking-wider text-white uppercase font-display border-b border-white/10 pb-2">
                DỊCH VỤ & BẢO DƯỠNG
              </h4>
              <ul className="space-y-2.5 text-xs text-white/70">
                <li>
                  <Link href="/services/customer-care" className="hover:text-[#0562d2] transition-colors block">
                    Chăm sóc khách hàng
                  </Link>
                </li>
                <li>
                  <Link href="/services/express-maintenance" className="hover:text-[#0562d2] transition-colors block">
                    Bảo dưỡng nhanh
                  </Link>
                </li>
                <li>
                  <Link href="/services/periodic-maintenance" className="hover:text-[#0562d2] transition-colors block">
                    Bảo dưỡng định kỳ
                  </Link>
                </li>
                <li>
                  <Link href="/services/pickup-delivery" className="hover:text-[#0562d2] transition-colors block">
                    Nhận & Giao xe tận nơi
                  </Link>
                </li>
                <li>
                  <Link href="/accessories" className="hover:text-[#0562d2] transition-colors block">
                    Phụ kiện & Phụ tùng chính hãng
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Sub-column 2: Facebook Widget & Ford Đồng Nai Links */}
          <div className="space-y-8 flex-1">
            
            {/* Facebook Widget */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#0562d2] text-white font-bold p-2 rounded-md w-10 h-10 flex items-center justify-center text-sm">
                  F
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight text-white">Đồng Nai FORD</p>
                  <p className="text-[11px] text-gray-400">21,050 followers</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href="https://www.facebook.com/FordDongNai.Official"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 px-3 bg-white border border-gray-300 hover:bg-gray-100 transition-colors text-[11px] uppercase font-bold text-center rounded-sm text-[#424242]"
                >
                  Follow us
                </a>
                <a
                  href="https://m.me/FordDongNai.Official"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 px-3 bg-white border border-gray-300 hover:bg-gray-100 transition-colors text-[11px] uppercase font-bold text-center rounded-sm text-[#424242] flex items-center justify-center gap-1"
                >
                  Message
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold tracking-wider text-white uppercase font-display border-b border-white/10 pb-2">
                FORD ĐỒNG NAI
              </h4>
              <ul className="space-y-2.5 text-xs text-white/70">
                <li>
                  <Link href="/about" className="hover:text-[#0562d2] transition-colors block">
                    Giới thiệu công ty
                  </Link>
                </li>
                <li>
                  <Link href="/about#recruitment" className="hover:text-[#0562d2] transition-colors block">
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#0562d2] transition-colors block">
                    Liên hệ
                  </Link>
                </li>
              </ul>

              {/* Social Icons (Zalo, YouTube, Facebook, Web) */}
              <div className="flex gap-3 pt-2">
                {/* Zalo */}
                <a 
                  href="https://zalo.me/0918909060"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0068ff] transition-colors flex items-center justify-center text-xs font-bold text-white"
                  title="Zalo"
                >
                  Z
                </a>
                {/* YouTube */}
                <a 
                  href="https://youtube.com/@dongnaiford"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#ff0000] transition-colors flex items-center justify-center text-xs font-bold text-white"
                  title="YouTube"
                >
                  Y
                </a>
                {/* Facebook */}
                <a 
                  href="https://www.facebook.com/FordDongNai.Official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0562d2] transition-colors flex items-center justify-center text-xs font-bold text-white"
                  title="Facebook"
                >
                  F
                </a>
                {/* Web */}
                <a 
                  href="https://dongnaiford.com.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0562d2] transition-colors flex items-center justify-center text-xs font-bold text-white"
                  title="Website"
                >
                  W
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Copyright Disclosures */}
      <div className="max-w-[1152px] mx-auto border-t border-white/10 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-white/50 gap-4">
          <p>
            Copyright © 2026 Ford Đồng Nai. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white/80 transition-colors">
              Điều khoản và điều kiện
            </Link>
            <Link href="/" className="hover:text-white/80 transition-colors">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
