'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"  
import { Header } from '@/components/header'
import { JokeCard } from '@/components/JokeCard'
import { JokeDisplay } from '@/components/JokeDisplay'

export default function Home() {
  const [joke, setJoke] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateJoke = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-joke', { method: 'POST' });
      const data = await response.json();
      if (data.joke) {
        setJoke(data.joke);
      } else {
        console.error('Failed to generate joke');
      }
    } catch (error) {
      console.error('Error generating joke:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background"> 
      <main className="container max-w-screen-2xl py-6 space-y-8">
        <div className="space-y-4"> 
          <Button 
            size="lg" 
            className="w-full bg-white text-black hover:bg-white/90"
            onClick={generateJoke}
            disabled={isLoading}
          >
            {isLoading ? 'Generating Joke...' : 'Generate Fart Joke'}
          </Button>
          <JokeDisplay joke={joke} isLoading={isLoading} />
        </div>

        <div className="grid gap-6">
          <JokeCard 
            featured
            joke="Why don't scientists trust atoms?"
            punchline="Because they make up everything, even farts!"
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <JokeCard 
              joke="What do you call a fart in a lift?"
              punchline="A rising smell!"
            />
            <JokeCard 
              joke="Why did the toilet paper roll down the hill?"
              punchline="To get to the bottom! (Where all the farts are)"
            />
            <JokeCard 
              joke="What do you call a person who doesn't fart in public?"
              punchline="A private tutor!"
            />
            <JokeCard 
              joke="Why did the fart go to the bank?"
              punchline="To get some gas money!"
            />
            <JokeCard 
              joke="What do you call a fart from a duck?"
              punchline="A quack!"
            />
            <JokeCard 
              joke="Why was the fart detained at customs?"
              punchline="It was a silent but deadly weapon!"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

