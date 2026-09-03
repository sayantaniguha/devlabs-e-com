import Link from "next/link";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { ProductDrawer } from "@/components/admin/ProductDrawer";
import { StockStatusBadge } from "@/components/admin/StockStatusBadge";
import { getAdminProductById, getAdminProducts } from "@/lib/data/admin";
import { getCategories } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/format";

export default async function AdminProductsPage({ searchParams }) {
  const sp = await searchParams;
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getCategories(),
  ]);

  const editId = sp.edit;
  const isNew = sp.new === "1";
  let editProduct = null;
  if (editId) {
    editProduct = await getAdminProductById(editId);
  }

  return (
    <>
      <AdminTopbar
        title="Inventory"
        subtitle="Manage products, variants, and stock."
      />
      <div className="p-margin-desktop space-y-stack-lg max-w-container-max mx-auto w-full">
        <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low dark:bg-primary-container border-b border-outline-variant/50 dark:border-outline/50 font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase tracking-wider">
                  <th className="px-stack-lg py-3 font-semibold">Product</th>
                  <th className="px-stack-lg py-3 font-semibold">Category</th>
                  <th className="px-stack-lg py-3 font-semibold text-right">
                    Price
                  </th>
                  <th className="px-stack-lg py-3 font-semibold">Stock</th>
                  <th className="px-stack-lg py-3 font-semibold">Status</th>
                  <th className="px-stack-lg py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 dark:divide-outline/30 font-body-sm text-body-sm">
                {products.map((product) => {
                  const totalStock = (product.variants ?? []).reduce(
                    (sum, v) => sum + v.stock_quantity,
                    0,
                  );
                  return (
                    <tr key={product.id}>
                      <td className="px-stack-lg py-4 font-semibold text-on-surface dark:text-inverse-on-surface">
                        {product.name}
                      </td>
                      <td className="px-stack-lg py-4 text-on-surface-variant dark:text-on-primary-container">
                        {product.category?.name ?? "—"}
                      </td>
                      <td className="px-stack-lg py-4 font-price-sm text-price-sm text-right">
                        {formatPrice(product.base_price)}
                      </td>
                      <td className="px-stack-lg py-4 text-on-surface-variant dark:text-on-primary-container">
                        {totalStock} units
                      </td>
                      <td className="px-stack-lg py-4">
                        <div className="flex items-center gap-2">
                          <StockStatusBadge totalStock={totalStock} />
                          {product.status === "draft" && (
                            <span className="px-2 py-1 bg-surface-variant text-on-surface-variant text-[10px] font-bold uppercase tracking-wider rounded">
                              Draft
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-stack-lg py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/products?edit=${product.id}`}
                            className="text-on-surface-variant dark:text-on-primary-container hover:text-secondary"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              edit
                            </span>
                          </Link>
                          <DeleteProductButton
                            productId={product.id}
                            productName={product.name}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-stack-lg py-8 text-center text-on-surface-variant dark:text-on-primary-container"
                    >
                      No products yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {(isNew || editProduct) && (
        <ProductDrawer
          key={editProduct?.id ?? "new"}
          product={editProduct}
          categories={categories}
        />
      )}
    </>
  );
}
