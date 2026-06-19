<template layout>
    <Form v-model="formData" :config="{ wide: activeFormTab === 'builder' }">
        <template #default="{ form, submit }">

            <!-- ===== MAIN FORM TABS ===== -->
            <div class="mb-5 bg-white p-3 rounded-lg shadow-xs border border-gray-200 flex flex-wrap gap-2">
                <button v-for="tab in tabs" :key="tab.id" type="button"
                    class="py-2 px-4 text-xs md:text-sm font-semibold rounded transition-all cursor-pointer border-0"
                    :class="activeFormTab === tab.id ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent'"
                    @click="activeFormTab = tab.id"
                >
                    {{ tab.name }}
                </button>
            </div>

            <!-- Tab 1: Thông tin chung & Ảnh -->
            <div v-show="activeFormTab === 'general'" class="space-y-4">
                <div class="card">
                    <!-- Thông tin cơ bản -->
                    <div class="card-body">
                        <p class="text-sm font-semibold text-gray-500 uppercase mb-3">Thông tin dòng xe</p>
                        <Field v-model="form[currentTab].title" :field="{
                            type: 'text',
                            name: `title_${currentTab}`,
                            label: 'Tên dòng xe',
                            placeholder: 'vd: Ford Everest 2026',
                        }" />
                        <Field v-model="form[currentTab].tagline" :field="{
                            type: 'text',
                            name: `tagline_${currentTab}`,
                            label: 'Tagline / Slogan xe',
                            placeholder: 'vd: Thống lĩnh mọi địa hình',
                        }" />
                        <Field v-model="form[currentTab].description" :field="{
                            type: 'richtext',
                            name: `description_${currentTab}`,
                            label: 'Mô tả chi tiết',
                        }" />
                    </div>
                </div>

                <!-- Hình ảnh dòng xe (KHÔNG dịch) -->
                <div class="card mt-4">
                    <div class="card-header font-bold text-gray-700">Hình ảnh dòng xe</div>
                    <div class="card-body">
                        <Field v-model="form.image_thumbnail" :field="{
                            type: 'file_upload',
                            name: 'image_thumbnail',
                            label: 'Ảnh Thumbnail đại diện ở các card',
                        }" />
                        <Field v-model="form.image_featured" :field="{
                            type: 'file_upload',
                            name: 'image_featured',
                            label: 'Ảnh Thumbnail hiển thị ở slider homepage',
                        }" />
                        <Field v-model="form.video_url" :field="{
                            type: 'text',
                            name: 'video_url',
                            label: 'Đường dẫn Video (YouTube hoặc link MP4 trực tiếp)',
                            placeholder: 'vd: https://www.youtube.com/watch?v=... hoặc /uploads/video.mp4',
                        }" />
                        <Field v-model="form.video" :field="{
                            type: 'file_upload',
                            name: 'video',
                            label: 'Tải lên Video nền dòng xe (MP4)',
                            accept: 'video/mp4, video/x-m4v, video/*',
                        }" />
                    </div>
                </div>
            </div>



            <!-- Tab 3: Phiên bản & Thông số -->
            <div v-show="activeFormTab === 'versions'">
                <!-- Phiên bản & Thông số kỹ thuật -->
                <div class="card mt-4">
                    <div class="card-header font-bold text-gray-700">Phiên bản & Thông số kỹ thuật (Versions & Specs)</div>
                    <div class="card-body">
                        <div v-if="!form.versions || form.versions.length === 0" class="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <span class="text-3xl">⚙️</span>
                            <p class="text-sm text-gray-500 mt-2 font-medium">Chưa có phiên bản nào cho dòng xe này</p>
                            <button type="button" class="mt-4 btn btn-indigo btn-sm" @click="addVersion">
                                + Thêm phiên bản xe đầu tiên
                            </button>
                        </div>
                        <div v-else class="grid grid-cols-12 gap-6">
                            <!-- SIDEBAR (3/12 cols) -->
                            <div class="col-span-12 lg:col-span-4 xl:col-span-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-200 flex flex-col gap-3">
                                <div class="flex items-center justify-between pb-2 border-b border-gray-200">
                                    <span class="font-bold text-xs uppercase text-gray-500 tracking-wider">Danh sách phiên bản</span>
                                    <span class="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {{ form.versions.length }} phiên bản
                                    </span>
                                </div>

                                <Draggable
                                    v-model="form.versions"
                                    item-key="id"
                                    handle=".version-drag-handle"
                                    :animation="200"
                                    class="space-y-2 max-h-[500px] overflow-y-auto pr-1"
                                >
                                    <template #item="{ element, index }">
                                        <div 
                                            class="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition duration-155 group"
                                            :class="activeVersionIndex === index 
                                                ? 'bg-indigo-50/80 border-indigo-250 ring-2 ring-indigo-500/10' 
                                                : 'bg-white hover:bg-gray-50 border-gray-200'"
                                            @click="activeVersionIndex = index"
                                        >
                                            <div class="flex items-center space-x-2.5 overflow-hidden">
                                                <!-- Drag Handle -->
                                                <div class="version-drag-handle cursor-grab text-gray-400 hover:text-gray-600 transition shrink-0">
                                                    ☰
                                                </div>
                                                <!-- Status indicator dot -->
                                                <span class="w-2.5 h-2.5 rounded-full shrink-0" 
                                                      :class="element.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-450'">
                                                </span>
                                                <!-- Version Name -->
                                                <span class="text-xs font-bold text-gray-700 truncate">
                                                    {{ element.vi?.name || 'Phiên bản chưa đặt tên' }}
                                                </span>
                                            </div>
                                            <!-- Version Actions -->
                                            <div class="flex items-center gap-1 shrink-0">
                                                <button 
                                                    type="button" 
                                                    class="text-indigo-600 hover:text-indigo-800 text-xs bg-indigo-50 hover:bg-indigo-100 w-5 h-5 flex items-center justify-center rounded-md border-0 cursor-pointer shrink-0 transition"
                                                    @click.stop="duplicateVersion(index)"
                                                    title="Nhân bản phiên bản này"
                                                >
                                                    📋
                                                </button>
                                                <button 
                                                    type="button" 
                                                    class="text-red-500 hover:text-red-700 text-xs bg-red-50 hover:bg-red-100 w-5 h-5 flex items-center justify-center rounded-md border-0 cursor-pointer shrink-0 transition"
                                                    @click.stop="removeVersion(index)"
                                                    title="Xóa phiên bản"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    </template>
                                </Draggable>

                                <button type="button" class="btn btn-secondary btn-sm mt-2 w-full justify-center" @click="addVersion">
                                    + Thêm phiên bản xe
                                </button>
                            </div>

                            <!-- DETAIL PANE (9/12 cols) -->
                            <div class="col-span-12 lg:col-span-8 xl:col-span-9 space-y-5 bg-white p-5 rounded-2xl border border-gray-200" v-if="form.versions[activeVersionIndex]">
                                <div class="flex justify-between items-center pb-3 border-b border-gray-150">
                                    <div class="flex items-center gap-2">
                                        <span class="w-2.5 h-2.5 rounded-full" :class="form.versions[activeVersionIndex].status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                                        <h4 class="font-bold text-gray-800 text-sm md:text-base">
                                            Cấu hình: {{ form.versions[activeVersionIndex].vi?.name || 'Phiên bản chưa đặt tên' }}
                                        </h4>
                                    </div>
                                    <button type="button" class="text-red-600 hover:text-red-800 font-bold text-xs bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition cursor-pointer" @click="removeVersion(activeVersionIndex)">
                                        ✕ Xóa phiên bản này
                                    </button>
                                </div>

                                <!-- Quick Tools Panel -->
                                <div class="flex flex-wrap items-center gap-3 bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-150/60">
                                    <span class="text-xs font-bold text-indigo-900 flex items-center gap-1">
                                        <span>⚡</span>
                                        <span>Công cụ nhanh:</span>
                                    </span>
                                    
                                    <button 
                                        type="button" 
                                        @click="showSpecsImportModal = !showSpecsImportModal" 
                                        class="text-xs bg-white hover:bg-gray-50 text-indigo-700 font-bold px-3 py-1.5 rounded-lg border border-indigo-200 transition cursor-pointer"
                                    >
                                        📥 Nhập specs nhanh từ text
                                    </button>

                                    <!-- Clone Colors from other version -->
                                    <select 
                                        v-if="form.versions && form.versions.length > 1" 
                                        @change="handleCloneColorsFromVersion($event)" 
                                        class="bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-750 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="">🎨 Sao chép màu từ phiên bản khác...</option>
                                        <option v-for="(v, idx) in form.versions" :key="idx" :value="idx" v-show="idx !== activeVersionIndex">
                                            {{ v.vi?.name || `Phiên bản #${idx + 1}` }}
                                        </option>
                                    </select>

                                    <!-- Clone Specs from other version -->
                                    <select 
                                        v-if="form.versions && form.versions.length > 1" 
                                        @change="handleCloneSpecsFromVersion($event)" 
                                        class="bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-750 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="">📋 Sao chép specs từ phiên bản khác...</option>
                                        <option v-for="(v, idx) in form.versions" :key="idx" :value="idx" v-show="idx !== activeVersionIndex">
                                            {{ v.vi?.name || `Phiên bản #${idx + 1}` }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Collapsible Text Importer -->
                                <div v-if="showSpecsImportModal" class="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3">
                                    <div class="flex justify-between items-center">
                                        <h5 class="text-xs font-bold text-gray-700">Dán danh sách thông số kỹ thuật (dán trực tiếp từ web/brochure/Excel)</h5>
                                        <button type="button" @click="showSpecsImportModal = false" class="text-gray-450 hover:text-gray-600 text-xs bg-transparent border-0 cursor-pointer">Đóng</button>
                                    </div>
                                    <textarea 
                                        v-model="specsImportText" 
                                        rows="8" 
                                        class="w-full text-xs p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 bg-white"
                                        placeholder="Vận hành&#10;Động cơ: Xăng EcoBoost 1.5L&#10;Công suất cực đại: 160 mã lực&#10;&#10;Ngoại thất&#10;Đèn pha: LED Matrix&#10;Mâm xe: Hợp kim 18 inch"
                                    ></textarea>
                                    <div class="flex justify-end gap-2">
                                        <button type="button" @click="executeSpecsImport" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition border-0">Xử lý & Nhập thông số</button>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <!-- Tên phiên bản bằng Tiếng Việt -->
                                    <Field v-model="form.versions[activeVersionIndex].vi.name" :field="{
                                        type: 'text',
                                        name: 'version_name_vi_' + activeVersionIndex,
                                        label: 'Tên phiên bản',
                                        placeholder: 'vd: Titanium 1.5L AT',
                                    }" />
                                    
                                    <!-- Giá phiên bản -->
                                    <Field v-model="form.versions[activeVersionIndex].price" :field="{
                                        type: 'money',
                                        name: 'version_price_' + activeVersionIndex,
                                        label: 'Giá bán (VNĐ)',
                                    }" />
                                </div>

                                <div class="mb-4 bg-white p-4 rounded-xl border border-gray-200">
                                    <!-- Ảnh đặc trưng phiên bản -->
                                    <Field 
                                        :key="'version_image_' + activeVersionIndex"
                                        v-model="form.versions[activeVersionIndex].image" 
                                        :field="{
                                            type: 'file_upload',
                                            name: 'version_image_' + activeVersionIndex,
                                            label: 'Ảnh đặc trưng của phiên bản (Hiển thị ở trang chi tiết xe)',
                                        }" 
                                    />
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <!-- Trạng thái hoạt động -->
                                    <Field v-model="form.versions[activeVersionIndex].status" :field="{
                                        type: 'radio_list',
                                        name: 'version_status_' + activeVersionIndex,
                                        label: 'Trạng thái phiên bản',
                                        options: [
                                            { id: 'ACTIVE', label: 'Hoạt động' },
                                            { id: 'INACTIVE', label: 'Tạm ẩn' },
                                        ]
                                    }" />

                                    <!-- Thứ tự sắp xếp -->
                                    <Field v-model="form.versions[activeVersionIndex].sort_order" :field="{
                                        type: 'number',
                                        name: 'version_sort_' + activeVersionIndex,
                                        label: 'Thứ tự sắp xếp',
                                    }" />
                                </div>

                                <!-- Version Colors List -->
                                <div class="border-t border-gray-150 pt-5 mt-5">
                                    <div class="flex justify-between items-center mb-3">
                                        <p class="text-sm font-bold text-emerald-750 uppercase flex items-center gap-1 cursor-pointer select-none" @click="showColorsSection = !showColorsSection">
                                            <span>🎨</span>
                                            <span>Màu sắc riêng của phiên bản này (Colors)</span>
                                            <span class="text-gray-400 text-xs font-normal normal-case ml-1">{{ showColorsSection ? '▼' : '►' }}</span>
                                        </p>
                                        <button v-show="showColorsSection" type="button" class="text-xs text-emerald-600 hover:text-emerald-800 font-bold bg-transparent border-0 cursor-pointer" @click="addVersionColor(activeVersionIndex)">
                                            ＋ Thêm màu mới cho phiên bản
                                        </button>
                                    </div>

                                    <div v-show="showColorsSection" class="space-y-4">
                                        <div v-for="(color, cIdx) in form.versions[activeVersionIndex].colors" :key="cIdx" class="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:shadow-xs transition duration-150 relative">
                                            <button 
                                                type="button" 
                                                class="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 border border-red-200 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition" 
                                                @click="removeVersionColor(activeVersionIndex, cIdx)"
                                                title="Xóa màu này"
                                            >
                                                ✕
                                            </button>

                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Field v-model="form.versions[activeVersionIndex].colors[cIdx].name" :field="{
                                                    type: 'text',
                                                    name: 'ver_' + activeVersionIndex + '_color_name_' + cIdx,
                                                    label: 'Tên màu sắc',
                                                    placeholder: 'vd: Trắng Pearl / Đen Panther',
                                                }" />
                                                
                                                <div class="field">
                                                    <label class="flex items-center label mb-1">
                                                        <span class="text-xs font-bold text-gray-700">Mã màu Hex & Chọn màu trực quan</span>
                                                    </label>
                                                    <div class="flex items-center gap-2">
                                                        <input 
                                                            type="color" 
                                                            v-model="form.versions[activeVersionIndex].colors[cIdx].color_code"
                                                            class="w-11 h-[38px] p-0.5 rounded-lg border border-gray-300 cursor-pointer bg-white shrink-0"
                                                        />
                                                        <InputText 
                                                            type="text" 
                                                            v-model="form.versions[activeVersionIndex].colors[cIdx].color_code"
                                                            placeholder="vd: #ffffff"
                                                            class="w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="border-t border-gray-200 pt-3 mt-3 space-y-3">
                                                <p class="text-[11px] font-bold text-indigo-750 uppercase tracking-wider">Hình ảnh 360° phiên bản</p>
                                                
                                                <div class="bg-white p-3 rounded-lg border border-gray-150">
                                                    <Field 
                                                        :key="'ver_' + activeVersionIndex + '_color_image_360_internal_' + cIdx"
                                                        v-model="form.versions[activeVersionIndex].colors[cIdx].image_360_internal" 
                                                        :field="{
                                                            type: 'file_upload',
                                                            name: 'ver_' + activeVersionIndex + '_color_image_360_internal_' + cIdx,
                                                            label: 'Ảnh Panorama 360° (Nội thất)',
                                                        }" 
                                                    />
                                                </div>

                                                <div class="bg-white p-3 rounded-lg border border-gray-150">
                                                    <Field 
                                                        :key="'ver_' + activeVersionIndex + '_color_images_360_' + cIdx"
                                                        v-model="form.versions[activeVersionIndex].colors[cIdx].images_360" 
                                                        :field="{
                                                            type: 'file_upload',
                                                            name: 'ver_' + activeVersionIndex + '_color_images_360_' + cIdx,
                                                            label: 'Bộ ảnh xoay 360° Ngoại thất cho màu này (Chọn nhiều ảnh theo thứ tự xoay)',
                                                            multiple: true,
                                                        }" 
                                                    />
                                                </div>

                                                <div class="bg-white p-3 rounded-lg border border-gray-150">
                                                    <Field 
                                                        :key="'ver_' + activeVersionIndex + '_color_images_360_internal_' + cIdx"
                                                        v-model="form.versions[activeVersionIndex].colors[cIdx].images_360_internal" 
                                                        :field="{
                                                            type: 'file_upload',
                                                            name: 'ver_' + activeVersionIndex + '_color_images_360_internal_' + cIdx,
                                                            label: 'Bộ ảnh xoay 360° Nội thất cho màu này (Chọn nhiều ảnh theo thứ tự xoay)',
                                                            multiple: true,
                                                        }" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="!form.versions[activeVersionIndex].colors || form.versions[activeVersionIndex].colors.length === 0" class="text-xs text-gray-400 italic py-2">
                                            Chưa cấu hình màu sắc riêng nào cho phiên bản này. Phiên bản này sẽ kế thừa bảng màu chung của dòng xe.
                                        </div>
                                    </div>
                                </div>

                                <!-- Dynamic Specifications List -->
                                <div class="border-t border-gray-150 pt-5 mt-5">
                                    <div class="flex justify-between items-center mb-3">
                                        <p class="text-sm font-bold text-indigo-700 uppercase flex items-center gap-1 cursor-pointer select-none" @click="showSpecsSection = !showSpecsSection">
                                            <span>📋</span>
                                            <span>Nhóm thông số kỹ thuật chi tiết (Specs)</span>
                                            <span class="text-gray-400 text-xs font-normal normal-case ml-1">{{ showSpecsSection ? '▼' : '►' }}</span>
                                        </p>
                                        <button v-show="showSpecsSection" type="button" class="text-xs text-indigo-650 hover:text-indigo-850 font-bold bg-transparent border-0 cursor-pointer" @click="addCustomSpec(activeVersionIndex)">
                                            ＋ Thêm nhóm thông số mới
                                        </button>
                                    </div>
                                    
                                    <div v-show="showSpecsSection" class="space-y-4">
                                        <div v-for="(spec, sIdx) in form.versions[activeVersionIndex].customSpecs" :key="sIdx" class="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:shadow-xs transition duration-150 relative">
                                            <button 
                                                type="button" 
                                                class="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 border border-red-200 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition" 
                                                @click="removeCustomSpec(activeVersionIndex, sIdx)"
                                                title="Xóa nhóm thông số này"
                                            >
                                                ✕
                                            </button>

                                            <div class="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label class="block text-xs font-bold text-gray-700 mb-1">Tiêu đề nhóm thông số</label>
                                                    <input 
                                                        v-model="spec.title" 
                                                        type="text" 
                                                        class="w-full max-w-md bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                                                        placeholder="Tên nhóm (vd: Vận hành, Ngoại thất...)" 
                                                    />
                                                </div>
                                                <div>
                                                    <label class="block text-xs font-bold text-gray-700 mb-1">Nội dung chi tiết (RichText)</label>
                                                    <div class="border rounded-lg bg-white overflow-hidden">
                                                        <CustomEditor 
                                                            :modelValue="spec.content" 
                                                            @change="spec.content = $event" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="!form.versions[activeVersionIndex].customSpecs || form.versions[activeVersionIndex].customSpecs.length === 0" class="text-xs text-gray-400 italic py-2">
                                            Chưa cấu hình nhóm thông số nào cho phiên bản này. Hãy bấm "＋ Thêm nhóm thông số mới".
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 4: Thiết kế trang (Shopify Mode Fullscreen Editor Overlay) -->
            <teleport to="body">
                <div v-if="activeFormTab === 'builder'" class="fixed inset-0 z-[9999] bg-[#f6f6f7] flex flex-col font-sans select-none overflow-hidden h-screen w-screen">
                    <!-- Shopify-style Topbar -->
                    <div class="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-200 text-gray-900 shrink-0">
                        <div class="flex items-center space-x-4">
                            <button 
                                type="button" 
                                class="flex items-center text-xs font-bold text-gray-750 hover:text-gray-900 transition bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-lg border border-gray-300 cursor-pointer"
                                @click="activeFormTab = 'general'"
                            >
                                ← Quay lại
                            </button>
                            <div class="h-4 w-[1px] bg-gray-300"></div>
                            <div class="flex flex-col">
                                <span class="text-[9px] uppercase font-bold tracking-widest text-gray-500 font-mono">Trình dựng trang trực quan</span>
                                <span class="text-xs font-bold text-gray-900 mt-0.5">Shopify Editor Mode — {{ form.vi?.title || item.title || 'Dòng xe' }}</span>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-3">
                            <button 
                                type="button"
                                class="bg-white hover:bg-gray-50 text-gray-755 hover:text-gray-900 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors border border-solid border-gray-300 h-9 flex items-center justify-center"
                                @click="activeFormTab = 'general'"
                            >
                                Đóng
                            </button>
                            <button 
                                type="button"
                                class="bg-[#008060] hover:bg-[#006e52] disabled:bg-gray-300 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-xs border-0 h-9 flex items-center justify-center"
                                @click="submit"
                                :disabled="form.processing"
                            >
                                {{ form.processing ? 'Đang lưu...' : 'Lưu thay đổi' }}
                            </button>
                        </div>
                    </div>
                    
                    <!-- Flash Messages inside Fullscreen Editor -->
                    <div v-if="$page.props.flash?.success || $page.props.flash?.error || Object.keys($page.props.errors || {}).length > 0" class="px-6 py-2 bg-white border-b border-gray-200 shrink-0">
                        <FlashMessages />
                    </div>
                    
                    <!-- Fullscreen Workspace -->
                    <div class="flex-1 bg-[#f6f6f7] overflow-hidden relative h-full w-full">
                        <BlockEditor 
                            v-model="form.layout_blocks" 
                            :vehicle-slug="form.vi.slug || item.slug" 
                            :vehicle-data="form"
                            :fullscreen="true"
                        />
                    </div>
                </div>
            </teleport>

            <!-- Tab 4: Phụ kiện xe -->
            <div v-show="activeFormTab === 'accessories'" class="space-y-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-150 pb-5 mb-6">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">🎒 Chọn phụ kiện tương thích</h3>
                            <p class="text-sm text-gray-500 mt-1">Chọn các phụ kiện chính hãng tương thích với dòng xe này. Những phụ kiện được chọn sẽ tự động hiển thị trong trang chi tiết sản phẩm.</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-3">
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Đã chọn: {{ (form.accessories || []).length }} phụ kiện
                            </span>
                            <button 
                                type="button"
                                @click="form.accessories = []"
                                class="text-xs text-red-600 hover:text-red-800 font-semibold transition-colors cursor-pointer focus:outline-none"
                            >
                                Xóa tất cả
                            </button>
                        </div>
                    </div>

                    <!-- Filter & Search Controls -->
                    <div class="flex flex-col sm:flex-row gap-4 mb-6">
                        <div class="flex-1 relative">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input 
                                v-model="accessorySearch" 
                                type="text" 
                                placeholder="Tìm theo tên hoặc mã phụ kiện..." 
                                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                            />
                        </div>
                        <div class="sm:w-64">
                            <select 
                                v-model="accessoryFilterCategory" 
                                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 cursor-pointer"
                            >
                                <option value="all">Tất cả danh mục</option>
                                <option value="interior">Nội thất (Interior)</option>
                                <option value="exterior">Ngoại thất (Exterior)</option>
                                <option value="tech">Công nghệ (Tech)</option>
                                <option value="wheels">Mâm &amp; Lốp (Wheels)</option>
                                <option value="performance">Hiệu suất (Performance)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Accessories Grid -->
                    <div v-if="filteredAccessoriesList.length === 0" class="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                        <svg class="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4.5m15 3.5l-3-3m0 0l-3 3m3-3V17" />
                        </svg>
                        <p class="text-sm font-semibold text-gray-500">Không tìm thấy phụ kiện nào phù hợp</p>
                    </div>
                    
                    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2">
                        <div 
                            v-for="acc in filteredAccessoriesList" 
                            :key="acc.id"
                            @click="toggleAccessorySelection(acc.id)"
                            :class="[
                                'relative border rounded-lg p-4 cursor-pointer select-none transition-all duration-200 flex flex-col justify-between h-32 hover:scale-[1.01] hover:shadow-sm',
                                isAccessorySelected(acc.id) 
                                    ? 'border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500' 
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            ]"
                        >
                            <!-- Top Info -->
                            <div>
                                <div class="flex items-start justify-between gap-2">
                                    <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                                        {{ acc.code || 'N/A' }}
                                    </span>
                                    <!-- Selected Indicator -->
                                    <div 
                                        :class="[
                                            'w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 border',
                                            isAccessorySelected(acc.id)
                                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                                : 'border-gray-300 bg-white'
                                        ]"
                                    >
                                        <svg v-if="isAccessorySelected(acc.id)" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <h4 class="text-sm font-semibold text-gray-900 mt-1 line-clamp-2 pr-4 leading-tight">
                                    {{ acc.title }}
                                </h4>
                            </div>

                            <!-- Bottom Tag -->
                            <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100/50">
                                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {{ getCategoryLabel(acc.category) }}
                                </span>
                                <span 
                                    v-if="isInitiallyFit(acc)" 
                                    class="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"
                                    title="Phụ kiện này ban đầu được gắn nhãn tương thích trong DB"
                                >
                                    Đã gán
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab: Tính năng xe -->
            <div v-show="activeFormTab === 'features'" class="space-y-4">
                <!-- Quản lý các nhóm tính năng -->
                <div class="card bg-white border border-gray-200 rounded-2xl shadow-xs">
                    <div class="card-header font-bold text-gray-700 bg-gray-50 border-b border-gray-200 p-4 text-sm">
                        📁 Quản lý các nhóm tính năng
                    </div>
                    <div class="card-body p-4 space-y-4">
                        <div class="flex flex-wrap gap-2 items-center">
                            <span 
                                v-for="(cat, cIdx) in featureCategories" 
                                :key="cIdx"
                                class="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-150"
                            >
                                <span>{{ cat }}</span>
                                <button 
                                    type="button" 
                                    class="text-indigo-400 hover:text-indigo-650 font-bold bg-transparent border-0 cursor-pointer text-[10px] p-0.5 leading-none transition"
                                    @click="removeFeatureCategory(cIdx)"
                                    title="Xóa nhóm này"
                                >
                                    ✕
                                </button>
                            </span>
                        </div>
                        <div class="flex gap-2 max-w-md mt-2">
                            <InputText 
                                v-model="newCategoryName"
                                type="text"
                                placeholder="Nhập tên nhóm mới (vd: Nội thất, Ngoại thất...)"
                                class="w-full text-xs"
                                @keyup.enter="addFeatureCategory"
                            />
                            <button 
                                type="button" 
                                class="btn btn-indigo text-xs py-2 px-4 whitespace-nowrap"
                                @click="addFeatureCategory"
                            >
                                + Thêm nhóm
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Danh sách tính năng -->
                <div class="card bg-white border border-gray-200 rounded-2xl shadow-xs">
                    <div class="card-header font-bold text-gray-700 flex justify-between items-center bg-gray-50 border-b border-gray-200 p-4 text-sm">
                        <span>✨ Danh sách tính năng của xe</span>
                        <button 
                            type="button" 
                            @click="addFeature" 
                            class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition shadow-xs flex items-center gap-1.5"
                        >
                            <span>➕ Thêm tính năng mới</span>
                        </button>
                    </div>
                    <div class="card-body p-4 space-y-6">
                        <div v-if="!features || features.length === 0" class="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <span class="text-3xl">✨</span>
                            <p class="text-sm text-gray-500 mt-2 font-medium">Chưa có tính năng nào cho dòng xe này</p>
                            <button type="button" class="mt-4 btn btn-indigo btn-sm" @click="addFeature">
                                + Thêm tính năng đầu tiên
                            </button>
                        </div>
                        <div v-else class="space-y-4">
                            <div 
                                v-for="(feat, idx) in features" 
                                :key="idx" 
                                class="p-4 bg-gray-50 border border-gray-200 rounded-xl relative space-y-4 shadow-2xs"
                            >
                                <!-- Remove Button -->
                                <button 
                                    type="button" 
                                    @click="removeFeature(idx)" 
                                    class="absolute top-4 right-4 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-red-200 cursor-pointer transition-all"
                                >
                                    🗑️ Xóa
                                </button>

                                <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <!-- Title, Category & Description -->
                                    <div class="col-span-1 md:col-span-8 space-y-4">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div class="field">
                                                <label class="label text-xs font-bold text-gray-600 mb-1">Tên tính năng</label>
                                                <InputText 
                                                    v-model="feat.title" 
                                                    type="text" 
                                                    placeholder="vd: Hệ thống hỗ trợ đỗ xe tự động 2.0"
                                                    class="w-full"
                                                />
                                            </div>
                                            <div class="field">
                                                <label class="label text-xs font-bold text-gray-600 mb-1">Phân loại nhóm</label>
                                                <select 
                                                    v-model="feat.category"
                                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-[38px] cursor-pointer"
                                                >
                                                    <option v-for="cat in featureCategories" :key="cat" :value="cat">{{ cat }}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="field">
                                            <label class="label text-xs font-bold text-gray-600 mb-1">Mô tả chi tiết</label>
                                            <textarea 
                                                v-model="feat.description" 
                                                @input="feat.desc = feat.description"
                                                class="w-full border border-gray-300 rounded-lg p-3 text-xs text-gray-850 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y h-20"
                                                placeholder="Mô tả các chi tiết nổi bật của tính năng này..."
                                            ></textarea>
                                        </div>
                                    </div>

                                    <!-- Image Upload -->
                                    <div class="col-span-1 md:col-span-4 bg-white p-3 rounded-lg border border-gray-200">
                                        <Field 
                                            :key="'feat_image_' + idx"
                                            v-model="feat.image" 
                                            :field="{
                                                type: 'file_upload',
                                                name: 'feat_image_' + idx,
                                                label: 'Hình ảnh minh họa',
                                            }" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 5: Cấu hình SEO -->
            <div v-show="activeFormTab === 'seo'">
                <!-- SEO Settings -->
                <SeoFields :modelValue="form[currentTab]" @update:modelValue="form[currentTab] = $event" />
            </div>

        </template>

        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field v-model="form.category_id" :field="{
                        type: 'dropdown',
                        name: 'category_id',
                        label: 'Danh mục xe',
                        keyBy: 'id',
                        labelBy: 'title',
                        options: categories,
                        emptyLabel: '-- Chọn danh mục --',
                    }" />

                    <Field v-model="form.type" :field="{
                        type: 'dropdown',
                        name: 'type',
                        label: 'Phân loại xe',
                        options: [
                            { id: 'suv', label: 'SUV' },
                            { id: 'pickup', label: 'Bán tải (Pickup)' },
                            { id: 'commercial', label: 'Xe thương mại (Commercial)' },
                        ],
                        emptyLabel: '-- Chọn phân loại xe --',
                    }" />

                    <Field v-model="form.base_price" :field="{
                        type: 'money',
                        name: 'base_price',
                        label: 'Giá niêm yết (VNĐ)',
                    }" />

                    <Field v-model="form.is_best_seller" :field="{
                        type: 'radio_list',
                        name: 'is_best_seller',
                        label: 'Dòng xe bán chạy (Best Seller)',
                        options: [
                            { id: 1, label: 'Có' },
                            { id: 0, label: 'Không' },
                        ]
                    }" />

                    <Field v-model="form.status" :field="{
                        type: 'radio_list',
                        name: 'status',
                        label: 'Trạng thái',
                        options: schema.columns.status.list,
                    }" />

                    <Field v-model="form.sort_order" :field="{
                        type: 'number',
                        name: 'sort_order',
                        label: 'Thứ tự hiển thị',
                    }" />
                </div>
            </div>
        </template>
    </Form>
