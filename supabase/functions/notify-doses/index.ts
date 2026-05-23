// Edge Function: notify-doses
// Chama todas as doses ativas no próximo minuto e envia push para cada subscriber

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @deno-types="npm:@types/web-push"
import webpush from 'npm:web-push';

const SUPABASE_URL            = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY    = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const VAPID_PUBLIC_KEY        = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY       = Deno.env.get('VAPID_PRIVATE_KEY')!;

webpush.setVapidDetails(
  'mailto:leosilvabh77@gmail.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
);

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

Deno.serve(async (_req) => {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - 60_000);
    const windowEnd   = new Date(now.getTime() + 60_000);

    // Buscar todos os medicamentos de todos os usuários
    const { data: meds, error: medsErr } = await db
      .from('colecoes')
      .select('user_id, dados')
      .eq('chave', 'mentor24h.medicamentos');

    if (medsErr) throw medsErr;

    let sent = 0;

    for (const row of (meds ?? [])) {
      const userId = row.user_id as string;
      const medicamentos: Array<{ id: string; nome: string; horarios: string[] }> = row.dados ?? [];

      for (const med of medicamentos) {
        for (const horario of (med.horarios ?? [])) {
          const [hh, mm] = horario.split(':').map(Number);
          const doseDt = new Date(now);
          doseDt.setHours(hh, mm, 0, 0);

          if (doseDt < windowStart || doseDt > windowEnd) continue;

          const todayStr = now.toISOString().slice(0, 10);
          const doseId = `${userId}_${med.id}_${todayStr}_${horario}`;

          // Já foi tomado hoje?
          const { data: taken } = await db
            .from('dose_logs')
            .select('id')
            .eq('dose_id', doseId)
            .maybeSingle();
          if (taken) continue;

          // Está em snooze?
          const { data: snoozed } = await db
            .from('dose_snoozes')
            .select('snooze_until')
            .eq('dose_id', doseId)
            .gte('snooze_until', now.toISOString())
            .maybeSingle();
          if (snoozed) continue;

          // Subscriptions do usuário
          const { data: subs } = await db
            .from('push_subscriptions')
            .select('subscription')
            .eq('user_id', userId);

          const payload = JSON.stringify({
            title: `💊 ${med.nome}`,
            body: `Hora de tomar — ${horario}`,
            tag: doseId,
            data: { dose_id: doseId, user_id: userId, med_id: med.id },
          });

          for (const s of (subs ?? [])) {
            try {
              await webpush.sendNotification(s.subscription as webpush.PushSubscription, payload);
              sent++;
            } catch (e: unknown) {
              const err = e as { statusCode?: number };
              // 410 Gone = subscription expirada, remover
              if (err.statusCode === 410) {
                await db.from('push_subscriptions').delete().eq('subscription->>endpoint', (s.subscription as { endpoint: string }).endpoint);
              } else {
                console.error('sendNotification error:', e);
              }
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({ ok: true, sent }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
