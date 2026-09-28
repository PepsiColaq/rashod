(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const k="0903-ПД3",S=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджуа",fullName:"Боджуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакшуева",fullName:"Шакшуева Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],h={present:{label:"Есть (+)",short:"+"},absent:{label:"Нет (−)",short:"−"},duty:{label:"Наряд (Н)",short:"Н"},excused:{label:"Отпущен (О)",short:"О"},sick:{label:"Болен (Б)",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка (С)",short:"С"},empty:{label:"Не распознано",short:"?"}},z=["present","absent","duty"];function w(r){const t=r.group||k,n=r.people||[],o=n.length,a=n.filter(c=>!c.event&&c.mark==="duty"),s=n.filter(c=>c.event),l=n.filter(c=>!c.event&&c.mark!=="duty"&&(c.mark==="absent"||c.mark==="excused"||c.mark==="sick"||c.mark==="unknown"||c.mark==="unauthorized")),m=o-l.length-s.length-a.length,u=[`Расход группы ${t}:`,`По списку: ${o}`,`На лицо: ${m}`];if(l.length){u.push(`Отсутствуют: ${l.length}`);for(const c of l){const f=(c.reason||"").trim();u.push(f?`${c.surname} (${f})`:c.surname)}}else u.push("Отсутствуют: 0");u.push(""),u.push(`Мероприятие: ${s.length}`);for(const c of s)u.push(c.surname);u.push(""),u.push(`Наряд: ${a.length}`);for(const c of a)u.push(c.surname);return u.join(`
`).trimEnd()}const C="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function I(){const r=new Date,t=r.getFullYear(),n=String(r.getMonth()+1).padStart(2,"0"),o=String(r.getDate()).padStart(2,"0");return`${t}-${n}-${o}`}function A(r){const t=String(r).split("-");return Number(t[2]||0)}function E(r){const[t,n,o]=String(r).split("-");return!t||!n||!o?r:`${o}.${n}.${t}`}function M(r){return new Promise((t,n)=>{const o=new FileReader;o.onload=()=>t(o.result),o.onerror=()=>n(new Error("Не удалось прочитать файл")),o.readAsDataURL(r)})}async function R(r,t=2800,n=.92){const o=await M(r),a=await new Promise((f,$)=>{const b=new Image;b.onload=()=>f(b),b.onerror=()=>$(new Error("Битый файл изображения")),b.src=o}),s=Math.min(1,t/Math.max(a.width,a.height)),l=Math.round(a.width*s),m=Math.round(a.height*s),u=document.createElement("canvas");return u.width=l,u.height=m,u.getContext("2d").drawImage(a,0,0,l,m),u.toDataURL("image/jpeg",n)}function O(){return S.map(r=>({surname:r.surname,fullName:r.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const N="rashod_access_code";function B(){try{return sessionStorage.getItem(N)||""}catch{return""}}function U(r){try{r?sessionStorage.setItem(N,r):sessionStorage.removeItem(N)}catch{}}const e={accessCode:B(),unlocked:!1,authBusy:!1,authError:"",date:I(),imageDataUrl:"",people:O(),busy:!1,message:"",error:!1,usage:null},d=document.querySelector("#app");function p(r,t=!1){e.message=r,e.error=t,y()}function D(r){return C?`${C}${r}`:`/api${r}`}function _(){return D("/recognize")}function F(){return D("/auth")}async function P(r){const t=String(r||"").trim();if(!t){e.authError="Введи код доступа",y();return}e.authBusy=!0,e.authError="",y();try{const n=await fetch(F(),{method:"POST",headers:{"Content-Type":"application/json","X-Access-Code":t},body:JSON.stringify({accessCode:t})}),o=await n.json().catch(()=>({}));if(!n.ok||!o.ok)throw new Error(o.error||"Неверный код");e.accessCode=t,e.unlocked=!0,U(t)}catch(n){e.unlocked=!1,e.authError=n.message||String(n)}finally{e.authBusy=!1,y()}}function T(){e.unlocked=!1,e.accessCode="",U(""),e.authError="",y()}async function K(){var t,n,o;if(!e.unlocked||!e.accessCode){p("Сначала введи код доступа",!0);return}if(!e.imageDataUrl){p("Сначала выбери фото листа",!0);return}const r=A(e.date);if(!r){p("Укажи дату",!0);return}e.busy=!0,p("Распознаю и перепроверяю столбец (Pro, 2 прохода)…");try{const a=await fetch(_(),{method:"POST",headers:{"Content-Type":"application/json","X-Access-Code":e.accessCode},body:JSON.stringify({imageBase64:e.imageDataUrl,mimeType:"image/jpeg",day:r,group:k,roster:S,accessCode:e.accessCode})}),s=await a.json().catch(()=>({}));if(a.status===401)throw T(),new Error(s.error||"Код доступа не принят");if(!a.ok||!s.ok){const i=s.detail?` (${typeof s.detail=="string"?s.detail:""})`:"";throw new Error((s.error||`Ошибка API (${a.status})`)+i)}const l=((t=s.result)==null?void 0:t.students)||[],m=new Map(l.map(i=>[String(i.surname||"").trim().toLowerCase(),i])),u=i=>{const v=String(i??"").trim().toLowerCase();return{present:"present","+":"present",plus:"present",absent:"absent","-":"absent","−":"absent",duty:"duty",н:"duty",h:"duty",excused:"excused",о:"excused",sick:"sick",б:"sick",unknown:"unknown",unauthorized:"unauthorized",empty:"empty"}[v]||(h[v]?v:null)};e.people=S.map((i,v)=>{const g=m.get(i.surname.toLowerCase())||l[v]||{},j=u(g.mark)||(h[g.mark]?g.mark:"empty");return{surname:i.surname,fullName:i.fullName,mark:j,reason:"",event:!1,confidence:typeof(g==null?void 0:g.confidence)=="number"?g.confidence:null,disagreed:!!g.disagreed}}),e.usage=s.usage||null;const c=e.people.filter(i=>i.mark==="present").length,f=e.people.filter(i=>["absent","excused","sick","unknown","unauthorized"].includes(i.mark)).length,$=e.people.filter(i=>i.mark==="duty").length,b=e.people.filter(i=>i.mark==="empty").length,L=e.people.filter(i=>i.disagreed).length,q=((n=s.usage)==null?void 0:n.cost_rub)??((o=s.usage)==null?void 0:o.cost);if(b===e.people.length)p("Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.",!0);else{const i=["Готово (2 прохода Pro)",`+${c}`,`нет ${f}`,`наряд ${$}`];b&&i.push(`пусто ${b}`),L&&i.push(`спорных ${L} — проверь`),q!=null&&i.push(`~${Number(q).toFixed(2)} ₽`),p(i.join(". ")+". Допиши причины при необходимости.")}}catch(a){p(a.message||String(a),!0)}finally{e.busy=!1,y()}}async function x(r){if(r)try{e.busy=!0,p("Готовлю фото…"),e.imageDataUrl=await R(r),p("Фото готово — нажми «Распознать»")}catch(t){p(t.message||String(t),!0)}finally{e.busy=!1,y()}}async function G(){const r=w({group:k,dateLabel:E(e.date),people:e.people});try{await navigator.clipboard.writeText(r),p("Текст скопирован")}catch{p("Не удалось скопировать — выдели вручную",!0)}}function H(){d.innerHTML=`
    <section class="card gate">
      <h1>Расход</h1>
      <p class="sub">Доступ только по коду</p>
      <label>
        Код доступа
        <input id="access-code" type="password" inputmode="numeric" autocomplete="current-password" placeholder="Введи код" />
      </label>
      <div class="actions">
        <button class="primary" id="unlock" ${e.authBusy?"disabled":""}>
          ${e.authBusy?"Проверяю…":"Войти"}
        </button>
      </div>
      <div class="status ${e.authError?"error":""}">${e.authError||""}</div>
    </section>
  `;const r=d.querySelector("#access-code"),t=()=>P(r.value);d.querySelector("#unlock").addEventListener("click",t),r.addEventListener("keydown",n=>{n.key==="Enter"&&t()}),r.focus()}function y(){if(!e.unlocked){H();return}const r=w({group:k,dateLabel:E(e.date),people:e.people});d.innerHTML=`
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
          <input id="date" type="date" value="${e.date}" />
        </label>
        <label>
          День столбца
          <input type="text" value="${A(e.date)}" readonly />
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
      ${e.imageDataUrl?`<img class="preview" alt="Превью" src="${e.imageDataUrl}" />`:""}

      <div class="actions">
        <button class="primary" id="recognize" ${e.busy||!e.imageDataUrl?"disabled":""}>
          ${e.busy?"Жди…":"Распознать"}
        </button>
        <button class="ghost" id="reset" ${e.busy?"disabled":""}>Сбросить список</button>
      </div>
      <div class="status ${e.error?"error":""}">${e.message||""}</div>
    </section>

    <section class="card">
      <p class="hint">После распознавания поправь отметки кнопками <b>+</b> / <b>−</b> / <b>Н</b>. Причину и «мероприятие» впиши сам.</p>
      <div id="people">
        ${e.people.map((t,n)=>{var a,s,l;const o=t.confidence!=null&&t.confidence<.55;return`
            <div class="person" data-i="${n}">
              <div class="person-top">
                <div class="person-name">${t.surname}</div>
                ${o||t.mark==="empty"||t.disagreed?`<span class="badge warn">${t.disagreed?"спорно — проверь":((a=h[t.mark])==null?void 0:a.label)||"проверить"}</span>`:`<span class="badge">${((s=h[t.mark])==null?void 0:s.short)||"?"} ${((l=h[t.mark])==null?void 0:l.label)||""}</span>`}
              </div>
              <div class="quick-marks">
                ${z.map(m=>`<button type="button" class="mark-btn ${t.mark===m?"active":""}" data-quick="${m}">${h[m].short}</button>`).join("")}
                <select data-field="mark" class="mark-select" aria-label="Другая отметка">
                  ${Object.entries(h).map(([m,u])=>`<option value="${m}" ${t.mark===m?"selected":""}>${u.label}</option>`).join("")}
                </select>
              </div>
              <div class="person-grid">
                <label>
                  Причина (если нет)
                  <input data-field="reason" type="text" placeholder="плохое самочувствие" value="${X(t.reason)}" />
                </label>
                <label class="check">
                  <input data-field="event" type="checkbox" ${t.event?"checked":""} />
                  Мероприятие
                </label>
              </div>
            </div>`}).join("")}
      </div>
    </section>

    <section class="card">
      <label>
        Текст для группы
        <textarea id="out" readonly>${J(r)}</textarea>
      </label>
      <div class="actions">
        <button class="primary" id="copy">Скопировать</button>
      </div>
    </section>
  `,d.querySelector("#logout").addEventListener("click",()=>T()),d.querySelector("#date").addEventListener("change",t=>{e.date=t.target.value,y()}),d.querySelector("#file").addEventListener("change",t=>{var o;const n=(o=t.target.files)==null?void 0:o[0];x(n)}),d.querySelector("#file-camera").addEventListener("change",t=>{var o;const n=(o=t.target.files)==null?void 0:o[0];x(n)}),d.querySelector("#pick-gallery").addEventListener("click",()=>{d.querySelector("#file").click()}),d.querySelector("#pick-camera").addEventListener("click",()=>{d.querySelector("#file-camera").click()}),d.querySelector("#recognize").addEventListener("click",()=>K()),d.querySelector("#reset").addEventListener("click",()=>{e.people=O(),p("Список сброшен")}),d.querySelector("#copy").addEventListener("click",()=>G()),d.querySelectorAll(".person").forEach(t=>{const n=Number(t.dataset.i),o=()=>{var u,c;const a=d.querySelector("#out");a&&(a.value=w({group:k,dateLabel:E(e.date),people:e.people}));const s=t.querySelector(".badge"),l=e.people[n].mark;s&&(s.textContent=`${((u=h[l])==null?void 0:u.short)||"?"} ${((c=h[l])==null?void 0:c.label)||""}`,s.classList.toggle("warn",l==="empty"||e.people[n].confidence!=null&&e.people[n].confidence<.55)),t.querySelectorAll(".mark-btn").forEach(f=>{f.classList.toggle("active",f.getAttribute("data-quick")===l)});const m=t.querySelector('[data-field="mark"]');m&&(m.value=l)};t.querySelectorAll("[data-quick]").forEach(a=>{a.addEventListener("click",()=>{e.people[n].mark=a.getAttribute("data-quick"),o()})}),t.querySelectorAll("[data-field]").forEach(a=>{const s=a.getAttribute("data-field"),l=()=>{s==="event"?e.people[n].event=a.checked:e.people[n][s]=a.value,o()};a.addEventListener("change",l),a.addEventListener("input",l)})})}function J(r){return String(r).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function X(r){return String(r).replaceAll('"',"&quot;").replaceAll("<","&lt;")}async function Y(){if(e.accessCode){await P(e.accessCode);return}y()}Y();
