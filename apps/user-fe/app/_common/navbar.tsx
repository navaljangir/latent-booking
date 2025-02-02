"use client";
import Link from "next/link";
import { NavLogo } from "../assets";
import Image from "next/image";
import { figtree, manrope } from "../lib/fonts";
import { cn } from "@repo/ui/utils";
import { usePathname, useRouter } from "next/navigation";
import { LoginDialog } from "../_components/signup/singupDialog";
import { Button } from "@repo/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { IDispatchType, IRootType } from "../lib/redux/store";
import { setIsLoginOpen, setIsSignup } from "../lib/redux/signInDialog";
import { logout } from "../lib/actions/getUser";
import { logoutState } from "../lib/redux/authSlice";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch<IDispatchType>()
  const isAuthorized = useSelector((state: IRootType) => state.auth.isAuthorized);
  const isLoading = useSelector((state: IRootType) => state.auth.isLoading);
  const router = useRouter()

  //Handle Logout
  const handleLogout =async()=>{
    try{
      await logout()
      dispatch(logoutState())
      router.push('/')
    }catch(e){
      toast.error('Cannot logout')
    }
  }
  return (
    <nav className="w-full bg-black">
      <div className="max-w-[1440px] mx-auto h-24 px-6 lg:px-24 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Image
            src={NavLogo}
            alt="India's Got Latent"
            width={48}
            height={48}
            className="object-contain"
          />
        </Link>

        <div className="flex items-center gap-12">
          <Link
            href="/"
            className={cn(
              pathname === "/"
                ? "text-[#F8D48D] font-medium"
                : "text-neutral-400 hover:text-neutral-200",
              "transition-colors",
              manrope.className
            )}
          >
            Home
          </Link>
          <Link
            href="/episodes"
            className={cn(
              pathname === "/episodes"
                ? "text-[#F8D48D] font-medium"
                : "text-neutral-400 hover:text-neutral-200",
              "transition-colors",
              manrope.className
            )}
          >
            Episodes
          </Link>
          <Link
            href="/stars-of-latent"
            className={cn(
              pathname === "/stars-of-latent"
                ? "text-[#F8D48D] font-medium"
                : "text-neutral-400 hover:text-neutral-200",
              "transition-colors",
              manrope.className
            )}
          >
            Stars Of Latent
          </Link>
        </div>

        {!isLoading ? (
          <div>
            {!isAuthorized ? (
              <div className="space-x-2">
                <Button
                  onClick={() => {
                    dispatch(setIsSignup(false));
                    dispatch(setIsLoginOpen(true))
                  }}
                  className={cn(
                    "px-6 py-2 bg-gradient-to-r from-[#aa823d] via-[#efe188] to-[#d1b759]",
                    "rounded-lg text-neutral-950 font-semibold hover:opacity-90 transition-opacity",
                    figtree.className
                  )}
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    dispatch(setIsLoginOpen(true));
                    dispatch(setIsSignup(true));
                  }}
                  className={cn(
                    "px-6 py-2 bg-gradient-to-r from-[#aa823d] via-[#efe188] to-[#d1b759]",
                    "rounded-lg text-neutral-950 font-semibold hover:opacity-90 transition-opacity",
                    figtree.className
                  )}
                >
                  Signup
                </Button>
              </div>
            ) : (
              // Logout Button
              <Button
                className={cn(
                  "px-6 py-2 bg-gradient-to-r from-[#aa823d] via-[#efe188] to-[#d1b759]",
                  "rounded-lg text-neutral-950 font-semibold hover:opacity-90 transition-opacity",
                  figtree.className
                )}
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
        ) : (
          <div />
        )}

        <LoginDialog/>
      </div>
    </nav>
  );
}