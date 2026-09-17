<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">{{ tt('models.setting.general_information') }}</div>
                <div class="card-body">
                    <template v-for="(val, field) in visibleFields(form.data_contact)" :key="field">
                        <div v-if="typeof form.data_contact[field] === 'object' && form.data_contact[field] != null" class="mb-4">
                            <div class="pb-2 text-sm font-semibold select-none text-gray-700">
                                {{ field }}
                            </div>
                            <div class="pb-2">
                                <pre class="bg-gray-50 p-3 rounded-lg text-xs">{{ JSON.stringify(form.data_contact[field], null, 2) }}</pre>
                            </div>
                        </div>
                        <div v-else class="mb-4">
                            <Field
                                :key="field"
                                :model-value="form.data_contact[field]"
                                @update:model-value="onFieldUpdate(field, $event, form)"
                                :field="{
                                    type: isTextarea(field) ? 'textarea' : 'text',
                                    name: field,
                                    label: getFieldLabel(field),
                                    rows: 3,
                                }"
                            />
                        </div>
                    </template>
                </div>
            </div>
        </template>
        <template #aside="{ form }">
            <div class="card">
                <div class="card-body space-y-4">
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
                        v-model="form.note"
                        :field="{
                            type: 'textarea',
                            name: 'note',
                            label: 'Ghi chú nội bộ (Admin)',
                            placeholder: 'Ghi chú tiếp nhận xe, báo giá, tiến độ dịch vụ...',
                            rows: 4,
                        }"
                    />
                    <Field
                        v-model="form.sent_at"
                        :field="{
                            type: 'date',
                            name: 'sent_at',
                            label: 'Ngày gửi',
                        }"
                    />
                    <Field
                        v-model="form.created_at"
                        :field="{
                            type: 'date',
                            name: 'created_at',
                            label: 'Ngày thêm',
                        }"
                    />
                </div>
            </div>
        </template>
    </Form>
</template>
<script>
export default {
    props: ['item', 'schema'],
    data() {
        const item = { ...this.item };
        if (item.created_at) {
            if (item.created_at.includes('T')) {
                item.created_at = item.created_at.split('T')[0];
            } else if (item.created_at.includes(' ')) {
                item.created_at = item.created_at.split(' ')[0];
            }
        }
        const rawSentAt = item.sent_at || item.created_at;
        if (rawSentAt) {
            if (rawSentAt.includes('T')) {
                item.sent_at = rawSentAt.split('T')[0];
            } else if (rawSentAt.includes(' ')) {
                item.sent_at = rawSentAt.split(' ')[0];
            } else {
                item.sent_at = rawSentAt;
            }
        }
        if (!item.data_contact || typeof item.data_contact !== 'object') {
            item.data_contact = {};
        }
        return {
            formData: item,
        }
    },
    methods: {
        visibleFields(dataContact) {
            const raw = dataContact || {};
            const clean = {};
            const aliasMap = {
                'Name': 'Họ và tên',
                'Phone': 'Số điện thoại',
                'Email': 'E-mail',
                'Tại': 'Địa điểm làm dịch vụ',
            };
            const excludeKeys = ['Ngày gửi', 'Ngày thêm', 'sent_at', 'created_at'];

            for (const [key, value] of Object.entries(raw)) {
                if (aliasMap[key] && raw[aliasMap[key]] !== undefined) {
                    continue;
                }
                if (excludeKeys.includes(key)) {
                    continue;
                }
                clean[key] = value;
            }
            return clean;
        },
        isTextarea(field) {
            const lower = (field || '').toLowerCase();
            return lower.includes('ghi chú') || lower.includes('nội dung') || lower.includes('yêu cầu') || lower.includes('lời nhắn');
        },
        getFieldLabel(field) {
            const map = {
                'Name': 'Họ và tên',
                'Phone': 'Số điện thoại',
                'Email': 'E-mail',
                'Tại': 'Địa điểm làm dịch vụ',
            };
            return map[field] || field;
        },
        onFieldUpdate(field, val, form) {
            form.data_contact[field] = val;
            if (!form.data) form.data = {};
            form.data[field] = val;

            if (field === 'Họ và tên') {
                form.data_contact['Name'] = val;
                form.data['Name'] = val;
            } else if (field === 'Name') {
                form.data_contact['Họ và tên'] = val;
                form.data['Họ và tên'] = val;
            }
            if (field === 'Số điện thoại') {
                form.data_contact['Phone'] = val;
                form.data['Phone'] = val;
            } else if (field === 'Phone') {
                form.data_contact['Số điện thoại'] = val;
                form.data['Số điện thoại'] = val;
            }
            if (field === 'E-mail' || field === 'Email') {
                form.data_contact['Email'] = val;
                form.data_contact['E-mail'] = val;
                form.data['Email'] = val;
                form.data['E-mail'] = val;
            }
            if (field === 'Địa điểm làm dịch vụ') {
                form.data_contact['Tại'] = val;
                form.data['Tại'] = val;
            }
        },
    },
}
</script>
