// footer.js — Reusable footer component for undangyah.id
// Include via <script src="/footer.js"></script> at bottom of every page
// Replaces any existing <footer class="footer"> with standardized version

(function() {
  const footerHTML = `
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <img src="https://app.undangyah.id/wp-content/uploads/2026/01/undangyah.png" alt="Undangyah" height="22">
      </div>
      <nav class="footer__links">
        <a href="/#fitur">Fitur</a>
        <a href="/#harga">Harga</a>
        <a href="/#katalog">Katalog</a>
        <a href="/#faq">FAQ</a>
        <a href="/artikel/">Artikel</a>
      </nav>
      <p class="footer__copy">&copy; ${new Date().getFullYear()} Undangyah. Hak cipta dilindungi.</p>
    </div>
  </footer>`;

  // Replace existing footer or append inside .boxed
  const existing = document.querySelector('footer.footer');
  if (existing) {
    existing.outerHTML = footerHTML;
  } else {
    const boxed = document.querySelector('.boxed');
    if (boxed) {
      boxed.insertAdjacentHTML('beforeend', footerHTML);
    } else {
      document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
  }
})();
