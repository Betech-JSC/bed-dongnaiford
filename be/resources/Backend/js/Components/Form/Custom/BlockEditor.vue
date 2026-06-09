<template>
    <div class="space-y-4">
        <div class="flex justify-between items-center border-b pb-3">
            <h3 class="text-lg font-bold text-gray-700">Trình dựng trang Page Builder (JSON Blocks)</h3>
            <div class="flex items-center space-x-2">
                <select v-model="selectedBlockType" class="form-select border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">-- Chọn loại khối để thêm --</option>
                    <option value="HeroBanner">📢 Khối Banner lớn (Hero Banner)</option>
                    <option value="Promotions">🎁 Khối Khuyến mãi (Promotions)</option>
                    <option value="ThreeSixtyViewer">🔄 Khối Xoay 360° (360 Viewer)</option>
                    <option value="FeaturesGrid">🔲 Khối Lưới tính năng (Features Grid)</option>
                    <option value="VersionsGrid">🚗 Khối Phiên bản (Versions Grid)</option>
                    <option value="SpecsGrid">📊 Khối Bảng so sánh thông số (Specs Grid)</option>
                    <option value="FeaturesList">✨ Khối Danh sách tính năng (Features List)</option>
                    <option value="AccordionFAQs">❓ Khối Hỏi đáp xếp gập (Accordion FAQs)</option>
                </select>
                <button type="button" class="btn btn-primary btn-sm px-4 py-2 rounded text-sm font-semibold" @click="addBlock" :disabled="!selectedBlockType">
                    + Thêm Khối
                </button>
            </div>
        </div>

        <!-- Draggable blocks list -->
        <Draggable
            v-if="blocks && blocks.length > 0"
            tag="div"
            v-model="blocks"
            item-key="id"
            handle=".block-handle"
            :animation="200"
            class="space-y-4"
        >
            <template #item="{ index, element }">
                <div class="border rounded-xl bg-white shadow-sm overflow-hidden" :key="index">
                    <!-- Block Header -->
                    <div class="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
                        <div class="flex items-center space-x-3">
                            <!-- Drag Handle -->
                            <div class="block-handle cursor-move p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200">
                                <heroicons-outline:bars-4 class="w-5 h-5" />
                            </div>
                            <span class="text-xs font-bold uppercase px-2.5 py-1 rounded bg-blue-50 text-blue-700">
                                #{{ index + 1 }} - {{ getBlockLabel(element.type) }}
                            </span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <!-- Collapse Toggle -->
                            <button type="button" class="text-sm font-semibold text-gray-500 hover:underline px-2" @click="toggleBlock(index)">
                                {{ element.is_collapsed ? '⚙️ Hiện trường nhập' : '🙈 Ẩn bớt' }}
                            </button>
                            <!-- Delete Button -->
                            <button type="button" class="text-red-500 text-sm font-semibold hover:underline px-2" @click="removeBlock(index)">
                                ✕ Xóa
                            </button>
                        </div>
                    </div>

                    <!-- Block Editor Form Content -->
                    <div v-show="!element.is_collapsed" class="p-5 space-y-4 bg-white">
                        
                        <!-- 1. HeroBanner Form -->
                        <div v-if="element.type === 'HeroBanner'" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field v-model="element.data.title" :field="{
                                    type: 'text',
                                    name: 'hero_title_' + index,
                                    label: 'Tiêu đề lớn (Title)',
                                    placeholder: 'vd: FORD EVEREST MỚI',
                                }" />
                                <Field v-model="element.data.tagline" :field="{
                                    type: 'text',
                                    name: 'hero_tagline_' + index,
                                    label: 'Tagline / Slogan',
                                    placeholder: 'vd: Dấn bước. Dẫn đầu.',
                                }" />
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field v-model="element.data.button_text" :field="{
                                    type: 'text',
                                    name: 'hero_btn_text_' + index,
                                    label: 'Nhãn nút bấm (Button Text)',
                                    placeholder: 'vd: Tìm hiểu thêm',
                                }" />
                                <Field v-model="element.data.button_link" :field="{
                                    type: 'text',
                                    name: 'hero_btn_link_' + index,
                                    label: 'Liên kết nút bấm (Button Link)',
                                    placeholder: 'vd: /lien-he',
                                }" />
                            </div>
                            <Field v-model="element.data.background_image" :field="{
                                type: 'file_upload',
                                name: 'hero_bg_' + index,
                                label: 'Hình ảnh nền (Background Image)',
                            }" />
                        </div>

                        <!-- 2. Promotions Form -->
                        <div v-else-if="element.type === 'Promotions'" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field v-model="element.data.title" :field="{
                                    type: 'text',
                                    name: 'promo_title_' + index,
                                    label: 'Tiêu đề khuyến mãi (Title)',
                                    placeholder: 'vd: Khuyến Mãi Lớn',
                                }" />
                                <Field v-model="element.data.button_text" :field="{
                                    type: 'text',
                                    name: 'promo_btn_' + index,
                                    label: 'Nhãn nút bấm (Button Text)',
                                    placeholder: 'vd: Báo giá',
                                }" />
                            </div>
                            <Field v-model="element.data.description" :field="{
                                type: 'textarea',
                                name: 'promo_desc_' + index,
                                label: 'Mô tả khuyến mãi',
                                placeholder: 'Nhập mô tả chi tiết chương trình khuyến mãi...',
                            }" />
                            <Field v-model="element.data.image" :field="{
                                type: 'file_upload',
                                name: 'promo_img_' + index,
                                label: 'Ảnh banner khuyến mãi',
                            }" />
                        </div>

                        <!-- 3. ThreeSixtyViewer Form -->
                        <div v-else-if="element.type === 'ThreeSixtyViewer'" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field v-model="element.data.title" :field="{
                                    type: 'text',
                                    name: '360_title_' + index,
                                    label: 'Tiêu đề khối 360',
                                    placeholder: 'vd: Khám phá không gian đa chiều',
                                }" />
                                <Field v-model="element.data.description" :field="{
                                    type: 'textarea',
                                    name: '360_desc_' + index,
                                    label: 'Mô tả ngắn',
                                    placeholder: 'Xoay 360 độ hoặc chọn màu sơn...',
                                }" />
                            </div>
                        </div>

                        <!-- 4. FeaturesGrid Form -->
                        <div v-else-if="element.type === 'FeaturesGrid'" class="space-y-4">
                            <p class="font-bold text-gray-700 border-b pb-2">Lưới tính năng thiết kế & công nghệ</p>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field v-model="element.data.title_1" :field="{
                                    type: 'text',
                                    name: 'grid_t1_' + index,
                                    label: 'Tiêu đề nhóm 1 (vd: Thiết kế hiện đại)',
                                }" />
                                <Field v-model="element.data.image_1" :field="{
                                    type: 'file_upload',
                                    name: 'grid_img1_' + index,
                                    label: 'Ảnh lưới 1 (ảnh lớn ở trên)',
                                }" />
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field v-model="element.data.image_2" :field="{
                                    type: 'file_upload',
                                    name: 'grid_img2_' + index,
                                    label: 'Ảnh lưới 2 (ảnh nhỏ trái)',
                                }" />
                                <Field v-model="element.data.image_3" :field="{
                                    type: 'file_upload',
                                    name: 'grid_img3_' + index,
                                    label: 'Ảnh lưới 3 (ảnh nhỏ phải)',
                                }" />
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                <Field v-model="element.data.title_2" :field="{
                                    type: 'text',
                                    name: 'grid_t2_' + index,
                                    label: 'Tiêu đề nhóm 2 (vd: Không gian nội thất)',
                                }" />
                                <Field v-model="element.data.image_large" :field="{
                                    type: 'file_upload',
                                    name: 'grid_img_l_' + index,
                                    label: 'Ảnh nội thất lớn',
                                }" />
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                <Field v-model="element.data.title_3" :field="{
                                    type: 'text',
                                    name: 'grid_t3_' + index,
                                    label: 'Tiêu đề nhóm 3 (vd: Nâng tầm công nghệ)',
                                }" />
                                <Field v-model="element.data.split_image" :field="{
                                    type: 'file_upload',
                                    name: 'grid_img_s_' + index,
                                    label: 'Ảnh chia đôi (trái)',
                                }" />
                            </div>
                            <div class="space-y-3 pt-2">
                                <Field v-model="element.data.split_title" :field="{
                                    type: 'text',
                                    name: 'grid_split_title_' + index,
                                    label: 'Tiêu đề cột thông số (phải)',
                                }" />
                                <p class="text-xs font-bold text-gray-500 uppercase mt-2">Các chỉ số nổi bật:</p>
                                <div v-for="(feat, featIndex) in element.data.split_features" :key="featIndex" class="flex gap-2 items-center bg-gray-50 p-2 rounded-lg relative">
                                    <Field v-model="feat.value" :field="{
                                        type: 'text',
                                        name: 'grid_feat_val_' + index + '_' + featIndex,
                                        placeholder: 'vd: 12-inch',
                                        label: 'Giá trị'
                                    }" class="w-1/3" />
                                    <Field v-model="feat.label" :field="{
                                        type: 'text',
                                        name: 'grid_feat_lbl_' + index + '_' + featIndex,
                                        placeholder: 'vd: Màn hình cảm ứng',
                                        label: 'Mô tả'
                                    }" class="w-2/3" />
                                    <button type="button" class="text-red-500 font-bold ml-2 text-sm" @click="removeSplitFeature(index, featIndex)">✕</button>
                                </div>
                                <button type="button" class="btn btn-secondary btn-sm mt-2" @click="addSplitFeature(index)">
                                    + Thêm chỉ số
                                </button>
                            </div>
                        </div>

                        <!-- 5. VersionsGrid Form -->
                        <div v-else-if="element.type === 'VersionsGrid'" class="space-y-4">
                            <Field v-model="element.data.title" :field="{
                                type: 'text',
                                name: 'ver_grid_title_' + index,
                                label: 'Tiêu đề danh sách phiên bản',
                                placeholder: 'vd: Các phiên bản xe',
                            }" />
                            <p class="text-xs font-bold text-gray-500 uppercase">Mô tả cho từng phiên bản (theo thứ tự):</p>
                            <div v-for="(desc, descIndex) in element.data.descriptions" :key="descIndex" class="space-y-1">
                                <label class="text-xs text-gray-500">Mô tả phiên bản #{{ descIndex + 1 }}</label>
                                <textarea v-model="element.data.descriptions[descIndex]" class="form-control border rounded p-2 text-sm w-full focus:ring-primary focus:border-primary resize-none h-16 bg-transparent" placeholder="Nhập mô tả..."></textarea>
                            </div>
                        </div>

                        <!-- 6. SpecsGrid Config Info -->
                        <div v-else-if="element.type === 'SpecsGrid'" class="p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
                            💡 **Cấu hình Bảng so sánh thông số:** Khối này tự động tải toàn bộ danh sách phiên bản và 8 thông số kỹ thuật chi tiết của dòng xe này để hiển thị trên giao diện so sánh động. Không cần cấu hình thêm nội dung.
                        </div>

                        <!-- 7. FeaturesList Form -->
                        <div v-else-if="element.type === 'FeaturesList'" class="space-y-4">
                            <p class="font-bold text-gray-700 border-b pb-2">Danh sách tính năng nổi bật</p>
                            
                            <div v-for="(feature, fIndex) in element.data.features" :key="fIndex" class="border rounded-lg p-4 bg-gray-50 relative">
                                <button type="button" class="absolute top-2 right-2 text-red-500 text-xs font-semibold hover:underline" @click="removeFeature(index, fIndex)">✕ Xóa tính năng</button>
                                <p class="font-bold text-gray-500 text-xs mb-3 uppercase">Tính năng #{{ fIndex + 1 }}</p>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field v-model="element.data.features[fIndex].title" :field="{
                                        type: 'text',
                                        name: 'feat_title_' + index + '_' + fIndex,
                                        label: 'Tiêu đề tính năng',
                                    }" />
                                    <Field v-model="element.data.features[fIndex].image" :field="{
                                        type: 'file_upload',
                                        name: 'feat_img_' + index + '_' + fIndex,
                                        label: 'Ảnh minh họa tính năng',
                                    }" />
                                </div>
                                <div class="mt-3">
                                    <Field v-model="element.data.features[fIndex].description" :field="{
                                        type: 'textarea',
                                        name: 'feat_desc_' + index + '_' + fIndex,
                                        label: 'Mô tả ngắn tính năng',
                                    }" />
                                </div>
                            </div>
                            
                            <button type="button" class="btn btn-secondary btn-sm" @click="addFeature(index)">
                                + Thêm tính năng mới
                            </button>
                        </div>

                        <!-- 8. AccordionFAQs Form -->
                        <div v-else-if="element.type === 'AccordionFAQs'" class="space-y-4">
                            <p class="font-bold text-gray-700 border-b pb-2">Danh sách câu hỏi thường gặp (FAQs)</p>
                            
                            <div v-for="(faq, faqIndex) in element.data.faqs" :key="faqIndex" class="border rounded-lg p-4 bg-gray-50 relative">
                                <button type="button" class="absolute top-2 right-2 text-red-500 text-xs font-semibold hover:underline" @click="removeFaq(index, faqIndex)">✕ Xóa câu hỏi</button>
                                <p class="font-bold text-gray-500 text-xs mb-3">Câu hỏi #{{ faqIndex + 1 }}</p>
                                
                                <div class="space-y-3">
                                    <Field v-model="element.data.faqs[faqIndex].q" :field="{
                                        type: 'text',
                                        name: 'faq_q_' + index + '_' + faqIndex,
                                        label: 'Câu hỏi (Question)',
                                    }" />
                                    <Field v-model="element.data.faqs[faqIndex].a" :field="{
                                        type: 'textarea',
                                        name: 'faq_a_' + index + '_' + faqIndex,
                                        label: 'Câu trả lời (Answer)',
                                    }" />
                                </div>
                            </div>
                            
                            <button type="button" class="btn btn-secondary btn-sm" @click="addFaq(index)">
                                + Thêm câu hỏi mới
                            </button>
                        </div>

                    </div>
                </div>
            </template>
        </Draggable>

        <div v-else class="border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400 italic">
            Chưa có block nội dung nào. Vui lòng chọn loại block ở góc phải trên và nhấn "+ Thêm Khối" để bắt đầu dựng trang.
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
            selectedBlockType: '',
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
    methods: {
        getBlockLabel(type) {
            return {
                HeroBanner: 'Banner đầu trang (Hero Banner)',
                Promotions: 'Khuyến mãi lớn (Promotions)',
                ThreeSixtyViewer: 'Xoay 360 độ (360 Viewer)',
                FeaturesGrid: 'Lưới tính năng thiết kế/nội thất (Features Grid)',
                VersionsGrid: 'Danh sách các phiên bản (Versions Grid)',
                SpecsGrid: 'Bảng so sánh thông số (Specs Grid)',
                FeaturesList: 'Danh sách tính năng (Features List)',
                AccordionFAQs: 'Câu hỏi thường gặp (Accordion FAQs)',
            }[type] || type
        },
        addBlock() {
            if (!this.selectedBlockType) return

            const newBlock = {
                type: this.selectedBlockType,
                is_collapsed: false,
                data: {}
            }

            // Initialize default structures based on type
            if (this.selectedBlockType === 'HeroBanner') {
                newBlock.data = {
                    title: '',
                    tagline: '',
                    button_text: 'Tìm hiểu thêm',
                    button_link: '/lien-he',
                    background_image: null,
                }
            } else if (this.selectedBlockType === 'Promotions') {
                newBlock.data = {
                    title: '',
                    description: '',
                    image: null,
                    button_text: 'Báo giá',
                }
            } else if (this.selectedBlockType === 'ThreeSixtyViewer') {
                newBlock.data = {
                    title: '',
                    description: '',
                }
            } else if (this.selectedBlockType === 'FeaturesGrid') {
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
                        { value: '', label: '' }
                    ]
                }
            } else if (this.selectedBlockType === 'VersionsGrid') {
                newBlock.data = {
                    title: '',
                    descriptions: ['', '', '']
                }
            } else if (this.selectedBlockType === 'SpecsGrid') {
                newBlock.data = {}
            } else if (this.selectedBlockType === 'FeaturesList') {
                newBlock.data = {
                    features: [
                        { title: '', description: '', image: null }
                    ]
                }
            } else if (this.selectedBlockType === 'AccordionFAQs') {
                newBlock.data = {
                    faqs: [
                        { q: '', a: '' }
                    ]
                }
            }

            this.blocks.push(newBlock)
            this.$emit('update:modelValue', this.blocks)
            this.selectedBlockType = ''
        },
        removeBlock(index) {
            if (confirm('Bạn có chắc chắn muốn xóa khối nội dung này không?')) {
                this.blocks.splice(index, 1)
                this.$emit('update:modelValue', this.blocks)
            }
        },
        toggleBlock(index) {
            this.blocks[index].is_collapsed = !this.blocks[index].is_collapsed
        },
        
        // Features list helper methods
        addFeature(blockIndex) {
            if (!this.blocks[blockIndex].data.features) {
                this.blocks[blockIndex].data.features = []
            }
            this.blocks[blockIndex].data.features.push({ title: '', description: '', image: null })
        },
        removeFeature(blockIndex, featureIndex) {
            this.blocks[blockIndex].data.features.splice(featureIndex, 1)
        },

        // Split features for FeaturesGrid helper methods
        addSplitFeature(blockIndex) {
            if (!this.blocks[blockIndex].data.split_features) {
                this.blocks[blockIndex].data.split_features = []
            }
            this.blocks[blockIndex].data.split_features.push({ value: '', label: '' })
        },
        removeSplitFeature(blockIndex, featureIndex) {
            this.blocks[blockIndex].data.split_features.splice(featureIndex, 1)
        },

        // FAQs list helper methods
        addFaq(blockIndex) {
            if (!this.blocks[blockIndex].data.faqs) {
                this.blocks[blockIndex].data.faqs = []
            }
            this.blocks[blockIndex].data.faqs.push({ q: '', a: '' })
        },
        removeFaq(blockIndex, faqIndex) {
            this.blocks[blockIndex].data.faqs.splice(faqIndex, 1)
        }
    }
}
</script>

<style scoped>
.form-select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-size: 1.5em 1.5em;
    background-repeat: no-repeat;
    padding-right: 2.5rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
</style>
