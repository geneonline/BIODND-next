import * as XLSX from "xlsx";

export const exportToXLSX = (data, filename = "export.xlsx") => {
  if (!data || !data.length) {
    console.warn("No data to export");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, filename);
};

export const exportToCSV = (data, filename = "export.csv") => {
  if (!data || !data.length) {
    console.warn("No data to export");
    return;
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Handle null/undefined
          if (value === null || value === undefined) return "";

          // Convert to string
          let stringValue = String(value);

          // Handle objects/arrays (simple stringification)
          if (typeof value === "object") {
            try {
              stringValue = JSON.stringify(value);
            } catch (e) {
              stringValue = "[Object]";
            }
          }

          // Escape quotes and wrap in quotes if contains comma, quote or newline
          if (/[",\n]/.test(stringValue)) {
            stringValue = `"${stringValue.replace(/"/g, '""')}"`;
          }

          return stringValue;
        })
        .join(",")
    ),
  ].join("\n");

  // Create Blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
