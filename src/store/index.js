import Vue from 'vue'
import Vuex from 'vuex';
import request from '../api/request.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        all: [],
        allExcelObj: {},
        doneObjProductsVal: false,
    },
    getters: {
        getProductsData: state => state.all,
        getAllExcelObj: state => state.allExcelObj,
        getDoneObjProducts: state => state.doneObjProductsVal,
    },
    mutations: {
        setProducts(state, products) {
            state.all = products;
        },
        doneObjProducts: (state, value) => {
            state.doneObjProductsVal = value;
        },
        addToExcelObjProducts: (state, value) => {
            state.allExcelObj['products'] = value;
        },
    },
    actions: {
        getAllProducts({commit}) {
            request.getProducts().then(products => {
                commit('setProducts', products);
            })
        },
        getObjUnloadProducts: ({commit, dispatch, state}, arrToUnloading) => {
            commit('addToExcelObjProducts', arrToUnloading);
            commit('doneObjProducts', true);
        },
    }
})