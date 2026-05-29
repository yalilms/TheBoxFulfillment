
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
			header.classList.toggle('_at-top', !isScrolled);
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

/* ── Services: imagen panel izquierdo sincronizada con las TARJETAS ──
   La barra de progreso (.services__progressbar-fill) y las tarjetas son dos
   animaciones GSAP independientes con distinto ease, así que el ancho de la
   barra NO refleja fielmente dónde están las tarjetas. En vez de eso medimos
   la posición real de cada tarjeta con getBoundingClientRect(): la foto cambia
   a la tarjeta que de verdad domina el centro, sea cual sea el ease.
   Usamos el MutationObserver sobre la barra solo como "tick" (GSAP la actualiza
   en cada frame de la animación). */
(function () {
	document.addEventListener('DOMContentLoaded', function () {
		var panel = document.querySelector('.services__container-inner');
		var fill  = document.querySelector('.services__progressbar-fill');
		var wrap  = document.querySelector('.services__items');
		if (!panel || !fill || !wrap) return;

		var cards = [];
		for (var n = 1; n <= 6; n++) {
			var c = wrap.querySelector('.services__item-' + n);
			if (c) cards.push(c);
		}
		if (!cards.length) return;

		var images = [
			'./assets/img/img2.png',
			'./assets/img/img5.png',
			'./assets/img/img3.png',
			'./assets/img/img4.png',
			'./assets/img/img10.png',
			'./assets/img/img1.png'
		];
		/* Posición del recorte por imagen — ajustar aquí si una foto queda mal encuadrada */
		var positions = [
			'center',
			'top center',
			'center',
			'center',
			'center',
			'center'
		];
		images.forEach(function (src) { new Image().src = src; });

		/* SWITCH = fracción de altura de tarjeta que define cuándo se considera
		   que la tarjeta entrante "domina" el centro y dispara el cambio de foto.
		   0   = cambia cuando la tarjeta llega del todo al centro
		   0.5 = cambia cuando está a media entrada (sensación de "a la vez")
		   sube hacia 1 = cambia antes. Ajustable a gusto. */
		var SWITCH  = 0.5;
		var current = -1;

		function onUpdate() {
			var box     = wrap.getBoundingClientRect();
			var centerY = box.top + box.height / 2;

			/* Tarjeta visible = la de índice más alto cuyo centro ya ha subido
			   hasta el centro del contenedor (dentro del margen SWITCH). */
			var idx = 0;
			for (var i = 0; i < cards.length; i++) {
				var r = cards[i].getBoundingClientRect();
				var cardCenterY = r.top + r.height / 2;
				if (cardCenterY <= centerY + r.height * SWITCH) idx = i;
			}

			if (idx === current) return;
			current = idx;
			panel.classList.add('_img-changing');
			panel.style.backgroundImage = 'url("' + images[idx] + '")';
			panel.style.backgroundPosition = positions[idx];
			setTimeout(function () { panel.classList.remove('_img-changing'); }, 250);
		}

		onUpdate();   /* estado inicial */

		new MutationObserver(onUpdate).observe(fill, {
			attributes: true,
			attributeFilter: ['style']
		});
	});
}());
