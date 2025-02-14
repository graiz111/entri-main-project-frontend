import React from "react";

const Card = ({ children }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      {children}
    </div>
  );
};

export const CardHeader = ({ children }) => (
  <div className="font-bold text-lg mb-2">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h2 className="text-xl font-semibold">{children}</h2>
);

export const CardContent = ({ children }) => (
  <div className="text-gray-700">{children}</div>
);

export default Card;
