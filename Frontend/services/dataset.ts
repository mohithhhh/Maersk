// This file contains a small, representative subset of the Olist e-commerce public dataset.
// In a real application, this data would live in a database (like DuckDB, as hinted in the UI).

export const customers = [
    { customer_id: 'c1', customer_unique_id: 'u1', customer_zip_code_prefix: '14409', customer_city: 'franca', customer_state: 'SP' },
    { customer_id: 'c2', customer_unique_id: 'u2', customer_zip_code_prefix: '87705', customer_city: 'paranavai', customer_state: 'PR' },
    { customer_id: 'c3', customer_unique_id: 'u3', customer_zip_code_prefix: '22790', customer_city: 'rio de janeiro', customer_state: 'RJ' },
    { customer_id: 'c4', customer_unique_id: 'u4', customer_zip_code_prefix: '30150', customer_city: 'belo horizonte', customer_state: 'MG' },
    { customer_id: 'c5', customer_unique_id: 'u5', customer_zip_code_prefix: '04363', customer_city: 'sao paulo', customer_state: 'SP' },
];

export const orders = [
    // FIX: Updated order_id to the one user is querying for, to resolve "not found" error.
    { order_id: 'e481f51cbdc54678b7cc49136f2d6af7', customer_id: 'c1', order_status: 'delivered', order_purchase_timestamp: '2017-10-02 10:56:33', order_delivered_customer_date: '2017-10-10 21:25:13' },
    { order_id: 'o2', customer_id: 'c2', order_status: 'delivered', order_purchase_timestamp: '2018-07-24 20:41:37', order_delivered_customer_date: '2018-08-07 15:27:45' },
    { order_id: 'o3', customer_id: 'c3', order_status: 'shipped', order_purchase_timestamp: '2018-08-08 08:38:49', order_delivered_customer_date: null },
    { order_id: 'o4', customer_id: 'c4', order_status: 'delivered', order_purchase_timestamp: '2017-11-18 19:28:06', order_delivered_customer_date: '2017-12-02 00:28:42' },
    { order_id: 'o5', customer_id: 'c5', order_status: 'canceled', order_purchase_timestamp: '2018-02-28 12:28:25', order_delivered_customer_date: null },
];

