import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function compactStringToUUIDs(compactString: string) {
  // Decode the Base64 string to a buffer
  const buffer = Buffer.from(compactString, "base64");

  // Extract UUIDs (16 bytes each)
  const uuidBytes1 = buffer.slice(0, 16);
  const uuidBytes2 = buffer.slice(16, 32);

  // Extract the remainder as the salt
  const salt = buffer.slice(32);

  // Function to convert a buffer to UUID string format
  function bufferToUUID(buffer: Buffer) {
    const hex = buffer.toString("hex");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
      12,
      16
    )}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  // Convert buffers to UUID strings
  const uuid1 = bufferToUUID(uuidBytes1);
  const uuid2 = bufferToUUID(uuidBytes2);

  // Convert salt buffer to URL-safe base64
  const b64EncodedSalt = salt
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return [uuid1, uuid2, b64EncodedSalt];
}