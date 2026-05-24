/* ═══════════════════════════════════════════════════════════
   CONFIG — User preferences, data export/import, avatar SVG
═══════════════════════════════════════════════════════════ */

const Config = (() => {
  let _pickerWired = false;
  let _selectedAvatar = null;

  function render() {
    const cfg = DB.getConfig();
    const fNome = document.getElementById('cfg-nome');
    const fSaldo = document.getElementById('cfg-saldo');
    const fMoeda = document.getElementById('cfg-moeda');
    if (fNome)  fNome.value  = cfg.nomeUsuario || '';
    if (fSaldo) fSaldo.value = cfg.saldoInicial || 0;
    if (fMoeda) fMoeda.value = cfg.moeda || 'BRL';
    _selectedAvatar = cfg.avatar || (window.Avatars && Avatars.getDefault()) || 'masc-1';
    updatePreview();
    _wirePicker();
  }

  function updatePreview() {
    const cfg = DB.getConfig();
    const nome = document.getElementById('cfg-nome')?.value || cfg.nomeUsuario || 'Você';
    const avatarKey = _selectedAvatar || cfg.avatar || 'masc-1';
    const svg = window.Avatars ? Avatars.get(avatarKey) : '';

    const display = document.getElementById('cfg-avatar-display');
    if (display) display.innerHTML = svg;

    const heroName = document.getElementById('cfg-hero-name');
    if (heroName) heroName.textContent = nome;

    syncSidebarAvatar(avatarKey, nome);
  }

  function syncSidebarAvatar(avatarKey, nome) {
    const sideAv = document.getElementById('side-avatar');
    if (sideAv && window.Avatars) {
      sideAv.style.background = 'transparent';
      sideAv.innerHTML = Avatars.get(avatarKey);
    }
    const sideNome = document.getElementById('side-nome');
    if (sideNome && nome) sideNome.textContent = nome;
  }

  function _wirePicker() {
    if (_pickerWired) return;
    const editBtn = document.getElementById('cfg-avatar-edit-btn');
    const closeBtn = document.getElementById('cfg-picker-close');
    const picker = document.getElementById('cfg-avatar-picker');
    if (!editBtn || !closeBtn || !picker) return;

    editBtn.addEventListener('click', () => openPicker());
    closeBtn.addEventListener('click', () => closePicker());
    _buildPickerGrids();
    _pickerWired = true;
  }

  function _buildPickerGrids() {
    if (!window.Avatars) return;
    const gridFem = document.getElementById('cfg-avatar-grid-fem');
    const gridMasc = document.getElementById('cfg-avatar-grid-masc');
    if (gridFem) gridFem.innerHTML = _renderOptions(Avatars.getKeys('fem'));
    if (gridMasc) gridMasc.innerHTML = _renderOptions(Avatars.getKeys('masc'));

    [gridFem, gridMasc].forEach(grid => {
      if (!grid) return;
      grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.cfg-avatar-option');
        if (!btn) return;
        _selectAvatar(btn.dataset.avatar);
      });
    });
  }

  function _renderOptions(keys) {
    return keys.map(k => {
      const selected = k === _selectedAvatar ? ' selected' : '';
      return `<button type="button" class="cfg-avatar-option${selected}"
        data-avatar="${k}" aria-label="Avatar ${k}">${Avatars.get(k)}</button>`;
    }).join('');
  }

  function _selectAvatar(key) {
    _selectedAvatar = key;
    document.querySelectorAll('.cfg-avatar-option').forEach(opt => {
      opt.classList.toggle('selected', opt.dataset.avatar === key);
    });
    updatePreview();
    DB.saveConfig({ avatar: key });
    Toast.success('Avatar atualizado');
  }

  function openPicker() {
    const picker = document.getElementById('cfg-avatar-picker');
    if (picker) picker.style.display = '';
  }

  function closePicker() {
    const picker = document.getElementById('cfg-avatar-picker');
    if (picker) picker.style.display = 'none';
  }

  function salvar() {
    const nome  = document.getElementById('cfg-nome').value.trim();
    const saldo = parseFloat(document.getElementById('cfg-saldo')?.value) || 0;
    const moeda = document.getElementById('cfg-moeda')?.value || 'BRL';
    if (!nome) { Toast.error('Nome obrigatório'); return; }
    DB.saveConfig({
      nomeUsuario: nome,
      saldoInicial: saldo,
      moeda,
      avatar: _selectedAvatar
    });
    updatePreview();
    Toast.success('Preferências salvas');
  }

  function exportar() {
    const data = DB.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finflow-backup-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    Toast.success('Backup exportado');
  }

  function importar(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (DB.importAll(data)) {
          Toast.success('Dados importados', 'Recarregando…');
          setTimeout(() => location.reload(), 1200);
        } else {
          Toast.error('Arquivo inválido');
        }
      } catch {
        Toast.error('Arquivo corrompido', 'JSON inválido');
      }
    };
    reader.readAsText(file);
  }

  function limparTudo() {
    Modal.confirm(
      'Apagar tudo?',
      'TODOS os seus dados serão perdidos permanentemente (local e nuvem).',
      async () => {
        DB.clearAll();
        await Cloud.deleteAll();
        Toast.success('Dados apagados');
        setTimeout(() => location.reload(), 1000);
      },
      'Apagar tudo'
    );
  }

  return {
    render, updatePreview, salvar, exportar, importar, limparTudo,
    syncSidebarAvatar, openPicker, closePicker
  };
})();
