const loginForm=document.querySelector("#loginForm"),notice=document.querySelector("#adminNotice"),list=document.querySelector("#pendingList"),logout=document.querySelector("#logoutBtn");
function clearList(){list.innerHTML="";}
function renderPending(){
 clearList();
 if(!isAdmin()){notice.textContent="سجّلي الدخول بالبريد المحدد للمسؤولة.";return;}
 notice.textContent="تم تسجيل الدخول. المشاركات بانتظار المراجعة:";
 db.collection("participations").where("status","==","pending").orderBy("createdAt","desc").limit(100).get().then(snap=>{
  clearList();
  if(snap.empty){list.textContent="لا توجد مشاركات بانتظار المراجعة.";return;}
  snap.forEach(doc=>{
   const x=doc.data(),box=document.createElement("div");box.className="pending-item";
   const title=document.createElement("b");title.textContent=(x.name||"مشاركة وطنية")+" — بانتظار المراجعة";
   const p=document.createElement("p");p.textContent=x.message||"";
   box.append(title,p);
   if(x.imageUrl){const img=document.createElement("img");img.src=x.imageUrl;img.alt="الصورة المرفقة";img.style.cssText="max-width:220px;display:block;border-radius:10px";box.append(img);}
   const approve=document.createElement("button");approve.textContent="اعتماد ونشر";approve.onclick=()=>moderate(doc.id,"approved");
   const reject=document.createElement("button");reject.textContent="رفض";reject.className="reject";reject.onclick=()=>moderate(doc.id,"rejected");
   box.append(approve,reject);list.append(box);
  });
 }).catch(err=>{console.error(err);notice.textContent="تعذر تحميل المشاركات. تحققي من بريد المسؤولة وقواعد Firestore.";});
}
async function moderate(id,status){
 if(!isAdmin()){alert("يجب تسجيل الدخول بحساب المسؤولة.");return;}
 try{await db.collection("participations").doc(id).update({status,reviewedAt:firebase.firestore.FieldValue.serverTimestamp()});renderPending();}
 catch(err){console.error(err);alert("تعذر تحديث المشاركة. راجعي قواعد Firestore.");}
}
loginForm.addEventListener("submit",async e=>{
 e.preventDefault();notice.textContent="جارٍ تسجيل الدخول...";
 try{
  const email=document.querySelector("#adminEmail").value.trim();
  await auth.signInWithEmailAndPassword(email,document.querySelector("#adminPassword").value);
  if(!isAdmin()){await auth.signOut();throw new Error("هذا البريد ليس البريد المحدد للمسؤولة داخل firebase-config.js");}
  loginForm.querySelector('button[type="submit"]').hidden=true;logout.hidden=false;renderPending();
 }catch(err){console.error(err);notice.textContent="تعذر تسجيل الدخول. تأكدي من تفعيل Email/Password، وإنشاء حساب المسؤولة، وتطابق البريد في firebase-config.js.";}
});
logout.addEventListener("click",async()=>{await auth.signOut();loginForm.querySelector('button[type="submit"]').hidden=false;logout.hidden=true;clearList();notice.textContent="تم تسجيل الخروج.";});
auth.onAuthStateChanged(()=>{if(isAdmin())renderPending();});
