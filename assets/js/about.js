/* ── Contadores animados (solo página About) ─────────── */
(function () {
	var counters = document.querySelectorAll('.js-count');
	if (!counters.length) return;

	var obs = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (!entry.isIntersecting) return;
			var el = entry.target;
			var to = +el.dataset.to;
			var suffix = el.dataset.suffix || '';
			var duration = 1600;
			var steps = Math.max(1, Math.ceil(to / (duration / 16)));
			var current = 0;
			var timer = setInterval(function () {
				current = Math.min(current + steps, to);
				el.textContent = (to >= 1000 ? current.toLocaleString('es-ES') : current) + suffix;
				if (current >= to) clearInterval(timer);
			}, 16);
			obs.unobserve(el);
		});
	}, { threshold: 0.4 });

	counters.forEach(function (el) { obs.observe(el); });
})();
