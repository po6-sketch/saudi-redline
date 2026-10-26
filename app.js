const STORAGE_KEY = "saudiRedlineDemo_v1";
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
let state = loadState();

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { pledges: [], submissions: [], approved: [] }; }
  catch { return { pledges: [], submissions: [], approved: [] }; }
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderStats(); renderWall(); renderPending();
}
function arabicNumber(n) { return Number(n).toLocaleString("ar-SA"); }
function renderStats() {
  $("#pledgeCount").textContent = arabicNumber(state.pledges.length);
  $("#messageCount").textContent = arabicNumber(state.approved.filter(x => x.message).length);
  $("#imageCount").textContent = arabicNumber(state.approved.filter(x => x.imageData).length);
}
function showDialog(title, text) {
  $("#dialogTitle").textContent = title; $("#dialogText").textContent = text;
  const d = $("#infoDialog");
  if (typeof d.showModal === "function") d.showModal(); else alert(title + "\n" + text);
}
$("#dialogClose").addEventListener("click", () => $("#infoDialog").close());
$("#dialogOk").addEventListener("click", () => $("#infoDialog").close());
$("#sealButton").addEventListener("click", () => {
  document.querySelector("#pledge").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => $("#participantName").focus({preventScroll:true}), 450);
});
$("#menuToggle").addEventListener("click", () => $("#mainNav").classList.toggle("open"));
$$('#mainNav a').forEach(a => a.addEventListener('click', () => $("#mainNav").classList.remove("open")));

$("#pledgeForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#participantName").value.trim();
  if (!name || !$("#pledgeAgree").checked) return;
  const item = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), name, date: new Date().toISOString() };
  state.pledges.push(item); saveState();
  $("#certName").textContent = name;
  $("#certificate").hidden = false;
  $("#certificate").scrollIntoView({behavior:"smooth", block:"center"});
});

$$(".rumor-card").forEach(card => card.addEventListener("click", () => {
  $$(".rumor-card").forEach(c => c.classList.remove("active")); card.classList.add("active");
  $("#rumorDetail").innerHTML = "";
  const title = document.createElement("strong"); title.textContent = card.dataset.title;
  const p = document.createElement("p"); p.textContent = card.dataset.detail;
  $("#rumorDetail").append(title,p);
}));

$("#shareForm").addEventListener("submit", async e => {
  e.preventDefault();
  const message = $("#shareMessage").value.trim();
  if (!message) return;
  const file = $("#shareImage").files[0];
  if (file && file.size > 2 * 1024 * 1024) {
    $("#shareNotice").hidden = false;
    $("#shareNotice").textContent = "حجم الصورة أكبر من 2 ميجابايت. اختاري صورة أصغر في النسخة التجريبية.";
    return;
  }
  let imageData = "";
  if (file) imageData = await new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file);
  });
  state.submissions.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: $("#shareName").value.trim() || "مشاركة وطنية",
    message, imageData, date: new Date().toISOString(), status: "pending"
  });
  saveState();
  $("#shareForm").reset();
  $("#shareNotice").hidden = false;
  $("#shareNotice").textContent = "وصلت مشاركتك إلى قائمة المراجعة على هذا الجهاز. ستظهر في الجدارية بعد اعتمادها.";
});

function renderWall() {
  const wall = $("#wallGrid"); wall.innerHTML = "";
  if (!state.approved.length) {
    const empty = document.createElement("div"); empty.className = "empty-wall";
    empty.innerHTML = '<span>🌿</span><b>ستزهر الجدارية بالمشاركات المعتمدة</b><p>لا توجد مشاركات معتمدة للعرض حتى الآن.</p>';
    wall.append(empty); return;
  }
  state.approved.slice().reverse().forEach(item => {
    const card = document.createElement("article"); card.className = "wall-card";
    const name = document.createElement("small"); name.textContent = item.name;
    const msg = document.createElement("p"); msg.textContent = item.message;
    card.append(name,msg);
    if (item.imageData) { const img = document.createElement("img"); img.src = item.imageData; img.alt = "صورة مشاركة وطنية"; card.append(img); }
    wall.append(card);
  });
}
function renderPending() {
  const list = $("#pendingList"); list.innerHTML = "";
  const pending = state.submissions.filter(x => x.status === "pending");
  if (!pending.length) { const p = document.createElement("p"); p.className = "form-note"; p.textContent = "لا توجد مشاركات بانتظار المراجعة."; list.append(p); return; }
  pending.forEach(item => {
    const box = document.createElement("div"); box.className = "pending-item";
    const name = document.createElement("b"); name.textContent = item.name + " — بانتظار المراجعة";
    const msg = document.createElement("p"); msg.textContent = item.message;
    box.append(name,msg);
    if (item.imageData) { const img = document.createElement("img"); img.src = item.imageData; img.alt = "الصورة المرفقة"; img.style.cssText = "max-width:220px;display:block;border-radius:10px"; box.append(img); }
    const approve = document.createElement("button"); approve.textContent = "اعتماد ونشر"; approve.addEventListener("click", () => { item.status = "approved"; state.approved.push(item); saveState(); });
    const reject = document.createElement("button"); reject.textContent = "رفض"; reject.className = "reject"; reject.addEventListener("click", () => { item.status = "rejected"; saveState(); });
    box.append(approve,reject); list.append(box);
  });
}
$("#clearLocal").addEventListener("click", () => {
  if (confirm("هل تريدين مسح جميع البيانات التجريبية المخزنة على هذا الجهاز؟")) {
    state = { pledges: [], submissions: [], approved: [] }; localStorage.removeItem(STORAGE_KEY);
    $("#certificate").hidden = true; $("#shareNotice").hidden = true; saveState();
  }
});
renderStats(); renderWall(); renderPending();
