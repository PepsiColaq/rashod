(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))d(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&d(o)}).observe(document,{childList:!0,subtree:!0});function s(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function d(n){if(n.ep)return;n.ep=!0;const l=s(n);fetch(n.href,l)}})();const A="0903-ПД3",U=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджуа",fullName:"Боджуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакшуева",fullName:"Шакшуева Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],w={present:{label:"Есть (+)",short:"+"},absent:{label:"Нет (−)",short:"−"},duty:{label:"Наряд (Н)",short:"Н"},event:{label:"Мероприятие (МП)",short:"МП"},excused:{label:"Отпущен (О)",short:"О"},sick:{label:"Болен (Б)",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка (С)",short:"С"},empty:{label:"Не распознано",short:"?"}},Z=["present","absent","duty","event"];function I(a){const e=a.group||A,s=a.people||[],d=s.length,n=s.filter(i=>i.event||i.mark==="event"),l=s.filter(i=>!(i.event||i.mark==="event")&&i.mark==="duty"),o=s.filter(i=>!(i.event||i.mark==="event")&&i.mark!=="duty"&&(i.mark==="absent"||i.mark==="excused"||i.mark==="sick"||i.mark==="unknown"||i.mark==="unauthorized")),m=d-o.length-n.length-l.length,f=[`Расход группы ${e}:`,`По списку: ${d}`,`На лицо: ${m}`];if(o.length){f.push(`Отсутствуют: ${o.length}`);for(const i of o){const c=(i.reason||"").trim();f.push(c?`${i.surname} (${c})`:i.surname)}}else f.push("Отсутствуют: 0");f.push(""),f.push(`Мероприятие: ${n.length}`);for(const i of n)f.push(i.surname);f.push(""),f.push(`Наряд: ${l.length}`);for(const i of l)f.push(i.surname);return f.join(`
`).trimEnd()}const _="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function ee(){const a=new Date,e=a.getFullYear(),s=String(a.getMonth()+1).padStart(2,"0"),d=String(a.getDate()).padStart(2,"0");return`${e}-${s}-${d}`}function G(a){const e=String(a).split("-");return Number(e[2]||0)}function R(a){const[e,s,d]=String(a).split("-");return!e||!s||!d?a:`${d}.${s}.${e}`}function te(a){return new Promise((e,s)=>{const d=new FileReader;d.onload=()=>e(d.result),d.onerror=()=>s(new Error("Не удалось прочитать файл")),d.readAsDataURL(a)})}function H(a){return new Promise((e,s)=>{const d=new Image;d.onload=()=>e(d),d.onerror=()=>s(new Error("Битый файл изображения")),d.src=a})}function X(a,e,s,d){const n=(d*e+s)*4;return(a[n]+a[n+1]+a[n+2])/3}function ae(a,e,s,d){const n=Math.floor(s*.25),l=Math.floor(s*.55),o=new Float32Array(e),m=new Float32Array(e);for(let u=0;u<e;u++){let r=0,b=0;const p=l-n;for(let M=n;M<l;M++){const x=X(a,e,u,M);r+=x,b+=x*x}const S=r/p;o[u]=S,m[u]=Math.sqrt(Math.max(0,b/p-S*S))}const f=new Float32Array(e);for(let u=0;u<e;u++)f[u]=o[u]>140&&o[u]<165&&m[u]<48?1:0;const i=new Float32Array(e);for(let u=0;u<e;u++){let r=0,b=0;for(let p=-3;p<=3;p++){const S=u+p;S>=0&&S<e&&(r+=f[S],b++)}i[u]=r/b>.5?1:0}const c=[];for(let u=0;u<e;)if(i[u]){let r=u;for(;r<e&&i[r];)r++;r-u>15&&c.push([u,r]),u=r}else u++;const y=e/6,v=Number(d)||15;let h,g;if(c.length&&v>=25){const u=c.reduce((b,p)=>p[1]-p[0]>b[1]-b[0]?p:b),r=(v-28)*y;h=Math.floor(u[1]+y*.08+r),g=Math.floor(u[1]+y*.92+r)}else v<=10?(h=Math.floor(e*.05),g=Math.floor(e*.28)):v<=20?(h=Math.floor(e*.28),g=Math.floor(e*.52)):(h=Math.floor(e*.38),g=Math.floor(e*.58));return h=Math.max(0,h),g=Math.min(e,Math.max(h+24,g)),[h,g]}function ne(a,e,s,d,n){const l=new Float32Array(s),o=new Float32Array(s);for(let c=0;c<s;c++){let y=255,v=0;const h=n-d;for(let g=d;g<n;g++){const u=X(a,e,g,c);u<y&&(y=u),v+=u}l[c]=Math.max(0,150-y),o[c]=v/h}const m=new Float32Array(s);for(let c=0;c<s;c++){let y=0,v=0;for(let h=-2;h<=2;h++){const g=c+h;g>=0&&g<s&&(y+=l[g],v++)}m[c]=y/v}let f=0;for(let c=0;c<s;c++)if(o[c]>140){f=c;break}const i=[];for(let c=f+15;c<s-40;c++)m[c]>8&&m[c]>=m[c-1]&&m[c]>=m[c+1]&&(!i.length||c-i[i.length-1]>34)&&i.push(c);return{peaks:i,paper0:f}}function re(a,e,s,d,n,l){const{peaks:o,paper0:m}=ne(a,e,s,d,n);if(o.length<3){const y=m+100,h=(s-80-y)/l;return Array.from({length:l},(g,u)=>Math.round(y+(u+.5)*h))}const f=o.length>=l+2?o[2]:o[0];let i=45,c=null;for(let y=38;y<=52;y+=.25){let v=0,h=0;for(let r=0;r<l;r++){const b=f+r*y;let p=1/0;for(const S of o){const M=Math.abs(S-b);M<p&&(p=M)}p<y*.35&&v++,h+=p}const g=v,u=-h;(!c||g>c.hits||g===c.hits&&u>c.dist)&&(c={hits:g,dist:u},i=y)}return Array.from({length:l},(y,v)=>Math.round(f+v*i))}async function se(a,e,s,d=.88){const n=await H(a),l=n.width,o=n.height,m=Number(e)||15,f=m<=10?.32:m<=20?.5:.82,i=Math.floor(l*f),c=Math.floor(o*.05),y=Math.ceil(o*.95),v=l-i,h=y-c,g=3,u=document.createElement("canvas");u.width=Math.max(1,v*g),u.height=Math.max(1,h*g);const r=u.getContext("2d",{willReadFrequently:!0});r.imageSmoothingEnabled=!0,r.imageSmoothingQuality="high",r.drawImage(n,i,c,v,h,0,0,u.width,u.height);const b=u.width,p=u.height,S=r.getImageData(0,0,b,p),{data:M}=S,[x,L]=ae(M,b,p,m),N=re(M,b,p,x,L,s);r.fillStyle="#fff",r.fillRect(0,0,x,p),r.fillRect(L,0,b-L,p);for(let q=0;q<N.length;q++){const T=N[q],D=Math.max(0,x-52),B=T-14;r.fillStyle="#ffe600",r.strokeStyle="#c80000",r.lineWidth=2,r.fillRect(D,B,x-4-D,28),r.strokeRect(D+.5,B+.5,x-4-D-1,27),r.fillStyle="#c80000",r.font="bold 22px Arial, sans-serif",r.textBaseline="middle",r.fillText(String(q+1),Math.max(4,x-46),T)}const j=N.length>1?Math.max(14,Math.round(Math.abs(N[1]-N[0])/2)):20,z=Math.max(0,N[0]-j-8),W=Math.min(p,N[N.length-1]+j+8),P=Math.max(0,x-55),V=Math.min(b,L+8),C=document.createElement("canvas");return C.width=Math.max(1,V-P),C.height=Math.max(1,W-z),C.getContext("2d").drawImage(u,P,z,C.width,C.height,0,0,C.width,C.height),C.toDataURL("image/jpeg",d)}async function oe(a,e=3e3,s=.92){const d=await te(a),n=await H(d),l=Math.min(1,e/Math.max(n.width,n.height)),o=Math.round(n.width*l),m=Math.round(n.height*l),f=document.createElement("canvas");f.width=o,f.height=m,f.getContext("2d").drawImage(n,0,0,o,m);const i=Math.floor(o*.35),c=document.createElement("canvas");return c.width=o-i,c.height=m,c.getContext("2d").drawImage(f,i,0,o-i,m,0,0,o-i,m),{full:f.toDataURL("image/jpeg",s),crop:c.toDataURL("image/jpeg",s)}}function Q(){return U.map(a=>({surname:a.surname,fullName:a.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const O="rashod_access_code",le="nikitosbrateevo";function ce(){try{return sessionStorage.getItem(O)||""}catch{return""}}function F(a){try{a?sessionStorage.setItem(O,a):sessionStorage.removeItem(O)}catch{}}function ie(a){return String(a||"").trim().replace(/\s+/g,"")}const t={accessCode:ce(),unlocked:!1,authBusy:!1,authError:"",date:ee(),imageDataUrl:"",imageCropDataUrl:"",people:Q(),busy:!1,message:"",error:!1,usage:null},k=document.querySelector("#app");function $(a,e=!1){t.message=a,t.error=e,E()}function ue(a){return _?`${_}${a}`:`/api${a}`}function de(){return ue("/recognize")}function Y(a){const e=ie(a);if(!e){t.authError="Введи код доступа",t.unlocked=!1,E();return}if(e!==le){t.unlocked=!1,t.accessCode="",F(""),t.authError="Неверный код",E();return}t.accessCode=e,t.unlocked=!0,t.authError="",t.authBusy=!1,F(e),E()}function J(){t.unlocked=!1,t.accessCode="",F(""),t.authError="",E()}async function me(){var e,s,d;if(!t.unlocked||!t.accessCode){$("Сначала введи код доступа",!0);return}if(!t.imageDataUrl){$("Сначала выбери фото листа",!0);return}const a=G(t.date);if(!a){$("Укажи дату",!0);return}t.busy=!0,$("Читаю знаки по клеткам (1× Pro)…");try{const n=await se(t.imageDataUrl,a,U.length),l=await fetch(de(),{method:"POST",headers:{"Content-Type":"application/json","X-Access-Code":t.accessCode},body:JSON.stringify({imageBase64:t.imageDataUrl,imageCropBase64:t.imageCropDataUrl||void 0,imageDayCropBase64:n,mimeType:"image/jpeg",day:a,group:A,roster:U,accessCode:t.accessCode})}),o=await l.json().catch(()=>({}));if(l.status===401)throw J(),new Error(o.error||"Код доступа не принят");if(!l.ok||!o.ok){const r=o.detail?` (${typeof o.detail=="string"?o.detail:""})`:"";throw new Error((o.error||`Ошибка API (${l.status})`)+r)}const m=((e=o.result)==null?void 0:e.students)||[],f=new Map(m.map(r=>[String(r.surname||"").trim().toLowerCase(),r])),i=r=>{const b=String(r??"").trim().toLowerCase().replaceAll(".","");return{present:"present","+":"present",plus:"present",absent:"absent","-":"absent","−":"absent",duty:"duty",н:"duty",h:"duty",event:"event",мп:"event",mp:"event",ип:"event",мероприятие:"event",excused:"excused",о:"excused",sick:"sick",б:"sick",unknown:"unknown",unauthorized:"unauthorized",empty:"empty"}[b]||(w[b]?b:null)};t.people=U.map((r,b)=>{const p=f.get(r.surname.toLowerCase())||m[b]||{},S=i(p.mark)||(w[p.mark]?p.mark:"empty");return{surname:r.surname,fullName:r.fullName,mark:S,reason:"",event:S==="event"||!!p.event,confidence:typeof(p==null?void 0:p.confidence)=="number"?p.confidence:null,disagreed:!!p.disagreed}}),t.usage=o.usage||null;const c=t.people.filter(r=>r.mark==="present").length,y=t.people.filter(r=>["absent","excused","sick","unknown","unauthorized"].includes(r.mark)).length,v=t.people.filter(r=>r.mark==="duty").length,h=t.people.filter(r=>r.mark==="empty").length,g=t.people.filter(r=>r.disagreed).length,u=((s=o.usage)==null?void 0:s.cost_rub)??((d=o.usage)==null?void 0:d.cost);if(h===t.people.length)$("Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.",!0);else{const r=["Готово (2× Pro)",`+${c}`,`нет ${y}`,`наряд ${v}`];h&&r.push(`пусто ${h}`),g&&r.push(`спорных ${g} — проверь`),u!=null&&r.push(`~${Number(u).toFixed(2)} ₽`),$(r.join(". ")+". Допиши причины при необходимости.")}}catch(n){$(n.message||String(n),!0)}finally{t.busy=!1,E()}}async function K(a){if(a)try{t.busy=!0,$("Готовлю фото…");const e=await oe(a);t.imageDataUrl=e.full,t.imageCropDataUrl=e.crop,$("Фото готово — нажми «Распознать»")}catch(e){$(e.message||String(e),!0)}finally{t.busy=!1,E()}}async function fe(){const a=I({group:A,dateLabel:R(t.date),people:t.people});try{await navigator.clipboard.writeText(a),$("Текст скопирован")}catch{$("Не удалось скопировать — выдели вручную",!0)}}function pe(){k.innerHTML=`
    <section class="card gate">
      <h1>Расход</h1>
      <p class="sub">Доступ только по коду</p>
      <label>
        Код доступа
        <input id="access-code" type="text" autocomplete="one-time-code" placeholder="Введи код" spellcheck="false" />
      </label>
      <div class="actions">
        <button class="primary" id="unlock" ${t.authBusy?"disabled":""}>
          ${t.authBusy?"Проверяю…":"Войти"}
        </button>
      </div>
      <div class="status ${t.authError?"error":""}">${t.authError||""}</div>
    </section>
  `;const a=k.querySelector("#access-code"),e=()=>Y(a.value);k.querySelector("#unlock").addEventListener("click",e),a.addEventListener("keydown",s=>{s.key==="Enter"&&e()}),a.focus()}function E(){if(!t.unlocked){pe();return}const a=I({group:A,dateLabel:R(t.date),people:t.people});k.innerHTML=`
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
          <input type="text" value="${G(t.date)}" readonly />
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
        ${t.people.map((e,s)=>{var n,l,o;const d=e.confidence!=null&&e.confidence<.55;return`
            <div class="person" data-i="${s}">
              <div class="person-top">
                <div class="person-name">${e.surname}</div>
                ${d||e.mark==="empty"||e.disagreed?`<span class="badge warn">${e.disagreed?"спорно — проверь":((n=w[e.mark])==null?void 0:n.label)||"проверить"}</span>`:`<span class="badge">${((l=w[e.mark])==null?void 0:l.short)||"?"} ${((o=w[e.mark])==null?void 0:o.label)||""}</span>`}
              </div>
              <div class="quick-marks">
                ${Z.map(m=>`<button type="button" class="mark-btn ${e.mark===m?"active":""}" data-quick="${m}">${w[m].short}</button>`).join("")}
                <select data-field="mark" class="mark-select" aria-label="Другая отметка">
                  ${Object.entries(w).map(([m,f])=>`<option value="${m}" ${e.mark===m?"selected":""}>${f.label}</option>`).join("")}
                </select>
              </div>
              <div class="person-grid">
                <label>
                  Причина (если нет)
                  <input data-field="reason" type="text" placeholder="плохое самочувствие" value="${ge(e.reason)}" />
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
        <textarea id="out" readonly>${he(a)}</textarea>
      </label>
      <div class="actions">
        <button class="primary" id="copy">Скопировать</button>
      </div>
    </section>
  `,k.querySelector("#logout").addEventListener("click",()=>J()),k.querySelector("#date").addEventListener("change",e=>{t.date=e.target.value,E()}),k.querySelector("#file").addEventListener("change",e=>{var d;const s=(d=e.target.files)==null?void 0:d[0];K(s)}),k.querySelector("#file-camera").addEventListener("change",e=>{var d;const s=(d=e.target.files)==null?void 0:d[0];K(s)}),k.querySelector("#pick-gallery").addEventListener("click",()=>{k.querySelector("#file").click()}),k.querySelector("#pick-camera").addEventListener("click",()=>{k.querySelector("#file-camera").click()}),k.querySelector("#recognize").addEventListener("click",()=>me()),k.querySelector("#reset").addEventListener("click",()=>{t.people=Q(),$("Список сброшен")}),k.querySelector("#copy").addEventListener("click",()=>fe()),k.querySelectorAll(".person").forEach(e=>{const s=Number(e.dataset.i),d=()=>{var f,i;const n=k.querySelector("#out");n&&(n.value=I({group:A,dateLabel:R(t.date),people:t.people}));const l=e.querySelector(".badge"),o=t.people[s].mark;l&&(l.textContent=`${((f=w[o])==null?void 0:f.short)||"?"} ${((i=w[o])==null?void 0:i.label)||""}`,l.classList.toggle("warn",o==="empty"||t.people[s].confidence!=null&&t.people[s].confidence<.55)),e.querySelectorAll(".mark-btn").forEach(c=>{c.classList.toggle("active",c.getAttribute("data-quick")===o)});const m=e.querySelector('[data-field="mark"]');m&&(m.value=o)};e.querySelectorAll("[data-quick]").forEach(n=>{n.addEventListener("click",()=>{const l=n.getAttribute("data-quick");t.people[s].mark=l,t.people[s].event=l==="event",d()})}),e.querySelectorAll("[data-field]").forEach(n=>{const l=n.getAttribute("data-field"),o=()=>{l==="event"?(t.people[s].event=n.checked,n.checked?t.people[s].mark="event":t.people[s].mark==="event"&&(t.people[s].mark="present")):(t.people[s][l]=n.value,l==="mark"&&(t.people[s].event=n.value==="event")),d()};n.addEventListener("change",o),n.addEventListener("input",o)})})}function he(a){return String(a).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function ge(a){return String(a).replaceAll('"',"&quot;").replaceAll("<","&lt;")}function ye(){if(t.accessCode){Y(t.accessCode);return}E()}ye();
