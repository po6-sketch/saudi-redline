document.querySelector("#pledgeForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const name=document.querySelector("#participantName").value.trim();
 if(!name||!document.querySelector("#pledgeAgree").checked)return;
 const btn=e.currentTarget.querySelector('button[type="submit"]');btn.disabled=true;
 try{
  await db.collection("pledges").add({name,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
  document.querySelector("#certName").textContent=name;
  document.querySelector("#certificate").hidden=false;
  document.querySelector("#certificate").scrollIntoView({behavior:"smooth",block:"center"});
  sessionStorage.setItem("saudiRedlineLastPledge",name);
 }catch(err){
  console.error(err);
  // Allow the pledge document to be created for printing even if cloud write is not configured.
  document.querySelector("#certName").textContent=name;
  document.querySelector("#certificate").hidden=false;
  alert("تم تجهيز الوثيقة للطباعة، لكن تعذر حفظها سحابيًا. تحققي من قواعد Firestore.");
 }finally{btn.disabled=false;}
});