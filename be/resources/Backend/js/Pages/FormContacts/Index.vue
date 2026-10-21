<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            {
                field: 'Nguồn / Loại Form',
                transform: (data) => {
                    const c = data.data_contact || {};
                    const isLdp = Boolean(data.sales_consultant_id || data.sales_consultant || c['Cố vấn phụ trách'] || c['landing_page_id'] || c['Trang LDP']);
                    if (data.type === 'LDP_CLICK_CALL') {
                        return '📞 Click Gọi Điện LDP';
                    }
                    if (data.type === 'LDP_CLICK_ZALO') {
                        return '💬 Click Chat Zalo LDP';
                    }
                    const msg = c['Message'] || c['Nội dung'] || c['Nội dung cần hỗ trợ'] || '';
                    if (msg.includes('[Đăng ký tư vấn từ popup trang chủ]')) {
                        return '🎯 Popup tư vấn trang chủ';
                    }
                    if (msg.includes('[Đăng ký tư vấn từ bài viết')) {
                        return '📰 Tư vấn bài viết tin tức';
                    }
                    if (data.type === 'NEW_CAR_QUOTE_FORM') {
                        const car = c['Dòng xe quan tâm'] || c['Xe quan tâm'] || c['Loại xe'] || 'Tất cả các dòng';
                        return isLdp ? `🚗 Báo giá LDP (${car})` : `💰 Báo giá xe mới (${car})`;
                    }
                    if (data.type === 'REPAIR_QUOTE_FORM') {
                        const car = c['Loại xe'] || c['Dòng xe'] || '';
                        return `🔧 Báo giá sửa chữa ${car ? `(${car})` : ''}`;
                    }
                    if (data.type === 'ADVISE_FORM') {
                        return isLdp ? '🚗 Báo giá LDP' : '🚗 Tư vấn sản phẩm';
                    }
                    if (data.type === 'TEST_DRIVE') {
                        return isLdp ? '🚘 Lái thử LDP' : '🚘 Đăng ký lái thử';
                    }
                    if (data.type === 'APPLY_FORM') {
                        return '💼 Tuyển dụng';
                    }
                    return isLdp ? '🚗 Báo giá LDP' : '🌐 Form liên hệ website';
                }
            },
            {
                field: 'Cố vấn phụ trách (Sale)',
                transform: (data) => {
                    const c = data.data_contact || {};
                    if (c['Cố vấn phụ trách']) {
                        return `👨‍💼 ${c['Cố vấn phụ trách']}`;
                    }
                    const sc = data.sales_consultant;
                    if (sc) {
                        const scName = sc.name || (sc.translations && sc.translations[0]?.name) || `Sale #${sc.id}`;
                        const scPhone = sc.phone ? ` (SĐT: ${sc.phone})` : '';
                        return `👨‍💼 ${scName}${scPhone}`;
                    }
                    return '🏢 Đại lý chung';
                }
            },
            {
                field: 'Họ và tên',
                transform: (data) => {
                    return data.data_contact.Name || data.data_contact['Họ và tên'] || '';
                }
            },
            {
                field: 'Số điện thoại',
                transform: (data) => {
                    return data.data_contact.Phone || data.data_contact['Số điện thoại'] || '';
                }
            },
            {
                field: 'Email',
                transform: (data) => {
                    return data.data_contact.Email || data.data_contact['E-mail'] || '--';
                }
            },
            {
                field: 'Nội dung yêu cầu / Lời nhắn',
                transform: (data) => {
                    const c = data.data_contact || {};
                    if (data.type === 'LDP_CLICK_CALL' || data.type === 'LDP_CLICK_ZALO') {
                        const car = c['Dòng xe đang xem'] || c['Dòng xe quan tâm'] || c['Dòng xe'] || (c.Product && c.Product.title) || 'Tất cả dòng xe';
                        const pos = c['Vị trí nút bấm'] || c['button_position'] || 'Nút liên hệ trên LDP';
                        return `Xe: ${car} | Nút bấm: ${pos}`;
                    }
                    let raw = c['Ghi chú yêu cầu thêm'] || c['Nội dung yêu cầu'] || c['Nội dung cần hỗ trợ'] || c['Message'] || c['Nội dung'] || '--';
                    if (typeof raw === 'string') {
                        return raw.replace('[Đăng ký tư vấn từ popup trang chủ] - Nội dung quan tâm: ', '').replace('[Đăng ký tư vấn từ popup trang chủ]', '');
                    }
                    return '--';
                }
            },
            'status',
            'sent_at',
            'created_at',
        ]"
        :config="{
            canCreate: false,
        }"
    />
</template>
<script>
export default {
    props: ["schema"],
};
</script>
