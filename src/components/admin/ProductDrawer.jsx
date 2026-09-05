"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";
import {
  addProductImage,
  createProduct,
  removeProductImage,
  setPrimaryImage,
  updateProduct,
} from "@/lib/actions/admin/products";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/toast-store";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";
const INPUT =
  "border border-dl-rule bg-dl-chalk text-dl-ink placeholder:text-dl-charcoal outline-none focus:border-dl-signal transition-colors py-2 px-3 font-dl-sans text-dl-body disabled:opacity-50 disabled:cursor-not-allowed";
const LABEL = "block font-dl-sans text-dl-body font-semibold text-dl-ink mb-1";

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
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  // <dialog>.showModal() gives the drawer a native focus trap, Escape-to-close,
  // and focus restored to whatever triggered it on close — same pattern as
  // the storefront's cart drawer. This component is mounted/unmounted by its
  // parent (keyed on product id), so "open" is simply "mounted": show on
  // mount, and let the native "close" event (Escape or our own close()) drive
  // navigation back to the plain list.
  //
  // Focus is moved to the close button explicitly rather than via the
  // `autoFocus` prop: on a client-side navigation into this route (as
  // opposed to a full page load), React's autoFocus and showModal()'s own
  // attribute-scanning fallback don't reliably compose — focus was landing
  // on the invisible backdrop click-catcher instead. Calling .focus() here,
  // in the same effect that opens the dialog, is deterministic regardless
  // of navigation type.
  useEffect(() => {
    dialogRef.current?.showModal();
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function handleNativeClose() {
      router.push("/admin/products");
    }
    dialog.addEventListener("close", handleNativeClose);
    return () => dialog.removeEventListener("close", handleNativeClose);
  }, [router]);

  function close() {
    dialogRef.current?.close();
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

    toast(isEditing ? "Product saved" : "Product created");

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
    <dialog
      ref={dialogRef}
      aria-labelledby="product-drawer-heading"
      className="fixed inset-0 m-0 p-0 w-full h-full max-w-none max-h-none bg-transparent border-0 open:flex justify-end backdrop:bg-dl-ink backdrop:opacity-50 backdrop:backdrop-blur-sm"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full cursor-default"
        onClick={close}
      />

      <div className="relative w-full md:w-[520px] h-full">
        <form
          onSubmit={handleSave}
          className="flex h-full flex-col overflow-y-auto bg-dl-chalk border-l border-dl-rule"
        >
          <div className="px-stack-lg py-stack-md border-b border-dl-rule flex items-center justify-between sticky top-0 bg-dl-chalk z-10">
            <h2
              id="product-drawer-heading"
              className="font-dl-sans text-dl-headline text-dl-ink"
            >
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className={`text-dl-charcoal hover:text-dl-ink transition-colors ${FOCUS_RING}`}
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 px-stack-lg py-stack-lg space-y-stack-lg">
            <div className="space-y-4">
              <label className="block">
                <span className={LABEL}>Product Name</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Signature Hoodie v2"
                  className={`w-full ${INPUT}`}
                />
              </label>
              <label className="block">
                <span className={LABEL}>Description</span>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  className={`w-full ${INPUT}`}
                />
              </label>
              <label className="block">
                <span className={LABEL}>Category</span>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={`w-full ${INPUT} cursor-pointer`}
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
                  <span className={LABEL}>Price (₹)</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="0.00"
                    className={`w-full ${INPUT}`}
                  />
                </label>
                <label className="block">
                  <span className={LABEL}>Compare-at Price (₹)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="0.00"
                    className={`w-full ${INPUT}`}
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-dl-rule">
              <h3 className="font-dl-sans text-dl-body font-semibold text-dl-ink mb-3">
                Variants
              </h3>
              <div className="space-y-2">
                {variants.map((v) => (
                  <div key={v.key} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) =>
                        updateVariant(v.key, "size", e.target.value)
                      }
                      placeholder="Size"
                      className={`w-16 ${INPUT} py-1 px-2`}
                    />
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) =>
                        updateVariant(v.key, "sku", e.target.value)
                      }
                      placeholder="SKU"
                      className={`flex-1 font-dl-mono ${INPUT} py-1 px-2`}
                    />
                    <input
                      type="number"
                      min="0"
                      value={v.stock_quantity}
                      onChange={(e) =>
                        updateVariant(v.key, "stock_quantity", e.target.value)
                      }
                      placeholder="Stock"
                      className={`w-20 tabular-nums ${INPUT} py-1 px-2`}
                    />
                    <button
                      type="button"
                      onClick={() => removeVariantRow(v.key)}
                      aria-label="Remove variant"
                      className={`text-dl-charcoal hover:text-dl-signal-ink transition-colors ${FOCUS_RING}`}
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addVariantRow}
                className={`mt-2 font-dl-sans text-dl-body text-dl-ink hover:underline underline-offset-4 ${FOCUS_RING}`}
              >
                + Add variant
              </button>
            </div>

            <div className="pt-4 border-t border-dl-rule">
              <p className="font-dl-sans text-dl-body font-semibold text-dl-ink mb-2">
                Product Images
              </p>
              {isEditing ? (
                <>
                  <label
                    className={`border border-dashed border-dl-rule p-6 flex flex-col items-center justify-center text-dl-charcoal hover:border-dl-ink hover:text-dl-ink transition-colors cursor-pointer ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <p className="font-dl-sans text-dl-spec">
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
                        className="relative w-20 h-20 bg-dl-sheet border border-dl-rule overflow-hidden"
                      >
                        <Image
                          src={img.url}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                        {img.is_primary ? (
                          <span className="absolute top-1 left-1 bg-dl-ink text-dl-chalk font-dl-mono text-[9px] px-1 py-0.5 uppercase tracking-wide">
                            Primary
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(img.id)}
                            className={`absolute bottom-1 left-1 bg-dl-chalk text-dl-ink font-dl-mono text-[9px] px-1 py-0.5 uppercase tracking-wide ${FOCUS_RING}`}
                          >
                            Set primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          aria-label="Remove image"
                          className={`absolute top-1 right-1 bg-dl-chalk text-dl-charcoal hover:text-dl-signal-ink p-0.5 ${FOCUS_RING}`}
                        >
                          <CloseIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="font-dl-sans text-dl-spec text-dl-charcoal">
                  Save the product first, then come back here to add images.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-dl-rule flex items-start gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={status === "active"}
                onClick={() =>
                  setStatus(status === "active" ? "draft" : "active")
                }
                className={`w-10 h-6 relative shrink-0 transition-colors ${FOCUS_RING} ${status === "active" ? "bg-dl-ink" : "bg-dl-rule"}`}
              >
                <span
                  className={`absolute left-1 top-1 bg-dl-chalk w-4 h-4 transition-transform ${status === "active" ? "translate-x-4" : ""}`}
                />
              </button>
              <div>
                <p className="font-dl-sans text-dl-body font-semibold text-dl-ink">
                  {status === "active" ? "Active" : "Draft"}
                </p>
                <p className="font-dl-sans text-dl-spec text-dl-charcoal">
                  Drafts are hidden from the storefront.
                </p>
              </div>
            </div>

            {error && (
              <p className="border border-dl-signal-ink text-dl-signal-ink font-dl-sans text-dl-body px-3 py-2">
                {error}
              </p>
            )}
          </div>

          <div className="px-stack-lg py-stack-md border-t border-dl-rule flex items-center justify-between sticky bottom-0 bg-dl-chalk">
            <button
              type="button"
              onClick={close}
              className={`font-dl-sans text-dl-body text-dl-charcoal hover:text-dl-ink transition-colors py-2 px-4 ${FOCUS_RING}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`bg-dl-ink text-dl-chalk font-dl-sans text-dl-body font-semibold py-2 px-6 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${FOCUS_RING}`}
            >
              {saving ? "Saving…" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
