import axiosInstance from '@/libs/axios';

export type LcaAssessment = {
  id: string;
  assessmentId: string;
  userId: string;
  status: string;
  assessmentDate?: string | null;
  data: any;
  createdAt: string;
  updatedAt: string;
};

export type ListLcaAssessmentsParams = {
  page?: number;
  limit?: number;
  status?: string;
};

export type ListLcaAssessmentsResponse = {
  assessments: LcaAssessment[];
  total: number;
  page: number;
  limit: number;
};

export const listLcaAssessments = async (
  params?: ListLcaAssessmentsParams,
): Promise<ListLcaAssessmentsResponse> => {
  const response = await axiosInstance.get<{ data: ListLcaAssessmentsResponse }>(
    '/api/v1/lca-assessments',
    { params },
  );

  return response.data.data;
};
