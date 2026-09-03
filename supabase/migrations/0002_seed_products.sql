-- DevLabs e-commerce — seed data for the 9 launch products
-- Run once in the Supabase SQL Editor, after 0001_init.sql, against an
-- otherwise-empty catalog. Plain inserts, not re-run-safe.
--
-- Images use placehold.co as a stand-in (product name as the label, sized
-- 800x800 to match the storefront's square product frames) until admin
-- image upload to Supabase Storage is built — swap these for real Storage
-- URLs at that point.

-- =========================================================================
-- Categories
-- =========================================================================

insert into public.categories (name, slug) values
  ('T-Shirts', 't-shirts'),
  ('Hoodies', 'hoodies'),
  ('Desk', 'desk'),
  ('Bags', 'bags'),
  ('Drinkware', 'drinkware'),
  ('Stickers', 'stickers');

-- =========================================================================
-- Products
-- =========================================================================

insert into public.products (name, slug, description, category_id, base_price, status) values
  (
    '"Ship It" Oversized Tee',
    'ship-it-oversized-tee',
    'An oversized tee in heavyweight cotton with a bold "Ship It" graphic across the back — for when it''s done, not when it''s perfect.',
    (select id from public.categories where slug = 't-shirts'),
    899,
    'active'
  ),
  (
    '"404 Not Found" Tee',
    '404-not-found-tee',
    'A minimalist "404 Not Found" print on a soft black tee. The joke every developer gets.',
    (select id from public.categories where slug = 't-shirts'),
    899,
    'active'
  ),
  (
    'DevLabs Signature Hoodie',
    'devlabs-signature-hoodie',
    'A premium, heavy-weight hoodie designed for long coding sessions. Featuring a minimalist DevLabs chest embroidery and a relaxed technical fit.',
    (select id from public.categories where slug = 'hoodies'),
    2299,
    'active'
  ),
  (
    'Terminal Black Hoodie',
    'terminal-black-hoodie',
    'An all-black hoodie with a subtle tonal "root" embroidery on the chest. Minimalist, developer-focused branding.',
    (select id from public.categories where slug = 'hoodies'),
    2499,
    'active'
  ),
  (
    'XL Desk Mousepad (Dark Mode)',
    'xl-desk-mousepad-dark-mode',
    'An extra-large desk mousepad with a dark, abstract topographical design — a clean backdrop for a developer''s workspace.',
    (select id from public.categories where slug = 'desk'),
    699,
    'active'
  ),
  (
    'DevLabs Laptop Backpack',
    'devlabs-laptop-backpack',
    'A technical, matte-black laptop backpack with weatherproof zippers and minimal branding. Built for the commute and the coffee shop alike.',
    (select id from public.categories where slug = 'bags'),
    2999,
    'active'
  ),
  (
    'Insulated Steel Water Bottle',
    'insulated-steel-water-bottle',
    'A sleek, matte-black insulated steel water bottle with a subtle laser-engraved DevLabs mark.',
    (select id from public.categories where slug = 'drinkware'),
    1199,
    'active'
  ),
  (
    '"git commit" Ceramic Mug',
    'git-commit-ceramic-mug',
    'A clean ceramic mug printed with "git commit" in a crisp monospace font. Desk-essential.',
    (select id from public.categories where slug = 'drinkware'),
    499,
    'active'
  ),
  (
    'Laptop Sticker Pack (12)',
    'laptop-sticker-pack-12',
    'Twelve die-cut, tech-themed laptop stickers — code syntax, logos, and in-jokes for your lid.',
    (select id from public.categories where slug = 'stickers'),
    299,
    'active'
  );

-- =========================================================================
-- Variants (apparel gets S/M/L/XL/XXL; everything else gets one
-- size-less variant that just tracks stock)
-- =========================================================================

-- "Ship It" Oversized Tee — 156 units total (matches admin dashboard mock)
insert into public.product_variants (product_id, size, sku, stock_quantity) values
  ((select id from public.products where slug = 'ship-it-oversized-tee'), 'S',    'DL-TS-001-S',   20),
  ((select id from public.products where slug = 'ship-it-oversized-tee'), 'M',    'DL-TS-001-M',   40),
  ((select id from public.products where slug = 'ship-it-oversized-tee'), 'L',    'DL-TS-001-L',   50),
  ((select id from public.products where slug = 'ship-it-oversized-tee'), 'XL',   'DL-TS-001-XL',  36),
  ((select id from public.products where slug = 'ship-it-oversized-tee'), 'XXL',  'DL-TS-001-XXL', 10);

-- "404 Not Found" Tee — 110 units total
insert into public.product_variants (product_id, size, sku, stock_quantity) values
  ((select id from public.products where slug = '404-not-found-tee'), 'S',    'DL-TS-002-S',   15),
  ((select id from public.products where slug = '404-not-found-tee'), 'M',    'DL-TS-002-M',   30),
  ((select id from public.products where slug = '404-not-found-tee'), 'L',    'DL-TS-002-L',   35),
  ((select id from public.products where slug = '404-not-found-tee'), 'XL',   'DL-TS-002-XL',  25),
  ((select id from public.products where slug = '404-not-found-tee'), 'XXL',  'DL-TS-002-XXL',  5);

-- DevLabs Signature Hoodie — 24 units total, "Low Stock" (matches admin dashboard mock);
-- XXL out of stock, matching the disabled/struck-through XXL button on its product page.
insert into public.product_variants (product_id, size, sku, stock_quantity) values
  ((select id from public.products where slug = 'devlabs-signature-hoodie'), 'S',   'DL-HD-001-S',   2),
  ((select id from public.products where slug = 'devlabs-signature-hoodie'), 'M',   'DL-HD-001-M',   6),
  ((select id from public.products where slug = 'devlabs-signature-hoodie'), 'L',   'DL-HD-001-L',   8),
  ((select id from public.products where slug = 'devlabs-signature-hoodie'), 'XL',  'DL-HD-001-XL',  8),
  ((select id from public.products where slug = 'devlabs-signature-hoodie'), 'XXL', 'DL-HD-001-XXL', 0);

-- Terminal Black Hoodie — 70 units total, "New Arrival"
insert into public.product_variants (product_id, size, sku, stock_quantity) values
  ((select id from public.products where slug = 'terminal-black-hoodie'), 'S',   'DL-HD-002-S',   10),
  ((select id from public.products where slug = 'terminal-black-hoodie'), 'M',   'DL-HD-002-M',   20),
  ((select id from public.products where slug = 'terminal-black-hoodie'), 'L',   'DL-HD-002-L',   20),
  ((select id from public.products where slug = 'terminal-black-hoodie'), 'XL',  'DL-HD-002-XL',  15),
  ((select id from public.products where slug = 'terminal-black-hoodie'), 'XXL', 'DL-HD-002-XXL',  5);

-- Single, size-less variants for non-apparel products
insert into public.product_variants (product_id, sku, stock_quantity) values
  -- 89 units, "In Stock" (matches admin dashboard mock)
  ((select id from public.products where slug = 'xl-desk-mousepad-dark-mode'),   'DL-DK-001', 89),
  -- 0 units, "Out of Stock" / "Sold Out" (matches admin dashboard mock + catalogue badge)
  ((select id from public.products where slug = 'devlabs-laptop-backpack'),     'DL-BG-001',  0),
  ((select id from public.products where slug = 'insulated-steel-water-bottle'),'DL-DW-001', 120),
  ((select id from public.products where slug = 'git-commit-ceramic-mug'),      'DL-DW-002', 200),
  ((select id from public.products where slug = 'laptop-sticker-pack-12'),      'DL-ST-001', 300);

-- =========================================================================
-- Images (placehold.co stand-ins; Signature Hoodie gets 4 to exercise the
-- multi-image gallery, matching its dedicated product-page mockup —
-- every other product gets the single image shown in the catalogue mockup)
-- =========================================================================

insert into public.product_images (product_id, url, position, is_primary) values
  ((select id from public.products where slug = 'ship-it-oversized-tee'),
    'https://placehold.co/800x800/e7eefe/151c27?text=Ship+It+Tee', 0, true),
  ((select id from public.products where slug = '404-not-found-tee'),
    'https://placehold.co/800x800/151c27/f9f9ff?text=404+Not+Found', 0, true),
  ((select id from public.products where slug = 'devlabs-laptop-backpack'),
    'https://placehold.co/800x800/e7eefe/151c27?text=Laptop+Backpack', 0, true),
  ((select id from public.products where slug = 'insulated-steel-water-bottle'),
    'https://placehold.co/800x800/151c27/f9f9ff?text=Water+Bottle', 0, true),
  ((select id from public.products where slug = 'git-commit-ceramic-mug'),
    'https://placehold.co/800x800/e7eefe/151c27?text=git+commit+Mug', 0, true),
  ((select id from public.products where slug = 'laptop-sticker-pack-12'),
    'https://placehold.co/800x800/e7eefe/151c27?text=Sticker+Pack', 0, true),
  ((select id from public.products where slug = 'xl-desk-mousepad-dark-mode'),
    'https://placehold.co/800x800/151c27/f9f9ff?text=Desk+Mousepad', 0, true),
  ((select id from public.products where slug = 'terminal-black-hoodie'),
    'https://placehold.co/800x800/151c27/f9f9ff?text=Terminal+Hoodie', 0, true);

insert into public.product_images (product_id, url, position, is_primary) values
  ((select id from public.products where slug = 'devlabs-signature-hoodie'),
    'https://placehold.co/800x800/e7eefe/151c27?text=Signature+Hoodie', 0, true),
  ((select id from public.products where slug = 'devlabs-signature-hoodie'),
    'https://placehold.co/800x800/e7eefe/151c27?text=Chest+Embroidery', 1, false),
  ((select id from public.products where slug = 'devlabs-signature-hoodie'),
    'https://placehold.co/800x800/e7eefe/151c27?text=Zipper+Detail', 2, false),
  ((select id from public.products where slug = 'devlabs-signature-hoodie'),
    'https://placehold.co/800x800/e7eefe/151c27?text=Lifestyle+Shot', 3, false);
