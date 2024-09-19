import { Metadata } from "next";
import Link from "next/link";

import { TimelineCalendar } from "@/components/timeline-calendar/calendar";

export const metadata: Metadata = {
  title: "Timeline Reservation Calendar",
  description:
    "A timeline reservation calendar built with Next.js, React, and Tailwind CSS",
  keywords: [
    "timeline",
    "reservation",
    "calendar",
    "nextjs",
    "react",
    "tailwindcss",
  ],
  openGraph: {
    title: "Timeline Reservation Calendar",
    description:
      "A timeline reservation calendar built with Next.js, React, and Tailwind CSS",
    url: "https://timeline-calendar.vercel.app/",
    siteName: "Timeline Reservation Calendar",
    images: [
      {
        url: "https://timeline-calendar.vercel.app/timeline-calendar.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Timeline Reservation Calendar",
    description:
      "A timeline reservation calendar built with Next.js, React, and Tailwind CSS",
    creator: "@KorkmazerB90690",
    images: ["https://timeline-calendar.vercel.app/timeline-calendar.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="flex flex-col gap-2 my-5">
          <TimelineCalendar />
        </div>
      </main>

      <footer className="border-t p-4">
        <Link href="https://github.com/bahadirk5/timeline-calendar">
          The source code is available on{" "}
          <span className="underline">GitHub.</span>
        </Link>
      </footer>
    </div>
  );
}