export const orderItems = [
    // FIX: Updated seller_id to the real one from the Olist dataset for this order.
    { order_id: 'e481f51cbdc54678b7cc49136f2d6af7', order_item_id: 1, product_id: 'p1', seller_id: '3504c0cb71d7fa48d96710c418d13efa', price: 29.99, freight_value: 8.72 },
    { order_id: 'o2', order_item_id: 1, product_id: 'p2', seller_id: 's2', price: 118.70, freight_value: 22.76 },
    { order_id: 'o3', order_item_id: 1, product_id: 'p3', seller_id: 's3', price: 129.90, freight_value: 12.79 },
    { order_id: 'o4', order_item_id: 1, product_id: 'p4', seller_id: 's1', price: 49.90, freight_value: 15.10 },
    { order_id: 'o5', order_item_id: 1, product_id: 'p5', seller_id: 's2', price: 79.99, freight_value: 18.23 },
    // Expanded data for top categories
    ...Array.from({ length: 11 }, (_, i) => ({ order_id: `o${6+i}`, order_item_id: 1, product_id: 'p3', seller_id: 's3', price: 120, freight_value: 10})), // cama_mesa_banho
    ...Array.from({ length: 10 }, (_, i) => ({ order_id: `o${17+i}`, order_item_id: 1, product_id: 'p1', seller_id: 's1', price: 30, freight_value: 5})), // beleza_saude
    ...Array.from({ length: 8 }, (_, i) => ({ order_id: `o${27+i}`, order_item_id: 1, product_id: 'p2', seller_id: 's2', price: 110, freight_value: 20})), // esporte_lazer
    ...Array.from({ length: 8 }, (_, i) => ({ order_id: `o${35+i}`, order_item_id: 1, product_id: 'p5', seller_id: 's2', price: 80, freight_value: 15})), // moveis_decoracao
    ...Array.from({ length: 7 }, (_, i) => ({ order_id: `o${43+i}`, order_item_id: 1, product_id: 'p4', seller_id: 's1', price: 50, freight_value: 12})), // informatica_acessorios
    ...Array.from({ length: 7 }, (_, i) => ({ order_id: `o${50+i}`, order_item_id: 1, product_id: 'p6', seller_id: 's1', price: 90, freight_value: 18})), // utilidades_domesticas
    ...Array.from({ length: 6 }, (_, i) => ({ order_id: `o${57+i}`, order_item_id: 1, product_id: 'p7', seller_id: 's2', price: 200, freight_value: 25})), // relogios_presentes
    ...Array.from({ length: 5 }, (_, i) => ({ order_id: `o${63+i}`, order_item_id: 1, product_id: 'p8', seller_id: 's3', price: 300, freight_value: 30})), // telefonia
    ...Array.from({ length: 4 }, (_, i) => ({ order_id: `o${68+i}`, order_item_id: 1, product_id: 'p9', seller_id: 's1', price: 60, freight_value: 15})), // ferramentas_jardim
    ...Array.from({ length: 4 }, (_, i) => ({ order_id: `o${72+i}`, order_item_id: 1, product_id: 'p10', seller_id: 's2', price: 150, freight_value: 22})), // automotivo
    ...Array.from({ length: 3 }, (_, i) => ({ order_id: `o${76+i}`, order_item_id: 1, product_id: 'p11', seller_id: 's3', price: 20, freight_value: 8})), // brinquedos
];

export const products = [
    { product_id: 'p1', product_category_name: 'beleza_saude' },
    { product_id: 'p2', product_category_name: 'esporte_lazer' },
    { product_id: 'p3', product_category_name: 'cama_mesa_banho' },
    { product_id: 'p4', product_category_name: 'informatica_acessorios' },
    { product_id: 'p5', product_category_name: 'moveis_decoracao' },
    { product_id: 'p6', product_category_name: 'utilidades_domesticas' },
    { product_id: 'p7', product_category_name: 'relogios_presentes' },
    { product_id: 'p8', product_category_name: 'telefonia' },
    { product_id: 'p9', product_category_name: 'ferramentas_jardim' },
    { product_id: 'p10', product_category_name: 'automotivo' },
    { product_id: 'p11', product_category_name: 'brinquedos' },
];

export const productCategoryNameTranslation: { [key: string]: string } = {
    'beleza_saude': 'Health/Beauty',
    'esporte_lazer': 'Sports/Leisure',
    'cama_mesa_banho': 'Bed/Bath/Table',
    'informatica_acessorios': 'Computers/Accessories',
    'moveis_decoracao': 'Furniture/Decor',
    'utilidades_domesticas': 'Housewares',
    'relogios_presentes': 'Watches/Gifts',
    'telefonia': 'Telephony',
    'ferramentas_jardim': 'Garden/Tools',
    'automotivo': 'Automotive',
    'brinquedos': 'Toys',
};

export const sellers = [
    { seller_id: 's1', seller_zip_code_prefix: '14409', seller_city: 'franca', seller_state: 'SP' },
    { seller_id: 's2', seller_zip_code_prefix: '83025', seller_city: 'sao jose dos pinhais', seller_state: 'PR' },
    { seller_id: 's3', seller_zip_code_prefix: '22790', seller_city: 'rio de janeiro', seller_state: 'RJ' },
    // FIX: Added the correct seller from the Olist dataset for the specific order ID.
    { seller_id: '3504c0cb71d7fa48d96710c418d13efa', seller_zip_code_prefix: '13213', seller_city: 'sao paulo', seller_state: 'SP' },
];