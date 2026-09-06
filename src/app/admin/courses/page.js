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
            className="bg-dl-ink text-dl-chalk py-2 px-4 font-dl-sans text-dl-body font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            New Course
          </Link>
        </div>

        <div className="bg-dl-chalk border border-dl-rule overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dl-sheet border-b border-dl-rule font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wider">
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
              <tbody className="divide-y divide-dl-rule font-dl-sans text-dl-body">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-stack-lg py-4 font-semibold text-dl-ink">
                      {course.title}
                    </td>
                    <td className="px-stack-lg py-4 font-dl-sans text-dl-body tabular-nums text-right">
                      {formatPrice(course.price)}
                    </td>
                    <td className="px-stack-lg py-4 text-dl-charcoal">
                      {course.lessons?.length ?? 0}
                    </td>
                    <td className="px-stack-lg py-4">
                      <span
                        className={`px-2 py-0.5 font-dl-sans text-dl-spec uppercase tracking-wide ${
                          course.status === "active"
                            ? "border border-dl-rule text-dl-ink"
                            : "border border-dl-rule text-dl-charcoal"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-stack-lg py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/courses?edit=${course.id}`}
                          aria-label={`Edit ${course.title}`}
                          className="text-dl-charcoal hover:text-dl-signal-ink"
                        >
                          Edit
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
                      className="px-stack-lg py-8 text-center text-dl-charcoal"
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
