'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { Copy, Check, Download, Users, Shield, Wrench } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function generateGS1DigitalLink(passport: any) {
  // Support multiple data structures from API:
  // API returns: { passportId, data: { qrCodeGs1: { gtin, serial_number } } }
  // Also support direct properties for flexibility
  const gtin = passport?.data?.qrCodeGs1?.gtin 
    || passport?.qrCodeGs1?.gtin
    || passport?.gtin_ai_01 
    || passport?.gtin;
  const serialNumber = passport?.data?.qrCodeGs1?.serial_number 
    || passport?.qrCodeGs1?.serial_number
    || passport?.serial_number_ai_21 
    || passport?.serial_number;
  
  if (!gtin || !serialNumber) {
    return '';
  }
  
  return `https://id.gs1.org/01/${gtin}/21/${serialNumber}`;
}

export function generateQRCodeData(passport: any) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const digitalLink = generateGS1DigitalLink(passport);
  // API returns passportId (camelCase) or it may be in data.passport_id
  const passportId = passport?.passportId || passport?.passport_id || passport?.data?.passport_id || passport?.id;
  
  return {
    passportId: passportId,
    batteryModel: passport?.battery_model || passport?.data?.identification?.application || passport?.category,
    manufacturer: passport?.manufacturer_name || passport?.data?.identification?.manufacturer,
    status: passport?.status || passport?.data?.status,
    digitalLink: digitalLink,
    accessUrl: `${baseUrl}/apps/passports/access?id=${passportId}`,
  };
}

export default function QRCodeDisplay({ passport }: { passport: any }) {
  const [copied, setCopied] = React.useState(false);
  const qrData = generateQRCodeData(passport);
  const qrSize = passport.qr_size || 256;
  const errorLevel = (passport.qr_error_correction || 'M') as 'L' | 'M' | 'Q' | 'H';

  const handleCopy = () => {
    navigator.clipboard.writeText(qrData.digitalLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('battery-passport-qr');
    if (!svg) return;
    
    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = qrSize;
      canvas.height = qrSize;
      
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, qrSize, qrSize);
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `battery-passport-qr-${qrData.passportId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(encodeURIComponent(svgData).replace(/%([0-9A-F]{2})/g, (_match, p1) => String.fromCharCode(parseInt(p1, 16))));
    } catch (error) {
      console.error('QR code download failed:', error);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-inner border">
          <QRCodeSVG
            id="battery-passport-qr"
            value={qrData.digitalLink}
            size={160}
            level={errorLevel}
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
        
        <div className="mb-3">
          <p className="text-xs text-emerald-600 font-medium mb-1">✓ ISO/IEC 18004:2015 Compliant</p>
          <p className="text-xs text-slate-500">Error Correction: Level {errorLevel}</p>
        </div>
        
        <p className="text-sm font-medium text-slate-700 mb-1">GS1 Digital Link</p>
        <p className="text-xs font-mono text-slate-500 mb-3 break-all px-2">
          {qrData.digitalLink}
        </p>
        
        <div className="flex gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 mr-1 text-emerald-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copy Link
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownloadQR}
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-1">Unique Battery Identifier</p>
          <p className="text-xs font-mono text-slate-600">{qrData.passportId}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-700 mb-2">Tiered Access Layers</p>
          <div className="space-y-1">
            {passport.access_layer_public_enabled !== false && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Users className="w-3 h-3 text-emerald-600" />
                <span>Public: Sustainability info</span>
              </div>
            )}
            {passport.access_layer_authority_enabled !== false && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Shield className="w-3 h-3 text-blue-600" />
                <span>Authority: Compliance data</span>
              </div>
            )}
            {passport.access_layer_legitimate_enabled !== false && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Wrench className="w-3 h-3 text-purple-600" />
                <span>Legitimate: Lifecycle data</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
