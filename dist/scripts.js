// Basic interactions for Vantage Point site

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  setupScrollAnimations();
  setupStickyCTA();
  initPreviewButtons();
  fetchProductData();
  setupIntakeForm();
});

function setupScrollAnimations(){
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:0.1, rootMargin:'0px 0px -50px 0px'});
  document.querySelectorAll('.animate-on-scroll').forEach(el=>observer.observe(el));
}

function setupStickyCTA(){
  const stickyCTA = document.getElementById('stickyCTA');
  if(!stickyCTA) return;
  window.addEventListener('scroll',()=>{
    if(window.scrollY>1000){
      stickyCTA.classList.add('visible');
    }else{
      stickyCTA.classList.remove('visible');
    }
  });
}

function toggleSave(btn){
  const pressed = btn.classList.toggle('saved');
  btn.setAttribute('aria-pressed', pressed);
}

function initPreviewButtons(){
  document.querySelectorAll('.preview-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const title = btn.dataset.title;
      const includes = btn.dataset.includes ? btn.dataset.includes.split('|') : [];
      const price = btn.dataset.price;
      const url = btn.dataset.url;
      const modal = document.getElementById('previewModal');
      document.getElementById('modalTitle').textContent = title;
      const list = includes.map(i=>`<li>${i}</li>`).join('');
      document.getElementById('modalContent').innerHTML = `
        <h4>What's Included:</h4>
        <ul>${list}</ul>
        <div style="margin-top:20px;">
          <a class="btn" href="${url}" target="_blank" rel="noopener">Buy for $${price}</a>
        </div>`;
      modal.classList.add('active');
      document.querySelector('#previewModal .modal-close').focus();
    });
  });
}

function closeModal(){
  document.getElementById('previewModal').classList.remove('active');
}

document.addEventListener('click',e=>{
  if(e.target.id==='previewModal') closeModal();
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape') closeModal();
});

function toggleTheme(){
  document.querySelectorAll('.theme-toggle-icon').forEach(i=>i.classList.toggle('active'));
}

async function fetchProductData(){
  try{
    const res = await fetch('/api/products');
    const products = await res.json();
    products.forEach(prod => {
      const el = document.querySelector(`.product[data-id="${prod.id}"]`);
      if(!el) return;
      const priceEl = el.querySelector('.price');
      if(priceEl) priceEl.textContent = prod.price;
      const buyBtn = el.querySelector('.buy-btn');
      if(buyBtn) buyBtn.href = prod.url;
      const previewBtn = el.querySelector('.preview-btn');
      if(previewBtn){
        previewBtn.dataset.title = prod.title;
        previewBtn.dataset.includes = (prod.includes || []).join('|');
        previewBtn.dataset.price = prod.price;
        previewBtn.dataset.url = prod.url;
      }
    });
  }catch(e){
    console.error('Failed to load products', e);
  }
}

function setupIntakeForm(){
  const form = document.getElementById('intakeForm');
  if(!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const statusEl = document.getElementById('formStatus');
    try{
      const formData = Object.fromEntries(new FormData(form).entries());
      const res = await fetch('/api/intake', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(formData)
      });
      if(res.ok){
        statusEl.textContent = 'Submitted!';
        form.reset();
      }else{
        statusEl.textContent = 'Submission failed.';
      }
    }catch(err){
      statusEl.textContent = 'Submission error.';
    }
  });
}
