const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const TAX_RATE = 0.1;
const DELIVERY_FEE = 0;
const OWNER_NUMBER = normalizePhone(
    process.env.WHATSAPP_OWNER_NUMBER || "+91 91056 24475"
);

const MENU_CATALOG = {
    samosa: { name: "Crispy Veg Samosa", price: 6.99 },
    "tandoori-chicken": { name: "Smoked Tandoori Chicken", price: 13.99 },
    "paneer-tikka": { name: "Paneer Tikka Shaslik", price: 11.99 },
    "butter-chicken": { name: "Royal Butter Chicken", price: 17.99 },
    "chicken-biryani": { name: "Hyderabadi Dum Biryani", price: 18.99 },
    "paneer-makhani": { name: "Shahi Paneer Makhani", price: 15.99 },
    "dal-makhani": { name: "Slow-Cooked Dal Makhani", price: 13.99 },
    "garlic-naan": { name: "Tandoori Garlic Naan", price: 3.99 },
    "butter-naan": { name: "Tandoori Butter Naan", price: 3.49 },
    "gulab-jamun": { name: "Warm Gulab Jamun", price: 5.99 },
    rasmalai: { name: "Saffron Rasmalai", price: 6.99 },
    "mango-lassi": { name: "Royal Mango Lassi", price: 4.99 },
    "masala-chai": { name: "Artisanal Masala Chai", price: 3.49 }
};

const allowedOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Origin is not allowed by CORS."));
        }
    })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        service: "spice-and-charcoal-api",
        whatsappConfigured: isWhatsAppConfigured(),
        ownerNumber: maskPhone(OWNER_NUMBER)
    });
});

app.post("/api/orders", async (req, res) => {
    try {
        const order = buildOrder(req.body || {});

        let ownerNotification = {
            attempted: false,
            delivered: false
        };
        let customerNotification = {
            attempted: false,
            delivered: false
        };

        if (isWhatsAppConfigured()) {
            const ownerMessage = buildOwnerMessage(order);
            const customerMessage = buildCustomerMessage(order);

            ownerNotification = await sendWhatsAppText(OWNER_NUMBER, ownerMessage);
            customerNotification = await sendWhatsAppText(order.customer.phone, customerMessage);
        }

        res.status(201).json({
            ok: true,
            orderId: order.orderId,
            createdAt: order.createdAt,
            invoice: {
                ...order.totals,
                items: order.items
            },
            notifications: {
                owner: ownerNotification,
                customer: customerNotification
            }
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            ok: false,
            error: error.message || "Unable to create the order."
        });
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Spice & Charcoal server running on http://localhost:${PORT}`);
});

function buildOrder(payload) {
    const customer = {
        name: sanitizeText(payload.customer?.name),
        phone: normalizePhone(payload.customer?.phone),
        email: sanitizeText(payload.customer?.email),
        address: sanitizeText(payload.customer?.address)
    };

    if (!customer.name || !customer.phone || !customer.email || !customer.address) {
        throw createHttpError(400, "Please provide complete customer details.");
    }

    const rawItems = Array.isArray(payload.items) ? payload.items : [];
    if (rawItems.length === 0) {
        throw createHttpError(400, "Your cart is empty.");
    }

    const items = rawItems.map((item) => {
        const menuItem = MENU_CATALOG[item.id];
        const quantity = Number(item.quantity);

        if (!menuItem) {
            throw createHttpError(400, `Unknown menu item: ${item.id}`);
        }

        if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 25) {
            throw createHttpError(400, `Invalid quantity for ${menuItem.name}.`);
        }

        return {
            id: item.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity,
            lineTotal: roundCurrency(menuItem.price * quantity)
        };
    });

    const subtotal = roundCurrency(
        items.reduce((sum, item) => sum + item.lineTotal, 0)
    );
    const tax = roundCurrency(subtotal * TAX_RATE);
    const total = roundCurrency(subtotal + tax + DELIVERY_FEE);

    return {
        orderId: `SAC-${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toISOString(),
        paymentMethod: normalizePaymentMethod(payload.paymentMethod),
        customer,
        items,
        totals: {
            subtotal,
            tax,
            deliveryFee: DELIVERY_FEE,
            total
        }
    };
}

function normalizePaymentMethod(value) {
    if (value === "upi" || value === "cod" || value === "card") {
        return value;
    }

    return "card";
}

async function sendWhatsAppText(to, body) {
    const recipient = normalizePhone(to);

    if (!recipient) {
        return {
            attempted: false,
            delivered: false,
            reason: "Recipient phone number is missing."
        };
    }

    try {
        const response = await fetch(
            `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION || "v22.0"}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: recipient,
                    type: "text",
                    text: {
                        preview_url: false,
                        body
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                attempted: true,
                delivered: false,
                reason: data?.error?.message || "WhatsApp API request failed."
            };
        }

        return {
            attempted: true,
            delivered: true,
            messageId: data?.messages?.[0]?.id || null
        };
    } catch (error) {
        return {
            attempted: true,
            delivered: false,
            reason: error.message
        };
    }
}

function buildOwnerMessage(order) {
    const itemLines = order.items
        .map(item => `• ${item.quantity}x ${item.name} - $${item.lineTotal.toFixed(2)}`)
        .join("\n");

    return [
        "🛎️ New Spice & Charcoal order",
        `Order ID: ${order.orderId}`,
        `Customer: ${order.customer.name}`,
        `Phone: +${order.customer.phone}`,
        `Email: ${order.customer.email}`,
        `Address: ${order.customer.address}`,
        `Payment: ${formatPaymentMethod(order.paymentMethod)}`,
        "",
        "Items:",
        itemLines,
        "",
        `Subtotal: $${order.totals.subtotal.toFixed(2)}`,
        `Tax: $${order.totals.tax.toFixed(2)}`,
        `Total: $${order.totals.total.toFixed(2)}`
    ].join("\n");
}

function buildCustomerMessage(order) {
    const itemLines = order.items
        .map(item => `• ${item.quantity}x ${item.name} - $${item.lineTotal.toFixed(2)}`)
        .join("\n");

    return [
        "🍽️ Your Spice & Charcoal order is confirmed",
        `Order ID: ${order.orderId}`,
        `Hello ${order.customer.name}, thanks for ordering with us.`,
        "",
        "Invoice:",
        itemLines,
        "",
        `Subtotal: $${order.totals.subtotal.toFixed(2)}`,
        `Tax: $${order.totals.tax.toFixed(2)}`,
        `Delivery: ${order.totals.deliveryFee === 0 ? "FREE" : `$${order.totals.deliveryFee.toFixed(2)}`}`,
        `Total Paid: $${order.totals.total.toFixed(2)}`,
        "",
        `Delivery address: ${order.customer.address}`,
        "We are preparing your order now."
    ].join("\n");
}

function isWhatsAppConfigured() {
    return Boolean(
        process.env.WHATSAPP_ACCESS_TOKEN &&
        process.env.WHATSAPP_PHONE_NUMBER_ID &&
        OWNER_NUMBER
    );
}

function normalizePhone(value) {
    const digits = String(value || "").replace(/\D/g, "");
    return digits || "";
}

function sanitizeText(value) {
    return String(value || "").trim().replace(/\s+/g, " ");
}

function roundCurrency(value) {
    return Number(value.toFixed(2));
}

function createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function formatPaymentMethod(method) {
    if (method === "upi") return "UPI";
    if (method === "cod") return "Cash on Delivery";
    return "Card";
}

function maskPhone(value) {
    if (!value) return "";
    if (value.length <= 4) return value;
    return `${"*".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
}
