'use client';

import { ArrowLeft, CircleNotch, Cube, Flask, LeafIcon, Package } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useGetAnalysisV2FindProductSpecificationsId } from '@/services/analysis-v2/find-product-specifications-id';
import { cn } from '@/utils';
import IpccAr6ReportForm from './_components/ipcc-ar6-report-form';
import LCAAnalysisForm from './_components/lca-analysis-form';
import MaterialCompositionForm from './_components/material-composition-form';
import ProductSpecificationsForm from './_components/product-specifications-form';

type TabType = 'product' | 'material' | 'lca' | 'ipcc';

export const ProductAnalysisDetailPageContent = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('product');

  const {
    data: analysisV2FindProductSpecificationsData,
    isLoading: isAnalysisV2FindProductSpecificationsLoading,
  } = useGetAnalysisV2FindProductSpecificationsId(id as string);

  if (isAnalysisV2FindProductSpecificationsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <CircleNotch size={40} className="animate-spin text-emerald-500" />
          <p className="text-lg font-medium text-gray-700">Loading Product Analysis...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'product' as TabType,
      label: 'Product Specifications',
      icon: Package,
      available: true,
    },
    {
      id: 'material' as TabType,
      label: 'Material Composition',
      icon: Cube,
      available: !!analysisV2FindProductSpecificationsData?.data?.rawMaterialCompositionId,
    },
    {
      id: 'lca' as TabType,
      label: 'LCA Analysis',
      icon: Flask,
      available: !!analysisV2FindProductSpecificationsData?.data?.lcaAnalysisId,
    },
    {
      id: 'ipcc' as TabType,
      label: 'IPCC AR6 Report',
      icon: LeafIcon,
      available: !!analysisV2FindProductSpecificationsData?.data?.ipccReportId,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link
              href="/admin/product-analysis"
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              Back to List
            </Link>
            <div>
              <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent">
                Edit Product Analysis
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                ID:
                {' '}
                <span className="font-mono">{id}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex border-b border-gray-200 bg-gray-50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => tab.available && setActiveTab(tab.id)}
                  disabled={!tab.available}
                  className={cn(
                    'relative flex flex-1 items-center justify-center gap-2 px-6 py-4 font-medium transition-all',
                    activeTab === tab.id
                      ? 'text-emerald-600'
                      : 'text-gray-600 hover:text-gray-900',
                    !tab.available && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <Icon size={20} weight={activeTab === tab.id ? 'fill' : 'regular'} />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'product' && <ProductSpecificationsForm />}

            {activeTab === 'material' && analysisV2FindProductSpecificationsData?.data?.rawMaterialCompositionId && (
              <MaterialCompositionForm
                composition_id={analysisV2FindProductSpecificationsData.data.rawMaterialCompositionId}
              />
            )}

            {activeTab === 'lca' && analysisV2FindProductSpecificationsData?.data?.lcaAnalysisId && (
              <LCAAnalysisForm
                lcaAnalysis_id={analysisV2FindProductSpecificationsData.data.lcaAnalysisId}
              />
            )}

            {activeTab === 'ipcc' && analysisV2FindProductSpecificationsData?.data?.ipccReportId && (
              <IpccAr6ReportForm
                report_id={analysisV2FindProductSpecificationsData.data.ipccReportId as string}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
