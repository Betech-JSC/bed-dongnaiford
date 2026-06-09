<template>
    <div 
        class="page-builder-container flex flex-col md:flex-row bg-slate-900 overflow-hidden font-sans"
        :class="fullscreen ? 'h-full w-full rounded-none border-0 gap-0' : 'h-[calc(100vh-120px)] min-h-[750px] gap-6 border border-slate-800 rounded-2xl'"
    >
        <!-- LEFT PANEL: Sidebar Settings (4/12 width equivalent) -->
        <div class="w-full md:w-[420px] flex flex-col bg-slate-950 border-r border-slate-800 h-full overflow-hidden select-none">
            <!-- Sidebar Header -->
            <div class="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <div class="flex items-center space-x-2">
                    <span class="flex h-3 w-3 rounded-full bg-blue-500 animate-pulse"></span>
                    <h3 class="text-sm font-bold text-slate-200 tracking-wide uppercase">Cấu hình giao diện</h3>
                </div>
                <!-- Back Button when editing a specific block -->
                <button 
                    v-if="activeIndex !== null" 
                    type="button" 
                    class="flex items-center text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700"
                    @click="activeIndex = null"
                >
                    <span class="mr-1">←</span> Danh sách
                </button>
            </div>

            <!-- Tab Buttons (Only shown when not editing a specific block) -->
            <div v-if="activeIndex === null" class="flex border-b border-slate-800 bg-slate-950/60 p-2">
                <button 
                    type="button"
                    class="flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition duration-200"
                    :class="activeTab === 'sections' ? 'bg-[#0562D2] text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'"
                    @click="activeTab = 'sections'"
                >
                    📁 Khối hiển thị ({{ blocks.length }})
                </button>
                <button 
                    type="button"
                    class="flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition duration-200"
                    :class="activeTab === 'library' ? 'bg-[#0562D2] text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'"
                    @click="activeTab = 'library'"
                >
                    ✨ Thêm khối mới
                </button>
            </div>

            <!-- Scrollable Content of Left Sidebar -->
            <div class="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-880 scrollbar-track-transparent">
                <!-- SCENE A: ACTIVE BLOCK DETAILS EDITOR -->
                <div v-if="activeIndex !== null && blocks[activeIndex]" class="space-y-5">
                    <div class="bg-slate-900 p-4 border border-slate-800 rounded-xl">
                        <div class="text-[10px] uppercase font-bold text-blue-400 mb-1">Đang chỉnh sửa</div>
                        <h4 class="text-sm font-black text-white flex items-center gap-2">
                            <span>{{ getBlockIcon(blocks[activeIndex].type) }}</span>
                            <span>{{ getBlockLabel(blocks[activeIndex].type) }}</span>
                        </h4>
                    </div>

                    <!-- Fields Editor Content based on Selected Block Type -->
                    <div class="space-y-4">
                        <!-- 1. HeroBanner Edit Form -->
                        <div v-if="blocks[activeIndex].type === 'HeroBanner'" class="space-y-4">
                            <Field v-model="blocks[activeIndex].data.title" :field="{
                                type: 'text',
                                name: 'hb_title_' + activeIndex,
                                label: 'Tiêu đề lớn (Title)',
                                placeholder: 'vd: FORD EVEREST MỚI',
                            }" />
                            <Field v-model="blocks[activeIndex].data.tagline" :field="{
                                type: 'text',
                                name: 'hb_tag_' + activeIndex,
                                label: 'Tagline / Slogan',
                                placeholder: 'vd: Dấn bước. Dẫn đầu.',
                            }" />
                            <div class="grid grid-cols-2 gap-3">
                                <Field v-model="blocks[activeIndex].data.button_text" :field="{
                                    type: 'text',
                                    name: 'hb_btxt_' + activeIndex,
                                    label: 'Nhãn nút bấm',
                                }" />
                                <Field v-model="blocks[activeIndex].data.button_link" :field="{
                                    type: 'text',
                                    name: 'hb_blink_' + activeIndex,
                                    label: 'Liên kết nút bấm',
                                }" />
                            </div>
                            <Field v-model="blocks[activeIndex].data.background_image" :field="{
                                type: 'file_upload',
                                name: 'hb_bg_' + activeIndex,
                                label: 'Hình ảnh nền (Background)',
                            }" />
                        </div>

                        <!-- 2. Promotions Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'Promotions'" class="space-y-4">
                            <Field v-model="blocks[activeIndex].data.title" :field="{
                                type: 'text',
                                name: 'pr_title_' + activeIndex,
                                label: 'Tiêu đề khuyến mãi',
                                placeholder: 'vd: Chương trình khuyến mãi đặc biệt',
                            }" />
                            <Field v-model="blocks[activeIndex].data.description" :field="{
                                type: 'textarea',
                                name: 'pr_desc_' + activeIndex,
                                label: 'Nội dung ngắn khuyến mãi',
                            }" />
                            <div class="grid grid-cols-2 gap-3">
                                <Field v-model="blocks[activeIndex].data.button_text" :field="{
                                    type: 'text',
                                    name: 'pr_btxt_' + activeIndex,
                                    label: 'Nhãn nút bấm',
                                }" />
                            </div>
                            <Field v-model="blocks[activeIndex].data.image" :field="{
                                type: 'file_upload',
                                name: 'pr_img_' + activeIndex,
                                label: 'Ảnh banner khuyến mãi',
                            }" />
                        </div>

                        <!-- 3. ThreeSixtyViewer Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'ThreeSixtyViewer'" class="space-y-4">
                            <Field v-model="blocks[activeIndex].data.title" :field="{
                                type: 'text',
                                name: 'tsv_title_' + activeIndex,
                                label: 'Tiêu đề khối 360',
                            }" />
                            <Field v-model="blocks[activeIndex].data.description" :field="{
                                type: 'textarea',
                                name: 'tsv_desc_' + activeIndex,
                                label: 'Mô tả ngắn',
                            }" />
                        </div>

                        <!-- 4. FeaturesGrid Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'FeaturesGrid'" class="space-y-4">
                            <div class="border-b border-slate-800 pb-3 mb-3">
                                <span class="text-xs font-bold text-blue-400"># PHẦN 1: THIẾT KẾ</span>
                                <div class="mt-2 space-y-3">
                                    <Field v-model="blocks[activeIndex].data.title_1" :field="{
                                        type: 'text',
                                        name: 'fg_t1_' + activeIndex,
                                        label: 'Tiêu đề nhóm 1',
                                    }" />
                                    <Field v-model="blocks[activeIndex].data.image_1" :field="{
                                        type: 'file_upload',
                                        name: 'fg_img1_' + activeIndex,
                                        label: 'Ảnh lưới 1 (Ảnh lớn trên)',
                                    }" />
                                    <div class="grid grid-cols-2 gap-3">
                                        <Field v-model="blocks[activeIndex].data.image_2" :field="{
                                            type: 'file_upload',
                                            name: 'fg_img2_' + activeIndex,
                                            label: 'Ảnh lưới 2 (dưới trái)',
                                        }" />
                                        <Field v-model="blocks[activeIndex].data.image_3" :field="{
                                            type: 'file_upload',
                                            name: 'fg_img3_' + activeIndex,
                                            label: 'Ảnh lưới 3 (dưới phải)',
                                        }" />
                                    </div>
                                </div>
                            </div>

                            <div class="border-b border-slate-800 pb-3 mb-3">
                                <span class="text-xs font-bold text-blue-400"># PHẦN 2: NỘI THẤT</span>
                                <div class="mt-2 space-y-3">
                                    <Field v-model="blocks[activeIndex].data.title_2" :field="{
                                        type: 'text',
                                        name: 'fg_t2_' + activeIndex,
                                        label: 'Tiêu đề nhóm 2',
                                    }" />
                                    <Field v-model="blocks[activeIndex].data.image_large" :field="{
                                        type: 'file_upload',
                                        name: 'fg_img_l_' + activeIndex,
                                        label: 'Ảnh nội thất lớn',
                                    }" />
                                </div>
                            </div>

                            <div>
                                <span class="text-xs font-bold text-blue-400"># PHẦN 3: CÔNG NGHỆ VÀ THÔNG SỐ NỔI BẬT</span>
                                <div class="mt-2 space-y-3">
                                    <Field v-model="blocks[activeIndex].data.title_3" :field="{
                                        type: 'text',
                                        name: 'fg_t3_' + activeIndex,
                                        label: 'Tiêu đề nhóm 3',
                                    }" />
                                    <Field v-model="blocks[activeIndex].data.split_image" :field="{
                                        type: 'file_upload',
                                        name: 'fg_img_s_' + activeIndex,
                                        label: 'Ảnh công nghệ (Trái)',
                                    }" />
                                    <Field v-model="blocks[activeIndex].data.split_title" :field="{
                                        type: 'text',
                                        name: 'fg_split_title_' + activeIndex,
                                        label: 'Tiêu đề cột thông số (Phải)',
                                    }" />
                                    
                                    <div class="space-y-2">
                                        <label class="text-xs font-semibold text-slate-300">Các chỉ số nổi bật:</label>
                                        <div v-for="(feat, featIndex) in blocks[activeIndex].data.split_features" :key="featIndex" class="flex gap-2 items-center bg-slate-900 border border-slate-800 p-2.5 rounded-xl relative">
                                            <input v-model="feat.value" type="text" class="w-1/3 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" placeholder="vd: 12-inch" />
                                            <input v-model="feat.label" type="text" class="w-2/3 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" placeholder="vd: Màn hình dọc" />
                                            <button type="button" class="text-red-400 hover:text-red-500 font-bold ml-1 text-sm bg-slate-950/60 w-6 h-6 flex items-center justify-center rounded border border-slate-800" @click="removeSplitFeature(activeIndex, featIndex)">✕</button>
                                        </div>
                                        <button type="button" class="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 mt-1.5" @click="addSplitFeature(activeIndex)">
                                            + Thêm chỉ số
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 5. VersionsGrid Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'VersionsGrid'" class="space-y-4">
                            <Field v-model="blocks[activeIndex].data.title" :field="{
                                type: 'text',
                                name: 'vg_title_' + activeIndex,
                                label: 'Tiêu đề danh sách phiên bản',
                            }" />
                            <div class="space-y-3">
                                <label class="text-xs font-semibold text-slate-300">Mô tả ngắn từng phiên bản:</label>
                                <div v-for="(desc, descIndex) in blocks[activeIndex].data.descriptions" :key="descIndex" class="space-y-1 bg-slate-900/50 p-3 border border-slate-800 rounded-xl">
                                    <span class="text-[10px] text-slate-400 uppercase font-bold">Phiên bản #{{ descIndex + 1 }}</span>
                                    <textarea 
                                        v-model="blocks[activeIndex].data.descriptions[descIndex]" 
                                        class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white resize-none h-16 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                        placeholder="Nhập thông tin giới thiệu phiên bản..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- 6. SpecsGrid Info -->
                        <div v-else-if="blocks[activeIndex].type === 'SpecsGrid'" class="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs leading-relaxed">
                            💡 **Thông tin tự động:** Khối bảng so sánh thông số không cần cài đặt thêm nội dung. Nó sẽ tự động đồng bộ và hiển thị thông số chi tiết của các phiên bản xe đã lưu ở tab chung trên frontend.
                        </div>

                        <!-- 7. FeaturesList Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'FeaturesList'" class="space-y-4">
                            <div class="flex justify-between items-center">
                                <label class="text-xs font-bold text-slate-300">Danh sách tính năng:</label>
                                <button type="button" class="text-xs text-blue-400 hover:text-blue-300 font-bold" @click="addFeature(activeIndex)">
                                    + Thêm tính năng
                                </button>
                            </div>
                            <div v-for="(feat, fIndex) in blocks[activeIndex].data.features" :key="fIndex" class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                                <button type="button" class="absolute top-2.5 right-2.5 text-red-400 hover:text-red-500 font-bold text-xs" @click="removeFeature(activeIndex, fIndex)">✕ Xóa</button>
                                <span class="text-[9px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Tính năng #{{ fIndex + 1 }}</span>
                                
                                <Field v-model="blocks[activeIndex].data.features[fIndex].title" :field="{
                                    type: 'text',
                                    name: 'fl_t_' + activeIndex + '_' + fIndex,
                                    label: 'Tên tính năng',
                                }" />
                                <Field v-model="blocks[activeIndex].data.features[fIndex].description" :field="{
                                    type: 'textarea',
                                    name: 'fl_d_' + activeIndex + '_' + fIndex,
                                    label: 'Mô tả ngắn',
                                }" />
                                <Field v-model="blocks[activeIndex].data.features[fIndex].image" :field="{
                                    type: 'file_upload',
                                    name: 'fl_img_' + activeIndex + '_' + fIndex,
                                    label: 'Ảnh minh họa',
                                }" />
                            </div>
                        </div>

                        <!-- 8. AccordionFAQs Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'AccordionFAQs'" class="space-y-4">
                            <div class="flex justify-between items-center">
                                <label class="text-xs font-bold text-slate-300">Danh sách câu hỏi:</label>
                                <button type="button" class="text-xs text-blue-400 hover:text-blue-300 font-bold" @click="addFaq(activeIndex)">
                                    + Thêm câu hỏi
                                </button>
                            </div>
                            <div v-for="(faq, faqIndex) in blocks[activeIndex].data.faqs" :key="faqIndex" class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                                <button type="button" class="absolute top-2.5 right-2.5 text-red-400 hover:text-red-500 font-bold text-xs" @click="removeFaq(activeIndex, faqIndex)">✕ Xóa</button>
                                <span class="text-[9px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Câu hỏi #{{ faqIndex + 1 }}</span>
                                
                                <Field v-model="blocks[activeIndex].data.faqs[faqIndex].q" :field="{
                                    type: 'text',
                                    name: 'faq_q_' + activeIndex + '_' + faqIndex,
                                    label: 'Câu hỏi (Question)',
                                    placeholder: 'vd: Xe bảo hành bao lâu?',
                                }" />
                                <Field v-model="blocks[activeIndex].data.faqs[faqIndex].a" :field="{
                                    type: 'textarea',
                                    name: 'faq_a_' + activeIndex + '_' + faqIndex,
                                    label: 'Câu trả lời (Answer)',
                                }" />
                            </div>
                        </div>

                        <!-- 9. BookingBanner Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'BookingBanner'" class="space-y-4">
                            <Field v-model="blocks[activeIndex].data.title" :field="{
                                type: 'text',
                                name: 'bb_title_' + activeIndex,
                                label: 'Tiêu đề Banner',
                            }" />
                            <div class="grid grid-cols-2 gap-3">
                                <Field v-model="blocks[activeIndex].data.phone" :field="{
                                    type: 'text',
                                    name: 'bb_phone_' + activeIndex,
                                    label: 'Số điện thoại',
                                }" />
                                <Field v-model="blocks[activeIndex].data.btn_text" :field="{
                                    type: 'text',
                                    name: 'bb_btn_text_' + activeIndex,
                                    label: 'Nhãn nút đặt lịch',
                                }" />
                            </div>
                            <Field v-model="blocks[activeIndex].data.btn_link" :field="{
                                type: 'text',
                                name: 'bb_btn_link_' + activeIndex,
                                label: 'Liên kết đặt lịch',
                            }" />
                            <Field v-model="blocks[activeIndex].data.car_image" :field="{
                                type: 'file_upload',
                                name: 'bb_car_image_' + activeIndex,
                                label: 'Ảnh xe đè',
                            }" />
                        </div>
                    </div>

                    <!-- Styling & Layout Panel -->
                    <div v-if="['HeroBanner', 'Promotions', 'ThreeSixtyViewer', 'BookingBanner'].includes(blocks[activeIndex].type)" class="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                        <div class="text-xs font-bold text-blue-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                            <span>🎨</span>
                            <span>Cấu hình kiểu dáng</span>
                        </div>
                        
                        <!-- Alignment Option -->
                        <div v-if="['HeroBanner', 'Promotions', 'ThreeSixtyViewer'].includes(blocks[activeIndex].type)">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Căn lề chữ (Alignment)</label>
                            <div class="grid grid-cols-3 gap-2">
                                <button 
                                    v-for="opt in [{value: 'left', label: 'Trái'}, {value: 'center', label: 'Giữa'}, {value: 'right', label: 'Phải'}]"
                                    :key="opt.value"
                                    type="button" 
                                    class="py-1.5 px-2 text-xs rounded-lg font-medium border transition-all text-center"
                                    :class="(blocks[activeIndex].data.align || 'left') === opt.value ? 'bg-blue-600 text-white border-blue-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'"
                                    @click="blocks[activeIndex].data.align = opt.value"
                                >
                                    {{ opt.label }}
                                </button>
                            </div>
                        </div>

                        <!-- Title Size & Title Color -->
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cỡ chữ tiêu đề</label>
                                <select 
                                    v-model="blocks[activeIndex].data.title_size" 
                                    class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="small">Nhỏ</option>
                                    <option value="medium">Vừa (Mặc định)</option>
                                    <option value="large">Lớn</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Màu chữ tiêu đề</label>
                                <div class="flex gap-2 items-center">
                                    <input 
                                        type="color" 
                                        v-model="blocks[activeIndex].data.title_color" 
                                        class="w-8 h-8 rounded-lg cursor-pointer border border-slate-800 bg-transparent p-0 shrink-0"
                                    />
                                    <input 
                                        type="text" 
                                        v-model="blocks[activeIndex].data.title_color" 
                                        placeholder="#ffffff"
                                        class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Description Size & Description Color (for Promotions, ThreeSixtyViewer) -->
                        <div v-if="['Promotions', 'ThreeSixtyViewer'].includes(blocks[activeIndex].type)" class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cỡ chữ mô tả</label>
                                <select 
                                    v-model="blocks[activeIndex].data.desc_size" 
                                    class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="small">Nhỏ</option>
                                    <option value="medium">Vừa (Mặc định)</option>
                                    <option value="large">Lớn</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Màu chữ mô tả</label>
                                <div class="flex gap-2 items-center">
                                    <input 
                                        type="color" 
                                        v-model="blocks[activeIndex].data.desc_color" 
                                        class="w-8 h-8 rounded-lg cursor-pointer border border-slate-800 bg-transparent p-0 shrink-0"
                                    />
                                    <input 
                                        type="text" 
                                        v-model="blocks[activeIndex].data.desc_color" 
                                        placeholder="#1a1a1a"
                                        class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Tagline Color (for HeroBanner only) -->
                        <div v-if="blocks[activeIndex].type === 'HeroBanner'">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Màu chữ Tagline / Slogan</label>
                            <div class="flex gap-2 items-center">
                                <input 
                                    type="color" 
                                    v-model="blocks[activeIndex].data.tagline_color" 
                                    class="w-8 h-8 rounded-lg cursor-pointer border border-slate-800 bg-transparent p-0 shrink-0"
                                />
                                <input 
                                    type="text" 
                                    v-model="blocks[activeIndex].data.tagline_color" 
                                    placeholder="#ffffff"
                                    class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SCENE B1: SECTIONS LIST (TAB 1) -->
                <div v-else-if="activeTab === 'sections'">
                    <Draggable
                        v-if="blocks && blocks.length > 0"
                        tag="div"
                        v-model="blocks"
                        item-key="id"
                        handle=".list-handle"
                        :animation="200"
                        class="space-y-3"
                    >
                        <template #item="{ index, element }">
                            <div 
                                class="flex items-center justify-between bg-slate-900 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl cursor-pointer transition select-none group"
                                :class="{'ring-2 ring-blue-500 border-transparent': activeIndex === index}"
                                @click="activeIndex = index"
                            >
                                <div class="flex items-center space-x-3">
                                    <!-- Drag Handle -->
                                    <div class="list-handle cursor-move p-1 text-slate-500 hover:text-slate-300 transition">
                                        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                            <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                                        </svg>
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Khối số {{ index + 1 }}</span>
                                        <span class="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                                            <span>{{ getBlockIcon(element.type) }}</span>
                                            <span>{{ getBlockLabel(element.type) }}</span>
                                        </span>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                                    <button type="button" class="text-xs text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg border border-slate-700" title="Nhấn để sửa">
                                        ⚙️
                                    </button>
                                    <button type="button" class="text-xs text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg border border-slate-700" title="Nhân bản" @click.stop="duplicateBlock(index)">
                                        ➕
                                    </button>
                                    <button type="button" class="text-xs text-red-400 hover:text-red-300 bg-slate-800 p-1.5 rounded-lg border border-slate-700" title="Xóa" @click.stop="removeBlock(index)">
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </template>
                    </Draggable>

                    <div v-else class="border border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-500 italic text-xs">
                        Chưa có khối giao diện nào được thêm vào trang xe này. Hãy chọn tab "Thêm khối mới" để bắt đầu thiết kế.
                    </div>
                </div>

                <!-- SCENE B2: BLOCK TEMPLATE LIBRARY (TAB 2) -->
                <div v-else-if="activeTab === 'library'" class="grid grid-cols-1 gap-3">
                    <div 
                        v-for="tpl in libraryBlocks" 
                        :key="tpl.type" 
                        class="flex items-center p-3.5 bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-slate-900/60 rounded-xl cursor-pointer transition select-none group"
                        @click="addBlockType(tpl.type)"
                    >
                        <div class="h-10 w-10 flex items-center justify-center bg-slate-950 border border-slate-800 rounded-lg text-lg group-hover:bg-[#0562D2]/10 group-hover:border-[#0562D2] transition">
                            {{ tpl.icon }}
                        </div>
                        <div class="ml-3.5 flex-1">
                            <h4 class="text-xs font-bold text-white group-hover:text-blue-400 transition">{{ tpl.name }}</h4>
                            <p class="text-[10px] text-slate-500 mt-0.5">{{ tpl.desc }}</p>
                        </div>
                        <span class="text-slate-600 group-hover:text-blue-400 text-xs font-black transition">＋</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- RIGHT PANEL: Live Visual Preview Browser Mockup (8/12 equivalent) -->
        <div class="flex-1 flex flex-col bg-slate-950 h-full overflow-hidden relative">
            <!-- Simulated Browser Address Bar -->
            <div class="flex items-center px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
                <div class="flex space-x-1.5 mr-4 select-none">
                    <span class="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                    <span class="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                    <span class="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
                </div>
                <div class="flex-1 bg-slate-950 border border-slate-800 rounded-lg py-1 px-4 text-slate-500 text-xs font-mono truncate select-all flex items-center space-x-2">
                    <span class="text-slate-650">🌐 https://dongnaiford.com.vn/xe/chi-tiet-xem-truoc</span>
                </div>
                <span class="text-[10px] text-blue-400 font-bold uppercase ml-4 select-none tracking-widest bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                    Live Preview
                </span>
            </div>

            <!-- Embedded NextJS Realtime Iframe Preview -->
            <div class="flex-1 bg-slate-950 overflow-hidden relative w-full h-full">
                <iframe 
                    ref="previewIframe"
                    :src="iframeUrl"
                    class="w-full h-full border-0 bg-[#fafafa]"
                    @load="onIframeLoad"
                ></iframe>
            </div>
        </div>
    </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
    name: 'BlockEditor',
    components: { Draggable },
    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
        vehicleSlug: {
            type: String,
            default: '',
        },
        vehicleData: {
            type: Object,
            default: () => ({}),
        },
        fullscreen: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            activeTab: 'sections', // 'sections' or 'library'
            activeIndex: null, // Index of the block being edited in Left Panel
            iframeLoaded: false,
            libraryBlocks: [
                { type: 'HeroBanner', icon: '📢', name: 'Banner lớn (Hero)', desc: 'Banner trần viền ấn tượng, có chữ và nút bấm hành động' },
                { type: 'Promotions', icon: '🎁', name: 'Ưu đãi khuyến mãi', desc: 'Thông tin quà tặng tiền mặt, bảo hiểm và quà độc quyền' },
                { type: 'ThreeSixtyViewer', icon: '🔄', name: 'Trình xem xoay 360°', desc: 'Mô phỏng đổi màu ngoại thất xe và tự do xoay góc nhìn' },
                { type: 'FeaturesGrid', icon: '🔲', name: 'Khung lưới tính năng', desc: 'Bố cục ghép ảnh dạng lưới cho Thiết kế, Nội thất, Công nghệ' },
                { type: 'VersionsGrid', icon: '🚗', name: 'Danh sách các phiên bản', desc: 'So sánh ngắn và hiển thị các phiên bản cùng mức giá' },
                { type: 'SpecsGrid', icon: '📊', name: 'Bảng so sánh thông số', desc: 'So sánh song song thông số chi tiết động cơ, hộp số...' },
                { type: 'FeaturesList', icon: '✨', name: 'Danh sách công nghệ', desc: 'Liệt kê so le các tính năng lái an toàn chủ động' },
                { type: 'AccordionFAQs', icon: '❓', name: 'Câu hỏi thường gặp', desc: 'Các thắc mắc xếp gập về bảo dưỡng, giá lăn bánh' },
                { type: 'BookingBanner', icon: '📞', name: 'Tư vấn & Đặt lịch', desc: 'Khối liên hệ hotline và liên kết đặt lịch hẹn bảo dưỡng' },
            ]
        }
    },
    computed: {
        blocks: {
            get() {
                return this.modelValue || []
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        },
        iframeUrl() {
            const host = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:3000'
                : window.location.origin;
            const slug = this.vehicleSlug || 'preview';
            return `${host}/san-pham/${slug}?edit=true&embed=true`;
        }
    },
    watch: {
        blocks: {
            handler(newVal) {
                // Keep active index in bounds if list size shrinks
                if (this.activeIndex !== null && this.activeIndex >= newVal.length) {
                    this.activeIndex = null
                }
                this.syncToIframe();
            },
            deep: true
        },
        activeIndex(newVal) {
            this.syncActiveIndex();
        },
        vehicleData: {
            handler(newVal) {
                this.syncVehicleData();
            },
            deep: true
        }
    },
    mounted() {
        window.addEventListener('message', this.handleIframeMessage);
    },
    beforeUnmount() {
        window.removeEventListener('message', this.handleIframeMessage);
    },
    methods: {
        onIframeLoad() {
            this.iframeLoaded = true;
            this.syncAllData();
        },
        syncAllData() {
            const iframe = this.$refs.previewIframe;
            if (iframe && iframe.contentWindow && this.iframeLoaded) {
                const resolvedBlocks = this.resolveBlockImages(this.blocks);
                iframe.contentWindow.postMessage({
                    type: 'INIT_PREVIEW',
                    vehicle: this.vehicleData,
                    blocks: resolvedBlocks,
                    activeIndex: this.activeIndex
                }, '*');
            }
        },
        syncToIframe() {
            if (!this.iframeLoaded) return;
            const iframe = this.$refs.previewIframe;
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                    type: 'UPDATE_BLOCKS',
                    blocks: this.resolveBlockImages(this.blocks),
                    activeIndex: this.activeIndex
                }, '*');
            }
        },
        syncActiveIndex() {
            if (!this.iframeLoaded) return;
            const iframe = this.$refs.previewIframe;
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                    type: 'UPDATE_ACTIVE_INDEX',
                    activeIndex: this.activeIndex
                }, '*');
            }
        },
        syncVehicleData() {
            if (!this.iframeLoaded) return;
            const iframe = this.$refs.previewIframe;
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                    type: 'UPDATE_VEHICLE',
                    vehicle: this.vehicleData
                }, '*');
            }
        },
        handleIframeMessage(event) {
            const data = event.data;
            if (!data || typeof data !== 'object') return;

            if (data.type === 'SELECT_BLOCK') {
                if (data.index !== undefined) {
                    this.activeIndex = data.index;
                }
            } else if (data.type === 'SYNC_BLOCKS_FROM_IFRAME') {
                if (data.blocks) {
                    this.$emit('update:modelValue', data.blocks);
                }
                if (data.activeIndex !== undefined) {
                    this.activeIndex = data.activeIndex;
                }
            }
        },
        resolveBlockImages(blocks) {
            const cloned = JSON.parse(JSON.stringify(blocks || []));
            cloned.forEach(block => {
                if (block.data) {
                    if (block.type === 'HeroBanner') {
                        block.data.background_image = this.resolveImageUrl(block.data.background_image);
                    } else if (block.type === 'Promotions') {
                        block.data.image = this.resolveImageUrl(block.data.image);
                    } else if (block.type === 'FeaturesGrid') {
                        block.data.image_1 = this.resolveImageUrl(block.data.image_1);
                        block.data.image_2 = this.resolveImageUrl(block.data.image_2);
                        block.data.image_3 = this.resolveImageUrl(block.data.image_3);
                        block.data.image_large = this.resolveImageUrl(block.data.image_large);
                        block.data.split_image = this.resolveImageUrl(block.data.split_image);
                    } else if (block.type === 'FeaturesList' && block.data.features) {
                        block.data.features.forEach(f => {
                            f.image = this.resolveImageUrl(f.image);
                        });
                    } else if (block.type === 'BookingBanner') {
                        block.data.car_image = this.resolveImageUrl(block.data.car_image);
                    }
                }
            });
            return cloned;
        },
        getBlockLabel(type) {
            return {
                HeroBanner: 'Banner lớn (Hero Banner)',
                Promotions: 'Khuyến mãi lớn (Promotions)',
                ThreeSixtyViewer: 'Xoay 360 độ (360 Viewer)',
                FeaturesGrid: 'Khung lưới tính năng (Features Grid)',
                VersionsGrid: 'Danh sách các phiên bản (Versions Grid)',
                SpecsGrid: 'Bảng so sánh thông số (Specs Grid)',
                FeaturesList: 'Danh sách công nghệ (Features List)',
                AccordionFAQs: 'Câu hỏi thường gặp (Accordion FAQs)',
                BookingBanner: 'Tư vấn & Đặt lịch (Booking Banner)',
            }[type] || type
        },
        getBlockIcon(type) {
            return {
                HeroBanner: '📢',
                Promotions: '🎁',
                ThreeSixtyViewer: '🔄',
                FeaturesGrid: '🔲',
                VersionsGrid: '🚗',
                SpecsGrid: '📊',
                FeaturesList: '✨',
                AccordionFAQs: '❓',
                BookingBanner: '📞',
            }[type] || '📦'
        },
        addBlockType(type) {
            const newBlock = {
                type: type,
                is_collapsed: false,
                data: {}
            }

            // Initialize default structural settings
            if (type === 'HeroBanner') {
                newBlock.data = {
                    title: '',
                    tagline: '',
                    button_text: 'Tìm hiểu thêm',
                    button_link: '/lien-he',
                    background_image: null,
                    align: 'center',
                    title_size: 'medium',
                    title_color: '#ffffff',
                    tagline_color: '#ffffff'
                }
            } else if (type === 'Promotions') {
                newBlock.data = {
                    title: '',
                    description: '',
                    image: null,
                    button_text: 'Nhận báo giá ngay',
                    align: 'left',
                    title_size: 'medium',
                    title_color: '#0562d2',
                    desc_size: 'medium',
                    desc_color: '#1a1a1a'
                }
            } else if (type === 'ThreeSixtyViewer') {
                newBlock.data = {
                    title: '',
                    description: '',
                    align: 'left',
                    title_size: 'medium',
                    title_color: '#0562d2',
                    desc_size: 'medium',
                    desc_color: '#1a1a1a'
                }
            } else if (type === 'FeaturesGrid') {
                newBlock.data = {
                    title_1: '',
                    image_1: null,
                    image_2: null,
                    image_3: null,
                    title_2: '',
                    image_large: null,
                    title_3: '',
                    split_image: null,
                    split_title: '',
                    split_features: [
                        { value: '10-Cấp', label: 'Hộp số tự động điện tử' },
                        { value: 'Bi-Turbo 2.0L', label: 'Động cơ Diesel mạnh mẽ' }
                    ]
                }
            } else if (type === 'VersionsGrid') {
                newBlock.data = {
                    title: '',
                    descriptions: ['', '', '']
                }
            } else if (type === 'SpecsGrid') {
                newBlock.data = {}
            } else if (type === 'FeaturesList') {
                newBlock.data = {
                    features: [
                        { title: 'Hệ thống phanh khẩn cấp', description: 'Tự động phát hiện chướng ngại vật phía trước và phanh giảm thiểu tai nạn.', image: null }
                    ]
                }
            } else if (type === 'AccordionFAQs') {
                newBlock.data = {
                    faqs: [
                        { q: 'Chi phí bảo dưỡng xe định kỳ là bao nhiêu?', a: 'Tùy thuộc vào các cấp bảo dưỡng nhỏ hay lớn, trung bình giao động từ 1.5 - 4.5 triệu đồng.', is_open: true }
                    ]
                }
            } else if (type === 'BookingBanner') {
                newBlock.data = {
                    title: 'Kết nối ngay với chuyên viên Đồng Nai Ford',
                    phone: '1800 55 68 58',
                    btn_text: 'Đặt lịch hẹn',
                    btn_link: '/lien-he?reason=Đặt hẹn dịch vụ',
                    car_image: null,
                    title_size: 'medium',
                    title_color: '#ffffff'
                }
            }

            this.blocks.push(newBlock)
            this.$emit('update:modelValue', this.blocks)
            this.activeTab = 'sections'
            this.activeIndex = this.blocks.length - 1
        },
        removeBlock(index) {
            if (confirm('Bạn có chắc chắn muốn xóa khối nội dung này không?')) {
                this.blocks.splice(index, 1)
                this.$emit('update:modelValue', this.blocks)
                if (this.activeIndex === index) {
                    this.activeIndex = null
                } else if (this.activeIndex > index) {
                    this.activeIndex--
                }
            }
        },
        duplicateBlock(index) {
            const blockCopy = JSON.parse(JSON.stringify(this.blocks[index]))
            this.blocks.splice(index + 1, 0, blockCopy)
            this.$emit('update:modelValue', this.blocks)
            this.activeIndex = index + 1
        },

        // Helper methods for FeaturesGrid
        addSplitFeature(blockIndex) {
            if (!this.blocks[blockIndex].data.split_features) {
                this.blocks[blockIndex].data.split_features = []
            }
            this.blocks[blockIndex].data.split_features.push({ value: '', label: '' })
        },
        removeSplitFeature(blockIndex, featIndex) {
            this.blocks[blockIndex].data.split_features.splice(featIndex, 1)
        },

        // Helper methods for FeaturesList
        addFeature(blockIndex) {
            if (!this.blocks[blockIndex].data.features) {
                this.blocks[blockIndex].data.features = []
            }
            this.blocks[blockIndex].data.features.push({ title: '', description: '', image: null })
        },
        removeFeature(blockIndex, fIndex) {
            this.blocks[blockIndex].data.features.splice(fIndex, 1)
        },

        // Helper methods for AccordionFAQs
        addFaq(blockIndex) {
            if (!this.blocks[blockIndex].data.faqs) {
                this.blocks[blockIndex].data.faqs = []
            }
            this.blocks[blockIndex].data.faqs.push({ q: '', a: '', is_open: true })
        },
        removeFaq(blockIndex, faqIndex) {
            this.blocks[blockIndex].data.faqs.splice(faqIndex, 1)
        },
        toggleFaqOpen(blockIndex, faqIndex) {
            const faq = this.blocks[blockIndex].data.faqs[faqIndex]
            faq.is_open = !faq.is_open
        },

        // Image URL helpers
        resolveImageUrl(image) {
            if (!image) return ''
            if (typeof image === 'string') {
                if (image.startsWith('http') || image.startsWith('data:')) return image
                return this.staticUrl(image)
            }
            if (image.path) {
                if (image.path.startsWith('http') || image.path.startsWith('data:')) return image.path
                return this.staticUrl(image.path)
            }
            if (image.url) return image.url
            return ''
        },
        getBackgroundStyle(image) {
            const url = this.resolveImageUrl(image)
            if (url) {
                return { backgroundImage: `url(${url})` }
            }
            return {}
        }
    }
}
</script>

