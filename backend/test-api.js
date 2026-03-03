// test-api.js - Test script to verify backend API
// Run with: node test-api.js

const BASE_URL = "http://localhost:5000/api";

let authToken = "";

const testAPI = async () => {
  console.log("🧪 Starting API Tests...\n");

  try {
    // Test 1: Server is running
    console.log("Test 1: Check if server is running...");
    const serverCheck = await fetch("http://localhost:5000/");
    if (serverCheck.ok) {
      console.log("✅ Server is running\n");
    } else {
      console.log("❌ Server is not responding\n");
      return;
    }

    // Test 2: Register a new user
    console.log("Test 2: Register a new user...");
    const registerRes = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "password123",
        phone: "+1234567890",
      }),
    });
    const registerData = await registerRes.json();
    if (registerRes.ok) {
      authToken = registerData.token;
      console.log("✅ User registered successfully");
      console.log(`   User: ${registerData.name}, Role: ${registerData.role}\n`);
    } else {
      console.log(`❌ Registration failed: ${registerData.message}\n`);
    }

    // Test 3: Login
    console.log("Test 3: Login with credentials...");
    const loginRes = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: registerData.email,
        password: "password123",
      }),
    });
    const loginData = await loginRes.json();
    if (loginRes.ok) {
      authToken = loginData.token;
      console.log("✅ Login successful");
      console.log(`   User: ${loginData.name}, Role: ${loginData.role}\n`);
    } else {
      console.log(`❌ Login failed: ${loginData.message}\n`);
    }

    // Test 4: Get Products (public)
    console.log("Test 4: Get all products...");
    const productsRes = await fetch(`${BASE_URL}/products`);
    const productsData = await productsRes.json();
    if (productsRes.ok) {
      console.log(`✅ Products fetched: ${productsData.products?.length || 0} products`);
      if (productsData.categories) {
        console.log(`   Categories: ${productsData.categories.join(", ")}`);
      }
      console.log("");
    } else {
      console.log(`❌ Failed to fetch products: ${productsData.message}\n`);
    }

    // Test 5: Create Product (admin only)
    console.log("Test 5: Create a product (as admin)...");
    const createProductRes = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: "Test Product",
        description: "This is a test product",
        category: "test",
        price: 99.99,
        stock: 100,
        status: "Active",
      }),
    });
    const productData = await createProductRes.json();
    if (createProductRes.ok || createProductRes.status === 403) {
      if (createProductRes.status === 403) {
        console.log("⚠️  Product creation requires admin role");
        console.log("   (This is expected for client users)\n");
      } else {
        console.log(`✅ Product created: ${productData.name}\n`);
      }
    } else {
      console.log(`❌ Failed: ${productData.message}\n`);
    }

    // Test 6: Get User Profile (protected)
    console.log("Test 6: Get user profile...");
    const profileRes = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const profileData = await profileRes.json();
    if (profileRes.ok) {
      console.log(`✅ Profile fetched: ${profileData.name} (${profileData.email})`);
      console.log(`   Role: ${profileData.role}\n`);
    } else {
      console.log(`❌ Failed: ${profileData.message}\n`);
    }

    // Test 7: Get Orders (protected)
    console.log("Test 7: Get user orders...");
    const ordersRes = await fetch(`${BASE_URL}/orders/myorders`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const ordersData = await ordersRes.json();
    if (ordersRes.ok) {
      console.log(`✅ Orders fetched: ${ordersData.length} orders\n`);
    } else {
      console.log(`❌ Failed: ${ordersData.message}\n`);
    }

    // Test 8: Product filters
    console.log("Test 8: Test product filters...");
    const filteredRes = await fetch(
      `${BASE_URL}/products?category=gas&sortBy=price-asc&minPrice=0&maxPrice=100`
    );
    const filteredData = await filteredRes.json();
    if (filteredRes.ok) {
      console.log(
        `✅ Filtered products: ${filteredData.products?.length || 0} products`
      );
      console.log(`   Total available: ${filteredData.total || "N/A"}\n`);
    } else {
      console.log(`❌ Failed: ${filteredData.message}\n`);
    }

    console.log("🎉 All tests completed!");
    console.log("\n📝 Next Steps:");
    console.log("1. Start your frontend applications");
    console.log("2. Login with the test user or create a new account");
    console.log("3. The backend is ready to accept requests!");
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    console.log("\nMake sure the backend server is running: npm run dev");
  }
};

// Run tests
testAPI();
