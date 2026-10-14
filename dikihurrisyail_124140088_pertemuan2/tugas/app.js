// ITERA Student Dashboard — app.js (ES6+)
// Jalankan via Live Server atau double-click file:// (tanpa bundler / tanpa import).

// ---------- 1. let & const ----------
const STORAGE_KEYS = {
  tasks: "itera_tasks",
  schedules: "itera_schedules",
  notes: "itera_notes",
};

const QUOTE_URL = "https://dummyjson.com/quotes/random";

const DAY_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

// Urutan seminggu penuh untuk hitung jarak hari (jadwal hanya Senin–Sabtu,
// tapi hari ini bisa Minggu, jadi butuh Minggu agar jaraknya benar).
const WEEK_FULL = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const JS_DAY_TO_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const getTodayName = () => JS_DAY_TO_ID[new Date().getDay()];

const timeToMinutes = (t = "") => {
  const m = String(t).match(/(\d{1,2}):(\d{2})/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
};

// Jarak hari dari hari ini ke hari jadwal (0 = hari ini, 1 = besok, dst.)
// Jadwal hari ini yang jamnya sudah lewat dianggap minggu depan (7)
// agar tidak terpilih sebagai "terdekat".
const daysUntil = (day, time = "") => {
  const todayIdx = WEEK_FULL.indexOf(getTodayName());
  const schedIdx = WEEK_FULL.indexOf(day);
  if (schedIdx < 0) return 99;
  let diff = (schedIdx - todayIdx + 7) % 7;
  if (diff === 0) {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    if (timeToMinutes(time) <= nowMin) diff = 7;
  }
  return diff;
};

// ---------- 2. Arrow functions (helpers) ----------
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const loadData = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error("Gagal baca localStorage:", e);
    return fallback;
  }
};

const saveData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const escapeHtml = (text = "") => {
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
};

const fmtDateID = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