<style scoped>
/* Scrollbar styles for modern scroll */
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: #1e293b;
    border-radius: 20px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: #334155;
}

/* Dark Theme Design System Overrides for CMS Page Builder inputs */
.page-builder-container :deep(input[type="text"]),
.page-builder-container :deep(input[type="number"]),
.page-builder-container :deep(textarea),
.page-builder-container :deep(select),
.page-builder-container :deep(.p-inputtext),
.page-builder-container :deep(.p-inputtextarea),
.page-builder-container :deep(.p-dropdown),
.page-builder-container :deep(.p-selectbutton),
.page-builder-container :deep(.bg-gray-50) {
    background-color: #0d1527 !important; /* Premium dark navy input background matching dnf brand */
    color: #e2e8f0 !important; /* text-slate-200 */
    border: 1px solid #1e293b !important; /* border-slate-800 */
    border-radius: 8px !important;
    padding: 0.625rem 0.875rem !important;
    font-size: 0.8rem !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06) !important;
}

/* Specific Select Tag dropdown styling */
.page-builder-container :deep(select) {
    height: 42px !important;
    appearance: none !important;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
    background-repeat: no-repeat !important;
    background-position: right 0.75rem center !important;
    background-size: 1rem !important;
    padding-right: 2rem !important;
    cursor: pointer;
}

