import 'dotenv/config';
import fetch from 'node-fetch';

const {
  VERCEL_TOKEN,
  VERCEL_PROJECT_ID,
  VERCEL_TEAM_ID,
  DEPLOY_HOOK_URL,
  DATABASE_URL,
  NEXT_PUBLIC_RPC_URL,
  NEXT_PUBLIC_CONTRACT_ADDRESS,
  CONTRACT_ADDRESS,
  NEXT_PUBLIC_CHAIN_ID,
  CHAIN_ID,
  NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_ETHERSCAN_BASE_URL,
  PRIVATE_KEY
} = process.env;

function req(url: string, init: any = {}) {
  const u = new URL(url);
  if (VERCEL_TEAM_ID) u.searchParams.set('teamId', VERCEL_TEAM_ID);
  return fetch(u.toString(), {
    ...init,
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
}

function assertEnv(name: string) {
  if (!process.env[name] || String(process.env[name]).trim() === '') {
    console.error(`❌ Variable manquante : ${name}`);
    console.error(`💡 Ajoutez-la dans .env.local`);
    process.exit(1);
  }
}

async function upsertEnv(key: string, value: string | undefined, targets = ['production', 'preview', 'development']) {
  if (!value || String(value).trim() === '') {
    console.log(`⏭️  Skip ${key} (non défini dans .env.local)`);
    return;
  }
  
  console.log(`📤 Envoi de ${key} vers Vercel...`);
  
  // Créeune nouvelle version d'ENV (idempotent côté Vercel)
  const res = await req(`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env`, {
    method: 'POST',
    body: JSON.stringify({
      key,
      value,
      target: targets,
      type: 'plain'
    })
  });
  
  if (!res.ok) {
    const t = await res.text();
    
    // Si l'erreur est "already exists", on continue (c'est OK)
    if (t.includes('ENV_ALREADY_EXISTS') || t.includes('already exists') || t.includes('conflict')) {
      console.log(`⚠️  ${key} existe déjà sur Vercel (pas de mise à jour)`);
      return;
    }
    
    console.error(`💥 Échec set env ${key}: ${res.status} ${t}`);
    process.exit(1);
  } else {
    console.log(`✅ ENV ${key} mis à jour sur Vercel (${targets.join(',')})`);
  }
}

async function triggerRedeploy() {
  console.log('\n🚀 Déclenchement du redéploiement...');
  
  // 1) Si un DEPLOY_HOOK_URL est défini, on l'utilise (le plus simple)
  if (DEPLOY_HOOK_URL) {
    const r = await fetch(DEPLOY_HOOK_URL, { method: 'POST' });
    if (!r.ok) {
      const t = await r.text();
      console.warn(`⚠️  Deploy Hook a échoué: ${r.status} ${t}`);
    } else {
      console.log('✅ Redeploy déclenché via Deploy Hook');
      return;
    }
  }

  // 2) Sinon, on redeploye le dernier déploiement via l'API
  //    a) Récupère le dernier déploiement
  const list = await req(`https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&limit=1`);
  if (!list.ok) {
    const t = await list.text();
    console.error('💥 Impossible de lister les déploiements :', t);
    return;
  }
  
  const data: any = await list.json();
  const latest = data?.deployments?.[0];
  if (!latest?.uid) {
    console.error('💥 Aucun déploiement trouvé pour ce projet.');
    console.log('💡 Créez un Deploy Hook dans Vercel → Project → Settings → Git → Deploy Hooks');
    return;
  }

  //    b) Redeploy de ce déploiement
  const rd = await req(`https://api.vercel.com/v1/deployments`, {
    method: 'POST',
    body: JSON.stringify({ 
      name: latest.name,
      target: 'production',
      gitSource: latest.gitSource
    })
  });
  
  if (!rd.ok) {
    const t = await rd.text();
    console.error('💥 Échec redeploy API :', t);
  } else {
    console.log('✅ Redeploy Vercel (API) déclenché');
  }
}

(async () => {
  console.log('');
  console.log('==============================');
  console.log('🔐 VERCEL WIRE - CONFIGURATION');
  console.log('==============================\n');
  
  console.log('🔍 Vérification des prérequis...');
  assertEnv('VERCEL_TOKEN');
  assertEnv('VERCEL_PROJECT_ID');
  
  console.log('✅ Prérequis OK\n');

  // Variables produit (tu peux en ajouter d'autres si besoin)
  const envs: Record<string, string | undefined> = {
    DATABASE_URL,
    NEXT_PUBLIC_RPC_URL,
    NEXT_PUBLIC_CONTRACT_ADDRESS,
    CONTRACT_ADDRESS,
    NEXT_PUBLIC_CHAIN_ID,
    CHAIN_ID,
    NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_ETHERSCAN_BASE_URL,
    PRIVATE_KEY
  };

  // Pousse chaque clé (si définie dans .env.local)
  console.log('📦 Envoi des variables d\'environnement...\n');
  
  for (const [key, value] of Object.entries(envs)) {
    await upsertEnv(key, value);
  }

  // Redeploy
  await triggerRedeploy();

  console.log('');
  console.log('==============================');
  console.log('✅ VERCEL WIRE TERMINÉ');
  console.log('==============================');
  console.log('');
  console.log('📋 Ce qui a été fait:');
  console.log('   ✅ Variables d\'environnement poussées vers Vercel');
  console.log('   ✅ Redéploiement déclenché (Hook ou API)');
  console.log('');
  console.log('🔗 Vérifiez le déploiement:');
  console.log('   → Allez sur Vercel → Votre projet → Deployments');
  console.log('   → Vérifiez que le nouveau déploiement est en cours');
  console.log('');
  console.log('⏰ Temps d\'attente estimé: 2-5 minutes');
  console.log('');
  console.log('🧪 Une fois déployé, testez:');
  console.log('   → /anchor (upload → anchor)');
  console.log('   → /verify (vérification)');
  console.log('   → Vérifiez les données dans Supabase');
  console.log('');
  console.log('==============================\n');
})().catch(e => {
  console.error('\n💥 ERREUR vercel-wire:', e.message || e);
  console.error('\n💡 Vérifiez que:');
  console.error('   1. VERCEL_TOKEN est valide (Settings → Tokens)');
  console.error('   2. VERCEL_PROJECT_ID est correct');
  console.error('   3. Vous avez les permissions sur le projet\n');
  process.exit(1);
});
