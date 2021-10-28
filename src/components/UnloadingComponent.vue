<template>
    <v-btn
            color="green"
            dark
            @click="getExcel()">
        <span v-if="!downloadBtn">
            <v-icon left>
                    {{ icons.mdiDownload}}
            </v-icon>
            {{downloadText}}
        </span>
        <span v-else>{{downloadTextWaiting}}</span>
    </v-btn>
</template>

<script>
    import XLSX from "xlsx";
    import {
        mdiDownload,
    } from '@mdi/js';

    export default {
        name: 'unloadingComponent',
        data: function () {
            return {
                downloadText: 'Скачать в xlsx',
                downloadTextWaiting: 'Пожалуйста, подождите...',
                downloadBtn: false,
                icons: {
                    mdiDownload,
                },
            }
        },
        methods: {
            getExcel() {
                this.downloadBtn = true;
                if (this.objProducts) {
                    this.unloadingExcel();
                }
            },
            unloadingExcel() {
                let wb = XLSX.utils.book_new();

                if ((this.allExcelObj).hasOwnProperty('products')) {
                    let products = XLSX.utils.json_to_sheet(this.allExcelObj.products);

                    XLSX.utils.book_append_sheet(wb, products, 'products');
                }
                this.downloadBtn = false;
                XLSX.writeFile(wb, 'unloading.xlsx')
            },
        },
        computed: {
            allExcelObj() {
                return this.$store.getters.getAllExcelObj;
            },
            dataTableProducts() {
                return this.$store.getters.getProductsData;
            },
            objProducts() {
                return this.$store.getters.getDoneObjProducts;
            },
            checkReceivingData() {
                return this.objProducts;
            },
        },
        watch: {
            dataTableProducts(val) {
                if (Object.keys(this.dataTableProducts).length !== 0)
                    this.$store.dispatch('getObjUnloadProducts', this.dataTableProducts);
            },
            checkReceivingData(val) {
                let error_key = false;
                if (typeof (val) === 'object') {
                    for (let key in val) {
                        if (!val[key] || val[key] === undefined) error_key = true;
                    }
                    if (!error_key && this.check)
                        this.unloadingExcel();
                }
            },
        }
    }

</script>
