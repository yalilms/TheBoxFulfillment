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

/* ── Fix hero-about abb-item: evita wrap de chars tras SplitText ── */
(function () {
	var items = document.querySelectorAll('.hero-about__abb-item');
	if (!items.length) return;
	items.forEach(function (item) {
		item.style.whiteSpace = 'nowrap';
		item.style.minWidth = 'max-content';
	});
})();
