import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle, Clock, FileText, BarChart3, Shield, Zap, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Features
              </Link>
              <Link href="#benefits" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Benefits
              </Link>
              <Link href="#testimonials" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Testimonials
              </Link>
            </nav>
            <LoginModal>
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </LoginModal>
            <LoginModal>
              <Button size="sm">Get Started</Button>
            </LoginModal>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 w-fit">
                  AI-Powered Court Solutions
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Transform Court Motion Processing with AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Reduce processing time by 80% and eliminate backlogs with MotionFlow's intelligent document intake
                    and compliance review system.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <LoginModal>
                    <Button size="lg" className="gap-1.5">
                      Start Free Trial
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </LoginModal>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#demo">Watch Demo</Link>
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>14-day free trial</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[450px] w-full overflow-hidden rounded-xl bg-muted/50 p-4 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl"></div>
                  <div className="relative flex h-full flex-col rounded-lg border bg-background p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-4 w-32 rounded-full bg-muted"></div>
                        <div className="h-3 w-24 rounded-full bg-muted"></div>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4">
                      <div className="h-24 rounded-lg border bg-muted/50 p-4 relative overflow-hidden">
                        <div className="h-4 w-3/4 rounded-full bg-muted"></div>
                        <div className="mt-2 h-3 w-1/2 rounded-full bg-muted"></div>
                        <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Processed
                        </div>
                      </div>
                      <div className="h-24 rounded-lg border bg-muted/50 p-4 relative overflow-hidden">
                        <div className="h-4 w-3/4 rounded-full bg-muted"></div>
                        <div className="mt-2 h-3 w-1/2 rounded-full bg-muted"></div>
                        <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                          In Review
                        </div>
                      </div>
                      <div className="h-24 rounded-lg border bg-muted/50 p-4 relative overflow-hidden">
                        <div className="h-4 w-3/4 rounded-full bg-muted"></div>
                        <div className="mt-2 h-3 w-1/2 rounded-full bg-muted"></div>
                        <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          New
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">5 motions processed today</div>
                      <Button size="sm" variant="ghost" className="gap-1">
                        View All <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 border-y bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg bg-background p-4 shadow-sm">
                <div className="text-3xl font-bold">80%</div>
                <p className="text-sm text-center text-muted-foreground">Reduction in processing time</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg bg-background p-4 shadow-sm">
                <div className="text-3xl font-bold">75%</div>
                <p className="text-sm text-center text-muted-foreground">Decrease in compliance errors</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg bg-background p-4 shadow-sm">
                <div className="text-3xl font-bold">90%</div>
                <p className="text-sm text-center text-muted-foreground">Staff satisfaction rate</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg bg-background p-4 shadow-sm">
                <div className="text-3xl font-bold">50+</div>
                <p className="text-sm text-center text-muted-foreground">County courts using MotionFlow</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Streamline Your Court's Workflow
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  MotionFlow combines AI-powered document processing with intuitive workflows designed specifically for
                  court clerks.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">AI Document Intake</h3>
                  <p className="text-muted-foreground">
                    Upload documents via drag-and-drop or mobile camera and let AI extract key information with up to
                    85% accuracy.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Automated Compliance</h3>
                  <p className="text-muted-foreground">
                    Automatically validate motions against court rules and flag issues before they reach a judge's desk.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Batch Processing</h3>
                  <p className="text-muted-foreground">
                    Review and process multiple motions simultaneously with our intuitive dashboard designed for
                    efficiency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                    Why MotionFlow
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Designed for Court Efficiency</h2>
                  <p className="text-muted-foreground md:text-lg">
                    MotionFlow was built from the ground up to address the specific challenges faced by county courts
                    processing thousands of eviction motions monthly.
                  </p>
                </div>
                <div className="mt-8 grid gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">Save Valuable Time</h3>
                      <p className="text-sm text-muted-foreground">
                        Reduce motion intake time by 80% and review time by 50% with AI-powered automation.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">Eliminate Backlogs</h3>
                      <p className="text-sm text-muted-foreground">
                        Process more motions in less time, reducing case backlogs and improving court efficiency.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">Improve Accuracy</h3>
                      <p className="text-sm text-muted-foreground">
                        Reduce human error with AI validation that catches compliance issues before they become
                        problems.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden border shadow-lg">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="MotionFlow Dashboard"
                  width={800}
                  height={600}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-medium mb-2">Intuitive Motion Dashboard</h3>
                    <p className="text-sm opacity-90">Designed with input from court clerks for maximum efficiency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Trusted by Court Administrators</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-lg">
                  See what court clerks and administrators are saying about MotionFlow
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="#FFD700"
                        stroke="#FFD700"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="italic text-muted-foreground">
                    "MotionFlow has completely transformed how we handle eviction motions. What used to take hours now
                    takes minutes, and our backlog has been eliminated. The AI is remarkably accurate."
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted h-10 w-10"></div>
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Court Clerk, DeKalb County</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="#FFD700"
                        stroke="#FFD700"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="italic text-muted-foreground">
                    "The compliance checking feature alone has saved us countless hours of back-and-forth with
                    attorneys. MotionFlow catches issues before they become problems, making everyone's job easier."
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted h-10 w-10"></div>
                  <div>
                    <p className="font-medium">Michael Rodriguez</p>
                    <p className="text-sm text-muted-foreground">Court Administrator, Fulton County</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Transform Your Court's Workflow?
                </h2>
                <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join the growing number of courts using MotionFlow to streamline motion processing.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <LoginModal>
                  <Button size="lg" variant="secondary" className="gap-1.5">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </LoginModal>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
                  asChild
                >
                  <Link href="#demo">Schedule Demo</Link>
                </Button>
              </div>
              <p className="text-sm text-primary-foreground/80">No credit card required. 14-day free trial.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
          <div className="flex flex-col gap-4 md:gap-2 md:flex-1">
            <Link href="/">
              <Logo size="sm" variant="simple" />
            </Link>
            <p className="text-sm text-muted-foreground">AI-powered court motion processing system</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:flex-1">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="text-muted-foreground hover:text-foreground">
                    Benefits
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container py-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MotionFlow. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

