export const dummyUsers = [
    { id: 1, name: "Admin User", role: "Administrator" },
    { id: 2, name: "Vendor One", role: "Vendor" },
    { id: 3, name: "CSR User", role: "Customer Service Representative" },
];

export const dummyProducts = [
    { id: 1, name: "Product 1", category: "Electronics", status: "Active", stock: 50 },
    { id: 2, name: "Product 2", category: "Clothing", status: "Inactive", stock: 0 },
];

export const dummyOrders = [
    { id: 1, customer: "John Doe", status: "Processing", products: [1], vendorId: 2 },
    { id: 2, customer: "Jane Smith", status: "Delivered", products: [2], vendorId: 2 },
];

export const dummyVendors = [
    { id: 1, name: "Vendor One", ranking: 4.5, comments: ["Great service!"] },
];
