import Link from "next/link";
import { ArrowRight, Shield, FileText, Search, Zap, Lock, Globe, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Comment ça marche ?</h1>
        <p className="text-xl text-muted-foreground">
          Comprenez le fonctionnement de VeritasChain et la technologie blockchain derrière l'ancrage de documents
        </p>
      </div>

      {/* Principe */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Le Principe</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>SHA-256</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Chaque fichier génère un hash unique de 64 caractères hexadécimaux. 
                Le moindre changement dans le fichier modifie complètement le hash.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Ancrage Blockchain</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Le hash est enregistré sur la blockchain Ethereum (réseau Sepolia) 
                avec un horodatage et l'adresse de l'auteur.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Search className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Vérification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Toute personne peut vérifier l'authenticité en recalculant le hash 
                du fichier et en le comparant avec celui stocké sur la blockchain.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Immuabilité</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Une fois ancré, le hash ne peut plus être modifié. 
                C'est une preuve d'existence permanente et vérifiable.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Étapes utilisateur */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Étapes Utilisateur</h2>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <CardTitle>Préparation du fichier</CardTitle>
                  <CardDescription>
                    Sélectionnez votre document (PDF, DOCX, PNG) via l'interface de téléchargement
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  <strong>Important :</strong> Le fichier reste sur votre ordinateur. 
                  Seul le hash SHA-256 est calculé et envoyé.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <CardTitle>Connexion MetaMask</CardTitle>
                  <CardDescription>
                    Connectez votre wallet MetaMask au réseau Sepolia pour signer la transaction
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  <strong>Coût :</strong> Une petite quantité d'ETH de test est nécessaire pour payer les frais de transaction.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <CardTitle>Ancrage et certificat</CardTitle>
                  <CardDescription>
                    Signez la transaction, attendez la confirmation, puis téléchargez votre certificat PDF
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  <strong>Certificat :</strong> Le PDF contient toutes les informations nécessaires 
                  pour vérifier l'authenticité, y compris un QR code.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Confidentialité */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Confidentialité</h2>
        <Card>
          <CardHeader>
            <Lock className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Aucun fichier stocké</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription>
              VeritasChain respecte votre vie privée. Voici ce qui se passe avec vos données :
            </CardDescription>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <span className="text-green-600">✓</span>
                <span>Le hash SHA-256 est calculé localement dans votre navigateur</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600">✓</span>
                <span>Seul le hash (64 caractères) est envoyé à la blockchain</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600">✓</span>
                <span>Votre fichier original ne quitte jamais votre ordinateur</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600">✓</span>
                <span>Aucune donnée personnelle n'est collectée ou stockée</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Réseau et contrat */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Réseau et Contrat</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Globe className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Réseau Sepolia</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                VeritasChain utilise le réseau de test Ethereum Sepolia (Chain ID: 11155111).
                C'est gratuit et parfait pour tester la technologie.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Contrat Intelligent</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Adresse du contrat : <code className="bg-muted px-2 py-1 rounded text-xs">
                  0x7b7C41cf5bc986F406c7067De6e69f200c27D63f
                </code>
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 bg-muted/50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold">Prêt à essayer ?</h2>
        <p className="text-muted-foreground">
          Testez VeritasChain avec vos propres documents
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
    </div>
  );
}
