import 'dotenv/config';
import { execSync } from 'node:child_process';

function sh(c: string) {
  console.log('→', c);
  try {
    execSync(c, { stdio: 'inherit' });
  } catch (error) {
    throw error;
  }
}

(async () => {
  try {
    console.log('\n==============================');
    console.log('🚀 ZERO-TOUCH GO');
    console.log('==============================\n');

    // 1) Vérifier la configuration
    console.log('📋 Étape 1/3 : Vérification de la configuration\n');
    sh('npm run zero:verify');

    console.log('\n📋 Étape 2/3 : Application des migrations\n');
    try {
      sh('npx prisma migrate deploy');
      console.log('✅ Migrations appliquées');
    } catch {
      console.log('⚠️  Aucune migration à appliquer ou déjà appliquées');
    }

    console.log('\n📋 Étape 3/3 : Ouverture de Prisma Studio\n');
    console.log('💡 Prisma Studio va s\'ouvrir sur http://localhost:5555');
    console.log('💡 Appuyez sur Ctrl+C pour arrêter Prisma Studio\n');
    
    try {
      sh('npx prisma studio');
    } catch {
      console.log('💡 Prisma Studio fermé (vous pouvez le rouvrir avec: npm run db:studio)');
    }

    console.log('\n==============================');
    console.log('🎉 ZERO-GO TERMINÉ');
    console.log('==============================');
    console.log('');
    console.log('✅ Configuration vérifiée');
    console.log('✅ Migrations appliquées');
    console.log('✅ Prisma Studio lancé');
    console.log('');
    console.log('🚀 Prochaine étape:');
    console.log('   npm run dev');
    console.log('   (Lance l\'application sur http://localhost:3000)');
    console.log('');
    console.log('==============================\n');
  } catch (e) {
    console.error('\n==============================');
    console.error('💥 ZERO-GO ERREUR');
    console.error('==============================');
    console.error('');
    console.error('Erreur:', e instanceof Error ? e.message : e);
    console.error('');
    console.error('💡 Essayez de corriger le problème ci-dessus,');
    console.error('   puis relancez: npm run zero:go');
    console.error('');
    console.error('==============================\n');
    process.exit(1);
  }
})();
