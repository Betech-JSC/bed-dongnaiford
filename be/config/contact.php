<?php

return [
    'types' => [
        'CONTACT_FORM' => [
            'title' => 'Liên hệ',
            'columns' => [
                'Email',
                'Phone',
            ],
            'all_columns' => [
                'Email',
                'Phone',
            ],
            'rules' => [
                'Phone' => 'required|regex:/(0)[0-9]/|not_regex:/[a-z]/|min:9|max:12',
                'Name' => 'required',
            ],
            'route' => 'contacts',
        ],
        'ADVISE_FORM' => [
            'title' => 'Tư vấn sản phẩm',
            'columns' => [
                'Phone',
            ],
            'all_columns' => [
                'Phone',
                'Product' => [
                    'column' => 'product_url',
                    'route' => [
                        'name' => 'products.show',
                        'params' => [
                            'slug',
                        ],
                    ],
                ],
            ],
            'rules' => [
                'Phone' => 'required|regex:/(0)[0-9]/|not_regex:/[a-z]/|min:9|max:12',
                'Product.id' => 'required',
                'Product.slug' => 'required',
                'Product.title' => 'required',
            ],
            'route' => 'advises',
        ],
    ],
    'message' => [
        'new_contact' => 'Bạn nhận được liên hệ mới',
        'success_form' => 'Chúc mừng bạn gửi form thành công',
    ],
    'email_urls' => [
        'url' => 'Xem chi tiết liên hệ',
    ],
];
