// Simple partial injector: carga header/footer desde /partials
document.addEventListener('DOMContentLoaded', () => {
  const injectPartial = async (selector, url) => {
    const target = document.querySelector(selector);
    if (!target) return Promise.resolve();
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Fetch failed: ' + res.status);
      const html = await res.text();
      target.innerHTML = html;
    } catch (err) {
      console.error('Failed to load partial', url, err);
    }
  };

  (async () => {
    await Promise.all([
      injectPartial('#site-header', 'partials/header.html'),
      injectPartial('#site-footer', 'partials/footer.html'),
    ]);

    const setupHeader = () => {
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
      const menuIcon = mobileMenuButton ? mobileMenuButton.querySelector('i') : null;

      if (mobileMenuButton && mobileMenu && menuIcon) {
        mobileMenuButton.addEventListener('click', () => {
          mobileMenu.classList.toggle('-translate-x-full');
          menuIcon.classList.toggle('fa-bars');
          menuIcon.classList.toggle('fa-times');
        });

        document.querySelectorAll('.mobile-link').forEach((link) => {
          link.addEventListener('click', () => {
            mobileMenu.classList.add('-translate-x-full');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
          });
        });
      }

      // Close mobile menu on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
          if (menuIcon) { menuIcon.classList.remove('fa-times'); menuIcon.classList.add('fa-bars'); }
        }
      });
    };

    try { setupHeader(); } catch (err) { console.error('setupHeader failed', err); }

    // Notify other scripts that partials are loaded
    document.dispatchEvent(new Event('partials:loaded'));
  })();
});
