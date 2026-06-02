export interface ArticleContentBlock {
  type: "paragraph" | "heading" | "image" | "list";
  value: string | string[];
}

export interface Article {
  id: string;
  title: string;
  category: "Xe Ford" | "Khuyến Mãi" | "Tin tức";
  date: string;
  image: string;
  content: string; // Short summary
  body: ArticleContentBlock[];
}

export const articles: Article[] = [
  {
    id: "news-everest",
    title: "Ford Everest Máy Xăng: Sự Thật Ít Ai Biết & Tư Vấn Mua Xe Tại Đồng Nai Ford",
    category: "Xe Ford",
    date: "18 Tháng 5, 2026",
    image: "/assets/car-everest.png",
    content: "Ford Everest luôn là cái tên hot trong phân khúc SUV 7 chỗ tại Việt Nam. Bài viết này sẽ phân tích chi tiết phiên bản máy xăng của Ford Everest thế hệ mới, so sánh hiệu năng, mức tiêu hao nhiên liệu thực tế và đưa ra lời khuyên chọn xe phù hợp nhất cho các gia dịch tại Đồng Nai.",
    body: [
      {
        type: "paragraph",
        value: "Ford Everest thế hệ mới đã gặt hái được những thành công vang dội tại thị trường Việt Nam kể từ khi ra mắt. Tuy nhiên, phần lớn sự chú ý đều đổ dồn vào các phiên bản động cơ Diesel (dầu). Ít ai biết rằng, Ford Everest máy xăng cũng sở hữu những ưu điểm vượt trội riêng biệt, cực kỳ phù hợp với một nhóm đối tượng khách hàng nhất định."
      },
      {
        type: "heading",
        value: "Ưu điểm nổi bật của Ford Everest Động cơ Xăng"
      },
      {
        type: "paragraph",
        value: "Khác với động cơ dầu có tiếng nổ đặc trưng và độ rung nhẹ, động cơ xăng Ecoboost mang lại trải nghiệm vận hành êm ái đến kinh ngạc. Cabin xe hoàn toàn yên tĩnh, giúp các chuyến đi dài cùng gia đình trở nên thư thái hơn rất nhiều. Hơn thế nữa, khả năng tăng tốc tức thời của động cơ xăng giúp xe di chuyển linh hoạt, nhạy bén trong đô thị chật hẹp."
      },
      {
        type: "list",
        value: [
          "Vận hành siêu êm ái, cách âm vượt trội hoàn toàn so với máy dầu.",
          "Mùi khí thải dễ chịu hơn, không gây cảm giác say xe cho người nhạy cảm.",
          "Chi phí bảo dưỡng định kỳ thấp hơn do kết cấu động cơ đơn giản hơn máy dầu.",
          "Khả năng khởi động và làm nóng máy nhanh hơn trong những ngày thời tiết lạnh."
        ]
      },
      {
        type: "image",
        value: "/assets/car-everest.png"
      },
      {
        type: "heading",
        value: "Mức tiêu hao nhiên liệu thực tế tại Đồng Nai"
      },
      {
        type: "paragraph",
        value: "Qua các thử nghiệm thực tế của đội ngũ kỹ thuật Đồng Nai Ford trên cung đường từ TP. Biên Hòa đi Long Khánh, mức tiêu hao nhiên liệu trung bình của Ford Everest máy xăng rơi vào khoảng 8.5L/100km đường trường và khoảng 11L - 12L/100km trong điều kiện đô thị đông đúc. Đây là con số rất hợp lý đối với một mẫu SUV 7 chỗ cỡ lớn và mạnh mẽ."
      },
      {
        type: "paragraph",
        value: "Hãy đến ngay showroom Đồng Nai Ford tại Khu thương mại Amata, Long Bình để trải nghiệm lái thử thực tế cả hai phiên bản máy xăng và máy dầu để có sự lựa chọn phù hợp nhất!"
      }
    ]
  },
  {
    id: "news-promo",
    title: "CHƯƠNG TRÌNH KHUYẾN MÃI TRONG THÁNG 5",
    category: "Khuyến Mãi",
    date: "01 Tháng 5, 2026",
    image: "/images-dynamic/image-hero-2.jpg",
    content: "Đồng Nai Ford triển khai chương trình khuyến mãi cực khủng lớn nhất quý 2/2026: Hỗ trợ lên đến 100% lệ phí trước bạ cho các dòng xe SUV Territory, Ranger XLS, tặng gói bảo dưỡng 2 năm chính hãng và bảo hiểm thân vỏ miễn phí. Áp dụng từ ngày 01/05 đến hết 31/05/2026.",
    body: [
      {
        type: "paragraph",
        value: "Trong tháng 5 này, Quý khách hàng đã biết chăm sóc xe Ford ở đâu chưa? Hãy đến Đồng Nai Ford để bảo dưỡng và sửa chữa để nhận nhiều ưu đãi nhé!"
      },
      {
        type: "paragraph",
        value: "Từ nay đến hết ngày 31/05/2026, khi Quý Khách hàng đưa xe Ford đến chăm sóc, bảo dưỡng tại Đồng Nai Ford sẽ nhận ngay những ưu đãi đặc biệt dưới đây:"
      },
      {
        type: "heading",
        value: "Đồng loạt giảm 10% các dịch vụ kỹ thuật cao:"
      },
      {
        type: "list",
        value: [
          "Vệ sinh buồng đốt bằng khí Hydro, vệ sinh kim phun bằng sóng siêu âm.",
          "Dịch vụ vệ sinh và khử khuẩn dàn lạnh điều hòa bằng thiết bị chuyên dùng.",
          "Cân chỉnh thước lái điện tử 3D bằng hệ thống Hunter hiện đại.",
          "Vệ sinh van tuần hoàn khí thải (EGR) & cổ hút động cơ Diesel.",
          "Vệ sinh và hoàn nguyên bầu lọc khí thải (DPF) động cơ."
        ]
      },
      {
        type: "image",
        value: "/service-support-customer.jpg"
      },
      {
        type: "heading",
        value: "Ưu đãi cộng thêm dành cho khách hàng đặt lịch hẹn trước"
      },
      {
        type: "paragraph",
        value: "Bên cạnh đó, chúng tôi áp dụng thêm các ưu đãi hấp dẫn nhằm tối ưu hóa chi phí cho khách hàng thân thiết:"
      },
      {
        type: "list",
        value: [
          "Giảm ngay 500.000đ cho các dòng xe Ford quay lại làm dịch vụ thay nhớt sau thời gian trên 12 tháng chưa quay lại xưởng.",
          "Tặng gói vệ sinh buồng đốt bằng khí Hydro cho khách hàng mua thêm gói bảo hành mở rộng (Extended Warranty).",
          "Tặng gói xông khử mùi nội thất Ozone cao cấp dành cho Quý Khách hàng đặt lịch hẹn trước ít nhất 24 tiếng.",
          "Giảm 10% chi phí đồng sơn đối với xe không làm bảo hiểm hiểm họa.",
          "Giảm 15% gói dịch vụ chăm sóc và làm đẹp xe toàn diện (Detailing)."
        ]
      },
      {
        type: "heading",
        value: "Hướng dẫn đặt hẹn nhanh chóng"
      },
      {
        type: "paragraph",
        value: "Để không phải chờ đợi và nhận trọn vẹn các phần quà ưu đãi, quý khách hàng có thể đặt hẹn qua các kênh sau:"
      },
      {
        type: "paragraph",
        value: "Cách 1: Liên hệ Hotline dịch vụ: 1800 55 68 58 hoặc số điện thoại bàn đại lý (0251) 3857 130 (vui lòng đặt trước tối thiểu 1 ngày).\nCách 2: Đăng ký đặt lịch trực tuyến ngay tại form bên dưới hoặc truy cập hệ thống đặt hẹn trực tuyến của Ford Việt Nam."
      }
    ]
  },
  {
    id: "news-raptor",
    title: "Ford Ranger Raptor: Đánh Giá Chi Tiết & Báo Giá Mới Nhất Tại Đồng Nai Ford",
    category: "Xe Ford",
    date: "25 Tháng 4, 2026",
    image: "/assets/car-ranger.png",
    content: "Được phát triển bởi Ford Performance, dòng Ranger Raptor sở hữu những nâng cấp vượt trội về hệ thống lái và khung gầm. Cùng Đồng Nai Ford đánh giá chi tiết sức mạnh động cơ Bi-Turbo, 7 chế độ lái thông minh và bảng giá lăn bánh mới nhất.",
    body: [
      {
        type: "paragraph",
        value: "Nếu bạn đang tìm kiếm một chiếc bán tải không chỉ để chở hàng mà còn để thỏa mãn niềm đam mê off-road đỉnh cao, Ford Ranger Raptor chính là câu trả lời duy nhất. Đây là dòng xe bán tải hiệu năng cao được lắp ráp trên dây chuyền đặc biệt của Ford Performance."
      },
      {
        type: "heading",
        value: "Khả năng Off-road tối thượng nhờ hệ thống giảm xóc FOX"
      },
      {
        type: "paragraph",
        value: "Điểm đắt giá nhất trên Ranger Raptor chính là bộ giảm xóc FOX Live Valve 2.5 inch. Hệ thống treo này có khả năng tự động điều chỉnh độ cứng/mềm theo thời gian thực dựa trên địa hình thực tế, giúp xe lướt qua các ổ gà lớn ở tốc độ cao cực kỳ êm ái mà không bị kịch giảm chấn."
      },
      {
        type: "image",
        value: "/assets/car-ranger.png"
      },
      {
        type: "heading",
        value: "Động cơ Bi-Turbo 2.0L mạnh mẽ cùng Hộp số 10 cấp"
      },
      {
        type: "paragraph",
        value: "Trái tim của Ranger Raptor là khối động cơ Diesel Bi-Turbo 2.0L sản sinh công suất tối đa lên đến 210 mã lực và mô-men xoắn cực đại 500 Nm. Sức mạnh này được truyền xuống hệ dẫn động 4 bánh thông qua hộp số tự động 10 cấp, mang đến những bước chuyển số mượt mà và khả năng bám đường tối ưu trên cát, bùn hay đá sỏi."
      },
      {
        type: "paragraph",
        value: "Tại Đồng Nai Ford, Ranger Raptor đang được phân phối chính hãng với mức giá từ 1.299.000.000đ cùng nhiều quà tặng phụ kiện off-road cao cấp độc quyền."
      }
    ]
  },
  {
    id: "news-territory",
    title: "Đánh Giá Xe Ford Territory 2026: Lựa Chọn Cho Gia Đình Việt",
    category: "Xe Ford",
    date: "12 Tháng 4, 2026",
    image: "/assets/territory-hero.png",
    content: "Diện mạo mới đầy cuốn hút, công nghệ ngập tràn và không gian cabin rộng rãi bậc nhất phân khúc. Ford Territory là lựa chọn hoàn hảo cho gia đình trẻ năng động đang tìm kiếm SUV 5 chỗ chất lượng.",
    body: [
      {
        type: "paragraph",
        value: "Ford Territory là một làn gió mới trong phân khúc C-SUV tại Việt Nam. Với thiết kế hiện đại mang hơi hướng tương lai cùng hàng loạt trang bị công nghệ an toàn thông minh, Territory nhanh chóng lọt vào top những chiếc xe bán chạy nhất của Ford."
      },
      {
        type: "heading",
        value: "Không gian nội thất rộng rãi và đầy công nghệ"
      },
      {
        type: "paragraph",
        value: "Bước vào cabin của Territory, bạn sẽ ngay lập tức bị ấn tượng bởi màn hình kép 12 inch trải dài trên bảng táp-lô sang trọng. Ghế ngồi được bọc da cao cấp tích hợp chức năng làm mát ghế. Đặc biệt, khoảng để chân hàng ghế thứ 2 của Territory rộng rãi nhất phân khúc, mang đến sự thoải mái tối đa cho hành khách trong các chuyến hành trình dài."
      },
      {
        type: "image",
        value: "/assets/territory-interior.png"
      },
      {
        type: "heading",
        value: "Hệ thống hỗ trợ lái Co-Pilot 360 thông minh"
      },
      {
        type: "paragraph",
        value: "Ford Territory được trang bị gói công nghệ an toàn chủ động Co-Pilot 360 với hơn 20 tính năng vượt trội: phanh tự động khẩn cấp, cảnh báo điểm mù kết hợp xe cắt ngang, hỗ trợ đỗ xe tự động hoàn toàn chỉ bằng một nút bấm, camera 360 độ độ nét cao. Tất cả mang lại sự an tâm tuyệt đối cho bạn và gia đình khi di chuyển."
      }
    ]
  },
  {
    id: "news-transit",
    title: "Giải pháp vận chuyển hành khách tối ưu cùng Ford Transit 2026",
    category: "Tin tức",
    date: "05 Tháng 4, 2026",
    image: "/assets/car-transit.png",
    content: "Ford Transit Thế hệ Mới được thiết kế tối ưu với không gian rộng rãi hơn, tiện nghi vượt trội cùng độ bền bỉ cao, giúp tối đa hóa hiệu quả kinh doanh của doanh nghiệp vận tải.",
    body: [
      {
        type: "paragraph",
        value: "Đối với các doanh nghiệp kinh doanh dịch vụ vận tải hành khách hoặc du lịch lữ hành, Ford Transit đã trở thành cái tên bảo chứng cho sự tin cậy và bền bỉ trong suốt hàng chục năm qua tại Việt Nam."
      },
      {
        type: "heading",
        value: "Nâng cấp toàn diện thiết kế và trang bị nội thất"
      },
      {
        type: "paragraph",
        value: "Ford Transit thế hệ mới mang lại diện mạo chuyên nghiệp hơn với lưới tản nhiệt lớn mạ chrome sang trọng, đèn LED định vị ban ngày sắc sảo. Nội thất được bố trí 16 chỗ ngồi rộng rãi, khoảng trống trần xe cao hơn giúp hành khách dễ dàng di chuyển. Hệ thống điều hòa 2 dàn lạnh độc lập với các cửa gió tới từng vị trí ghế ngồi đảm bảo không khí luôn mát lạnh."
      },
      {
        type: "heading",
        value: "Động cơ Turbo Diesel 2.2L mạnh mẽ và tiết kiệm"
      },
      {
        type: "paragraph",
        value: "Transit thế hệ mới sử dụng động cơ dầu 2.2L TDCi kết hợp hộp số sàn 6 cấp cho khả năng kéo tải cực tốt trên đèo dốc mà vẫn duy trì mức tiêu hao nhiên liệu cực kỳ tiết kiệm, giúp tối ưu hóa chi phí vận hành cho các doanh nghiệp."
      }
    ]
  },
  {
    id: "news-dsfl",
    title: "Đồng Nai Ford đồng hành cùng chương trình Hướng dẫn Lái xe An toàn (DSFL)",
    category: "Tin tức",
    date: "20 Tháng 3, 2026",
    image: "/service-fixed-car.jpg",
    content: "Chương trình Hướng dẫn Lái xe An toàn và Thân thiện với Môi trường (DSFL) do Ford Việt Nam phối hợp cùng Đồng Nai Ford tổ chức thu hút hơn 200 học viên tham gia tập huấn thực tế.",
    body: [
      {
        type: "paragraph",
        value: "Vừa qua, đại lý Đồng Nai Ford đã phối hợp cùng Ford Việt Nam tổ chức thành công chương trình tập huấn kỹ năng lái xe an toàn 'Driving Skills for Life' (DSFL) tại TP. Biên Hòa, thu hút đông đảo khách hàng và tài xế chuyên nghiệp tham gia."
      },
      {
        type: "heading",
        value: "Trang bị kiến thức và kỹ năng thực tế"
      },
      {
        type: "paragraph",
        value: "Chương trình tập trung huấn luyện các kỹ năng thiết thực như: nhận diện nguy hiểm từ xa, kiểm soát lái trong các tình huống trơn trượt, lái xe tiết kiệm nhiên liệu, nhận biết ảnh hưởng của nồng độ cồn qua kính chuyên dụng, và cách xử lý khi xe gặp sự cố trên đường cao tốc."
      },
      {
        type: "image",
        value: "/images-dynamic/image-hero-1.jpg"
      },
      {
        type: "paragraph",
        value: "Chuỗi video hướng dẫn lái xe an toàn của Ford hiện đã được đăng tải đầy đủ tại chuyên mục Media trên website Đồng Nai Ford nhằm giúp cộng đồng lái xe dễ dàng tiếp cận kiến thức hữu ích này bất cứ lúc nào."
      }
    ]
  }
];

export function getArticleById(id: string): Article | undefined {
  return articles.find((art) => art.id === id);
}

export function getArticlesByCategory(category: "Xe Ford" | "Khuyến Mãi" | "Tin tức"): Article[] {
  return articles.filter((art) => art.category === category);
}
