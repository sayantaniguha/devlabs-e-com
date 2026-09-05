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
        <div className="bg-dl-chalk border border-dl-rule overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dl-sheet border-b border-dl-rule font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide">
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
              <tbody className="divide-y divide-dl-rule font-dl-sans text-dl-body">
                {products.map((product) => {
                  const totalStock = (product.variants ?? []).reduce(
                    (sum, v) => sum + v.stock_quantity,
                    0,
                  );
                  return (
                    <tr key={product.id} className="hover:bg-dl-sheet/50 transition-colors">
                      <td className="px-stack-lg py-3 font-semibold text-dl-ink">
                        {product.name}
                      </td>
                      <td className="px-stack-lg py-3 text-dl-charcoal">
                        {product.category?.name ?? "—"}
                      </td>
                      <td className="px-stack-lg py-3 font-semibold text-dl-ink text-right tabular-nums">
                        {formatPrice(product.base_price)}
                      </td>
                      <td className="px-stack-lg py-3 font-dl-mono text-dl-spec text-dl-charcoal tabular-nums">
                        {totalStock} units
                      </td>
                      <td className="px-stack-lg py-3">
                        <div className="flex items-center gap-2">
                          <StockStatusBadge totalStock={totalStock} />
                          {product.status === "draft" && (
                            <span className="px-2 py-0.5 border border-dl-rule font-dl-mono text-dl-spec text-dl-charcoal uppercase tracking-wide">
                              Draft
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-stack-lg py-3 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            href={`/admin/products?edit=${product.id}`}
                            aria-label={`Edit ${product.name}`}
                            className="font-dl-sans text-dl-body text-dl-ink hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
                          >
                            Edit
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
                      className="px-stack-lg py-8 text-center text-dl-charcoal"
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
