// ─────────────────────────────────────────────────────────────────────────────
//  CONFIG — editar aqui para configurar o site
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  // Hash SHA-256 da senha — para gerar o hash, abre o browser console e corre:
  // Substitui o valor abaixo pelo resultado
  passwordHash: '6905f62f40f91b364704eed0945222bab6ee4ce0f01445712a0b61a56f76bb5f',

  // Chave API do Google Cloud — instruções: ver SETUP_GOOGLE_DRIVE.md
  // Activar no Google Cloud: "Google Calendar API" + "Google Drive API"
  apiKey: 'AIzaSyDsl4siyep6WzpdOBC1blkPPy7LwxTQUUE',

  // Google Calendar — eventos carregados automaticamente
  // ID do calendário: Google Calendar → ⚙️ Definições → nome do calendário
  //   → "Integrar calendário" → "ID do calendário"
  // O calendário tem de estar partilhado como público (visível para todos)
  calendar: {
    id: 'crb.clubemodelismobenfica@gmail.com',
    maxEvents: 4,
  },

  // Google Drive — documentos por ano (instruções: ver SETUP_GOOGLE_DRIVE.md)
  drive: {
    folderIds: {
      '2026': '13RL-CrlcIfI0CViOmnmhuwCT3tatbf4M',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  DADOS — editar aqui para actualizar eventos (fallback sem Calendar)
// ─────────────────────────────────────────────────────────────────────────────
const EVENTOS = [
  { date: "SAB 15 MAR 2025", title: "Treino Aberto — Monsanto", local: "Pista de Monsanto, Lisboa", tag: "Treino" },
  { date: "DOM 23 MAR 2025", title: "Campeonato Regional 1/10 Elétrico", local: "Pista de Monsanto, Lisboa", tag: "Competição" },
  { date: "SAB 05 ABR 2025", title: "Workshop de Manutenção", local: "Sede do Clube", tag: "Workshop" },
  { date: "DOM 27 ABR 2025", title: "Prova Nacional — Etapa 1", local: "Circuito TBA", tag: "Competição" },
  { date: "SAB 10 MAI 2025", title: "Dia Aberto para Novos Sócios", local: "Pista de Monsanto, Lisboa", tag: "Evento" },
  { date: "DOM 18 MAI 2025", title: "Campeonato CRB — Ronda 2", local: "Pista de Monsanto, Lisboa", tag: "Competição" },
];

// ─────────────────────────────────────────────────────────────────────────────
//  IDIOMA — detectado a partir do atributo lang do <html>
// ─────────────────────────────────────────────────────────────────────────────
const LANG = document.documentElement.lang === 'en' ? 'en' : 'pt';
const LOCALE = LANG === 'en' ? 'en-GB' : 'pt-PT';
const S = LANG === 'en' ? {
  loading_events: 'Loading events…',
  no_events:      'No upcoming events.',
  error_events:   'Error loading events: ',
  loading_docs:   'Loading documents…',
  no_docs:        'No documents available for ',
  drive_not_cfg:  'Google Drive not configured for ',
  drive_hint:     'See <em>SETUP_GOOGLE_DRIVE.md</em>.',
  error_docs:     'Error loading: ',
  event_default:  'Event',
  download:       'Download',
  view:           'View',
  file:           'File',
} : {
  loading_events: 'A carregar eventos…',
  no_events:      'Sem eventos próximos.',
  error_events:   'Erro ao carregar eventos: ',
  loading_docs:   'A carregar documentos…',
  no_docs:        'Sem documentos disponíveis para ',
  drive_not_cfg:  'Google Drive não configurado para ',
  drive_hint:     'Ver <em>SETUP_GOOGLE_DRIVE.md</em>.',
  error_docs:     'Erro ao carregar: ',
  event_default:  'Evento',
  download:       'Descarregar',
  view:           'Ver',
  file:           'Ficheiro',
};

// ─────────────────────────────────────────────────────────────────────────────
//  MÓDULO: EVENTOS — Google Calendar
// ─────────────────────────────────────────────────────────────────────────────

/** Verifica se o Calendar está configurado */
function calendarReady() {
  const { id } = CONFIG.calendar;
  return (
    CONFIG.apiKey && CONFIG.apiKey !== 'CHAVE_API_AQUI' &&
    id && id !== 'ID_CALENDARIO_AQUI'
  );
}

/** Vai buscar os próximos eventos ao Google Calendar */
async function fetchCalendarEvents() {
  const { id, maxEvents } = CONFIG.calendar;
  const params = new URLSearchParams({
    key: CONFIG.apiKey,
    timeMin: new Date().toISOString(),
    maxResults: maxEvents,
    singleEvents: 'true',
    orderBy: 'startTime',
    supportsAttachments: 'true',
    fields: 'items(summary,location,start,description,attachments)',
  });
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(id)}/events?${params}`
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || `HTTP ${res.status}`);
  }
  return (await res.json()).items ?? [];
}

/**
 * Converte um evento do Google Calendar para o formato dos cards.
 * Convenção: o campo "Descrição" do evento = tag (ex: "Treino", "Competição").
 * Se estiver vazio, usa "Evento".
 */
function calEventToCard(item) {
  const start = new Date(item.start.dateTime || item.start.date);
  const weekday = start.toLocaleDateString(LOCALE, { weekday: 'short' })
    .toUpperCase().replace(/\.$/, '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const day = start.getDate().toString().padStart(2, '0');
  const month = start.toLocaleDateString(LOCALE, { month: 'short' })
    .toUpperCase().replace(/\.$/, '');
  const year = start.getFullYear();
  // Imagem do evento: primeiro attachment do Google Calendar (se existir)
  const attachment = item.attachments?.[0];
  let image = null;
  if (attachment?.fileId) {
    image = `https://drive.google.com/thumbnail?id=${attachment.fileId}&sz=w800`;
  }
  return {
    date: `${weekday} ${day} ${month} ${year}`,
    title: item.summary || S.event_default,
    local: item.location || '',
    tag: (item.description || S.event_default).trim().split('\n')[0].trim(),
    image,
  };
}

