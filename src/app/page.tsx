import { SignIn, SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default async function Home() {
  // CRITICAL: Always validate user authentication first
  const { userId } = await auth();
  
  // Redirect authenticated users to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  // Show authentication UI for unauthenticated users
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-foreground">
            Flashy Cardy
          </h1>
          <h2 className="text-2xl text-muted-foreground">
            Your personal flashcard platform
          </h2>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </DialogTrigger>
            <DialogContent>
              <VisuallyHidden>
                <DialogTitle>Sign In</DialogTitle>
              </VisuallyHidden>
              <SignIn 
                routing="hash"
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/dashboard"
              />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="lg">
                Sign Up
              </Button>
            </DialogTrigger>
            <DialogContent>
              <VisuallyHidden>
                <DialogTitle>Sign Up</DialogTitle>
              </VisuallyHidden>
              <SignUp 
                routing="hash"
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/dashboard"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
