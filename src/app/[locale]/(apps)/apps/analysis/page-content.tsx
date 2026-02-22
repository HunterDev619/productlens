"use client";

import { Inter } from "next/font/google";

import UploadForm from "./_components/upload-form";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function AnalyzePageContent() {
  return (
    <div className={`${inter.className} min-h-screen bg-[#f8fafc]`}>
      <div className="mx-auto space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8">
        {/* Header */}
        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            AI-Product Sustainability & Intelligence
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-zinc-600">
            LCA | Environmental Indicators & Risks | Target Setting & Decarbonisation |
            Trade Compliance & Supply-Chain Mapping
          </p>
        </motion.div> */}

        {/* Upload Form */}
        <UploadForm />
      </div>
    </div>
  );
}
