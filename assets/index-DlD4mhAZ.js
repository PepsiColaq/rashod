(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&i(u)}).observe(document,{childList:!0,subtree:!0});function r(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=r(a);fetch(a.href,s)}})();const L="0903-ПД3",I=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджуа",fullName:"Боджуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакшуева",fullName:"Шакшуева Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],N={present:{label:"Есть (+)",short:"+"},absent:{label:"Нет (−)",short:"−"},duty:{label:"Наряд (Н)",short:"Н"},event:{label:"Мероприятие (МП)",short:"МП"},excused:{label:"Отпущен (О)",short:"О"},sick:{label:"Болен (Б)",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка (С)",short:"С"},empty:{label:"Не распознано",short:"?"}},Z=["present","absent","duty","event"];function U(n){const e=n.group||L,r=n.people||[],i=r.length,a=r.filter(l=>l.event||l.mark==="event"),s=r.filter(l=>!(l.event||l.mark==="event")&&l.mark==="duty"),u=r.filter(l=>!(l.event||l.mark==="event")&&l.mark!=="duty"&&(l.mark==="absent"||l.mark==="excused"||l.mark==="sick"||l.mark==="unknown"||l.mark==="unauthorized")),p=i-u.length-a.length-s.length,f=[`Расход группы ${e}:`,`По списку: ${i}`,`На лицо: ${p}`];if(u.length){f.push(`Отсутствуют: ${u.length}`);for(const l of u){const o=(l.reason||"").trim();f.push(o?`${l.surname} (${o})`:l.surname)}}else f.push("Отсутствуют: 0");f.push(""),f.push(`Мероприятие: ${a.length}`);for(const l of a)f.push(l.surname);f.push(""),f.push(`Наряд: ${s.length}`);for(const l of s)f.push(l.surname);return f.join(`
`).trimEnd()}const B="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function ee(){const n=new Date,e=n.getFullYear(),r=String(n.getMonth()+1).padStart(2,"0"),i=String(n.getDate()).padStart(2,"0");return`${e}-${r}-${i}`}function G(n){const e=String(n).split("-");return Number(e[2]||0)}function O(n){const[e,r,i]=String(n).split("-");return!e||!r||!i?n:`${i}.${r}.${e}`}function te(n){return new Promise((e,r)=>{const i=new FileReader;i.onload=()=>e(i.result),i.onerror=()=>r(new Error("Не удалось прочитать файл")),i.readAsDataURL(n)})}function H(n){return new Promise((e,r)=>{const i=new Image;i.onload=()=>e(i),i.onerror=()=>r(new Error("Битый файл изображения")),i.src=n})}function J(n,e,r,i){const a=(i*e+r)*4;return(n[a]+n[a+1]+n[a+2])/3}function ae(n,e,r,i){const a=Math.floor(r*.25),s=Math.floor(r*.55),u=new Float32Array(e),p=new Float32Array(e);for(let c=0;c<e;c++){let d=0,k=0;const y=s-a;for(let m=a;m<s;m++){const S=J(n,e,c,m);d+=S,k+=S*S}const M=d/y;u[c]=M,p[c]=Math.sqrt(Math.max(0,k/y-M*M))}const f=new Float32Array(e);for(let c=0;c<e;c++)f[c]=u[c]>140&&u[c]<165&&p[c]<48?1:0;const l=new Float32Array(e);for(let c=0;c<e;c++){let d=0,k=0;for(let y=-3;y<=3;y++){const M=c+y;M>=0&&M<e&&(d+=f[M],k++)}l[c]=d/k>.5?1:0}const o=[];for(let c=0;c<e;)if(l[c]){let d=c;for(;d<e&&l[d];)d++;d-c>15&&o.push([c,d]),c=d}else c++;const h=e/6,v=Number(i)||15;let b,g;if(o.length&&v>=25){const c=o.reduce((k,y)=>y[1]-y[0]>k[1]-k[0]?y:k),d=(v-28)*h;b=Math.floor(c[1]+h*.08+d),g=Math.floor(c[1]+h*.92+d)}else v<=10?(b=Math.floor(e*.05),g=Math.floor(e*.28)):v<=20?(b=Math.floor(e*.28),g=Math.floor(e*.52)):(b=Math.floor(e*.38),g=Math.floor(e*.58));return b=Math.max(0,b),g=Math.min(e,Math.max(b+24,g)),[b,g]}function ne(n,e,r,i,a){const s=new Float32Array(r),u=new Float32Array(r);for(let o=0;o<r;o++){let h=255,v=0;const b=a-i;for(let g=i;g<a;g++){const c=J(n,e,g,o);c<h&&(h=c),v+=c}s[o]=Math.max(0,150-h),u[o]=v/b}const p=new Float32Array(r);for(let o=0;o<r;o++){let h=0,v=0;for(let b=-2;b<=2;b++){const g=o+b;g>=0&&g<r&&(h+=s[g],v++)}p[o]=h/v}let f=0;for(let o=0;o<r;o++)if(u[o]>140){f=o;break}const l=[];for(let o=f+15;o<r-40;o++)p[o]>8&&p[o]>=p[o-1]&&p[o]>=p[o+1]&&(!l.length||o-l[l.length-1]>34)&&l.push(o);return{peaks:l,paper0:f}}function re(n,e,r,i,a,s){const{peaks:u,paper0:p}=ne(n,e,r,i,a);if(u.length<3){const h=p+100,b=(r-80-h)/s;return Array.from({length:s},(g,c)=>Math.round(h+(c+.5)*b))}const f=u.length>=s+2?u[2]:u[0];let l=45,o=null;for(let h=38;h<=52;h+=.25){let v=0,b=0;for(let d=0;d<s;d++){const k=f+d*h;let y=1/0;for(const M of u){const m=Math.abs(M-k);m<y&&(y=m)}y<h*.35&&v++,b+=y}const g=v,c=-b;(!o||g>o.hits||g===o.hits&&c>o.dist)&&(o={hits:g,dist:c},l=h)}return Array.from({length:s},(h,v)=>Math.round(f+v*l))}async function oe(n,e,r,i=.88){const a=await H(n),s=a.width,u=a.height,p=Number(e)||15,f=p<=10?.32:p<=20?.5:.82,l=Math.floor(s*f),o=Math.floor(u*.05),h=Math.ceil(u*.95),v=s-l,b=h-o,g=3,c=document.createElement("canvas");c.width=Math.max(1,v*g),c.height=Math.max(1,b*g);const d=c.getContext("2d",{willReadFrequently:!0});d.imageSmoothingEnabled=!0,d.imageSmoothingQuality="high",d.drawImage(a,l,o,v,b,0,0,c.width,c.height);const k=c.width,y=c.height,M=d.getImageData(0,0,k,y),{data:m}=M,[S,x]=ae(m,k,y,p),E=re(m,k,y,S,x,r);d.fillStyle="#fff",d.fillRect(0,0,S,y),d.fillRect(x,0,k-x,y);for(let q=0;q<E.length;q++){const j=E[q],D=Math.max(0,S-52),_=j-14;d.fillStyle="#ffe600",d.strokeStyle="#c80000",d.lineWidth=2,d.fillRect(D,_,S-4-D,28),d.strokeRect(D+.5,_+.5,S-4-D-1,27),d.fillStyle="#c80000",d.font="bold 22px Arial, sans-serif",d.textBaseline="middle",d.fillText(String(q+1),Math.max(4,S-46),j)}const T=E.length>1?Math.max(14,Math.round(Math.abs(E[1]-E[0])/2)):20,z=Math.max(0,E[0]-T-8),W=Math.min(y,E[E.length-1]+T+8),P=Math.max(0,S-55),V=Math.min(k,x+8),C=document.createElement("canvas");return C.width=Math.max(1,V-P),C.height=Math.max(1,W-z),C.getContext("2d").drawImage(c,P,z,C.width,C.height,0,0,C.width,C.height),C.toDataURL("image/jpeg",i)}async function se(n,e=2e3,r=.82){const i=await te(n),a=await H(i),s=Math.min(1,e/Math.max(a.width,a.height)),u=Math.round(a.width*s),p=Math.round(a.height*s),f=document.createElement("canvas");return f.width=u,f.height=p,f.getContext("2d").drawImage(a,0,0,u,p),{full:f.toDataURL("image/jpeg",r),crop:""}}function Q(){return I.map(n=>({surname:n.surname,fullName:n.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const F="rashod_access_code",le="nikitosbrateevo";function ce(){try{return sessionStorage.getItem(F)||""}catch{return""}}function R(n){try{n?sessionStorage.setItem(F,n):sessionStorage.removeItem(F)}catch{}}function ie(n){return String(n||"").trim().replace(/\s+/g,"")}const t={accessCode:ce(),unlocked:!1,authBusy:!1,authError:"",date:ee(),imageDataUrl:"",imageCropDataUrl:"",people:Q(),busy:!1,message:"",error:!1,usage:null},$=document.querySelector("#app");function w(n,e=!1){t.message=n,t.error=e,A()}function ue(n){return B?`${B}${n}`:`/api${n}`}function de(){return ue("/recognize")}function X(n){const e=ie(n);if(!e){t.authError="Введи код доступа",t.unlocked=!1,A();return}if(e!==le){t.unlocked=!1,t.accessCode="",R(""),t.authError="Неверный код",A();return}t.accessCode=e,t.unlocked=!0,t.authError="",t.authBusy=!1,R(e),A()}function Y(){t.unlocked=!1,t.accessCode="",R(""),t.authError="",A()}async function fe(){var e,r,i;if(!t.unlocked||!t.accessCode){w("Сначала введи код доступа",!0);return}if(!t.imageDataUrl){w("Сначала выбери фото листа",!0);return}const n=G(t.date);if(!n){w("Укажи дату",!0);return}t.busy=!0,w("Читаю знаки по клеткам (1× Pro)…");try{const s={imageDayCropBase64:await oe(t.imageDataUrl,n,I.length,.82),mimeType:"image/jpeg",day:n,group:L,roster:I,accessCode:t.accessCode},u=Math.round(JSON.stringify(s).length/1024);w(`Отправляю столбец (~${u} КБ)…`);const p=new AbortController,f=setTimeout(()=>p.abort(),12e4);let l;try{l=await fetch(de(),{method:"POST",headers:{"Content-Type":"application/json","X-Access-Code":t.accessCode},body:JSON.stringify(s),signal:p.signal})}finally{clearTimeout(f)}const o=await l.json().catch(()=>({}));if(l.status===401)throw Y(),new Error(o.error||"Код доступа не принят");if(!l.ok||!o.ok){const m=o.detail?` (${typeof o.detail=="string"?o.detail:""})`:"";throw new Error((o.error||`Ошибка API (${l.status})`)+m)}const h=((e=o.result)==null?void 0:e.students)||[],v=new Map(h.map(m=>[String(m.surname||"").trim().toLowerCase(),m])),b=m=>{const S=String(m??"").trim().toLowerCase().replaceAll(".","");return{present:"present","+":"present",plus:"present",absent:"absent","-":"absent","−":"absent",duty:"duty",н:"duty",h:"duty",event:"event",мп:"event",mp:"event",ип:"event",мероприятие:"event",excused:"excused",о:"excused",sick:"sick",б:"sick",unknown:"unknown",unauthorized:"unauthorized",empty:"empty"}[S]||(N[S]?S:null)};t.people=I.map((m,S)=>{const x=v.get(m.surname.toLowerCase())||h[S]||{},E=b(x.mark)||(N[x.mark]?x.mark:"empty");return{surname:m.surname,fullName:m.fullName,mark:E,reason:"",event:E==="event"||!!x.event,confidence:typeof(x==null?void 0:x.confidence)=="number"?x.confidence:null,disagreed:!!x.disagreed}}),t.usage=o.usage||null;const g=t.people.filter(m=>m.mark==="present").length,c=t.people.filter(m=>["absent","excused","sick","unknown","unauthorized"].includes(m.mark)).length,d=t.people.filter(m=>m.mark==="duty").length,k=t.people.filter(m=>m.mark==="empty").length,y=t.people.filter(m=>m.disagreed).length,M=((r=o.usage)==null?void 0:r.cost_rub)??((i=o.usage)==null?void 0:i.cost);if(k===t.people.length)w("Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.",!0);else{const m=["Готово",`+${g}`,`нет ${c}`,`наряд ${d}`];k&&m.push(`пусто ${k}`),y&&m.push(`спорных ${y} — проверь`),M!=null&&m.push(`~${Number(M).toFixed(2)} ₽`),w(m.join(". ")+". Допиши причины при необходимости.")}}catch(a){const s=(a==null?void 0:a.name)==="AbortError"?"Сервер не ответил за 2 мин. Попробуй ещё раз или другое фото":/failed to fetch|networkerror|load failed/i.test((a==null?void 0:a.message)||"")?"Не удалось связаться с API (Failed to fetch). Обнови страницу и попробуй ещё раз":a.message||String(a);w(s,!0)}finally{t.busy=!1,A()}}async function K(n){if(n)try{t.busy=!0,w("Готовлю фото…");const e=await se(n);t.imageDataUrl=e.full,t.imageCropDataUrl=e.crop,w("Фото готово — нажми «Распознать»")}catch(e){w(e.message||String(e),!0)}finally{t.busy=!1,A()}}async function me(){const n=U({group:L,dateLabel:O(t.date),people:t.people});try{await navigator.clipboard.writeText(n),w("Текст скопирован")}catch{w("Не удалось скопировать — выдели вручную",!0)}}function pe(){$.innerHTML=`
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
  `;const n=$.querySelector("#access-code"),e=()=>X(n.value);$.querySelector("#unlock").addEventListener("click",e),n.addEventListener("keydown",r=>{r.key==="Enter"&&e()}),n.focus()}function A(){if(!t.unlocked){pe();return}const n=U({group:L,dateLabel:O(t.date),people:t.people});$.innerHTML=`
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
        ${t.people.map((e,r)=>{var a,s,u;const i=e.confidence!=null&&e.confidence<.55;return`
            <div class="person" data-i="${r}">
              <div class="person-top">
                <div class="person-name">${e.surname}</div>
                ${i||e.mark==="empty"||e.disagreed?`<span class="badge warn">${e.disagreed?"спорно — проверь":((a=N[e.mark])==null?void 0:a.label)||"проверить"}</span>`:`<span class="badge">${((s=N[e.mark])==null?void 0:s.short)||"?"} ${((u=N[e.mark])==null?void 0:u.label)||""}</span>`}
              </div>
              <div class="quick-marks">
                ${Z.map(p=>`<button type="button" class="mark-btn ${e.mark===p?"active":""}" data-quick="${p}">${N[p].short}</button>`).join("")}
                <select data-field="mark" class="mark-select" aria-label="Другая отметка">
                  ${Object.entries(N).map(([p,f])=>`<option value="${p}" ${e.mark===p?"selected":""}>${f.label}</option>`).join("")}
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
        <textarea id="out" readonly>${he(n)}</textarea>
      </label>
      <div class="actions">
        <button class="primary" id="copy">Скопировать</button>
      </div>
    </section>
  `,$.querySelector("#logout").addEventListener("click",()=>Y()),$.querySelector("#date").addEventListener("change",e=>{t.date=e.target.value,A()}),$.querySelector("#file").addEventListener("change",e=>{var i;const r=(i=e.target.files)==null?void 0:i[0];K(r)}),$.querySelector("#file-camera").addEventListener("change",e=>{var i;const r=(i=e.target.files)==null?void 0:i[0];K(r)}),$.querySelector("#pick-gallery").addEventListener("click",()=>{$.querySelector("#file").click()}),$.querySelector("#pick-camera").addEventListener("click",()=>{$.querySelector("#file-camera").click()}),$.querySelector("#recognize").addEventListener("click",()=>fe()),$.querySelector("#reset").addEventListener("click",()=>{t.people=Q(),w("Список сброшен")}),$.querySelector("#copy").addEventListener("click",()=>me()),$.querySelectorAll(".person").forEach(e=>{const r=Number(e.dataset.i),i=()=>{var f,l;const a=$.querySelector("#out");a&&(a.value=U({group:L,dateLabel:O(t.date),people:t.people}));const s=e.querySelector(".badge"),u=t.people[r].mark;s&&(s.textContent=`${((f=N[u])==null?void 0:f.short)||"?"} ${((l=N[u])==null?void 0:l.label)||""}`,s.classList.toggle("warn",u==="empty"||t.people[r].confidence!=null&&t.people[r].confidence<.55)),e.querySelectorAll(".mark-btn").forEach(o=>{o.classList.toggle("active",o.getAttribute("data-quick")===u)});const p=e.querySelector('[data-field="mark"]');p&&(p.value=u)};e.querySelectorAll("[data-quick]").forEach(a=>{a.addEventListener("click",()=>{const s=a.getAttribute("data-quick");t.people[r].mark=s,t.people[r].event=s==="event",i()})}),e.querySelectorAll("[data-field]").forEach(a=>{const s=a.getAttribute("data-field"),u=()=>{s==="event"?(t.people[r].event=a.checked,a.checked?t.people[r].mark="event":t.people[r].mark==="event"&&(t.people[r].mark="present")):(t.people[r][s]=a.value,s==="mark"&&(t.people[r].event=a.value==="event")),i()};a.addEventListener("change",u),a.addEventListener("input",u)})})}function he(n){return String(n).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function ge(n){return String(n).replaceAll('"',"&quot;").replaceAll("<","&lt;")}function ye(){if(t.accessCode){X(t.accessCode);return}A()}ye();
