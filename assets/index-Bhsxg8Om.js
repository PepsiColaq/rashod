(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))l(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&l(d)}).observe(document,{childList:!0,subtree:!0});function r(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function l(a){if(a.ep)return;a.ep=!0;const s=r(a);fetch(a.href,s)}})();const I="0903-ПД3",U=[{surname:"Аредакова",fullName:"Аредакова Ангелина Артуровна"},{surname:"Брюкин",fullName:"Брюкин Бекзод Михайлович"},{surname:"Бендас",fullName:"Бендас Анастасия"},{surname:"Боджгуа",fullName:"Боджгуа Аманда Руслановна"},{surname:"Войцеховский",fullName:"Войцеховский Никита Владимирович"},{surname:"Вольская",fullName:"Вольская Виктория Андреевна"},{surname:"Денисенко",fullName:"Денисенко Руслан Анатольевич"},{surname:"Жирикова",fullName:"Жирикова Милана Эдуардовна"},{surname:"Исмаилов",fullName:"Исмаилов Алексей Александрович"},{surname:"Камышева",fullName:"Камышева Стефания Александровна"},{surname:"Клименко",fullName:"Клименко Семен Никитич"},{surname:"Кобзева",fullName:"Кобзева Анастасия Антоновна"},{surname:"Коробейникова",fullName:"Коробейникова Екатерина Дмитриевна"},{surname:"Крупенина",fullName:"Крупенина Виктория Дмитриевна"},{surname:"Ломакин",fullName:"Ломакин Даниил Антонович"},{surname:"Матвеев",fullName:"Матвеев Матвей Геннадьевич"},{surname:"Николаев",fullName:"Николаев Степан Андреевич"},{surname:"Пронин",fullName:"Пронин Владислав Александрович"},{surname:"Тюшкин",fullName:"Тюшкин Максим Андреевич"},{surname:"Цирульник",fullName:"Цирульник Данила Андреевич"},{surname:"Шакшуева",fullName:"Шакшуева Екатерина Игоревна"},{surname:"Ясинецкая",fullName:"Ясинецкая Дарина Дмитриевна"}],C={present:{label:"Есть (+)",short:"+"},absent:{label:"Нет (−)",short:"−"},duty:{label:"Наряд (Н)",short:"Н"},event:{label:"Мероприятие (МП)",short:"МП"},excused:{label:"Отпущен (О)",short:"О"},sick:{label:"Болен (Б)",short:"Б"},unknown:{label:"Н/П",short:"Н/П"},unauthorized:{label:"Самоволка (С)",short:"С"},empty:{label:"Не распознано",short:"?"}},ee=["present","absent","duty","event"];function O(n){const e=n.group||I,r=n.people||[],l=r.length,a=r.filter(i=>i.event||i.mark==="event"),s=r.filter(i=>!(i.event||i.mark==="event")&&i.mark==="duty"),d=r.filter(i=>!(i.event||i.mark==="event")&&i.mark!=="duty"&&(i.mark==="absent"||i.mark==="excused"||i.mark==="sick"||i.mark==="unknown"||i.mark==="unauthorized")),h=l-d.length-a.length-s.length,f=[`Расход группы ${e}:`,`По списку: ${l}`,`На лицо: ${h}`];if(d.length){f.push(`Отсутствуют: ${d.length}`);for(const i of d){const o=(i.reason||"").trim();f.push(o?`${i.surname} (${o})`:i.surname)}}else f.push("Отсутствуют: 0");f.push(""),f.push(`Мероприятие: ${a.length}`);for(const i of a)f.push(i.surname);f.push(""),f.push(`Наряд: ${s.length}`);for(const i of s)f.push(i.surname);return f.join(`
`).trimEnd()}const te="https://master.rashod.pages.dev";function R(n){if(typeof location<"u"){const e=location.hostname||"";if(e.endsWith("pages.dev")||e==="localhost"||e==="127.0.0.1")return`/api${n}`}return`${te}/api${n}`}function ae(){const n=new Date,e=n.getFullYear(),r=String(n.getMonth()+1).padStart(2,"0"),l=String(n.getDate()).padStart(2,"0");return`${e}-${r}-${l}`}function H(n){const e=String(n).split("-");return Number(e[2]||0)}function F(n){const[e,r,l]=String(n).split("-");return!e||!r||!l?n:`${l}.${r}.${e}`}function ne(n){return new Promise((e,r)=>{const l=new FileReader;l.onload=()=>e(l.result),l.onerror=()=>r(new Error("Не удалось прочитать файл")),l.readAsDataURL(n)})}function Q(n){return new Promise((e,r)=>{const l=new Image;l.onload=()=>e(l),l.onerror=()=>r(new Error("Битый файл изображения")),l.src=n})}function W(n,e,r,l){const a=(l*e+r)*4;return(n[a]+n[a+1]+n[a+2])/3}function re(n,e,r,l){const a=Math.floor(r*.25),s=Math.floor(r*.55),d=new Float32Array(e),h=new Float32Array(e);for(let c=0;c<e;c++){let m=0,w=0;const g=s-a;for(let M=a;M<s;M++){const u=W(n,e,c,M);m+=u,w+=u*u}const E=m/g;d[c]=E,h[c]=Math.sqrt(Math.max(0,w/g-E*E))}const f=new Float32Array(e);for(let c=0;c<e;c++)f[c]=d[c]>140&&d[c]<165&&h[c]<48?1:0;const i=new Float32Array(e);for(let c=0;c<e;c++){let m=0,w=0;for(let g=-3;g<=3;g++){const E=c+g;E>=0&&E<e&&(m+=f[E],w++)}i[c]=m/w>.5?1:0}const o=[];for(let c=0;c<e;)if(i[c]){let m=c;for(;m<e&&i[m];)m++;m-c>15&&o.push([c,m]),c=m}else c++;const p=e/6,k=Number(l)||15;let b,y;if(o.length&&k>=25){const c=o.reduce((w,g)=>g[1]-g[0]>w[1]-w[0]?g:w),m=(k-28)*p;b=Math.floor(c[1]+p*.08+m),y=Math.floor(c[1]+p*.92+m)}else k<=10?(b=Math.floor(e*.05),y=Math.floor(e*.28)):k<=20?(b=Math.floor(e*.28),y=Math.floor(e*.52)):(b=Math.floor(e*.38),y=Math.floor(e*.58));return b=Math.max(0,b),y=Math.min(e,Math.max(b+24,y)),[b,y]}function oe(n,e,r,l,a){const s=new Float32Array(r),d=new Float32Array(r);for(let o=0;o<r;o++){let p=255,k=0;const b=a-l;for(let y=l;y<a;y++){const c=W(n,e,y,o);c<p&&(p=c),k+=c}s[o]=Math.max(0,150-p),d[o]=k/b}const h=new Float32Array(r);for(let o=0;o<r;o++){let p=0,k=0;for(let b=-2;b<=2;b++){const y=o+b;y>=0&&y<r&&(p+=s[y],k++)}h[o]=p/k}let f=0;for(let o=0;o<r;o++)if(d[o]>140){f=o;break}const i=[];for(let o=f+15;o<r-40;o++)h[o]>8&&h[o]>=h[o-1]&&h[o]>=h[o+1]&&(!i.length||o-i[i.length-1]>22)&&i.push(o);return{peaks:i,paper0:f}}function se(n,e,r,l,a,s){const{peaks:d,paper0:h}=oe(n,e,r,l,a);if(d.length<3){const p=h+100,b=(r-80-p)/s;return Array.from({length:s},(y,c)=>Math.round(p+(c+.5)*b))}const f=d.length>=s+2?d[2]:d[0];let i=45,o=null;for(let p=25;p<=40;p+=.25){let k=0,b=0;for(let m=0;m<s;m++){const w=f+m*p;let g=1/0;for(const E of d){const M=Math.abs(E-w);M<g&&(g=M)}g<p*.35&&k++,b+=g}const y=k,c=-b;(!o||y>o.hits||y===o.hits&&c>o.dist)&&(o={hits:y,dist:c},i=p)}return Array.from({length:s},(p,k)=>Math.round(f+k*i))}async function le(n,e,r,l=.78){const a=await Q(n),s=a.width,d=a.height,h=Number(e)||15,f=h<=10?.32:h<=20?.5:.82,i=Math.floor(s*f),o=Math.floor(d*.05),p=Math.ceil(d*.95),k=s-i,b=p-o,y=2,c=document.createElement("canvas");c.width=Math.max(1,k*y),c.height=Math.max(1,b*y);const m=c.getContext("2d",{willReadFrequently:!0});m.imageSmoothingEnabled=!0,m.imageSmoothingQuality="high",m.drawImage(a,i,o,k,b,0,0,c.width,c.height);const w=c.width,g=c.height,E=m.getImageData(0,0,w,g),{data:M}=E,[u,S]=re(M,w,g,h),v=se(M,w,g,u,S,r);m.fillStyle="#fff",m.fillRect(0,0,u,g),m.fillRect(S,0,w-S,g);for(let N=0;N<v.length;N++){const q=v[N],T=Math.max(0,u-52),G=q-14;m.fillStyle="#ffe600",m.strokeStyle="#c80000",m.lineWidth=2,m.fillRect(T,G,u-4-T,28),m.strokeRect(T+.5,G+.5,u-4-T-1,27),m.fillStyle="#c80000",m.font="bold 22px Arial, sans-serif",m.textBaseline="middle",m.fillText(String(N+1),Math.max(4,u-46),q)}const D=v.length>1?Math.max(14,Math.round(Math.abs(v[1]-v[0])/2)):20,_=Math.max(0,v[0]-D-8),V=Math.min(g,v[v.length-1]+D+8),B=Math.max(0,u-55),Z=Math.min(w,S+8),A=document.createElement("canvas");A.width=Math.max(1,Z-B),A.height=Math.max(1,V-_),A.getContext("2d").drawImage(c,B,_,A.width,A.height,0,0,A.width,A.height);const P=120;if(A.width>P){const N=document.createElement("canvas");N.width=P,N.height=Math.round(A.height*P/A.width);const q=N.getContext("2d");return q.imageSmoothingEnabled=!0,q.imageSmoothingQuality="high",q.drawImage(A,0,0,N.width,N.height),N.toDataURL("image/jpeg",l)}return A.toDataURL("image/jpeg",l)}async function ce(n,e=2e3,r=.82){const l=await ne(n),a=await Q(l),s=Math.min(1,e/Math.max(a.width,a.height)),d=Math.round(a.width*s),h=Math.round(a.height*s),f=document.createElement("canvas");return f.width=d,f.height=h,f.getContext("2d").drawImage(a,0,0,d,h),{full:f.toDataURL("image/jpeg",r),crop:""}}function J(){return U.map(n=>({surname:n.surname,fullName:n.fullName,mark:"present",reason:"",event:!1,confidence:null}))}const z="rashod_access_code",ie="nikitosbrateevo";function ue(){try{return sessionStorage.getItem(z)||""}catch{return""}}function j(n){try{n?sessionStorage.setItem(z,n):sessionStorage.removeItem(z)}catch{}}function de(n){return String(n||"").trim().replace(/\s+/g,"")}const t={accessCode:ue(),unlocked:!1,authBusy:!1,authError:"",date:ae(),imageDataUrl:"",imageCropDataUrl:"",people:J(),busy:!1,message:"",error:!1,usage:null},x=document.querySelector("#app");function $(n,e=!1){t.message=n,t.error=e,L()}function me(){return R("/recognize")}function X(n){const e=de(n);if(!e){t.authError="Введи код доступа",t.unlocked=!1,L();return}if(e!==ie){t.unlocked=!1,t.accessCode="",j(""),t.authError="Неверный код",L();return}t.accessCode=e,t.unlocked=!0,t.authError="",t.authBusy=!1,j(e),L()}function Y(){t.unlocked=!1,t.accessCode="",j(""),t.authError="",L()}async function fe(){var e,r,l;if(!t.unlocked||!t.accessCode){$("Сначала введи код доступа",!0);return}if(!t.imageDataUrl){$("Сначала выбери фото листа",!0);return}const n=H(t.date);if(!n){$("Укажи дату",!0);return}t.busy=!0,$("Читаю знаки…");try{const a=R("/health").replace(/\/health$/,"");$("Проверяю API…");try{const u=new AbortController,S=setTimeout(()=>u.abort(),8e3),v=await fetch(R("/health"),{method:"GET",cache:"no-store",signal:u.signal});if(clearTimeout(S),!v.ok)throw new Error("health "+v.status)}catch{throw new Error("Нет связи с API. Проверь интернет и обнови страницу")}$("Режу столбец дня…");const d={imageDayCropBase64:await Promise.race([le(t.imageDataUrl,n,U.length,.55),new Promise((u,S)=>setTimeout(()=>S(new Error("Нарезка фото зависла. Выбери фото ещё раз")),15e3))]),mimeType:"image/jpeg",day:n,group:I,roster:U,accessCode:t.accessCode},h=JSON.stringify(d),f=Math.round(h.length/1024);$(`Отправляю (~${f} КБ)…`);async function i(u){const S=new AbortController,v=setTimeout(()=>S.abort(),u*1e3);try{return await fetch(me(),{method:"POST",mode:"cors",credentials:"omit",cache:"no-store",headers:{"Content-Type":"text/plain;charset=UTF-8","X-Access-Code":t.accessCode},body:h,signal:S.signal})}finally{clearTimeout(v)}}let o;try{o=await i(28)}catch{$("Повтор…"),await new Promise(u=>setTimeout(u,500)),o=await i(28)}const p=await o.json().catch(()=>({}));if(o.status===401)throw Y(),new Error(p.error||"Код доступа не принят");if(!o.ok||!p.ok){const u=String(p.error||"");throw/таймаут|524|timeout|не JSON|Polza/i.test(u)?new Error("Модель не успела за 12с. Подожди и нажми «Распознать» снова"):new Error(p.error||`Ошибка API (${o.status})`)}const k=((e=p.result)==null?void 0:e.students)||[],b=new Map(k.map(u=>[String(u.surname||"").trim().toLowerCase(),u])),y=u=>{const S=String(u??"").trim().toLowerCase().replaceAll(".","");return{present:"present","+":"present",plus:"present",absent:"absent","-":"absent","−":"absent",duty:"duty",н:"duty",h:"duty",event:"event",мп:"event",mp:"event",ип:"event",мероприятие:"event",excused:"excused",о:"excused",sick:"sick",б:"sick",unknown:"unknown",unauthorized:"unauthorized",empty:"empty"}[S]||(C[S]?S:null)};t.people=U.map((u,S)=>{const v=b.get(u.surname.toLowerCase())||k[S]||{},D=y(v.mark)||(C[v.mark]?v.mark:"empty");return{surname:u.surname,fullName:u.fullName,mark:D,reason:"",event:D==="event"||!!v.event,confidence:typeof(v==null?void 0:v.confidence)=="number"?v.confidence:null,disagreed:!!v.disagreed}}),t.usage=p.usage||null;const c=t.people.filter(u=>u.mark==="present").length,m=t.people.filter(u=>["absent","excused","sick","unknown","unauthorized"].includes(u.mark)).length,w=t.people.filter(u=>u.mark==="duty").length,g=t.people.filter(u=>u.mark==="empty").length,E=t.people.filter(u=>u.disagreed).length,M=((r=p.usage)==null?void 0:r.cost_rub)??((l=p.usage)==null?void 0:l.cost);if(g===t.people.length)$("Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.",!0);else{const u=["Готово",`+${c}`,`нет ${m}`,`наряд ${w}`];g&&u.push(`пусто ${g}`),E&&u.push(`спорных ${E} — проверь`),M!=null&&u.push(`~${Number(M).toFixed(2)} ₽`),$(u.join(". ")+". Допиши причины при необходимости.")}}catch(a){const s=(a==null?void 0:a.name)==="AbortError"?"Ответ не пришёл вовремя. Нажми «Распознать» ещё раз":/failed to fetch|networkerror|load failed/i.test((a==null?void 0:a.message)||"")?"Обрыв связи с API. Подожди 2 сек и нажми «Распознать» снова":a.message||String(a);$(s,!0)}finally{t.busy=!1,L()}}async function K(n){if(n)try{t.busy=!0,$("Готовлю фото…");const e=await ce(n);t.imageDataUrl=e.full,t.imageCropDataUrl=e.crop,$("Фото готово — нажми «Распознать»")}catch(e){$(e.message||String(e),!0)}finally{t.busy=!1,L()}}async function he(){const n=O({group:I,dateLabel:F(t.date),people:t.people});try{await navigator.clipboard.writeText(n),$("Текст скопирован")}catch{$("Не удалось скопировать — выдели вручную",!0)}}function pe(){x.innerHTML=`
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
  `;const n=x.querySelector("#access-code"),e=()=>X(n.value);x.querySelector("#unlock").addEventListener("click",e),n.addEventListener("keydown",r=>{r.key==="Enter"&&e()}),n.focus()}function L(){if(!t.unlocked){pe();return}const n=O({group:I,dateLabel:F(t.date),people:t.people});x.innerHTML=`
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
        ${t.people.map((e,r)=>{var a,s,d;const l=e.confidence!=null&&e.confidence<.55;return`
            <div class="person" data-i="${r}">
              <div class="person-top">
                <div class="person-name">${e.surname}</div>
                ${l||e.mark==="empty"||e.disagreed?`<span class="badge warn">${e.disagreed?"спорно — проверь":((a=C[e.mark])==null?void 0:a.label)||"проверить"}</span>`:`<span class="badge">${((s=C[e.mark])==null?void 0:s.short)||"?"} ${((d=C[e.mark])==null?void 0:d.label)||""}</span>`}
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
  `,x.querySelector("#logout").addEventListener("click",()=>Y()),x.querySelector("#date").addEventListener("change",e=>{t.date=e.target.value,L()}),x.querySelector("#file").addEventListener("change",e=>{var l;const r=(l=e.target.files)==null?void 0:l[0];K(r)}),x.querySelector("#file-camera").addEventListener("change",e=>{var l;const r=(l=e.target.files)==null?void 0:l[0];K(r)}),x.querySelector("#pick-gallery").addEventListener("click",()=>{x.querySelector("#file").click()}),x.querySelector("#pick-camera").addEventListener("click",()=>{x.querySelector("#file-camera").click()}),x.querySelector("#recognize").addEventListener("click",()=>fe()),x.querySelector("#reset").addEventListener("click",()=>{t.people=J(),$("Список сброшен")}),x.querySelector("#copy").addEventListener("click",()=>he()),x.querySelectorAll(".person").forEach(e=>{const r=Number(e.dataset.i),l=()=>{var f,i;const a=x.querySelector("#out");a&&(a.value=O({group:I,dateLabel:F(t.date),people:t.people}));const s=e.querySelector(".badge"),d=t.people[r].mark;s&&(s.textContent=`${((f=C[d])==null?void 0:f.short)||"?"} ${((i=C[d])==null?void 0:i.label)||""}`,s.classList.toggle("warn",d==="empty"||t.people[r].confidence!=null&&t.people[r].confidence<.55)),e.querySelectorAll(".mark-btn").forEach(o=>{o.classList.toggle("active",o.getAttribute("data-quick")===d)});const h=e.querySelector('[data-field="mark"]');h&&(h.value=d)};e.querySelectorAll("[data-quick]").forEach(a=>{a.addEventListener("click",()=>{const s=a.getAttribute("data-quick");t.people[r].mark=s,t.people[r].event=s==="event",l()})}),e.querySelectorAll("[data-field]").forEach(a=>{const s=a.getAttribute("data-field"),d=()=>{s==="event"?(t.people[r].event=a.checked,a.checked?t.people[r].mark="event":t.people[r].mark==="event"&&(t.people[r].mark="present")):(t.people[r][s]=a.value,s==="mark"&&(t.people[r].event=a.value==="event")),l()};a.addEventListener("change",d),a.addEventListener("input",d)})})}function ge(n){return String(n).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function ye(n){return String(n).replaceAll('"',"&quot;").replaceAll("<","&lt;")}function be(){if(t.accessCode){X(t.accessCode);return}L()}be();
