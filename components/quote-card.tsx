interface QuoteCardProps {
    quote: string
    author: string
    source?: string
    featured?: boolean
  }
  
  export function QuoteCard({ quote, author, source, featured = false }: QuoteCardProps) {
    return (
      <div className={`p-6 rounded-lg bg-card ${featured ? 'col-span-full' : ''}`}>
        <blockquote className={`${featured ? 'text-2xl' : 'text-lg'} font-medium mb-4`}>
          "{quote}"
        </blockquote>
        <footer className="text-sm text-muted-foreground">
          — {author}
          {source && <span>, {source}</span>}
        </footer>
      </div>
    )
  }