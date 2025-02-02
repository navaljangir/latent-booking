import { Dialog, DialogContent } from "@repo/ui/dialog";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import Image from "next/image";
import { cn } from "@repo/ui/utils";
import { figtree, manrope } from "../../lib/fonts";
import { useEffect, useRef } from "react";
import { MaheepSingh } from "../../assets";
import { OtpDialog } from "./otp-dialog";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { IDispatchType, IRootType } from "../../lib/redux/store";
import { matchRegex } from "../../lib/regexPhone";
import { toast } from "sonner";
import { signIn, signUp } from "../../lib/loginRoutes/user";
import { setIsLoginOpen, setIsProcessing, setIsSignup, setShowOtp } from "../../lib/redux/signInDialog";



export function LoginDialog() {
  const signInDialog = useSelector((state : IRootType)=> state.signInDialog)
  const dispatch = useDispatch<IDispatchType>()
  const isOpen = signInDialog.isLoginOpen
  const showOtp = signInDialog.showOtp
  const isSignup = signInDialog.isSignup
  const isProcessing = signInDialog.isProcessing
  const phone = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);

  //onClose
  const onClose=() => {
    dispatch(setIsLoginOpen(false))
  }
  // Handle closing both dialogs
  const handleClose = () => {
    dispatch(setShowOtp(false))
    onClose();
  };

  const onSignupClose = ()=>{
    dispatch(setIsSignup(!isSignup))
  }

  // Handle next button click
  const handleNextClick = async () => {
    const phoneValue = phone.current?.value || '';
    const nameValue = name.current?.value || '';
    //setting isLoading to true
    dispatch(setIsProcessing())
    if (!matchRegex(phone.current?.value || '')) {
      toast.error('Enter a valid phone', {
        duration: 2000,
        className: 'text-red-500'
      })
      dispatch(setIsProcessing())
      return
    }
    let res;
      if(isSignup) {
          res = await signUp(phone.current?.value|| '')
      }else{
          res = await signIn(phoneValue)
      }
    if(res.success) {
      //Reset the enteries
      toast.success(res.message, {
        duration: 2000,
          className: 'text-green-500'
        })
        dispatch(setShowOtp(true));
    } else {
        toast.error(res.message, {
          duration: 2000,
          className: 'text-red-500'
        })
      }
      //setting isLoading to false
      dispatch(setIsProcessing())
    };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleNextClick()
    }
  }
  return (
    <>
      <Dialog open={isOpen && !showOtp} onOpenChange={handleClose}>
        <DialogContent className="max-w-[480px] bg-[#1A1A1A] p-12 border-[#f8d48d] border-opacity-25 border-2 py-3 rounded-[32px]">
          <div className="flex flex-col items-center pt-10 pb-8">
            {/* Maheep Singh Image with Speech Bubble */}
            <div className="relative mb-8">
              <div className="w-[216px] h-[216px] rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#fdffe0] via-[#f7ca7f] to-[#f4b45a] rounded-full" />
                <Image
                  src={MaheepSingh}
                  alt="Maheep Singh"
                  width={240}
                  height={240}
                  className="object-cover relative z-10 rounded-full top-4"
                  priority
                />
              </div>
              {/* Speech Bubble */}
              <div className="absolute -right-10 top-8 bg-white text-black px-3 py-1 rounded-xl text-sm font-medium -rotate-6">
                Likho 98..
              </div>
            </div>

            {/* Text */}
            <div className="mb-8">
              <h2 className={cn("text-white text-2xl mb-1", figtree.className)}>
                Enter your phone number or email,{" "}
                <span className="text-neutral-400 text-2xl">
                  we promise no spam.
                </span>
              </h2>
            </div>

            {/* Input Field */}
            {isSignup && (
        <Input
          type="text"
          placeholder="Name"
          className="w-full h-14 bg-transparent border border-[#333333] outline-none rounded-xl px-5 py-6 text-white mb-4 focus:outline-none focus:border-[#F8D48D] placeholder-neutral-400"
          ref={name}
        />
      )}

      {/* Phone Input */}
      <Input
        type="text"
        placeholder="98"
        className="w-full h-14 bg-transparent border border-[#333333] outline-none rounded-xl px-5 py-6 text-white mb-4 focus:outline-none focus:border-[#F8D48D] placeholder-neutral-400"
        onKeyDown={handleKeyDown}
        ref={phone}
      />

            {/* Buttons with Separator */}
            <div className="w-full space-y-3">
              <button
                onClick={handleNextClick}
                className="w-full h-14 bg-[#F4F4F4] text-black font-medium py-4 rounded-xl hover:bg-white transition-colors text-lg"
              disabled={isProcessing}
              >
                Next
              </button>

              <div className="w-full h-[1px] bg-[#333333]" />

              <button className="w-full h-14 bg-[#F4F4F4] text-black font-medium py-4 rounded-xl hover:bg-white transition-colors text-lg">
                Continue with Google
              </button>
            </div>
            {isSignup && <Button className="text-[#F8D48D] mt-4 hover:underline bg-transparent hover:bg-transparent"
              onClick={onSignupClose}
            >
              Already Have a Account? Login
            </Button>}
            {!isSignup && <Button className="text-[#F8D48D] mt-4 hover:underline bg-transparent hover:bg-transparent"
              onClick={onSignupClose}
            >
              Don't Have a Account? Signup
            </Button>}
            {/* Terms Text */}
            <div
              className={cn(
                "text-neutral-400 text-sm mt-6 text-center flex flex-col gap-1",
                manrope.className
              )}
            >
              <p>By starting the onboarding you agree to the</p>
              <p>
                <Link
                  href="/terms"
                  className="text-white hover:underline underline"
                >
                  Terms of service
                </Link>{" "}
                &{" "}
                <Link href="/privacy" className="text-white underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <OtpDialog number={phone.current?.value || ''} name={name.current?.value || ''} />
    </>
  );
}

// Usage in your component: