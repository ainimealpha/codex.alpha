// script.js - fixes: remove right nav causing visual bug, center indicators, items search/filter layout,
// keep core behavior: carousel, items, detail, tag-jump, pendingTag

// Navigation helpers
function goHome(){ window.location.href = "index.html"; }
function goBack(){ window.history.back(); }

// Category theme mapping (pastel gradients + tag bg)
const CATEGORY_THEME = {
  CHARACTER: { bg: "linear-gradient(180deg,#ffdfe4,#ffd0d6)", tagBg: "#ffd6da", accent: "#ff6b6b" },
  AREA:      { bg: "linear-gradient(180deg,#fff3e6,#ffd9b8)", tagBg: "#ffe6c7", accent: "#ff9f43" },
  PET:       { bg: "linear-gradient(180deg,#fffbe6,#fff9c0)", tagBg: "#fff5b2", accent: "#ffd54f" },
  MONSTER:   { bg: "linear-gradient(180deg,#f3e8ff,#e8d7ff)", tagBg: "#eadcff", accent: "#9b59b6" },
  MAGIC:     { bg: "linear-gradient(180deg,#e8f4ff,#d0ecff)", tagBg: "#d6efff", accent: "#4da6ff" },
  DEFAULT:   { bg: "linear-gradient(180deg,#f9f1ff,#e6f7ff)", tagBg: "#fff3cd", accent: "#ffd54f" }
};

// shared helpers
function categoryKeys(){ return Object.keys(DATA); }
function repImageForCategory(catKey){
  if(!DATA[catKey]) return (typeof PLACEHOLDER !== "undefined" ? PLACEHOLDER : "");
  const it = DATA[catKey].items && DATA[catKey].items[0];
  return (it && it.images && it.images.main) ? it.images.main : (typeof PLACEHOLDER !== "undefined" ? PLACEHOLDER : "");
}

// Find item by id across DATA
function findItemById(id){
  let found = null;
  Object.keys(DATA).some(catKey => {
    return DATA[catKey].items.some(it => {
      if(String(it.id) === String(id)){ found = it; return true; }
      return false;
    });
  });
  return found;
}

// Apply category visual theme (used on items & detail)
function applyCategoryTheme(catKey){
  const theme = (catKey && CATEGORY_THEME[catKey]) ? CATEGORY_THEME[catKey] : CATEGORY_THEME.DEFAULT;
  document.body.style.background = theme.bg;
  document.documentElement.style.setProperty('--tag-bg', theme.tagBg);
  document.documentElement.style.setProperty('--accent-color', theme.accent);
}

// Reset any body background
function resetBodyBackground(){
  document.body.style.background = "";
  document.body.style.backgroundImage = "";
  document.body.style.backgroundSize = "";
  document.body.style.backgroundPosition = "";
  document.body.style.backgroundRepeat = "";
  document.body.style.backgroundAttachment = "";
  const ov = document.getElementById("detailOverlay");
  if(ov) ov.remove();
  const c = document.querySelector(".container");
  if(c){ c.style.position = ""; c.style.zIndex = ""; }
}

/* =========================
   INDEX (page 1) - Carousel
   - Right nav removed; indicators always centered under carousel
========================= */
let carouselIndex = 0;
let carouselTimer = null;
const CAROUSEL_INTERVAL = 3500;

