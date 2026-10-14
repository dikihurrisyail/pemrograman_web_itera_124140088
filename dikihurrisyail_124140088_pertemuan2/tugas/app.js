// ITERA Student Dashboard — app.js (ES6+)
// Jalankan via Live Server atau double-click file:// (tanpa bundler / tanpa import).

// ---------- 1. let & const ----------
const STORAGE_KEYS = {
  tasks: "itera_tasks",
  schedules: "itera_schedules",
  notes: "itera_notes",
};

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true&timezone=Asia%2FJakarta";

const DAY_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

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

const weatherCodeToID = (code) => {
  const map = {
    0: ["Cerah", "☀️"], 1: ["Cerah Berawan", "🌤️"], 2: ["Berawan", "⛅"],
    3: ["Mendung", "☁️"], 45: ["Berkabut", "🌫️"], 48: ["Berkabut", "🌫️"],
    51: ["Gerimis Ringan", "🌦️"], 53: ["Gerimis", "🌦️"], 55: ["Gerimis", "🌦️"],
    56: ["Gerimis Dingin", "🌦️"], 57: ["Gerimis Dingin", "🌦️"],
    61: ["Hujan Ringan", "🌧️"], 63: ["Hujan", "🌧️"], 65: ["Hujan Lebat", "⛈️"],
    66: ["Hujan Ringan", "🌧️"], 67: ["Hujan", "🌧️"],
    71: ["Hujan Ringan", "🌧️"], 73: ["Hujan", "🌧️"], 75: ["Hujan Lebat", "🌧️"],
    80: ["Hujan Lokal", "🌧️"], 81: ["Hujan Lokal", "🌧️"], 82: ["Hujan Deras", "⛈️"],
    95: ["Badai Petir", "⛈️"], 96: ["Badai Petir", "⛈️"], 99: ["Badai Petir", "⛈️"],
  };
  return map[code] || ["Berawan", "⛅"];
};

// Format waktu API (Asia/Jakarta, "YYYY-MM-DDTHH:mm") jadi "14/10/2026, 09.30 WIB"
// tanpa lewat `new Date()` agar tidak geser ke UTC.
const fmtWIB = (timeStr = "") => {
  const m = String(timeStr).match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return timeStr;
  const [, y, mo, d, h, mi] = m;
  return `${d}/${mo}/${y}, ${h}.${mi} WIB`;
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
    this.loadWeather(); // async/await + fetch
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

    document.getElementById("weatherRefresh").addEventListener("click", () => this.loadWeather());

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

    const sorted = [...this.schedules].sort(
      (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day) || a.time.localeCompare(b.time)
    );
    document.getElementById("statSchedule").textContent =
      sorted.length ? `${sorted[0].course} • ${sorted[0].day} ${sorted[0].time}` : "-";
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
    const sorted = [...this.schedules].sort(
      (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day) || a.time.localeCompare(b.time)
    );
    box.innerHTML = sorted
      .map(({ id, course, day, time, room }) => `
        <div class="item">
          <div>
            <p class="item-title">${escapeHtml(course)}</p>
            <p class="item-meta">${escapeHtml(day)} • ${escapeHtml(time)} • 📍 ${escapeHtml(room || "-")}</p>
          </div>
          <div class="item-actions">
            <button class="btn btn-edit" data-action="edit" data-id="${id}" type="button">Edit</button>
            <button class="btn btn-danger" data-action="delete" data-id="${id}" type="button">Hapus</button>
          </div>
        </div>`).join("");
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

  // ---------- 4. Async/await + Fetch API ----------
  async loadWeather() {
    const tempEl = document.getElementById("weatherTemp");
    const descEl = document.getElementById("weatherDesc");
    const metaEl = document.getElementById("weatherMeta");
    const iconEl = document.getElementById("weatherIcon");
    try {
      descEl.textContent = "Memuat cuaca ITERA...";
      const res = await fetch(WEATHER_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const { temperature, weathercode, windspeed, time } = data.current_weather; // destructuring
      const [label, icon] = weatherCodeToID(weathercode);
      tempEl.textContent = `${temperature}°C`;
      descEl.textContent = `${label} — ITERA, Lampung Selatan`;
      iconEl.textContent = icon;
      metaEl.textContent = `💨 ${windspeed} km/j • ${fmtWIB(time)}`;
    } catch (err) {
      console.error("Cuaca gagal:", err);
      tempEl.textContent = "--°C";
      descEl.textContent = "Cuaca offline — data lokal tetap bisa dipakai.";
      metaEl.textContent = "Periksa internet lalu klik Refresh";
      toast("Gagal memuat cuaca. Mode offline.", "error");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new DashboardApp();
  app.init();
  window.__dashboardApp = app; // untuk inspeksi/demo
});
