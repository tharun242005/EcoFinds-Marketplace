import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Helper function to create demo products for new demo users
const createDemoProducts = async (userId: string) => {
  try {
    const demoProducts = [
      {
        id: crypto.randomUUID(),
        title: "Vintage Leather Jacket",
        description: "Classic brown leather jacket in excellent condition. Perfect for sustainable fashion lovers.",
        category: "Fashion",
        price: 89.99,
        seller_id: "demo-seller",
        created_at: new Date().toISOString(),
        image_placeholder: "🧥",
        image_url: "https://images.unsplash.com/photo-1744743128385-990e02da095f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbGVhdGhlciUyMGphY2tldHxlbnwxfHx8fDE3NTcxMjk1NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      },
      {
        id: crypto.randomUUID(),
        title: "MacBook Air (Pre-owned)",
        description: "2020 MacBook Air in great condition. Battery still holds excellent charge. Perfect for students or professionals.",
        category: "Electronics",
        price: 699.00,
        seller_id: "demo-seller",
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        image_placeholder: "💻",
        image_url: "https://images.unsplash.com/photo-1754928864131-21917af96dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NTcwNjMwNDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      },
      {
        id: crypto.randomUUID(),
        title: "Ceramic Planter Set",
        description: "Beautiful set of 3 ceramic planters with drainage holes. Perfect for your favorite succulents or herbs.",
        category: "Home & Garden",
        price: 34.50,
        seller_id: "demo-seller",
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        image_placeholder: "🪴",
        image_url: "https://images.unsplash.com/photo-1611527664755-031c7d3225ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZXBsYW50JTIwc3VjY3VsZW50fGVufDF8fHx8MTc1NzEyOTU2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      }
    ];

    for (const product of demoProducts) {
      await kv.set(`product:${product.id}`, product);
    }
    
    console.log(`Created ${demoProducts.length} demo products for user ${userId}`);
  } catch (error) {
    console.log(`Error creating demo products: ${error}`);
  }
};

// Initialize storage bucket
const initializeStorage = async () => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const bucketName = 'make-213a9f17-images';
    
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (error) {
        console.log(`Storage bucket creation error: ${error.message}`);
      } else {
        console.log(`Storage bucket ${bucketName} created successfully`);
      }
    }
  } catch (error) {
    console.log(`Storage initialization error: ${error}`);
  }
};

// Initialize storage on startup
initializeStorage();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-213a9f17/health", (c) => {
  return c.json({ status: "ok" });
});

// Upload image endpoint
app.post("/make-server-213a9f17/upload-image", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" }, 400);
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      return c.json({ error: "File too large. Maximum size is 5MB" }, 400);
    }

    const bucketName = 'make-213a9f17-images';
    const fileName = `${user.id}/${crypto.randomUUID()}.${file.name.split('.').pop()}`;
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, await file.arrayBuffer(), {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.log(`Image upload error: ${uploadError.message}`);
      return c.json({ error: "Failed to upload image" }, 500);
    }

    // Create signed URL for the uploaded image
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year expiry

    if (signedUrlError) {
      console.log(`Signed URL creation error: ${signedUrlError.message}`);
      return c.json({ error: "Failed to create image URL" }, 500);
    }

    return c.json({ 
      imageUrl: signedUrlData.signedUrl,
      imagePath: fileName
    });
  } catch (error) {
    console.log(`Image upload server error: ${error}`);
    return c.json({ error: "Internal server error during image upload" }, 500);
  }
});

