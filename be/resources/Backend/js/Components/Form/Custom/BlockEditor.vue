<template>
    <div class="page-builder-container flex flex-col md:flex-row gap-6 h-[calc(100vh-160px)] min-h-[500px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden font-sans">
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
            <div class="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
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
            <div class="flex items-center px-4 py-3 bg-slate-900 border-b border-slate-800">
                <div class="flex space-x-1.5 mr-4 select-none">
                    <span class="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                    <span class="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                    <span class="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
                </div>
                <div class="flex-1 bg-slate-950 border border-slate-800 rounded-lg py-1 px-4 text-slate-500 text-xs font-mono truncate select-all flex items-center space-x-2">
                    <span class="text-slate-600">🌐 https://dongnaiford.com.vn/xe/chi-tiet-xem-truoc</span>
                </div>
                <span class="text-[10px] text-blue-400 font-bold uppercase ml-4 select-none tracking-widest bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                    Live Preview
                </span>
            </div>

            <!-- Visual Drag-and-Drop Page Preview Arena -->
            <div class="flex-1 overflow-y-auto bg-slate-950 p-6 scrollbar-thin scrollbar-thumb-slate-850 scrollbar-track-transparent">
                <!-- Virtual Website Layout Shell -->
                <div class="max-w-4xl mx-auto bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-850">
                    <!-- Simulated Header Navbar -->
                    <div class="bg-slate-950 px-6 py-4 border-b border-slate-850 flex justify-between items-center select-none">
                        <div class="flex items-center space-x-2">
                            <span class="text-white font-extrabold text-sm font-sans tracking-tight">DONGNAI <span class="text-blue-500">FORD</span></span>
                        </div>
                        <div class="flex space-x-4 text-xs font-bold text-slate-400">
                            <span>Sản phẩm</span>
                            <span>Ưu đãi</span>
                            <span>Dịch vụ</span>
                            <span>Tin tức</span>
                        </div>
                        <span class="bg-blue-600 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-full">Đăng ký lái thử</span>
                    </div>

                    <!-- Draggable Layout Preview Container -->
                    <Draggable
                        v-if="blocks && blocks.length > 0"
                        tag="div"
                        v-model="blocks"
                        item-key="id"
                        handle=".preview-handle"
                        :animation="200"
                        class="divide-y divide-slate-850 min-h-[400px]"
                    >
                        <template #item="{ index, element }">
                            <div 
                                class="relative group border-2 border-transparent hover:border-blue-500/80 transition"
                                :class="{'border-blue-500 bg-blue-950/5': activeIndex === index}"
                                @click="activeIndex = index"
                            >
                                <!-- Interactive Hover Controls & Drag Overlays -->
                                <div class="absolute top-2 left-2 z-30 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition duration-150">
                                    <span class="bg-blue-600 text-white font-black text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-md shadow-lg select-none">
                                        #{{ index + 1 }} {{ getBlockLabel(element.type) }}
                                    </span>
                                </div>
                                <div class="absolute top-2 right-2 z-30 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition duration-150">
                                    <!-- Drag Handle -->
                                    <div class="preview-handle cursor-move bg-blue-600 text-white hover:bg-blue-500 p-1.5 rounded-md shadow-lg transition">
                                        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                            <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                                        </svg>
                                    </div>
                                    <!-- Edit -->
                                    <button type="button" class="bg-slate-800 text-white hover:bg-slate-700 p-1.5 rounded-md shadow-lg border border-slate-700 text-xs" @click.stop="activeIndex = index">
                                        ✏️ Sửa
                                    </button>
                                    <!-- Duplicate -->
                                    <button type="button" class="bg-slate-800 text-white hover:bg-slate-700 p-1.5 rounded-md shadow-lg border border-slate-700 text-xs" @click.stop="duplicateBlock(index)">
                                        ➕
                                    </button>
                                    <!-- Delete -->
                                    <button type="button" class="bg-red-600 text-white hover:bg-red-500 p-1.5 rounded-md shadow-lg text-xs" @click.stop="removeBlock(index)">
                                        ✕
                                    </button>
                                </div>

                                <!-- HIGH-FIDELITY COMPONENT PREVIEWS -->
                                <div class="preview-inner select-none pointer-events-none">
                                    <!-- 1. HeroBanner Live Preview -->
                                    <div 
                                        v-if="element.type === 'HeroBanner'" 
                                        class="relative h-72 w-full bg-cover bg-center flex items-center justify-center overflow-hidden transition-all duration-200"
                                        :style="getBackgroundStyle(element.data.background_image)"
                                    >
                                        <div class="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-slate-950/20 z-10"></div>
                                        <div class="relative z-20 text-center px-8 max-w-lg">
                                            <h1 class="text-2xl md:text-3xl font-black text-white uppercase tracking-wider mb-2 drop-shadow">
                                                {{ element.data.title || 'CHƯA NHẬP TIÊU ĐỀ BANNER' }}
                                            </h1>
                                            <p class="text-xs md:text-sm text-slate-300 font-light tracking-wide mb-4 drop-shadow">
                                                {{ element.data.tagline || 'Hãy nhập câu khẩu hiệu cho dòng xe này...' }}
                                            </p>
                                            <span class="inline-block bg-[#0562D2] text-white px-5 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider">
                                                {{ element.data.button_text || 'Tìm hiểu thêm' }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- 2. Promotions Live Preview -->
                                    <div v-else-if="element.type === 'Promotions'" class="p-8 bg-slate-900/40 border-y border-slate-850 flex flex-col md:flex-row items-center gap-6">
                                        <div class="flex-1 space-y-3">
                                            <span class="text-[9px] bg-red-600 text-white font-bold px-2 py-0.5 rounded">ƯU ĐÃI LỚN TRONG THÁNG</span>
                                            <h2 class="text-lg font-extrabold text-white">
                                                {{ element.data.title || 'Tiêu đề chương trình khuyến mãi' }}
                                            </h2>
                                            <p class="text-xs text-slate-400 leading-relaxed max-w-md">
                                                {{ element.data.description || 'Chi tiết quà tặng tặng tiền mặt, bảo hiểm vật chất, gói phụ kiện chính hãng kèm cam kết giao xe ngay...' }}
                                            </p>
                                            <span class="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase">
                                                {{ element.data.button_text || 'Nhận báo giá ngay' }}
                                            </span>
                                        </div>
                                        <div class="w-full md:w-48 h-32 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                                            <img v-if="element.data.image" :src="resolveImageUrl(element.data.image)" class="w-full h-full object-cover" />
                                            <div v-else class="text-slate-600 text-[10px] text-center italic p-3">Chưa tải ảnh lên</div>
                                        </div>
                                    </div>

                                    <!-- 3. ThreeSixtyViewer Live Preview -->
                                    <div v-else-if="element.type === 'ThreeSixtyViewer'" class="p-8 bg-slate-950 border-y border-slate-850 text-center">
                                        <h3 class="text-sm font-extrabold text-slate-200 uppercase tracking-widest mb-1">
                                            {{ element.data.title || 'TRẢI NGHIỆM GÓC NHÌN 360°' }}
                                        </h3>
                                        <p class="text-[11px] text-slate-500 mb-6 max-w-sm mx-auto">
                                            {{ element.data.description || 'Xoay chuột hoặc vuốt tay để ngắm toàn diện ngoại thất của xe' }}
                                        </p>
                                        
                                        <!-- Simulated 360 Frame -->
                                        <div class="relative max-w-md mx-auto aspect-[16/9] bg-slate-900 border border-slate-850 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-[1.01] transition duration-200">
                                            <span class="absolute top-3 left-3 text-[9px] text-slate-500 tracking-wider">🔄 MÔ PHỎNG 360 VIEW</span>
                                            <!-- Car Mockup placeholder image -->
                                            <div class="text-center p-4">
                                                <span class="text-4xl">🚘</span>
                                                <p class="text-[10px] text-slate-500 mt-2">Nhấp giữ kéo xoay xe (Giả lập màn hình)</p>
                                            </div>
                                            <!-- Rotate Indicator -->
                                            <div class="absolute bottom-4 inset-x-0 flex justify-center">
                                                <span class="bg-black/60 border border-slate-800 text-white rounded-full p-2.5 text-xs shadow-lg animate-bounce">
                                                    🔄
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <!-- Color Selection Mockup -->
                                        <div class="flex justify-center space-x-2.5 mt-5">
                                            <span class="w-6 h-6 rounded-full border border-slate-700 bg-red-600 cursor-pointer shadow-lg"></span>
                                            <span class="w-6 h-6 rounded-full border border-slate-700 bg-slate-950 cursor-pointer shadow-lg ring-2 ring-blue-500"></span>
                                            <span class="w-6 h-6 rounded-full border border-slate-700 bg-slate-200 cursor-pointer shadow-lg"></span>
                                            <span class="w-6 h-6 rounded-full border border-slate-700 bg-slate-500 cursor-pointer shadow-lg"></span>
                                            <span class="w-6 h-6 rounded-full border border-slate-700 bg-amber-600 cursor-pointer shadow-lg"></span>
                                        </div>
                                    </div>

                                    <!-- 4. FeaturesGrid Live Preview -->
                                    <div v-else-if="element.type === 'FeaturesGrid'" class="p-8 bg-slate-900/30 border-y border-slate-850 space-y-6">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <!-- Section 1: Design Grid -->
                                            <div class="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between min-h-[200px]">
                                                <div>
                                                    <span class="text-[9px] text-blue-500 font-extrabold uppercase">Thiết kế xe</span>
                                                    <h4 class="text-xs font-bold text-white mt-1">{{ element.data.title_1 || 'Ấn tượng từ cái nhìn đầu tiên' }}</h4>
                                                </div>
                                                <div class="mt-4 grid grid-cols-3 gap-2 flex-1">
                                                    <div class="col-span-3 rounded-lg overflow-hidden border border-slate-850 bg-slate-900 flex items-center justify-center h-20">
                                                        <img v-if="element.data.image_1" :src="resolveImageUrl(element.data.image_1)" class="w-full h-full object-cover" />
                                                        <span v-else class="text-[9px] text-slate-600">Ảnh chính</span>
                                                    </div>
                                                    <div class="rounded-lg overflow-hidden border border-slate-850 bg-slate-900 flex items-center justify-center h-12">
                                                        <img v-if="element.data.image_2" :src="resolveImageUrl(element.data.image_2)" class="w-full h-full object-cover" />
                                                        <span v-else class="text-[9px] text-slate-650">Góc nghiêng</span>
                                                    </div>
                                                    <div class="rounded-lg overflow-hidden border border-slate-850 bg-slate-900 flex items-center justify-center h-12">
                                                        <img v-if="element.data.image_3" :src="resolveImageUrl(element.data.image_3)" class="w-full h-full object-cover" />
                                                        <span v-else class="text-[9px] text-slate-650">Đuôi xe</span>
                                                    </div>
                                                    <div class="rounded-lg border border-dashed border-slate-800 bg-slate-900 flex items-center justify-center h-12 text-[9px] text-slate-600 italic">
                                                        + Thêm ảnh
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Section 2: Interior Grid -->
                                            <div class="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between min-h-[200px]">
                                                <div>
                                                    <span class="text-[9px] text-blue-500 font-extrabold uppercase">Không gian Nội thất</span>
                                                    <h4 class="text-xs font-bold text-white mt-1">{{ element.data.title_2 || 'Sang trọng & Tiện nghi rộng rãi' }}</h4>
                                                </div>
                                                <div class="mt-4 rounded-xl overflow-hidden border border-slate-850 bg-slate-900 flex-1 flex items-center justify-center min-h-[100px]">
                                                    <img v-if="element.data.image_large" :src="resolveImageUrl(element.data.image_large)" class="w-full h-full object-cover" />
                                                    <span v-else class="text-[9px] text-slate-600 p-4 text-center">Chưa chọn ảnh nội thất chính</span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Section 3: Specs Split Grid -->
                                        <div class="bg-slate-950 border border-slate-850 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                            <div class="rounded-xl overflow-hidden border border-slate-850 bg-slate-900 aspect-video flex items-center justify-center">
                                                <img v-if="element.data.split_image" :src="resolveImageUrl(element.data.split_image)" class="w-full h-full object-cover" />
                                                <span v-else class="text-[9px] text-slate-600">Ảnh công nghệ động cơ</span>
                                            </div>
                                            <div class="space-y-4">
                                                <div>
                                                    <span class="text-[9px] text-blue-500 font-extrabold uppercase">Khả năng vận hành</span>
                                                    <h4 class="text-xs font-bold text-white mt-1">{{ element.data.split_title || 'Động cơ & Tính năng vượt trội' }}</h4>
                                                </div>
                                                <div class="grid grid-cols-2 gap-3">
                                                    <div v-for="(feat, fIndex) in element.data.split_features" :key="fIndex" class="bg-slate-900 border border-slate-850 p-3 rounded-xl">
                                                        <p class="text-xs font-black text-blue-400 tracking-tight">{{ feat.value || '10-Cấp' }}</p>
                                                        <p class="text-[9px] text-slate-500 mt-0.5">{{ feat.label || 'Hộp số tự động' }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 5. VersionsGrid Live Preview -->
                                    <div v-else-if="element.type === 'VersionsGrid'" class="p-8 bg-slate-950 border-y border-slate-850">
                                        <h3 class="text-sm font-extrabold text-slate-200 uppercase text-center mb-6">
                                            {{ element.data.title || 'CÁC PHIÊN BẢN XE' }}
                                        </h3>
                                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div 
                                                v-for="indexMock in [1, 2, 3]" 
                                                :key="indexMock" 
                                                class="bg-slate-900 border border-slate-850 rounded-xl p-4.5 space-y-3 shadow-md hover:border-slate-700 transition"
                                            >
                                                <div class="flex justify-between items-start">
                                                    <h4 class="text-xs font-extrabold text-white">Everest Phiên bản {{ indexMock }}</h4>
                                                    <span class="text-[9px] bg-blue-900/50 text-blue-400 font-bold px-1.5 py-0.5 rounded border border-blue-800">4x4</span>
                                                </div>
                                                <p class="text-[10px] text-slate-400 leading-normal line-clamp-3">
                                                    {{ element.data.descriptions && element.data.descriptions[indexMock - 1] || 'Thông tin giới thiệu động cơ, hộp số, và tiện nghi nội thất cho phiên bản này.' }}
                                                </p>
                                                <div class="pt-2 border-t border-slate-800 flex justify-between items-center">
                                                    <span class="text-slate-500 text-[9px]">Giá dự kiến:</span>
                                                    <span class="text-blue-400 font-black text-xs">Liên hệ</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 6. SpecsGrid Live Preview -->
                                    <div v-else-if="element.type === 'SpecsGrid'" class="p-8 bg-slate-900/20 border-y border-slate-850">
                                        <h3 class="text-sm font-extrabold text-slate-200 uppercase text-center mb-6">BẢNG SO SÁNH THÔNG SỐ CHI TIẾT</h3>
                                        <div class="border border-slate-850 rounded-xl overflow-hidden text-xs bg-slate-950">
                                            <div class="grid grid-cols-4 bg-slate-900 p-3 border-b border-slate-850 font-bold text-slate-300 text-[10px]">
                                                <div>Thông số kỹ thuật</div>
                                                <div class="text-center text-blue-400">Phiên bản Titanium+</div>
                                                <div class="text-center text-slate-400">Phiên bản Sport</div>
                                                <div class="text-center text-slate-400">Phiên bản Ambiente</div>
                                            </div>
                                            <div class="divide-y divide-slate-850/60 text-[10px] text-slate-400">
                                                <div class="grid grid-cols-4 p-3 hover:bg-slate-900/30">
                                                    <div class="font-semibold text-slate-300">Động cơ</div>
                                                    <div class="text-center">Bi-Turbo 2.0L Diesel</div>
                                                    <div class="text-center">Single-Turbo 2.0L Diesel</div>
                                                    <div class="text-center">Single-Turbo 2.0L Diesel</div>
                                                </div>
                                                <div class="grid grid-cols-4 p-3 hover:bg-slate-900/30">
                                                    <div class="font-semibold text-slate-300">Hộp số</div>
                                                    <div class="text-center">Tự động 10 cấp điện tử</div>
                                                    <div class="text-center">Tự động 6 cấp</div>
                                                    <div class="text-center">Tự động 6 cấp</div>
                                                </div>
                                                <div class="grid grid-cols-4 p-3 hover:bg-slate-900/30">
                                                    <div class="font-semibold text-slate-300">Màn hình giải trí</div>
                                                    <div class="text-center">12-inch TFT cảm ứng dọc</div>
                                                    <div class="text-center">10.1-inch cảm ứng dọc</div>
                                                    <div class="text-center">10.1-inch cảm ứng dọc</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 7. FeaturesList Live Preview -->
                                    <div v-else-if="element.type === 'FeaturesList'" class="p-8 bg-slate-950 border-y border-slate-850 space-y-6">
                                        <h3 class="text-sm font-extrabold text-slate-200 uppercase text-center mb-2">TÍNH NĂNG VÀ CÔNG NGHỆ NỔI BẬT</h3>
                                        <div class="space-y-6 max-w-2xl mx-auto">
                                            <div 
                                                v-for="(feature, fIndex) in element.data.features" 
                                                :key="fIndex" 
                                                class="flex flex-col md:flex-row items-center gap-6"
                                                :class="{'md:flex-row-reverse': fIndex % 2 === 1}"
                                            >
                                                <div class="flex-1 space-y-2">
                                                    <h4 class="text-xs font-extrabold text-white flex items-center gap-2">
                                                        <span class="w-5 h-5 rounded-full bg-blue-900/60 border border-blue-800 text-[10px] text-blue-400 flex items-center justify-center font-bold">✓</span>
                                                        <span>{{ feature.title || 'Tên tính năng nổi bật' }}</span>
                                                    </h4>
                                                    <p class="text-[10px] text-slate-400 leading-relaxed">
                                                        {{ feature.description || 'Mô tả chi tiết tính năng của xe. Động cơ cải tiến giúp nâng cao hiệu suất và tiết kiệm nhiên liệu tối đa.' }}
                                                    </p>
                                                </div>
                                                <div class="w-full md:w-56 h-36 rounded-2xl overflow-hidden border border-slate-850 bg-slate-900 flex items-center justify-center">
                                                    <img v-if="feature.image" :src="resolveImageUrl(feature.image)" class="w-full h-full object-cover" />
                                                    <span v-else class="text-3xl">🛠️</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 8. AccordionFAQs Live Preview -->
                                    <div v-else-if="element.type === 'AccordionFAQs'" class="p-8 bg-slate-900/20 border-y border-slate-850">
                                        <h3 class="text-sm font-extrabold text-slate-200 uppercase text-center mb-6">CÂU HỎI THƯỜNG GẶP (FAQs)</h3>
                                        <div class="max-w-xl mx-auto space-y-3.5">
                                            <div v-for="(faq, faqIndex) in element.data.faqs" :key="faqIndex" class="border border-slate-850 rounded-xl bg-slate-950 overflow-hidden">
                                                <div class="flex justify-between items-center p-4 bg-slate-900/50 cursor-pointer hover:bg-slate-900 transition" @click.stop="toggleFaqOpen(index, faqIndex)">
                                                    <span class="text-xs font-bold text-slate-200">{{ faq.q || 'Đặt câu hỏi của bạn tại đây?' }}</span>
                                                    <span class="text-xs text-slate-500">{{ faq.is_open ? '▲' : '▼' }}</span>
                                                </div>
                                                <div v-show="faq.is_open" class="p-4 border-t border-slate-850/60 text-[11px] text-slate-400 leading-relaxed bg-slate-950">
                                                    {{ faq.a || 'Nhập câu trả lời ngắn gọn và súc tích để khách hàng tham khảo...' }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Draggable>

                    <!-- Drag-and-drop Area Empty State -->
                    <div v-else class="flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-12 text-center select-none text-slate-500 m-8">
                        <span class="text-4xl mb-3">🎨</span>
                        <h4 class="text-sm font-bold text-slate-300">Bắt đầu thiết kế trang xe trực tuyến</h4>
                        <p class="text-xs max-w-xs text-slate-500 mt-2 leading-relaxed">
                            Bấm chọn các khối từ thư viện ở bảng bên trái như <b>Banner lớn</b>, <b>Xoay xe 360°</b> hay <b>Bảng so sánh thông số</b> để dựng trang động cho dòng xe này.
                        </p>
                    </div>
                </div>
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
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            activeTab: 'sections', // 'sections' or 'library'
            activeIndex: null, // Index of the block being edited in Left Panel
            libraryBlocks: [
                { type: 'HeroBanner', icon: '📢', name: 'Banner lớn (Hero)', desc: 'Banner trần viền ấn tượng, có chữ và nút bấm hành động' },
                { type: 'Promotions', icon: '🎁', name: 'Ưu đãi khuyến mãi', desc: 'Thông tin quà tặng tiền mặt, bảo hiểm và quà độc quyền' },
                { type: 'ThreeSixtyViewer', icon: '🔄', name: 'Trình xem xoay 360°', desc: 'Mô phỏng đổi màu ngoại thất xe và tự do xoay góc nhìn' },
                { type: 'FeaturesGrid', icon: '🔲', name: 'Khung lưới tính năng', desc: 'Bố cục ghép ảnh dạng lưới cho Thiết kế, Nội thất, Công nghệ' },
                { type: 'VersionsGrid', icon: '🚗', name: 'Danh sách các phiên bản', desc: 'So sánh ngắn và hiển thị các phiên bản cùng mức giá' },
                { type: 'SpecsGrid', icon: '📊', name: 'Bảng so sánh thông số', desc: 'So sánh song song thông số chi tiết động cơ, hộp số...' },
                { type: 'FeaturesList', icon: '✨', name: 'Danh sách công nghệ', desc: 'Liệt kê so le các tính năng lái an toàn chủ động' },
                { type: 'AccordionFAQs', icon: '❓', name: 'Câu hỏi thường gặp', desc: 'Các thắc mắc xếp gập về bảo dưỡng, giá lăn bánh' },
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
        }
    },
    watch: {
        blocks: {
            handler(newVal) {
                // Keep active index in bounds if list size shrinks
                if (this.activeIndex !== null && this.activeIndex >= newVal.length) {
                    this.activeIndex = null
                }
            },
            deep: true
        }
    },
    methods: {
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
                }
            } else if (type === 'Promotions') {
                newBlock.data = {
                    title: '',
                    description: '',
                    image: null,
                    button_text: 'Nhận báo giá ngay',
                }
            } else if (type === 'ThreeSixtyViewer') {
                newBlock.data = {
                    title: '',
                    description: '',
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
</style>