/* Hover and Focus States */
.page-builder-container :deep(input[type="text"]:hover),
.page-builder-container :deep(input[type="number"]:hover),
.page-builder-container :deep(textarea:hover),
.page-builder-container :deep(select:hover),
.page-builder-container :deep(.p-inputtext:hover),
.page-builder-container :deep(.p-inputtextarea:hover),
.page-builder-container :deep(.p-dropdown:hover) {
    border-color: #334155 !important; /* border-slate-700 */
    background-color: #111a2e !important;
}

.page-builder-container :deep(input[type="text"]:focus),
.page-builder-container :deep(input[type="number"]:focus),
.page-builder-container :deep(textarea:focus),
.page-builder-container :deep(select:focus),
.page-builder-container :deep(.p-inputtext:focus),
.page-builder-container :deep(.p-inputtextarea:focus),
.page-builder-container :deep(.p-dropdown:focus) {
    border-color: #0562d2 !important; /* Ford brand primary blue */
    background-color: #111a2e !important;
    box-shadow: 0 0 0 3px rgba(5, 98, 210, 0.2) !important;
    outline: none !important;
}

/* Textarea min height */
.page-builder-container :deep(textarea),
.page-builder-container :deep(.p-inputtextarea) {
    min-height: 84px !important;
    line-height: 1.6 !important;
    resize: vertical !important;
}

