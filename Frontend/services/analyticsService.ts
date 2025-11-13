import { StructuredResponse, ChartData, MapData, Kpi } from "../types";
import { customers, orders, orderItems, products, productCategoryNameTranslation, sellers } from './dataset';

// --- New Granular Lookup Functions ---

export const getOrderStatus = (orderId: string): StructuredResponse => {
    const order = orders.find(o => o.order_id === orderId);
    if (!order) {
        return {
            visualization: 'error',
            data: { message: `Order with ID "${orderId}" not found.` },
            summary: "I couldn't find an order with that ID. Please check the ID and try again."
        }
    }
    const data: Kpi[] = [
        { title: 'Order Status', value: order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1) },
        { title: 'Customer ID', value: order.customer_id },
        { title: 'Purchase Date', value: new Date(order.order_purchase_timestamp).toLocaleDateString() },
    ];
    if(order.order_delivered_customer_date) {
        data.push({ title: 'Delivered On', value: new Date(order.order_delivered_customer_date).toLocaleDateString() });
    }

    return {
        visualization: 'kpi',
        data,
        summary: `The status for order ${orderId} is **${order.order_status}**. It was purchased on ${new Date(order.order_purchase_timestamp).toLocaleDateString()}.`,
        followUpSuggestions: ["Who is the seller for this order?", "Where is this customer located?"]
    }
}

export const getSellerForOrder = (orderId: string): StructuredResponse => {
    const item = orderItems.find(i => i.order_id === orderId);
    if (!item) {
        return {
            visualization: 'error',
            data: { message: `Could not find items for order ID "${orderId}".`},
            summary: "I couldn't find any items associated with that order ID."
        }
    }
    const seller = sellers.find(s => s.seller_id === item.seller_id);
     if (!seller) {
        return {
            visualization: 'error',
            data: { message: `Could not find seller with ID "${item.seller_id}".`},
            summary: "I found the order item, but couldn't locate the seller's details."
        }
    }
    return {
        visualization: 'text',
        data: { insights: [`The seller for order ${orderId} is located in ${seller.seller_city}, ${seller.seller_state}.`] },
        summary: `The seller for this order is based in ${seller.seller_city}, ${seller.seller_state}.`,
        followUpSuggestions: ["Show me the seller distribution map.", "What was the product in this order?"]
    }
}

export const getCustomerLocation = (customerId: string): StructuredResponse => {
    const customer = customers.find(c => c.customer_id === customerId);
    if (!customer) {
        return {
            visualization: 'error',
            data: { message: `Customer with ID "${customerId}" not found.` },
            summary: "I couldn't find a customer with that ID."
        }
    }
    return {
        visualization: 'text',
        data: { insights: [`Customer ${customerId} is located in ${customer.customer_city}, ${customer.customer_state}.`] },
        summary: `This customer is from ${customer.customer_city}, ${customer.customer_state}.`,
        followUpSuggestions: ["Show all orders from this state.", "What is the most common customer city?"]
    }
}

export const getSellerDetails = (sellerId: string): StructuredResponse => {
    const seller = sellers.find(s => s.seller_id === sellerId);
    if (!seller) {
        return {
            visualization: 'error',
            data: { message: `Seller with ID "${sellerId}" not found.` },
            summary: "I couldn't find a seller with that ID."
        }
    }

    const itemsSold = orderItems.filter(i => i.seller_id === sellerId);

    const data: Kpi[] = [
        { title: 'Seller Location', value: `${seller.seller_city}, ${seller.seller_state}` },
        { title: 'Items in Dataset', value: itemsSold.length.toString() },
    ];

    return {
        visualization: 'kpi',
        data,
        summary: `Seller ${sellerId} is located in ${seller.seller_city}, ${seller.seller_state} and has ${itemsSold.length} item(s) listed in this sample dataset.`,
        followUpSuggestions: ["Show me the seller distribution map."]
    }
}

// FIX: New function to calculate revenue for a specific category
const findCategoryByQuery = (query: string): { displayName: string; internalName: string } | null => {
    const lowerQuery = query.toLowerCase().replace(/[\s\/]+/g, ''); 
    for (const internalName in productCategoryNameTranslation) {
        const displayName = productCategoryNameTranslation[internalName];
        const normalizedDisplayName = displayName.toLowerCase().replace(/[\s\/]+/g, '');
        if (normalizedDisplayName.includes(lowerQuery) || lowerQuery.includes(normalizedDisplayName)) {
            return { displayName, internalName };
        }
    }
    return null;
}

