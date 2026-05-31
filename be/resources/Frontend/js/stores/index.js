import axios from "axios";
import { defineStore } from "pinia";

const appUrl = import.meta.env.VITE_APP_URL;

export const useAppStore = defineStore("app", {
    state: () => ({
        cart: {},
        locationID: null,
        relatedProducts: [],
        recentlyProducts: [],

        formOrder: {
            name: "",
            phone: "",
            email: "",

            note: "",
            shipping_address: "",

            city: "",
            district: "",
            ward: "",

            payment_method: 1,

            tax_lines: {
                company_name: "",
                tax_code: "",
                company_address: "",
                company_email: "",
            },
        },
    }),
    actions: {
        async fetchCart() {
            const { data } = await axios.get(appUrl + "/api/checkout/cart");
            if (data) {
                this.cart = data.cart;
            }
        },

        async fetchRecentlyProducts(excepted_id) {
            const params = excepted_id ? { excepted_id } : {};
            const { data } = await axios.get(appUrl + `/recently-products`, {
                params,
            });

            if (data) {
                this.recentlyProducts = data.data;
            }
        },
        async fetchRelatedProducts(id) {
            const { data } = await axios.get(
                appUrl + `/related-products/${id}`
            );

            if (data) {
                this.relatedProducts = data.data;
            }
        },
    },
});
