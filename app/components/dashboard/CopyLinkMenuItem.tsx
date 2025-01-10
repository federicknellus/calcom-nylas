"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface CopyLinkMenuItemProps {
  meetingUrl: string;
}

export function CopyLinkMenuItem({ meetingUrl }: CopyLinkMenuItemProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl);
      toast.success("URL copiato");
    } catch (err) {
      console.error("Non siamo riusciti a copiare il link: ", err);
      toast.error("Non siamo riusciti a copiare il link");
    }
  };

  return (
    <DropdownMenuItem onSelect={handleCopy}>
      <Link2 className="mr-2 h-4 w-4" />
      <span>Copia</span>
    </DropdownMenuItem>
  );
}

export function CopyLink({ meetingUrl }: CopyLinkMenuItemProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl);
      toast.success("URL copiato");
    } catch (err) {
      console.error("Non siamo riusciti a copiare il link: ", err);
      toast.error("Non siamo riusciti a copiare il link");
    }
  };

  return (
    <Button
     onClick={handleCopy}
     variant={'outline'}
     className=""
     >
      <Link2 className="mr-2 h-4 w-4" />
      <span>Il tuo link </span>
    </Button>
  );
}
