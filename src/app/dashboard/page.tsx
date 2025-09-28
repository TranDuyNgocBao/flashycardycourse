import { auth } from "@clerk/nextjs/server";
import { getUserDecksWithCardCount } from "@/db/queries/deck-queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import Link from "next/link";

export default async function Dashboard() {
  const { userId } = await auth();
  
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get user's decks with card counts using query helper
  const decksWithCardCount = await getUserDecksWithCardCount(userId);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your flashcard decks and track your learning progress
          </p>
        </div>

        {decksWithCardCount.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-2xl font-semibold">
                No decks yet
              </h2>
              <p className="text-muted-foreground">
                Create your first flashcard deck to get started
              </p>
              <Button asChild>
                <Link href="/decks/new">Create Your First Deck</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {decksWithCardCount.map((deck) => (
              <Card key={deck.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {deck.title}
                  </CardTitle>
                  {deck.description && (
                    <CardDescription>
                      {deck.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{deck.cardCount} cards</span>
                    <span>
                      Created {new Date(deck.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/decks/${deck.id}`}>Study</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/decks/${deck.id}/edit`}>Edit</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button asChild>
            <Link href="/decks/new">Create New Deck</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
