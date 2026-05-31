export default {
    "en": {
        "agency": {
            "region": {
                "mien_bac": "Northern",
                "mien_trung": "Middle",
                "mien_nam": "Southern"
            }
        },
        "auth": {
            "failed": "These credentials do not match our records.",
            "password": "The provided password is incorrect.",
            "throttle": "Too many login attempts. Please try again in {seconds} seconds."
        },
        "common": {
            "styles": {
                "ACTIVE": {
                    "backgroundColor": "#abeec2",
                    "color": "#15803D",
                    "label": "Visible"
                },
                "INACTIVE": {
                    "backgroundColor": "#ffb0b0",
                    "color": "#c63737",
                    "label": "Hidden"
                },
                "NEW": {
                    "label": "New"
                },
                "RESPONSE": {
                    "label": "Responded"
                },
                "PROCESSED": {
                    "label": "Processed"
                },
                "CLOSE": {
                    "label": "Closed"
                },
                "IS_SPAM": {
                    "label": "Spam"
                }
            }
        },
        "models": {
            "actions": {
                "create": "Tạo mới"
            },
            "admins": {
                "id": "ID",
                "name": "Tên",
                "email": "Địa chỉ email",
                "password": "Mật khẩu",
                "phone": "Số điện thoại",
                "type": "Loại tài khoản",
                "status": "Trạng thái"
            },
            "table_list": {
                "collections": "Bộ sưu tập",
                "discounts": "Discount",
                "Discounts": "Discount",
                "Vouchers": "Vouchers",
                "collection-categories": "Danh mục bộ sưu tập",
                "admins": "Quản trị viên",
                "translations": "Bản dịch",
                "roles": "Vai trò",
                "users": "Khách hàng",
                "settings": "Cấu hình",
                "posts": "Bài viết",
                "files": "Quản lý Tệp",
                "banners": "Banners",
                "vehicle-categories": "Vehicle Categories",
                "vehicles": "Vehicles",
                "customer-reviews": "Customer Reviews",
                "partners": "Partners",
                "sales-consultants": "Sales Consultants",
                "dealer-activities": "Dealer Activities",
                "awards": "Awards"
            },
            "posts": {
                "type": {
                    "health-corner": "HEALTH_CORNER",
                    "look-up-disease": "LOOK_UP_DISEASE",
                    "collection": "COLLECTION"
                }
            },
            "message": {
                "confirm_message": "Changes are not saved. Are you sure you want to leave?",
                "trashed_message1": "This record was deleted on",
                "trashed_message2": "Click here to restore."
            }
        },
        "pagination": {
            "previous": "Previous",
            "next": "Next"
        },
        "passwords": {
            "reset": "Your password has been reset!",
            "sent": "We have emailed your password reset link!",
            "throttled": "Please wait before retrying.",
            "token": "This password reset token is invalid.",
            "user": "We can't find a user with that email address."
        },
        "routes": {
            "home": "/",
            "histories": "histories",
            "contact": "contact",
            "products": "products",
            "product-categories": "product-categories",
            "services": "service",
            "posts": "posts",
            "jobs": "career",
            "about-us": "about-us",
            "policies": "policies",
            "search": "search",
            "track-order": "track-order"
        },
        "validation": {
            "accepted": "The {attribute} must be accepted.",
            "accepted_if": "The {attribute} must be accepted when {other} is {value}.",
            "active_url": "The {attribute} is not a valid URL.",
            "after": "The {attribute} must be a date after {date}.",
            "after_or_equal": "The {attribute} must be a date after or equal to {date}.",
            "alpha": "The {attribute} must only contain letters.",
            "alpha_dash": "The {attribute} must only contain letters, numbers, dashes and underscores.",
            "alpha_num": "The {attribute} must only contain letters and numbers.",
            "array": "The {attribute} must be an array.",
            "before": "The {attribute} must be a date before {date}.",
            "before_or_equal": "The {attribute} must be a date before or equal to {date}.",
            "between": {
                "array": "The {attribute} must have between {min} and {max} items.",
                "file": "The {attribute} must be between {min} and {max} kilobytes.",
                "numeric": "The {attribute} must be between {min} and {max}.",
                "string": "The {attribute} must be between {min} and {max} characters."
            },
            "boolean": "The {attribute} field must be true or false.",
            "confirmed": "The {attribute} confirmation does not match.",
            "current_password": "The password is incorrect.",
            "date": "The {attribute} is not a valid date.",
            "date_equals": "The {attribute} must be a date equal to {date}.",
            "date_format": "The {attribute} does not match the format {format}.",
            "declined": "The {attribute} must be declined.",
            "declined_if": "The {attribute} must be declined when {other} is {value}.",
            "different": "The {attribute} and {other} must be different.",
            "digits": "The {attribute} must be {digits} digits.",
            "digits_between": "The {attribute} must be between {min} and {max} digits.",
            "dimensions": "The {attribute} has invalid image dimensions.",
            "distinct": "The {attribute} field has a duplicate value.",
            "doesnt_end_with": "The {attribute} may not end with one of the following: {values}.",
            "doesnt_start_with": "The {attribute} may not start with one of the following: {values}.",
            "email": "The {attribute} must be a valid email address.",
            "ends_with": "The {attribute} must end with one of the following: {values}.",
            "enum": "The selected {attribute} is invalid.",
            "exists": "The selected {attribute} is invalid.",
            "file": "The {attribute} must be a file.",
            "filled": "The {attribute} field must have a value.",
            "gt": {
                "array": "The {attribute} must have more than {value} items.",
                "file": "The {attribute} must be greater than {value} kilobytes.",
                "numeric": "The {attribute} must be greater than {value}.",
                "string": "The {attribute} must be greater than {value} characters."
            },
            "gte": {
                "array": "The {attribute} must have {value} items or more.",
                "file": "The {attribute} must be greater than or equal to {value} kilobytes.",
                "numeric": "The {attribute} must be greater than or equal to {value}.",
                "string": "The {attribute} must be greater than or equal to {value} characters."
            },
            "image": "The {attribute} must be an image.",
            "in": "The selected {attribute} is invalid.",
            "in_array": "The {attribute} field does not exist in {other}.",
            "integer": "The {attribute} must be an integer.",
            "ip": "The {attribute} must be a valid IP address.",
            "ipv4": "The {attribute} must be a valid IPv4 address.",
            "ipv6": "The {attribute} must be a valid IPv6 address.",
            "json": "The {attribute} must be a valid JSON string.",
            "lt": {
                "array": "The {attribute} must have less than {value} items.",
                "file": "The {attribute} must be less than {value} kilobytes.",
                "numeric": "The {attribute} must be less than {value}.",
                "string": "The {attribute} must be less than {value} characters."
            },
            "lte": {
                "array": "The {attribute} must not have more than {value} items.",
                "file": "The {attribute} must be less than or equal to {value} kilobytes.",
                "numeric": "The {attribute} must be less than or equal to {value}.",
                "string": "The {attribute} must be less than or equal to {value} characters."
            },
            "mac_address": "The {attribute} must be a valid MAC address.",
            "max": {
                "array": "The {attribute} must not have more than {max} items.",
                "file": "The {attribute} must not be greater than {max} kilobytes.",
                "numeric": "The {attribute} must not be greater than {max}.",
                "string": "The {attribute} must not be greater than {max} characters."
            },
            "max_digits": "The {attribute} must not have more than {max} digits.",
            "mimes": "The {attribute} must be a file of type: {values}.",
            "mimetypes": "The {attribute} must be a file of type: {values}.",
            "min": {
                "array": "The {attribute} must have at least {min} items.",
                "file": "The {attribute} must be at least {min} kilobytes.",
                "numeric": "The {attribute} must be at least {min}.",
                "string": "The {attribute} must be at least {min} characters."
            },
            "min_digits": "The {attribute} must have at least {min} digits.",
            "multiple_of": "The {attribute} must be a multiple of {value}.",
            "not_in": "The selected {attribute} is invalid.",
            "not_regex": "The {attribute} format is invalid.",
            "numeric": "The {attribute} must be a number.",
            "password": {
                "letters": "The {attribute} must contain at least one letter.",
                "mixed": "The {attribute} must contain at least one uppercase and one lowercase letter.",
                "numbers": "The {attribute} must contain at least one number.",
                "symbols": "The {attribute} must contain at least one symbol.",
                "uncompromised": "The given {attribute} has appeared in a data leak. Please choose a different {attribute}."
            },
            "present": "The {attribute} field must be present.",
            "prohibited": "The {attribute} field is prohibited.",
            "prohibited_if": "The {attribute} field is prohibited when {other} is {value}.",
            "prohibited_unless": "The {attribute} field is prohibited unless {other} is in {values}.",
            "prohibits": "The {attribute} field prohibits {other} from being present.",
            "regex": "The {attribute} format is invalid.",
            "required": "The {attribute} field is required.",
            "required_array_keys": "The {attribute} field must contain entries for: {values}.",
            "required_if": "The {attribute} field is required when {other} is {value}.",
            "required_if_accepted": "The {attribute} field is required when {other} is accepted.",
            "required_unless": "The {attribute} field is required unless {other} is in {values}.",
            "required_with": "The {attribute} field is required when {values} is present.",
            "required_with_all": "The {attribute} field is required when {values} are present.",
            "required_without": "The {attribute} field is required when {values} is not present.",
            "required_without_all": "The {attribute} field is required when none of {values} are present.",
            "same": "The {attribute} and {other} must match.",
            "size": {
                "array": "The {attribute} must contain {size} items.",
                "file": "The {attribute} must be {size} kilobytes.",
                "numeric": "The {attribute} must be {size}.",
                "string": "The {attribute} must be {size} characters."
            },
            "starts_with": "The {attribute} must start with one of the following: {values}.",
            "string": "The {attribute} must be a string.",
            "timezone": "The {attribute} must be a valid timezone.",
            "unique": "The {attribute} has already been taken.",
            "uploaded": "The {attribute} failed to upload.",
            "url": "The {attribute} must be a valid URL.",
            "uuid": "The {attribute} must be a valid UUID.",
            "custom": {
                "attribute-name": {
                    "rule-name": "custom-message"
                }
            },
            "attributes": []
        }
    },
    "vi": {
        "agency": {
            "region": {
                "mien_bac": "Miền Bắc",
                "mien_trung": "Miền Trung",
                "mien_nam": "Miền Nam"
            }
        },
        "auth": {
            "failed": "Thông tin tài khoản không tìm thấy trong hệ thống.",
            "password": "Mật khẩu không đúng.",
            "throttle": "Vượt quá số lần đăng nhập cho phép. Vui lòng thử lại sau {seconds} giây."
        },
        "common": {
            "styles": {
                "ACTIVE": {
                    "backgroundColor": "#abeec2",
                    "color": "#15803D",
                    "label": "Hiển thị"
                },
                "INACTIVE": {
                    "backgroundColor": "#ffb0b0",
                    "color": "#c63737",
                    "label": "Ẩn"
                },
                "NEW": {
                    "label": "Mới"
                },
                "RESPONSE": {
                    "label": "Đã phản hồi"
                },
                "PROCESSED": {
                    "label": "Đã xử lý"
                },
                "CLOSE": {
                    "label": "Đóng"
                },
                "IS_SPAM": {
                    "label": "Spam"
                }
            }
        },
        "models": {
            "actions": {
                "create": "Tạo mới"
            },
            "admins": {
                "id": "ID",
                "phone": "Số điện thoại",
                "type": "Loại tài khoản",
                "status": "Trạng thái",
                "status_locale": "Trạng thái",
                "set_password": "Đặt lại mật khẩu",
                "change_password": "Đổi mật khẩu",
                "update_information": "Cập nhật thông tin",
                "cancel": "Hủy",
                "save": "Lưu",
                "success": "Thành công",
                "update_success": "Cập nhật thông tin thành công",
                "error": "Thất bại"
            },
            "table_list": {
                "admins": "Quản trị viên",
                "translations": "Bản dịch",
                "roles": "Vai trò",
                "products": "Sản phẩm",
                "Products": "Sản phẩm",
                "brands": "Thương hiệu",
                "users": "Khách hàng",
                "settings": "Cấu hình",
                "posts": "Bài viết",
                "files": "Quản lý Tệp",
                "services": "Dịch vụ",
                "post_categories": "Danh mục bài viết",
                "post-categories": "Danh mục bài viết",
                "product-categories": "Danh mục Sản phẩm",
                "product_categories": "Danh mục Sản phẩm",
                "post-tags": "Thẻ bài viết",
                "post_tags": "Thẻ bài viết",
                "tags": "Thẻ bài viết",
                "jobs": "Tuyển dụng",
                "agencies": "Chi nhánh",
                "contacts": "Liên hệ",
                "FormContacts": "Liên hệ",
                "applies": "Ứng tuyển",
                "Applies": "Ứng tuyển",
                "sliders": "Banner",
                "banners": "Banners",
                "vehicle-categories": "Danh mục xe",
                "vehicles": "Sản phẩm xe",
                "customer-reviews": "Ý kiến khách hàng",
                "partners": "Đối tác",
                "sales-consultants": "Đội ngũ tư vấn",
                "dealer-activities": "Hoạt động đại lý",
                "awards": "Giải thưởng",
                "histories": "Lịch sử",
                "orders": "Đơn hàng",
                "Orders": "Đơn hàng",
                "policies": "Chính sách",
                "customers": "Khách hàng",
                "Customers": "Khách hàng",
                "Dashboard": "Thống kê",
                "dashboard": "Thống kê",
                "Flash-sales": "Flash Sale",
                "flash-sales": "Flash Sale"
            },
            "common": {
                "id": "ID",
                "name": "Tên",
                "title": "Tiêu đề",
                "rental": "Khách thuê",
                "formatted_rental": "Khách thuê",
                "description": "Mô tả",
                "content": "Nội dung",
                "status": "Trạng thái",
                "status_locale": "Trạng thái",
                "published_at": "Ngày xuất bản",
                "categories": "Danh mục",
                "image": "Hình ảnh",
                "images": "Hình ảnh",
                "image_mobile": "Hình ảnh Mobile",
                "images_mobile": "Hình ảnh Mobile",
                "view_count": "Lượt xem",
                "updated_at": "Cập nhật cuối",
                "created_at": "Ngày tạo",
                "author": "Tác giả",
                "related_posts": "Bài viết liên quan",
                "posts": "Bài viết",
                "options": "Thuộc tính",
                "is_active": "Hoạt động",
                "status_code": "Mã",
                "is_content_by_tab": "Nội dung theo tab",
                "tags": "Thẻ bài viết",
                "working_position": "Hình thức làm việc",
                "work_address": "Nơi làm việc",
                "working_time": "Vị trí làm việc",
                "related_jobs": "Vị trí liên quan",
                "position_display": "Vị trí hiển thị",
                "year": "Năm",
                "agencies": "Chi nhánh",
                "expected_time": "Hạn nộp",
                "region": "Miền",
                "changePassword": "Đổi mật khẩu",
                "create": "Tạo mới",
                "delete": "Xóa",
                "inject_head": "Thêm code trước thẻ đóng Head",
                "inject_body_start": "Thêm code sau thẻ mở Body",
                "inject_body_end": "Thêm code trước thẻ đóng Body",
                "general_business_name": "Tên doanh nghiệp",
                "general_site_name": "tên website",
                "general_email": "email liên hệ"
            },
            "select_date": {
                "today": "Hôm nay",
                "yesterday": "Hôm qua",
                "last_7_days": "7 ngày gần nhất",
                "last_30_days": "30 ngày gần nhất"
            },
            "field": {
                "choose": "Chọn",
                "please_choose": "Vui lòng chọn",
                "text_characters": "ký tự",
                "text_from": "từ"
            },
            "has_crud_action": {
                "store": "Lưu đối tượng thành công.",
                "destroy": "Xoá thành công.",
                "restore": "Khôi phục thành công."
            },
            "setting": {
                "setting_general": "Cài đặt thông tin",
                "general_information": "Thông tin chung",
                "custom_vars": "Tùy chỉnh biến môi trường",
                "config_smtp": "Cấu hình SMTP",
                "notification": "Thông báo",
                "custom_vars_form": {
                    "general_information": "Danh sách",
                    "add": "Thêm",
                    "confirm_delete": "Bạn có thực sự muốn xoá đối tượng này?"
                },
                "notification_from": {
                    "general_information": "Thông báo liên hệ",
                    "info": "Khi website nhận được liên hệ mới, hệ thống sẽ tự động gửi thông báo tới email của bạn.",
                    "help": "Tips: Có thể nhập nhiều email, các email được ngăn cách bởi dấu phẩy"
                }
            },
            "form": {
                "save": "Lưu",
                "delete": "Xóa",
                "confirm_destroy": "Bạn chắc chắn muốn xoá đối tượng này?",
                "confirm_restore": "Bạn muốn khôi phục đối tượng này?",
                "meta_summary": "Cấu hình nâng cao",
                "general_information": "Thông tin chung",
                "notification_production_to": "Email môi trường thật (Production)",
                "notification_staging_to": "Email môi trường test  (Local/Staging)",
                "config": "Cấu hình"
            },
            "files": {
                "file_manager": "Quản lý tệp",
                "add_folder": "Tạo thư mục",
                "delete_folder": "Xóa Thư Mục",
                "select_file": "Chọn tệp",
                "drop": "Kéo thả hoặc",
                "click_here": "click vào đây",
                "select_files": "để chọn tệp",
                "unchecked": "Bỏ chọn",
                "select": "Chọn",
                "cancel": "Hủy",
                "save": "Lưu",
                "delete": "Xóa",
                "maximum_size": "Dung lượng file tối đa là",
                "try_again": "MB. Vui lòng thử lại.",
                "input_file": "Nhập tên tệp...",
                "input_upload": "CLICK ĐỂ CHỌN",
                "confirm_delete": "Bạn chắc chắn xóa thư mục này!"
            },
            "auth": {
                "login": "Đăng nhập",
                "forgot_password_text": "Quên mật khẩu?"
            },
            "table": {
                "create": "Thêm mới",
                "export": "Xuất File",
                "import": "Nhập File",
                "search": "Tìm kiếm",
                "search_load": "Tìm kiếm..",
                "not_found": "Không tìm thấy dữ liệu.",
                "loading": "Đang tải dữ liệu...",
                "on_total": "trên tổng",
                "to": "đến",
                "from": "Từ"
            },
            "roles": {
                "object": "Đối tượng",
                "see": "Xem",
                "select_all": "Chọn tất cả",
                "add": "Thêm",
                "edit": "Sửa",
                "delete": "Xóa",
                "restore": "Khôi phục",
                "other": "Khác"
            },
            "sidebar": {
                "product": "Sản phẩm",
                "content": "Nội dung",
                "other": "Mục khác",
                "form": "Form"
            },
            "translations": {
                "default": "Mặc định",
                "translation": "Bản dịch"
            },
            "message": {
                "confirm_message": "Thông tin chưa được lưu. Bạn có thực sự muốn thoát trang?",
                "trashed_message1": "Bản ghi này đã bị xóa vào lúc",
                "trashed_message2": "Nhấn vào đây để khôi phục."
            }
        },
        "pagination": {
            "previous": "<",
            "next": ">"
        },
        "passwords": {
            "reset": "Mật khẩu mới đã được cập nhật!",
            "sent": "Hướng dẫn cấp lại mật khẩu đã được gửi!",
            "throttled": "Vui lòng đợi trước khi thử lại.",
            "token": "Mã khôi phục mật khẩu không hợp lệ.",
            "user": "Không tìm thấy người dùng với địa chỉ email này.",
            "not_match": "Mật khẩu hiện tại không chính xác."
        },
        "routes": {
            "home": "/",
            "contact": "lien-he",
            "products": "san-pham",
            "product-categories": "danh-muc",
            "about-us": "gioi-thieu",
            "histories": "cot-moc-phat-trien",
            "services": "dich-vu",
            "posts": "thi-truong-dau-tu",
            "jobs": "tuyen-dung",
            "policies": "chinh-sach",
            "search": "tim-kiem",
            "track-order": "tra-cuu-don-hang",
            "factory": "nha-may"
        },
        "validation": {
            "accepted": "Trường {attribute} phải được chấp nhận.",
            "active_url": "Trường {attribute} không phải là một URL hợp lệ.",
            "after": "Trường {attribute} phải là một ngày sau ngày {date}.",
            "after_or_equal": "Trường {attribute} phải là thời gian bắt đầu sau hoặc đúng bằng {date}.",
            "alpha": "Trường {attribute} chỉ có thể chứa các chữ cái.",
            "alpha_dash": "Trường {attribute} chỉ có thể chứa chữ cái, số và dấu gạch ngang.",
            "alpha_num": "Trường {attribute} chỉ có thể chứa chữ cái và số.",
            "array": "Trường {attribute} phải là dạng mảng.",
            "attached": "Trường {attribute} đã được đính kèm.",
            "before": "Trường {attribute} phải là một ngày trước ngày {date}.",
            "before_or_equal": "Trường {attribute} phải là thời gian bắt đầu trước hoặc đúng bằng {date}.",
            "between": {
                "array": "Trường {attribute} phải có từ {min} - {max} phần tử.",
                "file": "Dung lượng tập tin trong trường {attribute} phải từ {min} - {max} kB.",
                "numeric": "Trường {attribute} phải nằm trong khoảng {min} - {max}.",
                "string": "Trường {attribute} phải từ {min} - {max} kí tự."
            },
            "boolean": "Trường {attribute} phải là true hoặc false.",
            "confirmed": "Giá trị xác nhận trong trường {attribute} không khớp.",
            "date": "Trường {attribute} không phải là định dạng của ngày-tháng.",
            "date_equals": "Trường {attribute} phải là một ngày bằng với {date}.",
            "date_format": "Trường {attribute} không giống với định dạng {format}.",
            "different": "Trường {attribute} và {other} phải khác nhau.",
            "digits": "Độ dài của trường {attribute} phải gồm {digits} chữ số.",
            "digits_between": "Độ dài của trường {attribute} phải nằm trong khoảng {min} and {max} chữ số.",
            "dimensions": "Trường {attribute} có kích thước không hợp lệ.",
            "distinct": "Trường {attribute} có giá trị trùng lặp.",
            "email": "Trường {attribute} phải là một địa chỉ email hợp lệ.",
            "ends_with": "Trường {attribute} phải kết thúc bằng một trong những giá trị sau: {values}",
            "exists": "Giá trị đã chọn trong trường {attribute} không hợp lệ.",
            "file": "Trường {attribute} phải là một tệp tin.",
            "filled": "Trường {attribute} không được bỏ trống.",
            "gt": {
                "array": "Mảng {attribute} phải có nhiều hơn {value} phần tử.",
                "file": "Dung lượng trường {attribute} phải lớn hơn {value} kilobytes.",
                "numeric": "Giá trị trường {attribute} phải lớn hơn {value}.",
                "string": "Độ dài trường {attribute} phải nhiều hơn {value} kí tự."
            },
            "gte": {
                "array": "Mảng {attribute} phải có ít nhất {value} phần tử.",
                "file": "Dung lượng trường {attribute} phải lớn hơn hoặc bằng {value} kilobytes.",
                "numeric": "Giá trị trường {attribute} phải lớn hơn hoặc bằng {value}.",
                "string": "Độ dài trường {attribute} phải lớn hơn hoặc bằng {value} kí tự."
            },
            "image": "Trường {attribute} phải là định dạng hình ảnh.",
            "in": "Giá trị đã chọn trong trường {attribute} không hợp lệ.",
            "in_array": "Trường {attribute} phải thuộc tập cho phép: {other}.",
            "integer": "Trường {attribute} phải là một số nguyên.",
            "ip": "Trường {attribute} phải là một địa chỉ IP.",
            "ipv4": "Trường {attribute} phải là một địa chỉ IPv4.",
            "ipv6": "Trường {attribute} phải là một địa chỉ IPv6.",
            "json": "Trường {attribute} phải là một chuỗi JSON.",
            "lt": {
                "array": "Mảng {attribute} phải có ít hơn {value} phần tử.",
                "file": "Dung lượng trường {attribute} phải nhỏ hơn {value} kilobytes.",
                "numeric": "Giá trị trường {attribute} phải nhỏ hơn {value}.",
                "string": "Độ dài trường {attribute} phải nhỏ hơn {value} kí tự."
            },
            "lte": {
                "array": "Mảng {attribute} không được có nhiều hơn {value} phần tử.",
                "file": "Dung lượng trường {attribute} phải nhỏ hơn hoặc bằng {value} kilobytes.",
                "numeric": "Giá trị trường {attribute} phải nhỏ hơn hoặc bằng {value}.",
                "string": "Độ dài trường {attribute} phải nhỏ hơn hoặc bằng {value} kí tự."
            },
            "max": {
                "array": "Trường {attribute} không được lớn hơn {max} phần tử.",
                "file": "Dung lượng tập tin trong trường {attribute} không được lớn hơn {max} kB.",
                "numeric": "Trường {attribute} không được lớn hơn {max}.",
                "string": "Trường {attribute} không được lớn hơn {max} kí tự."
            },
            "mimes": "Trường {attribute} phải là một tập tin có định dạng: {values}.",
            "mimetypes": "Trường {attribute} phải là một tập tin có định dạng: {values}.",
            "min": {
                "array": "Trường {attribute} phải có tối thiểu {min} phần tử.",
                "file": "Dung lượng tập tin trong trường {attribute} phải tối thiểu {min} kB.",
                "numeric": "Trường {attribute} phải tối thiểu là {min}.",
                "string": "Trường {attribute} phải có tối thiểu {min} kí tự."
            },
            "multiple_of": "Trường {attribute} phải là bội số của {value}",
            "not_in": "Giá trị đã chọn trong trường {attribute} không hợp lệ.",
            "not_regex": "Trường {attribute} có định dạng không hợp lệ.",
            "numeric": "Trường {attribute} phải là một số.",
            "password": "Mật khẩu không đúng.",
            "present": "Trường {attribute} phải được cung cấp.",
            "prohibited": "Trường {attribute} bị cấm.",
            "prohibited_if": "Trường {attribute} bị cấm khi {other} là {value}.",
            "prohibited_unless": "Trường {attribute} bị cấm trừ khi {other} là một trong {values}.",
            "regex": "Trường {attribute} có định dạng không hợp lệ.",
            "relatable": "Trường {attribute} không thể liên kết với tài nguyên này.",
            "required": "Trường {attribute} không được bỏ trống.",
            "required_if": "Trường {attribute} không được bỏ trống khi trường {other} là {value}.",
            "required_unless": "Trường {attribute} không được bỏ trống trừ khi {other} là {values}.",
            "required_with": "Trường {attribute} không được bỏ trống khi một trong {values} có giá trị.",
            "required_with_all": "Trường {attribute} không được bỏ trống khi tất cả {values} có giá trị.",
            "required_without": "Trường {attribute} không được bỏ trống khi một trong {values} không có giá trị.",
            "required_without_all": "Trường {attribute} không được bỏ trống khi tất cả {values} không có giá trị.",
            "same": "Trường {attribute} và {other} phải giống nhau.",
            "size": {
                "array": "Trường {attribute} phải chứa {size} phần tử.",
                "file": "Dung lượng tập tin trong trường {attribute} phải bằng {size} kB.",
                "numeric": "Trường {attribute} phải bằng {size}.",
                "string": "Trường {attribute} phải chứa {size} kí tự."
            },
            "starts_with": "Trường {attribute} phải được bắt đầu bằng một trong những giá trị sau: {values}",
            "string": "Trường {attribute} phải là một chuỗi kí tự.",
            "timezone": "Trường {attribute} phải là một múi giờ hợp lệ.",
            "unique": "Trường {attribute} đã có trong cơ sở dữ liệu.",
            "uploaded": "Trường {attribute} tải lên thất bại.",
            "url": "Trường {attribute} không giống với định dạng một URL.",
            "uuid": "Trường {attribute} phải là một chuỗi UUID hợp lệ.",
            "custom": {
                "attribute-name": {
                    "rule-name": "custom-message"
                }
            },
            "attributes": {
                "address": "địa chỉ",
                "age": "tuổi",
                "available": "có sẵn",
                "body": "nội dung",
                "city": "thành phố",
                "content": "nội dung",
                "country": "quốc gia",
                "date": "ngày",
                "day": "ngày",
                "description": "mô tả",
                "email": "email",
                "excerpt": "trích dẫn",
                "first_name": "tên",
                "gender": "giới tính",
                "hour": "giờ",
                "last_name": "họ",
                "message": "lời nhắn",
                "minute": "phút",
                "mobile": "di động",
                "month": "tháng",
                "name": "tên",
                "password": "mật khẩu",
                "password_confirmation": "xác nhận mật khẩu",
                "phone": "số điện thoại",
                "second": "giây",
                "sex": "giới tính",
                "size": "kích thước",
                "subject": "tiêu đề",
                "time": "thời gian",
                "title": "tiêu đề",
                "username": "tên đăng nhập",
                "year": "năm",
                "price": "giá",
                "price_sale": "giảm giá",
                "summary": "mô tả ngắn"
            }
        }
    },
    "zh": {
        "models": {
            "message": {
                "confirm_message": "更改尚未保存。您确定要离开吗？",
                "trashed_message1": "该记录已于",
                "trashed_message2": "点击此处恢复。"
            }
        }
    }
}
