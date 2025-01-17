import Link from "next/link";
import Image from "next/image";
import Logo from "../public/logo.png";
import { SubmitButton } from "@/app/components/SubmitButton";
import { redirect } from "next/dist/server/api-utils";


export default function NotFound({error}: {error: string}) {

  return (
    <section className="relative flex items-center justify-center h-screen overflow-hidden">
      <div className="relative items-center w-full py-12 lg:py-20">
      <div className="flex-1 flex-col text-center items-center w-full space-y-4">
      <Link href="/">
        <SubmitButton 
          text="Ci riproviamo? 🚀"
          className="text-lg text-primary font-medium tracking-tight bg-primary/10 px-4 py-2 rounded-full hover:scale-110 transition-transform ease-linear hover:bg-primary/20"
        >
        </SubmitButton>
      </Link>

          <h1 className="mt-8 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-none self-text-center">
          Siamo spiacenti!{" "}
            <span className="block text-primary self-text-center">C'è stato un problema...</span>
          </h1>
          <h3 className="text-muted-foreground text-xl">{error}</h3>
      </div>
      <div className="relative flex flex-col items-center w-full py-12 mx-auto mt-12">
          <svg
            className="absolute inset-0 -mt-24 blur-3xl"
            style={{ zIndex: -1 }}
            fill="none"
            viewBox="0 0 400 400"
            height="100%"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_10_20)">
              <g filter="url(#filter0_f_10_20)">
                <path
                  d="M128.6 0H0V322.2L106.2 134.75L128.6 0Z"
                  fill="#03FFE0"
                ></path>
                <path
                  d="M0 322.2V400H240H320L106.2 134.75L0 322.2Z"
                  fill="#7C87F8"
                ></path>
                <path
                  d="M320 400H400V78.75L106.2 134.75L320 400Z"
                  fill="#4C65E4"
                ></path>
                <path
                  d="M400 0H128.6L106.2 134.75L400 78.75V0Z"
                  fill="#043AFF"
                ></path>
              </g>
            </g>
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="720.666"
                id="filter0_f_10_20"
                width="720.666"
                x="-160.333"
                y="-160.333"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="shape"
                ></feBlend>
                <feGaussianBlur
                  result="effect1_foregroundBlur_10_20"
                  stdDeviation="60.1666"
                ></feGaussianBlur>
              </filter>
            </defs>
          </svg>
          <Image
            src={Logo}
            alt="Hero image"
            priority
            className="relative object-cover w-[50%] h-[50%] md:w-[30%] md:h-[30%] rounded-lg shadow-2xl lg:rounded-2xl "
          />
        </div>
    </div>
    </section>
  )
}