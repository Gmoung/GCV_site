/*
 * The veil is a single full-screen color panel (see .veil in style.css)
 * present on every page. It plays two roles:
 *
 *   1. On load, it starts covering the screen and fades away — an
 *      "arrival," rather than a page just appearing.
 *   2. Clicking a link with class "transition-link" reverses that: the
 *      veil fades in (toward the destination room's colors, if the link
 *      carries data-veil-1 / data-veil-2), and only once it's fully
 *      covered the screen does the browser actually navigate.
 *
 * Together this reads as one continuous camera move between rooms
 * instead of a hard page reload. It fully respects prefers-reduced-motion
 * because the covering/uncovering transition durations are collapsed to
 * near-zero by the CSS media query in style.css — this script just waits
 * for whatever that duration turns out to be.
 */
(function () {
  var veil = document.querySelector('[data-veil]');
  if (!veil) return;

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      veil.classList.add('is-hidden');
    });
  });

  function goTo(href) {
    var done = false;
    function navigate() {
      if (done) return;
      done = true;
      window.location.href = href;
    }
    veil.addEventListener('transitionend', navigate, { once: true });
    setTimeout(navigate, 1200);
  }

  var links = document.querySelectorAll('a.transition-link');
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target === '_blank') return;
      var href = link.getAttribute('href');
      if (!href) return;

      e.preventDefault();

      var v1 = link.getAttribute('data-veil-1');
      var v2 = link.getAttribute('data-veil-2');
      if (v1) veil.style.setProperty('--veil-1', v1);
      if (v2) veil.style.setProperty('--veil-2', v2);

      veil.classList.remove('is-hidden');
      veil.classList.add('is-covering');
      goTo(href);
    });
  });
})();
