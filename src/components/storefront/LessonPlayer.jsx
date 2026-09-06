"use client";

import { useState } from "react";
import { LockIcon, PlayIcon } from "@/components/ui/icons";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

export function LessonPlayer({ lessons }) {
  const [activeId, setActiveId] = useState(lessons[0]?.id ?? null);
  const active = lessons.find((l) => l.id === activeId) ?? lessons[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
      <div className="md:col-span-2">
        <div className="aspect-video bg-dl-ink border border-dl-rule overflow-hidden">
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
            <div className="w-full h-full flex items-center justify-center text-dl-chalk font-dl-sans text-dl-body">
              No video for this lesson yet.
            </div>
          )}
        </div>
        {/* h2, not h1: the page already carries the course title as its h1. */}
        <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink mt-stack-md">
          {active?.title}
        </h2>
      </div>

      <nav aria-label="Lessons" className="h-fit border border-dl-rule">
        <ol className="flex flex-col divide-y divide-dl-rule">
          {lessons.map((lesson, i) => {
            const isActive = lesson.id === active?.id;
            return (
              <li key={lesson.id} className="flex">
                <button
                  type="button"
                  onClick={() => setActiveId(lesson.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex items-center gap-stack-sm w-full px-stack-md py-stack-sm text-left transition-colors ${FOCUS_RING} ${
                    isActive
                      ? "bg-dl-ink text-dl-chalk"
                      : "bg-dl-chalk text-dl-ink hover:bg-dl-sheet"
                  }`}
                >
                  <span className="shrink-0 flex items-center">
                    {lesson.video_url ? (
                      <PlayIcon className="w-3.5 h-3.5" />
                    ) : (
                      <LockIcon className="w-3.5 h-3.5" />
                    )}
                    <span className="sr-only">
                      {lesson.video_url ? "Playable" : "Locked"}
                    </span>
                  </span>
                  <span className="font-dl-sans text-dl-body">
                    <span
                      className={
                        isActive ? "text-dl-chalk/70" : "text-dl-charcoal"
                      }
                    >
                      {i + 1}.
                    </span>{" "}
                    {lesson.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
