import { StructuredResponse, Message } from "../types";
import { runQuery as runGeminiQuery } from './geminiService';
// FIX: Added getRevenueForCategory import
import {
    getOrderStatus,
    getSellerForOrder,
    getCustomerLocation,
    getSellerDistribution,
    getTopCategories,
    getAOV,
    getRevenueTrend as getRevenueTrendFromAnalytics,
    getRevenueForecast,
    getSellerDetails,
    getRevenueForCategory 
} from './analyticsService';

// Simulates a network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Query Routing Logic ---
// This function acts as a controller, parsing the user's intent and routing to the correct analytics function.
export const runQuery = async (
    message: string,
    history: Message[] 
): Promise<StructuredResponse> => {
    await sleep(500); // Simulate backend processing time
    const query = message.toLowerCase().trim();

    // Order Status Intent
    const orderStatusMatch = query.match(/status for order (.+)/);
    if (orderStatusMatch) {
        return getOrderStatus(orderStatusMatch[1].trim());
    }
    if (query.includes('order status')) {
        return {
            visualization: 'text',
            data: { insights: ["I can help with that."] },
            summary: "Please provide the Order ID you'd like me to check.",
            awaitingInput: 'order_id_for_status'
        };
    }

    // Seller Info for an Order Intent
    const sellerMatch = query.match(/seller for order (.+)/);
    if (sellerMatch) {
        return getSellerForOrder(sellerMatch[1].trim());
    }
    if (query.includes('who is selling') || query.includes('seller for my product')) {
        return {
            visualization: 'text',
            data: { insights: ["I can look up the seller for an order."] },
            summary: "Please provide the Order ID.",
            awaitingInput: 'order_id_for_seller'
        };
    }

    // Direct Seller Details Intent
    const sellerDetailsMatch = query.match(/(?:seller info|seller details) (.+)/);
    if (sellerDetailsMatch) {
        return getSellerDetails(sellerDetailsMatch[1].trim());
    }
    if (query.includes('seller details') || query.includes('seller info') || query.includes('get seller info')) {
        return {
            visualization: 'text',
            data: { insights: ["I can look up a seller's details."] },
            summary: "Please provide the Seller ID.",
            awaitingInput: 'seller_id_for_details'
        };
    }

    // Customer Location Intent
    const customerLocationMatch = query.match(/location for customer (.+)/);
    if (customerLocationMatch) {
        return getCustomerLocation(customerLocationMatch[1].trim());
    }
    if (query.includes("customer's city and state") || query.includes("customer location")) {
         return {
            visualization: 'text',
            data: { insights: ["I can find a customer's location."] },
            summary: "Please provide the Customer ID.",
            awaitingInput: 'customer_id_for_location'
        };
    }

    // --- Pre-defined Analytics Queries ---
    
    const revenueForCategoryMatch = query.match(/(?:revenue for|revenue of|show revenue for)\s(.+)/);
    if (revenueForCategoryMatch) {
        const categoryQuery = revenueForCategoryMatch[1].trim();
        return getRevenueForCategory(categoryQuery);
    }
    
    // FIX: More robust regex to handle various "top categories" queries.
    const topCategoriesMatch = query.match(/top (\d+)\s*(product )?categories/);
    if (topCategoriesMatch) {
        const count = parseInt(topCategoriesMatch[1], 10);
        return getTopCategories(count);
    }
    if (/(top|what are the top)\s*(product )?categories/.test(query)) {
        return getTopCategories(); // Default to 10
    }


    if (query.includes("state has the most orders")) {
        return getGeoOverview();
    }
    if (query.includes("most sellers") || query.includes("seller distribution")) {
        return getSellerDistribution();
    }
    if (query.includes("monthly revenue")) {
        return getRevenueTrendFromAnalytics();
    }
    if (query.includes("forecast revenue")) {
        return getRevenueForecast();
    }
    if (query.includes("aov")) {
        return getAOV();
    }

    // If no specific analytical query is matched, fall back to the live Gemini API for a text-based answer
    console.log("No specific intent found, falling back to Gemini API for:", query);
    return await runGeminiQuery(message, history);
};


// --- Functions to get data for dedicated views ---

export const getGeoOverview = async (): Promise<StructuredResponse> => {
    await sleep(500);
    // This now gets order distribution, not customer distribution, to match the dataset's primary measure.
    return (await import('./analyticsService')).getCustomerDistribution();
}

export const getRevenueTrend = async (): Promise<StructuredResponse> => {
    await sleep(500);
    return (await import('./analyticsService')).getRevenueTrend();
}