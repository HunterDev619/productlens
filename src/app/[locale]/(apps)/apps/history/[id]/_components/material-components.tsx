import type { MaterialComponent } from '@/services/types';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useGetMaterialComponentByMaterialCompositionId } from '@/services/material-component/find-by-material-composition-id';

type MaterialComponentsProps = {
  composition_id: string;
};

export default function MaterialComponents({ composition_id }: MaterialComponentsProps) {
  const { data: materialComponents, isLoading, error } = useGetMaterialComponentByMaterialCompositionId(composition_id);
  const [sorting, setSorting] = useState([] as any);

  const data = materialComponents || [];

  const columnHelper = createColumnHelper<MaterialComponent>();
  const columns = [
    columnHelper.accessor('materialName', {
      header: 'Material',
      cell: info => (
        <div>
          <div className="text-sm font-medium text-gray-900">{info.getValue() || '-'}</div>
          {info.row.original.materialType && (
            <div className="text-xs text-gray-500">{info.row.original.materialType}</div>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('weight', {
      header: 'Weight',
      cell: info => (
        <span className="text-gray-900">
          {Number.parseFloat(String(info.getValue() ?? 0)).toFixed(3)}
          {' '}
          {info.row.original.weightUnit || ''}
        </span>
      ),
    }),
    columnHelper.accessor('percentage', {
      header: '%',
      cell: info => (
        <span className="text-gray-900">
          {Number.parseFloat(String(info.getValue() ?? 0)).toFixed(2)}
          %
        </span>
      ),
    }),
    columnHelper.accessor('carbonEmissions', {
      header: 'CO₂e Emissions',
      cell: info => (
        <span className="text-gray-900">
          {info.getValue() != null ? Number.parseFloat(String(info.getValue())).toFixed(3) : '-'}
          {' '}
          {info.row.original.carbonFactorUnit ? info.row.original.carbonFactorUnit.replace('/kg', '') : 'kg CO₂e'}
        </span>
      ),
    }),
    columnHelper.accessor('carbonFactor', {
      header: 'Carbon Factor',
      cell: info => (
        <span className="text-gray-700">
          {info.getValue() != null ? Number.parseFloat(String(info.getValue())).toFixed(3) : '-'}
          {' '}
          {info.row.original.carbonFactorUnit || ''}
        </span>
      ),
    }),
    columnHelper.accessor('source', {
      header: 'Source',
      cell: info => (
        <span className="text-gray-600">
          {info.getValue() || '-'}
        </span>
      ),
    }),
    columnHelper.accessor('recyclable', {
      header: 'Recyclable',
      cell: info => (
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${info.getValue() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {info.getValue() ? 'Yes' : 'No'}
        </span>
      ),
    }),
    columnHelper.accessor('renewable', {
      header: 'Renewable',
      cell: info => (
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${info.getValue() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {info.getValue() ? 'Yes' : 'No'}
        </span>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-64 animate-pulse rounded bg-gray-200" />
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
          <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
          <div className="mt-2 h-8 w-full animate-pulse rounded bg-gray-100" />
          <div className="mt-2 h-8 w-full animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Material Components</h3>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase hover:bg-gray-100"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-1">
                        <span>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getIsSorted() === 'asc' && (
                          <span className="text-gray-400">↑</span>
                        )}
                        {header.column.getIsSorted() === 'desc' && (
                          <span className="text-gray-400">↓</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
