-- Courses module infrastructure:
-- 1. course_lessons was publicly readable in full (including video_url) —
--    anyone with the anon key could pull every lesson's video URL directly
--    from the Supabase REST API, bypassing the app entirely. Replace that
--    policy so only preview lessons, enrolled users, and admins can read a
--    lesson row — this is the actual enrollment gate, enforced at the
--    database, not just in the /learn/[slug] page.
-- 2. A Storage bucket for course thumbnails, mirroring product-images:
--    public read, admin-only write.

drop policy if exists "course_lessons_select_all" on public.course_lessons;

create policy "course_lessons_select_preview_or_enrolled" on public.course_lessons
  for select using (
    is_preview = true
    or exists (
      select 1 from public.enrollments e
      where e.course_id = course_lessons.course_id and e.user_id = auth.uid()
    )
    or exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

insert into storage.buckets (id, name, public)
values ('course-thumbnails', 'course-thumbnails', true)
on conflict (id) do nothing;

create policy "course_thumbnails_public_read"
on storage.objects for select
using (bucket_id = 'course-thumbnails');

create policy "course_thumbnails_admin_insert"
on storage.objects for insert
with check (
  bucket_id = 'course-thumbnails'
  and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "course_thumbnails_admin_update"
on storage.objects for update
using (
  bucket_id = 'course-thumbnails'
  and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "course_thumbnails_admin_delete"
on storage.objects for delete
using (
  bucket_id = 'course-thumbnails'
  and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
