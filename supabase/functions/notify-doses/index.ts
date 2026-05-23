// Edge Function: notify-doses
// Roda a cada minuto via pg_cron. Lê doses de cada usuário e envia push
// no horário certo, respeitando o fuso horário de cada dispositivo.
//
// Modo teste: POST com body {"test": true} envia uma notificação imediata
// para TODAS as subscriptions (serve para validar a entrega ponta-a-ponta).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @deno-types="npm:@types/web-push"
import webpush from 'npm:web-push';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const VAPID_PUBLIC_KEY     = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY    = Deno.env.get('VAPID_PRIVATE_KEY')!;

webpush.setVapidDetails('mailto:leosilvabh77@gmail.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

type Sub = { endpoint: string; keys: { auth: string; p256dh: string } };

async function pushTo(sub: Sub, payload: string): Promise<boolean> {
  try {
    await webpush.sendNotification(sub as webpush.PushSubscription, payload);
    return true;
  } catch (e: unknown) {
    const err = e as { statusCode?: number };
    if (err.statusCode === 410 || err.statusCode === 404) {
      // subscription expirada — remover
      await db.from('push_subscriptions').delete().eq('subscription->>endpoint', sub.endpoint);
    } else {
      console.error('sendNotification error:', e);
    }
    return false;
  }
}

Deno.serve(async (req) => {
  try {
    let body: { test?: boolean } = {};
    try { body = await req.json(); } catch (_) { /* sem body */ }

    // ─── MODO TESTE: dispara já para todas as subscriptions ───
    if (body.test === true) {
      const { data: allSubs } = await db.from('push_subscriptions').select('subscription');
      let sent = 0;
      const payload = JSON.stringify({
        title: '✅ Teste Mentor24h',
        body: 'Se você está vendo isso, as notificações funcionam!',
        tag: 'teste',
        data: {},
      });
      for (const s of (allSubs ?? [])) {
        if (await pushTo(s.subscription as Sub, payload)) sent++;
      }
      return new Response(JSON.stringify({ ok: true, mode: 'test', sent }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ─── MODO NORMAL: checar doses do minuto atual ───
    const nowMs = Date.now();

    const { data: meds, error: medsErr } = await db
      .from('colecoes')
      .select('user_id, dados')
      .eq('chave', 'mentor24h.medicamentos');
    if (medsErr) throw medsErr;

    let sent = 0;

    for (const row of (meds ?? [])) {
      const userId = row.user_id as string;
      const medicamentos: Array<{
        id: string;
        nome: string;
        horarios?: string[];
        doses?: Array<{ hora: string; quantidade?: number }>;
      }> = row.dados ?? [];
      if (!medicamentos.length) continue;

      // subscriptions + fuso do usuário
      const { data: subs } = await db
        .from('push_subscriptions')
        .select('subscription, timezone_offset')
        .eq('user_id', userId);
      if (!subs || !subs.length) continue;

      const offsetMin = subs[0].timezone_offset ?? 0;
      const userLocal = new Date(nowMs + offsetMin * 60000);
      const curHHMM = `${String(userLocal.getUTCHours()).padStart(2, '0')}:${String(userLocal.getUTCMinutes()).padStart(2, '0')}`;
      const localDate = userLocal.toISOString().slice(0, 10);

      for (const med of medicamentos) {
        // horários podem estar em doses[].hora OU em horarios[]
        const horas = [
          ...(med.doses ?? []).map(d => d.hora),
          ...(med.horarios ?? []),
        ].filter(Boolean);

        for (const hora of horas) {
          if (hora !== curHHMM) continue;

          const doseId = `${userId}_${med.id}_${localDate}_${hora}`;

          const { data: taken } = await db.from('dose_logs')
            .select('id').eq('dose_id', doseId).maybeSingle();
          if (taken) continue;

          const { data: snoozed } = await db.from('dose_snoozes')
            .select('snooze_until').eq('dose_id', doseId)
            .gte('snooze_until', new Date(nowMs).toISOString()).maybeSingle();
          if (snoozed) continue;

          const payload = JSON.stringify({
            title: `💊 ${med.nome}`,
            body: `Hora de tomar — ${hora}`,
            tag: doseId,
            data: { dose_id: doseId, user_id: userId, med_id: med.id },
          });

          for (const s of subs) {
            if (await pushTo(s.subscription as Sub, payload)) sent++;
          }
        }
      }
    }

    return new Response(JSON.stringify({ ok: true, mode: 'cron', sent }), {
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
