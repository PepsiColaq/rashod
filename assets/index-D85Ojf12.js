(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))l(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&l(o)}).observe(document,{childList:!0,subtree:!0});function s(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function l(t){if(t.ep)return;t.ep=!0;const n=s(t);fetch(t.href,n)}})();const b="0903-ПД3",w=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджуа",fullName:"Боджуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакирова",fullName:"Шакирова Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],g={present:{label:"Есть (+)",short:"+"},absent:{label:"Нет (−)",short:"−"},duty:{label:"Наряд (Н)",short:"Н"},excused:{label:"Отпущен (О)",short:"О"},sick:{label:"Болен (Б)",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка (С)",short:"С"},empty:{label:"Не распознано",short:"?"}},U=["present","absent","duty"];function S(r){const e=r.group||b,s=r.people||[],l=s.length,t=s.filter(c=>!c.event&&c.mark==="duty"),n=s.filter(c=>c.event),o=s.filter(c=>!c.event&&c.mark!=="duty"&&(c.mark==="absent"||c.mark==="excused"||c.mark==="sick"||c.mark==="unknown"||c.mark==="unauthorized")),u=l-o.length-n.length-t.length,i=[`Расход группы ${e}:`,`По списку: ${l}`,`На лицо: ${u}`];if(o.length){i.push(`Отсутствуют: ${o.length}`);for(const c of o){const f=(c.reason||"").trim();i.push(f?`${c.surname} (${f})`:c.surname)}}else i.push("Отсутствуют: 0");i.push(""),i.push(`Мероприятие: ${n.length}`);for(const c of n)i.push(c.surname);i.push(""),i.push(`Наряд: ${t.length}`);for(const c of t)i.push(c.surname);return i.join(`
`).trimEnd()}const q="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function z(){const r=new Date,e=r.getFullYear(),s=String(r.getMonth()+1).padStart(2,"0"),l=String(r.getDate()).padStart(2,"0");return`${e}-${s}-${l}`}function E(r){const e=String(r).split("-");return Number(e[2]||0)}function N(r){const[e,s,l]=String(r).split("-");return!e||!s||!l?r:`${l}.${s}.${e}`}function O(r){return new Promise((e,s)=>{const l=new FileReader;l.onload=()=>e(l.result),l.onerror=()=>s(new Error("Не удалось прочитать файл")),l.readAsDataURL(r)})}async function M(r,e=2800,s=.92){const l=await O(r),t=await new Promise((f,$)=>{const y=new Image;y.onload=()=>f(y),y.onerror=()=>$(new Error("Битый файл изображения")),y.src=l}),n=Math.min(1,e/Math.max(t.width,t.height)),o=Math.round(t.width*n),u=Math.round(t.height*n),i=document.createElement("canvas");return i.width=o,i.height=u,i.getContext("2d").drawImage(t,0,0,o,u),i.toDataURL("image/jpeg",s)}function A(){return w.map(r=>({surname:r.surname,fullName:r.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const a={date:z(),imageDataUrl:"",people:A(),busy:!1,message:"",error:!1,usage:null},m=document.querySelector("#app");function p(r,e=!1){a.message=r,a.error=e,k()}function P(){return q?`${q}/recognize`:"/api/recognize"}async function R(){var e,s,l;if(!a.imageDataUrl){p("Сначала выбери фото листа",!0);return}const r=E(a.date);if(!r){p("Укажи дату",!0);return}a.busy=!0,p("Распознаю столбец дня…");try{const t=await fetch(P(),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imageBase64:a.imageDataUrl,mimeType:"image/jpeg",day:r,group:b,roster:w})}),n=await t.json().catch(()=>({}));if(!t.ok||!n.ok)throw new Error(n.error||`Ошибка API (${t.status})`);const o=((e=n.result)==null?void 0:e.students)||[],u=new Map(o.map(d=>[String(d.surname||"").trim().toLowerCase(),d])),i=d=>{const v=String(d??"").trim().toLowerCase();return{present:"present","+":"present",plus:"present",absent:"absent","-":"absent","−":"absent",duty:"duty",н:"duty",h:"duty",excused:"excused",о:"excused",sick:"sick",б:"sick",unknown:"unknown",unauthorized:"unauthorized",empty:"empty"}[v]||(g[v]?v:null)};a.people=w.map((d,v)=>{const h=u.get(d.surname.toLowerCase())||o[v]||{},D=i(h.mark)||(g[h.mark]?h.mark:"empty");return{surname:d.surname,fullName:d.fullName,mark:D,reason:"",event:!1,confidence:typeof(h==null?void 0:h.confidence)=="number"?h.confidence:null}}),a.usage=n.usage||null;const c=a.people.filter(d=>d.mark==="present").length,f=a.people.filter(d=>["absent","excused","sick","unknown","unauthorized"].includes(d.mark)).length,$=a.people.filter(d=>d.mark==="duty").length,y=a.people.filter(d=>d.mark==="empty").length,L=((s=n.usage)==null?void 0:s.cost_rub)??((l=n.usage)==null?void 0:l.cost);y===a.people.length?p("Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.",!0):p(`Готово: +${c}, нет ${f}, наряд ${$}${y?`, пусто ${y}`:""}${L!=null?` (~${Number(L).toFixed(2)} ₽)`:""}. Проверь и допиши причины.`)}catch(t){p(t.message||String(t),!0)}finally{a.busy=!1,k()}}async function x(r){if(r)try{a.busy=!0,p("Готовлю фото…"),a.imageDataUrl=await M(r),p("Фото готово — нажми «Распознать»")}catch(e){p(e.message||String(e),!0)}finally{a.busy=!1,k()}}async function j(){const r=S({group:b,dateLabel:N(a.date),people:a.people});try{await navigator.clipboard.writeText(r),p("Текст скопирован")}catch{p("Не удалось скопировать — выдели вручную",!0)}}function k(){const r=S({group:b,dateLabel:N(a.date),people:a.people});m.innerHTML=`
    <h1>Расход ${b}</h1>
    <p class="sub">Фото графика → правка → готовый текст в группу командиров</p>

    <section class="card">
      <div class="row two">
        <label>
          Дата расхода
          <input id="date" type="date" value="${a.date}" />
        </label>
        <label>
          День столбца
          <input type="text" value="${E(a.date)}" readonly />
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
      ${a.imageDataUrl?`<img class="preview" alt="Превью" src="${a.imageDataUrl}" />`:""}

      <div class="actions">
        <button class="primary" id="recognize" ${a.busy||!a.imageDataUrl?"disabled":""}>
          ${a.busy?"Жди…":"Распознать"}
        </button>
        <button class="ghost" id="reset" ${a.busy?"disabled":""}>Сбросить список</button>
      </div>
      <div class="status ${a.error?"error":""}">${a.message||""}</div>
    </section>

    <section class="card">
      <p class="hint">После распознавания поправь отметки кнопками <b>+</b> / <b>−</b> / <b>Н</b>. Причину и «мероприятие» впиши сам.</p>
      <div id="people">
        ${a.people.map((e,s)=>{var t,n,o;const l=e.confidence!=null&&e.confidence<.55;return`
            <div class="person" data-i="${s}">
              <div class="person-top">
                <div class="person-name">${e.surname}</div>
                ${l||e.mark==="empty"?`<span class="badge warn">${((t=g[e.mark])==null?void 0:t.label)||"проверить"}</span>`:`<span class="badge">${((n=g[e.mark])==null?void 0:n.short)||"?"} ${((o=g[e.mark])==null?void 0:o.label)||""}</span>`}
              </div>
              <div class="quick-marks">
                ${U.map(u=>`<button type="button" class="mark-btn ${e.mark===u?"active":""}" data-quick="${u}">${g[u].short}</button>`).join("")}
                <select data-field="mark" class="mark-select" aria-label="Другая отметка">
                  ${Object.entries(g).map(([u,i])=>`<option value="${u}" ${e.mark===u?"selected":""}>${i.label}</option>`).join("")}
                </select>
              </div>
              <div class="person-grid">
                <label>
                  Причина (если нет)
                  <input data-field="reason" type="text" placeholder="плохое самочувствие" value="${T(e.reason)}" />
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
        <textarea id="out" readonly>${C(r)}</textarea>
      </label>
      <div class="actions">
        <button class="primary" id="copy">Скопировать</button>
      </div>
    </section>
  `,m.querySelector("#date").addEventListener("change",e=>{a.date=e.target.value,k()}),m.querySelector("#file").addEventListener("change",e=>{var l;const s=(l=e.target.files)==null?void 0:l[0];x(s)}),m.querySelector("#file-camera").addEventListener("change",e=>{var l;const s=(l=e.target.files)==null?void 0:l[0];x(s)}),m.querySelector("#pick-gallery").addEventListener("click",()=>{m.querySelector("#file").click()}),m.querySelector("#pick-camera").addEventListener("click",()=>{m.querySelector("#file-camera").click()}),m.querySelector("#recognize").addEventListener("click",()=>R()),m.querySelector("#reset").addEventListener("click",()=>{a.people=A(),p("Список сброшен")}),m.querySelector("#copy").addEventListener("click",()=>j()),m.querySelectorAll(".person").forEach(e=>{const s=Number(e.dataset.i),l=()=>{var i,c;const t=m.querySelector("#out");t&&(t.value=S({group:b,dateLabel:N(a.date),people:a.people}));const n=e.querySelector(".badge"),o=a.people[s].mark;n&&(n.textContent=`${((i=g[o])==null?void 0:i.short)||"?"} ${((c=g[o])==null?void 0:c.label)||""}`,n.classList.toggle("warn",o==="empty"||a.people[s].confidence!=null&&a.people[s].confidence<.55)),e.querySelectorAll(".mark-btn").forEach(f=>{f.classList.toggle("active",f.getAttribute("data-quick")===o)});const u=e.querySelector('[data-field="mark"]');u&&(u.value=o)};e.querySelectorAll("[data-quick]").forEach(t=>{t.addEventListener("click",()=>{a.people[s].mark=t.getAttribute("data-quick"),l()})}),e.querySelectorAll("[data-field]").forEach(t=>{const n=t.getAttribute("data-field"),o=()=>{n==="event"?a.people[s].event=t.checked:a.people[s][n]=t.value,l()};t.addEventListener("change",o),t.addEventListener("input",o)})})}function C(r){return String(r).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function T(r){return String(r).replaceAll('"',"&quot;").replaceAll("<","&lt;")}k();
