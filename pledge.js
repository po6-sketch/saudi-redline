document.querySelector("#pledgeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector("#participantName").value.trim();
  const agree = document.querySelector("#pledgeAgree").checked;

  if (!name || !agree) {
    alert("اكتبي اسمك ووافقي على التعهد أولًا.");
    return;
  }

  const btn = e.currentTarget.querySelector('button[type="submit"]');
  btn.disabled = true;

  try {
    await db.collection("pledges").add({
      name,
      status: "approved",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    document.querySelector("#certName").textContent = name;

    const certificate = document.querySelector("#certificate");
    certificate.hidden = false;
    certificate.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    sessionStorage.setItem("saudiRedlineLastPledge", name);

    alert("تم تسجيل تعهدك بنجاح! شكرًا لمشاركتك في مبادرة السعودية خط أحمر 🇸🇦");

  } catch (error) {
    console.error("خطأ في حفظ التعهد:", error);
    alert("تعذر حفظ التعهد. يرجى المحاولة مرة أخرى.");
  } finally {
    btn.disabled = false;
  }
});