function renderCarousel(){
  const stage = document.getElementById("carouselStage");
  const indicators = document.getElementById("carouselIndicators");
  if(!stage) return;
  const keys = categoryKeys();
  if(keys.length === 0){ stage.innerHTML = ""; return; }
  const total = keys.length;

  const centerKey = keys[carouselIndex];
  const leftIndex = (carouselIndex - 1 + total) % total;
  const rightIndex = (carouselIndex + 1) % total;
  const leftKey = keys[leftIndex];
  const rightKey = keys[rightIndex];

  const centerImg = repImageForCategory(centerKey);
  const leftImg = repImageForCategory(leftKey);
  const rightImg = repImageForCategory(rightKey);

  stage.innerHTML = `
    <div class="slot left-slot" data-key="${leftKey}">
      <img src="${leftImg}" alt="${leftKey} preview" loading="lazy">
      <div class="slot-title">${DATA[leftKey].title}</div>
    </div>

    <div class="slot center-slot" data-key="${centerKey}">
      <img src="${centerImg}" alt="${centerKey} preview" loading="lazy">
      <div class="center-overlay">
        <div class="center-title">${DATA[centerKey].title}</div>
      </div>
    </div>

    <div class="slot right-slot" data-key="${rightKey}">
      <img src="${rightImg}" alt="${rightKey} preview" loading="lazy">
      <div class="slot-title">${DATA[rightKey].title}</div>
    </div>
  `;

  // indicators centered under
  indicators.innerHTML = keys.map((k, i) => `<button class="dot ${i===carouselIndex?'active':''}" onclick="carouselGo(${i})" aria-label="Slide ${i+1}"></button>`).join('');

  // center click -> go to items
  const centerNode = stage.querySelector(".center-slot");
  if(centerNode){
    centerNode.style.cursor = "pointer";
    centerNode.onclick = () => {
      const key = centerNode.dataset.key;
      localStorage.setItem("activeCategory", key);
      localStorage.removeItem("pendingTag");
      window.location.href = "items.html";
    };
  }

  const leftNode = stage.querySelector(".left-slot");
  if(leftNode) leftNode.onclick = () => carouselPrev();
  const rightNode = stage.querySelector(".right-slot");
  if(rightNode) rightNode.onclick = () => carouselNext();
}

function carouselNext(){
  const keys = categoryKeys();
  if(keys.length === 0) return;
  carouselIndex = (carouselIndex + 1) % keys.length;
  renderCarousel();
  restartCarouselTimer();
}

function carouselPrev(){
  const keys = categoryKeys();
  if(keys.length === 0) return;
  carouselIndex = (carouselIndex - 1 + keys.length) % keys.length;
  renderCarousel();
  restartCarouselTimer();
}

function carouselGo(i){
  const keys = categoryKeys();
  if(i < 0 || i >= keys.length) return;
  carouselIndex = i;
  renderCarousel();
  restartCarouselTimer();
}

function restartCarouselTimer(){
  if(carouselTimer) clearInterval(carouselTimer);
  carouselTimer = setInterval(() => carouselNext(), CAROUSEL_INTERVAL);
}

function initCarousel(){
  carouselIndex = 0;
  renderCarousel();
  restartCarouselTimer();
}

/* =========================
   PAGE 2: items + modern chip-style filters (themed checklist BG)
   - Search centered, shorter; Filters placed under search
   - Spacing increased so cards don't "nempel"
========================= */

function uniqueTagsForCategory(catKey){
  if(!DATA[catKey]) return [];
  const s = new Set();
  DATA[catKey].items.forEach(it => (it.tags||[]).forEach(t => s.add(t)));
  return Array.from(s);
}

function showChecklist(catKey){
  hideChecklist();
  const panel = document.createElement("div");
  panel.id = "checklistPanel";
  panel.className = "checklist-panel";
  const tags = uniqueTagsForCategory(catKey);
  let html = `<div class="checklist-header"><strong>Filter tags</strong> <button class="closeChecklist" type="button" onclick="hideChecklist()">✕</button></div>`;
  html += `<div class="checklist-chips">`;
  if(tags.length === 0) html += `<div class="checklist-empty">No tags</div>`;
  tags.forEach(t => {
    html += `<label class="chip"><input type="checkbox" value="${t}"><span>${t}</span></label>`;
  });
  html += `</div><div class="checklist-actions"><button type="button" class="apply-btn" onclick="applyChecklistFilters()">Apply</button></div>`;
  panel.innerHTML = html;
  const container = document.querySelector(".container");
  const itemsNode = document.getElementById("itemsContainer");
  if(container){
    if(itemsNode) container.insertBefore(panel, itemsNode);
    else container.appendChild(panel);
  }
}

function hideChecklist(){
  const panel = document.getElementById("checklistPanel");
  if(panel) panel.remove();
}

function applyChecklistFilters(){
  const panel = document.getElementById("checklistPanel");
  if(!panel) return;
  const checked = Array.from(panel.querySelectorAll('input[type="checkbox"]:checked')).map(i => i.value);
  const searchInput = document.getElementById("searchInput");
  if(searchInput) searchInput.dataset.checkedTags = JSON.stringify(checked);
  hideChecklist();
  renderItems();
}

