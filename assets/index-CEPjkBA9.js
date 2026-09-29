(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))c(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&c(d)}).observe(document,{childList:!0,subtree:!0});function r(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function c(a){if(a.ep)return;a.ep=!0;const s=r(a);fetch(a.href,s)}})();const D="0903-ПД3",T=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджгуа",fullName:"Боджгуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакшуева",fullName:"Шакшуева Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],C={present:{label:"Есть (+)",short:"+"},absent:{label:"Нет (−)",short:"−"},duty:{label:"Наряд (Н)",short:"Н"},event:{label:"Мероприятие (МП)",short:"МП"},excused:{label:"Отпущен (О)",short:"О"},sick:{label:"Болен (Б)",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка (С)",short:"С"},empty:{label:"Не распознано",short:"?"}},ee=["present","absent","duty","event"];function O(n){const e=n.group||D,r=n.people||[],c=r.length,a=r.filter(l=>l.event||l.mark==="event"),s=r.filter(l=>!(l.event||l.mark==="event")&&l.mark==="duty"),d=r.filter(l=>!(l.event||l.mark==="event")&&l.mark!=="duty"&&(l.mark==="absent"||l.mark==="excused"||l.mark==="sick"||l.mark==="unknown"||l.mark==="unauthorized")),h=c-d.length-a.length-s.length,f=[`Расход группы ${e}:`,`По списку: ${c}`,`На лицо: ${h}`];if(d.length){f.push(`Отсутствуют: ${d.length}`);for(const l of d){const o=(l.reason||"").trim();f.push(o?`${l.surname} (${o})`:l.surname)}}else f.push("Отсутствуют: 0");f.push(""),f.push(`Мероприятие: ${a.length}`);for(const l of a)f.push(l.surname);f.push(""),f.push(`Наряд: ${s.length}`);for(const l of s)f.push(l.surname);return f.join(`
`).trimEnd()}const P="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function te(){const n=new Date,e=n.getFullYear(),r=String(n.getMonth()+1).padStart(2,"0"),c=String(n.getDate()).padStart(2,"0");return`${e}-${r}-${c}`}function H(n){const e=String(n).split("-");return Number(e[2]||0)}function R(n){const[e,r,c]=String(n).split("-");return!e||!r||!c?n:`${c}.${r}.${e}`}function ae(n){return new Promise((e,r)=>{const c=new FileReader;c.onload=()=>e(c.result),c.onerror=()=>r(new Error("Не удалось прочитать файл")),c.readAsDataURL(n)})}function J(n){return new Promise((e,r)=>{const c=new Image;c.onload=()=>e(c),c.onerror=()=>r(new Error("Битый файл изображения")),c.src=n})}function Q(n,e,r,c){const a=(c*e+r)*4;return(n[a]+n[a+1]+n[a+2])/3}function ne(n,e,r,c){const a=Math.floor(r*.25),s=Math.floor(r*.55),d=new Float32Array(e),h=new Float32Array(e);for(let i=0;i<e;i++){let m=0,w=0;const y=s-a;for(let u=a;u<s;u++){const v=Q(n,e,i,u);m+=v,w+=v*v}const E=m/y;d[i]=E,h[i]=Math.sqrt(Math.max(0,w/y-E*E))}const f=new Float32Array(e);for(let i=0;i<e;i++)f[i]=d[i]>140&&d[i]<165&&h[i]<48?1:0;const l=new Float32Array(e);for(let i=0;i<e;i++){let m=0,w=0;for(let y=-3;y<=3;y++){const E=i+y;E>=0&&E<e&&(m+=f[E],w++)}l[i]=m/w>.5?1:0}const o=[];for(let i=0;i<e;)if(l[i]){let m=i;for(;m<e&&l[m];)m++;m-i>15&&o.push([i,m]),i=m}else i++;const p=e/6,k=Number(c)||15;let b,g;if(o.length&&k>=25){const i=o.reduce((w,y)=>y[1]-y[0]>w[1]-w[0]?y:w),m=(k-28)*p;b=Math.floor(i[1]+p*.08+m),g=Math.floor(i[1]+p*.92+m)}else k<=10?(b=Math.floor(e*.05),g=Math.floor(e*.28)):k<=20?(b=Math.floor(e*.28),g=Math.floor(e*.52)):(b=Math.floor(e*.38),g=Math.floor(e*.58));return b=Math.max(0,b),g=Math.min(e,Math.max(b+24,g)),[b,g]}function re(n,e,r,c,a){const s=new Float32Array(r),d=new Float32Array(r);for(let o=0;o<r;o++){let p=255,k=0;const b=a-c;for(let g=c;g<a;g++){const i=Q(n,e,g,o);i<p&&(p=i),k+=i}s[o]=Math.max(0,150-p),d[o]=k/b}const h=new Float32Array(r);for(let o=0;o<r;o++){let p=0,k=0;for(let b=-2;b<=2;b++){const g=o+b;g>=0&&g<r&&(p+=s[g],k++)}h[o]=p/k}let f=0;for(let o=0;o<r;o++)if(d[o]>140){f=o;break}const l=[];for(let o=f+15;o<r-40;o++)h[o]>8&&h[o]>=h[o-1]&&h[o]>=h[o+1]&&(!l.length||o-l[l.length-1]>22)&&l.push(o);return{peaks:l,paper0:f}}function oe(n,e,r,c,a,s){const{peaks:d,paper0:h}=re(n,e,r,c,a);if(d.length<3){const p=h+100,b=(r-80-p)/s;return Array.from({length:s},(g,i)=>Math.round(p+(i+.5)*b))}const f=d.length>=s+2?d[2]:d[0];let l=45,o=null;for(let p=25;p<=40;p+=.25){let k=0,b=0;for(let m=0;m<s;m++){const w=f+m*p;let y=1/0;for(const E of d){const u=Math.abs(E-w);u<y&&(y=u)}y<p*.35&&k++,b+=y}const g=k,i=-b;(!o||g>o.hits||g===o.hits&&i>o.dist)&&(o={hits:g,dist:i},l=p)}return Array.from({length:s},(p,k)=>Math.round(f+k*l))}async function se(n,e,r,c=.78){const a=await J(n),s=a.width,d=a.height,h=Number(e)||15,f=h<=10?.32:h<=20?.5:.82,l=Math.floor(s*f),o=Math.floor(d*.05),p=Math.ceil(d*.95),k=s-l,b=p-o,g=2,i=document.createElement("canvas");i.width=Math.max(1,k*g),i.height=Math.max(1,b*g);const m=i.getContext("2d",{willReadFrequently:!0});m.imageSmoothingEnabled=!0,m.imageSmoothingQuality="high",m.drawImage(a,l,o,k,b,0,0,i.width,i.height);const w=i.width,y=i.height,E=m.getImageData(0,0,w,y),{data:u}=E,[v,S]=ne(u,w,y,h),A=oe(u,w,y,v,S,r);m.fillStyle="#fff",m.fillRect(0,0,v,y),m.fillRect(S,0,w-S,y);for(let N=0;N<A.length;N++){const q=A[N],I=Math.max(0,v-52),K=q-14;m.fillStyle="#ffe600",m.strokeStyle="#c80000",m.lineWidth=2,m.fillRect(I,K,v-4-I,28),m.strokeRect(I+.5,K+.5,v-4-I-1,27),m.fillStyle="#c80000",m.font="bold 22px Arial, sans-serif",m.textBaseline="middle",m.fillText(String(N+1),Math.max(4,v-46),q)}const j=A.length>1?Math.max(14,Math.round(Math.abs(A[1]-A[0])/2)):20,_=Math.max(0,A[0]-j-8),V=Math.min(y,A[A.length-1]+j+8),B=Math.max(0,v-55),Z=Math.min(w,S+8),M=document.createElement("canvas");M.width=Math.max(1,Z-B),M.height=Math.max(1,V-_),M.getContext("2d").drawImage(i,B,_,M.width,M.height,0,0,M.width,M.height);const U=160;if(M.width>U){const N=document.createElement("canvas");N.width=U,N.height=Math.round(M.height*U/M.width);const q=N.getContext("2d");return q.imageSmoothingEnabled=!0,q.imageSmoothingQuality="high",q.drawImage(M,0,0,N.width,N.height),N.toDataURL("image/jpeg",c)}return M.toDataURL("image/jpeg",c)}async function le(n,e=2e3,r=.82){const c=await ae(n),a=await J(c),s=Math.min(1,e/Math.max(a.width,a.height)),d=Math.round(a.width*s),h=Math.round(a.height*s),f=document.createElement("canvas");return f.width=d,f.height=h,f.getContext("2d").drawImage(a,0,0,d,h),{full:f.toDataURL("image/jpeg",r),crop:""}}function W(){return T.map(n=>({surname:n.surname,fullName:n.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const z="rashod_access_code",ce="nikitosbrateevo";function ie(){try{return sessionStorage.getItem(z)||""}catch{return""}}function F(n){try{n?sessionStorage.setItem(z,n):sessionStorage.removeItem(z)}catch{}}function ue(n){return String(n||"").trim().replace(/\s+/g,"")}const t={accessCode:ie(),unlocked:!1,authBusy:!1,authError:"",date:te(),imageDataUrl:"",imageCropDataUrl:"",people:W(),busy:!1,message:"",error:!1,usage:null},$=document.querySelector("#app");function x(n,e=!1){t.message=n,t.error=e,L()}function de(n){return P?`${P}${n}`:`/api${n}`}function me(){return de("/recognize")}function X(n){const e=ue(n);if(!e){t.authError="Введи код доступа",t.unlocked=!1,L();return}if(e!==ce){t.unlocked=!1,t.accessCode="",F(""),t.authError="Неверный код",L();return}t.accessCode=e,t.unlocked=!0,t.authError="",t.authBusy=!1,F(e),L()}function Y(){t.unlocked=!1,t.accessCode="",F(""),t.authError="",L()}async function fe(){var e,r,c;if(!t.unlocked||!t.accessCode){x("Сначала введи код доступа",!0);return}if(!t.imageDataUrl){x("Сначала выбери фото листа",!0);return}const n=H(t.date);if(!n){x("Укажи дату",!0);return}t.busy=!0,x("Читаю знаки…");try{const a=(P||"https://rashod-api.voyc-nikita.workers.dev").replace(/\/$/,"");x("Проверяю API…");try{const u=new AbortController,v=setTimeout(()=>u.abort(),8e3),S=await fetch(`${a}/health`,{method:"GET",cache:"no-store",signal:u.signal});if(clearTimeout(v),!S.ok)throw new Error("health "+S.status)}catch{throw new Error("Нет связи с API. Проверь интернет и обнови страницу")}x("Режу столбец дня…");const d={imageDayCropBase64:await Promise.race([se(t.imageDataUrl,n,T.length,.7),new Promise((u,v)=>setTimeout(()=>v(new Error("Нарезка фото зависла. Выбери фото ещё раз")),2e4))]),mimeType:"image/jpeg",day:n,group:D,roster:T,accessCode:t.accessCode},h=Math.round(JSON.stringify(d).length/1024);x(`Отправляю (~${h} КБ)…`);async function f(u){const v=new AbortController,S=setTimeout(()=>v.abort(),u*1e3);try{return await fetch(me(),{method:"POST",mode:"cors",credentials:"omit",cache:"no-store",headers:{"Content-Type":"application/json","X-Access-Code":t.accessCode},body:JSON.stringify(d),signal:v.signal})}finally{clearTimeout(S)}}let l;try{l=await f(25)}catch{x("Повторная попытка…"),await new Promise(u=>setTimeout(u,600)),l=await f(25)}const o=await l.json().catch(()=>({}));if(l.status===401)throw Y(),new Error(o.error||"Код доступа не принят");if(!l.ok||!o.ok){const u=String(o.error||"");throw/таймаут|524|timeout|не JSON|Polza/i.test(u)?new Error("Модель не успела. Подожди 3 сек и нажми «Распознать» снова"):new Error(o.error||`Ошибка API (${l.status})`)}const p=((e=o.result)==null?void 0:e.students)||[],k=new Map(p.map(u=>[String(u.surname||"").trim().toLowerCase(),u])),b=u=>{const v=String(u??"").trim().toLowerCase().replaceAll(".","");return{present:"present","+":"present",plus:"present",absent:"absent","-":"absent","−":"absent",duty:"duty",н:"duty",h:"duty",event:"event",мп:"event",mp:"event",ип:"event",мероприятие:"event",excused:"excused",о:"excused",sick:"sick",б:"sick",unknown:"unknown",unauthorized:"unauthorized",empty:"empty"}[v]||(C[v]?v:null)};t.people=T.map((u,v)=>{const S=k.get(u.surname.toLowerCase())||p[v]||{},A=b(S.mark)||(C[S.mark]?S.mark:"empty");return{surname:u.surname,fullName:u.fullName,mark:A,reason:"",event:A==="event"||!!S.event,confidence:typeof(S==null?void 0:S.confidence)=="number"?S.confidence:null,disagreed:!!S.disagreed}}),t.usage=o.usage||null;const g=t.people.filter(u=>u.mark==="present").length,i=t.people.filter(u=>["absent","excused","sick","unknown","unauthorized"].includes(u.mark)).length,m=t.people.filter(u=>u.mark==="duty").length,w=t.people.filter(u=>u.mark==="empty").length,y=t.people.filter(u=>u.disagreed).length,E=((r=o.usage)==null?void 0:r.cost_rub)??((c=o.usage)==null?void 0:c.cost);if(w===t.people.length)x("Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.",!0);else{const u=["Готово",`+${g}`,`нет ${i}`,`наряд ${m}`];w&&u.push(`пусто ${w}`),y&&u.push(`спорных ${y} — проверь`),E!=null&&u.push(`~${Number(E).toFixed(2)} ₽`),x(u.join(". ")+". Допиши причины при необходимости.")}}catch(a){const s=(a==null?void 0:a.name)==="AbortError"?"Ответ не пришёл вовремя. Нажми «Распознать» ещё раз":/failed to fetch|networkerror|load failed/i.test((a==null?void 0:a.message)||"")?"Обрыв связи с API. Подожди 2 сек и нажми «Распознать» снова":a.message||String(a);x(s,!0)}finally{t.busy=!1,L()}}async function G(n){if(n)try{t.busy=!0,x("Готовлю фото…");const e=await le(n);t.imageDataUrl=e.full,t.imageCropDataUrl=e.crop,x("Фото готово — нажми «Распознать»")}catch(e){x(e.message||String(e),!0)}finally{t.busy=!1,L()}}async function he(){const n=O({group:D,dateLabel:R(t.date),people:t.people});try{await navigator.clipboard.writeText(n),x("Текст скопирован")}catch{x("Не удалось скопировать — выдели вручную",!0)}}function pe(){$.innerHTML=`
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
  `;const n=$.querySelector("#access-code"),e=()=>X(n.value);$.querySelector("#unlock").addEventListener("click",e),n.addEventListener("keydown",r=>{r.key==="Enter"&&e()}),n.focus()}function L(){if(!t.unlocked){pe();return}const n=O({group:D,dateLabel:R(t.date),people:t.people});$.innerHTML=`
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
          <input type="text" value="${H(t.date)}" readonly />
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
        ${t.people.map((e,r)=>{var a,s,d;const c=e.confidence!=null&&e.confidence<.55;return`
            <div class="person" data-i="${r}">
              <div class="person-top">
                <div class="person-name">${e.surname}</div>
                ${c||e.mark==="empty"||e.disagreed?`<span class="badge warn">${e.disagreed?"спорно — проверь":((a=C[e.mark])==null?void 0:a.label)||"проверить"}</span>`:`<span class="badge">${((s=C[e.mark])==null?void 0:s.short)||"?"} ${((d=C[e.mark])==null?void 0:d.label)||""}</span>`}
              </div>
              <div class="quick-marks">
                ${ee.map(h=>`<button type="button" class="mark-btn ${e.mark===h?"active":""}" data-quick="${h}">${C[h].short}</button>`).join("")}
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
  `,$.querySelector("#logout").addEventListener("click",()=>Y()),$.querySelector("#date").addEventListener("change",e=>{t.date=e.target.value,L()}),$.querySelector("#file").addEventListener("change",e=>{var c;const r=(c=e.target.files)==null?void 0:c[0];G(r)}),$.querySelector("#file-camera").addEventListener("change",e=>{var c;const r=(c=e.target.files)==null?void 0:c[0];G(r)}),$.querySelector("#pick-gallery").addEventListener("click",()=>{$.querySelector("#file").click()}),$.querySelector("#pick-camera").addEventListener("click",()=>{$.querySelector("#file-camera").click()}),$.querySelector("#recognize").addEventListener("click",()=>fe()),$.querySelector("#reset").addEventListener("click",()=>{t.people=W(),x("Список сброшен")}),$.querySelector("#copy").addEventListener("click",()=>he()),$.querySelectorAll(".person").forEach(e=>{const r=Number(e.dataset.i),c=()=>{var f,l;const a=$.querySelector("#out");a&&(a.value=O({group:D,dateLabel:R(t.date),people:t.people}));const s=e.querySelector(".badge"),d=t.people[r].mark;s&&(s.textContent=`${((f=C[d])==null?void 0:f.short)||"?"} ${((l=C[d])==null?void 0:l.label)||""}`,s.classList.toggle("warn",d==="empty"||t.people[r].confidence!=null&&t.people[r].confidence<.55)),e.querySelectorAll(".mark-btn").forEach(o=>{o.classList.toggle("active",o.getAttribute("data-quick")===d)});const h=e.querySelector('[data-field="mark"]');h&&(h.value=d)};e.querySelectorAll("[data-quick]").forEach(a=>{a.addEventListener("click",()=>{const s=a.getAttribute("data-quick");t.people[r].mark=s,t.people[r].event=s==="event",c()})}),e.querySelectorAll("[data-field]").forEach(a=>{const s=a.getAttribute("data-field"),d=()=>{s==="event"?(t.people[r].event=a.checked,a.checked?t.people[r].mark="event":t.people[r].mark==="event"&&(t.people[r].mark="present")):(t.people[r][s]=a.value,s==="mark"&&(t.people[r].event=a.value==="event")),c()};a.addEventListener("change",d),a.addEventListener("input",d)})})}function ge(n){return String(n).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function ye(n){return String(n).replaceAll('"',"&quot;").replaceAll("<","&lt;")}function be(){if(t.accessCode){X(t.accessCode);return}L()}be();
