(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const $="0903-ПД3",w=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджуа",fullName:"Боджуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакшуева",fullName:"Шакшуева Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],h={present:{label:"Есть (+)",short:"+"},absent:{label:"Нет (−)",short:"−"},duty:{label:"Наряд (Н)",short:"Н"},event:{label:"Мероприятие (МП)",short:"МП"},excused:{label:"Отпущен (О)",short:"О"},sick:{label:"Болен (Б)",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка (С)",short:"С"},empty:{label:"Не распознано",short:"?"}},z=["present","absent","duty","event"];function E(r){const t=r.group||$,n=r.people||[],o=n.length,a=n.filter(l=>l.event||l.mark==="event"),s=n.filter(l=>!(l.event||l.mark==="event")&&l.mark==="duty"),c=n.filter(l=>!(l.event||l.mark==="event")&&l.mark!=="duty"&&(l.mark==="absent"||l.mark==="excused"||l.mark==="sick"||l.mark==="unknown"||l.mark==="unauthorized")),d=o-c.length-a.length-s.length,u=[`Расход группы ${t}:`,`По списку: ${o}`,`На лицо: ${d}`];if(c.length){u.push(`Отсутствуют: ${c.length}`);for(const l of c){const f=(l.reason||"").trim();u.push(f?`${l.surname} (${f})`:l.surname)}}else u.push("Отсутствуют: 0");u.push(""),u.push(`Мероприятие: ${a.length}`);for(const l of a)u.push(l.surname);u.push(""),u.push(`Наряд: ${s.length}`);for(const l of s)u.push(l.surname);return u.join(`
`).trimEnd()}const A="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function I(){const r=new Date,t=r.getFullYear(),n=String(r.getMonth()+1).padStart(2,"0"),o=String(r.getDate()).padStart(2,"0");return`${t}-${n}-${o}`}function U(r){const t=String(r).split("-");return Number(t[2]||0)}function N(r){const[t,n,o]=String(r).split("-");return!t||!n||!o?r:`${o}.${n}.${t}`}function M(r){return new Promise((t,n)=>{const o=new FileReader;o.onload=()=>t(o.result),o.onerror=()=>n(new Error("Не удалось прочитать файл")),o.readAsDataURL(r)})}async function R(r,t=3e3,n=.92){const o=await M(r),a=await new Promise((S,v)=>{const b=new Image;b.onload=()=>S(b),b.onerror=()=>v(new Error("Битый файл изображения")),b.src=o}),s=Math.min(1,t/Math.max(a.width,a.height)),c=Math.round(a.width*s),d=Math.round(a.height*s),u=document.createElement("canvas");u.width=c,u.height=d,u.getContext("2d").drawImage(a,0,0,c,d);const l=Math.floor(c*.35),f=document.createElement("canvas");return f.width=c-l,f.height=d,f.getContext("2d").drawImage(u,l,0,c-l,d,0,0,c-l,d),{full:u.toDataURL("image/jpeg",n),crop:f.toDataURL("image/jpeg",n)}}function D(){return w.map(r=>({surname:r.surname,fullName:r.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const L="rashod_access_code";function B(){try{return sessionStorage.getItem(L)||""}catch{return""}}function O(r){try{r?sessionStorage.setItem(L,r):sessionStorage.removeItem(L)}catch{}}const e={accessCode:B(),unlocked:!1,authBusy:!1,authError:"",date:I(),imageDataUrl:"",imageCropDataUrl:"",people:D(),busy:!1,message:"",error:!1,usage:null},p=document.querySelector("#app");function m(r,t=!1){e.message=r,e.error=t,y()}function j(r){return A?`${A}${r}`:`/api${r}`}function _(){return j("/recognize")}function F(){return j("/auth")}async function P(r){const t=String(r||"").trim();if(!t){e.authError="Введи код доступа",y();return}e.authBusy=!0,e.authError="",y();try{const n=await fetch(F(),{method:"POST",headers:{"Content-Type":"application/json","X-Access-Code":t},body:JSON.stringify({accessCode:t})}),o=await n.json().catch(()=>({}));if(!n.ok||!o.ok)throw new Error(o.error||"Неверный код");e.accessCode=t,e.unlocked=!0,O(t)}catch(n){e.unlocked=!1,e.authError=n.message||String(n)}finally{e.authBusy=!1,y()}}function T(){e.unlocked=!1,e.accessCode="",O(""),e.authError="",y()}async function K(){var t,n,o;if(!e.unlocked||!e.accessCode){m("Сначала введи код доступа",!0);return}if(!e.imageDataUrl){m("Сначала выбери фото листа",!0);return}const r=U(e.date);if(!r){m("Укажи дату",!0);return}e.busy=!0,m("Распознаю по частям + проверка (Pro)…");try{const a=await fetch(_(),{method:"POST",headers:{"Content-Type":"application/json","X-Access-Code":e.accessCode},body:JSON.stringify({imageBase64:e.imageDataUrl,imageCropBase64:e.imageCropDataUrl||void 0,mimeType:"image/jpeg",day:r,group:$,roster:w,accessCode:e.accessCode})}),s=await a.json().catch(()=>({}));if(a.status===401)throw T(),new Error(s.error||"Код доступа не принят");if(!a.ok||!s.ok){const i=s.detail?` (${typeof s.detail=="string"?s.detail:""})`:"";throw new Error((s.error||`Ошибка API (${a.status})`)+i)}const c=((t=s.result)==null?void 0:t.students)||[],d=new Map(c.map(i=>[String(i.surname||"").trim().toLowerCase(),i])),u=i=>{const k=String(i??"").trim().toLowerCase().replaceAll(".","");return{present:"present","+":"present",plus:"present",absent:"absent","-":"absent","−":"absent",duty:"duty",н:"duty",h:"duty",event:"event",мп:"event",mp:"event",ип:"event",мероприятие:"event",excused:"excused",о:"excused",sick:"sick",б:"sick",unknown:"unknown",unauthorized:"unauthorized",empty:"empty"}[k]||(h[k]?k:null)};e.people=w.map((i,k)=>{const g=d.get(i.surname.toLowerCase())||c[k]||{},q=u(g.mark)||(h[g.mark]?g.mark:"empty");return{surname:i.surname,fullName:i.fullName,mark:q,reason:"",event:q==="event"||!!g.event,confidence:typeof(g==null?void 0:g.confidence)=="number"?g.confidence:null,disagreed:!!g.disagreed}}),e.usage=s.usage||null;const l=e.people.filter(i=>i.mark==="present").length,f=e.people.filter(i=>["absent","excused","sick","unknown","unauthorized"].includes(i.mark)).length,S=e.people.filter(i=>i.mark==="duty").length,v=e.people.filter(i=>i.mark==="empty").length,b=e.people.filter(i=>i.disagreed).length,C=((n=s.usage)==null?void 0:n.cost_rub)??((o=s.usage)==null?void 0:o.cost);if(v===e.people.length)m("Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.",!0);else{const i=["Готово (2× Pro)",`+${l}`,`нет ${f}`,`наряд ${S}`];v&&i.push(`пусто ${v}`),b&&i.push(`спорных ${b} — проверь`),C!=null&&i.push(`~${Number(C).toFixed(2)} ₽`),m(i.join(". ")+". Допиши причины при необходимости.")}}catch(a){m(a.message||String(a),!0)}finally{e.busy=!1,y()}}async function x(r){if(r)try{e.busy=!0,m("Готовлю фото…");const t=await R(r);e.imageDataUrl=t.full,e.imageCropDataUrl=t.crop,m("Фото готово — нажми «Распознать»")}catch(t){m(t.message||String(t),!0)}finally{e.busy=!1,y()}}async function G(){const r=E({group:$,dateLabel:N(e.date),people:e.people});try{await navigator.clipboard.writeText(r),m("Текст скопирован")}catch{m("Не удалось скопировать — выдели вручную",!0)}}function H(){p.innerHTML=`
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
  `;const r=p.querySelector("#access-code"),t=()=>P(r.value);p.querySelector("#unlock").addEventListener("click",t),r.addEventListener("keydown",n=>{n.key==="Enter"&&t()}),r.focus()}function y(){if(!e.unlocked){H();return}const r=E({group:$,dateLabel:N(e.date),people:e.people});p.innerHTML=`
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
          <input type="text" value="${U(e.date)}" readonly />
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
        ${e.people.map((t,n)=>{var a,s,c;const o=t.confidence!=null&&t.confidence<.55;return`
            <div class="person" data-i="${n}">
              <div class="person-top">
                <div class="person-name">${t.surname}</div>
                ${o||t.mark==="empty"||t.disagreed?`<span class="badge warn">${t.disagreed?"спорно — проверь":((a=h[t.mark])==null?void 0:a.label)||"проверить"}</span>`:`<span class="badge">${((s=h[t.mark])==null?void 0:s.short)||"?"} ${((c=h[t.mark])==null?void 0:c.label)||""}</span>`}
              </div>
              <div class="quick-marks">
                ${z.map(d=>`<button type="button" class="mark-btn ${t.mark===d?"active":""}" data-quick="${d}">${h[d].short}</button>`).join("")}
                <select data-field="mark" class="mark-select" aria-label="Другая отметка">
                  ${Object.entries(h).map(([d,u])=>`<option value="${d}" ${t.mark===d?"selected":""}>${u.label}</option>`).join("")}
                </select>
              </div>
              <div class="person-grid">
                <label>
                  Причина (если нет)
                  <input data-field="reason" type="text" placeholder="плохое самочувствие" value="${J(t.reason)}" />
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
        <textarea id="out" readonly>${X(r)}</textarea>
      </label>
      <div class="actions">
        <button class="primary" id="copy">Скопировать</button>
      </div>
    </section>
  `,p.querySelector("#logout").addEventListener("click",()=>T()),p.querySelector("#date").addEventListener("change",t=>{e.date=t.target.value,y()}),p.querySelector("#file").addEventListener("change",t=>{var o;const n=(o=t.target.files)==null?void 0:o[0];x(n)}),p.querySelector("#file-camera").addEventListener("change",t=>{var o;const n=(o=t.target.files)==null?void 0:o[0];x(n)}),p.querySelector("#pick-gallery").addEventListener("click",()=>{p.querySelector("#file").click()}),p.querySelector("#pick-camera").addEventListener("click",()=>{p.querySelector("#file-camera").click()}),p.querySelector("#recognize").addEventListener("click",()=>K()),p.querySelector("#reset").addEventListener("click",()=>{e.people=D(),m("Список сброшен")}),p.querySelector("#copy").addEventListener("click",()=>G()),p.querySelectorAll(".person").forEach(t=>{const n=Number(t.dataset.i),o=()=>{var u,l;const a=p.querySelector("#out");a&&(a.value=E({group:$,dateLabel:N(e.date),people:e.people}));const s=t.querySelector(".badge"),c=e.people[n].mark;s&&(s.textContent=`${((u=h[c])==null?void 0:u.short)||"?"} ${((l=h[c])==null?void 0:l.label)||""}`,s.classList.toggle("warn",c==="empty"||e.people[n].confidence!=null&&e.people[n].confidence<.55)),t.querySelectorAll(".mark-btn").forEach(f=>{f.classList.toggle("active",f.getAttribute("data-quick")===c)});const d=t.querySelector('[data-field="mark"]');d&&(d.value=c)};t.querySelectorAll("[data-quick]").forEach(a=>{a.addEventListener("click",()=>{const s=a.getAttribute("data-quick");e.people[n].mark=s,e.people[n].event=s==="event",o()})}),t.querySelectorAll("[data-field]").forEach(a=>{const s=a.getAttribute("data-field"),c=()=>{s==="event"?(e.people[n].event=a.checked,a.checked?e.people[n].mark="event":e.people[n].mark==="event"&&(e.people[n].mark="present")):(e.people[n][s]=a.value,s==="mark"&&(e.people[n].event=a.value==="event")),o()};a.addEventListener("change",c),a.addEventListener("input",c)})})}function X(r){return String(r).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function J(r){return String(r).replaceAll('"',"&quot;").replaceAll("<","&lt;")}async function Y(){if(e.accessCode){await P(e.accessCode);return}y()}Y();
