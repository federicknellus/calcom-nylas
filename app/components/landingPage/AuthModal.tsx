import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog";


import Logo from "@/public/logo.png";
import Image from "next/image";

import { signIn } from "@/app/lib/auth";
import {GoogleAuthButton } from "../SubmitButton";

export function AuthModal({action, titolo}:{action: string, titolo: string}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{titolo}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader className="flex-row justify-center items-center gap-x-2">
          <Image src={Logo} className="w-16" alt="Logo" />
          <DialogTitle className="text-3xl font-semibold">
            Zen<span className="text-primary">Cal</span>
          </DialogTitle>
        </DialogHeader>
          <div className="flex flex-col gap-3 mt-5">
            <form
              className="w-full"
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
            <GoogleAuthButton action={action}/>
          </form>

          {/* <form
            className="w-full"
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <FacebookAuthButton />
          </form> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
