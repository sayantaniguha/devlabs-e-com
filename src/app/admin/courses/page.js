import Link from "next/link";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { CourseDrawer } from "@/components/admin/CourseDrawer";
import { DeleteCourseButton } from "@/components/admin/DeleteCourseButton";
import { getAdminCourseById, getAdminCourses } from "@/lib/data/admin";
import { formatPrice } from "@/lib/utils/format";

export default async function AdminCoursesPage({ searchParams }) {
  const sp = await searchParams;
  const courses = await getAdminCourses();

  const editId = sp.edit;
  const isNew = sp.new === "1";
  let editCourse = null;
  if (editId) {
    editCourse = await getAdminCourseById(editId);
  }

  return (
    <>
      <AdminTopbar title="Courses" subtitle="Manage courses and lessons." />
      <div className="p-margin-desktop space-y-stack-lg max-w-container-max mx-auto w-full">
        <div className="flex justify-end">
          <Link
            href="/admin/courses?new=1"
            className="bg-secondary text-on-secondary py-2 px-4 rounded-md font-body-sm text-body-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Course
          </Link>
        </div>

        <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low dark:bg-primary-container border-b border-outline-variant/50 dark:border-outline/50 font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase tracking-wider">
                  <th className="px-stack-lg py-3 font-semibold">Course</th>
                  <th className="px-stack-lg py-3 font-semibold text-right">
                    Price
                  </th>
                  <th className="px-stack-lg py-3 font-semibold">Lessons</th>
                  <th className="px-stack-lg py-3 font-semibold">Status</th>
                  <th className="px-stack-lg py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 dark:divide-outline/30 font-body-sm text-body-sm">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-stack-lg py-4 font-semibold text-on-surface dark:text-inverse-on-surface">
                      {course.title}
                    </td>
                    <td className="px-stack-lg py-4 font-price-sm text-price-sm text-right">
                      {formatPrice(course.price)}
                    </td>
                    <td className="px-stack-lg py-4 text-on-surface-variant dark:text-on-primary-container">
                      {course.lessons?.length ?? 0}
                    </td>
                    <td className="px-stack-lg py-4">
                      <span
                        className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                          course.status === "active"
                            ? "bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant"
                            : "bg-surface-variant text-on-surface-variant"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-stack-lg py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/courses?edit=${course.id}`}
                          className="text-on-surface-variant dark:text-on-primary-container hover:text-secondary"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit
                          </span>
                        </Link>
                        <DeleteCourseButton
                          courseId={course.id}
                          courseName={course.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-stack-lg py-8 text-center text-on-surface-variant dark:text-on-primary-container"
                    >
                      No courses yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {(isNew || editCourse) && (
        <CourseDrawer key={editCourse?.id ?? "new"} course={editCourse} />
      )}
    </>
  );
}
