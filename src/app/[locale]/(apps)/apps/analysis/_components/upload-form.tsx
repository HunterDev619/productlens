'use client';

import { Button } from '@/components/ui';
import { waitForCombinedAnalysis } from '@/services/ai/combined-analysis-v2';
import { useGenerateLCAAnalysisReportV2 } from '@/services/ai/generate-analysis-report-v2';
import { cn } from '@/utils';
import { CircleNotch, Info, Upload } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Analysis from './analysis';
import CradleToGraveAnalysis from './cradle-to-grave-analysis';
import IpccSynthesisReport from './ipcc-synthesis-report';
import { LcaProgressBar } from './lca-progress-bar';
import RawMaterialComposition from './raw-material-composition';
import SupplyChainTraceabilityAndTransportation from './supply-chain-traceability-and-transportation';
import UploadModePanel from './upload-mode-panel';

export default function UploadForm() {
  const queryClient = useQueryClient();
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showUploadForm, setShowUploadForm] = useState(true);
  const [lcaAnalysisData, setLcaAnalysisData] = useState<any>(null);
  const [lcaAnalysisError, setLcaAnalysisError] = useState<string | null>(null);
  const [combinedReportLoading, setCombinedReportLoading] = useState(false);

  // API hook
  const { generateAnalysisReportV2, loading: generateAnalysisReportV2Loading } = useGenerateLCAAnalysisReportV2();

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setShowUploadForm(true);
    setLcaAnalysisData(null);
    setLcaAnalysisError(null);
    setCombinedReportLoading(false);
  };

  const handleRetryLcaAnalysis = async () => {
    if (!analysisResult?.product_specification_id || !analysisResult?.raw_material_composition_id) {
      return;
    }

    setLcaAnalysisError(null);

    try {
      const lcaResult = await generateAnalysisReportV2({
        productSpecificationID: analysisResult.product_specification_id,
        materialCompositionID: analysisResult.raw_material_composition_id,
      });
      if (lcaResult.data) {
        setLcaAnalysisData(lcaResult.data);
        setLcaAnalysisError(null);
      }
    } catch (lcaError) {
      console.error('LCA Analysis Report generation error:', lcaError);
      setLcaAnalysisError(lcaError instanceof Error ? lcaError.message : 'Failed to generate LCA Analysis Report');
    }
  };

  const handleUploadProductSpecsReady = async (payload: { productSpecifications: any; workflowInstanceId: string }) => {
    setAnalysisResult(payload.productSpecifications);
    setLcaAnalysisData(null);
    setLcaAnalysisError(null);
    setShowUploadForm(false);
    setCombinedReportLoading(true);

    // Invalidate product specifications list immediately when analysis starts
    queryClient.invalidateQueries({ queryKey: ['product-specifications-list'], refetchType: 'all' });

    try {
      const full = await waitForCombinedAnalysis(payload.workflowInstanceId);
      setLcaAnalysisData(full.analysis_reports);
      setLcaAnalysisError(null);
      
      // Invalidate again after completion to ensure latest data - await to ensure refetch
      await queryClient.invalidateQueries({ queryKey: ['product-specifications-list'], refetchType: 'all' });
    } catch (error) {
      console.error('Combined analysis completion error:', error);
      setLcaAnalysisError(error instanceof Error ? error.message : 'Failed to complete combined analysis');
    } finally {
      setCombinedReportLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-3 py-6 sm:px-4 sm:py-8 lg:py-12">
      <div className="mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="space-y-2 text-center sm:space-y-3 lg:space-y-4">
          <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl lg:text-4xl">
            AI-Product Intelligence & Sustainability
          </h1>
          {/* <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg">
            Advanced AI-powered Life Cycle Assessment and sustainability analysis for products
          </p> */}
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2 }}
          >
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              <div className="space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
                <UploadModePanel
                  onSuccessAction={handleUploadProductSpecsReady}
                  onResetAction={() => {
                    setAnalysisResult(null);
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-4 sm:space-y-6">
            {/* New Analysis Button */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleNewAnalysis}
                variant="primary"
                size="lg"
                className="px-6 sm:px-8"
              >
                <Upload size={18} className="mr-1.5 sm:mr-2 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">New Analysis</span>
              </Button>
            </div>

            {analysisResult && <Analysis result={analysisResult} />}
          </div>
        )}

        {/* Raw Material Composition Results */}
        {analysisResult?.product_data?.material_composition && (
          <div className="space-y-6">
            <RawMaterialComposition
              data={{
                material_composition: analysisResult.product_data.material_composition,
                data_sources: analysisResult.product_data.data_sources || null,
                product_data: analysisResult.product_data || null,
                analysis: lcaAnalysisData?.analysis || null,
              }}
            />
          </div>
        )}

        {/* Loading UI for LCA Analysis */}
        <LcaProgressBar
          isLoading={(generateAnalysisReportV2Loading || combinedReportLoading) && !!analysisResult && !lcaAnalysisData}
          isComplete={!!lcaAnalysisData}
        />

        {/* Error UI for LCA Analysis */}
        {analysisResult && lcaAnalysisError && !generateAnalysisReportV2Loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border-2 border-red-300 bg-red-50 p-4 sm:p-6"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="mt-0.5 flex-shrink-0 rounded-full bg-red-500 p-1.5 sm:p-2">
                <Info size={18} className="text-white sm:h-5 sm:w-5" weight="fill" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-sm font-semibold text-red-900 sm:mb-2 sm:text-base">Failed to generate LCA Analysis Report</p>
                <p className="mb-3 text-xs break-words text-red-800 sm:mb-4 sm:text-sm">{lcaAnalysisError}</p>
                <motion.button
                  type="button"
                  onClick={handleRetryLcaAnalysis}
                  disabled={generateAnalysisReportV2Loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-all duration-200 sm:px-6 sm:py-2 sm:text-sm',
                    'bg-red-600 hover:bg-red-700',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600',
                  )}
                >
                  <CircleNotch size={16} className={generateAnalysisReportV2Loading ? 'animate-spin' : 'sm:h-[18px] sm:w-[18px]'} />
                  {generateAnalysisReportV2Loading ? 'Retrying...' : 'Retry'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* LCA Analysis Results */}
        {lcaAnalysisData && (
          <div className="space-y-4 sm:space-y-6">
            {lcaAnalysisData.analysis && (
              <CradleToGraveAnalysis data={{ analysis: lcaAnalysisData.analysis, product_data: analysisResult?.product_data || null }} />
            )}
            {lcaAnalysisData.ipcc_report && (
              <IpccSynthesisReport
                data={{ ...lcaAnalysisData.ipcc_report, data_sources: lcaAnalysisData.citations || [], ipcc_report_id: lcaAnalysisData.ipcc_report_id || '', product_specification_id: analysisResult?.product_specification_id || '', material_composition_id: analysisResult?.raw_material_composition_id || '', lca_report_data: lcaAnalysisData.analysis || null }}
                decarbonisationOpportunities={lcaAnalysisData.analysis.decarbonization_pathways || null}
              />
            )}
            {lcaAnalysisData.analysis && (
              <SupplyChainTraceabilityAndTransportation
                supplyChainMapping={lcaAnalysisData.analysis.supply_chain_mapping}
                geographicAnalysis={lcaAnalysisData.analysis.geographic_analysis}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
