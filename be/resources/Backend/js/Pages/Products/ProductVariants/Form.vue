<template>
    <div class="grid grid-cols-12 gap-3">
        <div class="col-span-5 p-3 mt-3 rounded shadow">
            <div class="col-span-4">
                <div class="card">
                    <div class="card-body">
                        <Link
                            :href="
                                route('admin.products.form', {
                                    id: product.id,
                                })
                            "
                            class="flex items-center space-x-2 text-lg cursor-pointer link"
                        >
                            {{ product.title }}
                        </Link>
                    </div>
                </div>
                <div
                    v-if="product.variants?.length"
                    class="table table-inside card"
                >
                    <div class="card-body">
                        <ul>
                            <li
                                v-for="(variant, index) in product.variants"
                                :key="index"
                                :class="{
                                    'bg-gray-100': variant.id == form.id,
                                }"
                            >
                                <Link
                                    :href="
                                        route('admin.variants.edit', {
                                            productId: variant.product_id,
                                            variantId: variant.id,
                                        })
                                    "
                                    class="block w-full p-2 link"
                                >
                                    <div
                                        :class="{
                                            'font-bold':
                                                variant.id == variantId,
                                        }"
                                    >
                                        {{ variant.title }}
                                        <span v-if="variant.is_default"
                                            >(Mặc định)</span
                                        >
                                    </div>
                                    <small
                                        v-if="variant.options"
                                        class="block text-xs text-gray-500"
                                    >
                                        {{
                                            pluck(
                                                variant.options,
                                                "title"
                                            ).join(" / ")
                                        }}
                                    </small>
                                </Link>
                            </li>
                        </ul>
                        <div class="m-6 btn">
                            <a
                                :href="
                                    route('admin.variants.form', {
                                        productId: product.id,
                                    })
                                "
                                variant="outline-secondary"
                                >Thêm mới</a
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-7 py-3">
            <Form
                :modelValue="form"
                :config="{
                    addGrid: false,
                    showActions: false,
                }"
                :rules="rules"
            >
                <div class="card">
                    <div class="card-body">
                        <Field
                            v-model="form.status"
                            :field="{
                                type: 'radio_list',
                                name: 'status',
                                label: 'Trạng thái',
                                options: schema.columns.status.list,
                            }"
                        />
                        <Field
                            v-model="form.condition"
                            :field="{
                                type: 'radio_list',
                                name: 'condition',
                                label: 'Tình trạng',
                                options: schema.columns.condition.list,
                            }"
                        />
                        <Field
                            v-model="form.is_default"
                            :field="{
                                type: 'checkbox',
                                name: 'text',
                                label: 'Đặt làm mặc định',
                            }"
                        />
                        <Field
                            v-if="form.id"
                            v-model="form.id"
                            :disabled="true"
                            :field="{
                                label: 'ID',
                            }"
                        />
                        <Field
                            v-model="form.title"
                            :field="{
                                type: 'text',
                                name: 'title',
                                label: 'Tên biến thể',
                            }"
                        />
                        <Field
                            v-model="form.sku"
                            :field="{
                                type: 'text',
                                name: 'sku',
                                label: 'SKU',
                            }"
                        />
                        <Field
                            v-model="form.price"
                            :field="{
                                type: 'decimal',
                                name: 'price',
                                label: 'Giá',
                            }"
                        />
                        <Field
                            v-model="form.old_price"
                            :field="{
                                type: 'decimal',
                                name: 'old_price',
                                label: 'Giá cũ',
                            }"
                        />
                        <Field
                            v-model="form.sale_price"
                            :field="{
                                type: 'decimal',
                                name: 'sale_price',
                                label: 'Giá sale',
                            }"
                        />
                        <Field
                            v-model="form.flash_sale_quantity"
                            :field="{
                                type: 'number',
                                name: 'flash_sale_quantity',
                                label: 'Sản phẩm Flash Sale còn lại trong kho',
                            }"
                        />
                        <Field
                            v-model="form.sale_quantity"
                            :disabled="true"
                            :field="{
                                type: 'number',
                                name: 'sale_quantity',
                                label: 'Sản phẩm Flash Sale đã bán',
                            }"
                        />
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <div
                            v-if="product.list_variant_option.length == 0"
                            class="flex flex-col"
                        >
                            Hiện tại chưa có thuộc tính nào. Vui lòng thêm thuộc
                            tính vào
                            <Link
                                :href="
                                    route('admin.products.form', {
                                        id: product.id,
                                    })
                                "
                                class="link"
                                >Sản phẩm chính</Link
                            >
                            trước.
                        </div>
                        <div
                            v-for="(option, index) in this.product
                                .list_variant_option"
                            :key="index"
                            class="my-2 space-y-2 bg-white rounded-md"
                        >
                            <Field
                                class="grow"
                                :modelValue="form.options[index].option_id"
                                @change="
                                    updateOption(
                                        index,
                                        option.id.toString(),
                                        form.options[index].option_id
                                    )
                                "
                                @update:modelValue="
                                    form.options[index].option_id =
                                        option.nodes.find(
                                            (x) =>
                                                x.id.toString() ===
                                                $event.toString()
                                        )
                                "
                                :field="{
                                    label: option.title,
                                    type: 'dropdown',
                                    options: transformOptions(option.nodes),
                                    keyBy: 'id',
                                    labelBy: 'title',
                                }"
                            />
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body">
                        <Dialog
                            header="Hình ảnh"
                            v-model:visible="showFileModal"
                            :breakpoints="{
                                '960px': '75vw',
                                '640px': '90vw',
                            }"
                            :style="{ width: '50vw' }"
                            :draggable="true"
                        >
                            <div class="space-y-6">
                                <div class="grid grid-cols-5 gap-3">
                                    <div
                                        v-for="(file, index) in product.images"
                                        :key="index"
                                        class="relative col-span-1 group"
                                    >
                                        <div
                                            class="overflow-hidden transition-colors duration-200 bg-gray-100 border border-gray-100 rounded cursor-pointer select-none aspect-square"
                                            :class="{
                                                'outline outline-offset-2 outline-2 outline-blue-500':
                                                pluck(selectedFiles, 'path').includes(
                                                    file.path
                                                ),
                                            }"
                                            @click="toggleFile(file)"
                                        >
                                            <small
                                                class="absolute top-0 w-full text-xs text-center text-black bg-gray-100 h-[1rem] overflow-hidden"
                                            >
                                                {{ file.filename }}
                                            </small>
                                            <img
                                                v-if="isImage(file.path)"
                                                :src="staticUrl(file.path)"
                                                class="object-contain w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <template #footer>
                                <Button
                                    variant="white"
                                    @click="showFileModal = false"
                                    label="Đóng"
                                />
                            </template>
                        </Dialog>
                        <Field
                            v-model="form.images"
                            :field="{
                                type: 'file_upload',
                                name: 'images',
                                multiple: true,
                                canAddFile: false,
                            }"
                        />
                        <Button
                            type="button"
                            class="ml-2"
                            @click="editFileUpdate"
                            label="Chọn Hình"
                        />
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">Videos</div>
                    <div class="card-body">
                        <ProductVideos v-model="form.video_urls" />
                    </div>
                </div>

                <div class="flex mt-6">
                    <Button label="Lưu" class="btn-primary" @click="store()" />
                    <Button
                        v-if="form.id"
                        variant="link-danger"
                        label="Xóa"
                        class="ml-auto btn-danger-link"
                        @click="destroy()"
                    />
                </div>
            </Form>
        </div>
    </div>
