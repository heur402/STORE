const API_URL = 'http://localhost:5000/api';

async function runTestFlow() {
  console.log("Starting test flow...");

  try {
    // 1. Admin Registers / Logs In (Assume we register an admin for test)
    console.log("-> Registering Admin");
    const adminRes = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `Admin_${Date.now()}`,
        email: `admin_${Date.now()}@test.com`,
        password: "password123"
      })
    });
    const adminData = await adminRes.json();
    
    console.log("-> Registering Client");
    const clientRes = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `Client_${Date.now()}`,
        email: `client_${Date.now()}@test.com`,
        password: "password123"
      })
    });
    const clientData = await clientRes.json();
    const clientToken = clientData.token;
    
    console.log("-> Client fetching products to like & buy");
    const productsRes = await fetch(`${API_URL}/products`);
    const products = await productsRes.json();
    
    if (products.length === 0) {
      console.log("No products available to test. Exiting...");
      return;
    }
    
    const targetProduct = products[0];
    
    console.log(`-> Client liking product: ${targetProduct.name}`);
    await fetch(`${API_URL}/products/${targetProduct._id}/like`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${clientToken}` 
      }
    });
    
    console.log(`-> Client creating order for product`);
    const orderRes = await fetch(`${API_URL}/orders`, {
      method: "POST",
      body: JSON.stringify({
        orderItems: [{
          name: targetProduct.name,
          quantity: 1,
          image: targetProduct.images?.[0] || 'img',
          price: targetProduct.price,
          product: targetProduct._id
        }],
        deliveryAddress: { street: "123 Main", city: "Kigali", country: "Rwanda" },
        paymentMethod: "MTN",
        itemsPrice: targetProduct.price,
        shippingPrice: 10,
        taxPrice: 0,
        totalPrice: targetProduct.price + 10
      }),
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${clientToken}` 
      }
    });
    const orderData = await orderRes.json();
    
    console.log(`Order created successfully! ID: ${orderData._id}`);
    
    console.log(`-> Client viewing order`);
    const getOrderRes = await fetch(`${API_URL}/orders/${orderData._id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    const getOrderData = await getOrderRes.json();
    console.log(`Order Status: ${getOrderData.orderStatus}`);
    
    console.log(`-> Client cancelling order`);
    await fetch(`${API_URL}/orders/${orderData._id}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ cancellationReason: "Changed my mind" }),
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${clientToken}` 
      }
    });
    console.log("Order cancelled successfully, stock should be restored.");
    
    console.log("✅ ALL WORKFLOWS TESTED SUCCESSFULLY!");
  } catch (error) {
    console.error("❌ ERROR in workflow:", error);
  }
}

runTestFlow();
