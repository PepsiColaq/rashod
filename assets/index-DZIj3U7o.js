(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))l(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&l(u)}).observe(document,{childList:!0,subtree:!0});function r(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function l(a){if(a.ep)return;a.ep=!0;const s=r(a);fetch(a.href,s)}})();const D="0903-ПД3",U=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджуа",fullName:"Боджуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакшуева",fullName:"Шакшуева Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],N={present:{label:"Есть (+)",short:"+"},absent:{label:"Нет (−)",short:"−"},duty:{label:"Наряд (Н)",short:"Н"},event:{label:"Мероприятие (МП)",short:"МП"},excused:{label:"Отпущен (О)",short:"О"},sick:{label:"Болен (Б)",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка (С)",short:"С"},empty:{label:"Не распознано",short:"?"}},ee=["present","absent","duty","event"];function R(n){const e=n.group||D,r=n.people||[],l=r.length,a=r.filter(o=>o.event||o.mark==="event"),s=r.filter(o=>!(o.event||o.mark==="event")&&o.mark==="duty"),u=r.filter(o=>!(o.event||o.mark==="event")&&o.mark!=="duty"&&(o.mark==="absent"||o.mark==="excused"||o.mark==="sick"||o.mark==="unknown"||o.mark==="unauthorized")),p=l-u.length-a.length-s.length,m=[`Расход группы ${e}:`,`По списку: ${l}`,`На лицо: ${p}`];if(u.length){m.push(`Отсутствуют: ${u.length}`);for(const o of u){const i=(o.reason||"").trim();m.push(i?`${o.surname} (${i})`:o.surname)}}else m.push("Отсутствуют: 0");m.push(""),m.push(`Мероприятие: ${a.length}`);for(const o of a)m.push(o.surname);m.push(""),m.push(`Наряд: ${s.length}`);for(const o of s)m.push(o.surname);return m.join(`
`).trimEnd()}const K="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function te(){const n=new Date,e=n.getFullYear(),r=String(n.getMonth()+1).padStart(2,"0"),l=String(n.getDate()).padStart(2,"0");return`${e}-${r}-${l}`}function H(n){const e=String(n).split("-");return Number(e[2]||0)}function T(n){const[e,r,l]=String(n).split("-");return!e||!r||!l?n:`${l}.${r}.${e}`}function ae(n){return new Promise((e,r)=>{const l=new FileReader;l.onload=()=>e(l.result),l.onerror=()=>r(new Error("Не удалось прочитать файл")),l.readAsDataURL(n)})}function J(n){return new Promise((e,r)=>{const l=new Image;l.onload=()=>e(l),l.onerror=()=>r(new Error("Битый файл изображения")),l.src=n})}function Q(n,e,r,l){const a=(l*e+r)*4;return(n[a]+n[a+1]+n[a+2])/3}function ne(n,e,r,l){const a=Math.floor(r*.25),s=Math.floor(r*.55),u=new Float32Array(e),p=new Float32Array(e);for(let c=0;c<e;c++){let f=0,w=0;const g=s-a;for(let S=a;S<s;S++){const v=Q(n,e,c,S);f+=v,w+=v*v}const d=f/g;u[c]=d,p[c]=Math.sqrt(Math.max(0,w/g-d*d))}const m=new Float32Array(e);for(let c=0;c<e;c++)m[c]=u[c]>140&&u[c]<165&&p[c]<48?1:0;const o=new Float32Array(e);for(let c=0;c<e;c++){let f=0,w=0;for(let g=-3;g<=3;g++){const d=c+g;d>=0&&d<e&&(f+=m[d],w++)}o[c]=f/w>.5?1:0}const i=[];for(let c=0;c<e;)if(o[c]){let f=c;for(;f<e&&o[f];)f++;f-c>15&&i.push([c,f]),c=f}else c++;const y=e/6,k=Number(l)||15;let b,h;if(i.length&&k>=25){const c=i.reduce((w,g)=>g[1]-g[0]>w[1]-w[0]?g:w),f=(k-28)*y;b=Math.floor(c[1]+y*.08+f),h=Math.floor(c[1]+y*.92+f)}else k<=10?(b=Math.floor(e*.05),h=Math.floor(e*.28)):k<=20?(b=Math.floor(e*.28),h=Math.floor(e*.52)):(b=Math.floor(e*.38),h=Math.floor(e*.58));return b=Math.max(0,b),h=Math.min(e,Math.max(b+24,h)),[b,h]}function re(n,e,r,l,a){const s=new Float32Array(r),u=new Float32Array(r);for(let i=0;i<r;i++){let y=255,k=0;const b=a-l;for(let h=l;h<a;h++){const c=Q(n,e,h,i);c<y&&(y=c),k+=c}s[i]=Math.max(0,150-y),u[i]=k/b}const p=new Float32Array(r);for(let i=0;i<r;i++){let y=0,k=0;for(let b=-2;b<=2;b++){const h=i+b;h>=0&&h<r&&(y+=s[h],k++)}p[i]=y/k}let m=0;for(let i=0;i<r;i++)if(u[i]>140){m=i;break}const o=[];for(let i=m+15;i<r-40;i++)p[i]>8&&p[i]>=p[i-1]&&p[i]>=p[i+1]&&(!o.length||i-o[o.length-1]>34)&&o.push(i);return{peaks:o,paper0:m}}function oe(n,e,r,l,a,s){const{peaks:u,paper0:p}=re(n,e,r,l,a);if(u.length<3){const y=p+100,b=(r-80-y)/s;return Array.from({length:s},(h,c)=>Math.round(y+(c+.5)*b))}const m=u.length>=s+2?u[2]:u[0];let o=45,i=null;for(let y=38;y<=52;y+=.25){let k=0,b=0;for(let f=0;f<s;f++){const w=m+f*y;let g=1/0;for(const d of u){const S=Math.abs(d-w);S<g&&(g=S)}g<y*.35&&k++,b+=g}const h=k,c=-b;(!i||h>i.hits||h===i.hits&&c>i.dist)&&(i={hits:h,dist:c},o=y)}return Array.from({length:s},(y,k)=>Math.round(m+k*o))}async function se(n,e,r,l=.78){const a=await J(n),s=a.width,u=a.height,p=Number(e)||15,m=p<=10?.32:p<=20?.5:.82,o=Math.floor(s*m),i=Math.floor(u*.05),y=Math.ceil(u*.95),k=s-o,b=y-i,h=3,c=document.createElement("canvas");c.width=Math.max(1,k*h),c.height=Math.max(1,b*h);const f=c.getContext("2d",{willReadFrequently:!0});f.imageSmoothingEnabled=!0,f.imageSmoothingQuality="high",f.drawImage(a,o,i,k,b,0,0,c.width,c.height);const w=c.width,g=c.height,d=f.getImageData(0,0,w,g),{data:S}=d,[v,L]=ne(S,w,g,p),C=oe(S,w,g,v,L,r);f.fillStyle="#fff",f.fillRect(0,0,v,g),f.fillRect(L,0,w-L,g);for(let E=0;E<C.length;E++){const q=C[E],I=Math.max(0,v-52),B=q-14;f.fillStyle="#ffe600",f.strokeStyle="#c80000",f.lineWidth=2,f.fillRect(I,B,v-4-I,28),f.strokeRect(I+.5,B+.5,v-4-I-1,27),f.fillStyle="#c80000",f.font="bold 22px Arial, sans-serif",f.textBaseline="middle",f.fillText(String(E+1),Math.max(4,v-46),q)}const P=C.length>1?Math.max(14,Math.round(Math.abs(C[1]-C[0])/2)):20,j=Math.max(0,C[0]-P-8),V=Math.min(g,C[C.length-1]+P+8),_=Math.max(0,v-55),Z=Math.min(w,L+8),M=document.createElement("canvas");M.width=Math.max(1,Z-_),M.height=Math.max(1,V-j),M.getContext("2d").drawImage(c,_,j,M.width,M.height,0,0,M.width,M.height);const O=160;if(M.width>O){const E=document.createElement("canvas");E.width=O,E.height=Math.round(M.height*O/M.width);const q=E.getContext("2d");return q.imageSmoothingEnabled=!0,q.imageSmoothingQuality="high",q.drawImage(M,0,0,E.width,E.height),E.toDataURL("image/jpeg",l)}return M.toDataURL("image/jpeg",l)}async function le(n,e=2e3,r=.82){const l=await ae(n),a=await J(l),s=Math.min(1,e/Math.max(a.width,a.height)),u=Math.round(a.width*s),p=Math.round(a.height*s),m=document.createElement("canvas");return m.width=u,m.height=p,m.getContext("2d").drawImage(a,0,0,u,p),{full:m.toDataURL("image/jpeg",r),crop:""}}function W(){return U.map(n=>({surname:n.surname,fullName:n.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const F="rashod_access_code",ce="nikitosbrateevo";function ie(){try{return sessionStorage.getItem(F)||""}catch{return""}}function z(n){try{n?sessionStorage.setItem(F,n):sessionStorage.removeItem(F)}catch{}}function ue(n){return String(n||"").trim().replace(/\s+/g,"")}const t={accessCode:ie(),unlocked:!1,authBusy:!1,authError:"",date:te(),imageDataUrl:"",imageCropDataUrl:"",people:W(),busy:!1,message:"",error:!1,usage:null},x=document.querySelector("#app");function $(n,e=!1){t.message=n,t.error=e,A()}function de(n){return K?`${K}${n}`:`/api${n}`}function me(){return de("/recognize")}function X(n){const e=ue(n);if(!e){t.authError="Введи код доступа",t.unlocked=!1,A();return}if(e!==ce){t.unlocked=!1,t.accessCode="",z(""),t.authError="Неверный код",A();return}t.accessCode=e,t.unlocked=!0,t.authError="",t.authBusy=!1,z(e),A()}function Y(){t.unlocked=!1,t.accessCode="",z(""),t.authError="",A()}async function fe(){var e,r,l;if(!t.unlocked||!t.accessCode){$("Сначала введи код доступа",!0);return}if(!t.imageDataUrl){$("Сначала выбери фото листа",!0);return}const n=H(t.date);if(!n){$("Укажи дату",!0);return}t.busy=!0,$("Читаю знаки по клеткам (1× Pro)…");try{const s={imageDayCropBase64:await se(t.imageDataUrl,n,U.length,.78),mimeType:"image/jpeg",day:n,group:D,roster:U,accessCode:t.accessCode},u=Math.round(JSON.stringify(s).length/1024);$(`Отправляю столбец (~${u} КБ)…`);async function p(){const d=new AbortController,S=setTimeout(()=>d.abort(),15e4);try{return await fetch(me(),{method:"POST",headers:{"Content-Type":"application/json","X-Access-Code":t.accessCode},body:JSON.stringify(s),signal:d.signal})}finally{clearTimeout(S)}}let m;try{m=await p()}catch{$("Связь оборвалась, повторяю…"),await new Promise(S=>setTimeout(S,800)),m=await p()}const o=await m.json().catch(()=>({}));if(m.status===401)throw Y(),new Error(o.error||"Код доступа не принят");if(!m.ok||!o.ok){const d=String(o.error||"");if(/524|timeout|не JSON/i.test(d))throw new Error("Модель не успела ответить (таймаут). Нажми «Распознать» ещё раз");const S=o.detail?` (${typeof o.detail=="string"?o.detail:""})`:"";throw new Error((o.error||`Ошибка API (${m.status})`)+S)}const i=((e=o.result)==null?void 0:e.students)||[],y=new Map(i.map(d=>[String(d.surname||"").trim().toLowerCase(),d])),k=d=>{const S=String(d??"").trim().toLowerCase().replaceAll(".","");return{present:"present","+":"present",plus:"present",absent:"absent","-":"absent","−":"absent",duty:"duty",н:"duty",h:"duty",event:"event",мп:"event",mp:"event",ип:"event",мероприятие:"event",excused:"excused",о:"excused",sick:"sick",б:"sick",unknown:"unknown",unauthorized:"unauthorized",empty:"empty"}[S]||(N[S]?S:null)};t.people=U.map((d,S)=>{const v=y.get(d.surname.toLowerCase())||i[S]||{},L=k(v.mark)||(N[v.mark]?v.mark:"empty");return{surname:d.surname,fullName:d.fullName,mark:L,reason:"",event:L==="event"||!!v.event,confidence:typeof(v==null?void 0:v.confidence)=="number"?v.confidence:null,disagreed:!!v.disagreed}}),t.usage=o.usage||null;const b=t.people.filter(d=>d.mark==="present").length,h=t.people.filter(d=>["absent","excused","sick","unknown","unauthorized"].includes(d.mark)).length,c=t.people.filter(d=>d.mark==="duty").length,f=t.people.filter(d=>d.mark==="empty").length,w=t.people.filter(d=>d.disagreed).length,g=((r=o.usage)==null?void 0:r.cost_rub)??((l=o.usage)==null?void 0:l.cost);if(f===t.people.length)$("Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.",!0);else{const d=["Готово",`+${b}`,`нет ${h}`,`наряд ${c}`];f&&d.push(`пусто ${f}`),w&&d.push(`спорных ${w} — проверь`),g!=null&&d.push(`~${Number(g).toFixed(2)} ₽`),$(d.join(". ")+". Допиши причины при необходимости.")}}catch(a){const s=(a==null?void 0:a.name)==="AbortError"?"Сервер не ответил за 2 мин. Попробуй ещё раз или другое фото":/failed to fetch|networkerror|load failed/i.test((a==null?void 0:a.message)||"")?"Не удалось связаться с API (Failed to fetch). Обнови страницу и попробуй ещё раз":a.message||String(a);$(s,!0)}finally{t.busy=!1,A()}}async function G(n){if(n)try{t.busy=!0,$("Готовлю фото…");const e=await le(n);t.imageDataUrl=e.full,t.imageCropDataUrl=e.crop,$("Фото готово — нажми «Распознать»")}catch(e){$(e.message||String(e),!0)}finally{t.busy=!1,A()}}async function pe(){const n=R({group:D,dateLabel:T(t.date),people:t.people});try{await navigator.clipboard.writeText(n),$("Текст скопирован")}catch{$("Не удалось скопировать — выдели вручную",!0)}}function he(){x.innerHTML=`
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
  `;const n=x.querySelector("#access-code"),e=()=>X(n.value);x.querySelector("#unlock").addEventListener("click",e),n.addEventListener("keydown",r=>{r.key==="Enter"&&e()}),n.focus()}function A(){if(!t.unlocked){he();return}const n=R({group:D,dateLabel:T(t.date),people:t.people});x.innerHTML=`
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
        ${t.people.map((e,r)=>{var a,s,u;const l=e.confidence!=null&&e.confidence<.55;return`
            <div class="person" data-i="${r}">
              <div class="person-top">
                <div class="person-name">${e.surname}</div>
                ${l||e.mark==="empty"||e.disagreed?`<span class="badge warn">${e.disagreed?"спорно — проверь":((a=N[e.mark])==null?void 0:a.label)||"проверить"}</span>`:`<span class="badge">${((s=N[e.mark])==null?void 0:s.short)||"?"} ${((u=N[e.mark])==null?void 0:u.label)||""}</span>`}
              </div>
              <div class="quick-marks">
                ${ee.map(p=>`<button type="button" class="mark-btn ${e.mark===p?"active":""}" data-quick="${p}">${N[p].short}</button>`).join("")}
                <select data-field="mark" class="mark-select" aria-label="Другая отметка">
                  ${Object.entries(N).map(([p,m])=>`<option value="${p}" ${e.mark===p?"selected":""}>${m.label}</option>`).join("")}
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
  `,x.querySelector("#logout").addEventListener("click",()=>Y()),x.querySelector("#date").addEventListener("change",e=>{t.date=e.target.value,A()}),x.querySelector("#file").addEventListener("change",e=>{var l;const r=(l=e.target.files)==null?void 0:l[0];G(r)}),x.querySelector("#file-camera").addEventListener("change",e=>{var l;const r=(l=e.target.files)==null?void 0:l[0];G(r)}),x.querySelector("#pick-gallery").addEventListener("click",()=>{x.querySelector("#file").click()}),x.querySelector("#pick-camera").addEventListener("click",()=>{x.querySelector("#file-camera").click()}),x.querySelector("#recognize").addEventListener("click",()=>fe()),x.querySelector("#reset").addEventListener("click",()=>{t.people=W(),$("Список сброшен")}),x.querySelector("#copy").addEventListener("click",()=>pe()),x.querySelectorAll(".person").forEach(e=>{const r=Number(e.dataset.i),l=()=>{var m,o;const a=x.querySelector("#out");a&&(a.value=R({group:D,dateLabel:T(t.date),people:t.people}));const s=e.querySelector(".badge"),u=t.people[r].mark;s&&(s.textContent=`${((m=N[u])==null?void 0:m.short)||"?"} ${((o=N[u])==null?void 0:o.label)||""}`,s.classList.toggle("warn",u==="empty"||t.people[r].confidence!=null&&t.people[r].confidence<.55)),e.querySelectorAll(".mark-btn").forEach(i=>{i.classList.toggle("active",i.getAttribute("data-quick")===u)});const p=e.querySelector('[data-field="mark"]');p&&(p.value=u)};e.querySelectorAll("[data-quick]").forEach(a=>{a.addEventListener("click",()=>{const s=a.getAttribute("data-quick");t.people[r].mark=s,t.people[r].event=s==="event",l()})}),e.querySelectorAll("[data-field]").forEach(a=>{const s=a.getAttribute("data-field"),u=()=>{s==="event"?(t.people[r].event=a.checked,a.checked?t.people[r].mark="event":t.people[r].mark==="event"&&(t.people[r].mark="present")):(t.people[r][s]=a.value,s==="mark"&&(t.people[r].event=a.value==="event")),l()};a.addEventListener("change",u),a.addEventListener("input",u)})})}function ge(n){return String(n).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function ye(n){return String(n).replaceAll('"',"&quot;").replaceAll("<","&lt;")}function be(){if(t.accessCode){X(t.accessCode);return}A()}be();