/** Renderiza os cards de eventos no grid */
function renderEventCards(events) {
  const grid = document.getElementById('eventos-grid');

  // Remove toggle button from a previous render if present
  document.querySelector('.eventos-toggle')?.remove();

  grid.innerHTML = events.map((ev, i) => {
    const isComp = ev.tag === 'Competição';
    const extraClass = i >= 3 ? ' card-extra' : '';
    const bgStyle = ev.image ? ` style="--card-bg: url('${ev.image}')"` : '';
    const hasImg = ev.image ? ' has-image' : '';
    return `
      <div class="evento-card${extraClass}${hasImg}"${bgStyle}>
        <div class="evento-card-content">
          <div class="evento-date">${ev.date}</div>
          <div class="evento-title">${ev.title}</div>
          ${ev.local ? `<div class="evento-local">📍 ${ev.local}</div>` : ''}
          <span class="evento-tag ${isComp ? 'competicao' : ''}">${ev.tag}</span>
        </div>
      </div>`;
  }).join('');

  if (events.length > 3) {
    const btn = document.createElement('button');
    btn.className = 'eventos-toggle';
    btn.textContent = S.show_more;
    let expanded = false;
    btn.addEventListener('click', () => {
      expanded = !expanded;
      grid.classList.toggle('expanded', expanded);
      btn.textContent = expanded ? S.show_less : S.show_more;
    });
    grid.insertAdjacentElement('afterend', btn);
  }
}

