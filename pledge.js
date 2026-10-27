document.querySelector("#pledgeForm").addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.querySelector("#participantName").value.trim();
  if (!name || !document.querySelector("#pledgeAgree").checked) return;

  const btn = e.currentTarget.querySelector('button[type="submit"]');
  btn.disabled = true;

  try {
    await db.collection("pledges").add({
      name: name,
      status: "approved",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    document.querySelector("#certName").textContent = name;
    document.querySelector("#certificate").hidden = false;
    document.querySelector("#certificate").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    sessionStorage.setItem("saudiRedlineLastPledge", name);

    alert("تم تسجيل تعهدك بنجاح! شكرًا لمشاركتك في مبادرة السعودية خط أحمر 🇸🇦");

  } catch (err) {
    console.error("خطأ في حفظ التعهد:", err);
    alert("تعذر حفظ التعهد. يرجى المحاولة مرة أخرى.");
  } finally {
    btn.disabled = false;
  }
});