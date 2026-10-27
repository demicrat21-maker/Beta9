/* Меню: правьте названия, состав, вес и цену */
const DISHES = [
  {n:"Тартар из лосося",        d:"Авокадо, каперсы, чипсы из нори",   w:"60 г",  p:420, t:["cold"]},
  {n:"Брускетта с рикоттой",    d:"Печёная свёкла, мёд, орех",          w:"50 г",  p:260, t:["cold","veg"]},
  {n:"Салат с тыквой",          d:"Рукола, фета, кедровый орех",        w:"180 г", p:390, t:["cold","veg","gf"]},
  {n:"Утиная грудка",           d:"Соус из вишни, пюре из сельдерея",   w:"220 г", p:890, t:["hot","gf"]},
  {n:"Ризотто с белыми грибами",d:"Пармезан, трюфельное масло",         w:"250 г", p:640, t:["hot","veg","gf"]},
  {n:"Стейк из индейки",        d:"Овощи гриль, соус демиглас",         w:"240 г", p:720, t:["hot"]},
  {n:"Панна-котта",             d:"Малиновое кули, мята",               w:"90 г",  p:310, t:["sweet","veg","gf"]},
  {n:"Эклеры ассорти",          d:"Фисташка, ваниль, карамель",         w:"40 г",  p:240, t:["sweet","veg"]}
];
const list = document.getElementById("dishes");
function render(f){
  list.innerHTML = DISHES.filter(d => f === "all" || d.t.includes(f)).map(d =>
    `<li><div><h3>${d.n}</h3><p>${d.d}</p></div><span class="w">${d.w}</span><span class="pr">${d.p} ₽</span></li>`).join("");
}
document.querySelector(".filters").addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === b));
  render(b.dataset.f);
});
render("all");

/* Вкладки с работами */
const tabs=[...document.querySelectorAll(".tab")];
function openTab(t){
  tabs.forEach(b=>{
    const on=b===t;
    b.classList.toggle("on",on);
    b.setAttribute("aria-selected",on);
    b.tabIndex=on?0:-1;
    document.getElementById(b.getAttribute("aria-controls")).hidden=!on;
  });
}
tabs.forEach((t,i)=>{
  t.addEventListener("click",()=>openTab(t));
  t.addEventListener("keydown",e=>{
    const d={ArrowRight:1,ArrowLeft:-1}[e.key]; if(!d) return;
    const n=tabs[(i+d+tabs.length)%tabs.length]; n.focus(); openTab(n);
  });
});

/* Меню на телефоне (если не сработает, остальной сайт продолжит работать) */
(function(){try{
  var b=document.querySelector(".burger"),n=document.getElementById("nav");
  if(!b||!n)return;
  function set(o){n.classList.toggle("open",o);b.setAttribute("aria-expanded",o?"true":"false");b.setAttribute("aria-label",o?"Закрыть меню":"Открыть меню");}
  b.addEventListener("click",function(){set(!n.classList.contains("open"));});
  n.addEventListener("click",function(e){if(e.target.closest("a"))set(false);});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")set(false);});
}catch(e){}})();

/* Отзывы (данные берутся из файла reviews.js; при любой ошибке остальной сайт работает) */
(function(){try{
  var box=document.getElementById("reviews-box"); if(!box)return;
  var VK="https://vk.ru/club91135205";
  var all=(typeof REVIEWS!=="undefined"&&Array.isArray(REVIEWS))?REVIEWS:[];
  var list=all.filter(function(r){return r&&r.text;});
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
  function btn(label){var a=el("a","btn",label);a.href=VK;a.target="_blank";a.rel="noopener";return a;}
  if(!list.length){
    var d=el("div","empty");
    d.appendChild(el("p",null,"Здесь скоро появятся отзывы наших клиентов. Праздновали с нами? Напишите несколько слов, нам важно ваше мнение."));
    d.appendChild(btn("Оставить отзыв"));
    box.appendChild(d);return;
  }
  var grid=el("div","reviews-list");
  list.forEach(function(r){
    var f=el("figure","review");
    var n=parseInt(r.stars,10);
    if(n>=1&&n<=5){var s=el("div","stars",new Array(n+1).join("\u2605"));s.setAttribute("aria-label","Оценка "+n+" из 5");f.appendChild(s);}
    f.appendChild(el("blockquote",null,r.text));
    var c=el("figcaption",null,r.name||"Клиент");
    if(r.event)c.appendChild(el("span",null,r.event));
    f.appendChild(c);grid.appendChild(f);
  });
  box.appendChild(grid);
  var w=el("div","reviews-cta");w.appendChild(btn("Оставить отзыв"));box.appendChild(w);
}catch(e){}})();

