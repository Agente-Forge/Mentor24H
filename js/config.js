/* ═══════════════════════════════════════════════════════════
   CONFIG — User preferences, data export/import
═══════════════════════════════════════════════════════════ */

const Config = (() => {
  function render() {
    const cfg = DB.getConfig();
    const fNome = document.getElementById('cfg-nome');
    const fSaldo = document.getElementById('cfg-saldo');
    const fMoeda = document.getElementById('cfg-moeda');
    const fCor = document.getElementById('cfg-cor');
    if (fNome)  fNome.value  = cfg.nomeUsuario || '';
    if (fSaldo) fSaldo.value = cfg.saldoInicial || 0;
    if (fMoeda) fMoeda.value = cfg.moeda || 'BRL';
    if (fCor)   fCor.value   = cfg.avatarCor || '#A78BFA';
    updatePreview();
  }

  function updatePreview() {
    const cfg = DB.getConfig();
    const nome = document.getElementById('cfg-nome')?.value || cfg.nomeUsuario || 'Você';
    const cor  = document.getElementById('cfg-cor')?.value  || cfg.avatarCor || '#A78BFA';
    const initials = nome.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'V';

    const prev = document.getElementById('avatar-prev');
    if (prev) {
      prev.style.background = cor;
      prev.textContent = initials;
    }

    syncSidebarAvatar(initials, cor, nome);
  }

  function syncSidebarAvatar(initials, cor, nome) {
    const sideAv = document.getElementById('side-avatar');
    if (sideAv) {
      sideAv.style.background = cor;
      sideAv.textContent = initials;
    }
    const sideNome = document.getElementById('side-nome');
    if (sideNome) sideNome.textContent = nome;
  }

  function salvar() {
    const nome  = document.getElementById('cfg-nome').value.trim();
    const saldo = parseFloat(document.getElementById('cfg-saldo').value) || 0;
    const moeda = document.getElementById('cfg-moeda').value;
    const cor   = document.getElementById('cfg-cor').value;
    if (!nome) { Toast.error('Nome obrigatório'); return; }
    DB.saveConfig({ nomeUsuario: nome, saldoInicial: saldo, moeda, avatarCor: cor });
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
      'TODOS os seus dados serão perdidos permanentemente.',
      () => {
        DB.clearAll();
        Toast.success('Dados apagados');
        setTimeout(() => location.reload(), 1000);
      },
      'Apagar tudo'
    );
  }

  return { render, updatePreview, salvar, exportar, importar, limparTudo, syncSidebarAvatar };
})();
