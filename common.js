function ar(n){return Number(n||0).toLocaleString("ar-SA")}
const pc=document.querySelector("#pledgeCount"),mc=document.querySelector("#messageCount"),ic=document.querySelector("#imageCount");
if(pc)pc.textContent="—";if(mc)mc.textContent="—";if(ic)ic.textContent="—";
if(pc||mc||ic){
 Promise.all([
  db.collection("pledges").get(),
  db.collection("participations").where("status","==","approved").get()
 ]).then(([pledges,approved])=>{
  if(pc)pc.textContent=ar(pledges.size);
  if(mc)mc.textContent=ar(approved.docs.filter(d=>!!d.data().message).length);
  if(ic)ic.textContent=ar(approved.docs.filter(d=>!!d.data().imageUrl).length);
 }).catch(err=>console.warn("Stats not available until Firestore rules are configured",err));
}
const mt=document.querySelector("#menuToggle"),nav=document.querySelector("#mainNav");
if(mt&&nav)mt.addEventListener("click",()=>nav.classList.toggle("open"));