"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import GoogleLogo from "@/public/google.svg";
import { useRouter } from "next/navigation";

interface iAppProps {
  text: string;
  icon?: React.ReactNode; 
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  redirectUrl?: string;
  className?: string;
  handleClickFunction?: () => void;
}

export function SubmitButton({ text, icon, variant, redirectUrl, className, handleClickFunction}: iAppProps) {
  const { pending } = useFormStatus();

  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (redirectUrl) {
      e.preventDefault();
      router.push(redirectUrl);
    }
  };

  return (
    <>
      {pending && !redirectUrl ? (
        <Button disabled variant="outline" className={cn("w-fit", className)}>
          <Loader2 className="size-4 mr-2 animate-spin" /> Attendere
        </Button>
      ) : (
        <Button
          variant={variant}
          type="submit"
          className={cn("w-fit", className)}
          onClick={handleClickFunction||handleClick}
        >
          {icon}{text}
        </Button>
      )}
    </>
  );
}

// export function FacebookAuthButton(action?: string) {
//   const { pending } = useFormStatus();
//   return (
//     <>
//       {pending ? (
//         <Button variant="outline" className="w-full" disabled>
//           <Loader2 className="size-4 mr-2 animate-spin" /> Please wait
//         </Button>
//       ) : (
//         <Button variant="outline" className="w-full">
//           <Image
//             src={FacebookLogo}
//             className="size-4 mr-2 dark:invert"
//             alt="Google Logo"
//           />
//           {action + " con Google"}
//         </Button>
//       )}
//     </>
//   );
// }

export function GoogleAuthButton({action}: {action:string}) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button variant="outline" className="w-full" disabled>
          <Loader2 className="size-4 mr-2 animate-spin" /> Attendere
        </Button>
      ) : (
        <Button variant="outline" className="w-full">
          <Image src={GoogleLogo} className="size-4 mr-2" alt="Google Logo" />
          {action + " con Google"}
        </Button>
      )}
    </>
  );
}
