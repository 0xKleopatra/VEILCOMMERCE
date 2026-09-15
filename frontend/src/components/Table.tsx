// VeilCommerce — Table Component

import { cn } from '../lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  striped = true,
  hoverable = true,
  className,
  onRowClick,
}: TableProps<T>) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead className="bg-veil-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-6 py-3 text-left text-xs font-semibold text-veil-500 uppercase tracking-wider',
                  column.className
                )}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={cn('divide-y divide-veil-200', striped && 'bg-white')}>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-3 text-veil-400">
                  <EmptyStateIcon className="w-12 h-12" />
                  <p className="text-veil-500">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={keyExtractor(row)}
                className={cn(
                  hoverable && 'hover:bg-veil-50',
                  onRowClick && 'cursor-pointer',
                  striped && rowIndex % 2 === 1 && 'bg-veil-50'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-6 py-4 whitespace-nowrap text-veil-700',
                      column.className
                    )}
                    style={{ width: column.width }}
                  >
                    {column.render
                      ? column.render(row)
                      : String((row as any)[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            )))
          }
        </tbody>
      </table>
    </div>
  );
}

function EmptyStateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

// Column helper
export function createColumn<T>(key: string, header: string, options?: {
  render?: (row: T) => React.ReactNode;
  className?: string;
  width?: string;
}): Column<T> {
  return { key, header, ...options };
}