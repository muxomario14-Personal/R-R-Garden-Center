# R&R Gardening — Inventory, POS & Online Shop (Presentation Mock)

Open **`index.html`** (Admin Dashboard) and **`shop.html`** (Customer Shop) in any modern browser.
No internet or server required — every library and font is bundled in `vendor/`.

## Live demo flow
1. Open the dashboard, click **Open Customer Shop** (sidebar) — it opens in its own window.
2. Place an order in the shop.
3. Switch back to the dashboard: a "New online order" toast appears, and revenue, Orders Today,
   Recent Orders, the Orders tab, the revenue chart and stock levels all update automatically.
4. Use **Reorder +50** in Low Stock Alerts or **Add Product** — the shop updates live.
5. Click **Reset Demo Data** (sidebar) before each presentation to start fresh.

## Customizing
| What | Where |
|---|---|
| Real products (name, SKU, category, price, cost, stock, emoji, description) | `SEED_PRODUCTS` in `js/store.js` — then click **Reset Demo Data** |
| Logo | Save your logo as `assets/logo.png` — it replaces the 🌿 icon on both pages automatically |
| Tax rate, low-stock threshold, baseline KPIs | `RR_CONFIG` in `js/store.js` |

## Structure
```
index.html        Admin dashboard (inventory, orders, customers, reports, integrations, settings)
shop.html         Customer storefront with cart + checkout
js/store.js       Shared mock data store (localStorage) used by both pages
vendor/           Offline copies of Tailwind, Chart.js, Font Awesome, Inter & Playfair Display
assets/           Put logo.png here
```

> Data is stored in the browser's localStorage, so it is per-browser. This is a mock — a production
> build would replace `js/store.js` with a real backend, QuickBooks Online API and payment-processor SDKs.

