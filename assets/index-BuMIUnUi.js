(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&n(u)}).observe(document,{childList:!0,subtree:!0});function o(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(t){if(t.ep)return;t.ep=!0;const s=o(t);fetch(t.href,s)}})();const f="0903-ПД3",y=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджуа",fullName:"Боджуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакирова",fullName:"Шакирова Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],b={present:{label:"На лицо",short:"+"},absent:{label:"Отсутствует",short:"−"},duty:{label:"Наряд",short:"Н"},excused:{label:"Отпущен",short:"О"},sick:{label:"Болен",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка",short:"С"},empty:{label:"Пусто",short:"·"}};function v(a){const e=a.group||f,o=a.people||[],n=o.length,t=o.filter(l=>!l.event&&l.mark==="duty"),s=o.filter(l=>l.event),u=o.filter(l=>!l.event&&l.mark!=="duty"&&(l.mark==="absent"||l.mark==="excused"||l.mark==="sick"||l.mark==="unknown"||l.mark==="unauthorized")),m=n-u.length-s.length-t.length,c=[`Расход группы ${e}:`,`По списку: ${n}`,`На лицо: ${m}`];if(u.length){c.push(`Отсутствуют: ${u.length}`);for(const l of u){const p=(l.reason||"").trim();c.push(p?`${l.surname} (${p})`:l.surname)}}else c.push("Отсутствуют: 0");c.push(""),c.push(`Мероприятие: ${s.length}`);for(const l of s)c.push(l.surname);c.push(""),c.push(`Наряд: ${t.length}`);for(const l of t)c.push(l.surname);return c.join(`
`).trimEnd()}const w="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function L(){const a=new Date,e=a.getFullYear(),o=String(a.getMonth()+1).padStart(2,"0"),n=String(a.getDate()).padStart(2,"0");return`${e}-${o}-${n}`}function N(a){const e=String(a).split("-");return Number(e[2]||0)}function $(a){const[e,o,n]=String(a).split("-");return!e||!o||!n?a:`${n}.${o}.${e}`}function x(a){return new Promise((e,o)=>{const n=new FileReader;n.onload=()=>e(n.result),n.onerror=()=>o(new Error("Не удалось прочитать файл")),n.readAsDataURL(a)})}async function E(a,e=2e3,o=.82){const n=await x(a),t=await new Promise((p,k)=>{const h=new Image;h.onload=()=>p(h),h.onerror=()=>k(new Error("Битый файл изображения")),h.src=n}),s=Math.min(1,e/Math.max(t.width,t.height)),u=Math.round(t.width*s),m=Math.round(t.height*s),c=document.createElement("canvas");return c.width=u,c.height=m,c.getContext("2d").drawImage(t,0,0,u,m),c.toDataURL("image/jpeg",o)}function S(){return y.map(a=>({surname:a.surname,fullName:a.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const r={date:L(),imageDataUrl:"",people:S(),busy:!1,message:"",error:!1,usage:null},d=document.querySelector("#app");function i(a,e=!1){r.message=a,r.error=e,g()}function D(){return w?`${w}/recognize`:"/api/recognize"}async function A(){var e,o,n;if(!r.imageDataUrl){i("Сначала выбери фото листа",!0);return}const a=N(r.date);if(!a){i("Укажи дату",!0);return}r.busy=!0,i("Распознаю столбец дня…");try{const t=await fetch(D(),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imageBase64:r.imageDataUrl,mimeType:"image/jpeg",day:a,group:f,roster:y})}),s=await t.json().catch(()=>({}));if(!t.ok||!s.ok)throw new Error(s.error||`Ошибка API (${t.status})`);const u=new Map((((e=s.result)==null?void 0:e.students)||[]).map(c=>[String(c.surname||"").toLowerCase(),c]));r.people=y.map(c=>{const l=u.get(c.surname.toLowerCase()),p=l!=null&&l.mark&&b[l.mark]?l.mark:"empty";return{surname:c.surname,fullName:c.fullName,mark:p,reason:"",event:!1,confidence:typeof(l==null?void 0:l.confidence)=="number"?l.confidence:null}}),r.usage=s.usage||null;const m=((o=s.usage)==null?void 0:o.cost_rub)??((n=s.usage)==null?void 0:n.cost);i(m!=null?`Готово. Проверь отметки и допиши причины. (~${Number(m).toFixed(2)} ₽)`:"Готово. Проверь отметки и допиши причины.")}catch(t){i(t.message||String(t),!0)}finally{r.busy=!1,g()}}async function U(a){if(a)try{r.busy=!0,i("Готовлю фото…"),r.imageDataUrl=await E(a),i("Фото готово — нажми «Распознать»")}catch(e){i(e.message||String(e),!0)}finally{r.busy=!1,g()}}async function O(){const a=v({group:f,dateLabel:$(r.date),people:r.people});try{await navigator.clipboard.writeText(a),i("Текст скопирован")}catch{i("Не удалось скопировать — выдели вручную",!0)}}function g(){const a=v({group:f,dateLabel:$(r.date),people:r.people});d.innerHTML=`
    <h1>Расход ${f}</h1>
    <p class="sub">Фото графика → правка → готовый текст в группу командиров</p>

    <section class="card">
      <div class="row two">
        <label>
          Дата расхода
          <input id="date" type="date" value="${r.date}" />
        </label>
        <label>
          День столбца
          <input type="text" value="${N(r.date)}" readonly />
        </label>
      </div>

      <div class="file-zone" style="margin-top:12px">
        <strong>Фото листа посещаемости</strong>
        <span>С телефона можно сразу с камеры</span>
        <input id="file" type="file" accept="image/*" capture="environment" />
      </div>
      ${r.imageDataUrl?`<img class="preview" alt="Превью" src="${r.imageDataUrl}" />`:""}

      <div class="actions">
        <button class="primary" id="recognize" ${r.busy||!r.imageDataUrl?"disabled":""}>
          ${r.busy?"Жди…":"Распознать"}
        </button>
        <button class="ghost" id="reset" ${r.busy?"disabled":""}>Сбросить список</button>
      </div>
      <div class="status ${r.error?"error":""}">${r.message||""}</div>
    </section>

    <section class="card">
      <p class="hint">Поправь отметки при ошибке. Причину и «мероприятие» вписывай сам.</p>
      <div id="people">
        ${r.people.map((e,o)=>{var t;const n=e.confidence!=null&&e.confidence<.55;return`
            <div class="person" data-i="${o}">
              <div class="person-top">
                <div class="person-name">${e.surname}</div>
                ${n?'<span class="badge warn">низкая уверенность</span>':`<span class="badge">${((t=b[e.mark])==null?void 0:t.short)||"?"}</span>`}
              </div>
              <div class="person-grid">
                <label>
                  Отметка
                  <select data-field="mark">
                    ${Object.entries(b).map(([s,u])=>`<option value="${s}" ${e.mark===s?"selected":""}>${u.short} — ${u.label}</option>`).join("")}
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
        <textarea id="out" readonly>${q(a)}</textarea>
      </label>
      <div class="actions">
        <button class="primary" id="copy">Скопировать</button>
      </div>
    </section>
  `,d.querySelector("#date").addEventListener("change",e=>{r.date=e.target.value,g()}),d.querySelector("#file").addEventListener("change",e=>{var n;const o=(n=e.target.files)==null?void 0:n[0];U(o)}),d.querySelector("#recognize").addEventListener("click",()=>A()),d.querySelector("#reset").addEventListener("click",()=>{r.people=S(),i("Список сброшен")}),d.querySelector("#copy").addEventListener("click",()=>O()),d.querySelectorAll(".person").forEach(e=>{const o=Number(e.dataset.i);e.querySelectorAll("[data-field]").forEach(n=>{const t=n.getAttribute("data-field"),s=()=>{t==="event"?r.people[o].event=n.checked:r.people[o][t]=n.value;const u=d.querySelector("#out");u&&(u.value=v({group:f,dateLabel:$(r.date),people:r.people}))};n.addEventListener("change",s),n.addEventListener("input",s)})})}function q(a){return String(a).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function P(a){return String(a).replaceAll('"',"&quot;").replaceAll("<","&lt;")}g();