</template>

<script>
export default {
    props: ["item", "schema", "product"],

    data() {
        return {
            form: {},
            files: [],
            selectedFiles: [],
            showFileModal: false,
        };
    },

    watch: {
        item() {
            this.form.id = this.item.id;
        },
    },

    created() {
        this.initForm();
    },

    methods: {
        store() {
            this.form.product_id = this.product.id;
            this.$inertia.post(
                this.route(`admin.variants.store`, {
                    productId: this.product?.id,
                    variantId: this.item?.id,
                }),
                this.form
            );
        },
        destroy() {
            if (confirm("Bạn chắc chắn muốn xoá đối tượng này?")) {
                const url = this.route(`admin.variants.destroy`, {
                    id: this.form.id,
                });
                this.$inertia.post(url);
            }
        },
        initForm() {
            this.item.status = this.item.status ?? "ACTIVE";
            this.item.condition = this.item.condition ?? "STOCKING";
            let images = this.item.images ?? [];
            this.form = this.$inertia.form({
                ...this.item,
                images,
                price: this.item.price ?? 0,
                old_price: this.item.old_price ?? 0,
                sale_price: this.item.sale_price ?? 0,
                video_urls: this.item.video_urls ?? [],
            });

            this.selectedFiles = images;
        },
        transformOptions(options) {
            const keyBy = "id";
            return options.map((item) => {
                item[keyBy] = item[keyBy].toString();
                return item;
            });
        },
        updateOption(index, id, value) {
            this.form.options[index] = {
                parent_id: id,
                option_id: value.id,
            };
        },
        editFileUpdate() {
            this.showFileModal = true;
            //this.$emit("change", this.files);
        },
        toggleFile(file) {
            const fileIndex = this.pluck(this.selectedFiles, "path").indexOf(
                file.path
            );
            if (fileIndex < 0) {
                this.selectedFiles.push(file);
            } else {
                this.selectedFiles.splice(fileIndex, 1);
            }
        },
    },
};
</script>
<style lang="scss">
.multiselect__tags {
    @apply max-w-[100%];
}
</style>