let toastTimer;
const toast = (msg, type = "") => {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = `toast ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 2600);
};

// ---------- 5. Classes: TaskItem ----------
class TaskItem {
  constructor({ id = uid(), title = "", course = "", deadline = "", done = false, createdAt = new Date().toISOString() } = {}) {
    this.id = id;
    this.title = title;
    this.course = course;
    this.deadline = deadline;
    this.done = done;
    this.createdAt = createdAt;
  }

  toggle() {
    this.done = !this.done;
    return this;
  }

  get summary() {
    return `${this.title} — ${this.course} (${this.done ? "selesai" : "belum"})`;
  }
}

// ---------- 5. Classes: DashboardApp ----------
class DashboardApp {
  constructor() {
    this.tasks = loadData(STORAGE_KEYS.tasks).map((t) => new TaskItem(t));
    this.schedules = loadData(STORAGE_KEYS.schedules);
    this.notes = loadData(STORAGE_KEYS.notes);
    this.editingTaskId = null;
    this.editingScheduleId = null;
    this.editingNoteId = null;
  }

  init() {
    this.renderToday();
    this.bindEvents();
    this.renderAll();
    this.loadQuote(); // async/await + fetch (DummyJSON)
  }

  renderToday() {
    const now = new Date();
    document.getElementById("todayDate").textContent =
      now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  bindEvents() {
    document.getElementById("taskForm").addEventListener("submit", (e) => this.handleTaskSubmit(e));
    document.getElementById("taskCancelBtn").addEventListener("click", () => this.cancelTaskEdit());
    document.getElementById("taskSearch").addEventListener("input", () => this.renderTasks());
    document.getElementById("taskFilter").addEventListener("change", () => this.renderTasks());

    document.getElementById("scheduleForm").addEventListener("submit", (e) => this.handleScheduleSubmit(e));
    document.getElementById("schCancelBtn").addEventListener("click", () => this.cancelScheduleEdit());

    document.getElementById("noteForm").addEventListener("submit", (e) => this.handleNoteSubmit(e));
    document.getElementById("noteCancelBtn").addEventListener("click", () => this.cancelNoteEdit());

    document.getElementById("quoteRefresh").addEventListener("click", () => this.loadQuote());

    // Event delegation (arrow functions)
    document.getElementById("taskList").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const { action, id } = btn.dataset; // ---------- 6. Destructuring ----------
      if (action === "toggle") this.toggleTask(id);
      if (action === "edit") this.startTaskEdit(id);
      if (action === "delete") this.deleteTask(id);
    });

    document.getElementById("scheduleList").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const { action, id } = btn.dataset;
      if (action === "edit") this.startScheduleEdit(id);
      if (action === "delete") this.deleteSchedule(id);
    });

    document.getElementById("noteList").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const { action, id } = btn.dataset;
      if (action === "edit") this.startNoteEdit(id);
      if (action === "delete") this.deleteNote(id);
    });
  }

  persist() {
    saveData(STORAGE_KEYS.tasks, this.tasks);
    saveData(STORAGE_KEYS.schedules, this.schedules);
    saveData(STORAGE_KEYS.notes, this.notes);
  }

  // ----- TASKS -----
  validateTask(title, course, deadline) {
    let ok = true;
    const setErr = (id, msg) => (document.getElementById(id).textContent = msg);
    setErr("taskTitleError", ""); setErr("taskCourseError", ""); setErr("taskDeadlineError", "");
    if (!title.trim()) { setErr("taskTitleError", "Judul wajib diisi."); ok = false; }
    else if (title.trim().length < 3) { setErr("taskTitleError", "Minimal 3 karakter."); ok = false; }
    if (!course.trim()) { setErr("taskCourseError", "Mata kuliah wajib diisi."); ok = false; }
    if (!deadline) { setErr("taskDeadlineError", "Deadline wajib diisi."); ok = false; }
    return ok;
  }

  handleTaskSubmit(e) {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value;
    const course = document.getElementById("taskCourse").value;
    const deadline = document.getElementById("taskDeadline").value;
    if (!this.validateTask(title, course, deadline)) return;

    if (this.editingTaskId) {
      // ---------- 7. Spread operator (update imutabel) ----------
      this.tasks = this.tasks.map((t) =>
        t.id === this.editingTaskId ? new TaskItem({ ...t, title: title.trim(), course: course.trim(), deadline }) : t
      );
      toast("Tugas berhasil diperbarui.", "success");
    } else {
      const item = new TaskItem({ title: title.trim(), course: course.trim(), deadline });
      this.tasks = [...this.tasks, item]; // spread: tambah tanpa mutasi langsung
      toast("Tugas berhasil ditambahkan.", "success");
    }
    this.persist();
    this.cancelTaskEdit(true);
    this.renderAll();
  }

  startTaskEdit(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;
    const { title, course, deadline } = task; // destructuring
    document.getElementById("taskId").value = task.id;
    document.getElementById("taskTitle").value = title;
    document.getElementById("taskCourse").value = course;
    document.getElementById("taskDeadline").value = deadline;
    this.editingTaskId = id;
    document.getElementById("taskSubmitBtn").textContent = "💾 Simpan Perubahan";
    document.getElementById("taskCancelBtn").classList.remove("hidden");
    document.getElementById("taskTitle").focus();
  }

  cancelTaskEdit(silent = false) {
    this.editingTaskId = null;
    if (!silent) document.getElementById("taskForm").reset();
    else document.getElementById("taskForm").reset();
    document.getElementById("taskSubmitBtn").textContent = "+ Tambah Tugas";
    document.getElementById("taskCancelBtn").classList.add("hidden");
  }

  toggleTask(id) {
    this.tasks = this.tasks.map((t) => (t.id === id ? t.toggle() : t));
    this.persist();
    this.renderAll();
  }

  deleteTask(id) {
    if (!confirm("Hapus tugas ini?")) return;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    if (this.editingTaskId === id) this.cancelTaskEdit();
    this.persist();
    this.renderAll();
    toast("Tugas dihapus.", "success");
  }

  // ----- SCHEDULES -----
  handleScheduleSubmit(e) {
    e.preventDefault();
    const course = document.getElementById("schCourse").value.trim();
    const day = document.getElementById("schDay").value;
    const time = document.getElementById("schTime").value;
    const room = document.getElementById("schRoom").value.trim();
    if (!course || !time) { toast("Mata kuliah & waktu wajib diisi.", "error"); return; }

    if (this.editingScheduleId) {
      this.schedules = this.schedules.map((s) =>
        s.id === this.editingScheduleId ? { ...s, course, day, time, room } : s
      );
      toast("Jadwal diperbarui.", "success");
    } else {
      this.schedules = [...this.schedules, { id: uid(), course, day, time, room }];
      toast("Jadwal ditambahkan.", "success");
    }
    this.persist();
    this.cancelScheduleEdit();
    this.renderAll();
  }

  startScheduleEdit(id) {
    const s = this.schedules.find((x) => x.id === id);
    if (!s) return;
    const { course, day, time, room } = s;
    document.getElementById("schCourse").value = course;
    document.getElementById("schDay").value = day;
    document.getElementById("schTime").value = time;
    document.getElementById("schRoom").value = room;
    this.editingScheduleId = id;
    document.getElementById("schSubmitBtn").textContent = "💾 Simpan Perubahan";
    document.getElementById("schCancelBtn").classList.remove("hidden");
  }

  cancelScheduleEdit() {
    this.editingScheduleId = null;
    document.getElementById("scheduleForm").reset();
    document.getElementById("schSubmitBtn").textContent = "+ Tambah Jadwal";
    document.getElementById("schCancelBtn").classList.add("hidden");
  }

  deleteSchedule(id) {
    if (!confirm("Hapus jadwal ini?")) return;
    this.schedules = this.schedules.filter((s) => s.id !== id);
    if (this.editingScheduleId === id) this.cancelScheduleEdit();
    this.persist();
    this.renderAll();
    toast("Jadwal dihapus.", "success");
  }

  // ----- NOTES -----
  handleNoteSubmit(e) {
    e.preventDefault();
    const title = document.getElementById("noteTitle").value.trim();
    const content = document.getElementById("noteContent").value.trim();
    if (!title || !content) { toast("Judul & isi catatan wajib diisi.", "error"); return; }

    if (this.editingNoteId) {
      this.notes = this.notes.map((n) =>
        n.id === this.editingNoteId ? { ...n, title, content, updatedAt: new Date().toISOString() } : n
      );
      toast("Catatan diperbarui.", "success");
    } else {
      this.notes = [...this.notes, { id: uid(), title, content, updatedAt: new Date().toISOString() }];
      toast("Catatan ditambahkan.", "success");
    }
    this.persist();
    this.cancelNoteEdit();
    this.renderAll();
  }

  startNoteEdit(id) {
    const n = this.notes.find((x) => x.id === id);
    if (!n) return;
    document.getElementById("noteTitle").value = n.title;
    document.getElementById("noteContent").value = n.content;
    this.editingNoteId = id;
    document.getElementById("noteSubmitBtn").textContent = "💾 Simpan Perubahan";
    document.getElementById("noteCancelBtn").classList.remove("hidden");
  }

  cancelNoteEdit() {
    this.editingNoteId = null;
    document.getElementById("noteForm").reset();
    document.getElementById("noteSubmitBtn").textContent = "+ Tambah Catatan";
    document.getElementById("noteCancelBtn").classList.add("hidden");
  }

  deleteNote(id) {
    if (!confirm("Hapus catatan ini?")) return;
    this.notes = this.notes.filter((n) => n.id !== id);
    if (this.editingNoteId === id) this.cancelNoteEdit();
    this.persist();
    this.renderAll();
    toast("Catatan dihapus.", "success");
  }

  // ----- RENDER -----
  renderAll() {
    this.renderSummary();
    this.renderTasks();
    this.renderSchedules();
    this.renderNotes();
  }

  renderSummary() {
    const total = this.tasks.length;
    const done = this.tasks.filter((t) => t.done).length;
    const todo = total - done;
    document.getElementById("statTotal").textContent = total;
    document.getElementById("statDone").textContent = done;
    document.getElementById("statTodo").textContent = todo;
    document.getElementById("taskCount").textContent = total;
    document.getElementById("scheduleCount").textContent = this.schedules.length;
    document.getElementById("noteCount").textContent = this.notes.length;

    // Jadwal terdekat relatif ke hari ini (reallife), bukan selalu Senin.
    const el = document.getElementById("statSchedule");
    if (!this.schedules.length) {
      el.textContent = "-";
      return;
    }
    const ranked = [...this.schedules]
      .map((s) => ({ s, diff: daysUntil(s.day, s.time) }))
      .sort((a, b) => a.diff - b.diff || a.s.time.localeCompare(b.s.time));
    const { s: nearest, diff } = ranked[0];
    if (diff === 0) el.textContent = `${nearest.course} • Hari ini ${nearest.time}`;
    else if (diff === 1) el.textContent = `${nearest.course} • Besok (${nearest.day}) ${nearest.time}`;
    else if (diff === 7) el.textContent = `${nearest.course} • ${nearest.day} ${nearest.time} (minggu depan)`;
    else el.textContent = `${nearest.course} • ${nearest.day} ${nearest.time} (${diff} hari lagi)`;
  }

  renderTasks() {
    const q = document.getElementById("taskSearch").value.toLowerCase();
    const f = document.getElementById("taskFilter").value;
    const box = document.getElementById("taskList");

    const filtered = this.tasks
      .filter((t) => `${t.title} ${t.course}`.toLowerCase().includes(q))
      .filter((t) => (f === "done" ? t.done : f === "todo" ? !t.done : true))
      .sort((a, b) => a.deadline.localeCompare(b.deadline));

    if (!filtered.length) {
      box.innerHTML = `<div class="empty">Belum ada tugas. Tambahkan tugas pertama Anda.</div>`;
      return;
    }

    // ---------- 3. Template literals ----------
    box.innerHTML = filtered
      .map(({ id, title, course, deadline, done }) => `
        <div class="item ${done ? "done" : ""}">
          <div>
            <p class="item-title">${escapeHtml(title)}</p>
            <p class="item-meta">${escapeHtml(course)} • ⏰ ${fmtDateID(deadline)} • ${done ? "Selesai" : "Belum"}</p>
          </div>
          <div class="item-actions">
            <button class="btn btn-check" data-action="toggle" data-id="${id}" type="button">${done ? "↩ Batal" : "✓ Selesai"}</button>
            <button class="btn btn-edit" data-action="edit" data-id="${id}" type="button">Edit</button>
            <button class="btn btn-danger" data-action="delete" data-id="${id}" type="button">Hapus</button>
          </div>
        </div>`).join("");
  }

  renderSchedules() {
    const box = document.getElementById("scheduleList");
    if (!this.schedules.length) {
      box.innerHTML = `<div class="empty">Belum ada jadwal.</div>`;
      return;
    }
    // Urutkan dari yang terdekat dengan hari ini (reallife),
    // bukan selalu dari Senin.
    const sorted = [...this.schedules].sort(
      (a, b) => daysUntil(a.day, a.time) - daysUntil(b.day, b.time) || a.time.localeCompare(b.time)
    );
    box.innerHTML = sorted
      .map(({ id, course, day, time, room }) => {
        const diff = daysUntil(day, time);
        const tag = diff === 0 ? " • Hari ini" : diff === 1 ? " • Besok" : "";
        return `
        <div class="item">
          <div>
            <p class="item-title">${escapeHtml(course)}</p>
            <p class="item-meta">${escapeHtml(day)} • ${escapeHtml(time)} • 📍 ${escapeHtml(room || "-")}${tag}</p>
          </div>
          <div class="item-actions">
            <button class="btn btn-edit" data-action="edit" data-id="${id}" type="button">Edit</button>
            <button class="btn btn-danger" data-action="delete" data-id="${id}" type="button">Hapus</button>
          </div>
        </div>`;
      }).join("");
  }

  renderNotes() {
    const box = document.getElementById("noteList");
    if (!this.notes.length) {
      box.innerHTML = `<div class="empty">Belum ada catatan.</div>`;
      return;
    }
    box.innerHTML = this.notes
      .map(({ id, title, content, updatedAt }) => `
        <div class="note">
          <h4>${escapeHtml(title)}</h4>
          <small>${new Date(updatedAt).toLocaleString("id-ID")}</small>
          <p>${escapeHtml(content)}</p>
          <div class="item-actions">
            <button class="btn btn-edit" data-action="edit" data-id="${id}" type="button">Edit</button>
            <button class="btn btn-danger" data-action="delete" data-id="${id}" type="button">Hapus</button>
          </div>
        </div>`).join("");
  }

  // ---------- 4. Async/await + Fetch API (DummyJSON Quotes + terjemahan ID) ----------
  async loadQuote() {
    const textEl = document.getElementById("quoteText");
    const authorEl = document.getElementById("quoteAuthor");
    const metaEl = document.getElementById("quoteMeta");
    try {
      textEl.textContent = "Memuat kutipan...";
      authorEl.textContent = "-";
      const res = await fetch(QUOTE_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const { quote, author, id } = data; // destructuring

      // Coba terjemahkan ke Bahasa Indonesia (gratis, tanpa key).
      // Kalau gagal (limit/offline), tampilkan versi asli Inggris.
      try {
        textEl.textContent = "Menerjemahkan ke Bahasa Indonesia...";
        const tr = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(quote)}&langpair=en|id`
        );
        if (!tr.ok) throw new Error(`Translate HTTP ${tr.status}`);
        const trData = await tr.json();
        const translated = trData?.responseData?.translatedText;
        if (!translated || /QUERY LENGTH LIMIT|INVALID/i.test(translated)) {
          throw new Error("Terjemahan tidak tersedia");
        }
        textEl.textContent = `"${translated}"`;
        authorEl.textContent = `- ${author}`;
        metaEl.textContent = `quotes #${id} • diterjemahkan ke ID`;
      } catch (trErr) {
        console.warn("Terjemahan gagal, pakai teks asli:", trErr);
        textEl.textContent = `"${quote}"`;
        authorEl.textContent = `- ${author} (teks asli Inggris)`;
        metaEl.textContent = `quotes #${id} • dummyjson`;
      }
    } catch (err) {
      console.error("Kutipan gagal:", err);
      textEl.textContent = '"Belajar adalah investasi terbaik untuk masa depan."';
      authorEl.textContent = "- Motivasi Belajar (offline)";
      metaEl.textContent = "Periksa internet lalu klik Muat lain";
      toast("Gagal memuat kutipan. Mode offline.", "error");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new DashboardApp();
  app.init();
  window.__dashboardApp = app; // untuk inspeksi/demo
});
