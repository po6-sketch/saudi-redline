document.querySelector("#shareForm").addEventListener("submit", async e => {
  e.preventDefault();

  const form = e.currentTarget;
  const btn = form.querySelector('button[type="submit"]');
  const name =
    document.querySelector("#shareName").value.trim() || "مشاركة وطنية";
  const message = document.querySelector("#shareMessage").value.trim();
  const notice = document.querySelector("#shareNotice");

  if (!message) {
    alert("يرجى كتابة رسالتك الوطنية.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "جارٍ الإرسال...";
  notice.hidden = true;

  try {
    if (typeof db === "undefined") {
      throw new Error("Firestore غير مهيأ.");
    }

    await db.collection("participations").add({
      name: name,
      message: message,
      imageUrl: "",
      status: "pending",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    form.reset();

    notice.hidden = false;
    notice.textContent =
      "وصلت مشاركتك للمراجعة بنجاح، وستظهر في الجدارية بعد اعتمادها.";

  } catch (err) {
    console.error("خطأ في إرسال المشاركة:", err);

    notice.hidden = false;
    notice.textContent =
      "تعذر إرسال المشاركة. تحققي من اتصال الموقع بقاعدة البيانات وقواعد الحماية، ثم حاولي مجددًا.";

  } finally {
    btn.disabled = false;
    btn.textContent = "إرسال للمراجعة ♡";
  }
});