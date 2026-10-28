/* =====================================================================
   R&R Garden Center — Shared Data Store (mock backend)
   ---------------------------------------------------------------------
   Both the Admin Dashboard (index.html) and the Customer Shop (shop.html)
   read and write this store. Data is persisted in the browser's
   localStorage, so an order placed in the shop instantly shows up in the
   dashboard (and stock levels drop) — even across browser tabs/windows.

   ► Products: edit SEED_PRODUCTS below, then click "Reset Demo Data" in
     the dashboard (sidebar, bottom) or run RRStore.reset() in the console.
   ► To use your logo: drop a file at  assets/logo.png  (see RR_CONFIG).
   ===================================================================== */
(function () {
    'use strict';

    const RR_CONFIG = {
        businessName: 'R&R Garden Center',
        logoSrc: 'assets/logo.png',   // shown automatically if the file exists; falls back to 🌿
        taxRate: 0.085,
        lowStockThreshold: 20,
        // Baseline figures representing history before this demo's seed orders
        baseline: { revenue: 47832.50, ordersToday: 23, customers: 342 },
    };

    // ── Product catalog (single source of truth) ──
    // R&R's real catalog. Size families share a `group`; each size is its own SKU (`variant`).
    // `unit` drives price labels: each | bag | yard | half yard.
    // `priceTBD: true` marks placeholder prices that still need confirming with R&R.
    // Photos live at assets/products/<slug>.jpg; swap a file to use a real product shot.
    const SEED_PRODUCTS = [
        { id:1, emoji:"🪑", name:"Concrete Table", sku:"RR-HSC-001", category:"Hardscape", unit:"each", price:300, cost:138, stock:6, rating:4.8, desc:"Cast concrete patio table. Heavy, weatherproof and built to stay put.", image:'assets/products/hardscape-table.jpg' },
        { id:2, emoji:"🪑", name:"Concrete Bench", sku:"RR-HSC-002", category:"Hardscape", unit:"each", price:150, cost:68, stock:14, rating:4.9, desc:"Cast concrete garden bench for patios, paths and gardens.", image:'assets/products/hardscape-bench.jpg' },
        { id:3, emoji:"📫", name:"Concrete Mailbox", sku:"RR-HSC-003", category:"Hardscape", unit:"each", price:250, cost:112, stock:5, rating:4.7, desc:"Sturdy cast concrete mailbox post.", image:'assets/products/hardscape-mailbox.jpg' },
        { id:4, emoji:"🧱", name:"Parking Bumper", sku:"RR-HSC-004", category:"Hardscape", unit:"each", price:30, cost:13, stock:40, rating:4.6, desc:"Precast concrete wheel stop for driveways and parking areas.", image:'assets/products/hardscape-bumper.jpg' },
        { id:5, emoji:"🧱", name:"Square Stepping Stone 24\" x 24\"", group:"Square Stepping Stone", variant:"24\" x 24\"", sku:"RR-STP-001", category:"Stepping Stones", unit:"each", price:11, cost:4.8, stock:120, rating:4.7, desc:"Gray concrete stepping stone for paths, patios and garden walkways.", image:'assets/products/stone-square-gray.jpg' },
        { id:6, emoji:"🧱", name:"Square Stepping Stone 20\" x 20\"", group:"Square Stepping Stone", variant:"20\" x 20\"", sku:"RR-STP-002", category:"Stepping Stones", unit:"each", price:10, cost:4.3, stock:140, rating:4.7, desc:"Gray concrete stepping stone for paths, patios and garden walkways.", image:'assets/products/stone-square-gray.jpg' },
        { id:7, emoji:"🧱", name:"Square Stepping Stone 18\" x 18\"", group:"Square Stepping Stone", variant:"18\" x 18\"", sku:"RR-STP-003", category:"Stepping Stones", unit:"each", price:9, cost:3.9, stock:160, rating:4.7, desc:"Gray concrete stepping stone for paths, patios and garden walkways.", image:'assets/products/stone-square-gray.jpg' },
        { id:8, emoji:"🧱", name:"Square Stepping Stone 16\" x 16\"", group:"Square Stepping Stone", variant:"16\" x 16\"", sku:"RR-STP-004", category:"Stepping Stones", unit:"each", price:8, cost:3.4, stock:180, rating:4.7, desc:"Gray concrete stepping stone for paths, patios and garden walkways.", image:'assets/products/stone-square-gray.jpg' },
        { id:9, emoji:"🧱", name:"White Concrete Slab 12\" x 24\"", group:"White Concrete Slab", variant:"12\" x 24\"", sku:"RR-SLB-W01", category:"Stepping Stones", unit:"each", price:24, cost:10.5, stock:60, rating:4.8, desc:"Smooth white concrete slab for modern paths and patios.", image:'assets/products/slab-white.jpg' },
        { id:10, emoji:"🧱", name:"White Concrete Slab 16\" x 32\"", group:"White Concrete Slab", variant:"16\" x 32\"", sku:"RR-SLB-W02", category:"Stepping Stones", unit:"each", price:30, cost:13.2, stock:45, rating:4.8, desc:"Smooth white concrete slab for modern paths and patios.", image:'assets/products/slab-white.jpg' },
        { id:11, emoji:"🧱", name:"White Concrete Slab 24\" x 36\"", group:"White Concrete Slab", variant:"24\" x 36\"", sku:"RR-SLB-W03", category:"Stepping Stones", unit:"each", price:34, cost:15.0, stock:18, rating:4.8, desc:"Smooth white concrete slab for modern paths and patios.", image:'assets/products/slab-white.jpg' },
        { id:12, emoji:"🧱", name:"Gray Concrete Slab 12\" x 24\"", group:"Gray Concrete Slab", variant:"12\" x 24\"", sku:"RR-SLB-G01", category:"Stepping Stones", unit:"each", price:22, cost:9.6, stock:70, rating:4.8, desc:"Smooth gray concrete slab for modern paths and patios.", image:'assets/products/slab-gray.jpg' },
        { id:13, emoji:"🧱", name:"Gray Concrete Slab 16\" x 32\"", group:"Gray Concrete Slab", variant:"16\" x 32\"", sku:"RR-SLB-G02", category:"Stepping Stones", unit:"each", price:28, cost:12.3, stock:50, rating:4.8, desc:"Smooth gray concrete slab for modern paths and patios.", image:'assets/products/slab-gray.jpg' },
        { id:14, emoji:"🟫", name:"Top Soil (Bag)", sku:"RR-SOB-001", category:"Bagged Soil", unit:"bag", price:4.99, cost:2.1, stock:200, rating:4.6, desc:"Screened top soil for filling, leveling and new beds.", image:'assets/products/soil-bag-top.jpg', priceTBD:true },   // TODO: confirm price
        { id:15, emoji:"🟫", name:"50/50 Soil (Bag)", sku:"RR-SOB-002", category:"Bagged Soil", unit:"bag", price:5.99, cost:2.6, stock:160, rating:4.7, desc:"Half top soil, half compost. A good all-round garden blend.", image:'assets/products/soil-bag-5050.jpg', priceTBD:true },   // TODO: confirm price
        { id:16, emoji:"🟫", name:"Potting Soil (Bag)", sku:"RR-SOB-003", category:"Bagged Soil", unit:"bag", price:8.99, cost:3.9, stock:140, rating:4.8, desc:"Light, fluffy mix for containers and planters.", image:'assets/products/soil-bag-potting.jpg', priceTBD:true },   // TODO: confirm price
        { id:17, emoji:"🟫", name:"Top Soil (Bulk) - 1 yard", group:"Top Soil (Bulk)", variant:"1 yard", sku:"RR-SOL-01Y", category:"Bulk Soil", unit:"yard", price:45, cost:20.25, stock:30, rating:4.7, desc:"Screened top soil by the cubic yard for leveling, filling and new lawns.", image:'assets/products/soil-bulk-top.jpg', priceTBD:true },   // TODO: confirm price
        { id:18, emoji:"🟫", name:"Top Soil (Bulk) - 1/2 yard", group:"Top Soil (Bulk)", variant:"1/2 yard", sku:"RR-SOL-01H", category:"Bulk Soil", unit:"half yard", price:25, cost:11.25, stock:30, rating:4.7, desc:"Screened top soil by the cubic yard for leveling, filling and new lawns.", image:'assets/products/soil-bulk-top.jpg', priceTBD:true },   // TODO: confirm price
        { id:19, emoji:"🟫", name:"50/50 Soil (Bulk) - 1 yard", group:"50/50 Soil (Bulk)", variant:"1 yard", sku:"RR-SOL-02Y", category:"Bulk Soil", unit:"yard", price:55, cost:24.75, stock:30, rating:4.7, desc:"Half top soil, half compost by the cubic yard for beds and gardens.", image:'assets/products/soil-bulk-5050.jpg', priceTBD:true },   // TODO: confirm price
        { id:20, emoji:"🟫", name:"50/50 Soil (Bulk) - 1/2 yard", group:"50/50 Soil (Bulk)", variant:"1/2 yard", sku:"RR-SOL-02H", category:"Bulk Soil", unit:"half yard", price:30, cost:13.5, stock:30, rating:4.7, desc:"Half top soil, half compost by the cubic yard for beds and gardens.", image:'assets/products/soil-bulk-5050.jpg', priceTBD:true },   // TODO: confirm price
        { id:21, emoji:"🟫", name:"Potting Soil (Bulk) - 1 yard", group:"Potting Soil (Bulk)", variant:"1 yard", sku:"RR-SOL-03Y", category:"Bulk Soil", unit:"yard", price:65, cost:29.25, stock:30, rating:4.7, desc:"Light potting mix by the cubic yard for large planters and raised beds.", image:'assets/products/soil-bulk-potting.jpg', priceTBD:true },   // TODO: confirm price
        { id:22, emoji:"🟫", name:"Potting Soil (Bulk) - 1/2 yard", group:"Potting Soil (Bulk)", variant:"1/2 yard", sku:"RR-SOL-03H", category:"Bulk Soil", unit:"half yard", price:35, cost:15.75, stock:30, rating:4.7, desc:"Light potting mix by the cubic yard for large planters and raised beds.", image:'assets/products/soil-bulk-potting.jpg', priceTBD:true },   // TODO: confirm price
        { id:23, emoji:"🪨", name:"Pea Rock Gravel", sku:"RR-RCK-001", category:"Bulk Rock & Gravel", unit:"yard", price:55, cost:24.75, stock:48, rating:4.7, desc:"Small rounded pebbles for paths, patios and drainage. Sold by the cubic yard.", image:'assets/products/rock-pea.jpg', priceTBD:true },   // TODO: confirm price
        { id:24, emoji:"🪨", name:"1/2\" Gravel", sku:"RR-RCK-002", category:"Bulk Rock & Gravel", unit:"yard", price:50, cost:22.5, stock:52, rating:4.7, desc:"Crushed 1/2 inch gravel for paths, bases and drainage. Sold by the cubic yard.", image:'assets/products/rock-gravel-half.jpg', priceTBD:true },   // TODO: confirm price
        { id:25, emoji:"🪨", name:"3/4\" Gravel", sku:"RR-RCK-003", category:"Bulk Rock & Gravel", unit:"yard", price:50, cost:22.5, stock:46, rating:4.7, desc:"Crushed 3/4 inch gravel for driveways, bases and drainage. Sold by the cubic yard.", image:'assets/products/rock-gravel-three-quarter.jpg', priceTBD:true },   // TODO: confirm price
        { id:26, emoji:"🪨", name:"Granite Rock", sku:"RR-RCK-004", category:"Bulk Rock & Gravel", unit:"yard", price:60, cost:27.0, stock:34, rating:4.7, desc:"Crushed granite in speckled pink and gray tones. Sold by the cubic yard.", image:'assets/products/rock-granite.jpg', priceTBD:true },   // TODO: confirm price
        { id:27, emoji:"🪨", name:"Slate Rock", sku:"RR-RCK-005", category:"Bulk Rock & Gravel", unit:"yard", price:95, cost:42.75, stock:22, rating:4.7, desc:"Flat charcoal slate chips for beds and borders. Sold by the cubic yard.", image:'assets/products/rock-slate.jpg', priceTBD:true },   // TODO: confirm price
        { id:28, emoji:"🪨", name:"Lime Rock", sku:"RR-RCK-006", category:"Bulk Rock & Gravel", unit:"yard", price:40, cost:18.0, stock:58, rating:4.7, desc:"Crushed lime rock for driveways and compacted bases. Sold by the cubic yard.", image:'assets/products/rock-lime.jpg', priceTBD:true },   // TODO: confirm price
        { id:29, emoji:"🪨", name:"White Marble Chip", sku:"RR-RCK-007", category:"Bulk Rock & Gravel", unit:"yard", price:120, cost:54.0, stock:26, rating:4.7, desc:"Bright white marble chips for clean, high-contrast beds. Sold by the cubic yard.", image:'assets/products/rock-marble-white.jpg', priceTBD:true },   // TODO: confirm price
        { id:30, emoji:"🪨", name:"Green Marble", sku:"RR-RCK-008", category:"Bulk Rock & Gravel", unit:"yard", price:140, cost:63.0, stock:12, rating:4.7, desc:"Green marble chips with natural veining. Sold by the cubic yard.", image:'assets/products/rock-marble-green.jpg', priceTBD:true },   // TODO: confirm price
        { id:31, emoji:"🪨", name:"River Rock", sku:"RR-RCK-009", category:"Bulk Rock & Gravel", unit:"yard", price:85, cost:38.25, stock:30, rating:4.7, desc:"Smooth multicolor river rock for borders and dry creek beds. Sold by the cubic yard.", image:'assets/products/rock-river.jpg', priceTBD:true },   // TODO: confirm price
        { id:32, emoji:"🪨", name:"Chattahoochee Rock", sku:"RR-RCK-010", category:"Bulk Rock & Gravel", unit:"yard", price:150, cost:67.5, stock:6, rating:4.7, desc:"Rounded river gravel in warm tan, brown and rust tones. Sold by the cubic yard.", image:'assets/products/rock-chattahoochee.jpg', priceTBD:true },   // TODO: confirm price
        { id:33, emoji:"🪨", name:"Egg Rock", sku:"RR-RCK-011", category:"Bulk Rock & Gravel", unit:"yard", price:110, cost:49.5, stock:21, rating:4.7, desc:"Smooth egg-shaped stones in mixed natural tones. Sold by the cubic yard.", image:'assets/products/rock-egg.jpg', priceTBD:true },   // TODO: confirm price
        { id:34, emoji:"🪨", name:"White Egg Rock", sku:"RR-RCK-012", category:"Bulk Rock & Gravel", unit:"yard", price:140, cost:63.0, stock:0, rating:4.7, desc:"Smooth white egg-shaped stones for bright accents. Sold by the cubic yard.", image:'assets/products/rock-egg-white.jpg', priceTBD:true },   // TODO: confirm price
        { id:35, emoji:"🪨", name:"Lava Rock", sku:"RR-RCK-013", category:"Bulk Rock & Gravel", unit:"yard", price:95, cost:42.75, stock:28, rating:4.7, desc:"Lightweight porous red lava rock for beds and fire features. Sold by the cubic yard.", image:'assets/products/rock-lava.jpg', priceTBD:true },   // TODO: confirm price
        { id:36, emoji:"🪨", name:"Crimson Rock", sku:"RR-RCK-014", category:"Bulk Rock & Gravel", unit:"yard", price:110, cost:49.5, stock:17, rating:4.7, desc:"Crimson red crushed rock for bold beds and borders. Sold by the cubic yard.", image:'assets/products/rock-crimson.jpg', priceTBD:true },   // TODO: confirm price
        { id:37, emoji:"🪨", name:"Diamond Rock", sku:"RR-BRK-001", category:"Bagged Rock", unit:"bag", price:14.99, cost:6.75, stock:64, rating:4.8, desc:"Bright white angular decorative rock. 40 lb bag.", image:'assets/products/bagrock-diamond.jpg', priceTBD:true },   // TODO: confirm price
        { id:38, emoji:"🪨", name:"Small Diamond Rock", sku:"RR-BRK-002", category:"Bagged Rock", unit:"bag", price:14.99, cost:6.75, stock:52, rating:4.8, desc:"Small white angular chips for fine detail. 40 lb bag.", image:'assets/products/bagrock-small-diamond.jpg', priceTBD:true },   // TODO: confirm price
        { id:39, emoji:"🪨", name:"Peruvian Mix Mini", sku:"RR-BRK-003", category:"Bagged Rock", unit:"bag", price:16.99, cost:7.65, stock:38, rating:4.8, desc:"Small polished pebbles in tan, cream, black and gray. 40 lb bag.", image:'assets/products/bagrock-peruvian.jpg', priceTBD:true },   // TODO: confirm price
        { id:40, emoji:"🪨", name:"Mexican Beach Pebble - High Polish", group:"Mexican Beach Pebble", variant:"High polish", sku:"RR-BRK-004", category:"Bagged Rock", unit:"bag", price:24.99, cost:11.25, stock:30, rating:4.8, desc:"Smooth flat black beach pebbles. 40 lb bag.", image:'assets/products/bagrock-mbp-polish.jpg', priceTBD:true },   // TODO: confirm price
        { id:41, emoji:"🪨", name:"Mexican Beach Pebble - Non-Polish", group:"Mexican Beach Pebble", variant:"Non-polish", sku:"RR-BRK-005", category:"Bagged Rock", unit:"bag", price:19.99, cost:9.0, stock:9, rating:4.8, desc:"Smooth flat black beach pebbles. 40 lb bag.", image:'assets/products/bagrock-mbp-natural.jpg', priceTBD:true },   // TODO: confirm price
        { id:42, emoji:"🪨", name:"Green Zebra", sku:"RR-BRK-006", category:"Bagged Rock", unit:"bag", price:17.99, cost:8.1, stock:24, rating:4.8, desc:"Polished green pebbles with natural white striping. 40 lb bag.", image:'assets/products/bagrock-green-zebra.jpg', priceTBD:true },   // TODO: confirm price
    ];

    // ── Historical orders (seed) ──
    const SEED_ORDERS = [
        { id:"RRG-1047", customer:"Sarah Mitchell", email:"sarah.m@email.com", date:"Oct 26, 2026", items:2, total:292.95, payment:"Stripe", status:"Completed", address:"421 Oak St, Portland, OR 97201", products:[{"name":"Concrete Bench","qty":1,"price":150},{"name":"White Marble Chip","qty":1,"price":120}] },
        { id:"RRG-1046", customer:"James Chen", email:"j.chen@email.com", date:"Oct 26, 2026", items:16, total:286.44, payment:"Stripe", status:"Processing", address:"78 Willow Ave, Portland, OR 97205", products:[{"name":"Square Stepping Stone 24\" x 24\"","qty":14,"price":11},{"name":"Pea Rock Gravel","qty":2,"price":55}] },
        { id:"RRG-1045", customer:"Maria Garcia", email:"maria.g@email.com", date:"Oct 25, 2026", items:9, total:237.55, payment:"PayPal", status:"Shipped", address:"1902 Garden Blvd, Portland, OR 97210", products:[{"name":"50/50 Soil (Bulk) - 1 yard","qty":3,"price":55},{"name":"Potting Soil (Bag)","qty":6,"price":8.99}] },
        { id:"RRG-1044", customer:"David Thompson", email:"d.thompson@email.com", date:"Oct 25, 2026", items:2, total:65.1, payment:"Stripe", status:"Pending", address:"345 Elm St, Portland, OR 97209", products:[{"name":"Parking Bumper","qty":2,"price":30}] },
        { id:"RRG-1043", customer:"Emily Rodriguez", email:"emily.r@email.com", date:"Oct 24, 2026", items:6, total:292.91, payment:"Stripe", status:"Completed", address:"890 Pine Rd, Portland, OR 97214", products:[{"name":"River Rock","qty":2,"price":85},{"name":"Mexican Beach Pebble - High Polish","qty":4,"price":24.99}] },
        { id:"RRG-1042", customer:"Robert Kim", email:"r.kim@email.com", date:"Oct 24, 2026", items:6, total:303.8, payment:"Stripe", status:"Completed", address:"567 Cedar Ln, Portland, OR 97211", products:[{"name":"3/4\" Gravel","qty":4,"price":50},{"name":"Lime Rock","qty":2,"price":40}] },
        { id:"RRG-1041", customer:"Lisa Wang", email:"l.wang@email.com", date:"Oct 23, 2026", items:13, total:109.44, payment:"PayPal", status:"Completed", address:"234 Birch Ave, Portland, OR 97215", products:[{"name":"Top Soil (Bag)","qty":10,"price":4.99},{"name":"Peruvian Mix Mini","qty":3,"price":16.99}] },
        { id:"RRG-1040", customer:"Michael Patel", email:"m.patel@email.com", date:"Oct 22, 2026", items:1, total:271.25, payment:"Stripe", status:"Completed", address:"45 Spruce Ct, Beaverton, OR 97005", products:[{"name":"Concrete Mailbox","qty":1,"price":250}] },
        { id:"RRG-1039", customer:"Amanda Johnson", email:"a.johnson@email.com", date:"Oct 22, 2026", items:16, total:455.66, payment:"Stripe", status:"Shipped", address:"678 Maple Dr, Lake Oswego, OR 97034", products:[{"name":"White Concrete Slab 16\" x 32\"","qty":12,"price":30},{"name":"Small Diamond Rock","qty":4,"price":14.99}] },
        { id:"RRG-1038", customer:"Chris Brown", email:"c.brown@email.com", date:"Oct 21, 2026", items:3, total:124.78, payment:"Stripe", status:"Completed", address:"901 Ash St, Portland, OR 97220", products:[{"name":"Top Soil (Bulk) - 1 yard","qty":2,"price":45},{"name":"Top Soil (Bulk) - 1/2 yard","qty":1,"price":25}] },
        { id:"RRG-1037", customer:"Nancy Liu", email:"n.liu@email.com", date:"Oct 20, 2026", items:3, total:142.11, payment:"PayPal", status:"Completed", address:"123 Dogwood Ln, Portland, OR 97202", products:[{"name":"Lava Rock","qty":1,"price":95},{"name":"Green Zebra","qty":2,"price":17.99}] },
        { id:"RRG-1036", customer:"Tom Wilson", email:"t.wilson@email.com", date:"Oct 19, 2026", items:1, total:325.5, payment:"Stripe", status:"Cancelled", address:"456 Hazel Way, Tigard, OR 97223", products:[{"name":"Concrete Table","qty":1,"price":300}] },
        { id:"RRG-1035", customer:"Sarah Mitchell", email:"sarah.m@email.com", date:"Oct 18, 2026", items:9, total:294.04, payment:"Stripe", status:"Completed", address:"421 Oak St, Portland, OR 97201", products:[{"name":"Gray Concrete Slab 12\" x 24\"","qty":8,"price":22},{"name":"Slate Rock","qty":1,"price":95}] },
        { id:"RRG-1034", customer:"Emily Rodriguez", email:"emily.r@email.com", date:"Oct 17, 2026", items:2, total:282.1, payment:"Stripe", status:"Completed", address:"890 Pine Rd, Portland, OR 97214", products:[{"name":"Chattahoochee Rock","qty":1,"price":150},{"name":"Egg Rock","qty":1,"price":110}] },
        { id:"RRG-1033", customer:"James Chen", email:"j.chen@email.com", date:"Oct 16, 2026", items:12, total:423.15, payment:"Stripe", status:"Completed", address:"78 Willow Ave, Portland, OR 97205", products:[{"name":"Concrete Bench","qty":2,"price":150},{"name":"Square Stepping Stone 18\" x 18\"","qty":10,"price":9}] },
        { id:"RRG-1032", customer:"Maria Garcia", email:"maria.g@email.com", date:"Oct 15, 2026", items:11, total:258.14, payment:"PayPal", status:"Completed", address:"1902 Garden Blvd, Portland, OR 97210", products:[{"name":"Potting Soil (Bulk) - 1 yard","qty":2,"price":65},{"name":"50/50 Soil (Bag)","qty":8,"price":5.99},{"name":"Granite Rock","qty":1,"price":60}] },
    ];

    // ── Customer contact details (seed). Order history is derived from orders by email. ──
    const SEED_CUSTOMERS = [
        { id:'sarah.m@email.com',   name:'Sarah Mitchell',  email:'sarah.m@email.com',   phone:'(503) 555-0147', address:'421 Oak St, Portland, OR 97201',        since:'Mar 14, 2024', notes:'Redoing her front beds in white marble. Prefers email.' },
        { id:'j.chen@email.com',    name:'James Chen',      email:'j.chen@email.com',    phone:'(503) 555-0182', address:'78 Willow Ave, Portland, OR 97205',     since:'Jun 2, 2024',  notes:'Building a stepping-stone path and patio in his new backyard.' },
        { id:'maria.g@email.com',   name:'Maria Garcia',    email:'maria.g@email.com',   phone:'(503) 555-0119', address:'1902 Garden Blvd, Portland, OR 97210',  since:'Apr 21, 2023', notes:'Runs a community garden. Buys soil by the yard; ask about bulk pricing.' },
        { id:'d.thompson@email.com',name:'David Thompson',  email:'d.thompson@email.com',phone:'(503) 555-0163', address:'345 Elm St, Portland, OR 97209',        since:'Sep 9, 2025',  notes:'' },
        { id:'emily.r@email.com',   name:'Emily Rodriguez', email:'emily.r@email.com',   phone:'(503) 555-0175', address:'890 Pine Rd, Portland, OR 97214',       since:'May 30, 2023', notes:'Professional landscaper. Buys river rock and beach pebble regularly.' },
        { id:'r.kim@email.com',     name:'Robert Kim',      email:'r.kim@email.com',     phone:'(503) 555-0138', address:'567 Cedar Ln, Portland, OR 97211',      since:'Aug 18, 2024', notes:'Regrading his driveway with gravel. Delivery preferred.' },
        { id:'l.wang@email.com',    name:'Lisa Wang',       email:'l.wang@email.com',    phone:'(503) 555-0191', address:'234 Birch Ave, Portland, OR 97215',     since:'Feb 3, 2025',  notes:'' },
        { id:'m.patel@email.com',   name:'Michael Patel',   email:'m.patel@email.com',   phone:'(503) 555-0126', address:'45 Spruce Ct, Beaverton, OR 97005',     since:'Oct 22, 2026', notes:'First-time customer.' },
        { id:'a.johnson@email.com', name:'Amanda Johnson',  email:'a.johnson@email.com', phone:'(503) 555-0154', address:'678 Maple Dr, Lake Oswego, OR 97034',   since:'Jul 11, 2024', notes:'' },
        { id:'c.brown@email.com',   name:'Chris Brown',     email:'c.brown@email.com',   phone:'(503) 555-0108', address:'901 Ash St, Portland, OR 97220',        since:'Mar 27, 2025', notes:'Filling raised vegetable beds.' },
        { id:'n.liu@email.com',     name:'Nancy Liu',       email:'n.liu@email.com',     phone:'(503) 555-0171', address:'123 Dogwood Ln, Portland, OR 97202',    since:'Jan 15, 2024', notes:'Building a lava rock fire-pit border.' },
        { id:'t.wilson@email.com',  name:'Tom Wilson',      email:'t.wilson@email.com',  phone:'(503) 555-0133', address:'456 Hazel Way, Tigard, OR 97223',       since:'Oct 1, 2025',  notes:'Cancelled last order — follow up.' },
    ];

    const NS = 'rr.v2.';   // bumped when the seed catalog changes so browsers drop stale data
    const K = { products: NS + 'products', orders: NS + 'orders', customers: NS + 'customers', rev: NS + 'rev' };
    const clone = (o) => JSON.parse(JSON.stringify(o));

    function read(key, seed) {
        try {
            const raw = localStorage.getItem(key);
            if (raw) return JSON.parse(raw);
        } catch (e) { /* storage unavailable or corrupt → fall back to seed */ }
        return clone(seed);
    }
    function write(key, val) {
        try {
            localStorage.setItem(key, JSON.stringify(val));
            localStorage.setItem(K.rev, String(Date.now()) + Math.random());
        } catch (e) { console.warn('RRStore: could not persist', e); }
        notify();
    }

    const listeners = [];
    function notify() { listeners.forEach(fn => { try { fn(); } catch (e) { console.error(e); } }); }

    // Cross-tab sync: storage events + a light revision poll as fallback (file:// friendly)
    let lastRev = null;
    try { lastRev = localStorage.getItem(K.rev); } catch (e) {}
    window.addEventListener('storage', (e) => { if (e.key && e.key.startsWith(NS)) { lastRev = localStorage.getItem(K.rev); notify(); } });
    setInterval(() => {
        let rev = null;
        try { rev = localStorage.getItem(K.rev); } catch (e) { return; }
        if (rev !== lastRev) { lastRev = rev; notify(); }
    }, 1500);

    function fmtDate(d) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    function money(n) { return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
    }

    const RRStore = {
        config: RR_CONFIG,
        money, esc, fmtDate,

        getProducts() { return read(K.products, SEED_PRODUCTS); },
        saveProducts(list) { write(K.products, list); },
        getOrders() { return read(K.orders, SEED_ORDERS); },
        saveOrders(list) { write(K.orders, list); },
        getCategories() { return [...new Set(this.getProducts().map(p => p.category))]; },

        /** Photo for a product; falls back to the seed photo by SKU so data saved before photos existed still shows them */
        productImage(p) {
            if (p.image) return p.image;
            const seed = SEED_PRODUCTS.find(s => s.sku === p.sku);
            return seed ? seed.image : null;
        },

        addProduct(p) {
            const list = this.getProducts();
            const id = list.reduce((m, x) => Math.max(m, x.id), 0) + 1;
            const product = Object.assign({ emoji: '🪨', unit: 'each', rating: 5.0, desc: '', cost: 0, stock: 0 }, p, { id });
            if (!product.sku) product.sku = 'RR-NEW-' + String(id).padStart(3, '0');
            list.push(product);
            this.saveProducts(list);
            return product;
        },

        /** Change stock by delta; each change is logged on the product (p.stockLog, newest first) */
        adjustStock(id, delta, reason = 'Manual adjustment') {
            const list = this.getProducts();
            const p = list.find(x => x.id === id);
            if (!p) return null;
            const before = p.stock;
            p.stock = Math.max(0, p.stock + delta);
            p.stockLog = [{ ts: Date.now(), change: p.stock - before, stock: p.stock, reason }].concat(p.stockLog || []).slice(0, 50);
            this.saveProducts(list);
            return p;
        },

        /** Edit product fields (price, cost, desc, …). Stock changes should go through adjustStock so they're logged. */
        updateProduct(id, patch) {
            const list = this.getProducts();
            const p = list.find(x => x.id === id);
            if (!p) return null;
            Object.assign(p, patch, { id });
            this.saveProducts(list);
            return p;
        },

        /** Customer profiles keyed by id (lowercased original email). Anyone who has ordered gets a profile
            built from their latest order, so new shop customers appear automatically. */
        getCustomers() {
            const saved = read(K.customers, SEED_CUSTOMERS);
            const byId = new Map(saved.map(c => [c.id, c]));
            this.getOrders().slice().reverse().forEach(o => {     // oldest first, so the latest order wins
                const id = String(o.email || o.customer).toLowerCase();
                const c = byId.get(id) || { id, name: o.customer, email: o.email || '', phone: '', address: '', notes: '', since: o.date };
                if (!byId.has(id)) byId.set(id, c);
                if (!c.phone && o.phone) c.phone = o.phone;
                if (!c.address && o.address && o.address !== 'In-store pickup') c.address = o.address;
            });
            return [...byId.values()];
        },
        getCustomer(id) { return this.getCustomers().find(c => c.id === id) || null; },
        /** Orders belong to a customer by their original email (the profile id), so editing the email keeps history */
        customerOrders(id) { return this.getOrders().filter(o => String(o.email || o.customer).toLowerCase() === id); },
        saveCustomer(c) {
            const list = read(K.customers, SEED_CUSTOMERS);
            if (!c.id) c.id = String(c.email || c.name).toLowerCase();
            const i = list.findIndex(x => x.id === c.id);
            if (i >= 0) list[i] = Object.assign(list[i], c); else list.push(Object.assign({ since: fmtDate(new Date()) }, c));
            write(K.customers, list);
            return c;
        },

        /** Place an order from the shop. items: [{id, qty}] */
        placeOrder({ customer, email, phone, address, pickup, items, payment = 'Stripe' }) {
            const products = this.getProducts();
            const lines = [];
            for (const it of items) {
                const p = products.find(x => x.id === it.id);
                if (!p) continue;
                const qty = Math.min(it.qty, p.stock);
                if (qty <= 0) continue;
                p.stock -= qty;
                lines.push({ name: p.name, emoji: p.emoji, qty, price: p.price });
            }
            if (!lines.length) throw new Error('No items available');
            const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
            const total = Math.round(subtotal * (1 + RR_CONFIG.taxRate) * 100) / 100;

            const orders = this.getOrders();
            const maxNum = orders.reduce((m, o) => Math.max(m, parseInt(String(o.id).replace(/\D/g, ''), 10) || 0), 1000);
            const now = new Date();
            const order = {
                id: 'RRG-' + (maxNum + 1),
                customer: customer || 'Guest Customer',
                email: email || 'guest@email.com',
                phone: phone || '',
                date: fmtDate(now),
                ts: now.getTime(),
                items: lines.reduce((s, l) => s + l.qty, 0),
                total,
                payment,
                status: 'Pending',
                address: pickup ? 'In-store pickup' : (address || 'In-store pickup'),
                products: lines,
                source: 'online',
            };
            orders.unshift(order);
            // Write products + orders, then bump revision once
            try { localStorage.setItem(K.products, JSON.stringify(products)); } catch (e) {}
            this.saveOrders(orders);
            return order;
        },

        updateOrderStatus(id, status) {
            const orders = this.getOrders();
            const o = orders.find(x => x.id === id);
            if (!o) return;
            o.status = status;
            this.saveOrders(orders);
        },

        /** Live KPIs derived from data */
        getStats() {
            const products = this.getProducts();
            const orders = this.getOrders();
            const online = orders.filter(o => o.source === 'online' && o.status !== 'Cancelled');
            const todayStr = fmtDate(new Date());
            const seedEmails = new Set(SEED_ORDERS.map(o => o.email.toLowerCase()));
            const newCustomers = new Set(online.map(o => o.email.toLowerCase()).filter(e => !seedEmails.has(e)));
            const low = products.filter(p => p.stock <= RR_CONFIG.lowStockThreshold);
            return {
                revenue: RR_CONFIG.baseline.revenue + online.reduce((s, o) => s + o.total, 0),
                ordersToday: RR_CONFIG.baseline.ordersToday + online.filter(o => o.date === todayStr).length,
                customers: RR_CONFIG.baseline.customers + newCustomers.size,
                productCount: products.length,
                lowStock: low.sort((a, b) => a.stock - b.stock),
                newOnlineOrders: online.length,
            };
        },

        subscribe(fn) { listeners.push(fn); },

        reset() {
            try { localStorage.removeItem(K.products); localStorage.removeItem(K.orders); localStorage.removeItem(K.customers); } catch (e) {}
            write(K.rev, Date.now());
        },

        /** Swap any element marked data-rr-logo for assets/logo.png when that file exists */
        applyLogo() {
            const targets = document.querySelectorAll('[data-rr-logo]');
            if (!targets.length || !RR_CONFIG.logoSrc) return;
            const img = new Image();
            img.onload = () => targets.forEach(el => {
                const h = el.getAttribute('data-rr-logo') || '2.25rem';
                el.innerHTML = `<img src="${RR_CONFIG.logoSrc}" alt="${esc(RR_CONFIG.businessName)} logo" style="height:${h};width:auto;display:block;">`;
            });
            img.src = RR_CONFIG.logoSrc;
        },
    };

    window.RR_CONFIG = RR_CONFIG;
    window.RRStore = RRStore;
    document.addEventListener('DOMContentLoaded', () => RRStore.applyLogo());
})();

