import products from './products.json';

export default {
    getProducts: () => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(products);
        }, 500);
    }),
    deleteProducts: () => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({message: 'deleted'});
        }, 0);
    }),
}
