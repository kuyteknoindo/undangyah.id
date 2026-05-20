// footer.js — Dynamic footer component for undangyah.id
// Fetches links from API so admin can edit via dashboard
// Include via <script src="/footer.js?v=20260519"></script> at bottom of every page

(function() {
  var API_URL = 'https://app.undangyah.id/wp-json/undangyah/v1/landing/sections/footer';

  function renderFooter(links) {
    var linksHTML = links.map(function(l) {
      var target = l.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
      return '<a href="' + l.url + '"' + target + '>' + l.text + '</a>';
    }).join('');

    var html = '<footer class="footer">' +
      '<div class="footer__inner">' +
        '<div class="footer__brand">' +
          '<img src="https://app.undangyah.id/wp-content/uploads/2026/01/undangyah.png" alt="Undangyah" height="22">' +
        '</div>' +
        '<div class="footer__links">' + linksHTML + '</div>' +
        '<p class="footer__copy">&copy; ' + new Date().getFullYear() + ' Undangyah. Hak cipta dilindungi.</p>' +
      '</div>' +
    '</footer>';

    var existing = document.querySelector('footer.footer');
    if (existing) {
      existing.outerHTML = html;
    } else {
      var boxed = document.querySelector('.boxed');
      if (boxed) {
        boxed.insertAdjacentHTML('beforeend', html);
      } else {
        document.body.insertAdjacentHTML('beforeend', html);
      }
    }
  }

  // Fallback links if API fails
  var fallback = [
    { text: 'Fitur', url: '/#fitur' },
    { text: 'Harga', url: '/#harga' },
    { text: 'Katalog', url: '/#katalog' },
    { text: 'FAQ', url: '/#faq' },
    { text: 'Artikel', url: '/artikel/' }
  ];

  fetch(API_URL)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var links = [];
      if (Array.isArray(data)) {
        data.forEach(function(group) {
          if (group.extra_data && Array.isArray(group.extra_data.links)) {
            group.extra_data.links.forEach(function(l) { links.push(l); });
          }
        });
      }
      renderFooter(links.length ? links : fallback);
    })
    .catch(function() {
      renderFooter(fallback);
    });
})();
