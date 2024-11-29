import Link from "next/link"
import { Button } from "./ui/button"
import { ModeToggle } from "./mode-toggle"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold">GutsGuru AI</span>
            <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">Beta</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6"> 
            <Link href="/symptoms" className="text-sm font-medium hover:text-primary">
              Symptoms Check AI
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          
        </div>
      </div>
    </header>
  )
}