/* Плавное появление блоков при прокрутке (если что-то не поддерживается, всё просто видно сразу) */
(function(){try{
  if(!("IntersectionObserver" in window))return;
  if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  var sel=".block > h2,.block > .intro,.tabs,.case-title,.filters,.dishes,.tile,.steps li,.gallery figure,.gallery4 figure,details,.reviews-list,#reviews-box .empty,.contact > *";
  var items=[].slice.call(document.querySelectorAll(sel));
  var seen=[],count=new Map();
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(!en.isIntersecting)return;
      var el=en.target;io.unobserve(el);
      el.classList.add("in");
      var d=parseInt(el.getAttribute("data-d")||"0",10);
      setTimeout(function(){el.classList.remove("reveal","in");el.style.transitionDelay="";},900+d);
    });
  },{threshold:0,rootMargin:"0px 0px -6% 0px"});
  items.forEach(function(el){
    if(seen.indexOf(el)>-1)return;seen.push(el);
    var p=el.parentNode,i=count.get(p)||0;count.set(p,i+1);
    var d=Math.min(i,5)*90;
    el.setAttribute("data-d",d);el.style.transitionDelay=d+"ms";
    el.classList.add("reveal");io.observe(el);
  });
}catch(e){}})();

/* Подразделы «Фотографии / Видео» и видео из ВКонтакте (при ошибке остальной сайт работает) */
(function(){try{
  var VK="https://vk.ru/club91135205";
  var NAMES={wedding:"Свадьбы",buffet:"Фуршет",banquet:"Банкет",dishes:"Блюда"};
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
  function link(label,href,cls){var a=el("a",cls||null,label);a.href=href;a.target="_blank";a.rel="noopener";return a;}

  /* переключатель Фотографии / Видео внутри каждой вкладки */
  [].forEach.call(document.querySelectorAll(".subtabs"),function(group){
    var btns=[].slice.call(group.querySelectorAll(".subtab"));
    function open(b){
      btns.forEach(function(x){
        var on=x===b;
        x.classList.toggle("on",on);x.setAttribute("aria-selected",on?"true":"false");x.tabIndex=on?0:-1;
        document.getElementById(x.getAttribute("aria-controls")).hidden=!on;
      });
    }
    btns.forEach(function(b,i){
      b.addEventListener("click",function(){open(b);});
      b.addEventListener("keydown",function(e){
        var d={ArrowRight:1,ArrowLeft:-1}[e.key];if(!d)return;
        var n=btns[(i+d+btns.length)%btns.length];n.focus();open(n);
      });
    });
  });

  /* видео */
  var data=(typeof VIDEOS!=="undefined"&&VIDEOS)?VIDEOS:{};
  [].forEach.call(document.querySelectorAll(".subpanel[data-cat]"),function(panel){
    var cat=panel.getAttribute("data-cat"),box=panel.querySelector(".video-box");
    var list=(Array.isArray(data[cat])?data[cat]:[]).filter(function(v){return v&&(v.embed||(v.oid&&v.id));});
    if(!list.length){
      var d=el("div","empty");
      d.appendChild(el("p",null,"Видео в разделе «"+(NAMES[cat]||"")+"» скоро появятся здесь. Хотите посмотреть примеры сейчас? Загляните к нам ВКонтакте."));
      d.appendChild(link("Смотреть во ВКонтакте",VK,"btn"));
      box.appendChild(d);return;
    }
    var wrap=el("div","video-list");
    list.forEach(function(v){
      var item=el("figure","video-item"+(v.vertical?"":" h"));
      var frame=el("div","video-frame");
      frame.style.aspectRatio=v.vertical?"9 / 16":"16 / 9";
      var poster=el("button","video-poster");
      poster.type="button";
      poster.setAttribute("aria-label","Смотреть видео"+(v.title?": "+v.title:""));
      poster.appendChild(el("span","play","\u25B6"));
      poster.appendChild(el("span","pt","Смотреть видео"));
      poster.addEventListener("click",function(){
        var src=v.embed||("https://vk.ru/video_ext.php?oid="+v.oid+"&id="+v.id+"&hd=2");
        src+=(src.indexOf("?")>-1?"&":"?")+"autoplay=1";
        var f=document.createElement("iframe");
        f.src=src;f.allow="autoplay; encrypted-media; fullscreen; picture-in-picture";
        f.setAttribute("allowfullscreen","");f.setAttribute("title",v.title||"Видео");
        frame.innerHTML="";frame.appendChild(f);
      });
      frame.appendChild(poster);
      item.appendChild(frame);
      var cap=el("figcaption");
      if(v.title)cap.appendChild(el("span","vt",v.title));
      if(v.url)cap.appendChild(link("Открыть во ВКонтакте",v.url,"vl"));
      item.appendChild(cap);
      wrap.appendChild(item);
    });
    box.appendChild(wrap);
  });
}catch(e){}})();

