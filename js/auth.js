/* ═══════════════════════════════════════════════════════════
   AUTH — Login/cadastro/recuperação por email e senha (Supabase Auth)
   Mentor24h
═══════════════════════════════════════════════════════════ */

const Auth = (() => {
  let _resolveLogin = null;
  let _mode = 'login';   // 'login' | 'signup' | 'reset' | 'new-password'
  let _listenersSet = false;

  function _el(id) { return document.getElementById(id); }

  function _setMode(mode) {
    _mode = mode;
    const isSignup = mode === 'signup';
    const isReset  = mode === 'reset';
    const isNewPwd = mode === 'new-password';
    const isLogin  = mode === 'login';

    _el('auth-nome-wrap').style.display   = isSignup ? 'block' : 'none';
    _el('auth-email-wrap').style.display  = isNewPwd ? 'none'  : 'block';
    _el('auth-senha-wrap').style.display  = isReset  ? 'none'  : 'block';
    _el('auth-forgot-wrap').style.display = isLogin  ? 'block' : 'none';
    _el('auth-toggle-text').style.display = isNewPwd ? 'none'  : 'block';

    if (isNewPwd) {
      _el('auth-title').textContent = 'Nova senha';
      _el('auth-submit').textContent = 'Salvar';
      _el('auth-senha').placeholder = 'Nova senha';
      _el('auth-senha').setAttribute('autocomplete', 'new-password');
    } else {
      _el('auth-senha').placeholder = 'Sua senha';
      _el('auth-senha').setAttribute('autocomplete', 'current-password');
    }

    if (isReset) {
      _el('auth-title').textContent = 'Recuperar senha';
      _el('auth-submit').textContent = 'Enviar link';
      _el('auth-toggle-text').innerHTML =
        'Lembrou? <a id="auth-toggle-link" href="#" style="color:var(--color-gold);text-decoration:none;">Entrar</a>';
    } else if (!isNewPwd) {
      _el('auth-title').textContent = isSignup ? 'Criar conta' : 'Entrar';
      _el('auth-submit').textContent = isSignup ? 'Criar conta' : 'Entrar';
      _el('auth-toggle-text').innerHTML = isSignup
        ? 'Já tem conta? <a id="auth-toggle-link" href="#" style="color:var(--color-gold);text-decoration:none;">Entrar</a>'
        : 'Não tem conta? <a id="auth-toggle-link" href="#" style="color:var(--color-gold);text-decoration:none;">Criar agora</a>';
    }

    const toggleLink = _el('auth-toggle-link');
    if (toggleLink) {
      const next = (isSignup || isReset) ? 'login' : 'signup';
      toggleLink.addEventListener('click', e => { e.preventDefault(); _setMode(next); });
    }
    _msg('');
  }

  function _msg(text, isError = true) {
    const el = _el('auth-msg');
    el.textContent = text;
    el.style.color = isError ? '#ef4444' : '#22c55e';
  }

  function _busy(on) {
    const btn = _el('auth-submit');
    btn.disabled = on;
    btn.style.opacity = on ? '0.6' : '1';
  }

  function _togglePassword() {
    const input = _el('auth-senha');
    const icon  = _el('auth-eye');
    if (input.type === 'password') {
      input.type = 'text';
      icon.setAttribute('data-icon', 'eye-off');
    } else {
      input.type = 'password';
      icon.setAttribute('data-icon', 'eye');
    }
    if (window.Icons) Icons.render(icon.parentElement);
  }

  async function _submit() {
    /* ── Enviar link de recuperação ── */
    if (_mode === 'reset') {
      const email = (_el('auth-email').value || '').trim();
      if (!email) { _msg('Digite seu email.'); return; }
      _busy(true);
      try {
        const { error } = await Cloud.db().auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + window.location.pathname,
        });
        if (error) throw error;
        _msg('Link enviado! Verifique seu email.', false);
      } catch (e) {
        _msg(_traduzErro(e.message || ''));
      }
      _busy(false);
      return;
    }

    /* ── Salvar nova senha (retorno do link de email) ── */
    if (_mode === 'new-password') {
      const senha = _el('auth-senha').value || '';
      if (senha.length < 6) { _msg('A senha precisa ter pelo menos 6 caracteres.'); return; }
      _busy(true);
      try {
        const { error } = await Cloud.db().auth.updateUser({ password: senha });
        if (error) throw error;
        _finish();
      } catch (e) {
        _msg(_traduzErro(e.message || ''));
        _busy(false);
      }
      return;
    }

    /* ── Login / Cadastro ── */
    const email = (_el('auth-email').value || '').trim();
    const senha = _el('auth-senha').value || '';
    const nome  = (_el('auth-nome').value || '').trim();

    if (!email || !senha) { _msg('Preencha email e senha.'); return; }
    if (senha.length < 6) { _msg('A senha precisa ter pelo menos 6 caracteres.'); return; }
    if (_mode === 'signup' && !nome) { _msg('Digite seu nome.'); return; }

    _busy(true);
    _msg('');

    try {
      if (_mode === 'signup') {
        const { data, error } = await Cloud.db().auth.signUp({
          email, password: senha,
          options: { data: { nome, display_name: nome } },
        });
        if (error) throw error;

        if (data.session) {
          Cloud.setUserId(data.user.id);
          if (window.DB && DB.clearAll)  DB.clearAll();
          if (window.DB && DB.saveConfig) DB.saveConfig({ nomeUsuario: nome });
          _finish();
        } else {
          _msg('Conta criada! Confirme o link enviado para ' + email + ' e depois faça login.', false);
          _setMode('login');
        }
      } else {
        const { data, error } = await Cloud.db().auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
        console.log('[Auth] login — user.id:', data.user.id, '| email:', data.user.email);
        Cloud.setUserId(data.user.id);
        if (window.DB && DB.clearAll) DB.clearAll();
        await Cloud.loadUserData();
        const metaNome = data.user.user_metadata?.nome;
        if (metaNome && window.DB && DB.saveConfig) {
          const cfg = DB.getConfig();
          if (!cfg.nomeUsuario || cfg.nomeUsuario === 'Você') DB.saveConfig({ nomeUsuario: metaNome });
        }
        _finish();
      }
    } catch (e) {
      console.error('[Auth]', e);
      _msg(_traduzErro(e.message || ''));
      _busy(false);
    }
  }

  function _traduzErro(msg) {
    if (/invalid login credentials/i.test(msg)) return 'Email ou senha incorretos.';
    if (/already registered|already exists/i.test(msg)) return 'Esse email já tem conta. Faça login.';
    if (/email.*invalid|invalid.*email/i.test(msg)) return 'Email inválido.';
    if (/rate limit|too many/i.test(msg)) return 'Muitas tentativas. Espere um pouco.';
    return 'Erro: ' + msg;
  }

  function _finish() {
    const overlay = _el('auth-overlay');
    if (overlay) overlay.style.display = 'none';
    _busy(false);
    if (_resolveLogin) { _resolveLogin(); _resolveLogin = null; }
  }

  function _setupListeners() {
    if (_listenersSet) return;
    _listenersSet = true;
    _el('auth-submit').addEventListener('click', _submit);
    _el('auth-eye-btn').addEventListener('click', _togglePassword);
    _el('auth-senha').addEventListener('keydown', e => { if (e.key === 'Enter') _submit(); });
    _el('auth-email').addEventListener('keydown', e => { if (e.key === 'Enter') _submit(); });
    const forgotLink = _el('auth-forgot-link');
    if (forgotLink) {
      forgotLink.addEventListener('click', e => { e.preventDefault(); _setMode('reset'); });
    }
  }

  /* Mostra a tela de login e resolve a Promise quando o usuário autentica */
  function requireLogin() {
    return new Promise(resolve => {
      _resolveLogin = resolve;
      const overlay = _el('auth-overlay');
      if (!overlay) { resolve(); return; }
      overlay.style.display = 'flex';
      _setMode('login');
      _setupListeners();
      setTimeout(() => _el('auth-email').focus(), 100);
      if (window.Icons) Icons.render(overlay);
    });
  }

  /* Mostra o formulário de nova senha (retorno do link de recuperação por email) */
  function showRecoveryForm() {
    return new Promise(resolve => {
      _resolveLogin = resolve;
      const overlay = _el('auth-overlay');
      if (!overlay) { resolve(); return; }
      overlay.style.display = 'flex';
      _setMode('new-password');
      _setupListeners();
      setTimeout(() => _el('auth-senha').focus(), 100);
      if (window.Icons) Icons.render(overlay);
    });
  }

  async function logout() {
    if (window.DB && DB.clearAll) DB.clearAll();
    try { await Cloud.db().auth.signOut(); } catch (_) {}
    location.reload();
  }

  return { requireLogin, showRecoveryForm, logout };
})();