function manageChecklistToggle(catKey){
  const controls = document.querySelector(".controls");
  if(!controls) return;
  let btn = document.getElementById("checklistToggleBtn");
  if(!btn){
    btn = document.createElement("button");
    btn.id = "checklistToggleBtn";
    btn.className = "checklist-toggle nav-btn";
    btn.type = "button";
    btn.textContent = "Filters";
    btn.onclick = () => {
      const panel = document.getElementById("checklistPanel");
      if(panel) hideChecklist(); else showChecklist(catKey);
    };
    // ensure button appears below search (controls is column-centered)
    controls.appendChild(btn);
  }
  const si = document.getElementById("searchInput");
  if(!si){ btn.style.display = "none"; return; }
  btn.style.display = "inline-block";
}

function renderItems(){
  resetBodyBackground();
  const category = localStorage.getItem("activeCategory");
  if(!category || !DATA[category]) { goHome(); return; }
  applyCategoryTheme(category);

  const data = DATA[category];
  const title = document.getElementById("categoryTitle");
  if(title) title.innerText = data.title;

  // set small logo next to title
  const logo = document.getElementById("categoryLogo");
  if(logo){
    logo.src = repImageForCategory(category);
    logo.alt = data.title + " logo";
  }

  const searchInput = document.getElementById("searchInput");
  const search = searchInput ? searchInput.value.toLowerCase() : "";
  const checkedTags = (searchInput && searchInput.dataset.checkedTags) ? JSON.parse(searchInput.dataset.checkedTags) : [];

  let items = data.items.filter(it => it.name.toLowerCase().includes(search));
  if(checkedTags.length > 0){
    items = items.filter(it => (it.tags||[]).some(t => checkedTags.includes(t)));
  }

  const container = document.getElementById("itemsContainer");
  if(!container) return;
  container.innerHTML = "";
  manageChecklistToggle(category);

  if(items.length === 0){
    container.innerHTML = `<div class="card"><p class="empty">No items match your search.</p></div>`;
    return;
  }

  items.forEach(it => {
    const div = document.createElement("div");
    div.className = "card item-card small-card";
    const thumb = (it.images && it.images.main) ? it.images.main : (typeof PLACEHOLDER !== "undefined" ? PLACEHOLDER : "");
    div.innerHTML = `
      <img src="${thumb}" loading="lazy" alt="${it.name}">
      <h3>${it.name}</h3>
      <p class="nickname">${it.name}</p>
    `;
    div.onclick = () => {
      localStorage.setItem("selectedId", it.id);
      localStorage.setItem("activeCategory", category);
      window.location.href = "detail.html";
    };
    container.appendChild(div);
  });
}

/* apply pendingTag on load (when coming from detail) */
function applyPendingTagOnLoad(){
  const pending = localStorage.getItem("pendingTag");
  if(!pending) return;
  const category = localStorage.getItem("activeCategory");
  showChecklist(category);
  setTimeout(() => {
    const panel = document.getElementById("checklistPanel");
    if(!panel) { localStorage.removeItem("pendingTag"); return; }
    const cb = Array.from(panel.querySelectorAll('input[type="checkbox"]')).find(i => i.value === pending);
    if(cb){
      cb.checked = true;
      applyChecklistFilters();
      localStorage.removeItem("pendingTag");
    } else {
      localStorage.removeItem("pendingTag");
    }
  }, 150);
}

/* =========================
   PAGE 3: unchanged core behavior (tag click -> pendingTag handled above)
========================= */
function ensureDetailOverlay(){
  let ov = document.getElementById("detailOverlay");
  if(!ov){
    ov = document.createElement("div");
    ov.id = "detailOverlay";
    document.body.appendChild(ov);
  }
  ov.style.position = "fixed";
  ov.style.top = "0";
  ov.style.left = "0";
  ov.style.right = "0";
  ov.style.bottom = "0";
  ov.style.background = "linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.95))";
  ov.style.pointerEvents = "none";
  ov.style.zIndex = "1";
  const c = document.querySelector(".container");
  if(c){ c.style.position = "relative"; c.style.zIndex = "2"; }
}

