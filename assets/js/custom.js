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


/* ── Header glass al hacer scroll ─────────────────────────────────────────
   El main.js añade/quita .active en .header__container para ocultar/mostrar
   el header. Cuando vuelve a aparecer (sin .active) y no estamos en el top,
   añadimos ._glass al <header> para el efecto cristal. */
(function () {
	document.addEventListener('DOMContentLoaded', function () {
		var container = document.querySelector('.header__container');
		var header    = document.querySelector('.header');
		if (!container || !header) return;

		function update() {
			var isHidden  = container.classList.contains('active');
			var isScrolled = window.scrollY > 80;
			header.classList.toggle('_glass', !isHidden && isScrolled);
		}

		new MutationObserver(update).observe(container, { attributes: true, attributeFilter: ['class'] });
		window.addEventListener('scroll', update, { passive: true });
	});
}());

/* ── Botón "Arriba" — scroll directo al top (transition-plug desactivado) ──
   main.js ejecuta una animación de cortina de ~6s que no se ve porque
   .transition-plug tiene display:none en custom.css. Interceptamos el click
   en fase de captura para hacer el scroll de inmediato y sin bloquear el botón. */
(function () {
	document.addEventListener('click', function (e) {
		var btn = e.target.closest('[data-scroll-to]');
		if (!btn) return;
		e.preventDefault();
		e.stopImmediatePropagation();

		var targetId = btn.dataset.scrollTo;
		var el = document.getElementById(targetId);
		if (!el) return;

		btn.disabled = true;
		window.scrollTo({ top: 0, behavior: 'smooth' });
		setTimeout(function () { btn.disabled = false; }, 800);
	}, true); /* true = fase captura, se ejecuta antes que el handler de main.js */
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
