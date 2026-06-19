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
                    </div>
                </div>
            </div>

            <!-- Tab 2: Màu sắc & 360° -->
            <div v-show="activeFormTab === 'colors'">

                <!-- Bảng màu xe (KHÔNG dịch) -->
                <div class="card mt-4">
                    <div class="card-header font-bold text-gray-700">Bảng màu xe (Color Swatches) & Trải nghiệm 360°</div>
                    <div class="card-body">
                        <div v-if="!form.colors || form.colors.length === 0" class="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <span class="text-3xl">🎨</span>
                            <p class="text-sm text-gray-500 mt-2 font-medium">Chưa cấu hình bảng màu xe nào</p>
                            <button type="button" class="mt-4 btn btn-indigo btn-sm" @click="addColor">
                                + Thêm màu xe đầu tiên
                            </button>
                        </div>
                        <div v-else class="grid grid-cols-12 gap-6">
                            <!-- SIDEBAR (3/12 cols) -->
                            <div class="col-span-12 lg:col-span-4 xl:col-span-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-200 flex flex-col gap-3">
                                <div class="flex items-center justify-between pb-2 border-b border-gray-200">
                                    <span class="font-bold text-xs uppercase text-gray-500 tracking-wider">Danh sách màu sắc</span>
                                    <span class="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {{ form.colors.length }} màu
                                    </span>
                                </div>

                                <Draggable
                                    v-model="form.colors"
                                    item-key="name"
                                    handle=".color-drag-handle"
                                    :animation="200"
                                    class="space-y-2 max-h-[500px] overflow-y-auto pr-1"
                                >
                                    <template #item="{ element, index }">
                                        <div 
                                            class="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition duration-155 group"
                                            :class="activeColorIndex === index 
                                                ? 'bg-indigo-50/80 border-indigo-250 ring-2 ring-indigo-500/10' 
                                                : 'bg-white hover:bg-gray-50 border-gray-200'"
                                            @click="activeColorIndex = index"
                                        >
                                            <div class="flex items-center space-x-2.5 overflow-hidden">
                                                <!-- Drag Handle -->
                                                <div class="color-drag-handle cursor-grab text-gray-400 hover:text-gray-600 transition shrink-0">
                                                    ☰
                                                </div>
                                                <!-- Visual Color Swatch -->
                                                <div class="w-6 h-6 rounded-full border border-gray-300 shadow-2xs shrink-0"
                                                     :style="{ backgroundColor: element.color_code || '#cbd5e1' }">
                                                </div>
                                                <!-- Swatch Name -->
                                                <span class="text-xs font-bold text-gray-700 truncate">
                                                    {{ element.name || 'Màu chưa đặt tên' }}
                                                </span>
                                            </div>
                                            <!-- Delete Swatch Button -->
                                            <button 
                                                type="button" 
                                                class="text-red-500 hover:text-red-700 text-xs bg-red-50 hover:bg-red-100 w-5 h-5 flex items-center justify-center rounded-md border-0 cursor-pointer shrink-0 transition"
                                                @click.stop="removeColor(index)"
                                                title="Xóa màu xe"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </template>
                                </Draggable>

                                <button type="button" class="btn btn-secondary btn-sm mt-2 w-full justify-center" @click="addColor">
                                    + Thêm màu xe
                                </button>
                            </div>

                            <!-- DETAIL PANE (9/12 cols) -->
                            <div class="col-span-12 lg:col-span-8 xl:col-span-9 space-y-5 bg-white p-5 rounded-2xl border border-gray-200" v-if="form.colors[activeColorIndex]">
                                <div class="flex justify-between items-center pb-3 border-b border-gray-150">
                                    <div class="flex items-center gap-2">
                                        <div class="w-5 h-5 rounded-full border shadow-2xs" :style="{ backgroundColor: form.colors[activeColorIndex].color_code || '#cbd5e1' }"></div>
                                        <h4 class="font-bold text-gray-800 text-sm md:text-base">
                                            Cấu hình màu: {{ form.colors[activeColorIndex].name || 'Màu sắc chưa đặt tên' }}
                                        </h4>
                                    </div>
                                    <button type="button" class="text-red-600 hover:text-red-800 font-bold text-xs bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition cursor-pointer" @click="removeColor(activeColorIndex)">
                                        ✕ Xóa màu này
                                    </button>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field v-model="form.colors[activeColorIndex].name" :field="{
                                        type: 'text',
                                        name: 'color_name_' + activeColorIndex,
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
                                                v-model="form.colors[activeColorIndex].color_code"
                                                class="w-11 h-[38px] p-0.5 rounded-lg border border-gray-300 cursor-pointer bg-white shrink-0"
                                            />
                                            <InputText 
                                                type="text" 
                                                v-model="form.colors[activeColorIndex].color_code"
                                                placeholder="vd: #ffffff"
                                                class="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="border-t border-gray-150 pt-4 mt-4">
                                    <p class="text-xs font-bold text-indigo-750 uppercase tracking-wider mb-3 flex items-center gap-1">
                                        <span>📸</span>
                                        <span>Hình ảnh & Trải nghiệm 360°</span>
                                    </p>
                                    
                                    <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <Field v-model="form.colors[activeColorIndex].image_360_internal" :field="{
                                            type: 'file_upload',
                                            name: 'color_image_360_internal_' + activeColorIndex,
                                            label: 'Ảnh Panorama 360° (Nội thất)',
                                        }" />
                                    </div>

                                    <div class="mt-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <Field v-model="form.colors[activeColorIndex].images_360" :field="{
                                            type: 'file_upload',
                                            name: 'color_images_360_' + activeColorIndex,
                                            label: 'Bộ ảnh xoay 360° Ngoại thất cho màu này (Chọn nhiều ảnh theo thứ tự xoay)',
                                            multiple: true,
                                        }" />
                                        <div class="text-xs text-amber-750 mt-2 font-medium">
                                            💡 <b>Mẹo:</b> Đặt tên tệp theo số thứ tự (ví dụ: <code>01.jpg</code>, <code>02.jpg</code>,...) để hệ thống tự động sắp xếp vị trí xoay chính xác.
                                        </div>
                                    </div>

                                    <div class="mt-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <Field v-model="form.colors[activeColorIndex].images_360_internal" :field="{
                                            type: 'file_upload',
                                            name: 'color_images_360_internal_' + activeColorIndex,
                                            label: 'Bộ ảnh xoay 360° Nội thất cho màu này (Chọn nhiều ảnh theo thứ tự xoay)',
                                            multiple: true,
                                        }" />
                                        <div class="text-xs text-amber-750 mt-2 font-medium">
                                            💡 <b>Mẹo:</b> Đặt tên tệp theo số thứ tự để hệ thống tự động sắp xếp vị trí xoay chính xác.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                            <!-- Delete Version Button -->
                                            <button 
                                                type="button" 
                                                class="text-red-500 hover:text-red-700 text-xs bg-red-50 hover:bg-red-100 w-5 h-5 flex items-center justify-center rounded-md border-0 cursor-pointer shrink-0 transition"
                                                @click.stop="removeVersion(index)"
                                                title="Xóa phiên bản"
                                            >
                                                ✕
                                            </button>
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
                                    <Field v-model="form.versions[activeVersionIndex].image" :field="{
                                        type: 'file_upload',
                                        name: 'version_image_' + activeVersionIndex,
                                        label: 'Ảnh đặc trưng của phiên bản (Hiển thị ở trang chi tiết xe)',
                                    }" />
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
                                        <p class="text-sm font-bold text-emerald-750 uppercase flex items-center gap-1">
                                            <span>🎨</span>
                                            <span>Màu sắc riêng của phiên bản này (Colors)</span>
                                        </p>
                                        <button type="button" class="text-xs text-emerald-600 hover:text-emerald-800 font-bold bg-transparent border-0 cursor-pointer" @click="addVersionColor(activeVersionIndex)">
                                            ＋ Thêm màu mới cho phiên bản
                                        </button>
                                    </div>

                                    <div class="space-y-4">
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
                                                    <Field v-model="form.versions[activeVersionIndex].colors[cIdx].image_360_internal" :field="{
                                                        type: 'file_upload',
                                                        name: 'ver_' + activeVersionIndex + '_color_image_360_internal_' + cIdx,
                                                        label: 'Ảnh Panorama 360° (Nội thất)',
                                                    }" />
                                                </div>

                                                <div class="bg-white p-3 rounded-lg border border-gray-150">
                                                    <Field v-model="form.versions[activeVersionIndex].colors[cIdx].images_360" :field="{
                                                        type: 'file_upload',
                                                        name: 'ver_' + activeVersionIndex + '_color_images_360_' + cIdx,
                                                        label: 'Bộ ảnh xoay 360° Ngoại thất cho màu này (Chọn nhiều ảnh theo thứ tự xoay)',
                                                        multiple: true,
                                                    }" />
                                                </div>

                                                <div class="bg-white p-3 rounded-lg border border-gray-150">
                                                    <Field v-model="form.versions[activeVersionIndex].colors[cIdx].images_360_internal" :field="{
                                                        type: 'file_upload',
                                                        name: 'ver_' + activeVersionIndex + '_color_images_360_internal_' + cIdx,
                                                        label: 'Bộ ảnh xoay 360° Nội thất cho màu này (Chọn nhiều ảnh theo thứ tự xoay)',
                                                        multiple: true,
                                                    }" />
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
                                        <p class="text-sm font-bold text-indigo-700 uppercase">📋 Nhóm thông số kỹ thuật chi tiết (Specs)</p>
                                        <button type="button" class="text-xs text-indigo-650 hover:text-indigo-850 font-bold bg-transparent border-0 cursor-pointer" @click="addCustomSpec(activeVersionIndex)">
                                            ＋ Thêm nhóm thông số mới
                                        </button>
                                    </div>
                                    
                                    <div class="space-y-4">
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
            tabs: [
                { id: 'general', name: 'ℹ️ Thông tin chung & Ảnh' },
                { id: 'colors', name: '🎨 Màu xe & 360°' },
                { id: 'versions', name: '⚙️ Phiên bản & Thông số' },
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
                images: [],
                colors: [],
                images_360_external: [],
                images_360_internal: [],
                image_360_internal_url: '',
                versions: [],
                layout_blocks: [],
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

            // Parse existing colors with defaults to avoid reactivity issues in Vue
            data.colors = (data.colors || []).map(col => {
                let code = col.color_code ?? col.hex ?? '';
                if (code && !code.startsWith('#')) {
                    code = '#' + code;
                }
                return {
                    name: col.name ?? col.color_name ?? '',
                    color_code: code || '#cbd5e1',
                    image: col.image ?? (col.image_path ? { path: col.image_path } : null),
                    images_360: col.images_360 ?? [],
                    image_360_internal: col.image_360_internal ?? null,
                    images_360_internal: col.images_360_internal ?? [],
                    showDetails: false,
                };
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

        addColor() {
            if (!this.formData.colors) this.formData.colors = []
            this.formData.colors.push({ 
                name: '', 
                color_code: '#cbd5e1', 
                images_360: [],
                image_360_internal: null,
                images_360_internal: [],
            })
            this.activeColorIndex = this.formData.colors.length - 1
        },

        removeColor(index) {
            if (this.formData.colors) {
                this.formData.colors.splice(index, 1)
                if (this.activeColorIndex >= this.formData.colors.length) {
                    this.activeColorIndex = Math.max(0, this.formData.colors.length - 1)
                }
            }
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
    },
}
</script>
