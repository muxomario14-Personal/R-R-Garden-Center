# R&R Garden Center — Inventory, POS & Online Shop (Presentation Mock)

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
| Products (name, SKU, category, size `group`/`variant`, `unit`, price, cost, stock, photo) | `SEED_PRODUCTS` in `js/store.js`. Rows marked `priceTBD: true` / `// TODO: confirm price` have placeholder prices. Click **Reset Demo Data** after editing |
| Logo | `assets/logo.png` (dashboard), `assets/logo-green.png` and `assets/logo-white.png` (transparent, used in the shop) |
| Product photos | `assets/products/<slug>.jpg` (square, ~800px), set per product in `SEED_PRODUCTS`; sizes of one item share a photo. Replace a file to use a real shot |
| Shop hero / calculator photo | `assets/hero.jpg`, `assets/yard.jpg` (wide, 16:9) |
| Tax rate, low-stock threshold, baseline KPIs | `RR_CONFIG` in `js/store.js` |

## Structure
```
index.html        Admin dashboard (inventory, orders, customers, reports, integrations, settings)
shop.html         Customer storefront with cart + checkout
js/store.js       Shared mock data store (localStorage) used by both pages
vendor/           Offline copies of Tailwind, Chart.js, Font Awesome, Inter & Playfair Display
assets/           Logo, hero + banner photos, products/ studio shots (AI-generated placeholders)
```

> Data is stored in the browser's localStorage, so it is per-browser. This is a mock — a production
> build would replace `js/store.js` with a real backend, QuickBooks Online API and payment-processor SDKs.