/* Фильтры фотографий по видам (при ошибке остальной сайт работает) */
(function(){try{
  var TYPES={
    wedding:[["all","Все"],["president","Президиум"],["photozone","Фотозоны и рассадка"],["tables","Столы гостей"],["decor","Декор и детали"]],
    dishes:[["all","Все"],["snacks","Нарезки и закуски"],["hot","Горячее"],["pickles","Соленья"]]
  };
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
  Object.keys(TYPES).forEach(function(cat){
    var panel=document.getElementById(cat+"-photos");if(!panel)return;
    var figs=[].slice.call(panel.querySelectorAll("figure[data-type]"));
    if(!figs.length)return;
    var bar=el("div","ptypes");bar.setAttribute("role","group");bar.setAttribute("aria-label","Виды фотографий");
    var result=el("div","gf off");
    var kids=[].slice.call(panel.children);
    function show(type,btn){
      [].forEach.call(bar.children,function(b){var on=b===btn;b.classList.toggle("on",on);b.setAttribute("aria-pressed",on?"true":"false");});
      if(type==="all"){
        kids.forEach(function(k){k.classList.remove("off");});
        result.classList.add("off");result.innerHTML="";return;
      }
      kids.forEach(function(k){k.classList.add("off");});
      result.innerHTML="";
      figs.forEach(function(f){
        if((f.getAttribute("data-type")||"").split(" ").indexOf(type)>-1){
          var c=f.cloneNode(true);
          c.classList.remove("reveal","in");c.style.transitionDelay="";c.removeAttribute("data-d");
          result.appendChild(c);
        }
      });
      result.classList.remove("off");
    }
    TYPES[cat].forEach(function(t,i){
      var b=el("button","ptype"+(i===0?" on":""),t[1]);b.type="button";b.setAttribute("aria-pressed",i===0?"true":"false");
      b.addEventListener("click",function(){show(t[0],b);});
      bar.appendChild(b);
    });
    panel.insertBefore(bar,panel.firstChild);
    panel.appendChild(result);
  });
}catch(e){}})();

/* Учёт нажатий на кнопки ВКонтакте и Макс в Яндекс Метрике (если Метрика недоступна, ничего не происходит) */
(function(){try{
  document.addEventListener("click",function(e){
    var a=e.target.closest&&e.target.closest("a[href]");
    if(!a||typeof ym!=="function")return;
    var h=a.href||"",g=h.indexOf("vk.ru")>-1?"vk_click":(h.indexOf("max.ru")>-1?"max_click":"");
    if(g)ym(113834187,"reachGoal",g);
  });
}catch(e){}})();
