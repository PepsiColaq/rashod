(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const s of l.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function a(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(n){if(n.ep)return;n.ep=!0;const l=a(n);fetch(n.href,l)}})();const L="0903-ПД3",I=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджуа",fullName:"Боджуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакшуева",fullName:"Шакшуева Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],E={present:{label:"Есть (+)",short:"+"},absent:{label:"Нет (−)",short:"−"},duty:{label:"Наряд (Н)",short:"Н"},event:{label:"Мероприятие (МП)",short:"МП"},excused:{label:"Отпущен (О)",short:"О"},sick:{label:"Болен (Б)",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка (С)",short:"С"},empty:{label:"Не распознано",short:"?"}},ae=["present","absent","duty","event"];function R(r){const e=r.group||L,a=r.people||[],i=a.length,n=a.filter(u=>u.event||u.mark==="event"),l=a.filter(u=>!(u.event||u.mark==="event")&&u.mark==="duty"),s=a.filter(u=>!(u.event||u.mark==="event")&&u.mark!=="duty"&&(u.mark==="absent"||u.mark==="excused"||u.mark==="sick"||u.mark==="unknown"||u.mark==="unauthorized")),m=i-s.length-n.length-l.length,f=[`Расход группы ${e}:`,`По списку: ${i}`,`На лицо: ${m}`];if(s.length){f.push(`Отсутствуют: ${s.length}`);for(const u of s){const c=(u.reason||"").trim();f.push(c?`${u.surname} (${c})`:u.surname)}}else f.push("Отсутствуют: 0");f.push(""),f.push(`Мероприятие: ${n.length}`);for(const u of n)f.push(u.surname);f.push(""),f.push(`Наряд: ${l.length}`);for(const u of l)f.push(u.surname);return f.join(`
`).trimEnd()}const K="https://rashod-api.voyc-nikita.workers.dev".replace(/\/$/,"");function ne(){const r=new Date,e=r.getFullYear(),a=String(r.getMonth()+1).padStart(2,"0"),i=String(r.getDate()).padStart(2,"0");return`${e}-${a}-${i}`}function H(r){const e=String(r).split("-");return Number(e[2]||0)}function j(r){const[e,a,i]=String(r).split("-");return!e||!a||!i?r:`${i}.${a}.${e}`}function re(r){return new Promise((e,a)=>{const i=new FileReader;i.onload=()=>e(i.result),i.onerror=()=>a(new Error("Не удалось прочитать файл")),i.readAsDataURL(r)})}function X(r){return new Promise((e,a)=>{const i=new Image;i.onload=()=>e(i),i.onerror=()=>a(new Error("Битый файл изображения")),i.src=r})}function Q(r,e,a,i){const n=(i*e+a)*4;return(r[n]+r[n+1]+r[n+2])/3}function oe(r,e,a,i){const n=Math.floor(a*.25),l=Math.floor(a*.55),s=new Float32Array(e),m=new Float32Array(e);for(let d=0;d<e;d++){let o=0,b=0;const p=l-n;for(let M=n;M<l;M++){const $=Q(r,e,d,M);o+=$,b+=$*$}const S=o/p;s[d]=S,m[d]=Math.sqrt(Math.max(0,b/p-S*S))}const f=new Float32Array(e);for(let d=0;d<e;d++)f[d]=s[d]>140&&s[d]<165&&m[d]<48?1:0;const u=new Float32Array(e);for(let d=0;d<e;d++){let o=0,b=0;for(let p=-3;p<=3;p++){const S=d+p;S>=0&&S<e&&(o+=f[S],b++)}u[d]=o/b>.5?1:0}const c=[];for(let d=0;d<e;)if(u[d]){let o=d;for(;o<e&&u[o];)o++;o-d>15&&c.push([d,o]),d=o}else d++;const y=e/6,v=Number(i)||15;let h,g;if(c.length&&v>=25){const d=c.reduce((b,p)=>p[1]-p[0]>b[1]-b[0]?p:b),o=(v-28)*y;h=Math.floor(d[1]+y*.08+o),g=Math.floor(d[1]+y*.92+o)}else v<=10?(h=Math.floor(e*.05),g=Math.floor(e*.28)):v<=20?(h=Math.floor(e*.28),g=Math.floor(e*.52)):(h=Math.floor(e*.38),g=Math.floor(e*.58));return h=Math.max(0,h),g=Math.min(e,Math.max(h+24,g)),[h,g]}function se(r,e,a,i,n){const l=new Float32Array(a),s=new Float32Array(a);for(let c=0;c<a;c++){let y=255,v=0;const h=n-i;for(let g=i;g<n;g++){const d=Q(r,e,g,c);d<y&&(y=d),v+=d}l[c]=Math.max(0,150-y),s[c]=v/h}const m=new Float32Array(a);for(let c=0;c<a;c++){let y=0,v=0;for(let h=-2;h<=2;h++){const g=c+h;g>=0&&g<a&&(y+=l[g],v++)}m[c]=y/v}let f=0;for(let c=0;c<a;c++)if(s[c]>140){f=c;break}const u=[];for(let c=f+15;c<a-40;c++)m[c]>8&&m[c]>=m[c-1]&&m[c]>=m[c+1]&&(!u.length||c-u[u.length-1]>34)&&u.push(c);return{peaks:u,paper0:f}}function le(r,e,a,i,n,l){const{peaks:s,paper0:m}=se(r,e,a,i,n);if(s.length<3){const y=m+100,h=(a-80-y)/l;return Array.from({length:l},(g,d)=>Math.round(y+(d+.5)*h))}const f=s.length>=l+2?s[2]:s[0];let u=45,c=null;for(let y=38;y<=52;y+=.25){let v=0,h=0;for(let o=0;o<l;o++){const b=f+o*y;let p=1/0;for(const S of s){const M=Math.abs(S-b);M<p&&(p=M)}p<y*.35&&v++,h+=p}const g=v,d=-h;(!c||g>c.hits||g===c.hits&&d>c.dist)&&(c={hits:g,dist:d},u=y)}return Array.from({length:l},(y,v)=>Math.round(f+v*u))}async function ce(r,e,a,i=.88){const n=await X(r),l=n.width,s=n.height,m=Number(e)||15,f=m<=10?.32:m<=20?.5:.82,u=Math.floor(l*f),c=Math.floor(s*.05),y=Math.ceil(s*.95),v=l-u,h=y-c,g=3,d=document.createElement("canvas");d.width=Math.max(1,v*g),d.height=Math.max(1,h*g);const o=d.getContext("2d",{willReadFrequently:!0});o.imageSmoothingEnabled=!0,o.imageSmoothingQuality="high",o.drawImage(n,u,c,v,h,0,0,d.width,d.height);const b=d.width,p=d.height,S=o.getImageData(0,0,b,p),{data:M}=S,[$,q]=oe(M,b,p,m),C=le(M,b,p,$,q,a);o.fillStyle="#fff",o.fillRect(0,0,$,p),o.fillRect(q,0,b-q,p);for(let D=0;D<C.length;D++){const B=C[D],U=Math.max(0,$-52),_=B-14;o.fillStyle="#ffe600",o.strokeStyle="#c80000",o.lineWidth=2,o.fillRect(U,_,$-4-U,28),o.strokeRect(U+.5,_+.5,$-4-U-1,27),o.fillStyle="#c80000",o.font="bold 22px Arial, sans-serif",o.textBaseline="middle",o.fillText(String(D+1),Math.max(4,$-46),B)}const P=C.length>1?Math.max(14,Math.round(Math.abs(C[1]-C[0])/2)):20,T=Math.max(0,C[0]-P-8),ee=Math.min(p,C[C.length-1]+P+8),z=Math.max(0,$-55),te=Math.min(b,q+8),x=document.createElement("canvas");x.width=Math.max(1,te-z),x.height=Math.max(1,ee-T),x.getContext("2d").drawImage(d,z,T,x.width,x.height,0,0,x.width,x.height);const A=document.createElement("canvas");A.width=x.width*2,A.height=x.height*2;const O=A.getContext("2d");return O.imageSmoothingEnabled=!0,O.imageSmoothingQuality="high",O.drawImage(x,0,0,A.width,A.height),A.toDataURL("image/jpeg",i)}async function ie(r,e=3e3,a=.92){const i=await re(r),n=await X(i),l=Math.min(1,e/Math.max(n.width,n.height)),s=Math.round(n.width*l),m=Math.round(n.height*l),f=document.createElement("canvas");f.width=s,f.height=m,f.getContext("2d").drawImage(n,0,0,s,m);const u=Math.floor(s*.35),c=document.createElement("canvas");return c.width=s-u,c.height=m,c.getContext("2d").drawImage(f,u,0,s-u,m,0,0,s-u,m),{full:f.toDataURL("image/jpeg",a),crop:c.toDataURL("image/jpeg",a)}}function J(){return I.map(r=>({surname:r.surname,fullName:r.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const F="rashod_access_code";function ue(){try{return sessionStorage.getItem(F)||""}catch{return""}}function Y(r){try{r?sessionStorage.setItem(F,r):sessionStorage.removeItem(F)}catch{}}const t={accessCode:ue(),unlocked:!1,authBusy:!1,authError:"",date:ne(),imageDataUrl:"",imageCropDataUrl:"",people:J(),busy:!1,message:"",error:!1,usage:null},k=document.querySelector("#app");function w(r,e=!1){t.message=r,t.error=e,N()}function W(r){return K?`${K}${r}`:`/api${r}`}function de(){return W("/recognize")}function me(){return W("/auth")}async function V(r){const e=String(r||"").trim();if(!e){t.authError="Введи код доступа",N();return}t.authBusy=!0,t.authError="",N();try{const a=await fetch(me(),{method:"POST",headers:{"Content-Type":"application/json","X-Access-Code":e},body:JSON.stringify({accessCode:e})}),i=await a.json().catch(()=>({}));if(!a.ok||!i.ok)throw new Error(i.error||"Неверный код");t.accessCode=e,t.unlocked=!0,Y(e)}catch(a){t.unlocked=!1,t.authError=a.message||String(a)}finally{t.authBusy=!1,N()}}function Z(){t.unlocked=!1,t.accessCode="",Y(""),t.authError="",N()}async function fe(){var e,a,i;if(!t.unlocked||!t.accessCode){w("Сначала введи код доступа",!0);return}if(!t.imageDataUrl){w("Сначала выбери фото листа",!0);return}const r=H(t.date);if(!r){w("Укажи дату",!0);return}t.busy=!0,w("Читаю знаки по клеткам (1× Pro)…");try{const n=await ce(t.imageDataUrl,r,I.length),l=await fetch(de(),{method:"POST",headers:{"Content-Type":"application/json","X-Access-Code":t.accessCode},body:JSON.stringify({imageBase64:t.imageDataUrl,imageCropBase64:t.imageCropDataUrl||void 0,imageDayCropBase64:n,mimeType:"image/jpeg",day:r,group:L,roster:I,accessCode:t.accessCode})}),s=await l.json().catch(()=>({}));if(l.status===401)throw Z(),new Error(s.error||"Код доступа не принят");if(!l.ok||!s.ok){const o=s.detail?` (${typeof s.detail=="string"?s.detail:""})`:"";throw new Error((s.error||`Ошибка API (${l.status})`)+o)}const m=((e=s.result)==null?void 0:e.students)||[],f=new Map(m.map(o=>[String(o.surname||"").trim().toLowerCase(),o])),u=o=>{const b=String(o??"").trim().toLowerCase().replaceAll(".","");return{present:"present","+":"present",plus:"present",absent:"absent","-":"absent","−":"absent",duty:"duty",н:"duty",h:"duty",event:"event",мп:"event",mp:"event",ип:"event",мероприятие:"event",excused:"excused",о:"excused",sick:"sick",б:"sick",unknown:"unknown",unauthorized:"unauthorized",empty:"empty"}[b]||(E[b]?b:null)};t.people=I.map((o,b)=>{const p=f.get(o.surname.toLowerCase())||m[b]||{},S=u(p.mark)||(E[p.mark]?p.mark:"empty");return{surname:o.surname,fullName:o.fullName,mark:S,reason:"",event:S==="event"||!!p.event,confidence:typeof(p==null?void 0:p.confidence)=="number"?p.confidence:null,disagreed:!!p.disagreed}}),t.usage=s.usage||null;const c=t.people.filter(o=>o.mark==="present").length,y=t.people.filter(o=>["absent","excused","sick","unknown","unauthorized"].includes(o.mark)).length,v=t.people.filter(o=>o.mark==="duty").length,h=t.people.filter(o=>o.mark==="empty").length,g=t.people.filter(o=>o.disagreed).length,d=((a=s.usage)==null?void 0:a.cost_rub)??((i=s.usage)==null?void 0:i.cost);if(h===t.people.length)w("Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.",!0);else{const o=["Готово (2× Pro)",`+${c}`,`нет ${y}`,`наряд ${v}`];h&&o.push(`пусто ${h}`),g&&o.push(`спорных ${g} — проверь`),d!=null&&o.push(`~${Number(d).toFixed(2)} ₽`),w(o.join(". ")+". Допиши причины при необходимости.")}}catch(n){w(n.message||String(n),!0)}finally{t.busy=!1,N()}}async function G(r){if(r)try{t.busy=!0,w("Готовлю фото…");const e=await ie(r);t.imageDataUrl=e.full,t.imageCropDataUrl=e.crop,w("Фото готово — нажми «Распознать»")}catch(e){w(e.message||String(e),!0)}finally{t.busy=!1,N()}}async function pe(){const r=R({group:L,dateLabel:j(t.date),people:t.people});try{await navigator.clipboard.writeText(r),w("Текст скопирован")}catch{w("Не удалось скопировать — выдели вручную",!0)}}function he(){k.innerHTML=`
    <section class="card gate">
      <h1>Расход</h1>
      <p class="sub">Доступ только по коду</p>
      <label>
        Код доступа
        <input id="access-code" type="password" inputmode="numeric" autocomplete="current-password" placeholder="Введи код" />
      </label>
      <div class="actions">
        <button class="primary" id="unlock" ${t.authBusy?"disabled":""}>
          ${t.authBusy?"Проверяю…":"Войти"}
        </button>
      </div>
      <div class="status ${t.authError?"error":""}">${t.authError||""}</div>
    </section>
  `;const r=k.querySelector("#access-code"),e=()=>V(r.value);k.querySelector("#unlock").addEventListener("click",e),r.addEventListener("keydown",a=>{a.key==="Enter"&&e()}),r.focus()}function N(){if(!t.unlocked){he();return}const r=R({group:L,dateLabel:j(t.date),people:t.people});k.innerHTML=`
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
        ${t.people.map((e,a)=>{var n,l,s;const i=e.confidence!=null&&e.confidence<.55;return`
            <div class="person" data-i="${a}">
              <div class="person-top">
                <div class="person-name">${e.surname}</div>
                ${i||e.mark==="empty"||e.disagreed?`<span class="badge warn">${e.disagreed?"спорно — проверь":((n=E[e.mark])==null?void 0:n.label)||"проверить"}</span>`:`<span class="badge">${((l=E[e.mark])==null?void 0:l.short)||"?"} ${((s=E[e.mark])==null?void 0:s.label)||""}</span>`}
              </div>
              <div class="quick-marks">
                ${ae.map(m=>`<button type="button" class="mark-btn ${e.mark===m?"active":""}" data-quick="${m}">${E[m].short}</button>`).join("")}
                <select data-field="mark" class="mark-select" aria-label="Другая отметка">
                  ${Object.entries(E).map(([m,f])=>`<option value="${m}" ${e.mark===m?"selected":""}>${f.label}</option>`).join("")}
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
        <textarea id="out" readonly>${ge(r)}</textarea>
      </label>
      <div class="actions">
        <button class="primary" id="copy">Скопировать</button>
      </div>
    </section>
  `,k.querySelector("#logout").addEventListener("click",()=>Z()),k.querySelector("#date").addEventListener("change",e=>{t.date=e.target.value,N()}),k.querySelector("#file").addEventListener("change",e=>{var i;const a=(i=e.target.files)==null?void 0:i[0];G(a)}),k.querySelector("#file-camera").addEventListener("change",e=>{var i;const a=(i=e.target.files)==null?void 0:i[0];G(a)}),k.querySelector("#pick-gallery").addEventListener("click",()=>{k.querySelector("#file").click()}),k.querySelector("#pick-camera").addEventListener("click",()=>{k.querySelector("#file-camera").click()}),k.querySelector("#recognize").addEventListener("click",()=>fe()),k.querySelector("#reset").addEventListener("click",()=>{t.people=J(),w("Список сброшен")}),k.querySelector("#copy").addEventListener("click",()=>pe()),k.querySelectorAll(".person").forEach(e=>{const a=Number(e.dataset.i),i=()=>{var f,u;const n=k.querySelector("#out");n&&(n.value=R({group:L,dateLabel:j(t.date),people:t.people}));const l=e.querySelector(".badge"),s=t.people[a].mark;l&&(l.textContent=`${((f=E[s])==null?void 0:f.short)||"?"} ${((u=E[s])==null?void 0:u.label)||""}`,l.classList.toggle("warn",s==="empty"||t.people[a].confidence!=null&&t.people[a].confidence<.55)),e.querySelectorAll(".mark-btn").forEach(c=>{c.classList.toggle("active",c.getAttribute("data-quick")===s)});const m=e.querySelector('[data-field="mark"]');m&&(m.value=s)};e.querySelectorAll("[data-quick]").forEach(n=>{n.addEventListener("click",()=>{const l=n.getAttribute("data-quick");t.people[a].mark=l,t.people[a].event=l==="event",i()})}),e.querySelectorAll("[data-field]").forEach(n=>{const l=n.getAttribute("data-field"),s=()=>{l==="event"?(t.people[a].event=n.checked,n.checked?t.people[a].mark="event":t.people[a].mark==="event"&&(t.people[a].mark="present")):(t.people[a][l]=n.value,l==="mark"&&(t.people[a].event=n.value==="event")),i()};n.addEventListener("change",s),n.addEventListener("input",s)})})}function ge(r){return String(r).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function ye(r){return String(r).replaceAll('"',"&quot;").replaceAll("<","&lt;")}async function be(){if(t.accessCode){await V(t.accessCode);return}N()}be();
