import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface JokeCardProps {
  joke: string
  punchline?: string
  featured?: boolean
}

export function JokeCard({ joke, punchline, featured = false }: JokeCardProps) {
  return (
    <Card className={`${featured ? 'col-span-full' : ''}`}>
      <CardContent className={`p-6 ${featured ? 'space-y-4' : 'space-y-2'}`}>
        <p className={`${featured ? 'text-2xl md:text-3xl' : 'text-lg'} font-medium leading-relaxed`}>
          {joke}
        </p>
        {punchline && (
          <p className="text-lg font-medium text-muted-foreground mt-2">
            {punchline}
          </p>
        )}
        {featured && (
          <p className="text-sm text-muted-foreground">Today's Featured Joke</p>
        )}
      </CardContent>
      {!featured && (
        <CardFooter className="px-6 pb-4">
          <p className="text-sm text-muted-foreground">Laugh responsibly!</p>
        </CardFooter>
      )}
    </Card>
  )
}

