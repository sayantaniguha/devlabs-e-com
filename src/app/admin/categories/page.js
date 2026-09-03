import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";
import { createCategory, updateCategory } from "@/lib/actions/admin/categories";
import { getCategories } from "@/lib/data/products";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <AdminTopbar
        title="Categories"
        subtitle="Organize products into shop categories."
      />
      <div className="p-margin-desktop space-y-stack-lg max-w-2xl mx-auto w-full">
        <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg shadow-sm p-stack-lg">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface dark:text-inverse-on-surface mb-stack-md">
            Add Category
          </h2>
          <CategoryForm action={createCategory} />
        </div>

        <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg shadow-sm p-stack-lg space-y-stack-md">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface dark:text-inverse-on-surface">
            Categories
          </h2>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <div className="flex-1">
                <CategoryForm action={updateCategory} category={category} />
              </div>
              <DeleteCategoryButton
                categoryId={category.id}
                categoryName={category.name}
              />
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-body-sm text-on-surface-variant dark:text-on-primary-container">
              No categories yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
