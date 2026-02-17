// script.js - revised layout + detail tags + safer fallbacks

// Navigation helpers
function goHome(){ window.location.href = "index.html"; }
function goBack(){ window.history.back(); }

// Find item by id across DATA
function findItemById(id){
  let found = null;
  Object.values(DATA).some(cat => {
    return cat.items.some(it => {
      if(String(it.id) === String(id)){ found = it; return true; }
      return false;
    });
  });
  return found;
}

// Reset any body background (used before rendering pages)
function resetBodyBackground(){
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
   PAGE 1: categories
   - Now shows compact box grid with thumbnail (first item as preview)
========================= */
function renderCategories(){
  resetBodyBackground();
  const container = document.getElementById("categoryContainer");
  if(!container) return;
  container.innerHTML = "";
  Object.keys(DATA).forEach(key => {
    const cat = DATA[key];
    // pick a representative thumbnail (first item's main image) or placeholder
    const thumb = (cat.items && cat.items[0] && cat.items[0].images && cat.items[0].images.main) ? cat.items[0].images.main : (typeof PLACEHOLDER !== "undefined" ? PLACEHOLDER : "");
    const div = document.createElement("div");
    div.className = "card cat-card small-card";
    div.tabIndex = 0;
    div.innerHTML = `
      <img src="${thumb}" alt="${cat.title} preview" loading="lazy">
      <h3>${cat.title}</h3>
    `;
    div.onclick = () => {
      localStorage.setItem("activeCategory", key);
      // clear any previous checkedTags when changing category (keeps behavior predictable)
      const si = document.getElementById("searchInput");
      if(si) { delete si.dataset.checkedTags; si.value = ""; }
      window.location.href = "items.html";
    };
    div.onkeypress = (e) => { if(e.key === "Enter") div.click(); };
    container.appendChild(div);
  });
}

/* =========================
   PAGE 2: items + search + checklist
   - Compact square cards (small-card)
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
  let html = `<div class="checklist-header">Filter tags <button class="closeChecklist" type="button" onclick="hideChecklist()">✕</button></div>`;
  html += `<div class="checklist-list">`;
  if(tags.length === 0) html += `<div class="checklist-empty">No tags</div>`;
  tags.forEach(t => { html += `<label class="chk-row"><input type="checkbox" value="${t}"> ${t}</label>`; });
  html += `</div><div style="margin-top:10px"><button type="button" onclick="applyChecklistFilters()">Apply</button></div>`;
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
    controls.appendChild(btn);
  }
  const si = document.getElementById("searchInput");
  if(!si){ btn.style.display = "none"; return; }
  const active = (document.activeElement === si) || si.value.trim().length > 0;
  btn.style.display = active ? "inline-block" : "none";
}

function renderItems(){
  resetBodyBackground();
  const category = localStorage.getItem("activeCategory");
  if(!category || !DATA[category]) { goHome(); return; }
  const data = DATA[category];
  const title = document.getElementById("categoryTitle");
  if(title) title.innerText = data.title;

  const searchInput = document.getElementById("searchInput");
  const search = searchInput ? searchInput.value.toLowerCase() : "";
  const checkedTags = (searchInput && searchInput.dataset.checkedTags) ? JSON.parse(searchInput.dataset.checkedTags) : [];

  // search by name (compact) — can expand to desc/tags if desired
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
      <p>${it.desc}</p>
    `;
    div.onclick = () => {
      localStorage.setItem("selectedId", it.id);
      localStorage.setItem("activeCategory", category);
      window.location.href = "detail.html";
    };
    container.appendChild(div);
  });
}

/* =========================
   PAGE 3: detail (main wallpaper fixed, extras popup-only)
   - Render tags (category badges) under the name
   - JS WILL NOT CREATE NAV BUTTONS — HTML provides single Back/Home
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

  // MAIN wallpaper fixed to selected.images.main
  const wallpaperUrl = (selected.images && selected.images.main) ? selected.images.main : "";
  if(wallpaperUrl){
    document.body.style.backgroundImage = `url('${wallpaperUrl}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
  } else {
    resetBodyBackground();
  }

  ensureDetailOverlay();

  const mainImg = (selected.images && selected.images.main) ? selected.images.main : "";
  const extras = (selected.images && selected.images.extras) ? selected.images.extras.slice(0,3) : [];
  const tags = (selected.tags || []).slice(0,10);

  // Render hero and extras WITHOUT adding nav buttons here
  container.innerHTML = `
    <div class="detail-wrapper">
      <div class="detail-card hero-card">
        <img class="hero-img" src="${mainImg}" alt="${selected.name} main">
        <div class="hero-overlay">
          <h2>${selected.name}</h2>
          <p class="hero-desc">${selected.desc}</p>
          <div class="item-tags">
            ${tags.map(t => `<span class="tag">${t.toUpperCase()}</span>`).join(' ')}
          </div>
          <!-- no nav buttons here -->
        </div>
      </div>

      <div class="extras">
        ${extras.map((src, idx) => `<div class="extra-thumb"><img src="${src}" alt="extra ${idx+1}" onclick="openImageModal('${src}')"></div>`).join('')}
      </div>
    </div>
  `;
}

/* Modal preview (extras only) */
function openImageModal(src){
  const modal = document.getElementById("imgModal");
  const img = document.getElementById("imgModalImg");
  if(!modal || !img) return;
  img.src = src;
  modal.style.display = "flex";
  // accessibility: focus close button when opening modal
  const closeBtn = document.getElementById("modalCloseBtn");
  if(closeBtn) closeBtn.focus();
  document.addEventListener("keydown", escModalHandler);
}

function closeImageModal(){
  const modal = document.getElementById("imgModal");
  if(modal) modal.style.display = "none";
  document.removeEventListener("keydown", escModalHandler);
}

function escModalHandler(e){
  if(e.key === "Escape") closeImageModal();
}

document.addEventListener("click", function(e){
  const modal = document.getElementById("imgModal");
  if(!modal || modal.style.display !== "flex") return;
  if(e.target === modal) closeImageModal();
});

/* Document init */
document.addEventListener("DOMContentLoaded", function(){
  renderCategories();

  if(window.location.pathname.includes("items")){
    const si = document.getElementById("searchInput");
    if(si){
      si.addEventListener("focus", () => manageChecklistToggle(localStorage.getItem("activeCategory")));
      si.addEventListener("input", () => renderItems());
      si.addEventListener("blur", () => setTimeout(()=>manageChecklistToggle(localStorage.getItem("activeCategory")), 150));
    }
    renderItems();
  }

  if(window.location.pathname.includes("detail")){
    renderDetail();
  }

  const modalClose = document.getElementById("modalCloseBtn");
  if(modalClose) modalClose.onclick = closeImageModal;
});
