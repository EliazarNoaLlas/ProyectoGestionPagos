import PropTypes from "prop-types";

export const Table = ({ children, ...props }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse border border-gray-200" {...props}>
      {children}
    </table>
  </div>
);

Table.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-100">{children}</thead>
);

TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

TableBody.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TableRow = ({ children }) => (
  <tr className="border-b border-gray-200">{children}</tr>
);

TableRow.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TableHead = ({ children }) => (
  <th className="px-4 py-2 text-left font-medium">{children}</th>
);

TableHead.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TableCell = ({ children }) => (
  <td className="px-4 py-2">{children}</td>
);

TableCell.propTypes = {
  children: PropTypes.node.isRequired,
};