// User signup
app.post("/make-server-213a9f17/signup", async (c) => {
  try {
    const { email, password, username } = await c.req.json();
    
    if (!email || !password || !username) {
      return c.json({ error: "Email, password, and username are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      username,
      created_at: new Date().toISOString()
    });

    // If this is a demo user, create some sample products
    if (username.includes('demo_user_')) {
      await createDemoProducts(data.user.id);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup server error: ${error}`);
    return c.json({ error: "Internal server error during signup" }, 500);
  }
});

// Get user profile
app.get("/make-server-213a9f17/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.log(`Profile fetch error: ${error}`);
    return c.json({ error: "Internal server error fetching profile" }, 500);
  }
});

// Update user profile
app.put("/make-server-213a9f17/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { username } = await c.req.json();
    if (!username) {
      return c.json({ error: "Username is required" }, 400);
    }

    const existingProfile = await kv.get(`user:${user.id}`);
    if (!existingProfile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    const updatedProfile = { ...existingProfile, username };
    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log(`Profile update error: ${error}`);
    return c.json({ error: "Internal server error updating profile" }, 500);
  }
});

// Create product listing
app.post("/make-server-213a9f17/products", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { title, description, category, price, imageUrl, imagePath } = await c.req.json();
    
    if (!title || !description || !category || !price) {
      return c.json({ error: "All product fields are required" }, 400);
    }

    const productId = crypto.randomUUID();
    const product = {
      id: productId,
      title,
      description,
      category,
      price: parseFloat(price),
      seller_id: user.id,
      created_at: new Date().toISOString(),
      image_placeholder: "📦",
      image_url: imageUrl || null,
      image_path: imagePath || null
    };

    await kv.set(`product:${productId}`, product);

    return c.json({ product });
  } catch (error) {
    console.log(`Product creation error: ${error}`);
    return c.json({ error: "Internal server error creating product" }, 500);
  }
});

// Get all products with optional filtering
app.get("/make-server-213a9f17/products", async (c) => {
  try {
    const category = c.req.query('category');
    const search = c.req.query('search');
    
    const products = await kv.getByPrefix('product:');
    let filteredProducts = products;

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by created_at descending
    filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return c.json({ products: filteredProducts });
  } catch (error) {
    console.log(`Products fetch error: ${error}`);
    return c.json({ error: "Internal server error fetching products" }, 500);
  }
});

// Get user's own products
app.get("/make-server-213a9f17/my-products", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const allProducts = await kv.getByPrefix('product:');
    const myProducts = allProducts.filter(p => p.seller_id === user.id);
    
    // Sort by created_at descending
    myProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return c.json({ products: myProducts });
  } catch (error) {
    console.log(`My products fetch error: ${error}`);
    return c.json({ error: "Internal server error fetching my products" }, 500);
  }
});

// Get single product
app.get("/make-server-213a9f17/products/:id", async (c) => {
  try {
    const productId = c.req.param('id');
    const product = await kv.get(`product:${productId}`);
    
    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    return c.json({ product });
  } catch (error) {
    console.log(`Product fetch error: ${error}`);
    return c.json({ error: "Internal server error fetching product" }, 500);
  }
});

// Update product
app.put("/make-server-213a9f17/products/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const productId = c.req.param('id');
    const existingProduct = await kv.get(`product:${productId}`);
    
    if (!existingProduct) {
      return c.json({ error: "Product not found" }, 404);
    }

    if (existingProduct.seller_id !== user.id) {
      return c.json({ error: "Not authorized to edit this product" }, 403);
    }

    const { title, description, category, price, imageUrl, imagePath } = await c.req.json();
    
    if (!title || !description || !category || !price) {
      return c.json({ error: "All product fields are required" }, 400);
    }

    const updatedProduct = {
      ...existingProduct,
      title,
      description,
      category,
      price: parseFloat(price),
      image_url: imageUrl !== undefined ? imageUrl : existingProduct.image_url,
      image_path: imagePath !== undefined ? imagePath : existingProduct.image_path
    };

    await kv.set(`product:${productId}`, updatedProduct);

    return c.json({ product: updatedProduct });
  } catch (error) {
    console.log(`Product update error: ${error}`);
    return c.json({ error: "Internal server error updating product" }, 500);
  }
});

// Delete product
app.delete("/make-server-213a9f17/products/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const productId = c.req.param('id');
    const existingProduct = await kv.get(`product:${productId}`);
    
    if (!existingProduct) {
      return c.json({ error: "Product not found" }, 404);
    }

    if (existingProduct.seller_id !== user.id) {
      return c.json({ error: "Not authorized to delete this product" }, 403);
    }

    await kv.del(`product:${productId}`);

    return c.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(`Product deletion error: ${error}`);
    return c.json({ error: "Internal server error deleting product" }, 500);
  }
});

// Add to cart
app.post("/make-server-213a9f17/cart", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { productId } = await c.req.json();
    
    if (!productId) {
      return c.json({ error: "Product ID is required" }, 400);
    }

    const product = await kv.get(`product:${productId}`);
    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    if (product.seller_id === user.id) {
      return c.json({ error: "Cannot add your own product to cart" }, 400);
    }

    const cartItem = {
      user_id: user.id,
      product_id: productId,
      added_at: new Date().toISOString()
    };

    await kv.set(`cart:${user.id}:${productId}`, cartItem);

    return c.json({ message: "Product added to cart", cartItem });
  } catch (error) {
    console.log(`Add to cart error: ${error}`);
    return c.json({ error: "Internal server error adding to cart" }, 500);
  }
});

// Get cart items
app.get("/make-server-213a9f17/cart", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const cartItems = await kv.getByPrefix(`cart:${user.id}:`);
    const cartWithProducts = [];

    for (const cartItem of cartItems) {
      const product = await kv.get(`product:${cartItem.product_id}`);
      if (product) {
        cartWithProducts.push({
          ...cartItem,
          product
        });
      }
    }

    return c.json({ cartItems: cartWithProducts });
  } catch (error) {
    console.log(`Cart fetch error: ${error}`);
    return c.json({ error: "Internal server error fetching cart" }, 500);
  }
});

// Remove from cart
app.delete("/make-server-213a9f17/cart/:productId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const productId = c.req.param('productId');
    await kv.del(`cart:${user.id}:${productId}`);

    return c.json({ message: "Product removed from cart" });
  } catch (error) {
    console.log(`Remove from cart error: ${error}`);
    return c.json({ error: "Internal server error removing from cart" }, 500);
  }
});

// Purchase items
app.post("/make-server-213a9f17/purchase", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { productIds } = await c.req.json();
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return c.json({ error: "Product IDs array is required" }, 400);
    }

    const purchases = [];
    const now = new Date().toISOString();

    for (const productId of productIds) {
      const product = await kv.get(`product:${productId}`);
      if (product) {
        const purchaseId = crypto.randomUUID();
        const purchase = {
          id: purchaseId,
          user_id: user.id,
          product_id: productId,
          purchased_at: now,
          price: product.price,
          title: product.title
        };

        await kv.set(`purchase:${purchaseId}`, purchase);
        purchases.push(purchase);

        // Remove from cart after purchase
        await kv.del(`cart:${user.id}:${productId}`);
      }
    }

    return c.json({ message: "Purchase completed", purchases });
  } catch (error) {
    console.log(`Purchase error: ${error}`);
    return c.json({ error: "Internal server error processing purchase" }, 500);
  }
});

// Get purchase history
app.get("/make-server-213a9f17/purchases", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const allPurchases = await kv.getByPrefix('purchase:');
    const userPurchases = allPurchases.filter(p => p.user_id === user.id);
    
    const purchasesWithProducts = [];
    for (const purchase of userPurchases) {
      const product = await kv.get(`product:${purchase.product_id}`);
      purchasesWithProducts.push({
        ...purchase,
        product: product || { title: purchase.title, image_placeholder: "📦" }
      });
    }

    // Sort by purchased_at descending
    purchasesWithProducts.sort((a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime());

    return c.json({ purchases: purchasesWithProducts });
  } catch (error) {
    console.log(`Purchase history fetch error: ${error}`);
    return c.json({ error: "Internal server error fetching purchase history" }, 500);
  }
});

Deno.serve(app.fetch);