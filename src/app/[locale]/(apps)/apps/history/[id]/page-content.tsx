'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/components/button';
import { useGetAnalysisV2FindProductSpecificationsId } from '@/services/analysis-v2/find-product-specifications-id';
import { useParams } from 'next/navigation';
import CradleToGraveAnalysis from './_components/cradle-to-grave-analysis';
import IPCCReportsDetailed from './_components/ipcc-reports-detailed';
import MaterialCompositionSection from './_components/material-composition';
import ProductSpecifications from './_components/product-specifications';
import SupplyChainTraceabilityAndTransportation from './_components/supply-chain-traceability-and-transportation';

export default function HistoryDetailPageContent() {
  const { id } = useParams();
  const { data: analysisV2FindProductSpecificationsData, isLoading, error } = useGetAnalysisV2FindProductSpecificationsId(id as string);
  
  // Extract nested data from consolidated API response
  const analysisData = analysisV2FindProductSpecificationsData?.data;
  const productSpecification = analysisData?.productSpecification;
  const lcaAnalysis = analysisData?.lcaAnalysis;
  const ipccReport = analysisData?.ipccReport;
  const materialComposition = ipccReport?.materialComposition;
  // const { generateAnalysisReportV2, loading: generateLoading } = useGenerateLCAAnalysisReportV2();

  // const [lcaGenerateError, setLcaGenerateError] = useState<string | null>(null);

  // const handleGenerateLcaReport = async () => {
  //   if (
  //     || !analysisV2FindProductSpecificationsData?.data?.rawMaterialCompositionId
  //   ) {
  //     return;
  //   }

  //   setLcaGenerateError(null);

  //   try {
  //     const result = await generateAnalysisReportV2({
  //       productSpecificationID: analysisV2FindProductSpecificationsData.data.productSpecificationId,
  //       materialCompositionID: analysisV2FindProductSpecificationsData.data.rawMaterialCompositionId,
  //     });

  //     if (result.data) {
  //       await refetch();
  //     }
  //   } catch (err: any) {
  //     console.error('Failed to generate LCA report:', err);
  //     setLcaGenerateError(err?.message || 'Failed to generate LCA Analysis Report');
  //   }
  // };
  // const formatPrice = (prices: string[]) => {
  //   if (!prices) {
  //     return 'N/A';
  //   }

  //   if (prices.length === 0) {
  //     return 'N/A';
  //   }
  //   if (prices.length === 1) {
  //     return `$${prices[0]}`;
  //   }
  //   return `$${prices[0]} - $${prices[1]}`;
  // };

  // const getVerificationColor = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case 'verified':
  //       return 'bg-green-100 text-green-800 border-green-200';
  //     case 'unverified':
  //       return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  //     case 'pending':
  //       return 'bg-blue-100 text-blue-800 border-blue-200';
  //     default:
  //       return 'bg-gray-100 text-gray-800 border-gray-200';
  //   }
  // };

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   });
  // };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500 sm:h-8 sm:w-8" />
        <span className="ml-2 text-base text-gray-600 sm:text-lg">Loading product details...</span>
      </div>
    );
  }

  if (error || !analysisV2FindProductSpecificationsData) {
    return (
      <div className="py-8 text-center sm:py-12">
        <p className="text-sm text-red-600 sm:text-base">Error loading product details. Please try again.</p>
        <Link href="/apps/history">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto space-y-4 sm:space-y-6 lg:space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/apps/history">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Back to History</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>

        {/* <Badge className={getVerificationColor(data.verificationStatus)}>
          {data.verificationStatus}
        </Badge> */}
      </div>

      {/* Product Overview */}
      {/* <ProductOverview
        data={data}
        formatPrice={formatPrice}
        formatDate={formatDate}
      /> */}

      {/* Product Specifications */}
      <ProductSpecifications />

      {/* Material Composition */}
      {materialComposition && materialComposition.id && (
        <MaterialCompositionSection
          composition_id={materialComposition.id}
          lcaAnalysisId={lcaAnalysis?.id || null}
          productSpecificationId={productSpecification?.id || null}
        />
      )}

      {/* Generate LCA Report Button - Show when missing lcaAnalysisId or ipccReportId */}
      {/* {analysisV2FindProductSpecificationsData
        && analysisV2FindProductSpecificationsData.data?.productSpecificationId
        && analysisV2FindProductSpecificationsData.data?.rawMaterialCompositionId
        && (!analysisV2FindProductSpecificationsData.data?.lcaAnalysisId || !analysisV2FindProductSpecificationsData.data?.ipccReportId)
        && !generateLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center py-4"
        >
          <Button
            onClick={handleGenerateLcaReport}
            disabled={generateLoading}
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6 text-base font-semibold text-white shadow-xl transition-all hover:shadow-2xl hover:shadow-emerald-500/50 sm:px-10 sm:text-lg"
          >
            <svg className="mr-2 h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate LCA Analysis & IPCC Report
          </Button>
        </motion.div>
      )} */}

      {/* LCA Progress Bar - Show when generating */}
      {/* <LcaProgressBar
        isLoading={generateLoading && !!analysisV2FindProductSpecificationsData?.data}
        isComplete={
          !!analysisV2FindProductSpecificationsData?.data?.lcaAnalysisId
          && !!analysisV2FindProductSpecificationsData?.data?.ipccReportId
        }
      /> */}

      {/* LCA Generation Error - Show retry button */}
      {/* {lcaGenerateError && !generateLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-red-300 bg-red-50 p-4 sm:p-6"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="mt-0.5 flex-shrink-0 rounded-full bg-red-500 p-1.5 sm:p-2">
              <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 text-sm font-semibold text-red-900 sm:mb-2 sm:text-base">
                Failed to generate LCA Analysis Report
              </p>
              <p className="mb-3 text-xs break-words text-red-800 sm:mb-4 sm:text-sm">
                {lcaGenerateError}
              </p>
              <Button
                onClick={handleGenerateLcaReport}
                disabled={generateLoading}
                variant="destructive"
                size="sm"
                className="text-xs sm:text-sm"
              >
                {generateLoading ? 'Retrying...' : 'Retry Generation'}
              </Button>
            </div>
          </div>
        </motion.div>
      )} */}

      {/* Cradle to Grave Analysis */}
      {lcaAnalysis && lcaAnalysis.id && (
        <CradleToGraveAnalysis
          lcaAnalysis_id={lcaAnalysis.id}
          productSpecificationId={productSpecification?.id || null}
          materialCompositionId={materialComposition?.id || null}
        />
      )}

      {/* Material Components */}
      {/* {analysisV2FindProductSpecificationsData && analysisV2FindProductSpecificationsData.data?.rawMaterialCompositionId && (
        <MaterialComponents composition_id={analysisV2FindProductSpecificationsData.data.rawMaterialCompositionId} />
      )} */}

      {/* IPCC Environmental Impact Reports - Detailed */}
      {ipccReport && ipccReport.id && lcaAnalysis && lcaAnalysis.id && (
        <IPCCReportsDetailed report_id={ipccReport.id} lca_analysis_id={lcaAnalysis.id} />
      )}

      {/* Supply Chain Traceability & Transportation (appended at end) */}
      {lcaAnalysis && lcaAnalysis.id && (
        <SupplyChainTraceabilityAndTransportation lcaAnalysis_id={lcaAnalysis.id} />
      )}

      {/* LCA Analysis */}
      {/* {analysisV2FindProductSpecificationsData && analysisV2FindProductSpecificationsData.data?.lcaAnalysisId && (
        <LCAAnalysis lcaAnalysis_id={analysisV2FindProductSpecificationsData.data.lcaAnalysisId as string} />
      )} */}

      {/* Analysis Timestamp */}
      {/* <div className="text-center text-sm text-gray-500">
        Product data created on
        {' '}
        {formatDate(data.createdAt)}
      </div> */}
    </motion.div>
  );
}