/* Dark layout overrides for file uploads & media selector */
.page-builder-container :deep(.bg-gray-50) {
    background-color: #0d1527 !important;
    border: 1px dashed #1e293b !important;
    border-radius: 8px !important;
    color: #94a3b8 !important;
    padding: 0.75rem !important;
}
.page-builder-container :deep(.bg-gray-50:hover) {
    background-color: #111a2e !important;
    border-color: #334155 !important;
    color: #cbd5e1 !important;
}
.page-builder-container :deep(.border-gray-400),
.page-builder-container :deep(.border-gray-300),
.page-builder-container :deep(.border-gray-250),
.page-builder-container :deep(.border-gray-200) {
    border-color: #1e293b !important;
    border-style: dashed !important;
}
.page-builder-container :deep(.text-gray-600),
.page-builder-container :deep(.text-gray-700) {
    color: #94a3b8 !important; /* slate-400 */
}

/* Premium Color picker swatch customization */
.page-builder-container input[type="color"] {
    -webkit-appearance: none;
    border: 1px solid #1e293b !important;
    border-radius: 8px !important;
    width: 42px !important;
    height: 42px !important;
    cursor: pointer;
    background: transparent !important;
    padding: 0 !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}
.page-builder-container input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0 !important;
}
.page-builder-container input[type="color"]::-webkit-color-swatch {
    border: none !important;
    border-radius: 7px !important;
}

/* Label visual design overrides (clean typography) */
.page-builder-container :deep(label),
.page-builder-container label {
    color: #94a3b8 !important; /* slate-400 text-muted */
    font-size: 11px !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    margin-bottom: 6px !important;
    display: block !important;
}

/* Design & Layout cards styling */
.page-builder-container .bg-slate-900,
.page-builder-container .border-slate-800 {
    background-color: #0b1329 !important; /* deep card navy */
    border-color: #1a2542 !important; /* slate-800 equivalent */
}

/* Alignment group button overrides */
.page-builder-container button.bg-slate-950 {
    background-color: #0d1527 !important;
    border-color: #1e293b !important;
}
.page-builder-container button.bg-slate-950:hover {
    background-color: #111a2e !important;
    color: #f8fafc !important;
}
.page-builder-container button.bg-blue-600 {
    background-color: #0562d2 !important; /* Ford blue */
    border-color: #0562d2 !important;
}
</style>
