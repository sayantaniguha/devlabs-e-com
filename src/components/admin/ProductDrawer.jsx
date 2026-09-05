"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  addProductImage,
  createProduct,
  removeProductImage,
  setPrimaryImage,
  updateProduct,
} from "@/lib/actions/admin/products";
import { createClient } from "@/lib/supabase/client";

function emptyVariant() {
  return { key: crypto.randomUUID(), size: "", sku: "", stock_quantity: 0 };
}

function variantsFromProduct(product) {
  if (!product?.variants?.length) return [emptyVariant()];
  return product.variants.map((v) => ({
    key: v.id,
    id: v.id,
    size: v.size ?? "",
    sku: v.sku ?? "",
    stock_quantity: v.stock_quantity,
  }));
}

export function ProductDrawer({ product, categories }) {
  const router = useRouter();
  const isEditing = Boolean(product?.id);

  function close() {
    router.push("/admin/products");
  }

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryId, setCategoryId] = useState(
    product?.category?.id ?? categories[0]?.id ?? "",
  );
  const [basePrice, setBasePrice] = useState(product?.base_price ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compare_at_price ?? "",
  );
  const [status, setStatus] = useState(product?.status ?? "draft");
  const [variants, setVariants] = useState(variantsFromProduct(product));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function updateVariant(key, field, value) {
    setVariants((prev) =>
      prev.map((v) => (v.key === key ? { ...v, [field]: value } : v)),
    );
  }

  function addVariantRow() {
    setVariants((prev) => [...prev, emptyVariant()]);
  }

  function removeVariantRow(key) {
    setVariants((prev) =>
      prev.length > 1 ? prev.filter((v) => v.key !== key) : prev,
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      id: product?.id,
      name,
      description,
      category_id: categoryId,
      base_price: basePrice,
      compare_at_price: compareAtPrice || null,
      status,
      variants: variants.map((v) => ({
        id: v.id,
        size: v.size,
        sku: v.sku,
        stock_quantity: v.stock_quantity,
      })),
    };

    const result = isEditing
      ? await updateProduct(payload)
      : await createProduct(payload);

    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    if (!isEditing) {
      router.push(`/admin/products?edit=${result.id}`);
      router.refresh();
    } else {
      router.refresh();
    }
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !product?.id) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${product.id}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file);
      if (uploadError) {
        setError("Could not upload image.");
        continue;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(path);
      await addProductImage(product.id, publicUrl);
    }
    setUploading(false);
    e.target.value = "";
    router.refresh();
  }

  async function handleRemoveImage(imageId) {
    await removeProductImage(imageId);
    router.refresh();
  }

  async function handleSetPrimary(imageId) {
    await setPrimaryImage(product.id, imageId);
    router.refresh();
  }

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm"
        onClick={close}
      />
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-[520px]">
          <form
            onSubmit={handleSave}
            className="flex h-full flex-col overflow-y-scroll bg-surface-container-lowest dark:bg-inverse-surface shadow-xl"
          >
            <div className="px-stack-lg py-stack-md border-b border-outline-variant dark:border-outline flex items-center justify-between sticky top-0 bg-surface-container-lowest dark:bg-inverse-surface z-10">
              <h2 className="text-headline-md font-headline-md font-semibold text-on-surface dark:text-inverse-on-surface">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="rounded-md text-on-surface-variant dark:text-on-primary-container hover:text-on-surface dark:hover:text-inverse-on-surface"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            <div className="relative flex-1 px-stack-lg py-stack-lg space-y-stack-lg">
              <div className="space-y-4">
                <label className="block">
                  <span className="block text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface mb-1">
                    Product Name
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Signature Hoodie v2"
                    className="w-full rounded-md border border-outline-variant dark:border-outline bg-surface dark:bg-primary-container text-on-surface dark:text-inverse-on-surface focus:ring-2 focus:ring-secondary focus:border-transparent py-2 px-3 text-body-sm"
                  />
                </label>
                <label className="block">
                  <span className="block text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface mb-1">
                    Description
                  </span>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product..."
                    className="w-full rounded-md border border-outline-variant dark:border-outline bg-surface dark:bg-primary-container text-on-surface dark:text-inverse-on-surface focus:ring-2 focus:ring-secondary focus:border-transparent py-2 px-3 text-body-sm"
                  />
                </label>
                <label className="block">
                  <span className="block text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface mb-1">
                    Category
                  </span>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-md border border-outline-variant dark:border-outline bg-surface dark:bg-primary-container text-on-surface dark:text-inverse-on-surface focus:ring-2 focus:ring-secondary focus:border-transparent py-2 px-3 text-body-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface mb-1">
                      Price (₹)
                    </span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-md border border-outline-variant dark:border-outline bg-surface dark:bg-primary-container text-on-surface dark:text-inverse-on-surface focus:ring-2 focus:ring-secondary focus:border-transparent py-2 px-3 text-body-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface mb-1">
                      Compare-at Price (₹)
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-md border border-outline-variant dark:border-outline bg-surface dark:bg-primary-container text-on-surface dark:text-inverse-on-surface focus:ring-2 focus:ring-secondary focus:border-transparent py-2 px-3 text-body-sm"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/50 dark:border-outline/50">
                <h3 className="text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface mb-3">
                  Variants
                </h3>
                <div className="space-y-2">
                  {variants.map((v) => (
                    <div
                      key={v.key}
                      className="flex items-center gap-2 p-2 bg-surface-container-low dark:bg-primary-container rounded-md"
                    >
                      <input
                        type="text"
                        value={v.size}
                        onChange={(e) =>
                          updateVariant(v.key, "size", e.target.value)
                        }
                        placeholder="Size"
                        className="w-16 rounded border border-outline-variant dark:border-outline bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface py-1 px-2 text-xs"
                      />
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) =>
                          updateVariant(v.key, "sku", e.target.value)
                        }
                        placeholder="SKU"
                        className="flex-1 rounded border border-outline-variant dark:border-outline bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface py-1 px-2 text-xs"
                      />
                      <input
                        type="number"
                        min="0"
                        value={v.stock_quantity}
                        onChange={(e) =>
                          updateVariant(v.key, "stock_quantity", e.target.value)
                        }
                        placeholder="Stock"
                        className="w-20 rounded border border-outline-variant dark:border-outline bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface py-1 px-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariantRow(v.key)}
                        aria-label="Remove variant"
                        className="text-on-error-container"
                      >
                        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                          delete
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addVariantRow}
                  className="mt-2 text-body-sm text-secondary font-semibold"
                >
                  + Add variant
                </button>
              </div>

              <div className="pt-4 border-t border-outline-variant/50 dark:border-outline/50">
                <p className="block text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface mb-2">
                  Product Images
                </p>
                {isEditing ? (
                  <>
                    <label className="border-2 border-dashed border-outline-variant dark:border-outline rounded-lg p-6 flex flex-col items-center justify-center text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-low dark:hover:bg-primary-container transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-[32px] mb-2" aria-hidden="true">
                        cloud_upload
                      </span>
                      <p className="text-xs">
                        {uploading
                          ? "Uploading…"
                          : "Click to upload (multiple allowed)"}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploading}
                        onChange={handleUpload}
                        className="hidden"
                      />
                    </label>
                    <div className="flex gap-3 mt-4 flex-wrap">
                      {product.images?.map((img) => (
                        <div
                          key={img.id}
                          className="relative w-20 h-20 rounded-md overflow-hidden border border-outline-variant dark:border-outline"
                        >
                          <Image
                            src={img.url}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                          {img.is_primary ? (
                            <span className="absolute top-1 left-1 bg-secondary text-on-secondary text-[8px] px-1 rounded">
                              Primary
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(img.id)}
                              className="absolute bottom-1 left-1 bg-on-surface/60 text-white text-[8px] px-1 rounded"
                            >
                              Set primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img.id)}
                            aria-label="Remove image"
                            className="absolute top-1 right-1 bg-on-surface/50 text-white rounded-full p-0.5"
                          >
                            <span className="material-symbols-outlined text-[12px]" aria-hidden="true">
                              close
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-on-surface-variant dark:text-on-primary-container">
                    Save the product first, then come back here to add images.
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-outline-variant/50 dark:border-outline/50 flex items-start gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={status === "active"}
                  onClick={() =>
                    setStatus(status === "active" ? "draft" : "active")
                  }
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${status === "active" ? "bg-secondary" : "bg-surface-variant dark:bg-outline"}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${status === "active" ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
                <div>
                  <p className="text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface">
                    {status === "active" ? "Active" : "Draft"}
                  </p>
                  <p className="text-xs text-on-surface-variant dark:text-on-primary-container">
                    Drafts are hidden from the storefront.
                  </p>
                </div>
              </div>

              {error && (
                <p className="text-error text-body-sm font-body-sm">{error}</p>
              )}
            </div>

            <div className="px-stack-lg py-stack-md border-t border-outline-variant dark:border-outline flex items-center justify-between sticky bottom-0 bg-surface-container-lowest dark:bg-inverse-surface">
              <button
                type="button"
                onClick={close}
                className="text-on-surface-variant dark:text-on-primary-container hover:text-on-surface dark:hover:text-inverse-on-surface font-semibold py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-secondary text-on-secondary font-semibold py-2 px-6 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
