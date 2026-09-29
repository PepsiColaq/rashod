(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))l(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&l(d)}).observe(document,{childList:!0,subtree:!0});function r(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function l(a){if(a.ep)return;a.ep=!0;const s=r(a);fetch(a.href,s)}})();const D="0903-ПД3",U=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджгуа",fullName:"Боджгуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакшуева",fullName:"Шакшуева Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],N={present:{label:"Есть (+)",short:"+"},absent:{label:"Нет (−)",short:"−"},duty:{label:"Наряд (Н)",short:"Н"},event:{label:"Мероприятие (МП)",short:"МП"},excused:{label:"Отпущен (О)",short:"О"},sick:{label:"Болен (Б)",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка (С)",short:"С"},empty:{label:"Не распознано",short:"?"}},te=["present","absent","duty","event"];function T(n){const e=n.group||D,r=n.people||[],l=r.length,a=r.filter(o=>o.event||o.mark==="event"),s=r.filter(o=>!(o.event||o.mark==="event")&&o.mark==="duty"),d=r.filter(o=>!(o.event||o.mark==="event")&&o.mark!=="duty"&&(o.mark==="absent"||o.mark==="excused"||o.mark==="sick"||o.mark==="unknown"||o.mark==="unauthorized")),h=l-d.length-a.length-s.length,m=[`Расход группы ${e}:`,`По списку: ${l}`,`На лицо: ${h}`];if(d.length){m.push(`Отсутствуют: ${d.length}`);for(const o of d){const i=(o.reason||"").trim();m.push(i?`${o.surname} (${i})`:o.surname)}}else m.push("Отсутствуют: 0");m.push(""),m.push(`Мероприятие: ${a.length}`);for(const o of a)m.push(o.surname);m.push(""),m.push(`Наряд: ${s.length}`);for(const o of s)m.push(o.surname);return m.join(`
`).trimEnd()}const P="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function ae(){const n=new Date,e=n.getFullYear(),r=String(n.getMonth()+1).padStart(2,"0"),l=String(n.getDate()).padStart(2,"0");return`${e}-${r}-${l}`}function J(n){const e=String(n).split("-");return Number(e[2]||0)}function R(n){const[e,r,l]=String(n).split("-");return!e||!r||!l?n:`${l}.${r}.${e}`}function ne(n){return new Promise((e,r)=>{const l=new FileReader;l.onload=()=>e(l.result),l.onerror=()=>r(new Error("Не удалось прочитать файл")),l.readAsDataURL(n)})}function Q(n){return new Promise((e,r)=>{const l=new Image;l.onload=()=>e(l),l.onerror=()=>r(new Error("Битый файл изображения")),l.src=n})}function W(n,e,r,l){const a=(l*e+r)*4;return(n[a]+n[a+1]+n[a+2])/3}function re(n,e,r,l){const a=Math.floor(r*.25),s=Math.floor(r*.55),d=new Float32Array(e),h=new Float32Array(e);for(let c=0;c<e;c++){let f=0,S=0;const g=s-a;for(let w=a;w<s;w++){const v=W(n,e,c,w);f+=v,S+=v*v}const u=f/g;d[c]=u,h[c]=Math.sqrt(Math.max(0,S/g-u*u))}const m=new Float32Array(e);for(let c=0;c<e;c++)m[c]=d[c]>140&&d[c]<165&&h[c]<48?1:0;const o=new Float32Array(e);for(let c=0;c<e;c++){let f=0,S=0;for(let g=-3;g<=3;g++){const u=c+g;u>=0&&u<e&&(f+=m[u],S++)}o[c]=f/S>.5?1:0}const i=[];for(let c=0;c<e;)if(o[c]){let f=c;for(;f<e&&o[f];)f++;f-c>15&&i.push([c,f]),c=f}else c++;const y=e/6,k=Number(l)||15;let b,p;if(i.length&&k>=25){const c=i.reduce((S,g)=>g[1]-g[0]>S[1]-S[0]?g:S),f=(k-28)*y;b=Math.floor(c[1]+y*.08+f),p=Math.floor(c[1]+y*.92+f)}else k<=10?(b=Math.floor(e*.05),p=Math.floor(e*.28)):k<=20?(b=Math.floor(e*.28),p=Math.floor(e*.52)):(b=Math.floor(e*.38),p=Math.floor(e*.58));return b=Math.max(0,b),p=Math.min(e,Math.max(b+24,p)),[b,p]}function oe(n,e,r,l,a){const s=new Float32Array(r),d=new Float32Array(r);for(let i=0;i<r;i++){let y=255,k=0;const b=a-l;for(let p=l;p<a;p++){const c=W(n,e,p,i);c<y&&(y=c),k+=c}s[i]=Math.max(0,150-y),d[i]=k/b}const h=new Float32Array(r);for(let i=0;i<r;i++){let y=0,k=0;for(let b=-2;b<=2;b++){const p=i+b;p>=0&&p<r&&(y+=s[p],k++)}h[i]=y/k}let m=0;for(let i=0;i<r;i++)if(d[i]>140){m=i;break}const o=[];for(let i=m+15;i<r-40;i++)h[i]>8&&h[i]>=h[i-1]&&h[i]>=h[i+1]&&(!o.length||i-o[o.length-1]>34)&&o.push(i);return{peaks:o,paper0:m}}function se(n,e,r,l,a,s){const{peaks:d,paper0:h}=oe(n,e,r,l,a);if(d.length<3){const y=h+100,b=(r-80-y)/s;return Array.from({length:s},(p,c)=>Math.round(y+(c+.5)*b))}const m=d.length>=s+2?d[2]:d[0];let o=45,i=null;for(let y=38;y<=52;y+=.25){let k=0,b=0;for(let f=0;f<s;f++){const S=m+f*y;let g=1/0;for(const u of d){const w=Math.abs(u-S);w<g&&(g=w)}g<y*.35&&k++,b+=g}const p=k,c=-b;(!i||p>i.hits||p===i.hits&&c>i.dist)&&(i={hits:p,dist:c},o=y)}return Array.from({length:s},(y,k)=>Math.round(m+k*o))}async function le(n,e,r,l=.78){const a=await Q(n),s=a.width,d=a.height,h=Number(e)||15,m=h<=10?.32:h<=20?.5:.82,o=Math.floor(s*m),i=Math.floor(d*.05),y=Math.ceil(d*.95),k=s-o,b=y-i,p=3,c=document.createElement("canvas");c.width=Math.max(1,k*p),c.height=Math.max(1,b*p);const f=c.getContext("2d",{willReadFrequently:!0});f.imageSmoothingEnabled=!0,f.imageSmoothingQuality="high",f.drawImage(a,o,i,k,b,0,0,c.width,c.height);const S=c.width,g=c.height,u=f.getImageData(0,0,S,g),{data:w}=u,[v,L]=re(w,S,g,h),C=se(w,S,g,v,L,r);f.fillStyle="#fff",f.fillRect(0,0,v,g),f.fillRect(L,0,S-L,g);for(let M=0;M<C.length;M++){const q=C[M],I=Math.max(0,v-52),K=q-14;f.fillStyle="#ffe600",f.strokeStyle="#c80000",f.lineWidth=2,f.fillRect(I,K,v-4-I,28),f.strokeRect(I+.5,K+.5,v-4-I-1,27),f.fillStyle="#c80000",f.font="bold 22px Arial, sans-serif",f.textBaseline="middle",f.fillText(String(M+1),Math.max(4,v-46),q)}const j=C.length>1?Math.max(14,Math.round(Math.abs(C[1]-C[0])/2)):20,_=Math.max(0,C[0]-j-8),Z=Math.min(g,C[C.length-1]+j+8),B=Math.max(0,v-55),ee=Math.min(S,L+8),E=document.createElement("canvas");E.width=Math.max(1,ee-B),E.height=Math.max(1,Z-_),E.getContext("2d").drawImage(c,B,_,E.width,E.height,0,0,E.width,E.height);const O=160;if(E.width>O){const M=document.createElement("canvas");M.width=O,M.height=Math.round(E.height*O/E.width);const q=M.getContext("2d");return q.imageSmoothingEnabled=!0,q.imageSmoothingQuality="high",q.drawImage(E,0,0,M.width,M.height),M.toDataURL("image/jpeg",l)}return E.toDataURL("image/jpeg",l)}async function ce(n,e=2e3,r=.82){const l=await ne(n),a=await Q(l),s=Math.min(1,e/Math.max(a.width,a.height)),d=Math.round(a.width*s),h=Math.round(a.height*s),m=document.createElement("canvas");return m.width=d,m.height=h,m.getContext("2d").drawImage(a,0,0,d,h),{full:m.toDataURL("image/jpeg",r),crop:""}}function X(){return U.map(n=>({surname:n.surname,fullName:n.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const z="rashod_access_code",ie="nikitosbrateevo";function ue(){try{return sessionStorage.getItem(z)||""}catch{return""}}function F(n){try{n?sessionStorage.setItem(z,n):sessionStorage.removeItem(z)}catch{}}function de(n){return String(n||"").trim().replace(/\s+/g,"")}const t={accessCode:ue(),unlocked:!1,authBusy:!1,authError:"",date:ae(),imageDataUrl:"",imageCropDataUrl:"",people:X(),busy:!1,message:"",error:!1,usage:null},$=document.querySelector("#app");function x(n,e=!1){t.message=n,t.error=e,A()}function me(n){return P?`${P}${n}`:`/api${n}`}function G(){return me("/recognize")}function Y(n){const e=de(n);if(!e){t.authError="Введи код доступа",t.unlocked=!1,A();return}if(e!==ie){t.unlocked=!1,t.accessCode="",F(""),t.authError="Неверный код",A();return}t.accessCode=e,t.unlocked=!0,t.authError="",t.authBusy=!1,F(e),A()}function V(){t.unlocked=!1,t.accessCode="",F(""),t.authError="",A()}async function fe(){var e,r,l;if(!t.unlocked||!t.accessCode){x("Сначала введи код доступа",!0);return}if(!t.imageDataUrl){x("Сначала выбери фото листа",!0);return}const n=J(t.date);if(!n){x("Укажи дату",!0);return}t.busy=!0,x("Читаю знаки…");try{try{const u=await fetch(`${P||G().replace(/\/recognize$/,"")}/health`,{method:"GET",cache:"no-store"});if(!u.ok)throw new Error("health "+u.status)}catch{throw new Error("Нет связи с API (health). Проверь интернет / VPN и обнови страницу")}const s={imageDayCropBase64:await le(t.imageDataUrl,n,U.length,.72),mimeType:"image/jpeg",day:n,group:D,roster:U,accessCode:t.accessCode},d=Math.round(JSON.stringify(s).length/1024);x(`Отправляю столбец (~${d} КБ)…`);async function h(){const u=new AbortController,w=setTimeout(()=>u.abort(),4e4);try{return await fetch(G(),{method:"POST",mode:"cors",credentials:"omit",cache:"no-store",headers:{"Content-Type":"application/json","X-Access-Code":t.accessCode},body:JSON.stringify(s),signal:u.signal})}finally{clearTimeout(w)}}let m;try{m=await h()}catch{x("Таймаут/обрыв — повторяю ещё раз…"),await new Promise(w=>setTimeout(w,1e3)),m=await h()}const o=await m.json().catch(()=>({}));if(m.status===401)throw V(),new Error(o.error||"Код доступа не принят");if(!m.ok||!o.ok){const u=String(o.error||"");if(/таймаут|524|timeout|не JSON|Polza/i.test(u))throw new Error("Модель не успела. Нажми «Распознать» ещё раз через 2–3 сек");const w=o.detail?` (${typeof o.detail=="string"?o.detail:""})`:"";throw new Error((o.error||`Ошибка API (${m.status})`)+w)}const i=((e=o.result)==null?void 0:e.students)||[],y=new Map(i.map(u=>[String(u.surname||"").trim().toLowerCase(),u])),k=u=>{const w=String(u??"").trim().toLowerCase().replaceAll(".","");return{present:"present","+":"present",plus:"present",absent:"absent","-":"absent","−":"absent",duty:"duty",н:"duty",h:"duty",event:"event",мп:"event",mp:"event",ип:"event",мероприятие:"event",excused:"excused",о:"excused",sick:"sick",б:"sick",unknown:"unknown",unauthorized:"unauthorized",empty:"empty"}[w]||(N[w]?w:null)};t.people=U.map((u,w)=>{const v=y.get(u.surname.toLowerCase())||i[w]||{},L=k(v.mark)||(N[v.mark]?v.mark:"empty");return{surname:u.surname,fullName:u.fullName,mark:L,reason:"",event:L==="event"||!!v.event,confidence:typeof(v==null?void 0:v.confidence)=="number"?v.confidence:null,disagreed:!!v.disagreed}}),t.usage=o.usage||null;const b=t.people.filter(u=>u.mark==="present").length,p=t.people.filter(u=>["absent","excused","sick","unknown","unauthorized"].includes(u.mark)).length,c=t.people.filter(u=>u.mark==="duty").length,f=t.people.filter(u=>u.mark==="empty").length,S=t.people.filter(u=>u.disagreed).length,g=((r=o.usage)==null?void 0:r.cost_rub)??((l=o.usage)==null?void 0:l.cost);if(f===t.people.length)x("Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.",!0);else{const u=["Готово",`+${b}`,`нет ${p}`,`наряд ${c}`];f&&u.push(`пусто ${f}`),S&&u.push(`спорных ${S} — проверь`),g!=null&&u.push(`~${Number(g).toFixed(2)} ₽`),x(u.join(". ")+". Допиши причины при необходимости.")}}catch(a){const s=(a==null?void 0:a.name)==="AbortError"?"Ответ не пришёл вовремя. Нажми «Распознать» ещё раз":/failed to fetch|networkerror|load failed/i.test((a==null?void 0:a.message)||"")?"Обрыв связи с API. Подожди 2 сек и нажми «Распознать» снова":a.message||String(a);x(s,!0)}finally{t.busy=!1,A()}}async function H(n){if(n)try{t.busy=!0,x("Готовлю фото…");const e=await ce(n);t.imageDataUrl=e.full,t.imageCropDataUrl=e.crop,x("Фото готово — нажми «Распознать»")}catch(e){x(e.message||String(e),!0)}finally{t.busy=!1,A()}}async function he(){const n=T({group:D,dateLabel:R(t.date),people:t.people});try{await navigator.clipboard.writeText(n),x("Текст скопирован")}catch{x("Не удалось скопировать — выдели вручную",!0)}}function pe(){$.innerHTML=`
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
  `;const n=$.querySelector("#access-code"),e=()=>Y(n.value);$.querySelector("#unlock").addEventListener("click",e),n.addEventListener("keydown",r=>{r.key==="Enter"&&e()}),n.focus()}function A(){if(!t.unlocked){pe();return}const n=T({group:D,dateLabel:R(t.date),people:t.people});$.innerHTML=`
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
        ${t.people.map((e,r)=>{var a,s,d;const l=e.confidence!=null&&e.confidence<.55;return`
            <div class="person" data-i="${r}">
              <div class="person-top">
                <div class="person-name">${e.surname}</div>
                ${l||e.mark==="empty"||e.disagreed?`<span class="badge warn">${e.disagreed?"спорно — проверь":((a=N[e.mark])==null?void 0:a.label)||"проверить"}</span>`:`<span class="badge">${((s=N[e.mark])==null?void 0:s.short)||"?"} ${((d=N[e.mark])==null?void 0:d.label)||""}</span>`}
              </div>
              <div class="quick-marks">
                ${te.map(h=>`<button type="button" class="mark-btn ${e.mark===h?"active":""}" data-quick="${h}">${N[h].short}</button>`).join("")}
                <select data-field="mark" class="mark-select" aria-label="Другая отметка">
                  ${Object.entries(N).map(([h,m])=>`<option value="${h}" ${e.mark===h?"selected":""}>${m.label}</option>`).join("")}
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
  `,$.querySelector("#logout").addEventListener("click",()=>V()),$.querySelector("#date").addEventListener("change",e=>{t.date=e.target.value,A()}),$.querySelector("#file").addEventListener("change",e=>{var l;const r=(l=e.target.files)==null?void 0:l[0];H(r)}),$.querySelector("#file-camera").addEventListener("change",e=>{var l;const r=(l=e.target.files)==null?void 0:l[0];H(r)}),$.querySelector("#pick-gallery").addEventListener("click",()=>{$.querySelector("#file").click()}),$.querySelector("#pick-camera").addEventListener("click",()=>{$.querySelector("#file-camera").click()}),$.querySelector("#recognize").addEventListener("click",()=>fe()),$.querySelector("#reset").addEventListener("click",()=>{t.people=X(),x("Список сброшен")}),$.querySelector("#copy").addEventListener("click",()=>he()),$.querySelectorAll(".person").forEach(e=>{const r=Number(e.dataset.i),l=()=>{var m,o;const a=$.querySelector("#out");a&&(a.value=T({group:D,dateLabel:R(t.date),people:t.people}));const s=e.querySelector(".badge"),d=t.people[r].mark;s&&(s.textContent=`${((m=N[d])==null?void 0:m.short)||"?"} ${((o=N[d])==null?void 0:o.label)||""}`,s.classList.toggle("warn",d==="empty"||t.people[r].confidence!=null&&t.people[r].confidence<.55)),e.querySelectorAll(".mark-btn").forEach(i=>{i.classList.toggle("active",i.getAttribute("data-quick")===d)});const h=e.querySelector('[data-field="mark"]');h&&(h.value=d)};e.querySelectorAll("[data-quick]").forEach(a=>{a.addEventListener("click",()=>{const s=a.getAttribute("data-quick");t.people[r].mark=s,t.people[r].event=s==="event",l()})}),e.querySelectorAll("[data-field]").forEach(a=>{const s=a.getAttribute("data-field"),d=()=>{s==="event"?(t.people[r].event=a.checked,a.checked?t.people[r].mark="event":t.people[r].mark==="event"&&(t.people[r].mark="present")):(t.people[r][s]=a.value,s==="mark"&&(t.people[r].event=a.value==="event")),l()};a.addEventListener("change",d),a.addEventListener("input",d)})})}function ge(n){return String(n).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function ye(n){return String(n).replaceAll('"',"&quot;").replaceAll("<","&lt;")}function be(){if(t.accessCode){Y(t.accessCode);return}A()}be();
