document.querySelector("#shareForm").addEventListener("submit", async e => {
  e.preventDefault();
  const form=e.currentTarget, btn=form.querySelector('button[type="submit"]');
  const name=document.querySelector("#shareName").value.trim() || "مشاركة وطنية";
  const message=document.querySelector("#shareMessage").value.trim();
  const file=document.querySelector("#shareImage").files[0];
  const notice=document.querySelector("#shareNotice");
  if(file && (!file.type.startsWith("image/") || file.size>2*1024*1024)){
    alert("يرجى اختيار صورة لا يتجاوز حجمها 2 ميجابايت."); return;
  }
  btn.disabled=true; btn.textContent="جارٍ الإرسال...";
  try {
    let imageUrl="";
    const ref=db.collection("participations").doc();
    if(file){
      const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");
      const fileRef=storage.ref(`participation-images/${ref.id}/${safeName}`);
      const snap=await fileRef.put(file,{contentType:file.type});
      imageUrl=await snap.ref.getDownloadURL();
    }
    await ref.set({name,message,imageUrl,status:"pending",createdAt:firebase.firestore.FieldValue.serverTimestamp()});
    form.reset(); notice.hidden=false;
    notice.textContent="وصلت مشاركتك للمراجعة بنجاح، وستظهر في الجدارية بعد اعتمادها.";
  } catch(err) {
    console.error(err); notice.hidden=false;
    notice.textContent="تعذر إرسال المشاركة. تأكدي من إعداد Firestore وStorage وقواعد الحماية، ثم حاولي مجددًا.";
  } finally {btn.disabled=false;btn.textContent="إرسال للمراجعة ♡";}
});