function renderDetail(){
  const container = document.getElementById("detailContainer");
  if(!container) return;
  const id = localStorage.getItem("selectedId");
  if(!id){ container.innerHTML = "<div class='card'><h3>Item not found</h3></div>"; return; }
  const selected = findItemById(id);
  if(!selected){ container.innerHTML = "<div class='card'><h3>Item not found</h3></div>"; return; }

  let category = localStorage.getItem("activeCategory");
  if(!category){
    Object.keys(DATA).some(k => {
      if(DATA[k].items.some(it => String(it.id) === String(id))){ category = k; return true; }
      return false;
    });
  }
  applyCategoryTheme(category);

  const wallpaperUrl = (selected.images && selected.images.main) ? selected.images.main : "";
  if(wallpaperUrl){
    document.body.style.backgroundImage = `url('${wallpaperUrl}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
  } else {
    resetBodyBackground();
    applyCategoryTheme(category);
  }

  ensureDetailOverlay();

  const mainImg = (selected.images && selected.images.main) ? selected.images.main : "";
  const extras = (selected.images && selected.images.extras) ? selected.images.extras.slice(0,3) : [];
  const tags = (selected.tags || []).slice(0,10);
  const narrative = selected.lore ? selected.lore : `${selected.desc} Legends whisper of its origin: a tale woven through time and conflict, shaping the fate of many who stand before it. Once rumored to be forged in ancient trials, its presence now marks the turning point of many adventures.`;

  container.innerHTML = `
    <div class="detail-wrapper">
      <div class="detail-card hero-card">
        <img class="hero-img" src="${mainImg}" alt="${selected.name} main">
        <div class="hero-overlay">
          <h2>${selected.name}</h2>
          <p class="hero-desc">${selected.desc}</p>
          <div class="item-tags">
            ${tags.map(t => `<button class="tag tag-btn" type="button" onclick="onDetailTagClick('${t}','${category}')">${t.toUpperCase()}</button>`).join(' ')}
          </div>
        </div>
      </div>

      <div class="narrative card">
        <h3>Origin</h3>
        <p class="lore-text">${narrative}</p>
      </div>

      <div class="extras">
        ${extras.map((src, idx) => `<div class="extra-thumb"><img src="${src}" alt="extra ${idx+1}" onclick="openImageModal('${src}')"></div>`).join('')}
      </div>
    </div>
  `;
}

function onDetailTagClick(tag, category){
  localStorage.setItem("activeCategory", category);
  localStorage.setItem("pendingTag", tag);
  window.location.href = "items.html";
}

/* Modal handlers (unchanged) */
function openImageModal(src){
  const modal = document.getElementById("imgModal");
  const img = document.getElementById("imgModalImg");
  if(!modal || !img) return;
  img.src = src;
  modal.style.display = "flex";
  const closeBtn = document.getElementById("modalCloseBtn");
  if(closeBtn) closeBtn.focus();
  document.addEventListener("keydown", escModalHandler);
}

function closeImageModal(){
  const modal = document.getElementById("imgModal");
  if(modal) modal.style.display = "none";
  document.removeEventListener("keydown", escModalHandler);
}
function escModalHandler(e){ if(e.key === "Escape") closeImageModal(); }

document.addEventListener("click", function(e){
  const modal = document.getElementById("imgModal");
  if(!modal || modal.style.display !== "flex") return;
  if(e.target === modal) closeImageModal();
});

/* Document init */
document.addEventListener("DOMContentLoaded", function(){
  // INDEX
  if(window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname.indexOf("/index")!==-1){
    initCarousel();
  }

  // ITEMS page
  if(window.location.pathname.includes("items")){
    const si = document.getElementById("searchInput");
    const activeCategory = localStorage.getItem("activeCategory");
    if(activeCategory) applyCategoryTheme(activeCategory);
    if(si){
      si.addEventListener("focus", () => manageChecklistToggle(localStorage.getItem("activeCategory")));
      si.addEventListener("input", () => renderItems());
      si.addEventListener("blur", () => setTimeout(()=>manageChecklistToggle(localStorage.getItem("activeCategory")), 150));
      // center shorter search: ensure style applied by CSS
    }
    renderItems();
    setTimeout(()=>applyPendingTagOnLoad(), 250);
  }

  // DETAIL page
  if(window.location.pathname.includes("detail")){
    renderDetail();
  }

  const modalClose = document.getElementById("modalCloseBtn");
  if(modalClose) modalClose.onclick = closeImageModal;
});
