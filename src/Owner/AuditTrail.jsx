import React, { useEffect, useMemo, useState } from "react";
import "./AuditTrail.css";

const API_BASE = "https://kzeraeinne.infinityfreeapp.com";

function AuditTrail() {
  const [logs, setLogs] = useState([]);

  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD AUDIT LOGS
  // =========================================================
  async function loadAuditLogs() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/Api/Audit/List.php`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to load audit logs."
        );
      }

      const auditLogs =
        Array.isArray(result.data?.audit_logs)
          ? result.data.audit_logs
          : [];

      setLogs(auditLogs);

    } catch (err) {
      console.error(
        "Audit Trail error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to audit log API."
      );

      setLogs([]);

    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // LOAD WHEN PAGE OPENS
  // =========================================================
  useEffect(() => {
    loadAuditLogs();
  }, []);

  // =========================================================
  // MODULE FILTER OPTIONS
  // =========================================================
  const modules = useMemo(() => {
    return [
      ...new Set(
        logs
          .map((log) => log.module)
          .filter(Boolean)
      ),
    ].sort();
  }, [logs]);

  // =========================================================
  // ACTION FILTER OPTIONS
  // =========================================================
  const actions = useMemo(() => {
    return [
      ...new Set(
        logs
          .map((log) => log.action)
          .filter(Boolean)
      ),
    ].sort();
  }, [logs]);

  // =========================================================
  // FILTER LOGS
  // =========================================================
  const filteredLogs = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        !keyword ||
        String(log.date || "")
          .toLowerCase()
          .includes(keyword) ||
        String(log.action || "")
          .toLowerCase()
          .includes(keyword) ||
        String(log.module || "")
          .toLowerCase()
          .includes(keyword) ||
        String(log.user || "")
          .toLowerCase()
          .includes(keyword) ||
        String(log.reference || "")
          .toLowerCase()
          .includes(keyword) ||
        String(log.details || "")
          .toLowerCase()
          .includes(keyword) ||
        String(log.audit_code || "")
          .toLowerCase()
          .includes(keyword);

      const matchesModule =
        moduleFilter === "ALL" ||
        log.module === moduleFilter;

      const matchesAction =
        actionFilter === "ALL" ||
        log.action === actionFilter;

      return (
        matchesSearch &&
        matchesModule &&
        matchesAction
      );
    });
  }, [
    logs,
    search,
    moduleFilter,
    actionFilter,
  ]);

  // =========================================================
  // CLEAR FILTERS
  // =========================================================
  const clearFilters = () => {
    setSearch("");
    setModuleFilter("ALL");
    setActionFilter("ALL");
  };

  return (
    <div className="audit-page">
      {/* PAGE HEADER */}
      <div className="audit-header">
        <div className="audit-header-left">
          <div className="audit-eyebrow">
            ACCOUNTABILITY
          </div>

          <h1>
            Audit trail / Activity log
          </h1>

          <p>
            Important actions are retained for
            review and cannot be deleted from the
            interface.
          </p>
        </div>

        <div className="audit-header-badge">
          <span className="audit-header-icon">
            ▤
          </span>

          <span>
            {logs.length} recorded activities
          </span>
        </div>
      </div>

      {/* FILTER BAR */}
      <section className="audit-filter-card">
        <div className="audit-filter-search">
          <label htmlFor="audit-search">
            Search activity
          </label>

          <div className="audit-search-wrapper">
            <span className="audit-search-icon">
              ⌕
            </span>

            <input
              id="audit-search"
              type="text"
              placeholder="Search action, user, module, reference..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </div>

        <div className="audit-filter-field">
          <label htmlFor="audit-module">
            Module
          </label>

          <select
            id="audit-module"
            value={moduleFilter}
            onChange={(e) =>
              setModuleFilter(e.target.value)
            }
          >
            <option value="ALL">
              All modules
            </option>

            {modules.map((module) => (
              <option
                key={module}
                value={module}
              >
                {module}
              </option>
            ))}
          </select>
        </div>

        <div className="audit-filter-field">
          <label htmlFor="audit-action">
            Action
          </label>

          <select
            id="audit-action"
            value={actionFilter}
            onChange={(e) =>
              setActionFilter(e.target.value)
            }
          >
            <option value="ALL">
              All actions
            </option>

            {actions.map((action) => (
              <option
                key={action}
                value={action}
              >
                {action}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="audit-clear-button"
          onClick={clearFilters}
        >
          Clear filters
        </button>
      </section>

      {/* AUDIT TABLE */}
      <section className="audit-table-card">
        <div className="audit-table-header">
          <div>
            <div className="audit-table-eyebrow">
              ACTIVITY RECORDS
            </div>

            <h2>
              Recent activity
            </h2>
          </div>

          <div className="audit-result-count">
            {loading
              ? "Loading..."
              : `${filteredLogs.length} ${
                  filteredLogs.length === 1
                    ? "record"
                    : "records"
                }`}
          </div>
        </div>

        <div className="audit-table-scroll">
          <table className="audit-table">
            <thead>
              <tr>
                <th>DATE &amp; TIME</th>
                <th>ACTION</th>
                <th>MODULE</th>
                <th>USER</th>
                <th>REFERENCE</th>
                <th>DETAILS</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className="audit-empty">
                      <div className="audit-empty-icon">
                        …
                      </div>

                      <h3>
                        Loading activity
                      </h3>

                      <p>
                        Retrieving audit records
                        from the database.
                      </p>
                    </div>
                  </td>
                </tr>

              ) : error ? (

                /* ERROR */
                <tr>
                  <td colSpan="6">
                    <div className="audit-empty">
                      <div className="audit-empty-icon">
                        !
                      </div>

                      <h3>
                        Unable to load activity
                      </h3>

                      <p>
                        {error}
                      </p>

                      <button
                        type="button"
                        onClick={
                          loadAuditLogs
                        }
                        className="audit-empty-button"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>

              ) : filteredLogs.length > 0 ? (

                /* RECORDS */
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span className="audit-date">
                        {log.date}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`audit-action audit-action-${String(
                          log.action || ""
                        )
                          .toLowerCase()
                          .replace(
                            /[^a-z0-9]+/g,
                            "-"
                          )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td>
                      <span className="audit-module">
                        {log.module}
                      </span>
                    </td>

                    <td>
                      <span className="audit-user">
                        {log.user === "System" && (
                          <span className="audit-system-dot" />
                        )}

                        {log.user}
                      </span>
                    </td>

                    <td>
                      <span className="audit-reference">
                        {log.reference}
                      </span>
                    </td>

                    <td>
                      <span className="audit-details">
                        {log.details}
                      </span>
                    </td>
                  </tr>
                ))

              ) : (

                /* EMPTY */
                <tr>
                  <td colSpan="6">
                    <div className="audit-empty">
                      <div className="audit-empty-icon">
                        ⌕
                      </div>

                      <h3>
                        No activity found
                      </h3>

                      <p>
                        No audit records match
                        your current search or
                        filters.
                      </p>

                      <button
                        type="button"
                        onClick={
                          clearFilters
                        }
                        className="audit-empty-button"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECURITY NOTE */}
      <div className="audit-security-note">
        <div className="audit-security-icon">
          ✓
        </div>

        <div>
          <strong>
            Audit records are retained for
            accountability.
          </strong>

          <p>
            Activity records provide a history of
            important operational, financial,
            inventory, and account actions performed
            in the branch system.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuditTrail;