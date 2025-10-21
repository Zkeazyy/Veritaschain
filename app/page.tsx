import Link from "next/link";
import { ArrowRight, Shield, FileText, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          VeritasChain
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Ancrez vos documents sur la blockchain Ethereum pour une preuve d'existence immuable et vérifiable
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/anchor">
              Ancrer un document
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/verify">
              Vérifier un document
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Pourquoi VeritasChain ?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Immuable</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Une fois ancré sur la blockchain, votre document ne peut plus être modifié ou supprimé
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Confidentiel</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Seul le hash SHA-256 est stocké. Votre fichier reste privé et local
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Search className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Vérifiable</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Toute personne peut vérifier l'authenticité en comparant les hash
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Rapide</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Ancrage instantané sur le réseau Sepolia avec confirmation en quelques secondes
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Comment ça marche ?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">
                1
              </div>
              <CardTitle>Uploadez votre fichier</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Sélectionnez votre document (PDF, DOCX, PNG). Le hash SHA-256 est calculé localement
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">
                2
              </div>
              <CardTitle>Ancrez sur la blockchain</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connectez MetaMask et signez la transaction pour ancrer le hash sur Sepolia
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">
                3
              </div>
              <CardTitle>Vérifiez l'authenticité</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Téléchargez le certificat PDF et vérifiez à tout moment l'authenticité du document
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 bg-muted/50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold">Prêt à commencer ?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Rejoignez les utilisateurs qui font confiance à VeritasChain pour sécuriser leurs documents
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
      </section>
    </div>
  );
}