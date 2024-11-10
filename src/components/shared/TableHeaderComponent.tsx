import React from "react";

// Define prop types for the component
interface TableHeaderProps {
  headers: string[];
}

const TableHeaderComponent: React.FC<TableHeaderProps> = ({ headers }) => {
  return (
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th
            key={index}
            className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeaderComponent;
