'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, FileText, Search, Zap, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MODULE_CONFIGS } from "@/lib/feature-flags";

// Force le rechargement dynamique sur Vercel
export const dynamic = 'force-dynamic';

export default function HomePage() {
  // Filtrer les modules selon les feature flags
  const enabledModules = Object.entries(MODULE_CONFIGS)
    .filter(([key, config]) => config.enabled)
    .map(([key, config]) => ({
      key,
      ...config,
      href: config.routes[0], // Première route du module
    }));
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Vérifiez et certifiez vos documents sur la blockchain
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Pour les secteurs BTP, RH, Juridique et Comptabilité
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/anchor">
              Essayer l'ancrage
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/pricing">
              Voir les tarifs
            </Link>
          </Button>
        </div>
      </motion.section>

      {/* Confiance - Bandeau de logos */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-8 border-b"
      >
        <p className="text-sm text-center text-muted-foreground mb-6">
          Solutions de confiance pour les entreprises
        </p>
        <div className="flex items-center justify-center gap-8 opacity-60">
          <div className="h-12 w-32 bg-muted rounded" />
          <div className="h-12 w-32 bg-muted rounded" />
          <div className="h-12 w-32 bg-muted rounded" />
        </div>
      </motion.section>

      {/* 3 Piliers de Valeur */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h2 className="text-3xl font-bold text-center">Nos Piliers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Preuve Immuable</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Une fois ancré sur la blockchain, votre document ne peut plus être modifié ou supprimé. Garantie d'intégrité permanente.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Traçabilité</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Suivez l'historique complet de vos documents ancrés avec horodatage précis et origine vérifiable.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Search className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Audit Instantané</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Vérifiez l'authenticité en quelques clics. Pas besoin de blockchain, juste votre fichier et le hash.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Modules spécialisés */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Modules Spécialisés</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Des interfaces adaptées à chaque secteur d'activité pour un ancrage optimisé
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {enabledModules.map((module) => (
            <Card key={module.key} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-2">{module.icon}</div>
                <CardTitle>{module.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {module.description}
                </CardDescription>
                <Button asChild variant="outline" className="w-full">
                  <Link href={module.href}>Accéder au module</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h2 className="text-3xl font-bold text-center">Comment ça marche ?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">
                  1
                </div>
                <CardTitle>Uploadez votre fichier</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sélectionnez votre document (PDF, DOCX, PNG). Le hash SHA-256 est calculé localement dans votre navigateur.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">
                  2
                </div>
                <CardTitle>Ancrez sur la blockchain</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Signez la transaction pour ancrer le hash sur <Link href="/verify" className="underline">la blockchain Ethereum</Link>. Confirmation en quelques secondes.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">
                  3
                </div>
                <CardTitle>Vérifiez l'authenticité</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Téléchargez le <Link href="/verify" className="underline">certificat PDF</Link> ou vérifiez en ligne l'authenticité du document à tout moment.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Section VTS */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 bg-primary/5 rounded-2xl p-8"
      >
        <div className="flex items-center justify-center space-x-2 mb-4">
          {/* <VtsBadge /> */}
          <Users className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Réduction VTS de -30%</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Détenez 500+ VTS (Veritas Token) pour bénéficier automatiquement de <strong>-30%</strong> sur tous les abonnements.
        </p>
        <Button asChild variant="outline" size="lg">
          <Link href="/pricing">
            Voir les tarifs avec réduction
          </Link>
        </Button>
      </motion.section>

      {/* CTA Final */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 bg-muted/50 rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold">Commencer gratuitement</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Essayez l'ancrage et la vérification sans engagement
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/anchor">
              Ancrer votre premier document
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/docs">
              En savoir plus
            </Link>
          </Button>
        </div>
      </motion.section>
    </div>
  );
}