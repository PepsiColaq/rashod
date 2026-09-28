(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function o(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(t){if(t.ep)return;t.ep=!0;const s=o(t);fetch(t.href,s)}})();const f="0903-ПД3",h=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджуа",fullName:"Боджуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакирова",fullName:"Шакирова Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],b={present:{label:"На лицо",short:"+"},absent:{label:"Отсутствует",short:"−"},duty:{label:"Наряд",short:"Н"},excused:{label:"Отпущен",short:"О"},sick:{label:"Болен",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка",short:"С"},empty:{label:"Пусто",short:"·"}};function v(a){const e=a.group||f,o=a.people||[],r=o.length,t=o.filter(l=>!l.event&&l.mark==="duty"),s=o.filter(l=>l.event),i=o.filter(l=>!l.event&&l.mark!=="duty"&&(l.mark==="absent"||l.mark==="excused"||l.mark==="sick"||l.mark==="unknown"||l.mark==="unauthorized")),m=r-i.length-s.length-t.length,c=[`Расход группы ${e}:`,`По списку: ${r}`,`На лицо: ${m}`];if(i.length){c.push(`Отсутствуют: ${i.length}`);for(const l of i){const p=(l.reason||"").trim();c.push(p?`${l.surname} (${p})`:l.surname)}}else c.push("Отсутствуют: 0");c.push(""),c.push(`Мероприятие: ${s.length}`);for(const l of s)c.push(l.surname);c.push(""),c.push(`Наряд: ${t.length}`);for(const l of t)c.push(l.surname);return c.join(`
`).trimEnd()}const w="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function E(){const a=new Date,e=a.getFullYear(),o=String(a.getMonth()+1).padStart(2,"0"),r=String(a.getDate()).padStart(2,"0");return`${e}-${o}-${r}`}function k(a){const e=String(a).split("-");return Number(e[2]||0)}function $(a){const[e,o,r]=String(a).split("-");return!e||!o||!r?a:`${r}.${o}.${e}`}function x(a){return new Promise((e,o)=>{const r=new FileReader;r.onload=()=>e(r.result),r.onerror=()=>o(new Error("Не удалось прочитать файл")),r.readAsDataURL(a)})}async function q(a,e=2e3,o=.82){const r=await x(a),t=await new Promise((p,L)=>{const y=new Image;y.onload=()=>p(y),y.onerror=()=>L(new Error("Битый файл изображения")),y.src=r}),s=Math.min(1,e/Math.max(t.width,t.height)),i=Math.round(t.width*s),m=Math.round(t.height*s),c=document.createElement("canvas");return c.width=i,c.height=m,c.getContext("2d").drawImage(t,0,0,i,m),c.toDataURL("image/jpeg",o)}function S(){return h.map(a=>({surname:a.surname,fullName:a.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const n={date:E(),imageDataUrl:"",people:S(),busy:!1,message:"",error:!1,usage:null},u=document.querySelector("#app");function d(a,e=!1){n.message=a,n.error=e,g()}function D(){return w?`${w}/recognize`:"/api/recognize"}async function A(){var e,o,r;if(!n.imageDataUrl){d("Сначала выбери фото листа",!0);return}const a=k(n.date);if(!a){d("Укажи дату",!0);return}n.busy=!0,d("Распознаю столбец дня…");try{const t=await fetch(D(),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imageBase64:n.imageDataUrl,mimeType:"image/jpeg",day:a,group:f,roster:h})}),s=await t.json().catch(()=>({}));if(!t.ok||!s.ok)throw new Error(s.error||`Ошибка API (${t.status})`);const i=new Map((((e=s.result)==null?void 0:e.students)||[]).map(c=>[String(c.surname||"").toLowerCase(),c]));n.people=h.map(c=>{const l=i.get(c.surname.toLowerCase()),p=l!=null&&l.mark&&b[l.mark]?l.mark:"empty";return{surname:c.surname,fullName:c.fullName,mark:p,reason:"",event:!1,confidence:typeof(l==null?void 0:l.confidence)=="number"?l.confidence:null}}),n.usage=s.usage||null;const m=((o=s.usage)==null?void 0:o.cost_rub)??((r=s.usage)==null?void 0:r.cost);d(m!=null?`Готово. Проверь отметки и допиши причины. (~${Number(m).toFixed(2)} ₽)`:"Готово. Проверь отметки и допиши причины.")}catch(t){d(t.message||String(t),!0)}finally{n.busy=!1,g()}}async function N(a){if(a)try{n.busy=!0,d("Готовлю фото…"),n.imageDataUrl=await q(a),d("Фото готово — нажми «Распознать»")}catch(e){d(e.message||String(e),!0)}finally{n.busy=!1,g()}}async function U(){const a=v({group:f,dateLabel:$(n.date),people:n.people});try{await navigator.clipboard.writeText(a),d("Текст скопирован")}catch{d("Не удалось скопировать — выдели вручную",!0)}}function g(){const a=v({group:f,dateLabel:$(n.date),people:n.people});u.innerHTML=`
    <h1>Расход ${f}</h1>
    <p class="sub">Фото графика → правка → готовый текст в группу командиров</p>

    <section class="card">
      <div class="row two">
        <label>
          Дата расхода
          <input id="date" type="date" value="${n.date}" />
        </label>
        <label>
          День столбца
          <input type="text" value="${k(n.date)}" readonly />
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
      ${n.imageDataUrl?`<img class="preview" alt="Превью" src="${n.imageDataUrl}" />`:""}

      <div class="actions">
        <button class="primary" id="recognize" ${n.busy||!n.imageDataUrl?"disabled":""}>
          ${n.busy?"Жди…":"Распознать"}
        </button>
        <button class="ghost" id="reset" ${n.busy?"disabled":""}>Сбросить список</button>
      </div>
      <div class="status ${n.error?"error":""}">${n.message||""}</div>
    </section>

    <section class="card">
      <p class="hint">Поправь отметки при ошибке. Причину и «мероприятие» вписывай сам.</p>
      <div id="people">
        ${n.people.map((e,o)=>{var t;const r=e.confidence!=null&&e.confidence<.55;return`
            <div class="person" data-i="${o}">
              <div class="person-top">
                <div class="person-name">${e.surname}</div>
                ${r?'<span class="badge warn">низкая уверенность</span>':`<span class="badge">${((t=b[e.mark])==null?void 0:t.short)||"?"}</span>`}
              </div>
              <div class="person-grid">
                <label>
                  Отметка
                  <select data-field="mark">
                    ${Object.entries(b).map(([s,i])=>`<option value="${s}" ${e.mark===s?"selected":""}>${i.short} — ${i.label}</option>`).join("")}
                  </select>
                </label>
                <label>
                  Причина (если нет)
                  <input data-field="reason" type="text" placeholder="плохое самочувствие" value="${P(e.reason)}" />
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
        <textarea id="out" readonly>${O(a)}</textarea>
      </label>
      <div class="actions">
        <button class="primary" id="copy">Скопировать</button>
      </div>
    </section>
  `,u.querySelector("#date").addEventListener("change",e=>{n.date=e.target.value,g()}),u.querySelector("#file").addEventListener("change",e=>{var r;const o=(r=e.target.files)==null?void 0:r[0];N(o)}),u.querySelector("#file-camera").addEventListener("change",e=>{var r;const o=(r=e.target.files)==null?void 0:r[0];N(o)}),u.querySelector("#pick-gallery").addEventListener("click",()=>{u.querySelector("#file").click()}),u.querySelector("#pick-camera").addEventListener("click",()=>{u.querySelector("#file-camera").click()}),u.querySelector("#recognize").addEventListener("click",()=>A()),u.querySelector("#reset").addEventListener("click",()=>{n.people=S(),d("Список сброшен")}),u.querySelector("#copy").addEventListener("click",()=>U()),u.querySelectorAll(".person").forEach(e=>{const o=Number(e.dataset.i);e.querySelectorAll("[data-field]").forEach(r=>{const t=r.getAttribute("data-field"),s=()=>{t==="event"?n.people[o].event=r.checked:n.people[o][t]=r.value;const i=u.querySelector("#out");i&&(i.value=v({group:f,dateLabel:$(n.date),people:n.people}))};r.addEventListener("change",s),r.addEventListener("input",s)})})}function O(a){return String(a).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function P(a){return String(a).replaceAll('"',"&quot;").replaceAll("<","&lt;")}g();
