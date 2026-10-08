import "./Reports.css";

function Reports() {
  const reports = [
    {
      title: "Sales Report",
      description: "Sales and product performance",
      type: "sales",
    },
    {
      title: "Product Sales Report",
      description: "Sales performance by product",
      type: "product-sales",
    },
    {
      title: "Category Sales Report",
      description: "Sales performance by category",
      type: "category-sales",
    },
    {
      title: "Inventory Report",
      description: "Current ingredient stock levels",
      type: "inventory",
    },
    {
      title: "Inventory Movement Report",
      description: "Stock additions, deductions, and adjustments",
      type: "inventory-movement",
    },
    {
      title: "Waste Report",
      description: "Waste, spoilage, and adjustment records",
      type: "waste",
    },
    {
      title: "Purchasing Report",
      description: "Purchase orders and procurement records",
      type: "purchasing",
    },
    {
      title: "Receiving Variance Report",
      description: "Ordered quantities compared with received quantities",
      type: "receiving-variance",
    },
    {
      title: "Inventory Reconciliation Report",
      description: "Physical count and inventory variances",
      type: "inventory-reconciliation",
    },
    {
      title: "Payment Reconciliation Report",
      description: "Recorded payments and collection variances",
      type: "payment-reconciliation",
    },
    {
      title: "Operating Expenses Report",
      description: "Branch operating expenses",
      type: "expenses",
    },
    {
      title: "Audit Trail Report",
      description: "System activities and recorded actions",
      type: "audit",
    },
  ];

  const downloadCSV = (report) => {
    const headers = [
      "Report",
      "Generated Date",
      "Branch",
    ];

    const row = [
      report.title,
      new Date().toLocaleDateString("en-PH"),
      "Putatan, Muntinlupa City",
    ];

    const csv = [
      headers.join(","),
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.type}-report.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">

      {/* HEADER */}
      <div className="reports-header">
        <div>
          <div className="reports-eyebrow">
            EXPORT CENTER
          </div>

          <h1>Reports</h1>

          <p>
            Download branch records and operational reports from the system.
          </p>
        </div>

        <div className="reports-branch">
          <span>BRANCH</span>
          <strong>Putatan, Muntinlupa City</strong>
        </div>
      </div>

      {/* REPORT GRID */}
      <div className="reports-grid">

        {reports.map((report) => (
          <div
            className="report-card"
            key={report.type}
          >

            <div className="report-icon">
              ▦
            </div>

            <h2>{report.title}</h2>

            <p>{report.description}</p>

            <button
              className="export-button"
              onClick={() => downloadCSV(report)}
            >
              <span className="download-symbol">↓</span>
              Export CSV
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Reports;