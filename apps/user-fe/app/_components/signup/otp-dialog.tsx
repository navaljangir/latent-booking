import { Dialog, DialogContent, DialogTitle } from "@repo/ui/dialog";
import Image from "next/image";
import { cn } from "@repo/ui/utils";
import { manrope } from "../../lib/fonts";
import { OtpGirl } from "../../assets";
import { useRef } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@repo/ui/otp-input";
import { useDispatch, useSelector } from "react-redux";
import { IDispatchType, IRootType } from "../../lib/redux/store";
import { signInVerify, signUpVerify } from "../../lib/redux/authSlice";
import { toast } from "sonner";
import { setIsLoginOpen, setIsProcessing, setShowOtp } from "../../lib/redux/signInDialog";

interface OtpDialogProps {
  name?: string
  number: string
}

// app/_components/auth/otp-dialog.tsx

export function OtpDialog({ name, number }: OtpDialogProps) {
  const otp = useRef('')
  const otpInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<IDispatchType>()
  const signInDialog = useSelector((state: IRootType) => state.signInDialog)
  const isOpen = signInDialog.showOtp
  const isSignup = signInDialog.isSignup
  const isProcessing = signInDialog.isProcessing
  // onClose
  const onClose = () => {
    dispatch(setShowOtp(false))
  }
  // Close on after successfull signin or signup
  const onSubmitClose = () => {
    dispatch(setShowOtp(false))
    dispatch(setIsLoginOpen(false))
  }
  //Handle submit
  const handleSubmit = async () => {
    dispatch(setIsProcessing())

    //Checks otp size
    if (otp.current.length < 4) {
      toast.error('Enter a valid otp', {
        duration: 2000,
        className: 'text-red-500'
      })
      dispatch(setIsProcessing())
      return
    }

    //If otp of length 4
    let res;
    if (name && isSignup) {
      res = await dispatch(signUpVerify({ name, number, totp: otp.current }))
    } else {
      res = await dispatch(signInVerify({ number, totp: otp.current }))
    }
    if (res.meta.requestStatus === 'rejected') {
      toast.error(res.payload, {
        duration: 2000,
        className: 'text-red-500'
      })
    } else {
      toast.success(res.payload.message, {
        duration: 2000,
        className: 'text-green-500'
      })
      onSubmitClose()
    }
    dispatch(setIsProcessing())
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[480px] bg-[#1A1A1A] p-12 border-[#f8d48d] border-opacity-25 border-2 rounded-[32px]">
        <div className="flex flex-col items-center pt-10 pb-8">
          {/* Back Button */}
          <button
            onClick={onClose}
            className="self-start text-white mb-6 hover:text-neutral-400 transition-colors"
          >
            ← Back
          </button>

          {/* Image Container with Speech Bubble */}
          <div className="relative mb-8">
            {/* Speech Bubble */}
            <div className="absolute top-44 left-1/2 -translate-x-1/3 bg-white text-neutral-950 px-4 py-2 rounded-3xl font-medium text-base whitespace-nowrap z-20">
              Kahin to consent le raha hai
            </div>

            <div className="w-[216px] h-[216px] rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#fdffe0] via-[#f7ca7f] to-[#f4b45a] rounded-full" />
              <Image
                src={OtpGirl}
                alt="OTP Girl"
                width={240}
                height={240}
                className="object-cover relative z-10 rounded-full top-4"
                priority
              />
            </div>
          </div>

          {/* Resend Link */}
          <div className="mb-2">
            <h2 className={cn("text-white text-2xl", manrope.className)}>
              Enter your OTP.{" "}
              <span>
                <button className="text-neutral-400 text-2xl underline mb-6">
                  Resend?
                </button>
              </span>
            </h2>
          </div>

          {/* OTP Input Fields */}
          <div className="flex mb-6">
            <InputOTP maxLength={4} className="" onChange={(e) => { otp.current = e }}>
              <InputOTPGroup className="space-x-2">
                {[...Array(4)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="text-white text-xl h-14"
                    autoFocus={index === 0}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Verify Button */}
          <button
            className="w-full h-14 bg-[#F4F4F4] text-black font-medium py-4 rounded-xl hover:bg-white transition-colors text-lg"
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            Verify
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}