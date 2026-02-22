'use client';

import Link from 'next/link';

type DataSource = {
  source_title?: string;
  source_description?: string;
  source_url?: string;
  title?: string;
  description?: string;
  url?: string;
  name?: string;
  [key: string]: unknown;
};

type DataSourcesProps = {
  dataSources: DataSource[];
};

export default function DataSources({ dataSources }: DataSourcesProps) {
  if (!dataSources || dataSources.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">
      <h3 className="mb-6 text-xl font-bold text-gray-900">
        Data Sources (
        {dataSources.length}
        )
      </h3>
      <div className="space-y-3">
        {dataSources.map((source: DataSource, index: number) => {
          const title = source.source_title || source.title || source.name || 'Unknown Source';
          const description = source.source_description || source.description || '';
          const url = source.source_url || source.url;

          return (
            <div key={url || `source-${index}`} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900">{title}</h4>
              {description && (
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              )}
              {url && (
                <Link
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-blue-600 hover:text-blue-800"
                >
                  View Source →
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
