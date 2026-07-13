/*
 * Scroll reveals: panels and doors fade up into view as you reach them,
 * instead of all appearing at once. Runs once per element, then stops
 * watching it.
 */
(function () {
  var targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.28, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach(function (el) { io.observe(el); });
})();
