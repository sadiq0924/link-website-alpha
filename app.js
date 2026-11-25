/* ===================== SETTINGS - SIRF YAHAN BADLO ===================== */
var CONFIG = {
  MAIN_LINK: "https://t.me/your_channel",   // <-- apna MAIN link yahan daalo
  WAIT_SECONDS: 30,                          // Step 1, 2, 3 par kitne second ka timer
  FINAL_WAIT: 5,                             // Last page (Step 4) par button kitne second baad aaye
  SITE_NAME: "Alpha<b>Tips</b>",
  PROMO_TITLE: "Hamara Telegram channel join karo",
  PROMO_TEXT: "Daily gaming tips, updates aur naye posts sabse pehle.",
  PROMO_LINK: "https://t.me/your_channel",
  PROMO_BUTTON: "Join Now"
};
/* ====================================================================== */

{
  var PAGES = [
    { file: "index.html", name: "Step 1" },
    { file: "step2.html", name: "Step 2" },
    { file: "step3.html", name: "Step 3" },
    { file: "go.html",    name: "Final"  }
  ];
  var body = document.body;
  var step = Number(body.dataset.step || 1);
  var isFinal = step === 4;

  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  // Bina steps poore kiye seedha aage ke page par aaye to pichle step par bhejo
  var reached = Number(store("chain_step") || 0);
  store("chain_test", "1");
  var storageWorks = store("chain_test") === "1";
  if (storageWorks && step > 1 && reached < step - 1) {
    location.replace(PAGES[Math.max(reached, 0)].file);
  }

  // Header
  document.querySelectorAll("[data-logo]").forEach(function (el) { el.innerHTML = CONFIG.SITE_NAME; });
  var nav = document.querySelector("nav.links");
  if (nav) {
    nav.innerHTML = PAGES.map(function (p, i) {
      return '<a href="' + p.file + '"' + (i + 1 === step ? ' aria-current="page"' : "") + ">" + p.name + "</a>";
    }).join("");
  }

  // Progress bar
  var bar = document.querySelector(".steps");
  if (bar) {
    bar.innerHTML = PAGES.map(function (p, i) {
      var c = i + 1 < step ? "done" : i + 1 === step ? "now" : "";
      return '<div class="' + c + '"></div>';
    }).join("");
  }
  var sl = document.querySelector(".stepline");
  if (sl) sl.textContent = isFinal ? "Step 4 of 4 - aapka link ready ho raha hai" : "Step " + step + " of 4";

  // Promo box
  document.querySelectorAll(".promo").forEach(function (el) {
    el.querySelector("strong").textContent = CONFIG.PROMO_TITLE;
    el.querySelector("span").textContent = CONFIG.PROMO_TEXT;
    var a = el.querySelector("a");
    a.textContent = CONFIG.PROMO_BUTTON;
    a.href = CONFIG.PROMO_LINK;
  });

  // Timer
  var total = isFinal ? CONFIG.FINAL_WAIT : CONFIG.WAIT_SECONDS;
  var left = total;
  var num = document.getElementById("num");
  var arc = document.getElementById("arc");
  var msg = document.getElementById("msg");
  var goBtns = document.querySelectorAll("[data-go]");
  var C = 2 * Math.PI * 54;
  arc.style.strokeDasharray = C;
  arc.style.transition = "stroke-dashoffset 1s linear";

  var nextHref = isFinal ? CONFIG.MAIN_LINK : PAGES[step].file;
  goBtns.forEach(function (b) { b.href = nextHref; b.hidden = true; });

  function paint() {
    num.textContent = left;
    arc.style.strokeDashoffset = C * (left / total);
  }
  paint();

  var t = setInterval(function () {
    if (document.hidden) return;           // tab chhodne par timer ruk jaata hai
    left--;
    paint();
    if (left <= 0) {
      clearInterval(t);
      store("chain_step", String(Math.max(reached, step)));
      num.textContent = "✓";
      arc.style.stroke = "var(--ok)";
      msg.textContent = isFinal ? "Aapka link ready hai. Neeche button dabao." : "Ho gaya! Ab aage badho.";
      goBtns.forEach(function (b) { b.hidden = false; });
    }
  }, 1000);

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}
