import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { Ticket } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 hero-grid">
      <div className="orb w-96 h-96 bg-[var(--brand)] opacity-[0.06] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2.5 mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7b79f0] to-[#5452c8] flex items-center justify-center shadow-[0_0_20px_rgba(109,106,232,0.4)]">
            <Ticket size={17} className="text-white" />
          </div>
          <span className="font-bold text-lg text-white">
            Seat<span className="text-gradient">Scout</span>
          </span>
        </Link>

        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          forceRedirectUrl="/search"
        />
      </div>
    </div>
  );
}
