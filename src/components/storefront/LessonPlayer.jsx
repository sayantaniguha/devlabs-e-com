"use client";

import { useState } from "react";

export function LessonPlayer({ lessons }) {
  const [activeId, setActiveId] = useState(lessons[0]?.id ?? null);
  const active = lessons.find((l) => l.id === activeId) ?? lessons[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
      <div className="md:col-span-2">
        <div className="aspect-video bg-primary rounded-lg overflow-hidden">
          {active?.video_url ? (
            // biome-ignore lint/a11y/useMediaCaption: instructor-uploaded lesson videos have no caption track
            <video
              key={active.id}
              src={active.video_url}
              controls
              autoPlay
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-inverse-on-surface font-body-sm text-body-sm">
              No video for this lesson yet.
            </div>
          )}
        </div>
        <h1 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface mt-stack-md">
          {active?.title}
        </h1>
      </div>

      <div className="flex flex-col divide-y divide-outline-variant dark:divide-outline border border-outline-variant dark:border-outline rounded-lg overflow-hidden h-fit">
        {lessons.map((lesson, i) => (
          <button
            key={lesson.id}
            type="button"
            onClick={() => setActiveId(lesson.id)}
            className={`flex items-center gap-stack-sm px-stack-md py-stack-sm text-left transition-colors ${
              lesson.id === active?.id
                ? "bg-secondary text-on-secondary"
                : "bg-surface-container-lowest dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-primary-container"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              {lesson.video_url ? "play_circle" : "lock"}
            </span>
            <span className="font-body-sm text-body-sm">
              {i + 1}. {lesson.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
