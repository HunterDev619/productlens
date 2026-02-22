'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/components/accordion';
import { Badge } from '@/components/ui/components/badge';
import type { ProductPart } from '@/services/types';

type ComponentsBreakdownProps = {
  list_of_parts: ProductPart[];
};

export function ComponentsBreakdown({ list_of_parts }: ComponentsBreakdownProps) {
  // Calculate summary statistics
  // const summary = useMemo(() => {
  //   if (!list_of_parts || list_of_parts.length === 0) {
  //     return {
  //       totalComponents: 0,
  //       totalWeight: 0,
  //       weightUnit: 'kg',
  //       heaviestComponent: null as ProductPart | null,
  //       totalMaterials: 0,
  //     };
  //   }

  //   const totalWeight = list_of_parts.reduce((sum, part) => sum + (part.weight || 0), 0);
  //   const heaviestComponent = list_of_parts.reduce((heaviest, part) => {
  //     if (!heaviest || (part.weight || 0) > (heaviest.weight || 0)) {
  //       return part;
  //     }
  //     return heaviest;
  //   }, null as ProductPart | null);

  //   // Get unique materials
  //   const allMaterials = new Set<string>();
  //   list_of_parts.forEach((part) => {
  //     if (part.materials && Array.isArray(part.materials)) {
  //       part.materials.forEach((material) => {
  //         if (material) {
  //           allMaterials.add(material);
  //         }
  //       });
  //     }
  //   });

  //   const weightUnit = list_of_parts[0]?.weight_unit || 'kg';

  //   return {
  //     totalComponents: list_of_parts.length,
  //     totalWeight,
  //     weightUnit,
  //     heaviestComponent,
  //     totalMaterials: allMaterials.size,
  //   };
  // }, [list_of_parts]);

  if (!list_of_parts || list_of_parts.length === 0) {
    return null;
  }

  // Default expand first item
  const defaultExpandedItem = list_of_parts[0]?.part_name ? [`item-${list_of_parts[0].part_name}`] : [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Components Breakdown
        </h2>
        <p className="text-sm text-gray-600 sm:text-base">
          Detailed analysis of different fridge parts with their materials and weight distribution
        </p>
      </div>

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm sm:p-5">
          <p className="text-sm text-blue-700 sm:text-base">Total Components</p>
          <p className="mt-2 text-2xl font-bold text-blue-900 sm:text-3xl">
            {summary.totalComponents}
          </p>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm sm:p-5">
          <p className="text-sm text-green-700 sm:text-base">Total Weight</p>
          <p className="mt-2 text-2xl font-bold text-green-900 sm:text-3xl">
            {summary.totalWeight.toFixed(2)}
            {' '}
            {summary.weightUnit}
          </p>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 shadow-sm sm:p-5">
          <p className="text-sm text-purple-700 sm:text-base">Heaviest Component</p>
          <p className="mt-2 line-clamp-2 text-lg font-bold text-purple-900 sm:text-xl">
            {summary.heaviestComponent?.part_name || 'N/A'}
          </p>
        </div>

        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 shadow-sm sm:p-5">
          <p className="text-sm text-orange-700 sm:text-base">Total Materials</p>
          <p className="mt-2 text-2xl font-bold text-orange-900 sm:text-3xl">
            {summary.totalMaterials}
            {summary.totalMaterials >= 20 && '+'}
          </p>
        </div>
      </div> */}

      {/* Component List */}
      <div className="space-y-3">
        <Accordion
          type="multiple"
          defaultValue={defaultExpandedItem}
          className="w-full space-y-3"
        >
          {list_of_parts.map((part) => {
            const materials = part.materials || [];
            // const weight = part.weight || 0;
            const percentage = part.percentage || 0;
            // const weightUnit = part.weight_unit || 'kg';

            return (
              <AccordionItem
                key={`part-${part.part_name}`}
                value={`item-${part.part_name}`}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-5 sm:py-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex w-full items-center justify-between pr-4">
                    <div className="flex-1 text-left">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                            {part.part_name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4">
                          {/* <div className="text-sm text-gray-700 sm:text-base">
                            <span className="font-medium">{formatWeightValue(weight)}</span>
                            {' '}
                            {weightUnit}
                          </div> */}
                          <div className="text-sm text-gray-700 sm:text-base">
                            <span className="font-medium">{percentage}</span>
                            %
                          </div>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4">
                    <div className="space-y-3">
                      <div>
                        <p className="mb-2 text-sm font-medium text-gray-700 sm:text-base">
                          Materials Used:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {materials.length > 0
                            ? (
                                materials.map(material => (
                                  <Badge
                                    key={`material-${part.part_name}-${material}`}
                                    variant="secondary"
                                    className="bg-blue-50 text-xs text-blue-700 sm:text-sm"
                                  >
                                    {material}
                                  </Badge>
                                ))
                              )
                            : (
                                <span className="text-sm text-gray-500">No materials specified</span>
                              )}
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
