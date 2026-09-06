// Mirrors the account page: ruled header, then a divided nav list.
// Structure matches so the swap does not move the footer.
export default function AccountLoading() {
  return (
    <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl animate-pulse">
      <div className="border-b border-dl-rule pb-stack-md mb-stack-lg">
        <div className="h-8 w-56 bg-dl-sheet" />
        <div className="h-4 w-40 bg-dl-sheet mt-2" />
      </div>
      <div className="border-t border-dl-rule divide-y divide-dl-rule">
        {["courses", "orders", "addresses"].map((row) => (
          <div
            key={row}
            className="py-stack-md px-1 flex items-center justify-between"
          >
            <div className="h-5 w-32 bg-dl-sheet" />
            <div className="h-4 w-4 bg-dl-sheet" />
          </div>
        ))}
      </div>
      <div className="h-10 w-28 bg-dl-sheet mt-stack-lg" />
    </section>
  );
}
