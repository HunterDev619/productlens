'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getBatteryPassport } from '@/services/battery-passports/get';
import { 
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import { 
  Battery, 
  Users, 
  Shield, 
  Wrench, 
  Eye,
  Leaf,
  Recycle,
  FileText,
  Lock,
  Unlock,
  Info
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { generateGS1DigitalLink } from '@/components/QRCodeDisplay';

export default function PassportAccess() {
  const searchParams = useSearchParams();
  const passportId = searchParams.get('id');
  const [accessLevel, setAccessLevel] = useState('public');
  const [authorityCode, setAuthorityCode] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

  const { data: passport, isLoading } = useQuery({
    queryKey: ['passport', passportId],
    queryFn: () => getBatteryPassport(passportId!).then(res => res.data.passport),
    enabled: !!passportId,
  }) as { data: any; isLoading: boolean };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Battery className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading Battery Passport...</p>
        </div>
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Battery className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Passport Not Found</h2>
            <p className="text-slate-600">The requested battery passport could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gs1Link = generateGS1DigitalLink(passport);
  
  // Get passport ID from various possible locations
  const passportIdValue = passport.passportId || passport.passport_id || passport.data?.passport_id;

  const handleAuthorityAccess = () => {
    // In production, verify against EU authority database
    if (authorityCode.length >= 8) {
      setVerificationStatus('verified');
      setAccessLevel('authority');
    } else {
      setVerificationStatus('invalid');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Battery className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-slate-900">Battery Passport</h1>
          </div>
          <p className="text-slate-600">EU Regulation 2023/1542 - Digital Battery Passport</p>
        </div>

        {/* Access Level Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              Select Access Level
            </CardTitle>
            <CardDescription>Choose your access category to view relevant information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant={accessLevel === 'public' ? 'primary' : 'outline'}
                onClick={() => setAccessLevel('public')}
                className="h-auto p-4 flex flex-col items-start"
              >
                <Users className="w-5 h-5 mb-2" />
                <div className="text-left">
                  <div className="font-semibold">Public Access</div>
                  <div className="text-xs opacity-80">General consumers</div>
                </div>
              </Button>

              <Button
                variant={accessLevel === 'authority' ? 'primary' : 'outline'}
                onClick={() => setAccessLevel('authority')}
                className="h-auto p-4 flex flex-col items-start"
              >
                <Shield className="w-5 h-5 mb-2" />
                <div className="text-left">
                  <div className="font-semibold">Authority Access</div>
                  <div className="text-xs opacity-80">Market surveillance</div>
                </div>
              </Button>

              <Button
                variant={accessLevel === 'legitimate' ? 'primary' : 'outline'}
                onClick={() => setAccessLevel('legitimate')}
                className="h-auto p-4 flex flex-col items-start"
              >
                <Wrench className="w-5 h-5 mb-2" />
                <div className="text-left">
                  <div className="font-semibold">Legitimate Interest</div>
                  <div className="text-xs opacity-80">Recyclers, repairers</div>
                </div>
              </Button>
            </div>

            {/* Authority Verification */}
            {accessLevel === 'authority' && verificationStatus !== 'verified' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="text-sm font-medium mb-2 block">Authority Verification Code</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Enter verification code"
                    value={authorityCode}
                    onChange={(e) => setAuthorityCode(e.target.value)}
                  />
                  <Button onClick={handleAuthorityAccess}>Verify</Button>
                </div>
                {verificationStatus === 'invalid' && (
                  <p className="text-xs text-red-600 mt-2">Invalid verification code</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Public Layer - Always Visible */}
        {passport.access_layer_public_enabled !== false && (
          <Card className="mb-6">
            <CardHeader className="bg-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-emerald-600" />
                Public Information Layer
              </CardTitle>
              <CardDescription>Basic sustainability and performance information for consumers</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Battery Overview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Passport ID:</span>
                      <span className="font-mono text-sm">{passport.passport_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Category:</span>
                      <span className="font-medium">{String(passport.battery_category || 'N/A')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Model:</span>
                      <span className="font-medium">{String(passport.battery_model || 'N/A')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Manufacturer:</span>
                      <span className="font-medium">{String(passport.manufacturer_name || 'N/A')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    Sustainability Metrics
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-emerald-700">Carbon Footprint</span>
                        <span className="text-2xl font-bold text-emerald-900">
                          {String(passport.carbon_footprint_class || 'N/A')}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-600">
                        {String(passport.carbon_footprint_total || 'N/A')} kg CO₂e/kWh
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Recycle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Recycled Content</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-blue-600">Cobalt:</span>
                          <span className="font-bold ml-1">{String(passport.post_consumer_recycled_cobalt || 0)}%</span>
                        </div>
                        <div>
                          <span className="text-blue-600">Lithium:</span>
                          <span className="font-bold ml-1">{String(passport.post_consumer_recycled_lithium || 0)}%</span>
                        </div>
                        <div>
                          <span className="text-blue-600">Nickel:</span>
                          <span className="font-bold ml-1">{String(passport.post_consumer_recycled_nickel || 0)}%</span>
                        </div>
                        <div>
                          <span className="text-blue-600">Lead:</span>
                          <span className="font-bold ml-1">{String(passport.post_consumer_recycled_lead || 0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Performance at a Glance</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Capacity</p>
                    <p className="text-lg font-bold text-slate-900">{String(passport.rated_capacity_kwh || 'N/A')} kWh</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Voltage</p>
                    <p className="text-lg font-bold text-slate-900">{String(passport.nominal_voltage || 'N/A')} V</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Expected Life</p>
                    <p className="text-lg font-bold text-slate-900">{String(passport.expected_lifetime_years || 'N/A')} yrs</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Warranty</p>
                    <p className="text-lg font-bold text-slate-900">{String(passport.warranty_period || 'N/A')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Authority Layer - Restricted */}
        {accessLevel === 'authority' && verificationStatus === 'verified' && passport.access_layer_authority_enabled !== false && (
          <Card className="mb-6 border-blue-300">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Authority Access Layer
              </CardTitle>
              <CardDescription>Detailed compliance and technical specifications for market surveillance</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Alert className="mb-4 bg-blue-50 border-blue-200">
                <Lock className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-900">
                  This information is restricted to authorized EU market surveillance authorities and notified bodies.
                </AlertDescription>
              </Alert>

              <Tabs defaultValue="compliance">
                <TabsList>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  <TabsTrigger value="technical">Technical Specs</TabsTrigger>
                  <TabsTrigger value="supply">Supply Chain</TabsTrigger>
                </TabsList>

                <TabsContent value="compliance" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">CE Marking & Conformity</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">CE Marking Date:</span>
                          <span className="font-medium">{String(passport.ce_marking_date || 'N/A')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Notified Body ID:</span>
                          <span className="font-medium">{String(passport.notified_body_id || 'N/A')}</span>
                        </div>
                      </div>
                      {passport.eu_declaration_conformity_url ? (
                        <Button variant="link" className="p-0 h-auto mt-2 text-xs">
                          View Declaration of Conformity →
                        </Button>
                      ) : null}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Due Diligence</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Status:</span>
                          <span className={passport.due_diligence_compliant ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                            {passport.due_diligence_compliant ? '✓ Compliant' : 'Under Review'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Scheme:</span>
                          <span className="font-medium">{String(passport.due_diligence_scheme || 'N/A')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Chemistry</h4>
                      <p className="text-sm text-slate-700">{String(passport.battery_chemistry || 'N/A')}</p>
                      <div className="mt-3 space-y-1 text-xs">
                        <div><span className="text-slate-500">Cathode:</span> {String(passport.cathode_material || 'N/A')}</div>
                        <div><span className="text-slate-500">Anode:</span> {String(passport.anode_material || 'N/A')}</div>
                        <div><span className="text-slate-500">Electrolyte:</span> {String(passport.electrolyte_material || 'N/A')}</div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Weight & Mass</h4>
                      <p className="text-2xl font-bold text-slate-900">{String(passport.battery_mass_kg || 'N/A')}</p>
                      <p className="text-xs text-slate-500">kg</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Manufacturing</h4>
                      <div className="text-xs space-y-1">
                        <div><span className="text-slate-500">Location:</span> {String(passport.manufacturing_place || 'N/A')}</div>
                        <div><span className="text-slate-500">Country:</span> {String(passport.manufacturing_country || 'N/A')}</div>
                        <div><span className="text-slate-500">Date:</span> {String(passport.manufacturing_date || 'N/A')}</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="supply" className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-medium text-amber-900 mb-2">Critical Raw Materials</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(passport.critical_raw_materials) && passport.critical_raw_materials.length > 0 ? (
                        passport.critical_raw_materials.map((material: any, i: number) => (
                          <span key={i} className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                            {String(material)}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-amber-600">No data available</span>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Legitimate Interest Layer */}
        {accessLevel === 'legitimate' && passport.access_layer_legitimate_enabled !== false && (
          <Card className="mb-6 border-purple-300">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-purple-600" />
                Legitimate Interest Layer
              </CardTitle>
              <CardDescription>Lifecycle data for recyclers, repairers, and refurbishers</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Alert className="mb-4 bg-purple-50 border-purple-200">
                <Info className="w-4 h-4 text-purple-600" />
                <AlertDescription className="text-sm text-purple-900">
                  Access granted to entities with legitimate interest for battery lifecycle management.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Current State of Health</h3>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-purple-700">State of Health (SoH)</span>
                      <span className="text-3xl font-bold text-purple-900">{String(passport.state_of_health || 'N/A')}%</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Remaining Capacity:</span>
                        <span className="font-medium">{String(passport.remaining_capacity_kwh || 'N/A')} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Capacity Fade:</span>
                        <span className="font-medium">{String(passport.capacity_fade || 'N/A')}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Cycles Completed:</span>
                        <span className="font-medium">{String(passport.full_cycles_completed || 'N/A')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Disassembly & Recycling</h3>
                  <div className="space-y-3">
                    {passport.dismantling_manual_url ? (
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Dismantling Manual
                      </Button>
                    ) : null}
                    {passport.safety_measures ? (
                      <div className="p-3 bg-slate-50 rounded-lg text-sm">
                        <p className="font-medium text-slate-900 mb-1">Safety Measures</p>
                        <p className="text-slate-600">{String(passport.safety_measures)}</p>
                      </div>
                    ) : null}
                    {passport.second_life_applicable ? (
                      <div className="p-3 bg-emerald-50 rounded-lg">
                        <p className="text-sm font-medium text-emerald-900">✓ Second Life Applicable</p>
                        {passport.repurposing_info ? (
                          <p className="text-xs text-emerald-700 mt-1">{String(passport.repurposing_info)}</p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-3">Performance Data</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Internal Resistance</p>
                    <p className="font-bold text-slate-900">{String(passport.initial_internal_resistance_pack || 'N/A')} mΩ</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Round Trip Efficiency</p>
                    <p className="font-bold text-slate-900">{String(passport.remaining_round_trip_efficiency || 'N/A')}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Self-Discharge Rate</p>
                    <p className="font-bold text-slate-900">{String(passport.current_self_discharge_rate || 'N/A')}%/mo</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Energy Throughput</p>
                    <p className="font-bold text-slate-900">{String(passport.energy_throughput || 'N/A')} kWh</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Code & Digital Link */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              {/* QR Code */}
              <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
                <QRCodeSVG
                  value={gs1Link}
                  size={180}
                  level={(passport.qr_error_correction as 'L' | 'M' | 'Q' | 'H') || 'M'}
                  includeMargin={true}
                  className="qr-code-svg"
                />
              </div>
              
              {/* Compliance badges */}
              <p className="text-sm text-emerald-600 mb-1">✓ ISO/IEC 18004:2015 Compliant</p>
              <p className="text-xs text-slate-500 mb-4">Error Correction: Level {String(passport.qr_error_correction || 'M')}</p>
              
              {/* GS1 Digital Link */}
              <h3 className="text-lg font-semibold text-slate-900 mb-2">GS1 Digital Link</h3>
              <a 
                href={gs1Link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all mb-4"
              >
                {gs1Link}
              </a>
              
              {/* Action buttons */}
              <div className="flex gap-2 mb-6">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(gs1Link)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const svg = document.querySelector('.qr-code-svg');
                    if (svg) {
                      const svgData = new XMLSerializer().serializeToString(svg);
                      const blob = new Blob([svgData], { type: 'image/svg+xml' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `battery-passport-${passportIdValue}.svg`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              
              {/* Unique Battery Identifier */}
              <div className="border-t pt-4 w-full">
                <p className="text-xs text-slate-500 mb-1">Unique Battery Identifier</p>
                <p className="text-sm font-mono font-medium text-slate-900">{passportIdValue}</p>
              </div>
              
              {/* Tiered Access Layers */}
              <div className="border-t pt-4 mt-4 w-full">
                <p className="text-sm font-medium text-slate-900 mb-3">Tiered Access Layers</p>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700">Public: Sustainability info</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-700">Authority: Compliance data</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wrench className="w-4 h-4 text-purple-600" />
                    <span className="text-slate-700">Legitimate: Lifecycle data</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
