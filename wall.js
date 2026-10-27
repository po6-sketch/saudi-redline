const wall=document.querySelector("#wallGrid");
function esc(s){return String(s||"")}
function card(x){
  const c=document.createElement("article"); c.className="wall-card";
  const n=document.createElement("small"); n.textContent=x.name||"مشاركة وطنية";
  const p=document.createElement("p"); p.textContent=x.message||"";
  c.append(n,p);
  if(x.imageUrl){const i=document.createElement("img");i.src=x.imageUrl;i.alt="صورة مشاركة وطنية";i.loading="lazy";c.append(i);}
  return c;
}
(async()=>{
 try{
  const snap=await db.collection("participations").where("status","==","approved").orderBy("createdAt","desc").limit(100).get();
  if(snap.empty){wall.innerHTML='<div class="empty-wall"><span>🌿</span><b>ستزهر الجدارية بالمشاركات المعتمدة</b><p>لا توجد مشاركات معتمدة للعرض حتى الآن.</p></div>';return;}
  snap.forEach(d=>wall.append(card(d.data())));
 }catch(err){
  console.error(err);wall.innerHTML='<div class="empty-wall"><b>تعذر تحميل الجدارية حاليًا</b><p>تحققي من إعدادات Firebase وقواعد القراءة.</p></div>';
 }
})();