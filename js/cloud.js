/* ═══════════════════════════════════════════════════════════
   CLOUD — Supabase sync layer
   Mentor24h | Multi-user sem login
═══════════════════════════════════════════════════════════ */

const Cloud = (() => {
  const SUPABASE_URL = 'https://qrnvykzozbnqmvicscbr.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFybnZ5a3pvemJucW12aWNzY2JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0Nzk5NDQsImV4cCI6MjA5NTA1NTk0NH0.j_2HUS_UFLbW57_LzEUplehRp1lmhQdiNS889KcR5lg';

  const LS_USER_ID = 'mentor24h.cloud.userId';
  const LS_NOME    = 'mentor24h.cloud.nome';

  const SKIP_KEYS = new Set([
    'mentor24h.schema-version',
    'mentor24h_modoAtivo',
    'mentor24h.cloud.userId',
    'mentor24h.cloud.nome',
  ]);

  let _userId = null;
  let _client = null;
  let _ready   = false;

  function _db() {
    if (!_client) _client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return _client;
  }

  async function createUser(nome) {
    const { data, error } = await _db()
      .from('usuarios')
      .insert({ nome })
      .select()
      .single();
    if (error) throw error;
    _userId = data.id;
    localStorage.setItem(LS_USER_ID, _userId);
    localStorage.setItem(LS_NOME, nome);
    return data;
  }

  async function _loadFromCloud() {
    if (!_userId) return;
    try {
      const { data, error } = await _db()
        .from('colecoes')
        .select('chave, dados')
        .eq('user_id', _userId);
      if (error) throw error;
      if (data && data.length) {
        data.forEach(row => {
          localStorage.setItem(row.chave, JSON.stringify(row.dados));
        });
      }
    } catch (e) {
      console.warn('[Cloud] Load failed — usando dados locais:', e.message);
    }
  }

  async function sync(chave, dados) {
    if (!_userId || SKIP_KEYS.has(chave)) return;
    try {
      await _db().from('colecoes').upsert(
        { user_id: _userId, chave, dados, atualizado_em: new Date().toISOString() },
        { onConflict: 'user_id,chave' }
      );
    } catch (e) {
      console.warn('[Cloud] Sync error —', chave, ':', e.message);
    }
  }

  function _showSetupScreen() {
    return new Promise(resolve => {
      const overlay = document.getElementById('cloud-setup-overlay');
      if (!overlay) { resolve(); return; }

      overlay.style.display = 'flex';

      const input = document.getElementById('cloud-setup-nome');
      const btn   = document.getElementById('cloud-setup-btn');
      const err   = document.getElementById('cloud-setup-err');

      if (input) setTimeout(() => input.focus(), 100);

      async function onConfirm() {
        const nome = (input?.value || '').trim();
        if (!nome) { input?.focus(); return; }
        btn.disabled    = true;
        btn.textContent = 'Entrando...';
        if (err) err.textContent = '';
        try {
          await createUser(nome);
          overlay.style.display = 'none';
          resolve();
        } catch (e) {
          btn.disabled    = false;
          btn.textContent = 'Entrar';
          if (err) err.textContent = 'Erro ao conectar. Tente novamente.';
          console.error('[Cloud] createUser failed:', e);
        }
      }

      btn?.addEventListener('click', onConfirm);
      input?.addEventListener('keydown', e => { if (e.key === 'Enter') onConfirm(); });
    });
  }

  async function init() {
    _userId = localStorage.getItem(LS_USER_ID);

    if (!_userId) {
      await _showSetupScreen();
    }

    await _loadFromCloud();
    _ready = true;
  }

  function getUserId() { return _userId; }
  function getNome()   { return localStorage.getItem(LS_NOME) || ''; }
  function isReady()   { return _ready; }

  return { init, sync, createUser, getUserId, getNome, isReady };
})();
