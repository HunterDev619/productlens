'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { QrCode, Copy, Check } from 'lucide-react';

type PassportData = {
  id?: string;
  passport_id?: string;
};

type QRCodeDisplayProps = {
  passport: PassportData;
};

export function QRCodeDisplay({ passport }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const passportUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/apps/passports/${passport.id || passport.passport_id}`
    : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <QrCode className="h-5 w-5 text-emerald-600" />
          QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="flex h-40 w-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
          <QrCode className="h-16 w-16 text-slate-400" />
        </div>
        <p className="text-center text-xs text-slate-500">
          QR code for passport: {passport.passport_id || passport.id}
        </p>
        <div className="flex w-full gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleCopy}>
            {copied ? <Check className="mr-1 h-4 w-4 text-emerald-600" /> : <Copy className="mr-1 h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
