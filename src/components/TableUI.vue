<template>
    <div id="TableUI">
        <v-card>
            <v-card-title>
                <v-row class="d-flex align-center">
                    <v-col cols="2" class="text-uppercase text-left">
                        Правильное питание
                    </v-col>
                    <v-col cols="7">
                        <v-spacer></v-spacer>
                    </v-col>
                    <v-col cols="3" class="pt-0">
                        <v-text-field
                                v-model="search"
                                append-icon="mdi-magnify"
                                class="pt-0 mt-0"
                                label="Поиск"
                                single-line
                                hide-details
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-data-table
                    v-model="selected"
                    :headers="tableHeader"
                    :items="bodyTable"
                    :search="search"
                    :footer-props="{
                        'items-per-page-options': [10, 50, 100],
                        'items-per-page-text': 'Элементов на странице:',
                     }"
                    :items-per-page="10"
                    item-key="id"
                    show-select
                    class="elevation-1"
                    loading="false"
                    loading-text="Загрузка... Пожалуйста, подождите"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-row>
                            <v-col cols="5" class="d-flex justify-start">
                                <v-container fluid class="pl-0 pt-4">
                                    <v-select
                                            v-model="headerTable"
                                            :items="headerOptions"
                                            return-object
                                            label="Выберите колонки для отображения"
                                            multiple
                                    >
                                        <template v-slot:prepend-item>
                                            <v-list-item
                                                    ripple
                                                    @click="toggle"
                                            >
                                                <v-list-item-action>
                                                    <v-icon :color="headerTable.length > 0 ? 'indigo darken-4' : ''"
                                                    >
                                                        {{ icon }}
                                                    </v-icon>
                                                </v-list-item-action>
                                                <v-list-item-content>
                                                    <v-list-item-title>
                                                        Выбрать все
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                            <v-divider class="mt-2"></v-divider>
                                        </template>
                                    </v-select>
                                </v-container>
                            </v-col>
                            <v-col cols="4">
                                <v-spacer></v-spacer>
                            </v-col>
                            <v-col cols="3" class="d-flex justify-end pt-5">
                                <unloadingComponent></unloadingComponent>
                                <v-dialog v-model="dialog" max-width="500px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                                color="primary"
                                                class="ml-4"
                                                dark
                                                v-bind="attrs"
                                                v-on="on"
                                        >
                                            <v-icon left>
                                                {{ icons.mdiPlus}}
                                            </v-icon>
                                            Новый продукт
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title>
                                            <span class="headline">{{ formTitle }}</span>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedItem.product"
                                                                      label="Название продукта"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedItem.calories"
                                                                      label="Калории"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedItem.fat"
                                                                      label="Жиры (г)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedItem.carbs"
                                                                      label="Углеводы (г)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedItem.protein"
                                                                      label="Протеин (г)"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="closeWindow">Закрыть</v-btn>
                                            <v-btn color="blue darken-1" text @click="saveWindow">Сохранить</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-col>
                        </v-row>
                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon
                            small
                            class="mr-2"
                            @click="editItem(item)"
                    >
                        mdi-pencil
                    </v-icon>
                    <v-icon
                            small
                            @click="prepareToDelete(item)"
                    >
                        mdi-delete
                    </v-icon>
                </template>
                <template v-slot:item.calories="{ item }">
                    <v-chip :color="getColor(item.calories)" dark>{{ item.calories }}</v-chip>
                </template>
                <template v-slot:item.product="props">
                    <v-edit-dialog
                            :return-value.sync="props.item.product"
                            @save="save"
                            @cancel="cancel"
                            @open="open"
                            @close="close"
                    > {{ props.item.product }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model="props.item.product"
                                    :rules="[max25chars]"
                                    label="Edit"
                                    single-line
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.iron="props">
                    <v-edit-dialog
                            :return-value.sync="props.item.iron"
                            large
                            persistent
                            @save="save"
                            @cancel="cancel"
                            @open="open"
                            @close="close"
                    >
                        <div>{{ props.item.iron }}</div>
                        <template v-slot:input>
                            <div class="mt-4 title">Обновить</div>
                        </template>
                        <template v-slot:input>
                            <v-text-field
                                    v-model="props.item.iron"
                                    :rules="[max25chars]"
                                    label="Edit"
                                    single-line
                                    counter
                                    autofocus
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template
                        v-slot:body
                        v-if="headerTable.length === 0"
                >
                    <tr>
                        <td class="text-center center pt-5 pb-5 w-100">
                            <div>
                                Пожалуйста, выберите колонку для отображения.
                            </div>
                        </td>
                    </tr>
                </template>
                <template v-slot:body.append v-if="this.selected.length !== 0">
                    <tr class="delete-all-selected">
                        <td></td>
                        <td class="text-center center pt-5 pb-5">
                            <v-card
                                    max-width="100">
                                <v-btn
                                        depressed
                                        color="primary"
                                        block
                                        @click="deleteAllSelectedItem">
                                    Удалить выбранное
                                </v-btn>
                            </v-card>
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
                {{ snackText }}
                <template v-slot:action="{ attrs }">
                    <v-btn v-bind="attrs" text @click="snack = false">Закрыть</v-btn>
                </template>
            </v-snackbar>
        </v-card>
        <v-dialog
                v-model="show"
                persistent
                max-width="290"
                :retain-focus="false"
        >
            <v-card overlay-opacity="0.15">
                <v-card-title class="text-h5">
                </v-card-title>
                <v-card-text>Вы уверены, что хотите удалить этот элемент?</v-card-text>
                <v-card-actions>
                    <v-btn
                            color="red darken-1"
                            text
                            @click="show = false"
                    >
                        Нет
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="green darken-1"
                            text
                            @click="modalDeleteItem(itemToDelete)"
                    >
                        Да
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import unloadingComponent from './UnloadingComponent.vue';
    import request from '../api/request.js';
    import {
        mdiPlus,
    } from '@mdi/js';

    export default {
        name: 'tableUI',
        data() {
            return {
                headerOptions: [
                    {
                        text: 'Продукт (порция 100 г)',
                        align: 'start',
                        sortable: false,
                        value: 'product',
                    },
                    {text: 'Калории', value: 'calories'},
                    {text: 'Жиры (г)', value: 'fat'},
                    {text: 'Углеводы (г)', value: 'carbs'},
                    {text: 'Протеин (г)', value: 'protein'},
                    {text: 'Железо (%)', value: 'iron'},
                ],
                headerTable: [{
                    text: 'Продукт (порция 100 г)',
                    align: 'start',
                    sortable: false,
                    value: 'product',
                },
                    {text: 'Калории', value: 'calories'},
                    {text: 'Жиры (г)', value: 'fat'},
                    {text: 'Углеводы (г)', value: 'carbs'},
                    {text: 'Протеин (г)', value: 'protein'},
                    {text: 'Железо (%)', value: 'iron'},
                ],
                selected: [],
                search: '',
                snack: false,
                snackColor: '',
                snackText: '',
                max25chars: v => v.length <= 25 || 'Слишком длинный ввод',

                dialog: false,
                editedIndex: -1,
                editedItem: {
                    product: '',
                    calories: 0,
                    fat: 0,
                    carbs: 0,
                    protein: 0,
                },
                defaultItem: {
                    product: '',
                    calories: 0,
                    fat: 0,
                    carbs: 0,
                    protein: 0,
                },
                showScheduleForm: false,
                messageInform: false,
                show: false,
                itemToDelete: '',
                icons: {
                    mdiPlus,
                },
            }
        },
        components: {
            unloadingComponent,
        },
        methods: {
            save() {
                this.snack = true;
                this.snackColor = 'success';
                this.snackText = 'Данные сохранены';
            },
            cancel() {
                this.snack = true;
                this.snackColor = 'error';
                this.snackText = 'Отменено';
            },
            open() {
                this.snack = true;
                this.snackColor = 'info';
                this.snackText = 'Окно открыто';
            },
            close() {
                console.log('Окно закрыто');
            },
            getColor(calories) {
                if (calories > 400) return 'red';
                if (calories > 200) return 'orange';
                return 'green'
            },
            editItem(item) {
                this.editedIndex = this.bodyTable.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.dialog = true;
            },

            deleteItem(item) {
                const index = this.bodyTable.indexOf(item);

                request.deleteProducts()
                    .then(response => {
                        this.bodyTable.splice(index, 1);
                        console.log(response);
                    })
                    .catch(error => {
                        console.log(error);
                        return error;
                    });
            },

            closeWindow() {
                this.dialog = false;
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                })
            },
            saveWindow() {
                if (this.editedIndex > -1) {
                    Object.assign(this.bodyTable[this.editedIndex], this.editedItem);
                } else {
                    this.bodyTable.unshift(this.editedItem);
                }

                this.closeWindow();
            },
            deleteAllSelectedItem() {
                if (this.selected.length === 0) return;

                this.selected.forEach(elem => {
                    this.bodyTable.splice(this.bodyTable.indexOf(elem), 1);
                });

                this.selected = [];
            },
            toggle() {
                this.$nextTick(() => {
                    if (this.likesAllFruit) {
                        this.headerTable = [];
                    } else {
                        this.headerTable = this.headerOptions.slice();
                    }
                })
            },
            modalDeleteItem(param) {
                this.show = false;
                this.deleteItem(param);
            },
            prepareToDelete(param) {
                this.show = true;
                this.itemToDelete = param;
            }
        },
        computed: {
            bodyTable() {
                return this.$store.getters.getProductsData;
            },
            formTitle() {
                return this.editedIndex === -1 ? 'Новый продукт' : 'Редактировать продукт';
            },
            likesAllFruit() {
                return this.headerTable.length === this.headerOptions.length;
            },
            likesSomeFruit() {
                return this.headerTable.length > 0 && !this.likesAllFruit;
            },
            icon() {
                if (this.likesAllFruit) return 'mdi-close-box';
                if (this.likesSomeFruit) return 'mdi-minus-box';
                return 'mdi-checkbox-blank-outline';
            },
            tableHeader() {
                return [...this.headerTable, {text: 'Действия', value: 'actions', sortable: false}];
            }
        },
        watch: {
            dialog(val) {
                val || this.closeWindow();
            },
        },
        created() {
            this.$store.dispatch('getAllProducts').then(() => {
                return this.bodyTable;
            });
        },
    }
</script>

<style lang="scss" scoped>
    .v-data-table__wrapper
    {
        .delete-all-selected
        {
            &:hover
            {
                background-color: transparent !important;
            }
        }
    }

    .w-100
    {
        width: 100%;
    }
</style>
