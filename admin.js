const loginForm = document.querySelector("#loginForm");
const notice = document.querySelector("#adminNotice");
const list = document.querySelector("#pendingList");
const logout = document.querySelector("#logoutBtn");

function clearList() {
  list.innerHTML = "";
}

function renderPending() {
  clearList();

  if (!isAdmin()) {
    notice.textContent = "سجّلي الدخول بحساب المسؤولة.";
    return;
  }

  notice.textContent = "جارٍ تحميل المشاركات...";

  db.collection("participations")
    .where("status", "==", "pending")
    .get()
    .then(snapshot => {
      clearList();

      if (snapshot.empty) {
        list.textContent = "لا توجد مشاركات بانتظار المراجعة.";
        notice.textContent = "تم تحميل المشاركات بنجاح.";
        return;
      }

      snapshot.forEach(doc => {
        const x = doc.data();
        const box = document.createElement("div");
        box.className = "pending-item";

        const title = document.createElement("b");
        title.textContent = (x.name || "مشاركة وطنية") + " — بانتظار المراجعة";

        const message = document.createElement("p");
        message.textContent = x.message || "";

        const approve = document.createElement("button");
        approve.textContent = "اعتماد ونشر";
        approve.onclick = () => moderate(doc.id, "approved");

        const reject = document.createElement("button");
        reject.textContent = "رفض";
        reject.className = "reject";
        reject.onclick = () => moderate(doc.id, "rejected");

        box.append(title, message, approve, reject);
        list.appendChild(box);
      });

      notice.textContent = "تم تحميل المشاركات بنجاح.";
    })
    .catch(error => {
      console.error("خطأ تحميل المشاركات:", error);
      notice.textContent = "فشل التحميل: " + error.code + " — " + error.message;
    });
}

async function moderate(id, status) {
  if (!isAdmin()) {
    alert("يجب تسجيل الدخول بحساب المسؤولة.");
    return;
  }

  try {
    await db.collection("participations").doc(id).update({
      status: status,
      reviewedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    renderPending();
  } catch (error) {
    console.error("خطأ تحديث المشاركة:", error);
    alert("تعذر تحديث المشاركة: " + error.code + " — " + error.message);
  }
}

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  notice.textContent = "جارٍ تسجيل الدخول...";

  try {
    const email = document.querySelector("#adminEmail").value.trim();
    const password = document.querySelector("#adminPassword").value;

    await auth.signInWithEmailAndPassword(email, password);

    if (!isAdmin()) {
      await auth.signOut();
      throw new Error("البريد المسجل ليس البريد المحدد للمسؤولة.");
    }

    loginForm.querySelector('button[type="submit"]').hidden = true;
    logout.hidden = false;
    renderPending();

  } catch (error) {
    console.error("خطأ تسجيل الدخول:", error);
    notice.textContent = "خطأ تسجيل الدخول: " + error.code + " — " + error.message;
  }
});

logout.addEventListener("click", async () => {
  await auth.signOut();
  loginForm.querySelector('button[type="submit"]').hidden = false;
  logout.hidden = true;
  clearList();
  notice.textContent = "تم تسجيل الخروج.";
});

auth.onAuthStateChanged(user => {
  if (user && isAdmin()) {
    loginForm.querySelector('button[type="submit"]').hidden = true;
    logout.hidden = false;
    renderPending();
  }
});
