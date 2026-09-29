(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))l(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&l(u)}).observe(document,{childList:!0,subtree:!0});function r(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function l(a){if(a.ep)return;a.ep=!0;const s=r(a);fetch(a.href,s)}})();const D="0903-ПД3",U=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджуа",fullName:"Боджуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакшуева",fullName:"Шакшуева Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],C={present:{label:"Есть (+)",short:"+"},absent:{label:"Нет (−)",short:"−"},duty:{label:"Наряд (Н)",short:"Н"},event:{label:"Мероприятие (МП)",short:"МП"},excused:{label:"Отпущен (О)",short:"О"},sick:{label:"Болен (Б)",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка (С)",short:"С"},empty:{label:"Не распознано",short:"?"}},te=["present","absent","duty","event"];function R(n){const e=n.group||D,r=n.people||[],l=r.length,a=r.filter(c=>c.event||c.mark==="event"),s=r.filter(c=>!(c.event||c.mark==="event")&&c.mark==="duty"),u=r.filter(c=>!(c.event||c.mark==="event")&&c.mark!=="duty"&&(c.mark==="absent"||c.mark==="excused"||c.mark==="sick"||c.mark==="unknown"||c.mark==="unauthorized")),h=l-u.length-a.length-s.length,f=[`Расход группы ${e}:`,`По списку: ${l}`,`На лицо: ${h}`];if(u.length){f.push(`Отсутствуют: ${u.length}`);for(const c of u){const o=(c.reason||"").trim();f.push(o?`${c.surname} (${o})`:c.surname)}}else f.push("Отсутствуют: 0");f.push(""),f.push(`Мероприятие: ${a.length}`);for(const c of a)f.push(c.surname);f.push(""),f.push(`Наряд: ${s.length}`);for(const c of s)f.push(c.surname);return f.join(`
`).trimEnd()}const T="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function ae(){const n=new Date,e=n.getFullYear(),r=String(n.getMonth()+1).padStart(2,"0"),l=String(n.getDate()).padStart(2,"0");return`${e}-${r}-${l}`}function J(n){const e=String(n).split("-");return Number(e[2]||0)}function z(n){const[e,r,l]=String(n).split("-");return!e||!r||!l?n:`${l}.${r}.${e}`}function ne(n){return new Promise((e,r)=>{const l=new FileReader;l.onload=()=>e(l.result),l.onerror=()=>r(new Error("Не удалось прочитать файл")),l.readAsDataURL(n)})}function Q(n){return new Promise((e,r)=>{const l=new Image;l.onload=()=>e(l),l.onerror=()=>r(new Error("Битый файл изображения")),l.src=n})}function W(n,e,r,l){const a=(l*e+r)*4;return(n[a]+n[a+1]+n[a+2])/3}function re(n,e,r,l){const a=Math.floor(r*.25),s=Math.floor(r*.55),u=new Float32Array(e),h=new Float32Array(e);for(let i=0;i<e;i++){let m=0,k=0;const y=s-a;for(let d=a;d<s;d++){const S=W(n,e,i,d);m+=S,k+=S*S}const x=m/y;u[i]=x,h[i]=Math.sqrt(Math.max(0,k/y-x*x))}const f=new Float32Array(e);for(let i=0;i<e;i++)f[i]=u[i]>140&&u[i]<165&&h[i]<48?1:0;const c=new Float32Array(e);for(let i=0;i<e;i++){let m=0,k=0;for(let y=-3;y<=3;y++){const x=i+y;x>=0&&x<e&&(m+=f[x],k++)}c[i]=m/k>.5?1:0}const o=[];for(let i=0;i<e;)if(c[i]){let m=i;for(;m<e&&c[m];)m++;m-i>15&&o.push([i,m]),i=m}else i++;const p=e/6,v=Number(l)||15;let b,g;if(o.length&&v>=25){const i=o.reduce((k,y)=>y[1]-y[0]>k[1]-k[0]?y:k),m=(v-28)*p;b=Math.floor(i[1]+p*.08+m),g=Math.floor(i[1]+p*.92+m)}else v<=10?(b=Math.floor(e*.05),g=Math.floor(e*.28)):v<=20?(b=Math.floor(e*.28),g=Math.floor(e*.52)):(b=Math.floor(e*.38),g=Math.floor(e*.58));return b=Math.max(0,b),g=Math.min(e,Math.max(b+24,g)),[b,g]}function oe(n,e,r,l,a){const s=new Float32Array(r),u=new Float32Array(r);for(let o=0;o<r;o++){let p=255,v=0;const b=a-l;for(let g=l;g<a;g++){const i=W(n,e,g,o);i<p&&(p=i),v+=i}s[o]=Math.max(0,150-p),u[o]=v/b}const h=new Float32Array(r);for(let o=0;o<r;o++){let p=0,v=0;for(let b=-2;b<=2;b++){const g=o+b;g>=0&&g<r&&(p+=s[g],v++)}h[o]=p/v}let f=0;for(let o=0;o<r;o++)if(u[o]>140){f=o;break}const c=[];for(let o=f+15;o<r-40;o++)h[o]>8&&h[o]>=h[o-1]&&h[o]>=h[o+1]&&(!c.length||o-c[c.length-1]>34)&&c.push(o);return{peaks:c,paper0:f}}function se(n,e,r,l,a,s){const{peaks:u,paper0:h}=oe(n,e,r,l,a);if(u.length<3){const p=h+100,b=(r-80-p)/s;return Array.from({length:s},(g,i)=>Math.round(p+(i+.5)*b))}const f=u.length>=s+2?u[2]:u[0];let c=45,o=null;for(let p=38;p<=52;p+=.25){let v=0,b=0;for(let m=0;m<s;m++){const k=f+m*p;let y=1/0;for(const x of u){const d=Math.abs(x-k);d<y&&(y=d)}y<p*.35&&v++,b+=y}const g=v,i=-b;(!o||g>o.hits||g===o.hits&&i>o.dist)&&(o={hits:g,dist:i},c=p)}return Array.from({length:s},(p,v)=>Math.round(f+v*c))}async function le(n,e,r,l=.78){const a=await Q(n),s=a.width,u=a.height,h=Number(e)||15,f=h<=10?.32:h<=20?.5:.82,c=Math.floor(s*f),o=Math.floor(u*.05),p=Math.ceil(u*.95),v=s-c,b=p-o,g=3,i=document.createElement("canvas");i.width=Math.max(1,v*g),i.height=Math.max(1,b*g);const m=i.getContext("2d",{willReadFrequently:!0});m.imageSmoothingEnabled=!0,m.imageSmoothingQuality="high",m.drawImage(a,c,o,v,b,0,0,i.width,i.height);const k=i.width,y=i.height,x=m.getImageData(0,0,k,y),{data:d}=x,[S,w]=re(d,k,y,h),N=se(d,k,y,S,w,r);m.fillStyle="#fff",m.fillRect(0,0,S,y),m.fillRect(w,0,k-w,y);for(let A=0;A<N.length;A++){const q=N[A],I=Math.max(0,S-52),K=q-14;m.fillStyle="#ffe600",m.strokeStyle="#c80000",m.lineWidth=2,m.fillRect(I,K,S-4-I,28),m.strokeRect(I+.5,K+.5,S-4-I-1,27),m.fillStyle="#c80000",m.font="bold 22px Arial, sans-serif",m.textBaseline="middle",m.fillText(String(A+1),Math.max(4,S-46),q)}const j=N.length>1?Math.max(14,Math.round(Math.abs(N[1]-N[0])/2)):20,_=Math.max(0,N[0]-j-8),Z=Math.min(y,N[N.length-1]+j+8),B=Math.max(0,S-55),ee=Math.min(k,w+8),E=document.createElement("canvas");E.width=Math.max(1,ee-B),E.height=Math.max(1,Z-_),E.getContext("2d").drawImage(i,B,_,E.width,E.height,0,0,E.width,E.height);const O=160;if(E.width>O){const A=document.createElement("canvas");A.width=O,A.height=Math.round(E.height*O/E.width);const q=A.getContext("2d");return q.imageSmoothingEnabled=!0,q.imageSmoothingQuality="high",q.drawImage(E,0,0,A.width,A.height),A.toDataURL("image/jpeg",l)}return E.toDataURL("image/jpeg",l)}async function ce(n,e=2e3,r=.82){const l=await ne(n),a=await Q(l),s=Math.min(1,e/Math.max(a.width,a.height)),u=Math.round(a.width*s),h=Math.round(a.height*s),f=document.createElement("canvas");return f.width=u,f.height=h,f.getContext("2d").drawImage(a,0,0,u,h),{full:f.toDataURL("image/jpeg",r),crop:""}}function X(){return U.map(n=>({surname:n.surname,fullName:n.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const P="rashod_access_code",ie="nikitosbrateevo";function ue(){try{return sessionStorage.getItem(P)||""}catch{return""}}function F(n){try{n?sessionStorage.setItem(P,n):sessionStorage.removeItem(P)}catch{}}function de(n){return String(n||"").trim().replace(/\s+/g,"")}const t={accessCode:ue(),unlocked:!1,authBusy:!1,authError:"",date:ae(),imageDataUrl:"",imageCropDataUrl:"",people:X(),busy:!1,message:"",error:!1,usage:null},$=document.querySelector("#app");function M(n,e=!1){t.message=n,t.error=e,L()}function me(n){return T?`${T}${n}`:`/api${n}`}function G(){return me("/recognize")}function Y(n){const e=de(n);if(!e){t.authError="Введи код доступа",t.unlocked=!1,L();return}if(e!==ie){t.unlocked=!1,t.accessCode="",F(""),t.authError="Неверный код",L();return}t.accessCode=e,t.unlocked=!0,t.authError="",t.authBusy=!1,F(e),L()}function V(){t.unlocked=!1,t.accessCode="",F(""),t.authError="",L()}async function fe(){var e,r,l;if(!t.unlocked||!t.accessCode){M("Сначала введи код доступа",!0);return}if(!t.imageDataUrl){M("Сначала выбери фото листа",!0);return}const n=J(t.date);if(!n){M("Укажи дату",!0);return}t.busy=!0,M("Читаю знаки…");try{try{const d=await fetch(`${T||G().replace(/\/recognize$/,"")}/health`,{method:"GET",cache:"no-store"});if(!d.ok)throw new Error("health "+d.status)}catch{throw new Error("Нет связи с API (health). Проверь интернет / VPN и обнови страницу")}const s={imageDayCropBase64:await le(t.imageDataUrl,n,U.length,.72),mimeType:"image/jpeg",day:n,group:D,roster:U,accessCode:t.accessCode},u=Math.round(JSON.stringify(s).length/1024);M(`Отправляю столбец (~${u} КБ)…`);const h=new AbortController,f=setTimeout(()=>h.abort(),35e3);let c;try{c=await fetch(G(),{method:"POST",mode:"cors",credentials:"omit",cache:"no-store",headers:{"Content-Type":"application/json","X-Access-Code":t.accessCode},body:JSON.stringify(s),signal:h.signal})}finally{clearTimeout(f)}const o=await c.json().catch(()=>({}));if(c.status===401)throw V(),new Error(o.error||"Код доступа не принят");if(!c.ok||!o.ok){const d=String(o.error||"");if(/таймаут|524|timeout|не JSON|Polza/i.test(d))throw new Error(d||"Модель не успела ответить. Нажми «Распознать» ещё раз");const S=o.detail?` (${typeof o.detail=="string"?o.detail:""})`:"";throw new Error((o.error||`Ошибка API (${c.status})`)+S)}const p=((e=o.result)==null?void 0:e.students)||[],v=new Map(p.map(d=>[String(d.surname||"").trim().toLowerCase(),d])),b=d=>{const S=String(d??"").trim().toLowerCase().replaceAll(".","");return{present:"present","+":"present",plus:"present",absent:"absent","-":"absent","−":"absent",duty:"duty",н:"duty",h:"duty",event:"event",мп:"event",mp:"event",ип:"event",мероприятие:"event",excused:"excused",о:"excused",sick:"sick",б:"sick",unknown:"unknown",unauthorized:"unauthorized",empty:"empty"}[S]||(C[S]?S:null)};t.people=U.map((d,S)=>{const w=v.get(d.surname.toLowerCase())||p[S]||{},N=b(w.mark)||(C[w.mark]?w.mark:"empty");return{surname:d.surname,fullName:d.fullName,mark:N,reason:"",event:N==="event"||!!w.event,confidence:typeof(w==null?void 0:w.confidence)=="number"?w.confidence:null,disagreed:!!w.disagreed}}),t.usage=o.usage||null;const g=t.people.filter(d=>d.mark==="present").length,i=t.people.filter(d=>["absent","excused","sick","unknown","unauthorized"].includes(d.mark)).length,m=t.people.filter(d=>d.mark==="duty").length,k=t.people.filter(d=>d.mark==="empty").length,y=t.people.filter(d=>d.disagreed).length,x=((r=o.usage)==null?void 0:r.cost_rub)??((l=o.usage)==null?void 0:l.cost);if(k===t.people.length)M("Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.",!0);else{const d=["Готово",`+${g}`,`нет ${i}`,`наряд ${m}`];k&&d.push(`пусто ${k}`),y&&d.push(`спорных ${y} — проверь`),x!=null&&d.push(`~${Number(x).toFixed(2)} ₽`),M(d.join(". ")+". Допиши причины при необходимости.")}}catch(a){const s=(a==null?void 0:a.name)==="AbortError"?"Ответ не пришёл за 45с. Нажми «Распознать» ещё раз":/failed to fetch|networkerror|load failed/i.test((a==null?void 0:a.message)||"")?"Обрыв связи с API. Обычно это таймаут модели — нажми «Распознать» ещё раз через пару секунд":a.message||String(a);M(s,!0)}finally{t.busy=!1,L()}}async function H(n){if(n)try{t.busy=!0,M("Готовлю фото…");const e=await ce(n);t.imageDataUrl=e.full,t.imageCropDataUrl=e.crop,M("Фото готово — нажми «Распознать»")}catch(e){M(e.message||String(e),!0)}finally{t.busy=!1,L()}}async function he(){const n=R({group:D,dateLabel:z(t.date),people:t.people});try{await navigator.clipboard.writeText(n),M("Текст скопирован")}catch{M("Не удалось скопировать — выдели вручную",!0)}}function pe(){$.innerHTML=`
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
  `;const n=$.querySelector("#access-code"),e=()=>Y(n.value);$.querySelector("#unlock").addEventListener("click",e),n.addEventListener("keydown",r=>{r.key==="Enter"&&e()}),n.focus()}function L(){if(!t.unlocked){pe();return}const n=R({group:D,dateLabel:z(t.date),people:t.people});$.innerHTML=`
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
          <input type="text" value="${J(t.date)}" readonly />
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
        ${t.people.map((e,r)=>{var a,s,u;const l=e.confidence!=null&&e.confidence<.55;return`
            <div class="person" data-i="${r}">
              <div class="person-top">
                <div class="person-name">${e.surname}</div>
                ${l||e.mark==="empty"||e.disagreed?`<span class="badge warn">${e.disagreed?"спорно — проверь":((a=C[e.mark])==null?void 0:a.label)||"проверить"}</span>`:`<span class="badge">${((s=C[e.mark])==null?void 0:s.short)||"?"} ${((u=C[e.mark])==null?void 0:u.label)||""}</span>`}
              </div>
              <div class="quick-marks">
                ${te.map(h=>`<button type="button" class="mark-btn ${e.mark===h?"active":""}" data-quick="${h}">${C[h].short}</button>`).join("")}
                <select data-field="mark" class="mark-select" aria-label="Другая отметка">
                  ${Object.entries(C).map(([h,f])=>`<option value="${h}" ${e.mark===h?"selected":""}>${f.label}</option>`).join("")}
                </select>
              </div>
              <div class="person-grid">
                <label>
                  Причина (если нет)
                  <input data-field="reason" type="text" placeholder="плохое самочувствие" value="${ye(e.reason)}" />
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
        <textarea id="out" readonly>${ge(n)}</textarea>
      </label>
      <div class="actions">
        <button class="primary" id="copy">Скопировать</button>
      </div>
    </section>
  `,$.querySelector("#logout").addEventListener("click",()=>V()),$.querySelector("#date").addEventListener("change",e=>{t.date=e.target.value,L()}),$.querySelector("#file").addEventListener("change",e=>{var l;const r=(l=e.target.files)==null?void 0:l[0];H(r)}),$.querySelector("#file-camera").addEventListener("change",e=>{var l;const r=(l=e.target.files)==null?void 0:l[0];H(r)}),$.querySelector("#pick-gallery").addEventListener("click",()=>{$.querySelector("#file").click()}),$.querySelector("#pick-camera").addEventListener("click",()=>{$.querySelector("#file-camera").click()}),$.querySelector("#recognize").addEventListener("click",()=>fe()),$.querySelector("#reset").addEventListener("click",()=>{t.people=X(),M("Список сброшен")}),$.querySelector("#copy").addEventListener("click",()=>he()),$.querySelectorAll(".person").forEach(e=>{const r=Number(e.dataset.i),l=()=>{var f,c;const a=$.querySelector("#out");a&&(a.value=R({group:D,dateLabel:z(t.date),people:t.people}));const s=e.querySelector(".badge"),u=t.people[r].mark;s&&(s.textContent=`${((f=C[u])==null?void 0:f.short)||"?"} ${((c=C[u])==null?void 0:c.label)||""}`,s.classList.toggle("warn",u==="empty"||t.people[r].confidence!=null&&t.people[r].confidence<.55)),e.querySelectorAll(".mark-btn").forEach(o=>{o.classList.toggle("active",o.getAttribute("data-quick")===u)});const h=e.querySelector('[data-field="mark"]');h&&(h.value=u)};e.querySelectorAll("[data-quick]").forEach(a=>{a.addEventListener("click",()=>{const s=a.getAttribute("data-quick");t.people[r].mark=s,t.people[r].event=s==="event",l()})}),e.querySelectorAll("[data-field]").forEach(a=>{const s=a.getAttribute("data-field"),u=()=>{s==="event"?(t.people[r].event=a.checked,a.checked?t.people[r].mark="event":t.people[r].mark==="event"&&(t.people[r].mark="present")):(t.people[r][s]=a.value,s==="mark"&&(t.people[r].event=a.value==="event")),l()};a.addEventListener("change",u),a.addEventListener("input",u)})})}function ge(n){return String(n).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function ye(n){return String(n).replaceAll('"',"&quot;").replaceAll("<","&lt;")}function be(){if(t.accessCode){Y(t.accessCode);return}L()}be();
