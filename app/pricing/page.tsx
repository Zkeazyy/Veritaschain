// app/pricing/page.tsx
// Page Pricing avec intégration VTS

'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
// import { VtsBadge } from '@/components/vts';
// import { PriceWithDiscount } from '@/components/vts/PriceWithDiscount';

const plans = [
  {
    name: 'Starter',
    price: 990, // cents
    period: 'par mois',
    features: {
      included: [
        'Ancrage blockchain illimité',
        'Vérification instantanée',
        'Certificat PDF téléchargeable',
        'Interface web complète',
        'Modules RH & Comptabilité',
      ],
      excluded: [
        'API REST',
        'Support prioritaire',
      ],
    },
    popular: false,
  },
  {
    name: 'Pro',
    price: 1990, // cents
    period: 'par mois',
    features: {
      included: [
        'Tout Starter',
        'API REST complète',
        'Support prioritaire',
        'Modules Legal & BTP',
        'Intégration personnalisée',
      ],
      excluded: [],
    },
    popular: true,
  },
  {
    name: 'Business',
    price: null, // sur devis
    period: 'personnalisé',
    features: {
      included: [
        'Tout Pro',
        'Déploiement sur-mesure',
        'SLA 99.9%',
        'Formation équipe',
        'Développements custom',
      ],
      excluded: [],
    },
    popular: false,
  },
];

const faqs = [
  {
    question: 'Que certifie l\'ancrage sur blockchain ?',
    answer: 'L\'ancrage certifie l\'existence d\'un document à un moment donné via son hash SHA-256. Cela prouve l\'intégrité et l\'existence du document sans révéler son contenu.',
  },
  {
    question: 'Ai-je besoin de crypto-monnaies ?',
    answer: 'Non, VeritasChain prend en charge les paiements en euros. Les transactions blockchain sont effectuées par notre infrastructure.',
  },
  {
    question: 'Puis-je payer en euros ?',
    answer: 'Oui, tous nos plans sont facturés en euros via carte bancaire ou virement SEPA. Aucune crypto-monnaie requise.',
  },
  {
    question: 'Quelle est la durée de conservation ?',
    answer: 'L\'ancrage est permanent sur la blockchain (réseau Sepolia/Ethereum). Votre preuve d\'existence est garantie tant que la blockchain existe.',
  },
  {
    question: 'Les réductions VTS sont-elles permanentes ?',
    answer: 'Oui, tant que vous détenez au moins 500 VTS (Veritas Token) dans votre wallet, vous bénéficiez automatiquement de -30% sur votre abonnement.',
  },
];

// Animation variants
const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PricingPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Tarifs et Abonnements
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choisissez le plan adapté à vos besoins. Réduction de -30% avec 500 VTS.
          </p>
        </motion.div>

        {/* VTS Badge - Temporairement désactivé */}
        <div className="flex justify-center">
          {/* <VtsBadge /> */}
          <Alert className="inline-flex items-center space-x-2 max-w-md">
            <HelpCircle className="h-4 w-4" />
            <p className="text-sm">
              Détenez 500+ VTS pour bénéficier de -30% sur tous les plans
            </p>
          </Alert>
        </div>
      </section>

      {/* Plans */}
      <section>
        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={itemVariant}>
              <Card className={`relative h-full transition-shadow hover:shadow-lg ${plan.popular ? 'border-primary border-2' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      Le plus populaire
                    </span>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.price ? (
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{plan.price / 100} €</span>
                        <span className="text-muted-foreground"> / {plan.period}</span>
                        {/* Remplacement par prix normal pour l'instant */}
                        {/* <PriceWithDiscount
                          amountCents={plan.price}
                          currency="EUR"
                          showVtsHint
                        /> */}
                      </div>
                    ) : (
                      <div className="mt-4">
                        <span className="text-2xl font-bold">Sur devis</span>
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                      Inclus
                    </h3>
                    <ul className="space-y-3">
                      {plan.features.included.map((feature) => (
                        <li key={feature} className="flex items-start space-x-2">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                      {plan.features.excluded.map((feature) => (
                        <li key={feature} className="flex items-start space-x-2 text-muted-foreground">
                          <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* CTA */}
                  <Button
                    asChild
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {plan.price ? (
                      <Link href="/anchor">
                        Démarrer maintenant
                      </Link>
                    ) : (
                      <Link href="mailto:contact@veritaschain.fr">
                        Nous contacter
                      </Link>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-2">Questions Fréquentes</h2>
          <p className="text-muted-foreground">Tout ce que vous devez savoir sur VeritasChain</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 bg-muted/50 rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold">Prêt à commencer ?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Essayez gratuitement l'ancrage et la vérification de vos documents
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/anchor">
              Démarrer maintenant
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
