"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AdminShell } from "./admin-shell";
import { DataTable } from "./data-table";
import { ProtectedPage } from "./protected-page";
import { apiFetch } from "@/lib/api";

export type ResourceField = {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "datetime-local" | "select" | "checkbox";
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  createOnly?: boolean;
  editOnly?: boolean;
  placeholder?: string;
};

export function ResourcePage({
  title,
  endpoint,
  columns,
  fields,
  readOnly = false
}: {
  title: string;
  endpoint: string;
  columns: string[];
  fields?: ResourceField[];
  readOnly?: boolean;
}) {
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, string | boolean>>({});

  const load = useCallback(async () => {
    const result = await apiFetch<Array<Record<string, unknown>>>(endpoint);
    if (result.error) setError(result.error);
    if (result.data) setRows(result.data);
  }, [endpoint]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const filtered = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));
  const visibleFields = useMemo(
    () => (fields ?? []).filter((field) => (editing ? !field.createOnly : !field.editOnly)),
    [editing, fields]
  );

  function startCreate() {
    setEditing(null);
    setForm({});
    setError("");
    setSuccess("");
  }

  function startEdit(row: Record<string, unknown>) {
    const next: Record<string, string | boolean> = {};
    for (const field of fields ?? []) {
      const value = row[field.name];
      if (field.type === "checkbox") next[field.name] = Boolean(value);
      else if (field.type === "datetime-local" && value) next[field.name] = String(value).slice(0, 16);
      else if (!field.createOnly) next[field.name] = value == null ? "" : String(value);
    }
    setEditing(row);
    setForm(next);
    setError("");
    setSuccess("");
  }

  function cleanPayload() {
    return Object.fromEntries(
      Object.entries(form).filter(([, value]) => {
        if (typeof value === "boolean") return true;
        return value.trim() !== "";
      })
    );
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const id = editing?._id ? String(editing._id) : "";
    const result = await apiFetch<Record<string, unknown>>(editing ? `${endpoint}/${id}` : endpoint, {
      method: editing ? "PATCH" : "POST",
      body: JSON.stringify(cleanPayload())
    });
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(`${title.slice(0, -1) || title} ${editing ? "updated" : "created"} successfully.`);
    setEditing(null);
    setForm({});
    await load();
  }

  async function remove(row: Record<string, unknown>) {
    const id = row._id ? String(row._id) : "";
    if (!id) return;
    if (!window.confirm(`Delete this ${title.toLowerCase()} record?`)) return;
    setError("");
    setSuccess("");
    const result = await apiFetch<Record<string, unknown>>(`${endpoint}/${id}`, { method: "DELETE" });
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess("Record deleted successfully.");
    await load();
  }

  return (
    <ProtectedPage>
      <AdminShell title={title}>
        {!readOnly && fields?.length ? (
          <form className="card crud-form" onSubmit={submit}>
            <div className="form-header">
              <h2>{editing ? `Edit ${title}` : `Create ${title}`}</h2>
              <button className="button secondary" type="button" onClick={startCreate}>
                New
              </button>
            </div>
            <div className="form-grid">
              {visibleFields.map((field) => (
                <label key={field.name} className="field">
                  <span>{field.label}</span>
                  {field.type === "select" ? (
                    <select
                      className="input"
                      required={field.required && !editing}
                      value={String(form[field.name] ?? "")}
                      onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                    >
                      <option value="">Select</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={Boolean(form[field.name])}
                      onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.checked }))}
                    />
                  ) : (
                    <input
                      className="input"
                      type={field.type ?? "text"}
                      required={field.required && !editing}
                      placeholder={field.placeholder}
                      value={String(form[field.name] ?? "")}
                      onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="form-actions">
              <button className="button" type="submit">
                {editing ? "Save Changes" : "Create"}
              </button>
              {editing ? (
                <button className="button secondary" type="button" onClick={startCreate}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        ) : null}
        <div className="toolbar">
          <input className="input" placeholder="Search records" value={search} onChange={(event) => setSearch(event.target.value)} />
          <button className="button" type="button" onClick={load}>
            Refresh
          </button>
        </div>
        {error ? <div className="card" style={{ color: "var(--danger)", marginBottom: 16 }}>{error}</div> : null}
        {success ? <div className="card" style={{ color: "var(--primary)", marginBottom: 16 }}>{success}</div> : null}
        <DataTable columns={columns} rows={filtered} onEdit={readOnly ? undefined : startEdit} onDelete={readOnly ? undefined : remove} />
      </AdminShell>
    </ProtectedPage>
  );
}
