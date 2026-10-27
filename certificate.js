const name=sessionStorage.getItem("saudiRedlineLastPledge");
const el=document.querySelector("#certName");
const body=document.querySelector("#certBody");
if(name){el.textContent=name;body.textContent="أن أكون مواطنة واعية، أعتز بوطني وقيادته، وأحافظ على وحدته وأمنه، وأتحقق من المعلومات قبل نشرها، وأسهم في نشر الوعي والمسؤولية.";}