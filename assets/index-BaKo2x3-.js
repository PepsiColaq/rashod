(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function a(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(n){if(n.ep)return;n.ep=!0;const l=a(n);fetch(n.href,l)}})();const A="0903-ПД3",U=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджуа",fullName:"Боджуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакшуева",fullName:"Шакшуева Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],M={present:{label:"Есть (+)",short:"+"},absent:{label:"Нет (−)",short:"−"},duty:{label:"Наряд (Н)",short:"Н"},event:{label:"Мероприятие (МП)",short:"МП"},excused:{label:"Отпущен (О)",short:"О"},sick:{label:"Болен (Б)",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка (С)",short:"С"},empty:{label:"Не распознано",short:"?"}},ee=["present","absent","duty","event"];function I(r){const e=r.group||A,a=r.people||[],i=a.length,n=a.filter(u=>u.event||u.mark==="event"),l=a.filter(u=>!(u.event||u.mark==="event")&&u.mark==="duty"),o=a.filter(u=>!(u.event||u.mark==="event")&&u.mark!=="duty"&&(u.mark==="absent"||u.mark==="excused"||u.mark==="sick"||u.mark==="unknown"||u.mark==="unauthorized")),m=i-o.length-n.length-l.length,f=[`Расход группы ${e}:`,`По списку: ${i}`,`На лицо: ${m}`];if(o.length){f.push(`Отсутствуют: ${o.length}`);for(const u of o){const c=(u.reason||"").trim();f.push(c?`${u.surname} (${c})`:u.surname)}}else f.push("Отсутствуют: 0");f.push(""),f.push(`Мероприятие: ${n.length}`);for(const u of n)f.push(u.surname);f.push(""),f.push(`Наряд: ${l.length}`);for(const u of l)f.push(u.surname);return f.join(`
`).trimEnd()}const B="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function te(){const r=new Date,e=r.getFullYear(),a=String(r.getMonth()+1).padStart(2,"0"),i=String(r.getDate()).padStart(2,"0");return`${e}-${a}-${i}`}function K(r){const e=String(r).split("-");return Number(e[2]||0)}function O(r){const[e,a,i]=String(r).split("-");return!e||!a||!i?r:`${i}.${a}.${e}`}function ae(r){return new Promise((e,a)=>{const i=new FileReader;i.onload=()=>e(i.result),i.onerror=()=>a(new Error("Не удалось прочитать файл")),i.readAsDataURL(r)})}function G(r){return new Promise((e,a)=>{const i=new Image;i.onload=()=>e(i),i.onerror=()=>a(new Error("Битый файл изображения")),i.src=r})}function H(r,e,a,i){const n=(i*e+a)*4;return(r[n]+r[n+1]+r[n+2])/3}function ne(r,e,a,i){const n=Math.floor(a*.25),l=Math.floor(a*.55),o=new Float32Array(e),m=new Float32Array(e);for(let d=0;d<e;d++){let s=0,b=0;const p=l-n;for(let w=n;w<l;w++){const x=H(r,e,d,w);s+=x,b+=x*x}const S=s/p;o[d]=S,m[d]=Math.sqrt(Math.max(0,b/p-S*S))}const f=new Float32Array(e);for(let d=0;d<e;d++)f[d]=o[d]>140&&o[d]<165&&m[d]<48?1:0;const u=new Float32Array(e);for(let d=0;d<e;d++){let s=0,b=0;for(let p=-3;p<=3;p++){const S=d+p;S>=0&&S<e&&(s+=f[S],b++)}u[d]=s/b>.5?1:0}const c=[];for(let d=0;d<e;)if(u[d]){let s=d;for(;s<e&&u[s];)s++;s-d>15&&c.push([d,s]),d=s}else d++;const y=e/6,v=Number(i)||15;let h,g;if(c.length&&v>=25){const d=c.reduce((b,p)=>p[1]-p[0]>b[1]-b[0]?p:b),s=(v-28)*y;h=Math.floor(d[1]+y*.08+s),g=Math.floor(d[1]+y*.92+s)}else v<=10?(h=Math.floor(e*.05),g=Math.floor(e*.28)):v<=20?(h=Math.floor(e*.28),g=Math.floor(e*.52)):(h=Math.floor(e*.38),g=Math.floor(e*.58));return h=Math.max(0,h),g=Math.min(e,Math.max(h+24,g)),[h,g]}function re(r,e,a,i,n){const l=new Float32Array(a),o=new Float32Array(a);for(let c=0;c<a;c++){let y=255,v=0;const h=n-i;for(let g=i;g<n;g++){const d=H(r,e,g,c);d<y&&(y=d),v+=d}l[c]=Math.max(0,150-y),o[c]=v/h}const m=new Float32Array(a);for(let c=0;c<a;c++){let y=0,v=0;for(let h=-2;h<=2;h++){const g=c+h;g>=0&&g<a&&(y+=l[g],v++)}m[c]=y/v}let f=0;for(let c=0;c<a;c++)if(o[c]>140){f=c;break}const u=[];for(let c=f+15;c<a-40;c++)m[c]>8&&m[c]>=m[c-1]&&m[c]>=m[c+1]&&(!u.length||c-u[u.length-1]>34)&&u.push(c);return{peaks:u,paper0:f}}function se(r,e,a,i,n,l){const{peaks:o,paper0:m}=re(r,e,a,i,n);if(o.length<3){const y=m+100,h=(a-80-y)/l;return Array.from({length:l},(g,d)=>Math.round(y+(d+.5)*h))}const f=o.length>=l+2?o[2]:o[0];let u=45,c=null;for(let y=38;y<=52;y+=.25){let v=0,h=0;for(let s=0;s<l;s++){const b=f+s*y;let p=1/0;for(const S of o){const w=Math.abs(S-b);w<p&&(p=w)}p<y*.35&&v++,h+=p}const g=v,d=-h;(!c||g>c.hits||g===c.hits&&d>c.dist)&&(c={hits:g,dist:d},u=y)}return Array.from({length:l},(y,v)=>Math.round(f+v*u))}async function oe(r,e,a,i=.88){const n=await G(r),l=n.width,o=n.height,m=Number(e)||15,f=m<=10?.32:m<=20?.5:.82,u=Math.floor(l*f),c=Math.floor(o*.05),y=Math.ceil(o*.95),v=l-u,h=y-c,g=3,d=document.createElement("canvas");d.width=Math.max(1,v*g),d.height=Math.max(1,h*g);const s=d.getContext("2d",{willReadFrequently:!0});s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",s.drawImage(n,u,c,v,h,0,0,d.width,d.height);const b=d.width,p=d.height,S=s.getImageData(0,0,b,p),{data:w}=S,[x,L]=ne(w,b,p,m),N=se(w,b,p,x,L,a);s.fillStyle="#fff",s.fillRect(0,0,x,p),s.fillRect(L,0,b-L,p);for(let q=0;q<N.length;q++){const T=N[q],D=Math.max(0,x-52),z=T-14;s.fillStyle="#ffe600",s.strokeStyle="#c80000",s.lineWidth=2,s.fillRect(D,z,x-4-D,28),s.strokeRect(D+.5,z+.5,x-4-D-1,27),s.fillStyle="#c80000",s.font="bold 22px Arial, sans-serif",s.textBaseline="middle",s.fillText(String(q+1),Math.max(4,x-46),T)}const j=N.length>1?Math.max(14,Math.round(Math.abs(N[1]-N[0])/2)):20,F=Math.max(0,N[0]-j-8),V=Math.min(p,N[N.length-1]+j+8),P=Math.max(0,x-55),Z=Math.min(b,L+8),C=document.createElement("canvas");return C.width=Math.max(1,Z-P),C.height=Math.max(1,V-F),C.getContext("2d").drawImage(d,P,F,C.width,C.height,0,0,C.width,C.height),C.toDataURL("image/jpeg",i)}async function le(r,e=3e3,a=.92){const i=await ae(r),n=await G(i),l=Math.min(1,e/Math.max(n.width,n.height)),o=Math.round(n.width*l),m=Math.round(n.height*l),f=document.createElement("canvas");f.width=o,f.height=m,f.getContext("2d").drawImage(n,0,0,o,m);const u=Math.floor(o*.35),c=document.createElement("canvas");return c.width=o-u,c.height=m,c.getContext("2d").drawImage(f,u,0,o-u,m,0,0,o-u,m),{full:f.toDataURL("image/jpeg",a),crop:c.toDataURL("image/jpeg",a)}}function X(){return U.map(r=>({surname:r.surname,fullName:r.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const R="rashod_access_code";function ce(){try{return sessionStorage.getItem(R)||""}catch{return""}}function J(r){try{r?sessionStorage.setItem(R,r):sessionStorage.removeItem(R)}catch{}}const t={accessCode:ce(),unlocked:!1,authBusy:!1,authError:"",date:te(),imageDataUrl:"",imageCropDataUrl:"",people:X(),busy:!1,message:"",error:!1,usage:null},k=document.querySelector("#app");function $(r,e=!1){t.message=r,t.error=e,E()}function Q(r){return B?`${B}${r}`:`/api${r}`}function ie(){return Q("/recognize")}function ue(){return Q("/auth")}async function Y(r){const e=String(r||"").trim();if(!e){t.authError="Введи код доступа",E();return}t.authBusy=!0,t.authError="",E();try{const a=await fetch(ue(),{method:"POST",headers:{"Content-Type":"application/json","X-Access-Code":e},body:JSON.stringify({accessCode:e})}),i=await a.json().catch(()=>({}));if(!a.ok||!i.ok)throw new Error(i.error||"Неверный код");t.accessCode=e,t.unlocked=!0,J(e)}catch(a){t.unlocked=!1,t.authError=a.message||String(a)}finally{t.authBusy=!1,E()}}function W(){t.unlocked=!1,t.accessCode="",J(""),t.authError="",E()}async function de(){var e,a,i;if(!t.unlocked||!t.accessCode){$("Сначала введи код доступа",!0);return}if(!t.imageDataUrl){$("Сначала выбери фото листа",!0);return}const r=K(t.date);if(!r){$("Укажи дату",!0);return}t.busy=!0,$("Читаю знаки по клеткам (1× Pro)…");try{const n=await oe(t.imageDataUrl,r,U.length),l=await fetch(ie(),{method:"POST",headers:{"Content-Type":"application/json","X-Access-Code":t.accessCode},body:JSON.stringify({imageBase64:t.imageDataUrl,imageCropBase64:t.imageCropDataUrl||void 0,imageDayCropBase64:n,mimeType:"image/jpeg",day:r,group:A,roster:U,accessCode:t.accessCode})}),o=await l.json().catch(()=>({}));if(l.status===401)throw W(),new Error(o.error||"Код доступа не принят");if(!l.ok||!o.ok){const s=o.detail?` (${typeof o.detail=="string"?o.detail:""})`:"";throw new Error((o.error||`Ошибка API (${l.status})`)+s)}const m=((e=o.result)==null?void 0:e.students)||[],f=new Map(m.map(s=>[String(s.surname||"").trim().toLowerCase(),s])),u=s=>{const b=String(s??"").trim().toLowerCase().replaceAll(".","");return{present:"present","+":"present",plus:"present",absent:"absent","-":"absent","−":"absent",duty:"duty",н:"duty",h:"duty",event:"event",мп:"event",mp:"event",ип:"event",мероприятие:"event",excused:"excused",о:"excused",sick:"sick",б:"sick",unknown:"unknown",unauthorized:"unauthorized",empty:"empty"}[b]||(M[b]?b:null)};t.people=U.map((s,b)=>{const p=f.get(s.surname.toLowerCase())||m[b]||{},S=u(p.mark)||(M[p.mark]?p.mark:"empty");return{surname:s.surname,fullName:s.fullName,mark:S,reason:"",event:S==="event"||!!p.event,confidence:typeof(p==null?void 0:p.confidence)=="number"?p.confidence:null,disagreed:!!p.disagreed}}),t.usage=o.usage||null;const c=t.people.filter(s=>s.mark==="present").length,y=t.people.filter(s=>["absent","excused","sick","unknown","unauthorized"].includes(s.mark)).length,v=t.people.filter(s=>s.mark==="duty").length,h=t.people.filter(s=>s.mark==="empty").length,g=t.people.filter(s=>s.disagreed).length,d=((a=o.usage)==null?void 0:a.cost_rub)??((i=o.usage)==null?void 0:i.cost);if(h===t.people.length)$("Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.",!0);else{const s=["Готово (2× Pro)",`+${c}`,`нет ${y}`,`наряд ${v}`];h&&s.push(`пусто ${h}`),g&&s.push(`спорных ${g} — проверь`),d!=null&&s.push(`~${Number(d).toFixed(2)} ₽`),$(s.join(". ")+". Допиши причины при необходимости.")}}catch(n){$(n.message||String(n),!0)}finally{t.busy=!1,E()}}async function _(r){if(r)try{t.busy=!0,$("Готовлю фото…");const e=await le(r);t.imageDataUrl=e.full,t.imageCropDataUrl=e.crop,$("Фото готово — нажми «Распознать»")}catch(e){$(e.message||String(e),!0)}finally{t.busy=!1,E()}}async function me(){const r=I({group:A,dateLabel:O(t.date),people:t.people});try{await navigator.clipboard.writeText(r),$("Текст скопирован")}catch{$("Не удалось скопировать — выдели вручную",!0)}}function fe(){k.innerHTML=`
    <section class="card gate">
      <h1>Расход</h1>
      <p class="sub">Доступ только по коду</p>
      <label>
        Код доступа
        <input id="access-code" type="password" inputmode="numeric" autocomplete="current-password" placeholder="Введи код" />
      </label>
      <div class="actions">
        <button class="primary" id="unlock" ${t.authBusy?"disabled":""}>
          ${t.authBusy?"Проверяю…":"Войти"}
        </button>
      </div>
      <div class="status ${t.authError?"error":""}">${t.authError||""}</div>
    </section>
  `;const r=k.querySelector("#access-code"),e=()=>Y(r.value);k.querySelector("#unlock").addEventListener("click",e),r.addEventListener("keydown",a=>{a.key==="Enter"&&e()}),r.focus()}function E(){if(!t.unlocked){fe();return}const r=I({group:A,dateLabel:O(t.date),people:t.people});k.innerHTML=`
    <div class="topbar">
      <div>
        <h1>Расход</h1>
        <p class="sub">Фото графика → правка → готовый текст в группу командиров</p>
      </div>
      <button type="button" class="ghost" id="logout">Выйти</button>
    </div>

    <section class="card">
      <div class="row two">
        <label>
          Дата расхода
          <input id="date" type="date" value="${t.date}" />
        </label>
        <label>
          День столбца
          <input type="text" value="${K(t.date)}" readonly />
        </label>
      </div>

      <div class="file-zone" style="margin-top:12px">
        <strong>Фото листа посещаемости</strong>
        <span>Галерея или камера</span>
        <input id="file" type="file" accept="image/*" />
      </div>
      <div class="actions" style="margin-top:8px">
        <button type="button" class="ghost" id="pick-gallery">Из галереи</button>
        <button type="button" class="ghost" id="pick-camera">С камеры</button>
      </div>
      <input id="file-camera" type="file" accept="image/*" capture="environment" hidden />
      ${t.imageDataUrl?`<img class="preview" alt="Превью" src="${t.imageDataUrl}" />`:""}

      <div class="actions">
        <button class="primary" id="recognize" ${t.busy||!t.imageDataUrl?"disabled":""}>
          ${t.busy?"Жди…":"Распознать"}
        </button>
        <button class="ghost" id="reset" ${t.busy?"disabled":""}>Сбросить список</button>
      </div>
      <div class="status ${t.error?"error":""}">${t.message||""}</div>
    </section>

    <section class="card">
      <p class="hint">После распознавания поправь отметки кнопками <b>+</b> / <b>−</b> / <b>Н</b>. Причину и «мероприятие» впиши сам.</p>
      <div id="people">
        ${t.people.map((e,a)=>{var n,l,o;const i=e.confidence!=null&&e.confidence<.55;return`
            <div class="person" data-i="${a}">
              <div class="person-top">
                <div class="person-name">${e.surname}</div>
                ${i||e.mark==="empty"||e.disagreed?`<span class="badge warn">${e.disagreed?"спорно — проверь":((n=M[e.mark])==null?void 0:n.label)||"проверить"}</span>`:`<span class="badge">${((l=M[e.mark])==null?void 0:l.short)||"?"} ${((o=M[e.mark])==null?void 0:o.label)||""}</span>`}
              </div>
              <div class="quick-marks">
                ${ee.map(m=>`<button type="button" class="mark-btn ${e.mark===m?"active":""}" data-quick="${m}">${M[m].short}</button>`).join("")}
                <select data-field="mark" class="mark-select" aria-label="Другая отметка">
                  ${Object.entries(M).map(([m,f])=>`<option value="${m}" ${e.mark===m?"selected":""}>${f.label}</option>`).join("")}
                </select>
              </div>
              <div class="person-grid">
                <label>
                  Причина (если нет)
                  <input data-field="reason" type="text" placeholder="плохое самочувствие" value="${he(e.reason)}" />
                </label>
                <label class="check">
                  <input data-field="event" type="checkbox" ${e.event?"checked":""} />
                  Мероприятие
                </label>
              </div>
            </div>`}).join("")}
      </div>
    </section>

    <section class="card">
      <label>
        Текст для группы
        <textarea id="out" readonly>${pe(r)}</textarea>
      </label>
      <div class="actions">
        <button class="primary" id="copy">Скопировать</button>
      </div>
    </section>
  `,k.querySelector("#logout").addEventListener("click",()=>W()),k.querySelector("#date").addEventListener("change",e=>{t.date=e.target.value,E()}),k.querySelector("#file").addEventListener("change",e=>{var i;const a=(i=e.target.files)==null?void 0:i[0];_(a)}),k.querySelector("#file-camera").addEventListener("change",e=>{var i;const a=(i=e.target.files)==null?void 0:i[0];_(a)}),k.querySelector("#pick-gallery").addEventListener("click",()=>{k.querySelector("#file").click()}),k.querySelector("#pick-camera").addEventListener("click",()=>{k.querySelector("#file-camera").click()}),k.querySelector("#recognize").addEventListener("click",()=>de()),k.querySelector("#reset").addEventListener("click",()=>{t.people=X(),$("Список сброшен")}),k.querySelector("#copy").addEventListener("click",()=>me()),k.querySelectorAll(".person").forEach(e=>{const a=Number(e.dataset.i),i=()=>{var f,u;const n=k.querySelector("#out");n&&(n.value=I({group:A,dateLabel:O(t.date),people:t.people}));const l=e.querySelector(".badge"),o=t.people[a].mark;l&&(l.textContent=`${((f=M[o])==null?void 0:f.short)||"?"} ${((u=M[o])==null?void 0:u.label)||""}`,l.classList.toggle("warn",o==="empty"||t.people[a].confidence!=null&&t.people[a].confidence<.55)),e.querySelectorAll(".mark-btn").forEach(c=>{c.classList.toggle("active",c.getAttribute("data-quick")===o)});const m=e.querySelector('[data-field="mark"]');m&&(m.value=o)};e.querySelectorAll("[data-quick]").forEach(n=>{n.addEventListener("click",()=>{const l=n.getAttribute("data-quick");t.people[a].mark=l,t.people[a].event=l==="event",i()})}),e.querySelectorAll("[data-field]").forEach(n=>{const l=n.getAttribute("data-field"),o=()=>{l==="event"?(t.people[a].event=n.checked,n.checked?t.people[a].mark="event":t.people[a].mark==="event"&&(t.people[a].mark="present")):(t.people[a][l]=n.value,l==="mark"&&(t.people[a].event=n.value==="event")),i()};n.addEventListener("change",o),n.addEventListener("input",o)})})}function pe(r){return String(r).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function he(r){return String(r).replaceAll('"',"&quot;").replaceAll("<","&lt;")}async function ge(){if(t.accessCode){await Y(t.accessCode);return}E()}ge();
