import { useState } from 'preact/hooks';

type Status = 'idle' | 'sent';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  function handleSubmit(e: Event) {
    e.preventDefault();
    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <div class="contact__form-wrap contact__form-success">
        <div class="contact__success-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 class="contact__success-title">¡Mensaje enviado!</h3>
        <p class="contact__success-desc">
          Gracias por escribir. Revisaré tu propuesta y te responderé a la brevedad.
        </p>
        <button
          type="button"
          class="btn-primary"
          style="margin-top: 1.5rem;"
          onClick={() => setStatus('idle')}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <div class="contact__form-wrap">
      <form
        class="contact__form"
        onSubmit={handleSubmit}
        aria-label="Formulario de contacto"
        noValidate
      >
        <div class="contact__form-row">
          <div class="contact__form-group">
            <label for="contact-name" class="contact__form-label">
              Nombre completo <span aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="contact-name"
              name="name"
              class="contact__form-input"
              placeholder="Tu nombre"
              required
              autocomplete="name"
              aria-required="true"
            />
          </div>
          <div class="contact__form-group">
            <label for="contact-email" class="contact__form-label">
              Correo electrónico <span aria-hidden="true">*</span>
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              class="contact__form-input"
              placeholder="tu@correo.com"
              required
              autocomplete="email"
              aria-required="true"
            />
          </div>
        </div>

        <div class="contact__form-group">
          <label for="contact-project" class="contact__form-label">Tipo de proyecto</label>
          <select
            id="contact-project"
            name="project"
            class="contact__form-input contact__form-select"
          >
            <option value="">Selecciona una opción</option>
            <option value="documental">Fotografía Documental</option>
            <option value="naturaleza">Naturaleza y Vida Silvestre</option>
            <option value="editorial">Editorial / Publicación</option>
            <option value="eventos">Eventos</option>
            <option value="moda">Moda</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div class="contact__form-group">
          <label for="contact-message" class="contact__form-label">
            Mensaje <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            class="contact__form-input contact__form-textarea"
            placeholder="Cuéntame sobre tu proyecto..."
            rows={5}
            required
            aria-required="true"
          />
        </div>

        <button type="submit" class="btn-primary contact__submit">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Enviar mensaje
        </button>
      </form>
    </div>
  );
}
