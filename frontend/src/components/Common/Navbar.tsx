import { Link as RouterLink } from "@tanstack/react-router"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"

const navItems = [
	{ label: "Features", href: "#features" },
	{ label: "How it Works", href: "#how-it-works" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "Testimonials", href: "#testimonials" },
]

export function Navbar() {
	return (
		<header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<img src="/assets/images/logo.png" alt="Logo" className="h-12 w-auto" />

				<nav className="hidden items-center gap-6 md:flex">
					{navItems.map((item) => (
						<a
							key={item.label}
							href={item.href}
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							{item.label}
						</a>
					))}
				</nav>

				<div className="hidden items-center gap-3 md:flex">
					<Button variant="ghost" asChild>
						<RouterLink to="/login">Sign In</RouterLink>
					</Button>
					<Button asChild>
						<RouterLink to="/signup">Get Started</RouterLink>
					</Button>
				</div>

				<Button variant="ghost" size="icon" className="md:hidden" asChild>
					<a href="#menu" aria-label="Open menu">
						<Menu className="size-5" />
					</a>
				</Button>
			</div>
		</header>
	)
}

export default Navbar
