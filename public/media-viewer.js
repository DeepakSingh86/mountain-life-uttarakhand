// public/media-viewer.js
(() => {
  const API_VIEW = '/api/view';   // POST { id }
  const API_LIKE = '/api/like';   // POST { id }

  async function postJSON(url, body) {
    try {
      const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      console.warn('postJSON error', e);
      return null;
    }
  }

  const modal = document.getElementById('media-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');

  function openModalForThumb(thumb) {
    const id = thumb.dataset.id;
    const type = thumb.dataset.type;
    const src = thumb.dataset.src;
    modalContent.innerHTML = '';

    if (type === 'image') {
      const img = document.createElement('img');
      img.src = src;
      img.alt = thumb.querySelector('img')?.alt || '';
      modalContent.appendChild(img);
      requestAndCount(thumb, img);
    } else if (type === 'video') {
      const vid = document.createElement('video');
      vid.src = src;
      vid.controls = true;
      vid.playsInline = true;
      vid.autoplay = true;
      vid.preload = 'metadata';
      vid.muted = false;
      vid.setAttribute('playsinline', '');
      modalContent.appendChild(vid);
      vid.addEventListener('loadedmetadata', () => {
        vid.play().catch(()=> {
          vid.muted = true;
          vid.play().catch(()=>{});
        });
      });
      requestAndCount(thumb, vid);
    }

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    const v = modalContent.querySelector('video');
    if (v && !v.paused) try { v.pause(); } catch(e){}
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(()=>{});
    }
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modalContent.innerHTML = '';
  }

  async function requestAndCount(thumb, mediaEl) {
    try {
      const target = mediaEl.requestFullscreen ? mediaEl : modal;
      await target.requestFullscreen?.();
    } catch(e) {}
    const id = thumb.dataset.id;
    const resp = await postJSON(API_VIEW, { id });
    if (resp && typeof resp.views !== 'undefined') {
      const vc = thumb.querySelector('.view-count');
      if (vc) vc.textContent = resp.views;
    }
  }

  document.addEventListener('click', async (e) => {
    const thumb = e.target.closest('.media-thumb');
    if (thumb) {
      if (e.target.closest('.like-btn')) return;
      openModalForThumb(thumb);
    }
  });

  document.addEventListener('click', async (e) => {
    const likeBtn = e.target.closest('.like-btn');
    if (!likeBtn) return;
    e.stopPropagation();
    const thumb = likeBtn.closest('.media-thumb');
    const id = thumb?.dataset.id;
    if (!id) return;
    const resp = await postJSON(API_LIKE, { id });
    if (resp && typeof resp.likes !== 'undefined') {
      const span = likeBtn.querySelector('.likes');
      if (span) span.textContent = resp.likes;
      if (resp.likedByUser) likeBtn.classList.add('liked'); else likeBtn.classList.remove('liked');
    }
  });

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (ev) => { if (ev.target === modal) closeModal(); });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && modal?.classList.contains('show')) closeModal();
  });

  async function hydrateBadges() {
    const ids = Array.from(document.querySelectorAll('.media-thumb')).map(el=>el.dataset.id).filter(Boolean);
    if (!ids.length) return;
    try {
      const res = await fetch('/api/bulk-metadata', {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ids })
      });
      if (!res.ok) return;
      const data = await res.json();
      for (const el of document.querySelectorAll('.media-thumb')) {
        const id = el.dataset.id;
        if (data[id]) {
          const v = el.querySelector('.view-count'); if (v) v.textContent = data[id].views ?? 0;
          const l = el.querySelector('.likes'); if (l) l.textContent = data[id].likes ?? 0;
        }
      }
    } catch(e){ console.warn('hydrateBadges error', e); }
  }

  document.addEventListener('DOMContentLoaded', hydrateBadges);
})();