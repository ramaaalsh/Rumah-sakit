import React, { ReactNode } from 'react';

interface Column {
  header: string;
  accessor: string | ((row: any) => ReactNode);
  className?: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  keyExtractor: (row: any) => string | number;
  emptyMessage?: string;
}

export const Table: React.FC<TableProps> = ({ 
  columns, 
  data, 
  keyExtractor,
  emptyMessage = "Tidak ada data"
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th key={index} scope="col" className={`px-6 py-4 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr 
                key={keyExtractor(row)} 
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`px-6 py-4 ${col.className || ''}`}>
                    {typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
