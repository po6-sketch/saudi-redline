function ar(n) {
  return Number(n || 0).toLocaleString("ar-SA");
}

const pc = document.querySelector("#pledgeCount");
const mc = document.querySelector("#messageCount");
const ic = document.querySelector("#imageCount");

// إخفاء عداد الصور إذا كان موجودًا في صفحة قديمة
if (ic) {
  const imageBox = ic.closest("div");
  if (imageBox) imageBox.style.display = "none";
}

if (pc) pc.textContent = "٠";
if (mc) mc.textContent = "٠";

if (typeof db !== "undefined") {

  // تحديث عدد وثائق العهد تلقائيًا
  if (pc) {
    db.collection("pledges").onSnapshot(
      function (snapshot) {
        pc.textContent = ar(snapshot.size);
      },
      function (error) {
        console.error("تعذر قراءة وثائق العهد:", error);
        pc.textContent = "تعذر التحميل";
      }
    );
  }

  // تحديث عدد الرسائل المعتمدة تلقائيًا
  if (mc) {
    db.collection("participations")
      .where("status", "==", "approved")
      .onSnapshot(
        function (snapshot) {
          const count = snapshot.docs.filter(function (doc) {
            return typeof doc.data().message === "string"
              && doc.data().message.trim().length > 0;
          }).length;

          mc.textContent = ar(count);
        },
        function (error) {
          console.error("تعذر قراءة الرسائل المعتمدة:", error);
          mc.textContent = "تعذر التحميل";
        }
      );
  }

} else {
  console.error("Firebase Firestore غير مهيأ.");
}

// القائمة في الجوال
const mt = document.querySelector("#menuToggle");
const nav = document.querySelector("#mainNav");

if (mt && nav) {
  mt.addEventListener("click", function () {
    nav.classList.toggle("open");
  });
}