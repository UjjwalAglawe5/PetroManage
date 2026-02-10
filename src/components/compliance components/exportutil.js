import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const handleExport = (format, data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        alert("No data available to export");
        return;
    }

    const fileName = `Export_${new Date().toISOString().split('T')[0]}`;
    const isAuditLog = data[0].hasOwnProperty('action');

    let headers = [];
    let rows = [];

    if (isAuditLog) {
        headers = ["Report ID", "Action", "User", "Old Value", "New Value", "Timestamp"];
        rows = data.map(l => [
            l.reportIdDisplay || "—",
            l.action || "UPDATE",
            l.user || "System",
            l.oldValue || "—",
            l.newValue || "—",
            l.timestamp || ""
        ]);
    } else {
        // 1. EXPANDED HEADERS: Added Inspector, Next Audit, Generated, and Last Updated
        headers = ["ID", "Asset", "Type", "Score", "Status", "Inspector", "Next Audit", "Generated", "Last Updated"];

        rows = data.map(r => [
            r.reportId || "—",
            r.assetName || "—",
            r.reportType?.replace(/_/g, ' ') || "—",
            `${r.safetyScore}%`,
            r.complianceStatus || "—",
            r.inspector || "—",
            r.nextAuditDate || "—",
            r.generatedDate || "—",
            // 2. DATE FORMATTING: Splitting the ISO string at 'T' to get only YYYY-MM-DD
            r.lastUpdatedDate ? r.lastUpdatedDate.split('T')[0] : "—"
        ]);
    }

    switch (format) {
        case "json":
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${fileName}.json`;
            link.click();
            URL.revokeObjectURL(url);
            break;

        case "csv":
        case "excel":
            // 3. CLEANING DATA FOR EXCEL/CSV: 
            // We map the data to format the date before XLSX conversion
            const cleanedData = data.map(item => ({
                ...item,
                lastUpdatedDate: item.lastUpdatedDate ? item.lastUpdatedDate.split('T')[0] : "—"
            }));
            const ws = XLSX.utils.json_to_sheet(cleanedData);
            if (format === "csv") {
                const csv = XLSX.utils.sheet_to_csv(ws);
                const csvBlob = new Blob([csv], { type: "text/csv" });
                const csvUrl = URL.createObjectURL(csvBlob);
                const csvLink = document.createElement("a");
                csvLink.href = csvUrl;
                csvLink.download = `${fileName}.csv`;
                csvLink.click();
            } else {
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Reports");
                XLSX.writeFile(wb, `${fileName}.xlsx`);
            }
            break;

        case "pdf":
            const doc = new jsPDF("l", "mm", "a4");
            doc.setFontSize(16);
            doc.text(isAuditLog ? "System Audit History" : "Compliance Reports", 14, 15);

            autoTable(doc, {
                head: [headers],
                body: rows,
                startY: 20,
                // 4. COLUMN WIDTH TUNING: Ensures 9 columns fit on A4 Landscape
                styles: { fontSize: 7, cellPadding: 2 },
                headStyles: { fillColor: [15, 23, 42] },
                columnStyles: {
                    1: { cellWidth: 40 }, // Asset Name needs more space
                    2: { cellWidth: 35 }  // Type needs more space
                }
            });

            doc.save(`${fileName}.pdf`);
            break;

        default:
            console.warn("Unsupported format:", format);
    }
};