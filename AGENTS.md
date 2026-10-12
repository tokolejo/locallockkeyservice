<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 🚀 Project Core Guidelines & Multi-Agent Architecture

## 1. ენა და კომუნიკაცია (Communication Policy)
- **მხოლოდ ქართული ენა:** მომხმარებელთან (ჩემთან) ყველა დიალოგი, ახსნა და სტატუსის განახლება უნდა იყოს მკაცრად ქართულ ენაზე. 
- **ლაკონიურობა (Concise Output):** კოდის ცვლილების შემდეგ მომაწოდე მხოლოდ 2-3 პუნქტიანი (Bullet point) შეჯამება — რა შეიცვალა და რატომ. აკრძალულია ვრცელი ტუტორიალები, ზოგადი თეორიები და უცვლელი კოდის ბლოკების ხელახლა დაბეჭდვა, გარდა იმ შემთხვევისა, როცა მომხმარებელი პირდაპირ ითხოვს დეტალურ ახსნას.

## 2. დინამიური სუბაგენტების არქიტექტურა (Dynamic Delegation)
დავალებების შესასრულებლად გამოიყენება სუბაგენტების სისტემა. ბაზისური როლებია:
1. `ui_ux_designer`: ფრონტენდი, დიზაინი, კომპონენტები.
2. `backend_security_architect`: სერვერული ლოგიკა, API, მონაცემთა ბაზები, უსაფრთხოება.
3. `qa_devops`: ტესტირება, build, დეპლოიმენტის აუდიტი.
4. `seo_growth_specialist`: საძიებო სისტემების ოპტიმიზაცია (SEO), Schema.org / JSON-LD, ლოკალური მეტა-მონაცემები, Core Web Vitals და ინდექსაცია.

**🔄 Dynamic Agent Creation (CRITICAL):**
თუ დავალება სპეციფიკურია და სცდება არსებული სუბაგენტების კომპეტენციას (მაგ. SEO ექსპერტი, ანიმაციების დეველოპერი, მონაცემთა ანალიტიკოსი), **მთავარი აგენტი ვალდებულია ჯერ დაარეგისტრიროს/შექმნას ეს ახალი სუბაგენტი (განსაზღვროს მისი სახელი და როლი ამ ფაილში ან სისტემაში) და მხოლოდ ამის შემდეგ გადასცეს მას დავალება.** ეს უზრუნველყოფს ახალი უნარის შენარჩუნებას მომავალი გამოყენებისთვის.

## 3. ტოკენების ოპტიმიზაცია და ხარჯების მართვა (Cost-Optimization)
- **The "Self-Implementation" Rule:** მცირე ცვლილებებისთვის (ტექსტის შესწორება, ფერის შეცვლა, მცირე ლოგიკა < 30 ხაზზე) აკრძალულია სუბაგენტების გამოძახება. შეასრულე დავალება პირდაპირ შენით (`self` როლით). სუბაგენტები გამოიყენე მხოლოდ მასშტაბური ფიჩერებისთვის.
- **Task Batching:** მოერიდე სუბაგენტების მიყოლებით, "პინგ-პონგის" სტილში გამოძახებას. დააჯგუფე დავალებები და გააგზავნე ერთიანი, სრული პრომპტი.
- **Context Payload Minimization:** სუბაგენტის გამოძახებისას გადაეცი მხოლოდ აუცილებელი კონტექსტი (კონკრეტული ფაილის ბილიკები და დავალება). არასდროს გააყოლო მთლიანი ჩატის ისტორია.
- **QA / Build Throttling:** სრული ბილდის გაშვება (`npm run build`) ან ღრმა ტესტირება ხდება მხოლოდ დიდი ეტაპის დასრულებისას ან მომხმარებლის პირდაპირი ბრძანებით.

## 4. Supabase & PostgreSQL უსაფრთხოების სტანდარტები (Security Guardrails)
- **Search Path Invariant:** ყველა PostgreSQL ფუნქციას (`CREATE FUNCTION`) აუცილებლად უნდა ჰქონდეს გაწერილი `SET search_path = ''` (ტრიგერებისთვის) ან `SET search_path = public, auth`, რათა გამოირიცხოს Search Path Hijacking (`function_search_path_mutable`).
- **Private Schema for Internal Helpers:** RLS-ის ან შიდა დამხმარე `SECURITY DEFINER` ფუნქციები (მაგ. `is_admin()`) არასდროს არ უნდა დარჩეს `public` სქემაში. ისინი უნდა განთავსდეს იზოლირებულ სქემაში (მაგ. `app_private`), რათა PostgREST-მა არ გამოაჩინოს საჯარო REST API RPC ენდფოინთებად (`anon_security_definer_function_executable` / `authenticated_security_definer_function_executable`).
- **Append-Only Audit Logs:** აუდიტის და უსაფრთხოების ლოგები (`activity_logs`) უნდა იყოს მკაცრად დაცული `UPDATE` და `DELETE` ოპერაციებისგან ბაზის ტრიგერით.

