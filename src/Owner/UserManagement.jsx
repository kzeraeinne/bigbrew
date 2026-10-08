import React, { useMemo, useState } from "react";
import "./UserManagement.css";

const INITIAL_USERS = [
  {
    id: 1,
    name: "Branch Owner",
    username: "owner",
    role: "OWNER",
    active: true,
    lastLogin: "Oct 5, 2026, 1:30 AM",
  },
  {
    id: 2,
    name: "Cashier-Barista",
    username: "cashier",
    role: "CASHIER-BARISTA",
    active: true,
    lastLogin: "Never",
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState(INITIAL_USERS);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("CASHIER-BARISTA");

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const activeUsers = users.filter((user) => user.active).length;

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return users;
    }

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.username.toLowerCase().includes(value) ||
        user.role.toLowerCase().includes(value)
    );
  }, [users, search]);

  function handleAddUser(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = fullName.trim();
    const cleanUsername = username.trim();

    if (!cleanName || !cleanUsername) {
      setError("Please enter the full name and username.");
      return;
    }

    const usernameExists = users.some(
      (user) => user.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (usernameExists) {
      setError("That username already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: cleanName,
      username: cleanUsername,
      role,
      active: true,
      lastLogin: "Never",
    };

    setUsers((currentUsers) => [...currentUsers, newUser]);

    setFullName("");
    setUsername("");
    setRole("CASHIER-BARISTA");

    setSuccess(`${cleanName} was added successfully.`);

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  }

  function toggleUser(userId) {
    const selectedUser = users.find((user) => user.id === userId);

    if (!selectedUser) return;

    // Prevent deactivating the main Owner account.
    if (selectedUser.username === "owner") {
      setError("The main Owner account cannot be deactivated.");

      setTimeout(() => {
        setError("");
      }, 3000);

      return;
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              active: !user.active,
            }
          : user
      )
    );

    setSuccess(
      selectedUser.active
        ? `${selectedUser.name} has been deactivated.`
        : `${selectedUser.name} has been activated.`
    );

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  }

  return (
    <section className="user-management-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="um-page-header">
        <div className="um-header-text">
          <div className="um-eyebrow">
            TEAM ACCESS
          </div>

          <h1>User management</h1>

          <p>
            Manage employee accounts and role-based access for your Putatan
            branch.
          </p>
        </div>

        <div className="um-active-counter">
          <span className="um-counter-number">
            {activeUsers}
          </span>

          <span className="um-counter-label">
            active users
          </span>
        </div>
      </div>

      {/* =========================================
          NOTIFICATIONS
      ========================================= */}

      {error && (
        <div className="um-alert um-alert-error">
          <span className="um-alert-icon">!</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="um-alert um-alert-success">
          <span className="um-alert-icon">✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* =========================================
          TOP CONTENT
      ========================================= */}

      <div className="um-top-grid">

        {/* OWNER CONTROL CARD */}

        <div className="um-control-card">

          <div className="um-control-icon">
            ✓
          </div>

          <div className="um-control-content">

            <h2>
              Owner-controlled access
            </h2>

            <p>
              Only the Owner can create, deactivate, and manage staff
              accounts.
            </p>

            <p>
              Cashier-Barista accounts have access only to daily branch
              operations.
            </p>

          </div>

        </div>

        {/* ADD USER CARD */}

        <div className="um-add-card">

          <div className="um-section-label">
            ADD USER
          </div>

          <h2>
            New team member
          </h2>

          <form
            className="um-add-form"
            onSubmit={handleAddUser}
          >

            <div className="um-form-field um-name-field">

              <label htmlFor="um-full-name">
                Full name
              </label>

              <input
                id="um-full-name"
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
              />

            </div>

            <div className="um-form-field">

              <label htmlFor="um-username">
                Username
              </label>

              <input
                id="um-username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
              />

            </div>

            <div className="um-form-field">

              <label htmlFor="um-role">
                Role
              </label>

              <select
                id="um-role"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value)
                }
              >
                <option value="CASHIER-BARISTA">
                  CASHIER-BARISTA
                </option>

                <option value="OWNER">
                  OWNER
                </option>
              </select>

            </div>

            <button
              type="submit"
              className="um-add-button"
            >
              Add user
            </button>

          </form>

        </div>

      </div>

      {/* =========================================
          TEAM MEMBERS
      ========================================= */}

      <div className="um-team-section">

        <div className="um-team-header">

          <div>
            <div className="um-section-label">
              TEAM MEMBERS
            </div>

            <h2>
              Branch accounts
            </h2>
          </div>

          <div className="um-search-wrapper">

            <span className="um-search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search users"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

        </div>

        {/* =========================================
            USER TABLE
        ========================================= */}

        <div className="um-table-card">

          <div className="um-table-wrapper">

            <table className="um-users-table">

              <thead>
                <tr>
                  <th>
                    NAME
                  </th>

                  <th>
                    USERNAME
                  </th>

                  <th>
                    ROLE
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    LAST LOGIN
                  </th>

                  <th>
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>

                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="um-empty"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>

                      <td>

                        <div className="um-user-name">

                          <div className="um-avatar">
                            {user.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {user.name}
                            </strong>

                            <span>
                              Branch account
                            </span>
                          </div>

                        </div>

                      </td>

                      <td>
                        <span className="um-username">
                          @{user.username}
                        </span>
                      </td>

                      <td>

                        <span
                          className={`um-role-badge ${
                            user.role === "OWNER"
                              ? "um-role-owner"
                              : "um-role-cashier"
                          }`}
                        >
                          {user.role}
                        </span>

                      </td>

                      <td>

                        <span
                          className={`um-status ${
                            user.active
                              ? "um-status-active"
                              : "um-status-inactive"
                          }`}
                        >
                          <span className="um-status-dot"></span>

                          {user.active
                            ? "ACTIVE"
                            : "INACTIVE"}
                        </span>

                      </td>

                      <td>

                        <span className="um-last-login">
                          {user.lastLogin}
                        </span>

                      </td>

                      <td>

                        {user.username === "owner" ? (
                          <span className="um-protected">
                            Protected
                          </span>
                        ) : (
                          <button
                            type="button"
                            className={`um-action-button ${
                              user.active
                                ? "um-deactivate"
                                : "um-activate"
                            }`}
                            onClick={() =>
                              toggleUser(user.id)
                            }
                          >
                            {user.active
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        )}

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </section>
  );
}

