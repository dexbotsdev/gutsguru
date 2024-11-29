import { Card, CardContent } from "@/components/ui/card"

interface JokeDisplayProps {
  joke: string | null;
  isLoading: boolean;
}

export function JokeDisplay({ joke, isLoading }: JokeDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Generating a joke...</p>
        </CardContent>
      </Card>
    );
  }

  if (!joke) return null;

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <blockquote className="text-lg font-medium leading-relaxed">
          {joke}
        </blockquote>
      </CardContent>
    </Card>
  );
}

