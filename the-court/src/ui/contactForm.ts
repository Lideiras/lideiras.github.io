import { content } from '../data/content';
import { t } from '../i18n';

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
const RATE_KEY = 'court.lastSend';
const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

export function renderContactForm(): string {
  return `
  <form data-contact novalidate>
    <label>${esc(t('form_name'))}<input name="name" autocomplete="name" required maxlength="80" /></label>
    <label>${esc(t('form_email'))}<input name="email" type="email" autocomplete="email" required maxlength="120" /></label>
    <label>${esc(t('form_message'))}<textarea name="message" rows="5" required minlength="10" maxlength="2000"></textarea></label>
    <input class="hp" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" />
    <button type="submit" class="btn">${esc(t('form_send'))}</button>
    <p class="form-status" data-status role="status" aria-live="polite"></p>
  </form>`;
}

export function bindContactForm(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('form[data-contact]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const data = new FormData(form);
    if (data.get('_gotcha')) return; // honeypot: un bot rellenó el campo oculto
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length < 10) {
      status.textContent = t('form_invalid');
      return;
    }
    try {
      const last = Number(localStorage.getItem(RATE_KEY) ?? 0);
      if (Date.now() - last < 60_000) {
        status.textContent = t('form_wait');
        return;
      }
    } catch {
      /* sin almacenamiento: se omite el límite local */
    }

    const mailto = `mailto:${content.person.email}?subject=${encodeURIComponent(`Portfolio · ${name}`)}&body=${encodeURIComponent(message)}`;
    if (!ENDPOINT) {
      window.location.href = mailto; // sin endpoint configurado: abrir el cliente de correo
      return;
    }

    button.disabled = true;
    status.textContent = t('form_sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      status.textContent = t('form_ok');
      form.reset();
      try {
        localStorage.setItem(RATE_KEY, String(Date.now()));
      } catch {
        /* ignorar */
      }
    } catch {
      status.innerHTML = `${esc(t('form_err'))} <a href="${esc(mailto)}">${esc(content.person.email)}</a>`;
    } finally {
      button.disabled = false;
    }
  });
}
