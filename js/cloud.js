/* ═══════════════════════════════════════════════════════════
   CLOUD — Supabase sync layer (com Auth)
   Mentor24h | Login real por email/senha
═══════════════════════════════════════════════════════════ */

const Cloud = (() => {
  const SUPABASE_URL = 'https://qrnvykzozbnqmvicscbr.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFybnZ5a3pvemJucW12aWNzY2JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0Nzk5NDQsImV4cCI6MjA5NTA1NTk0NH0.j_2HUS_UFLbW57_LzEUplehRp1lmhQdiNS889KcR5lg';

  const SKIP_KEYS = new Set([
    'mentor24h.schema-version',
    'mentor24h_modoAtivo',
    'finflow.leo-v1',
  ]);

  let _client = null;
  let _userId = null;
  let _userName = null;
  let _ready  = false;

  function db() {
    if (!_client) {
      _client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: true, autoRefreshToken: true },
      });
    }
    return _client;
  }

  async function _loadFromCloud() {
    if (!_userId) return;
    try {
      const { data, error } = await db()
        .from('colecoes')
        .select('chave, dados')
        .eq('user_id', _userId);
      if (error) throw error;
      console.log('[Cloud] loadFromCloud — user_id:', _userId, '| rows:', data?.length ?? 0, '| chaves:', data?.map(r => r.chave));
      if (data && data.length) {
        data.forEach(row => localStorage.setItem(row.chave, JSON.stringify(row.dados)));
      }
    } catch (e) {
      console.warn('[Cloud] Load failed — usando dados locais:', e.message);
    }
  }

  async function deleteAll() {
    if (!_userId) return;
    try {
      const { error } = await db().from('colecoes').delete().eq('user_id', _userId);
      if (error) console.warn('[Cloud] deleteAll error:', error.message);
      else console.log('[Cloud] deleteAll — dados removidos do Supabase para', _userId);
    } catch (e) {
      console.warn('[Cloud] deleteAll exception:', e.message);
    }
  }

  async function sync(chave, dados) {
    if (!_userId || SKIP_KEYS.has(chave)) return;
    if (!chave.startsWith('finflow.') && !chave.startsWith('mentor24h.')) return;
    try {
      const { error } = await db().from('colecoes').upsert(
        { user_id: _userId, chave, dados, atualizado_em: new Date().toISOString() }
      );
      if (error) console.warn('[Cloud] Sync error —', chave, ':', error.message, error.code);
    } catch (e) {
      console.warn('[Cloud] Sync exception —', chave, ':', e.message);
    }
  }

  async function syncAll() {
    if (!_userId) return;
    const promises = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || SKIP_KEYS.has(k)) continue;
      if (!k.startsWith('finflow.') && !k.startsWith('mentor24h.')) continue;
      try { promises.push(sync(k, JSON.parse(localStorage.getItem(k)))); } catch {}
    }
    await Promise.all(promises);
    console.log('[Cloud] syncAll completo para', _userId);
  }

  /* Inicializa o cliente e detecta sessão existente. Retorna true se logado. */
  async function init() {
    const { data } = await db().auth.getSession();
    _userId   = data?.session?.user?.id || null;
    _userName = data?.session?.user?.user_metadata?.nome || null;

    db().auth.onAuthStateChange((_event, session) => {
      _userId   = session?.user?.id || null;
      _userName = session?.user?.user_metadata?.nome || null;
    });

    _ready = true;
    return !!_userId;
  }

  /* Carrega os dados do usuário logado para o localStorage */
  async function loadUserData() {
    await _loadFromCloud();
    _reconcileUserName();
  }

  /* Garante que o nome escolhido no cadastro apareça quando a config vier vazia */
  function _reconcileUserName() {
    if (!_userName || !window.DB || !DB.getConfig || !DB.saveConfig) return;
    const cfg = DB.getConfig();
    if (!cfg.nomeUsuario || cfg.nomeUsuario === 'Você') {
      DB.saveConfig({ nomeUsuario: _userName });
    }
  }

  function getUserId() { return _userId; }
  function setUserId(id) { _userId = id; }
  function isReady()    { return _ready; }

  return { init, db, sync, syncAll, loadUserData, deleteAll, getUserId, setUserId, isReady };
})();
