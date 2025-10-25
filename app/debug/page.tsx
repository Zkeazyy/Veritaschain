// app/debug/page.tsx
// Page de debug pour vérifier les feature flags et modules

'use client';

import { MODULE_CONFIGS } from '@/lib/feature-flags';

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">🔍 Debug - Feature Flags</h1>
      
      <div className="grid gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">📋 Configuration des Modules</h2>
          <div className="space-y-3">
            {Object.entries(MODULE_CONFIGS).map(([key, config]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-muted rounded">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <div className="font-medium">{config.name}</div>
                    <div className="text-sm text-muted-foreground">{config.description}</div>
                    <div className="text-xs text-muted-foreground">Routes: {config.routes.join(', ')}</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  config.enabled 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {config.enabled ? '✅ Activé' : '❌ Désactivé'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">🔗 Liens de Navigation</h2>
          <div className="space-y-2">
            {Object.entries(MODULE_CONFIGS)
              .filter(([key, config]) => config.enabled)
              .map(([key, config]) => (
                <div key={key} className="flex items-center space-x-2">
                  <span>{config.icon}</span>
                  <a 
                    href={config.routes[0]} 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {config.name} → {config.routes[0]}
                  </a>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">🌐 Variables d'Environnement</h2>
          <div className="space-y-2 text-sm font-mono">
            <div>NEXT_PUBLIC_FEATURE_RH: {process.env.NEXT_PUBLIC_FEATURE_RH || 'non défini'}</div>
            <div>NEXT_PUBLIC_FEATURE_ACCOUNTING: {process.env.NEXT_PUBLIC_FEATURE_ACCOUNTING || 'non défini'}</div>
            <div>NEXT_PUBLIC_FEATURE_LEGAL: {process.env.NEXT_PUBLIC_FEATURE_LEGAL || 'non défini'}</div>
            <div>NEXT_PUBLIC_FEATURE_BTP: {process.env.NEXT_PUBLIC_FEATURE_BTP || 'non défini'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
