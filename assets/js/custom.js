/* ── Gestión de formularios de contacto ───────────────── */
function handleContactForm(formEl, messageEl) {
	formEl.addEventListener('submit', function (e) {
		e.preventDefault();

		var fields = formEl.querySelectorAll('[required]');
		var valid = true;

		fields.forEach(function (field) {
			field.classList.remove('invalid');
			if (!field.value.trim()) {
				field.classList.add('invalid');
				valid = false;
			}
		});

		if (!valid) {
			messageEl.className = 'form-message error';
			messageEl.textContent = 'Por favor, rellena los campos obligatorios.';
			return;
		}

		// TODO: conecta aquí con tu backend real, por ejemplo:
		// fetch('/api/contact', { method: 'POST', body: new FormData(formEl) })

		formEl.reset();
		messageEl.className = 'form-message success';
		messageEl.textContent = 'Enviando...';

		// Dispara el evento que el tema usa para cerrar el modal
		// y abrir el modal de confirmación (#modal-thx)
		document.dispatchEvent(new Event('wpcf7mailsent'));
	});
}

document.addEventListener('DOMContentLoaded', function () {
	var cf = document.getElementById('contact-form');
	var cm = document.getElementById('contact-form-message');
	if (cf && cm) handleContactForm(cf, cm);

	var mf = document.getElementById('modal-contact-form');
	var mm = document.getElementById('modal-form-message');
	if (mf && mm) handleContactForm(mf, mm);
});

/* ── Bypass 2500ms nav delay (transition-plug desactivado) ──────
   main.js intercepta cada <a> y espera 2,5s antes de navegar.
   Con la animación desactivada ese delay es innecesario.
   Este listener añade navegación inmediata en el mismo ciclo de click. */
(function () {
	document.querySelectorAll('a').forEach(function (link) {
		if (link.hasAttribute('target')) return;
		link.addEventListener('click', function () {
			var href = link.getAttribute('href');
			if (!href || href === '#' || href.startsWith('mailto:') || href.startsWith('tel:')) return;
			window.location = href;
		});
	});
})();

/* ── Entrada instantánea para subpáginas (sin transition-plug) ── */
(function () {
	if (document.querySelector('.preloader')) return; // home: lo gestiona el preloader

	// Ejecutar en load, después de que main.js haya corrido SplitText.
	// Reemplazamos la animación de 2s por una versión rápida (0.4s).
	window.addEventListener('load', function () {
		if (document.querySelector('.main-animated-text')) {
			gsap.killTweensOf('.main-animated-text .char');
			gsap.to('.main-animated-text .char', {
				ease: 'back', opacity: 1, scaleY: 1, yPercent: 0,
				stagger: 0.01, duration: 0.4
			});
		}

		if (document.querySelector('.main-animated-line')) {
			gsap.killTweensOf('.main-animated-line');
			gsap.to('.main-animated-line', { width: '100%', duration: 0.4 });
		}

		gsap.killTweensOf('.header');
		gsap.set('.header', { translateY: '0%' });

		if (document.querySelector('.main-opacity-block')) {
			gsap.killTweensOf('.main-opacity-block');
			gsap.set('.main-opacity-block', { opacity: 1 });
		}
	});
}());

/* ── Filtro de categorías en la página de noticias ── */
(function () {
	var filters = document.querySelectorAll('[data-filter]');
	if (!filters.length) return;

	var articles = document.querySelectorAll('.blog__item');
	var active = null;

	filters.forEach(function (btn) {
		btn.addEventListener('click', function (e) {
			e.preventDefault();
			var cat = btn.getAttribute('data-filter');

			if (active === cat) {
				// Segundo click: quitar filtro
				active = null;
				filters.forEach(function (b) { b.classList.remove('_active'); });
				articles.forEach(function (a) { a.style.display = ''; });
				return;
			}

			active = cat;
			filters.forEach(function (b) { b.classList.remove('_active'); });
			btn.classList.add('_active');

			articles.forEach(function (article) {
				var articleCat = article.querySelector('.blog__item-category');
				article.style.display = (articleCat && articleCat.textContent.trim() === cat) ? '' : 'none';
			});
		});
	});
}());

/* ── Fix hero-about abb-item: evita wrap de chars tras SplitText ── */
(function () {
	var items = document.querySelectorAll('.hero-about__abb-item');
	if (!items.length) return;
	items.forEach(function (item) {
		item.style.whiteSpace = 'nowrap';
		item.style.minWidth = 'max-content';
	});
})();
