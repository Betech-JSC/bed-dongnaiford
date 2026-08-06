<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <!-- ===== AI WRITER ASSISTANT ===== -->
            <div class="card mb-6 border-purple-200">
                <div class="card-header bg-purple-50 text-purple-900 flex items-center justify-between py-2.5 px-4 cursor-pointer select-none" @click="aiShowPanel = !aiShowPanel">
                    <span class="font-bold flex items-center text-sm">
                        <span class="mr-1.5 text-base">✨</span>
                        Trợ lý viết bài AI (Gemini AI Writer)
                    </span>
                    <span class="text-xs text-purple-600 font-semibold flex items-center">
                        {{ aiShowPanel ? 'Thu gọn ◀' : 'Mở rộng trợ lý viết bài ▶' }}
                    </span>
                </div>
                <div v-show="aiShowPanel" class="card-body bg-purple-50/10 border-t border-purple-100 p-4 space-y-4">
                    <div class="grid grid-cols-3 gap-4">
                        <div class="col-span-2">
                            <div class="text-xs text-gray-500 font-semibold mb-1">Chủ đề / Ý tưởng bài viết <span class="text-red-500">*</span></div>
                            <input 
                                type="text" 
                                v-model="aiTopic"
                                placeholder="Ví dụ: Giới thiệu xe Ford Ranger Wildtrak 2026 phiên bản mới nhất"
                                class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <div class="text-xs text-gray-500 font-semibold mb-1">Giọng điệu bài viết</div>
                            <select 
                                v-model="aiTone"
                                class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                            >
                                <option value="chuyên nghiệp">Chuyên nghiệp</option>
                                <option value="thân thiện">Thân thiện, gần gũi</option>
                                <option value="bán hàng (sales-focused)">Bán hàng & Kêu gọi hành động</option>
                                <option value="tin tức">Tin tức thời sự</option>
                                <option value="hào hứng">Hào hứng, cuốn hút</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <div class="text-xs text-gray-500 font-semibold mb-1">Từ khóa SEO (Phân cách bằng dấu phẩy)</div>
                            <input 
                                type="text" 
                                v-model="aiKeywords"
                                placeholder="Ví dụ: ford ranger 2026, giá xe ranger wildtrak, ford dong nai"
                                class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <div class="text-xs text-gray-500 font-semibold mb-1">Ngôn ngữ áp dụng</div>
                            <div class="flex items-center space-x-4 h-9">
                                <label class="flex items-center text-sm cursor-pointer select-none">
                                    <input type="radio" value="vi" v-model="aiLanguage" class="mr-1.5 focus:ring-purple-500" />
                                    🇻🇳 Tiếng Việt
                                </label>
                                <label class="flex items-center text-sm cursor-pointer select-none">
                                    <input type="radio" value="en" v-model="aiLanguage" class="mr-1.5 focus:ring-purple-500" />
                                    🇬🇧 English
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="text-xs text-gray-500 font-semibold mb-1">Dàn ý bài viết / Yêu cầu cụ thể (Không bắt buộc)</div>
                        <textarea 
                            v-model="aiOutline"
                            rows="3"
                            placeholder="Ví dụ: phần 1 giới thiệu ngoại thất xe, phần 2 động cơ dầu 2.0L Bi-Turbo, phần 3 giá lăn bánh tại Đồng Nai và khuyến mãi kèm theo."
                            class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        ></textarea>
                    </div>

                    <div class="flex justify-end pt-2">
                        <button 
                            type="button"
                            :disabled="aiLoading || !aiTopic.trim()"
                            @click="generateAI"
                            class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-bold flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-0 cursor-pointer shadow-sm"
                        >
                            <span v-if="aiLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            <span>{{ aiLoading ? 'Đang viết bài...' : '🪄 Viết bài bằng AI' }}</span>
                        </button>
                    </div>

                    <!-- AI GENERATED RESULTS PREVIEW -->
                    <div v-if="aiResult" class="border border-purple-200 rounded-lg overflow-hidden bg-white mt-4 shadow-sm">
                        <div class="bg-purple-100/50 px-4 py-2 flex items-center justify-between border-b border-purple-200">
                            <span class="text-xs font-bold text-purple-900 flex items-center">
                                <span class="mr-1 text-sm">💡</span> Xem thử bài viết tạo bởi AI
                            </span>
                            <button 
                                type="button"
                                @click="applyAIResult"
                                class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded flex items-center transition-colors border-0 cursor-pointer shadow-sm"
                            >
                                ✅ Áp dụng vào bài viết ({{ aiLanguage === 'vi' ? 'Tiếng Việt' : 'English' }})
                            </button>
                        </div>
                        <div class="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                            <div>
                                <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Tiêu đề bài viết</div>
                                <div class="text-sm font-bold text-gray-900 border-b pb-2">{{ aiResult.title }}</div>
                            </div>
                            <div>
                                <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Mô tả bài viết (Meta Description)</div>
                                <div class="text-xs text-gray-600 italic border-b pb-2">{{ aiResult.description }}</div>
                            </div>
                            <div>
                                <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Nội dung bài viết (HTML Preview)</div>
                                <div class="prose prose-sm max-w-none text-sm text-gray-800 leading-relaxed" v-html="aiResult.content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ===== LOCALE TABS ===== -->
            <div class="card">
                <div class="card-header border-b-0 pb-0">
                    <ul class="flex border-b">
                        <li class="-mb-px mr-1">
                            <a class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
                               :class="currentTab === 'vi' ? 'border-l border-t border-r rounded-t text-primary-700' : 'text-gray-500 hover:text-primary-800'"
                               @click="currentTab = 'vi'">🇻🇳 Tiếng Việt</a>
                        </li>
                        <li class="-mb-px mr-1">
                            <a class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
                               :class="currentTab === 'en' ? 'border-l border-t border-r rounded-t text-primary-700' : 'text-gray-500 hover:text-primary-800'"
                               @click="currentTab = 'en'">🇬🇧 English</a>
                        </li>
                    </ul>
                </div>
                <div class="card-body mt-4">
                    <Field
                        v-model="form[currentTab].title"
                        :field="{
                            type: 'text',
                            name: `title_${currentTab}`,
                            label: 'Tiêu đề',
                        }"
                    />
                    <div class="mb-4">
                        <div class="text-xs text-gray-500 font-semibold mb-1">Đường dẫn bài viết (URL Slug)</div>
                        <div class="flex items-center">
                            <span class="text-gray-400 text-xs bg-gray-100 border border-gray-300 rounded-l px-3 py-2 border-r-0 select-none font-mono">/</span>
                            <input
                                type="text"
                                v-model="form[currentTab].seo_slug"
                                @input="form[currentTab].seo_slug = slugify($event.target.value)"
                                class="w-full bg-white border border-gray-300 rounded-r px-3 py-1.5 text-sm font-mono focus:ring-1 focus:ring-primary-500 focus:outline-none"
                                :placeholder="form[currentTab].slug"
                            />
                        </div>
                    </div>
                    <small v-if="form.id" class="block mb-4 text-xs text-gray-500">
                        <span v-for="(url, locale) in form.url" :key="locale" class="block">
                            {{ locale }}: <a :href="url" target="_blank" class="link font-mono">{{ decodeURI(url) }}</a>
                        </span>
                    </small>
                    <Field
                        v-model="form[currentTab].author"
                        :field="{
                            type: 'text',
                            name: `author_${currentTab}`,
                            label: 'Tác giả',
                        }"
                    />
                    <Field
                        v-model="form[currentTab].description"
                        :field="{
                            type: 'textarea',
                            name: `description_${currentTab}`,
                            label: 'Mô tả',
                        }"
                    />
                    <div class="mb-4">
                        <div class="flex items-center justify-between mb-2">
                            <label class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nội dung</label>
                            <button
                                type="button"
                                @click="showHtmlEditor[currentTab] = !showHtmlEditor[currentTab]"
                                class="px-2.5 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded flex items-center transition-colors border border-gray-300 cursor-pointer shadow-sm"
                            >
                                <span class="mr-1">{{ showHtmlEditor[currentTab] ? '📝' : '💻' }}</span>
                                <span>{{ showHtmlEditor[currentTab] ? 'Xem dạng soạn thảo' : 'Xem code HTML bài viết' }}</span>
                            </button>
                        </div>
                        <div v-if="showHtmlEditor[currentTab]">
                            <textarea
                                v-model="form[currentTab].content"
                                rows="20"
                                class="w-full bg-[#1e1e1e] text-green-400 font-mono text-sm p-4 rounded border border-gray-700 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                                placeholder="<!-- Nhập mã HTML tại đây -->"
                            ></textarea>
                        </div>
                        <Field
                            v-else
                            v-model="form[currentTab].content"
                            :field="{
                                type: 'richtext',
                                name: `content_${currentTab}`,
                                label: '',
                            }"
                        />
                        
                        <!-- Shortcode CTA Guide Helper Box -->
                        <div class="mt-3 p-3.5 bg-blue-50/80 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start space-x-2">
                            <span class="text-base leading-none">💡</span>
                            <div class="space-y-1">
                                <div class="font-bold text-blue-950">Hướng dẫn chèn Form Đăng ký tư vấn (CTA):</div>
                                <div class="leading-relaxed text-blue-800">
                                    Để chèn khung đăng ký tư vấn Đồng Nai Ford vào bất kỳ vị trí nào trong nội dung bài viết, bạn chỉ cần gõ từ khóa <code class="bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-mono font-bold select-all">[cta-form]</code> (hoặc <code class="bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-mono font-bold select-all">[[cta-form]]</code>) trên một dòng riêng biệt. Hệ thống phía ngoài web sẽ tự động nhận diện và chèn form đăng ký tư vấn tại vị trí đó.
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Related Articles URLs Input -->
                    <div class="border-t border-gray-100 pt-6 mt-6">
                        <div class="text-xs text-gray-500 font-semibold mb-1">Đường dẫn bài viết liên quan (Chèn đường dẫn/slug bài viết, mỗi dòng một bài viết)</div>
                        <textarea
                            v-model="form.related_urls"
                            rows="4"
                            class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 focus:outline-none font-mono"
                            placeholder="Ví dụ:&#10;/mua-tra-gop-ford-ranger&#10;https://dongnaiford.com.vn/danh-gia-xe-ford-territory-2026"
                        ></textarea>
                    </div>
                </div>
            </div>
            <SeoFields :modelValue="form[currentTab]" @update:modelValue="form[currentTab] = $event" />
        </template>

        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field v-model="form.status" :field="{
                        type: 'radio_list',
                        name: 'status',
                        label: 'Trạng thái',
                        options: schema.columns.status.list,
                    }" />
                    <Field v-model="form.published_at" :field="{
                        type: 'date',
                        name: 'published_at',
                        label: 'Ngày xuất bản',
                    }" />
                    <Field v-model="form.is_featured" :field="{
                        type: 'checkbox',
                        name: 'is_featured',
                        label: 'Nổi bật',
                    }" />
                    <Field v-model="form.image" :field="{
                        type: 'file_upload',
                        name: 'image',
                        multiple: false,
                    }" />
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <Field v-model="form.categories" :field="{
                        type: 'select_multiple',
                        name: 'categories',
                        labelBy: 'title',
                        source: {
                            model: 'App\\Models\\Post\\PostCategory',
                            method: 'get',
                            only: ['id', 'title'],
                        },
                    }" />
                </div>
            </div>
        </template>
    </Form>
