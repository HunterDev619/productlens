'use client';

type Props = {
  provider: string;
};

export default function Security({ provider }: Props) {
  return (
    <div className="p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-gray-100">
          {/* simple lock glyph */}
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="text-gray-700"><path d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5Zm-3 8V6a3 3 0 0 1 6 0v3H9Z" /></svg>
        </span>
        Security
      </h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-gray-700"><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Zm0 2.18 7 3.11v4.71c0 4.61-3.06 8.94-7 10.19-3.94-1.25-7-5.58-7-10.19V6.29l7-3.11ZM11 7v6h2V7h-2Zm0 8v2h2v-2h-2Z" /></svg>
              Authentication
            </div>
            <div className="text-xs text-gray-500">
              Email •
              {provider}
            </div>
          </div>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Active</span>
        </div>
      </div>
    </div>
  );
}
