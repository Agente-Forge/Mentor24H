/* ═══════════════════════════════════════════════════════════
   REPOSITORY — Adapter CRUD sobre DB (localStorage)
   Mentor24h | Forge v5.2 | Sprint 1

   Uso:
     Repository.get('agenda')           → array
     Repository.getById('tarefas', id)  → item | null
     Repository.save('produtos', data)  → item salvo
     Repository.remove('contatos', id)  → void

   Injeta automaticamente: id, user_id, createdAt, updatedAt
   Todos os módulos novos usam Repository — módulos legados
   continuam chamando DB diretamente (sem quebrar nada).
═══════════════════════════════════════════════════════════ */

const Repository = (() => {

  function get(collection) {
    return DB.getAll(collection) || [];
  }

  function getById(collection, id) {
    return DB.getById(collection, id) || null;
  }

  function save(collection, data) {
    const now = new Date().toISOString();
    const item = Object.assign({}, data);

    if (!item.id) {
      item.id        = Utils.uid();
      item.user_id   = 'local';
      item.createdAt = now;
    }
    item.updatedAt = now;

    DB.save(collection, item);
    return item;
  }

  function remove(collection, id) {
    DB.remove(collection, id);
  }

  return { get, getById, save, remove };
})();
