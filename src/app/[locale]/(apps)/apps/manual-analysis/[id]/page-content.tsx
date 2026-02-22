'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui';
import { LcaCalculatorEdit } from '../_components/lca-calculator-edit';
import axiosInstance from '@/libs/axios';

type AssessmentDetailResponse = {
  data: {
    assessment: {
      id: string;
      assessmentId: string;
      userId: string;
      status: string;
      assessmentDate: string | null;
      data: any;
      createdAt: string;
      updatedAt: string;
    };
  };
  error: string;
  message: string;
};

async function getAssessment(id: string) {
  const response = await axiosInstance.get<AssessmentDetailResponse>(
    `/api/v1/lca-assessments/${id}`
  );
  return response.data.data.assessment;
}

export default function AssessmentDetailPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ['lca-assessment', id],
    queryFn: () => getAssessment(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700">Failed to load assessment. Please try again.</p>
      </div>
    );
  }

  return <LcaCalculatorEdit assessment={data} />;
}
