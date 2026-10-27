/* =====================================================================
   R&R Gardening — Shared Data Store (mock backend)
   ---------------------------------------------------------------------
   Both the Admin Dashboard (index.html) and the Customer Shop (shop.html)
   read and write this store. Data is persisted in the browser's
   localStorage, so an order placed in the shop instantly shows up in the
   dashboard (and stock levels drop) — even across browser tabs/windows.

   ► To load the client's REAL products: edit SEED_PRODUCTS below, then
     click "Reset Demo Data" in the dashboard (sidebar, bottom) or run
     RRStore.reset() in the browser console.
   ► To use your logo: drop a file at  assets/logo.png  (see RR_CONFIG).
   ===================================================================== */
(function () {
    'use strict';

    const RR_CONFIG = {
        businessName: 'R&R Gardening',
        logoSrc: 'assets/logo.png',   // shown automatically if the file exists; falls back to 🌿
        taxRate: 0.085,
        lowStockThreshold: 20,
        // Baseline figures representing history before this demo's seed orders
        baseline: { revenue: 47832.50, ordersToday: 23, customers: 342 },
    };

    // ── Product catalog (single source of truth) ──
    const SEED_PRODUCTS = [
        { id:1,  emoji:'🌸', name:'Petunia Mix (Annual)',          sku:'RR-ANN-001', category:'Annuals',            price:4.99,  cost:2.20,  stock:145, rating:4.5, desc:'Vibrant color all summer long' },
        { id:2,  emoji:'🌻', name:'Sunflower (Mammoth)',           sku:'RR-ANN-002', category:'Annuals',            price:3.99,  cost:1.80,  stock:92,  rating:4.7, desc:'Towering blooms up to 12 ft tall' },
        { id:3,  emoji:'🌱', name:'Cherry Tomato Starts',          sku:'RR-ANN-003', category:'Annuals',            price:6.99,  cost:3.10,  stock:78,  rating:4.6, desc:'Sweet 100 variety, prolific' },
        { id:4,  emoji:'🌺', name:'Marigold (French)',             sku:'RR-ANN-004', category:'Annuals',            price:4.49,  cost:2.00,  stock:120, rating:4.4, desc:'Pest-repelling companion plant' },
        { id:5,  emoji:'🪻', name:'Lavender (English)',            sku:'RR-PER-001', category:'Perennials',         price:12.99, cost:5.80,  stock:65,  rating:4.8, desc:'Fragrant purple blooms, drought-tolerant' },
        { id:6,  emoji:'🌷', name:'Echinacea (Purple Cone)',       sku:'RR-PER-002', category:'Perennials',         price:9.99,  cost:4.50,  stock:48,  rating:4.6, desc:'Pollinator magnet, long blooming' },
        { id:7,  emoji:'💐', name:'Black-Eyed Susan',              sku:'RR-PER-003', category:'Perennials',         price:8.99,  cost:4.00,  stock:55,  rating:4.5, desc:'Golden blooms, native wildflower' },
        { id:8,  emoji:'🌹', name:'Rose Bush (Hybrid Tea)',        sku:'RR-SHR-001', category:'Shrubs & Trees',     price:24.99, cost:11.50, stock:3,   rating:4.9, desc:'Classic long-stemmed blooms' },
        { id:9,  emoji:'🍁', name:'Japanese Maple (Dwarf)',        sku:'RR-SHR-002', category:'Shrubs & Trees',     price:89.99, cost:42.00, stock:12,  rating:5.0, desc:'Stunning fall color, specimen tree' },
        { id:10, emoji:'🌲', name:'Arborvitae (Emerald)',          sku:'RR-SHR-003', category:'Shrubs & Trees',     price:34.99, cost:16.00, stock:28,  rating:4.6, desc:'Fast-growing privacy screen' },
        { id:11, emoji:'🪴', name:'Succulent Trio Pack',           sku:'RR-SUC-001', category:'Succulents',         price:22.99, cost:9.80,  stock:56,  rating:4.8, desc:'Assorted colorful varieties' },
        { id:12, emoji:'🌵', name:'Aloe Vera (Large)',             sku:'RR-SUC-002', category:'Succulents',         price:14.99, cost:6.50,  stock:38,  rating:4.7, desc:'Soothing gel, easy care' },
        { id:13, emoji:'🌿', name:'Basil (Sweet Genovese)',        sku:'RR-HRB-001', category:'Herbs',              price:4.99,  cost:2.20,  stock:85,  rating:4.4, desc:'Classic Italian culinary herb' },
        { id:14, emoji:'🧺', name:'Herb Garden Kit',               sku:'RR-HRB-002', category:'Herbs',              price:24.99, cost:11.00, stock:42,  rating:4.9, desc:'5 herbs with pots and soil' },
        { id:15, emoji:'🌿', name:'Rosemary (Tuscan Blue)',        sku:'RR-HRB-003', category:'Herbs',              price:6.99,  cost:3.10,  stock:67,  rating:4.5, desc:'Upright habit, great for cooking' },
        { id:16, emoji:'🌻', name:'Sunflower Seeds (Giant)',       sku:'RR-SED-001', category:'Seeds',              price:3.99,  cost:1.20,  stock:8,   rating:4.6, desc:'Easy to grow, kid-friendly' },
        { id:17, emoji:'🌱', name:'Wildflower Mix Seeds',          sku:'RR-SED-002', category:'Seeds',              price:5.99,  cost:1.80,  stock:110, rating:4.7, desc:'Native pollinator-friendly blend' },
        { id:18, emoji:'🪨', name:'Potting Mix Premium',           sku:'RR-SOI-001', category:'Soil & Amendments',  price:12.99, cost:5.80,  stock:89,  rating:4.8, desc:'Organic, all-purpose blend' },
        { id:19, emoji:'🍂', name:'Organic Compost (40lb)',        sku:'RR-SOI-002', category:'Soil & Amendments',  price:8.99,  cost:3.80,  stock:134, rating:4.6, desc:'Rich, nutrient-dense amendment' },
        { id:20, emoji:'🏺', name:'Terracotta Pot Large',          sku:'RR-POT-001', category:'Pots & Containers',  price:18.99, cost:8.50,  stock:2,   rating:4.5, desc:'Classic Italian terracotta' },
        { id:21, emoji:'🏺', name:'Ceramic Planter (Blue)',        sku:'RR-POT-002', category:'Pots & Containers',  price:29.99, cost:13.50, stock:24,  rating:4.4, desc:'Handmade, drainage hole included' },
        { id:22, emoji:'🧺', name:'Hanging Basket (Coconut)',      sku:'RR-POT-003', category:'Pots & Containers',  price:14.99, cost:6.50,  stock:31,  rating:4.3, desc:'Coco-fiber liner, chain included' },
        { id:23, emoji:'✂️', name:'Pruning Shears Pro',            sku:'RR-TOL-001', category:'Tools',              price:19.99, cost:9.00,  stock:5,   rating:4.9, desc:'Titanium blade, ergonomic grip' },
        { id:24, emoji:'🧰', name:'Garden Trowel Set',             sku:'RR-TOL-002', category:'Tools',              price:16.99, cost:7.50,  stock:44,  rating:4.5, desc:'3-piece stainless steel set' },
        { id:25, emoji:'🧪', name:'All-Purpose Fertilizer 10-10-10', sku:'RR-FER-001', category:'Fertilizers',      price:11.99, cost:5.40,  stock:72,  rating:4.6, desc:'Balanced feed for all plants' },
        { id:26, emoji:'🧪', name:'Bloom Booster Fertilizer',      sku:'RR-FER-002', category:'Fertilizers',        price:13.99, cost:6.30,  stock:0,   rating:4.7, desc:'High-phosphorus for big blooms' },
        { id:27, emoji:'🌺', name:'Zinnia Mix (Dahlia-Flowered)',  sku:'RR-ANN-005', category:'Annuals',            price:4.99,  cost:2.20,  stock:88,  rating:4.5, desc:'Bold, cut-and-come-again flowers' },
        { id:28, emoji:'🪷', name:'Echeveria (Lola)',              sku:'RR-SUC-003', category:'Succulents',         price:9.99,  cost:4.50,  stock:19,  rating:4.8, desc:'Pastel rosette, perfect for containers' },
        { id:29, emoji:'🪴', name:'Monstera Deliciosa',            sku:'RR-PER-004', category:'Perennials',         price:34.99, cost:15.00, stock:12,  rating:4.6, desc:'Stunning tropical foliage' },
        { id:30, emoji:'🌷', name:'Tulip Bulbs (10-Pack)',         sku:'RR-SED-003', category:'Seeds',              price:11.99, cost:4.80,  stock:56,  rating:4.7, desc:'Mixed colors, spring blooming' },
    ];

    // ── Historical orders (seed) ──
    const SEED_ORDERS = [
        { id:'RRG-1047', customer:'Sarah Mitchell', email:'sarah.m@email.com', date:'Oct 26, 2026', items:4, total:124.50, payment:'Stripe', status:'Completed', address:'421 Oak St, Portland, OR 97201', products:[{name:'Lavender (English)',qty:2,price:12.99},{name:'Potting Mix Premium',qty:1,price:12.99},{name:'Herb Garden Kit',qty:1,price:24.99}] },
        { id:'RRG-1046', customer:'James Chen', email:'j.chen@email.com', date:'Oct 26, 2026', items:1, total:89.99, payment:'Stripe', status:'Processing', address:'78 Willow Ave, Portland, OR 97205', products:[{name:'Japanese Maple (Dwarf)',qty:1,price:89.99}] },
        { id:'RRG-1045', customer:'Maria Garcia', email:'maria.g@email.com', date:'Oct 25, 2026', items:7, total:256.80, payment:'PayPal', status:'Shipped', address:'1902 Garden Blvd, Portland, OR 97210', products:[{name:'Rose Bush (Hybrid Tea)',qty:2,price:24.99},{name:'Succulent Trio Pack',qty:3,price:22.99},{name:'Ceramic Planter (Blue)',qty:2,price:29.99}] },
        { id:'RRG-1044', customer:'David Thompson', email:'d.thompson@email.com', date:'Oct 25, 2026', items:7, total:45.98, payment:'Stripe', status:'Pending', address:'345 Elm St, Portland, OR 97209', products:[{name:'Petunia Mix (Annual)',qty:4,price:4.99},{name:'Marigold (French)',qty:3,price:4.49}] },
        { id:'RRG-1043', customer:'Emily Rodriguez', email:'emily.r@email.com', date:'Oct 24, 2026', items:6, total:178.44, payment:'Stripe', status:'Completed', address:'890 Pine Rd, Portland, OR 97214', products:[{name:'Aloe Vera (Large)',qty:2,price:14.99},{name:'Pruning Shears Pro',qty:1,price:19.99},{name:'All-Purpose Fertilizer 10-10-10',qty:3,price:11.99}] },
        { id:'RRG-1042', customer:'Robert Kim', email:'r.kim@email.com', date:'Oct 24, 2026', items:12, total:312.00, payment:'Stripe', status:'Completed', address:'567 Cedar Ln, Portland, OR 97211', products:[{name:'Arborvitae (Emerald)',qty:4,price:34.99},{name:'Organic Compost (40lb)',qty:6,price:8.99},{name:'Garden Trowel Set',qty:2,price:16.99}] },
        { id:'RRG-1041', customer:'Lisa Wang', email:'l.wang@email.com', date:'Oct 23, 2026', items:6, total:67.96, payment:'PayPal', status:'Completed', address:'234 Birch Ave, Portland, OR 97215', products:[{name:'Basil (Sweet Genovese)',qty:3,price:4.99},{name:'Rosemary (Tuscan Blue)',qty:2,price:6.99},{name:'Herb Garden Kit',qty:1,price:24.99}] },
        { id:'RRG-1040', customer:'Michael Patel', email:'m.patel@email.com', date:'Oct 22, 2026', items:1, total:22.99, payment:'Stripe', status:'Completed', address:'45 Spruce Ct, Beaverton, OR 97005', products:[{name:'Succulent Trio Pack',qty:1,price:22.99}] },
        { id:'RRG-1039', customer:'Amanda Johnson', email:'a.johnson@email.com', date:'Oct 22, 2026', items:4, total:155.93, payment:'Stripe', status:'Shipped', address:'678 Maple Dr, Lake Oswego, OR 97034', products:[{name:'Japanese Maple (Dwarf)',qty:1,price:89.99},{name:'Terracotta Pot Large',qty:1,price:18.99},{name:'Hanging Basket (Coconut)',qty:2,price:14.99}] },
        { id:'RRG-1038', customer:'Chris Brown', email:'c.brown@email.com', date:'Oct 21, 2026', items:4, total:37.98, payment:'Stripe', status:'Completed', address:'901 Ash St, Portland, OR 97220', products:[{name:'Cherry Tomato Starts',qty:2,price:6.99},{name:'Potting Mix Premium',qty:2,price:12.99}] },
        { id:'RRG-1037', customer:'Nancy Liu', email:'n.liu@email.com', date:'Oct 20, 2026', items:7, total:98.96, payment:'PayPal', status:'Completed', address:'123 Dogwood Ln, Portland, OR 97202', products:[{name:'Echinacea (Purple Cone)',qty:2,price:9.99},{name:'Black-Eyed Susan',qty:3,price:8.99},{name:'Bloom Booster Fertilizer',qty:2,price:13.99}] },
        { id:'RRG-1036', customer:'Tom Wilson', email:'t.wilson@email.com', date:'Oct 19, 2026', items:2, total:49.98, payment:'Stripe', status:'Cancelled', address:'456 Hazel Way, Tigard, OR 97223', products:[{name:'Rose Bush (Hybrid Tea)',qty:2,price:24.99}] },
        { id:'RRG-1035', customer:'Sarah Mitchell', email:'sarah.m@email.com', date:'Oct 18, 2026', items:8, total:199.50, payment:'Stripe', status:'Completed', address:'421 Oak St, Portland, OR 97201', products:[{name:'Ceramic Planter (Blue)',qty:3,price:29.99},{name:'Succulent Trio Pack',qty:2,price:22.99},{name:'Echeveria (Lola)',qty:3,price:9.99}] },
        { id:'RRG-1034', customer:'Emily Rodriguez', email:'emily.r@email.com', date:'Oct 17, 2026', items:2, total:53.98, payment:'Stripe', status:'Completed', address:'890 Pine Rd, Portland, OR 97214', products:[{name:'Arborvitae (Emerald)',qty:1,price:34.99},{name:'Pruning Shears Pro',qty:1,price:19.99}] },
        { id:'RRG-1033', customer:'James Chen', email:'j.chen@email.com', date:'Oct 16, 2026', items:6, total:83.96, payment:'Stripe', status:'Completed', address:'78 Willow Ave, Portland, OR 97205', products:[{name:'Lavender (English)',qty:3,price:12.99},{name:'Wildflower Mix Seeds',qty:2,price:5.99},{name:'Garden Trowel Set',qty:1,price:16.99}] },
        { id:'RRG-1032', customer:'Maria Garcia', email:'maria.g@email.com', date:'Oct 15, 2026', items:14, total:141.93, payment:'PayPal', status:'Completed', address:'1902 Garden Blvd, Portland, OR 97210', products:[{name:'Herb Garden Kit',qty:2,price:24.99},{name:'Basil (Sweet Genovese)',qty:4,price:4.99},{name:'Rosemary (Tuscan Blue)',qty:3,price:6.99},{name:'Sunflower (Mammoth)',qty:5,price:3.99}] },
    ];

    const NS = 'rr.v1.';
    const K = { products: NS + 'products', orders: NS + 'orders', rev: NS + 'rev' };
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

        addProduct(p) {
            const list = this.getProducts();
            const id = list.reduce((m, x) => Math.max(m, x.id), 0) + 1;
            const product = Object.assign({ emoji: '🌱', rating: 5.0, desc: '', cost: 0, stock: 0 }, p, { id });
            if (!product.sku) product.sku = 'RR-NEW-' + String(id).padStart(3, '0');
            list.push(product);
            this.saveProducts(list);
            return product;
        },

        adjustStock(id, delta) {
            const list = this.getProducts();
            const p = list.find(x => x.id === id);
            if (!p) return null;
            p.stock = Math.max(0, p.stock + delta);
            this.saveProducts(list);
            return p;
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
            try { localStorage.removeItem(K.products); localStorage.removeItem(K.orders); } catch (e) {}
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

