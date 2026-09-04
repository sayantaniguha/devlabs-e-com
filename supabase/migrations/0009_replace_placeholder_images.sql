-- Replaces the placehold.co product images (from 0002_seed_products.sql)
-- with real generated studio product shots, served locally from
-- public/products/. Run once in the Supabase SQL Editor against the
-- already-applied 0002 seed data.
--
-- Numbered 0009 (not 0003) because 0003-0008 already exist, including an
-- uncommitted 0008_local_generated_images.sql that also touches these rows —
-- this migration must run after it so the final urls are these PNGs.

update public.product_images set url = '/products/ship-it-oversized-tee-1.png'
  where product_id = (select id from public.products where slug = 'ship-it-oversized-tee') and position = 0;
update public.product_images set url = '/products/404-not-found-tee-1.png'
  where product_id = (select id from public.products where slug = '404-not-found-tee') and position = 0;
update public.product_images set url = '/products/devlabs-laptop-backpack-1.png'
  where product_id = (select id from public.products where slug = 'devlabs-laptop-backpack') and position = 0;
update public.product_images set url = '/products/insulated-steel-water-bottle-1.png'
  where product_id = (select id from public.products where slug = 'insulated-steel-water-bottle') and position = 0;
update public.product_images set url = '/products/git-commit-ceramic-mug-1.png'
  where product_id = (select id from public.products where slug = 'git-commit-ceramic-mug') and position = 0;
update public.product_images set url = '/products/laptop-sticker-pack-12-1.png'
  where product_id = (select id from public.products where slug = 'laptop-sticker-pack-12') and position = 0;
update public.product_images set url = '/products/xl-desk-mousepad-dark-mode-1.png'
  where product_id = (select id from public.products where slug = 'xl-desk-mousepad-dark-mode') and position = 0;
update public.product_images set url = '/products/terminal-black-hoodie-1.png'
  where product_id = (select id from public.products where slug = 'terminal-black-hoodie') and position = 0;

-- Signature Hoodie keeps its 4-image gallery, now as 4 distinct generated shots.
update public.product_images set url = '/products/devlabs-signature-hoodie-1.png'
  where product_id = (select id from public.products where slug = 'devlabs-signature-hoodie') and position = 0;
update public.product_images set url = '/products/devlabs-signature-hoodie-2.png'
  where product_id = (select id from public.products where slug = 'devlabs-signature-hoodie') and position = 1;
update public.product_images set url = '/products/devlabs-signature-hoodie-3.png'
  where product_id = (select id from public.products where slug = 'devlabs-signature-hoodie') and position = 2;
update public.product_images set url = '/products/devlabs-signature-hoodie-4.png'
  where product_id = (select id from public.products where slug = 'devlabs-signature-hoodie') and position = 3;
