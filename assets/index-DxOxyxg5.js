(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const s of c.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function a(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function l(n){if(n.ep)return;n.ep=!0;const c=a(n);fetch(n.href,c)}})();const A="0903-ПД3",U=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджуа",fullName:"Боджуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакшуева",fullName:"Шакшуева Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],M={present:{label:"Есть (+)",short:"+"},absent:{label:"Нет (−)",short:"−"},duty:{label:"Наряд (Н)",short:"Н"},event:{label:"Мероприятие (МП)",short:"МП"},excused:{label:"Отпущен (О)",short:"О"},sick:{label:"Болен (Б)",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка (С)",short:"С"},empty:{label:"Не распознано",short:"?"}},ee=["present","absent","duty","event"];function I(r){const e=r.group||A,a=r.people||[],l=a.length,n=a.filter(u=>u.event||u.mark==="event"),c=a.filter(u=>!(u.event||u.mark==="event")&&u.mark==="duty"),s=a.filter(u=>!(u.event||u.mark==="event")&&u.mark!=="duty"&&(u.mark==="absent"||u.mark==="excused"||u.mark==="sick"||u.mark==="unknown"||u.mark==="unauthorized")),m=l-s.length-n.length-c.length,f=[`Расход группы ${e}:`,`По списку: ${l}`,`На лицо: ${m}`];if(s.length){f.push(`Отсутствуют: ${s.length}`);for(const u of s){const i=(u.reason||"").trim();f.push(i?`${u.surname} (${i})`:u.surname)}}else f.push("Отсутствуют: 0");f.push(""),f.push(`Мероприятие: ${n.length}`);for(const u of n)f.push(u.surname);f.push(""),f.push(`Наряд: ${c.length}`);for(const u of c)f.push(u.surname);return f.join(`
`).trimEnd()}const _="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function te(){const r=new Date,e=r.getFullYear(),a=String(r.getMonth()+1).padStart(2,"0"),l=String(r.getDate()).padStart(2,"0");return`${e}-${a}-${l}`}function G(r){const e=String(r).split("-");return Number(e[2]||0)}function O(r){const[e,a,l]=String(r).split("-");return!e||!a||!l?r:`${l}.${a}.${e}`}function ae(r){return new Promise((e,a)=>{const l=new FileReader;l.onload=()=>e(l.result),l.onerror=()=>a(new Error("Не удалось прочитать файл")),l.readAsDataURL(r)})}function H(r){return new Promise((e,a)=>{const l=new Image;l.onload=()=>e(l),l.onerror=()=>a(new Error("Битый файл изображения")),l.src=r})}function X(r,e,a,l){const n=(l*e+a)*4;return(r[n]+r[n+1]+r[n+2])/3}function ne(r,e,a,l){const n=Math.floor(a*.25),c=Math.floor(a*.55),s=new Float32Array(e),m=new Float32Array(e);for(let d=0;d<e;d++){let o=0,b=0;const p=c-n;for(let w=n;w<c;w++){const x=X(r,e,d,w);o+=x,b+=x*x}const S=o/p;s[d]=S,m[d]=Math.sqrt(Math.max(0,b/p-S*S))}const f=new Float32Array(e);for(let d=0;d<e;d++)f[d]=s[d]>140&&s[d]<165&&m[d]<48?1:0;const u=new Float32Array(e);for(let d=0;d<e;d++){let o=0,b=0;for(let p=-3;p<=3;p++){const S=d+p;S>=0&&S<e&&(o+=f[S],b++)}u[d]=o/b>.5?1:0}const i=[];for(let d=0;d<e;)if(u[d]){let o=d;for(;o<e&&u[o];)o++;o-d>15&&i.push([d,o]),d=o}else d++;const y=e/6,v=Number(l)||15;let h,g;if(i.length&&v>=25){const d=i.reduce((b,p)=>p[1]-p[0]>b[1]-b[0]?p:b),o=(v-28)*y;h=Math.floor(d[1]+y*.08+o),g=Math.floor(d[1]+y*.92+o)}else v<=10?(h=Math.floor(e*.05),g=Math.floor(e*.28)):v<=20?(h=Math.floor(e*.28),g=Math.floor(e*.52)):(h=Math.floor(e*.38),g=Math.floor(e*.58));return h=Math.max(0,h),g=Math.min(e,Math.max(h+24,g)),[h,g]}function re(r,e,a,l,n){const c=new Float32Array(a),s=new Float32Array(a);for(let i=0;i<a;i++){let y=255,v=0;const h=n-l;for(let g=l;g<n;g++){const d=X(r,e,g,i);d<y&&(y=d),v+=d}c[i]=Math.max(0,150-y),s[i]=v/h}const m=new Float32Array(a);for(let i=0;i<a;i++){let y=0,v=0;for(let h=-2;h<=2;h++){const g=i+h;g>=0&&g<a&&(y+=c[g],v++)}m[i]=y/v}let f=0;for(let i=0;i<a;i++)if(s[i]>140){f=i;break}const u=[];for(let i=f+15;i<a-40;i++)m[i]>8&&m[i]>=m[i-1]&&m[i]>=m[i+1]&&(!u.length||i-u[u.length-1]>34)&&u.push(i);return{peaks:u,paper0:f}}function oe(r,e,a,l,n,c){const{peaks:s,paper0:m}=re(r,e,a,l,n);if(s.length<3){const y=m+100,h=(a-80-y)/c;return Array.from({length:c},(g,d)=>Math.round(y+(d+.5)*h))}const f=s.length>=c+2?s[2]:s[0];let u=45,i=null;for(let y=38;y<=52;y+=.25){let v=0,h=0;for(let o=0;o<c;o++){const b=f+o*y;let p=1/0;for(const S of s){const w=Math.abs(S-b);w<p&&(p=w)}p<y*.35&&v++,h+=p}const g=v,d=-h;(!i||g>i.hits||g===i.hits&&d>i.dist)&&(i={hits:g,dist:d},u=y)}return Array.from({length:c},(y,v)=>Math.round(f+v*u))}async function se(r,e,a,l=.88){const n=await H(r),c=n.width,s=n.height,m=Number(e)||15,f=m<=10?.32:m<=20?.5:.82,u=Math.floor(c*f),i=Math.floor(s*.05),y=Math.ceil(s*.95),v=c-u,h=y-i,g=3,d=document.createElement("canvas");d.width=Math.max(1,v*g),d.height=Math.max(1,h*g);const o=d.getContext("2d",{willReadFrequently:!0});o.imageSmoothingEnabled=!0,o.imageSmoothingQuality="high",o.drawImage(n,u,i,v,h,0,0,d.width,d.height);const b=d.width,p=d.height,S=o.getImageData(0,0,b,p),{data:w}=S,[x,L]=ne(w,b,p,m),N=oe(w,b,p,x,L,a);o.fillStyle="#fff",o.fillRect(0,0,x,p),o.fillRect(L,0,b-L,p);for(let q=0;q<N.length;q++){const z=N[q],D=Math.max(0,x-52),B=z-14;o.fillStyle="#ffe600",o.strokeStyle="#c80000",o.lineWidth=2,o.fillRect(D,B,x-4-D,28),o.strokeRect(D+.5,B+.5,x-4-D-1,27),o.fillStyle="#c80000",o.font="bold 22px Arial, sans-serif",o.textBaseline="middle",o.fillText(String(q+1),Math.max(4,x-46),z)}const P=N.length>1?Math.max(14,Math.round(Math.abs(N[1]-N[0])/2)):20,F=Math.max(0,N[0]-P-8),W=Math.min(p,N[N.length-1]+P+8),T=Math.max(0,x-55),Z=Math.min(b,L+8),C=document.createElement("canvas");return C.width=Math.max(1,Z-T),C.height=Math.max(1,W-F),C.getContext("2d").drawImage(d,T,F,C.width,C.height,0,0,C.width,C.height),C.toDataURL("image/jpeg",l)}async function le(r,e=3e3,a=.92){const l=await ae(r),n=await H(l),c=Math.min(1,e/Math.max(n.width,n.height)),s=Math.round(n.width*c),m=Math.round(n.height*c),f=document.createElement("canvas");f.width=s,f.height=m,f.getContext("2d").drawImage(n,0,0,s,m);const u=Math.floor(s*.35),i=document.createElement("canvas");return i.width=s-u,i.height=m,i.getContext("2d").drawImage(f,u,0,s-u,m,0,0,s-u,m),{full:f.toDataURL("image/jpeg",a),crop:i.toDataURL("image/jpeg",a)}}function J(){return U.map(r=>({surname:r.surname,fullName:r.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const R="rashod_access_code";function ce(){try{return sessionStorage.getItem(R)||""}catch{return""}}function j(r){try{r?sessionStorage.setItem(R,r):sessionStorage.removeItem(R)}catch{}}const t={accessCode:ce(),unlocked:!1,authBusy:!1,authError:"",date:te(),imageDataUrl:"",imageCropDataUrl:"",people:J(),busy:!1,message:"",error:!1,usage:null},k=document.querySelector("#app");function $(r,e=!1){t.message=r,t.error=e,E()}function Q(r){return _?`${_}${r}`:`/api${r}`}function ie(){return Q("/recognize")}function ue(){return Q("/auth")}async function Y(r){const e=String(r||"").trim().replace(/\s+/g,"");if(!e){t.authError="Введи код доступа",E();return}t.authBusy=!0,t.authError="",E();try{const a=await fetch(ue(),{method:"POST",headers:{"Content-Type":"application/json","X-Access-Code":e},body:JSON.stringify({accessCode:e})}),l=await a.json().catch(()=>({}));if(!a.ok||!l.ok)throw j(""),new Error(l.error||"Неверный код");t.accessCode=e,t.unlocked=!0,j(e)}catch(a){t.unlocked=!1;const l=a.message||String(a);t.authError=/failed to fetch|networkerror|load failed/i.test(l)?"Нет связи с сервером. Проверь интернет / VPN и обнови страницу":l}finally{t.authBusy=!1,E()}}function V(){t.unlocked=!1,t.accessCode="",j(""),t.authError="",E()}async function de(){var e,a,l;if(!t.unlocked||!t.accessCode){$("Сначала введи код доступа",!0);return}if(!t.imageDataUrl){$("Сначала выбери фото листа",!0);return}const r=G(t.date);if(!r){$("Укажи дату",!0);return}t.busy=!0,$("Читаю знаки по клеткам (1× Pro)…");try{const n=await se(t.imageDataUrl,r,U.length),c=await fetch(ie(),{method:"POST",headers:{"Content-Type":"application/json","X-Access-Code":t.accessCode},body:JSON.stringify({imageBase64:t.imageDataUrl,imageCropBase64:t.imageCropDataUrl||void 0,imageDayCropBase64:n,mimeType:"image/jpeg",day:r,group:A,roster:U,accessCode:t.accessCode})}),s=await c.json().catch(()=>({}));if(c.status===401)throw V(),new Error(s.error||"Код доступа не принят");if(!c.ok||!s.ok){const o=s.detail?` (${typeof s.detail=="string"?s.detail:""})`:"";throw new Error((s.error||`Ошибка API (${c.status})`)+o)}const m=((e=s.result)==null?void 0:e.students)||[],f=new Map(m.map(o=>[String(o.surname||"").trim().toLowerCase(),o])),u=o=>{const b=String(o??"").trim().toLowerCase().replaceAll(".","");return{present:"present","+":"present",plus:"present",absent:"absent","-":"absent","−":"absent",duty:"duty",н:"duty",h:"duty",event:"event",мп:"event",mp:"event",ип:"event",мероприятие:"event",excused:"excused",о:"excused",sick:"sick",б:"sick",unknown:"unknown",unauthorized:"unauthorized",empty:"empty"}[b]||(M[b]?b:null)};t.people=U.map((o,b)=>{const p=f.get(o.surname.toLowerCase())||m[b]||{},S=u(p.mark)||(M[p.mark]?p.mark:"empty");return{surname:o.surname,fullName:o.fullName,mark:S,reason:"",event:S==="event"||!!p.event,confidence:typeof(p==null?void 0:p.confidence)=="number"?p.confidence:null,disagreed:!!p.disagreed}}),t.usage=s.usage||null;const i=t.people.filter(o=>o.mark==="present").length,y=t.people.filter(o=>["absent","excused","sick","unknown","unauthorized"].includes(o.mark)).length,v=t.people.filter(o=>o.mark==="duty").length,h=t.people.filter(o=>o.mark==="empty").length,g=t.people.filter(o=>o.disagreed).length,d=((a=s.usage)==null?void 0:a.cost_rub)??((l=s.usage)==null?void 0:l.cost);if(h===t.people.length)$("Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.",!0);else{const o=["Готово (2× Pro)",`+${i}`,`нет ${y}`,`наряд ${v}`];h&&o.push(`пусто ${h}`),g&&o.push(`спорных ${g} — проверь`),d!=null&&o.push(`~${Number(d).toFixed(2)} ₽`),$(o.join(". ")+". Допиши причины при необходимости.")}}catch(n){$(n.message||String(n),!0)}finally{t.busy=!1,E()}}async function K(r){if(r)try{t.busy=!0,$("Готовлю фото…");const e=await le(r);t.imageDataUrl=e.full,t.imageCropDataUrl=e.crop,$("Фото готово — нажми «Распознать»")}catch(e){$(e.message||String(e),!0)}finally{t.busy=!1,E()}}async function me(){const r=I({group:A,dateLabel:O(t.date),people:t.people});try{await navigator.clipboard.writeText(r),$("Текст скопирован")}catch{$("Не удалось скопировать — выдели вручную",!0)}}function fe(){k.innerHTML=`
    <section class="card gate">
      <h1>Расход</h1>
      <p class="sub">Доступ только по коду</p>
      <label>
        Код доступа
        <input id="access-code" type="text" inputmode="numeric" autocomplete="one-time-code" placeholder="Введи код" />
      </label>
      <div class="actions">
        <button class="primary" id="unlock" ${t.authBusy?"disabled":""}>
          ${t.authBusy?"Проверяю…":"Войти"}
        </button>
      </div>
      <div class="status ${t.authError?"error":""}">${t.authError||""}</div>
    </section>
  `;const r=k.querySelector("#access-code"),e=()=>Y(r.value);k.querySelector("#unlock").addEventListener("click",e),r.addEventListener("keydown",a=>{a.key==="Enter"&&e()}),r.focus()}function E(){if(!t.unlocked){fe();return}const r=I({group:A,dateLabel:O(t.date),people:t.people});k.innerHTML=`
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
        ${t.people.map((e,a)=>{var n,c,s;const l=e.confidence!=null&&e.confidence<.55;return`
            <div class="person" data-i="${a}">
              <div class="person-top">
                <div class="person-name">${e.surname}</div>
                ${l||e.mark==="empty"||e.disagreed?`<span class="badge warn">${e.disagreed?"спорно — проверь":((n=M[e.mark])==null?void 0:n.label)||"проверить"}</span>`:`<span class="badge">${((c=M[e.mark])==null?void 0:c.short)||"?"} ${((s=M[e.mark])==null?void 0:s.label)||""}</span>`}
              </div>
              <div class="quick-marks">
                ${ee.map(m=>`<button type="button" class="mark-btn ${e.mark===m?"active":""}" data-quick="${m}">${M[m].short}</button>`).join("")}
                <select data-field="mark" class="mark-select" aria-label="Другая отметка">
                  ${Object.entries(M).map(([m,f])=>`<option value="${m}" ${e.mark===m?"selected":""}>${f.label}</option>`).join("")}
                </select>
              </div>
              <div class="person-grid">
                <label>
                  Причина (если нет)
                  <input data-field="reason" type="text" placeholder="плохое самочувствие" value="${he(e.reason)}" />
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
        <textarea id="out" readonly>${pe(r)}</textarea>
      </label>
      <div class="actions">
        <button class="primary" id="copy">Скопировать</button>
      </div>
    </section>
  `,k.querySelector("#logout").addEventListener("click",()=>V()),k.querySelector("#date").addEventListener("change",e=>{t.date=e.target.value,E()}),k.querySelector("#file").addEventListener("change",e=>{var l;const a=(l=e.target.files)==null?void 0:l[0];K(a)}),k.querySelector("#file-camera").addEventListener("change",e=>{var l;const a=(l=e.target.files)==null?void 0:l[0];K(a)}),k.querySelector("#pick-gallery").addEventListener("click",()=>{k.querySelector("#file").click()}),k.querySelector("#pick-camera").addEventListener("click",()=>{k.querySelector("#file-camera").click()}),k.querySelector("#recognize").addEventListener("click",()=>de()),k.querySelector("#reset").addEventListener("click",()=>{t.people=J(),$("Список сброшен")}),k.querySelector("#copy").addEventListener("click",()=>me()),k.querySelectorAll(".person").forEach(e=>{const a=Number(e.dataset.i),l=()=>{var f,u;const n=k.querySelector("#out");n&&(n.value=I({group:A,dateLabel:O(t.date),people:t.people}));const c=e.querySelector(".badge"),s=t.people[a].mark;c&&(c.textContent=`${((f=M[s])==null?void 0:f.short)||"?"} ${((u=M[s])==null?void 0:u.label)||""}`,c.classList.toggle("warn",s==="empty"||t.people[a].confidence!=null&&t.people[a].confidence<.55)),e.querySelectorAll(".mark-btn").forEach(i=>{i.classList.toggle("active",i.getAttribute("data-quick")===s)});const m=e.querySelector('[data-field="mark"]');m&&(m.value=s)};e.querySelectorAll("[data-quick]").forEach(n=>{n.addEventListener("click",()=>{const c=n.getAttribute("data-quick");t.people[a].mark=c,t.people[a].event=c==="event",l()})}),e.querySelectorAll("[data-field]").forEach(n=>{const c=n.getAttribute("data-field"),s=()=>{c==="event"?(t.people[a].event=n.checked,n.checked?t.people[a].mark="event":t.people[a].mark==="event"&&(t.people[a].mark="present")):(t.people[a][c]=n.value,c==="mark"&&(t.people[a].event=n.value==="event")),l()};n.addEventListener("change",s),n.addEventListener("input",s)})})}function pe(r){return String(r).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function he(r){return String(r).replaceAll('"',"&quot;").replaceAll("<","&lt;")}async function ge(){if(t.accessCode){await Y(t.accessCode);return}E()}ge();
