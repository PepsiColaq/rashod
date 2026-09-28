(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function l(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(t){if(t.ep)return;t.ep=!0;const s=l(t);fetch(t.href,s)}})();const h="0903-ПД3",w=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджуа",fullName:"Боджуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакирова",fullName:"Шакирова Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],$={present:{label:"На лицо",short:"+"},absent:{label:"Отсутствует",short:"−"},duty:{label:"Наряд",short:"Н"},excused:{label:"Отпущен",short:"О"},sick:{label:"Болен",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка",short:"С"},empty:{label:"Пусто",short:"·"}};function N(n){const e=n.group||h,l=n.people||[],r=l.length,t=l.filter(o=>!o.event&&o.mark==="duty"),s=l.filter(o=>o.event),c=l.filter(o=>!o.event&&o.mark!=="duty"&&(o.mark==="absent"||o.mark==="excused"||o.mark==="sick"||o.mark==="unknown"||o.mark==="unauthorized")),g=r-c.length-s.length-t.length,i=[`Расход группы ${e}:`,`По списку: ${r}`,`На лицо: ${g}`];if(c.length){i.push(`Отсутствуют: ${c.length}`);for(const o of c){const y=(o.reason||"").trim();i.push(y?`${o.surname} (${y})`:o.surname)}}else i.push("Отсутствуют: 0");i.push(""),i.push(`Мероприятие: ${s.length}`);for(const o of s)i.push(o.surname);i.push(""),i.push(`Наряд: ${t.length}`);for(const o of t)i.push(o.surname);return i.join(`
`).trimEnd()}const x="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function A(){const n=new Date,e=n.getFullYear(),l=String(n.getMonth()+1).padStart(2,"0"),r=String(n.getDate()).padStart(2,"0");return`${e}-${l}-${r}`}function q(n){const e=String(n).split("-");return Number(e[2]||0)}function S(n){const[e,l,r]=String(n).split("-");return!e||!l||!r?n:`${r}.${l}.${e}`}function U(n){return new Promise((e,l)=>{const r=new FileReader;r.onload=()=>e(r.result),r.onerror=()=>l(new Error("Не удалось прочитать файл")),r.readAsDataURL(n)})}async function O(n,e=2800,l=.92){const r=await U(n),t=await new Promise((y,k)=>{const p=new Image;p.onload=()=>y(p),p.onerror=()=>k(new Error("Битый файл изображения")),p.src=r}),s=Math.min(1,e/Math.max(t.width,t.height)),c=Math.round(t.width*s),g=Math.round(t.height*s),i=document.createElement("canvas");return i.width=c,i.height=g,i.getContext("2d").drawImage(t,0,0,c,g),i.toDataURL("image/jpeg",l)}function D(){return w.map(n=>({surname:n.surname,fullName:n.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const a={date:A(),imageDataUrl:"",people:D(),busy:!1,message:"",error:!1,usage:null},d=document.querySelector("#app");function m(n,e=!1){a.message=n,a.error=e,v()}function P(){return x?`${x}/recognize`:"/api/recognize"}async function M(){var e,l,r;if(!a.imageDataUrl){m("Сначала выбери фото листа",!0);return}const n=q(a.date);if(!n){m("Укажи дату",!0);return}a.busy=!0,m("Распознаю столбец дня…");try{const t=await fetch(P(),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imageBase64:a.imageDataUrl,mimeType:"image/jpeg",day:n,group:h,roster:w})}),s=await t.json().catch(()=>({}));if(!t.ok||!s.ok)throw new Error(s.error||`Ошибка API (${t.status})`);const c=((e=s.result)==null?void 0:e.students)||[],g=new Map(c.map(u=>[String(u.surname||"").trim().toLowerCase(),u])),i=u=>{const b=String(u??"").trim().toLowerCase();return{present:"present","+":"present",plus:"present",absent:"absent","-":"absent","−":"absent",duty:"duty",н:"duty",h:"duty",excused:"excused",о:"excused",sick:"sick",б:"sick",unknown:"unknown",unauthorized:"unauthorized",empty:"empty"}[b]||($[b]?b:null)};a.people=w.map((u,b)=>{const f=g.get(u.surname.toLowerCase())||c[b]||{},z=i(f.mark)||($[f.mark]?f.mark:"empty");return{surname:u.surname,fullName:u.fullName,mark:z,reason:"",event:!1,confidence:typeof(f==null?void 0:f.confidence)=="number"?f.confidence:null}}),a.usage=s.usage||null;const o=a.people.filter(u=>u.mark==="present").length,y=a.people.filter(u=>["absent","excused","sick","unknown","unauthorized"].includes(u.mark)).length,k=a.people.filter(u=>u.mark==="duty").length,p=a.people.filter(u=>u.mark==="empty").length,L=((l=s.usage)==null?void 0:l.cost_rub)??((r=s.usage)==null?void 0:r.cost);p===a.people.length?m("Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.",!0):m(`Готово: +${o}, нет ${y}, наряд ${k}${p?`, пусто ${p}`:""}${L!=null?` (~${Number(L).toFixed(2)} ₽)`:""}. Проверь и допиши причины.`)}catch(t){m(t.message||String(t),!0)}finally{a.busy=!1,v()}}async function E(n){if(n)try{a.busy=!0,m("Готовлю фото…"),a.imageDataUrl=await O(n),m("Фото готово — нажми «Распознать»")}catch(e){m(e.message||String(e),!0)}finally{a.busy=!1,v()}}async function R(){const n=N({group:h,dateLabel:S(a.date),people:a.people});try{await navigator.clipboard.writeText(n),m("Текст скопирован")}catch{m("Не удалось скопировать — выдели вручную",!0)}}function v(){const n=N({group:h,dateLabel:S(a.date),people:a.people});d.innerHTML=`
    <h1>Расход ${h}</h1>
    <p class="sub">Фото графика → правка → готовый текст в группу командиров</p>

    <section class="card">
      <div class="row two">
        <label>
          Дата расхода
          <input id="date" type="date" value="${a.date}" />
        </label>
        <label>
          День столбца
          <input type="text" value="${q(a.date)}" readonly />
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
      <p class="hint">Поправь отметки при ошибке. Причину и «мероприятие» вписывай сам.</p>
      <div id="people">
        ${a.people.map((e,l)=>{var t;const r=e.confidence!=null&&e.confidence<.55;return`
            <div class="person" data-i="${l}">
              <div class="person-top">
                <div class="person-name">${e.surname}</div>
                ${r?'<span class="badge warn">низкая уверенность</span>':`<span class="badge">${((t=$[e.mark])==null?void 0:t.short)||"?"}</span>`}
              </div>
              <div class="person-grid">
                <label>
                  Отметка
                  <select data-field="mark">
                    ${Object.entries($).map(([s,c])=>`<option value="${s}" ${e.mark===s?"selected":""}>${c.short} — ${c.label}</option>`).join("")}
                  </select>
                </label>
                <label>
                  Причина (если нет)
                  <input data-field="reason" type="text" placeholder="плохое самочувствие" value="${j(e.reason)}" />
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
        <textarea id="out" readonly>${T(n)}</textarea>
      </label>
      <div class="actions">
        <button class="primary" id="copy">Скопировать</button>
      </div>
    </section>
  `,d.querySelector("#date").addEventListener("change",e=>{a.date=e.target.value,v()}),d.querySelector("#file").addEventListener("change",e=>{var r;const l=(r=e.target.files)==null?void 0:r[0];E(l)}),d.querySelector("#file-camera").addEventListener("change",e=>{var r;const l=(r=e.target.files)==null?void 0:r[0];E(l)}),d.querySelector("#pick-gallery").addEventListener("click",()=>{d.querySelector("#file").click()}),d.querySelector("#pick-camera").addEventListener("click",()=>{d.querySelector("#file-camera").click()}),d.querySelector("#recognize").addEventListener("click",()=>M()),d.querySelector("#reset").addEventListener("click",()=>{a.people=D(),m("Список сброшен")}),d.querySelector("#copy").addEventListener("click",()=>R()),d.querySelectorAll(".person").forEach(e=>{const l=Number(e.dataset.i);e.querySelectorAll("[data-field]").forEach(r=>{const t=r.getAttribute("data-field"),s=()=>{t==="event"?a.people[l].event=r.checked:a.people[l][t]=r.value;const c=d.querySelector("#out");c&&(c.value=N({group:h,dateLabel:S(a.date),people:a.people}))};r.addEventListener("change",s),r.addEventListener("input",s)})})}function T(n){return String(n).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function j(n){return String(n).replaceAll('"',"&quot;").replaceAll("<","&lt;")}v();
