"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CloseIcon } from "@/components/ui/icons";
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
        className="absolute inset-0 bg-dl-ink/50"
        onClick={close}
      />
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-[520px]">
          <form
            onSubmit={handleSave}
            className="flex h-full flex-col overflow-y-scroll bg-dl-chalk"
          >
            <div className="px-stack-lg py-stack-md border-b border-dl-rule flex items-center justify-between sticky top-0 bg-dl-chalk z-10">
              <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink">
                {isEditing ? "Edit Course" : "Add New Course"}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="text-dl-charcoal hover:text-dl-ink transition-colors"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="relative flex-1 px-stack-lg py-stack-lg space-y-stack-lg">
              <div className="space-y-4">
                <label className="block">
                  <span className="block font-dl-sans text-dl-body font-semibold text-dl-ink mb-1">
                    Course Title
                  </span>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. React Fundamentals"
                    className="w-full border border-dl-rule bg-dl-chalk text-dl-ink focus:border-dl-signal py-2 px-3 font-dl-sans text-dl-body"
                  />
                </label>
                <label className="block">
                  <span className="block font-dl-sans text-dl-body font-semibold text-dl-ink mb-1">
                    Description
                  </span>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the course..."
                    className="w-full border border-dl-rule bg-dl-chalk text-dl-ink focus:border-dl-signal py-2 px-3 font-dl-sans text-dl-body"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block font-dl-sans text-dl-body font-semibold text-dl-ink mb-1">
                      Category
                    </span>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Web Development"
                      className="w-full border border-dl-rule bg-dl-chalk text-dl-ink focus:border-dl-signal py-2 px-3 font-dl-sans text-dl-body"
                    />
                  </label>
                  <label className="block">
                    <span className="block font-dl-sans text-dl-body font-semibold text-dl-ink mb-1">
                      Level
                    </span>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full border border-dl-rule bg-dl-chalk text-dl-ink focus:border-dl-signal py-2 px-3 font-dl-sans text-dl-body"
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
                  <span className="block font-dl-sans text-dl-body font-semibold text-dl-ink mb-1">
                    Duration (hours)
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    placeholder="e.g. 22"
                    className="w-full border border-dl-rule bg-dl-chalk text-dl-ink focus:border-dl-signal py-2 px-3 font-dl-sans text-dl-body"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block font-dl-sans text-dl-body font-semibold text-dl-ink mb-1">
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
                      className="w-full border border-dl-rule bg-dl-chalk text-dl-ink focus:border-dl-signal py-2 px-3 font-dl-sans text-dl-body"
                    />
                  </label>
                  <label className="block">
                    <span className="block font-dl-sans text-dl-body font-semibold text-dl-ink mb-1">
                      Compare-at Price (₹)
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full border border-dl-rule bg-dl-chalk text-dl-ink focus:border-dl-signal py-2 px-3 font-dl-sans text-dl-body"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-dl-rule">
                <p className="block font-dl-sans text-dl-body font-semibold text-dl-ink mb-2">
                  Thumbnail
                </p>
                <div className="flex items-center gap-4">
                  {thumbnailUrl && (
                    <div className="relative w-24 aspect-video overflow-hidden border border-dl-rule shrink-0">
                      <Image
                        src={thumbnailUrl}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <label className="flex-1 border-2 border-dashed border-dl-rule p-4 flex flex-col items-center justify-center text-dl-charcoal hover:bg-dl-sheet transition-colors cursor-pointer">
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

              <div className="pt-4 border-t border-dl-rule">
                <h3 className="font-dl-sans text-dl-body font-semibold text-dl-ink mb-3">
                  Lessons
                </h3>
                <div className="space-y-2">
                  {lessons.map((l) => (
                    <div
                      key={l.key}
                      className="flex flex-col gap-2 p-2 bg-dl-sheet"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={l.title}
                          onChange={(e) =>
                            updateLesson(l.key, "title", e.target.value)
                          }
                          placeholder="Lesson title"
                          className="flex-1 border border-dl-rule bg-dl-chalk text-dl-ink py-1 px-2 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeLessonRow(l.key)}
                          aria-label="Remove lesson"
                          className="text-dl-signal-ink"
                        ></button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={l.video_url}
                          onChange={(e) =>
                            updateLesson(l.key, "video_url", e.target.value)
                          }
                          placeholder="Video URL"
                          className="flex-1 border border-dl-rule bg-dl-chalk text-dl-ink py-1 px-2 text-xs"
                        />
                        <label className="flex items-center gap-1 text-xs text-dl-charcoal shrink-0">
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
                  className="mt-2 font-dl-sans text-dl-body text-dl-ink font-semibold"
                >
                  + Add lesson
                </button>
              </div>

              <div className="pt-4 border-t border-dl-rule flex items-start gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={status === "active"}
                  onClick={() =>
                    setStatus(status === "active" ? "draft" : "active")
                  }
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out ${status === "active" ? "bg-dl-ink" : "bg-dl-rule"}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform bg-dl-chalk transition duration-200 ease-in-out ${status === "active" ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
                <div>
                  <p className="font-dl-sans text-dl-body font-semibold text-dl-ink">
                    {status === "active" ? "Active" : "Draft"}
                  </p>
                  <p className="text-xs text-dl-charcoal">
                    Drafts are hidden from the storefront.
                  </p>
                </div>
              </div>

              {error && (
                <p className="text-dl-signal-ink font-dl-sans text-dl-body">
                  {error}
                </p>
              )}
            </div>

            <div className="px-stack-lg py-stack-md border-t border-dl-rule flex items-center justify-between sticky bottom-0 bg-dl-chalk">
              <button
                type="button"
                onClick={close}
                className="text-dl-charcoal hover:text-dl-ink font-semibold py-2 px-4 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-dl-ink text-dl-chalk font-semibold py-2 px-6 hover:opacity-90 transition-opacity disabled:opacity-60"
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