</template>

<script>
import axios from 'axios';

export default {
    props: ['item', 'schema'],

    data() {
        return {
            currentTab: this.getCurrentLocale?.() ?? 'vi',
            formData: this.initFormData(this.item),
            aiShowPanel: false,
            aiTopic: '',
            aiTone: 'chuyên nghiệp',
            aiKeywords: '',
            aiLanguage: 'vi',
            aiOutline: '',
            aiLoading: false,
            aiResult: null,
            showHtmlEditor: {
                vi: false,
                en: false
            }
        }
    },

    watch: {
        item() {
            this.formData = this.initFormData(this.item)
        },
        'formData.vi.title'(newTitle) {
            if (!this.item.id && this.formData.vi) {
                this.formData.vi.slug = this.slugify(newTitle);
            }
        },
        'formData.en.title'(newTitle) {
            if (!this.item.id && this.formData.en) {
                this.formData.en.slug = this.slugify(newTitle);
            }
        }
    },

    methods: {
        initFormData(item) {
            const data = {
                status: 'ACTIVE',
                ...item,
            }
            // Build the list of URLs/slugs
            let relatedUrls = '';
            if (item.related_posts && Array.isArray(item.related_posts)) {
                relatedUrls = item.related_posts.map(p => {
                    let trans = p.translations ? p.translations.find(t => t.locale === 'vi') : null;
                    let slug = trans ? (trans.seo_slug || trans.slug) : (p.seo_slug || p.slug);
                    return slug ? `/${slug}` : '';
                }).filter(Boolean).join('\n');
            }
            data.related_urls = relatedUrls;
            const locales = ['vi', 'en']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                data[loc] = {
                    title:                trans ? (trans.title                ?? '') : (loc === 'vi' ? (item.title                ?? '') : ''),
                    slug:                 trans ? (trans.slug                 ?? '') : (loc === 'vi' ? (item.slug                 ?? '') : ''),
                    seo_slug:             trans ? (trans.seo_slug             ?? '') : '',
                    author:               trans ? (trans.author               ?? '') : (loc === 'vi' ? (item.author               ?? '') : ''),
                    description:          trans ? (trans.description          ?? '') : (loc === 'vi' ? (item.description          ?? '') : ''),
                    content:              trans ? (trans.content              ?? '') : (loc === 'vi' ? (item.content              ?? '') : ''),
                    seo_meta_title:       trans ? (trans.seo_meta_title       ?? '') : '',
                    seo_meta_description: trans ? (trans.seo_meta_description ?? '') : '',
                    seo_meta_keywords:    trans ? (trans.seo_meta_keywords    ?? '') : '',
                    seo_meta_robots:      trans ? (trans.seo_meta_robots      ?? '') : '',
                    seo_canonical:        trans ? (trans.seo_canonical        ?? '') : '',
                    seo_image:            trans ? (trans.seo_image            ?? null) : null,
                }
            })
            return data
        },
        generateAI() {
            if (!this.aiTopic.trim()) return;
            this.aiLoading = true;
            this.aiResult = null;
            
            axios.post(route('admin.posts.generate-ai'), {
                topic: this.aiTopic,
                tone: this.aiTone,
                keywords: this.aiKeywords,
                outline: this.aiOutline,
                language: this.aiLanguage
            })
            .then(res => {
                if (res.data && res.data.success) {
                    this.aiResult = res.data.data;
                } else {
                    alert('Lỗi tạo bài viết: ' + (res.data?.message || 'Không có phản hồi'));
                }
            })
            .catch(err => {
                alert('Có lỗi xảy ra: ' + (err.response?.data?.message || err.message));
            })
            .finally(() => {
                this.aiLoading = false;
            });
        },
        applyAIResult() {
            if (!this.aiResult) return;
            
            this.currentTab = this.aiLanguage;

            if (!this.formData[this.currentTab]) {
                this.formData[this.currentTab] = {};
            }

            this.formData[this.currentTab].title = this.aiResult.title;
            this.formData[this.currentTab].description = this.aiResult.description;
            this.formData[this.currentTab].content = this.aiResult.content;
            this.formData[this.currentTab].slug = this.slugify(this.aiResult.title);
            
            alert('Đã áp dụng kết quả từ AI vào tab bài viết ' + (this.aiLanguage === 'vi' ? 'Tiếng Việt' : 'English') + '!');
        },
        slugify(str, separator = "-") {
            if (!str) return '';
            return str
                .toLowerCase()
                .replace(/\t/g, "")
                .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
                .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
                .replace(/ì|í|ị|ỉ|ĩ/g, "i")
                .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
                .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
                .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
                .replace(/đ/g, "d")
                .replace(/\s+/g, separator)
                .replace(/[^A-Za-z0-9_-]/g, "")
                .replace(/-+/g, separator);
        }
    },
}
</script>
