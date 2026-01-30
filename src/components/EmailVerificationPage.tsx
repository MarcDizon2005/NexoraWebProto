import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft } from "lucide-react";

interface EmailVerificationPageProps {
  email: string;
  onBack: () => void;
  onVerify: (code: string) => void;
}

export function EmailVerificationPage({ email, onBack, onVerify }: EmailVerificationPageProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newCode = [...code];
      pastedData.split('').forEach((digit, i) => {
        if (i < 6) newCode[i] = digit;
      });
      setCode(newCode);
      
      // Focus the last filled input or the next empty one
      const nextEmptyIndex = newCode.findIndex(c => !c);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const isCodeComplete = code.every(digit => digit !== "");

  const handleVerify = () => {
    if (isCodeComplete) {
      onVerify(code.join(""));
    }
  };

  const handleResend = () => {
    setResendTimer(60);
    // Here you would trigger the resend logic
    console.log("Resending verification code...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dc2626] via-[#991b1b] to-[#374151] flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            We've sent a 6-digit code to
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-center block">Enter Verification Code</Label>
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <Button
            className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white"
            disabled={!isCodeComplete}
            onClick={handleVerify}
          >
            Verify
          </Button>

          <div className="text-center text-sm space-y-2">
            <p className="text-muted-foreground">Didn't receive the code?</p>
            {resendTimer > 0 ? (
              <p className="text-muted-foreground">
                Resend code in {resendTimer}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-[#dc2626] hover:underline"
              >
                Resend code
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
