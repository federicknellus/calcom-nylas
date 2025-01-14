"use client";

import { useState } from "react";
import { SettingsAction } from "@/app/actions";
import { aboutSettingsSchema } from "@/app/lib/zodSchemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { SubmitButton } from "../SubmitButton";
import { UploadDropzone } from "@/app/lib/uploadthing";
import Image from "next/image";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface iAppProps {
  fullName: string;
  email: string;
  profileImage: string;
  citta?: string;
  indirizzo?: string;
  nome_studio?: string;
  telefono?: string;
}

export function SettingsForm({ fullName, email, profileImage, citta, indirizzo, nome_studio, telefono }: iAppProps) {
  const [lastResult, action] = useActionState(SettingsAction, undefined);
  const [currentProfileImage, setCurrentProfileImage] = useState(profileImage);
  const [phoneNumber, setPhoneNumber] = useState(telefono || '');

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: aboutSettingsSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDeleteImage = () => {
    setCurrentProfileImage("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impostazioni</CardTitle>
        <CardDescription>Gestisci le tue impostazioni</CardDescription>
      </CardHeader>
      <form noValidate id={form.id} onSubmit={form.onSubmit} action={action}>
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label>Nome</Label>
            <Input
              name={fields.fullName.name}
              key={fields.fullName.key}
              placeholder="Mario Rossi"
              defaultValue={fullName}
            />
            <p className="text-red-500 text-sm">{fields.fullName.errors}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Email</Label>
            <Input disabled placeholder="Mario Rossi" defaultValue={email} />
          </div>

          <div className="grid gap-y-5">
            <input
              type="hidden"
              name={fields.profileImage.name}
              key={fields.profileImage.key}
              value={currentProfileImage}
            />
            <Label>Profile Image</Label>
            {currentProfileImage ? (
              <div className="relative size-16">
                <Image
                  src={currentProfileImage}
                  alt="Profile"
                  width={300}
                  height={300}
                  className="rounded-lg size-16"
                />
                <Button
                  type="button"
                  onClick={handleDeleteImage}
                  variant="destructive"
                  size="icon"
                  className="absolute -top-3 -right-3 size-6"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="imageUploader"
                appearance={{
                  container: "border-muted",
                }}
                onClientUploadComplete={(res) => {
                  setCurrentProfileImage(res[0].url);
                  toast.success("Immagine profilo caricata con successo");
                }}
                onUploadError={(error) => {
                  toast.error(error.message);
                }}
              />
            )}
            <p className="text-red-500 text-sm">{fields.profileImage.errors}</p>
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Città (opzionale)</Label>
            <Input
              name={fields.citta.name}
              key={fields.citta.key}
              placeholder="Roma"
              defaultValue={citta}
            />
            <p className="text-red-500 text-sm">{fields.citta.errors}</p>
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Indirizzo (opzionale)</Label>
            <Input
              name={fields.indirizzo.name}
              key={fields.indirizzo.key}
              placeholder="Via Roma, 1"
              defaultValue={indirizzo}
            />
            <p className="text-red-500 text-sm">{fields.indirizzo.errors}</p>
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Nome Studio (opzionale)</Label>
            <Input
              name={fields.nome_studio.name}
              key={fields.nome_studio.key}
              placeholder="Studio Rossi"
              defaultValue={nome_studio}
            />
            <p className="text-red-500 text-sm">{fields.nome_studio.errors}</p>
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Telefono</Label>
            <PhoneInput
              country={'it'}
              value={phoneNumber}
              onChange={(phone) => setPhoneNumber(phone)}
              inputProps={{
                name: fields.telefono.name,
                required: false,
              }}
              
            />
            <p className="text-red-500 text-sm">{fields.telefono.errors}</p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Salva" />
        </CardFooter>
      </form>
    </Card>
  );
}