export const getRevenueForCategory = (categoryQuery: string): StructuredResponse => {
    const categoryMatch = findCategoryByQuery(categoryQuery);

    if (!categoryMatch) {
        return {
            visualization: 'error',
            data: { message: `Product category matching "${categoryQuery}" not found.` },
            summary: `I couldn't find a category matching "${categoryQuery}". Please check the name and try again.`
        };
    }
    const { displayName, internalName } = categoryMatch;

    const productIdsInCategory = products
        .filter(p => p.product_category_name === internalName)
        .map(p => p.product_id);

    if (productIdsInCategory.length === 0) {
         return {
            visualization: 'text',
            data: { insights: [`No products found for the category "${displayName}".`] },
            summary: `There are no products listed in the "${displayName}" category in this dataset.`
        };
    }
    
    const totalRevenue = orderItems
        .filter(item => productIdsInCategory.includes(item.product_id))
        .reduce((sum, item) => sum + item.price, 0);

    const kpiData: Kpi[] = [{
        title: `Revenue (${displayName})`,
        value: `R$${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }];
    
    return {
        visualization: 'kpi',
        data: kpiData,
        summary: `The total revenue for the '${displayName}' category is ${kpiData[0].value}.`,
        followUpSuggestions: [
            "How does this compare to other categories?",
            `Show top sellers for ${displayName}.`
        ]
    };
}


// --- New Aggregate Analytics Functions ---

export const getSellerDistribution = (): StructuredResponse => {
    const sellerCountsByState: { [key: string]: number } = sellers.reduce((acc, seller) => {
        acc[seller.seller_state] = (acc[seller.seller_state] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    return {
        visualization: 'map',
        data: {
            title: "Seller Distribution by State",
            highlightedStates: sellerCountsByState,
        },
        summary: "This map shows the concentration of sellers across Brazil. As with customers, the majority of sellers are located in São Paulo (SP), indicating it is the central hub for the e-commerce marketplace.",
        followUpSuggestions: ["Which state has the most customers?", "What are the top categories sold by sellers in SP?"]
    }
}

// --- Existing Analytics Functions (for reference) ---

export const getCustomerDistribution = (): StructuredResponse => {
     const customerCountsByState: { [key: string]: number } = customers.reduce((acc, customer) => {
        acc[customer.customer_state] = (acc[customer.customer_state] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });
     return {
        visualization: 'map',
        data: {
            title: "Customer Distribution by State",
            highlightedStates: customerCountsByState,
        },
        summary: "São Paulo (SP) has the highest concentration of customers, followed by states in the Southeast region. This highlights the key markets for the e-commerce business.",
    }
}

export const getTopCategories = (count: number = 10): StructuredResponse => {
    // 1. Count product sales from orderItems
    const productCounts: { [productId: string]: number } = orderItems.reduce((acc, item) => {
        acc[item.product_id] = (acc[item.product_id] || 0) + 1;
        return acc;
    }, {} as { [productId: string]: number });

    // 2. Map product IDs to category names and aggregate counts
    const categoryCounts: { [category: string]: number } = {};
    for (const productId in productCounts) {
        const product = products.find(p => p.product_id === productId);
        if (product && product.product_category_name) {
            const categoryName = product.product_category_name;
            const translatedName = productCategoryNameTranslation[categoryName] || categoryName;
            categoryCounts[translatedName] = (categoryCounts[translatedName] || 0) + productCounts[productId];
        }
    }

    // 3. Sort categories by count
    const sortedCategories = Object.entries(categoryCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    // 4. Take the top N
    const topN = sortedCategories.slice(0, count);

    // 5. Format for chart
    const chartData: ChartData = {
        type: 'bar',
        title: `Top ${count} Product Categories by Sales Volume`,
        labels: topN.map(c => c.name),
        values: topN.map(c => c.count)
    };

    return {
        visualization: 'chart',
        data: chartData,
        summary: `The chart displays the top ${count} product categories by sales. '${topN[0].name}' is the most popular category, indicating a high demand for home and personal care products.`,
        followUpSuggestions: [`Show revenue for ${topN[0].name}`, "What are the least popular categories?"]
    };
}

export const getAOV = (): StructuredResponse => {
    return {
        visualization: 'kpi',
        data: [
            { title: "Average Order Value (AOV)", value: "R$134.80" },
            { title: "Total Orders", value: "5" },
        ],
        summary: "The Average Order Value (AOV) across all transactions is R$134.80. This metric is crucial for understanding customer purchasing behavior.",
    }
}

export const getRevenueTrend = (): StructuredResponse => {
    return {
        visualization: 'chart',
        data: {
            type: 'line',
            title: "Monthly Revenue Trend (R$)",
            labels: ["Oct '17", "Nov '17", "Feb '18", "Jul '18", "Aug '18"],
            values: [38.71, 49.90, 79.99, 118.70, 129.90],
        },
        summary: "Revenue shows a positive trend over the observed months, indicating growth in sales performance.",
    }
}

export const getRevenueForecast = (): StructuredResponse => {
    const trend = getRevenueTrend().data as ChartData;
    return {
         visualization: 'chart',
        data: {
            ...trend,
            title: "Revenue Forecast for Next 3 Months (R$)",
            labels: [...trend.labels, "Sep '18", "Oct '18", "Nov '18"],
            forecastValues: [145, 140, 155] // Simplified linear forecast
        },
        summary: "Based on current trends, revenue is projected to continue its upward trajectory over the next quarter.",
    }
}
