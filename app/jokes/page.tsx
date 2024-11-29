import { QuoteCard } from "@/components/quote-card"

export default function JokesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">All Jokes</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuoteCard
          quote="May you live every day of your life."
          author="Jonathan Swift"
        />
        <QuoteCard
          quote="Promise Yourself To be so strong that nothing can disturb your peace of mind."
          author="Christian D. Larson"
        />
        <QuoteCard
          quote="Imagining the future is a kind of nostalgia. (...) You spend your whole life stuck in the labyrinth, thinking about how you'll escape it one day."
          author="John Green"
        />
        {/* Add more quotes as needed */}
      </div>
    </div>
  )
}