/** Carrega eventos do Google Calendar; usa EVENTOS hardcoded como fallback */
async function renderEventos() {
  const grid = document.getElementById('eventos-grid');

  if (!calendarReady()) {
    renderEventCards(EVENTOS);
    return;
  }

  grid.innerHTML = `<div class="eventos-loading">${S.loading_events}</div>`;

  try {
    const items = await fetchCalendarEvents();
    const events = items.map(calEventToCard);
    if (events.length === 0) {
      grid.innerHTML = `<div class="eventos-loading">${S.no_events}</div>`;
      return;
    }
    renderEventCards(events);
  } catch (err) {
    grid.innerHTML = `<div class="eventos-error">${S.error_events}${err.message}</div>`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  MÓDULO: DOCUMENTOS — Google Drive
// ─────────────────────────────────────────────────────────────────────────────

/** Verifica se o Drive está configurado para o ano pedido */
function driveReady(year) {
  const { folderIds } = CONFIG.drive;
  return (
    CONFIG.apiKey && CONFIG.apiKey !== 'CHAVE_API_AQUI' &&
    folderIds[year] && !folderIds[year].startsWith('ID_PASTA')
  );
}

/** Vai buscar os ficheiros da pasta do Drive para o ano indicado */
async function fetchDriveFiles(year) {
  const { folderIds } = CONFIG.drive;
  const params = new URLSearchParams({
    q: `'${folderIds[year]}' in parents and trashed = false`,
    key: CONFIG.apiKey,
    fields: 'files(id,name,createdTime,webViewLink,mimeType)',
    orderBy: 'createdTime desc',
    pageSize: '50',
  });
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || `HTTP ${res.status}`);
  }
  return (await res.json()).files ?? [];
}

/** Converte um ficheiro do Drive no formato que o renderizador espera */
function driveFileToItem(file) {
  const TYPES = {
    'application/pdf': { label: 'PDF', btn: S.download, url: `https://drive.google.com/uc?export=download&id=${file.id}` },
    'application/vnd.google-apps.document': { label: 'Google Doc', btn: S.view, url: `https://docs.google.com/document/d/${file.id}/export?format=pdf` },
    'application/vnd.google-apps.spreadsheet': { label: 'Google Sheets', btn: S.view, url: `https://docs.google.com/spreadsheets/d/${file.id}/export?format=pdf` },
  };
  const { label, btn, url } = TYPES[file.mimeType] ?? { label: S.file, btn: S.view, url: file.webViewLink };
  const date = new Date(file.createdTime).toLocaleDateString(LOCALE, {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  return { name: file.name, date, url, label, btn };
}

/** Renderiza a lista de documentos para o ano indicado */
async function renderDocs(year) {
  const list = document.getElementById('docs-list');

  if (!driveReady(year)) {
    list.innerHTML = `<div class="docs-empty">${S.drive_not_cfg}${year}.<br>${S.drive_hint}</div>`;
    return;
  }

  list.innerHTML = `<div class="docs-loading">${S.loading_docs}</div>`;

  try {
    const files = await fetchDriveFiles(year);

    if (files.length === 0) {
      list.innerHTML = `<div class="docs-empty">${S.no_docs}${year}.</div>`;
      return;
    }

    list.innerHTML = files.map(file => {
      const doc = driveFileToItem(file);
      return `
        <div class="doc-item">
          <div class="doc-item-left">
            <span class="doc-icon">📄</span>
            <div>
              <div class="doc-name">${doc.name}</div>
              <div class="doc-meta">${doc.label} · ${doc.date}</div>
            </div>
          </div>
          <a href="${doc.url}" class="doc-download" target="_blank" rel="noopener">${doc.btn}</a>
        </div>`;
    }).join('');

  } catch (err) {
    list.innerHTML = `<div class="docs-error">${S.error_docs}${err.message}</div>`;
  }
}

/** Devolve o hash SHA-256 de uma string (hex) */
async function hashPwd(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
}

/** Inicializa a secção de documentos: password gate + tabs por ano */
function setupDocumentos() {
  const lockEl = document.getElementById('docs-locked');
  const contentEl = document.getElementById('docs-content');
  const inputEl = document.getElementById('docs-password');
  const errorEl = document.getElementById('pw-error');

  async function unlock() {
    const hash = await hashPwd(inputEl.value);
    if (hash === CONFIG.passwordHash) {
      lockEl.style.display = 'none';
      contentEl.style.display = 'block';
      renderDocs('2026');
    } else {
      errorEl.style.display = 'block';
      inputEl.value = '';
    }
  }

  document.getElementById('docs-submit').addEventListener('click', unlock);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') unlock(); });

  document.querySelectorAll('.doc-year-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.doc-year-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDocs(btn.dataset.year);
    });
  });
}


// ─────────────────────────────────────────────────────────────────────────────
//  ARRANQUE — ponto de entrada único
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('eventos-grid')) renderEventos();
  if (document.getElementById('docs-locked')) setupDocumentos();
});
