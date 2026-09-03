"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCourse, updateCourse } from "@/lib/actions/admin/courses";
import { createClient } from "@/lib/supabase/client";

function emptyLesson() {
  return {
    key: crypto.randomUUID(),
    title: "",
    video_url: "",
    is_preview: false,
  };
}

function lessonsFromCourse(course) {
  if (!course?.lessons?.length) return [emptyLesson()];
  return course.lessons.map((l) => ({
    key: l.id,
    id: l.id,
    title: l.title,
    video_url: l.video_url ?? "",
    is_preview: l.is_preview,
  }));
}

export function CourseDrawer({ course }) {
  const router = useRouter();
  const isEditing = Boolean(course?.id);

  function close() {
    router.push("/admin/courses");
  }

  const [title, setTitle] = useState(course?.title ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [category, setCategory] = useState(course?.category ?? "");
  const [level, setLevel] = useState(course?.level ?? "");
  const [durationHours, setDurationHours] = useState(
    course?.duration_hours ?? "",
  );
  const [price, setPrice] = useState(course?.price ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    course?.compare_at_price ?? "",
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnail_url ?? "");
  const [status, setStatus] = useState(course?.status ?? "draft");
  const [lessons, setLessons] = useState(lessonsFromCourse(course));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function updateLesson(key, field, value) {
    setLessons((prev) =>
      prev.map((l) => (l.key === key ? { ...l, [field]: value } : l)),
    );
  }

  function addLessonRow() {
    setLessons((prev) => [...prev, emptyLesson()]);
  }

  function removeLessonRow(key) {
    setLessons((prev) =>
      prev.length > 1 ? prev.filter((l) => l.key !== key) : prev,
    );
  }

  async function handleThumbnailUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("course-thumbnails")
      .upload(path, file);
    if (uploadError) {
      setError("Could not upload thumbnail.");
      setUploading(false);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("course-thumbnails").getPublicUrl(path);
    setThumbnailUrl(publicUrl);
    setUploading(false);
    e.target.value = "";
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      id: course?.id,
      title,
      description,
      category: category || null,
      level: level || null,
      duration_hours: durationHours || null,
      price,
      compare_at_price: compareAtPrice || null,
      thumbnail_url: thumbnailUrl || null,
      status,
      lessons: lessons.map((l) => ({
        id: l.id,
        title: l.title,
        video_url: l.video_url,
        is_preview: l.is_preview,
      })),
    };

    const result = isEditing
      ? await updateCourse(payload)
      : await createCourse(payload);

    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    if (!isEditing) {
      router.push(`/admin/courses?edit=${result.id}`);
      router.refresh();
    } else {
      router.refresh();
    }
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
                {isEditing ? "Edit Course" : "Add New Course"}
              </h2>
              <button
                type="button"
                onClick={close}
                className="rounded-md text-on-surface-variant dark:text-on-primary-container hover:text-on-surface dark:hover:text-inverse-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="relative flex-1 px-stack-lg py-stack-lg space-y-stack-lg">
              <div className="space-y-4">
                <label className="block">
                  <span className="block text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface mb-1">
                    Course Title
                  </span>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. React Fundamentals"
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
                    placeholder="Describe the course..."
                    className="w-full rounded-md border border-outline-variant dark:border-outline bg-surface dark:bg-primary-container text-on-surface dark:text-inverse-on-surface focus:ring-2 focus:ring-secondary focus:border-transparent py-2 px-3 text-body-sm"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface mb-1">
                      Category
                    </span>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Web Development"
                      className="w-full rounded-md border border-outline-variant dark:border-outline bg-surface dark:bg-primary-container text-on-surface dark:text-inverse-on-surface focus:ring-2 focus:ring-secondary focus:border-transparent py-2 px-3 text-body-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface mb-1">
                      Level
                    </span>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full rounded-md border border-outline-variant dark:border-outline bg-surface dark:bg-primary-container text-on-surface dark:text-inverse-on-surface focus:ring-2 focus:ring-secondary focus:border-transparent py-2 px-3 text-body-sm"
                    >
                      <option value="">—</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Beginner–Advanced">
                        Beginner–Advanced
                      </option>
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="block text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface mb-1">
                    Duration (hours)
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    placeholder="e.g. 22"
                    className="w-full rounded-md border border-outline-variant dark:border-outline bg-surface dark:bg-primary-container text-on-surface dark:text-inverse-on-surface focus:ring-2 focus:ring-secondary focus:border-transparent py-2 px-3 text-body-sm"
                  />
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
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
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
                <p className="block text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface mb-2">
                  Thumbnail
                </p>
                <div className="flex items-center gap-4">
                  {thumbnailUrl && (
                    <div className="relative w-24 aspect-video rounded-md overflow-hidden border border-outline-variant dark:border-outline shrink-0">
                      <Image
                        src={thumbnailUrl}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <label className="flex-1 border-2 border-dashed border-outline-variant dark:border-outline rounded-lg p-4 flex flex-col items-center justify-center text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-low dark:hover:bg-primary-container transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[24px] mb-1">
                      cloud_upload
                    </span>
                    <p className="text-xs">
                      {uploading ? "Uploading…" : "Click to upload"}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/50 dark:border-outline/50">
                <h3 className="text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface mb-3">
                  Lessons
                </h3>
                <div className="space-y-2">
                  {lessons.map((l) => (
                    <div
                      key={l.key}
                      className="flex flex-col gap-2 p-2 bg-surface-container-low dark:bg-primary-container rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={l.title}
                          onChange={(e) =>
                            updateLesson(l.key, "title", e.target.value)
                          }
                          placeholder="Lesson title"
                          className="flex-1 rounded border border-outline-variant dark:border-outline bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface py-1 px-2 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeLessonRow(l.key)}
                          className="text-on-error-container"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={l.video_url}
                          onChange={(e) =>
                            updateLesson(l.key, "video_url", e.target.value)
                          }
                          placeholder="Video URL"
                          className="flex-1 rounded border border-outline-variant dark:border-outline bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface py-1 px-2 text-xs"
                        />
                        <label className="flex items-center gap-1 text-xs text-on-surface-variant dark:text-on-primary-container shrink-0">
                          <input
                            type="checkbox"
                            checked={l.is_preview}
                            onChange={(e) =>
                              updateLesson(
                                l.key,
                                "is_preview",
                                e.target.checked,
                              )
                            }
                          />
                          Free preview
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addLessonRow}
                  className="mt-2 text-body-sm text-secondary font-semibold"
                >
                  + Add lesson
                </button>
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
                {saving ? "Saving…" : "Save Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