</template>

<script>
import draggable from 'vuedraggable'

export default {
    components: {
        Draggable: draggable
    },
    props: ['item', 'schema', 'data'],

    data() {
        return {
            currentTab: 'vi',
            activeFormTab: 'general',
            activeColorIndex: 0,
            activeVersionIndex: 0,
            accessorySearch: '',
            accessoryFilterCategory: 'all',
            showSpecsImportModal: false,
            specsImportText: '',
            showColorsSection: true,
            showSpecsSection: true,
            newCategoryName: '',
            tabs: [
                { id: 'general', name: 'ℹ️ Thông tin chung & Ảnh' },
                { id: 'versions', name: '⚙️ Phiên bản & Thông số' },
                { id: 'accessories', name: '🎒 Phụ kiện xe' },
                { id: 'features', name: '✨ Tính năng xe' },
                { id: 'builder', name: '🧱 Thiết kế trang' },
                { id: 'seo', name: '🔍 Cấu hình SEO' }
            ],
            categories: this.data?.categories ?? [],
            formData: this.initFormData(this.item),
        }
    },

    watch: {
        item() {
            this.formData = this.initFormData(this.item)
        },
        'formData.versions': {
            deep: true,
            handler(newVersions) {
                if (!newVersions) return;
                newVersions.forEach(ver => {
                    if (ver.customSpecs && Array.isArray(ver.customSpecs)) {
                        const mappedSpecs = ver.customSpecs.map(s => ({
                            title: s.title ?? '',
                            content: s.content ?? ''
                        }));
                        if (JSON.stringify(ver.specs) !== JSON.stringify(mappedSpecs)) {
                            ver.specs = mappedSpecs;
                        }
                    }
                });
            }
        }
    },

    computed: {
        filteredAccessoriesList() {
            const list = this.data?.accessories ?? [];
            const search = (this.accessorySearch || '').toLowerCase().trim();
            const category = this.accessoryFilterCategory || 'all';

            return list.filter(acc => {
                const matchesSearch = !search || 
                    (acc.title && acc.title.toLowerCase().includes(search)) || 
                    (acc.code && acc.code.toLowerCase().includes(search));

                const matchesCategory = category === 'all' || acc.category === category;

                return matchesSearch && matchesCategory;
            });
        },
        featureCategories() {
            if (!this.formData.layout_blocks) return ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"];
            let block = this.formData.layout_blocks.find(b => b.type === 'FeaturesList');
            if (!block || !block.data) return ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"];
            if (!block.data.categories || !Array.isArray(block.data.categories)) {
                block.data.categories = ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"];
            }
            return block.data.categories;
        },
        features() {
            if (!this.formData.layout_blocks) return [];
            let block = this.formData.layout_blocks.find(b => b.type === 'FeaturesList');
            if (!block) {
                block = {
                    type: 'FeaturesList',
                    data: {
                        features: [],
                        categories: ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"]
                    }
                };
                this.formData.layout_blocks.push(block);
            }
            if (!block.data) {
                block.data = { features: [], categories: ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"] };
            }
            if (!block.data.features) {
                block.data.features = [];
            }
            return block.data.features;
        }
    },

    methods: {
        initFormData(item) {
            const data = {
                status: 'ACTIVE',
                sort_order: 0,
                is_best_seller: 0,
                base_price: 0,
                type: 'suv',
                category_id: null,
                image: null,
                image_thumbnail: null,
                image_featured: null,
                video_url: '',
                video: null,
                images: [],
                images_360_external: [],
                images_360_internal: [],
                image_360_internal_url: '',
                versions: [],
                layout_blocks: [],
                accessories: [],
                ...item,
            }
            data.images_360_external = data.images_360_external || []
            data.images_360_internal = data.images_360_internal || []
            data.layout_blocks = data.layout_blocks || []
            
            // Convert boolean is_best_seller to integer for radio_list
            if (typeof data.is_best_seller === 'boolean') {
                data.is_best_seller = data.is_best_seller ? 1 : 0
            } else if (data.is_best_seller === true || data.is_best_seller === 'true' || data.is_best_seller === '1') {
                data.is_best_seller = 1
            } else {
                data.is_best_seller = 0
            }
            
            const locales = ['vi', 'en']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                const fallback = loc === 'vi' ? item : {}
                data[loc] = {
                    title:            trans?.title            ?? fallback.title            ?? '',
                    slug:             trans?.slug             ?? fallback.slug             ?? '',
                    tagline:          trans?.tagline          ?? fallback.tagline          ?? '',
                    description:      trans?.description      ?? fallback.description      ?? '',
                    // SEO fields
                    seo_meta_title:       trans?.seo_meta_title       ?? '',
                    seo_slug:             trans?.seo_slug             ?? '',
                    seo_meta_description: trans?.seo_meta_description ?? '',
                    seo_meta_keywords:    trans?.seo_meta_keywords    ?? '',
                    seo_meta_robots:      trans?.seo_meta_robots      ?? '',
                    seo_canonical:        trans?.seo_canonical        ?? '',
                    seo_image:            trans?.seo_image            ?? '',
                    seo_schemas:          trans?.seo_schemas          ?? '',
                }
            })



            // Parse existing versions with locales & default empty specs
            data.versions = (data.versions || []).map(ver => {
                let customSpecs = [];
                let rawSpecs = ver.specs;
                if (typeof rawSpecs === 'string') {
                    try {
                        rawSpecs = JSON.parse(rawSpecs);
                    } catch (e) {
                        rawSpecs = null;
                    }
                }
                
                if (Array.isArray(rawSpecs)) {
                    // New format: Array of { title, content }
                    customSpecs = rawSpecs.map(s => ({
                        title: s.title ?? s.category ?? '',
                        content: s.content ?? ''
                    }));
                } else if (rawSpecs && typeof rawSpecs === 'object') {
                    if (Array.isArray(rawSpecs.detailed_specs)) {
                        // Crawled format
                        customSpecs = rawSpecs.detailed_specs.map(s => ({
                            title: s.title ?? s.category ?? '',
                            content: s.content ?? ''
                        }));
                    } else {
                        // Old flat key-value pairs
                        const oldKeyLabels = {
                            engine: 'Động cơ',
                            power: 'Công suất cực đại',
                            torque: 'Mô-men xoắn cực đại',
                            transmission: 'Hộp số',
                            drivetrain: 'Hệ dẫn động',
                            dimensions: 'Kích thước (DxRxC)',
                            clearance: 'Khoảng sáng gầm',
                            fuelEconomy: 'Tiêu hao nhiên liệu'
                        };
                        let listItems = [];
                        Object.entries(rawSpecs).forEach(([key, val]) => {
                            if (val && typeof val === 'string') {
                                const label = oldKeyLabels[key] || key;
                                listItems.push(`<li><strong>${label}</strong>: ${val}</li>`);
                            }
                        });
                        const content = listItems.length > 0 ? `<ul>${listItems.join('')}</ul>` : '';
                        if (content) {
                            customSpecs = [
                                { title: 'Thông số chung', content: content }
                            ];
                        }
                    }
                }

                if (customSpecs.length === 0) {
                    customSpecs = [
                        { title: 'Vận hành', content: '' },
                        { title: 'Thiết kế bánh xe', content: '' },
                        { title: 'Ngoại thất', content: '' },
                        { title: 'Nội thất', content: '' },
                        { title: 'Công nghệ', content: '' },
                        { title: 'Hỗ trợ Người Lái & An toàn', content: '' }
                    ];
                }

                const verData = {
                    id: ver.id,
                    price: ver.price ?? 0,
                    status: ver.status ?? 'ACTIVE',
                    sort_order: ver.sort_order ?? 0,
                    image: ver.image ?? null,
                    showSpecs: false,
                    customSpecs: customSpecs,
                    specs: customSpecs,
                    colors: (ver.colors || []).map(col => {
                        let code = col.color_code ?? col.hex ?? '';
                        if (code && !code.startsWith('#')) {
                            code = '#' + code;
                        }
                        return {
                            name: col.name ?? col.color_name ?? '',
                            color_code: code || '#cbd5e1',
                            images_360: col.images_360 ?? [],
                            image_360_internal: col.image_360_internal ?? null,
                            images_360_internal: col.images_360_internal ?? [],
                        };
                    })
                }
                locales.forEach(loc => {
                    let trans = null
                    if (ver.translations && Array.isArray(ver.translations)) {
                        trans = ver.translations.find(t => t.locale === loc)
                    }
                    const fallback = loc === 'vi' ? ver : {}
                    verData[loc] = {
                        name: trans?.name ?? fallback.name ?? ''
                    }
                })
                return verData
            })

            return data
        },



        addVersion() {
            if (!this.formData.versions) this.formData.versions = []
            
            const defaultSpecs = [
                { title: 'Vận hành', content: '' },
                { title: 'Thiết kế bánh xe', content: '' },
                { title: 'Ngoại thất', content: '' },
                { title: 'Nội thất', content: '' },
                { title: 'Công nghệ', content: '' },
                { title: 'Hỗ trợ Người Lái & An toàn', content: '' }
            ];

            this.formData.versions.push({
                price: 0,
                status: 'ACTIVE',
                sort_order: this.formData.versions.length + 1,
                image: null,
                showSpecs: true,
                customSpecs: defaultSpecs,
                specs: defaultSpecs,
                vi: { name: '' },
                en: { name: '' }
            })
            this.activeVersionIndex = this.formData.versions.length - 1
        },

        removeVersion(index) {
            if (this.formData.versions) {
                this.formData.versions.splice(index, 1)
                if (this.activeVersionIndex >= this.formData.versions.length) {
                    this.activeVersionIndex = Math.max(0, this.formData.versions.length - 1)
                }
            }
        },

        duplicateVersion(index) {
            const ver = this.formData.versions[index];
            if (!ver) return;

            const cloneObject = (obj) => {
                if (obj === null || typeof obj !== 'object') return obj;
                if (obj instanceof File) return obj;
                if (obj instanceof Date) return new Date(obj.getTime());
                if (Array.isArray(obj)) return obj.map(item => cloneObject(item));
                const cloned = {};
                for (const key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        cloned[key] = cloneObject(obj[key]);
                    }
                }
                return cloned;
            };

            const clonedVersion = cloneObject(ver);
            
            // Adjust properties to indicate a copy
            if (clonedVersion.vi && clonedVersion.vi.name) {
                clonedVersion.vi.name = `${clonedVersion.vi.name} (Bản sao)`;
            }
            if (clonedVersion.en && clonedVersion.en.name) {
                clonedVersion.en.name = `${clonedVersion.en.name} (Copy)`;
            }
            clonedVersion.id = undefined; // Force backend to treat it as a new version
            clonedVersion.sort_order = this.formData.versions.length + 1;

            this.formData.versions.push(clonedVersion);
            this.activeVersionIndex = this.formData.versions.length - 1;
        },

        handleCloneColorsFromVersion(event) {
            const sourceIndex = event.target.value;
            if (sourceIndex === "" || sourceIndex === undefined || sourceIndex === null) return;
            
            const sourceVer = this.formData.versions[sourceIndex];
            const targetVer = this.formData.versions[this.activeVersionIndex];
            
            if (sourceVer && targetVer && sourceVer.colors && sourceVer.colors.length > 0) {
                if (confirm(`Bạn có chắc chắn muốn sao chép toàn bộ bảng màu từ phiên bản "${sourceVer.vi?.name || 'này'}" không? Bảng màu cũ của phiên bản hiện tại sẽ bị xóa.`)) {
                    const cloneObject = (obj) => {
                        if (obj === null || typeof obj !== 'object') return obj;
                        if (obj instanceof File) return obj;
                        if (Array.isArray(obj)) return obj.map(item => cloneObject(item));
                        const cloned = {};
                        for (const key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                                cloned[key] = cloneObject(obj[key]);
                            }
                        }
                        return cloned;
                    };
                    targetVer.colors = cloneObject(sourceVer.colors);
                }
            } else {
                alert("Phiên bản được chọn không có cấu hình màu sắc nào.");
            }
            // Reset dropdown
            event.target.value = "";
        },

        handleCloneSpecsFromVersion(event) {
            const sourceIndex = event.target.value;
            if (sourceIndex === "" || sourceIndex === undefined || sourceIndex === null) return;
            
            const sourceVer = this.formData.versions[sourceIndex];
            const targetVer = this.formData.versions[this.activeVersionIndex];
            
            if (sourceVer && targetVer && sourceVer.customSpecs && sourceVer.customSpecs.length > 0) {
                if (confirm(`Bạn có chắc chắn muốn sao chép thông số kỹ thuật từ phiên bản "${sourceVer.vi?.name || 'này'}" không? Thông số cũ của phiên bản hiện tại sẽ bị ghi đè.`)) {
                    const cloneObject = (obj) => {
                        if (obj === null || typeof obj !== 'object') return obj;
                        if (obj instanceof File) return obj;
                        if (Array.isArray(obj)) return obj.map(item => cloneObject(item));
                        const cloned = {};
                        for (const key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                                cloned[key] = cloneObject(obj[key]);
                            }
                        }
                        return cloned;
                    };
                    targetVer.customSpecs = cloneObject(sourceVer.customSpecs);
                }
            } else {
                alert("Phiên bản được chọn không có thông số kỹ thuật nào.");
            }
            // Reset dropdown
            event.target.value = "";
        },

        executeSpecsImport() {
            if (!this.specsImportText || !this.specsImportText.trim()) {
                alert("Vui lòng dán nội dung thông số kỹ thuật trước khi bấm xử lý.");
                return;
            }

            const lines = this.specsImportText.split('\n').map(l => l.trim()).filter(Boolean);
            const parsedGroups = [];
            let currentGroup = null;

            const knownCategories = [
                'vận hành', 'thiết kế bánh xe', 'ngoại thất', 'nội thất', 'công nghệ', 
                'hỗ trợ người lái & an toàn', 'an toàn', 'kích thước', 'động cơ & hộp số',
                'hệ thống treo', 'tiêu hao nhiên liệu', 'trang bị'
            ];

            lines.forEach(line => {
                const lowerLine = line.toLowerCase();
                const isHeader = knownCategories.includes(lowerLine) || 
                                 (line.length < 40 && !line.includes(':') && !line.startsWith('-') && !line.match(/^\d+\./));

                if (isHeader) {
                    currentGroup = {
                        title: line,
                        items: []
                    };
                    parsedGroups.push(currentGroup);
                } else {
                    if (!currentGroup) {
                        currentGroup = {
                            title: 'Thông số chung',
                            items: []
                        };
                        parsedGroups.push(currentGroup);
                    }
                    currentGroup.items.push(line);
                }
            });

            const ver = this.formData.versions[this.activeVersionIndex];
            if (!ver.customSpecs) ver.customSpecs = [];

            parsedGroups.forEach(g => {
                const contentHtml = `<ul class="list-disc pl-4 space-y-1">\n` + 
                    g.items.map(item => {
                        const colonIndex = item.indexOf(':');
                        if (colonIndex > -1) {
                            const key = item.substring(0, colonIndex).trim();
                            const val = item.substring(colonIndex + 1).trim();
                            return `  <li>${key}: <strong>${val}</strong></li>`;
                        }
                        return `  <li>${item}</li>`;
                    }).join('\n') + 
                    `\n</ul>`;

                const existing = ver.customSpecs.find(s => s.title.toLowerCase() === g.title.toLowerCase());
                if (existing) {
                    existing.content = existing.content ? (existing.content + '<br/>' + contentHtml) : contentHtml;
                } else {
                    ver.customSpecs.push({
                        title: g.title,
                        content: contentHtml
                    });
                }
            });

            this.specsImportText = '';
            this.showSpecsImportModal = false;
            alert("Đã nhập thông số thành công!");
        },

        addCustomSpec(versionIndex) {
            const ver = this.formData.versions[versionIndex];
            if (!ver.customSpecs) {
                ver.customSpecs = [];
            }
            ver.customSpecs.push({ title: '', content: '' });
        },

        removeCustomSpec(versionIndex, specIndex) {
            const ver = this.formData.versions[versionIndex];
            if (ver.customSpecs) {
                ver.customSpecs.splice(specIndex, 1);
            }
        },

        addVersionColor(versionIndex) {
            const ver = this.formData.versions[versionIndex];
            if (!ver.colors) {
                ver.colors = [];
            }
            ver.colors.push({
                name: '',
                color_code: '#cbd5e1',
                images_360: [],
                image_360_internal: null,
                images_360_internal: [],
            });
        },

        removeVersionColor(versionIndex, colorIndex) {
            const ver = this.formData.versions[versionIndex];
            if (ver && ver.colors) {
                ver.colors.splice(colorIndex, 1);
            }
        },

        toggleAccessorySelection(id) {
            if (!this.formData.accessories) {
                this.formData.accessories = [];
            }
            const idx = this.formData.accessories.indexOf(id);
            if (idx > -1) {
                this.formData.accessories.splice(idx, 1);
            } else {
                this.formData.accessories.push(id);
            }
        },

        isAccessorySelected(id) {
            return (this.formData.accessories || []).includes(id);
        },

        getCategoryLabel(category) {
            const labels = {
                interior: 'Nội thất',
                exterior: 'Ngoại thất',
                tech: 'Công nghệ',
                wheels: 'Mâm & Lốp',
                performance: 'Hiệu suất'
            };
            return labels[category] || category;
        },

        isInitiallyFit(acc) {
            const vehicleTitle = this.formData.vi?.title || this.formData.title;
            if (!vehicleTitle || !acc.fit_vehicles) return false;
            return acc.fit_vehicles.some(v => v.toLowerCase().trim() === vehicleTitle.toLowerCase().trim());
        },
        addFeatureCategory() {
            if (!this.newCategoryName || !this.newCategoryName.trim()) return;
            const name = this.newCategoryName.trim();
            if (!this.formData.layout_blocks) this.formData.layout_blocks = [];
            let block = this.formData.layout_blocks.find(b => b.type === 'FeaturesList');
            if (!block) {
                block = {
                    type: 'FeaturesList',
                    data: {
                        features: [],
                        categories: ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"]
                    }
                };
                this.formData.layout_blocks.push(block);
            }
            if (!block.data) {
                block.data = { features: [], categories: ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"] };
            }
            if (!block.data.categories) {
                block.data.categories = ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"];
            }
            if (!block.data.categories.includes(name)) {
                block.data.categories.push(name);
            }
            this.newCategoryName = '';
        },
        removeFeatureCategory(idx) {
            if (!this.formData.layout_blocks) return;
            let block = this.formData.layout_blocks.find(b => b.type === 'FeaturesList');
            if (block && block.data && block.data.categories) {
                block.data.categories.splice(idx, 1);
            }
        },
        addFeature() {
            if (!this.formData.layout_blocks) this.formData.layout_blocks = [];
            let block = this.formData.layout_blocks.find(b => b.type === 'FeaturesList');
            if (!block) {
                block = {
                    type: 'FeaturesList',
                    data: {
                        features: [],
                        categories: ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"]
                    }
                };
                this.formData.layout_blocks.push(block);
            }
            if (!block.data) {
                block.data = { features: [], categories: ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"] };
            }
            if (!block.data.features) {
                block.data.features = [];
            }
            block.data.features.push({
                title: '',
                desc: '',
                description: '',
                image: null,
                category: block.data.categories?.[0] || 'Thiết kế'
            });
        },
        removeFeature(idx) {
            if (!this.formData.layout_blocks) return;
            let block = this.formData.layout_blocks.find(b => b.type === 'FeaturesList');
            if (block && block.data && block.data.features) {
                block.data.features.splice(idx, 1);
            }
        }
    },
}
</script>
