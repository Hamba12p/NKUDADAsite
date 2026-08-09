"use client";

import { useMemo, useState } from "react";
import { Save, CheckCircle2, AlertCircle, Trash2, Plus, ClipboardPaste, Download } from "lucide-react";
import { Card, Field, FieldRow, Checkbox } from "./FormPrimitives";
import { suggestGender } from "@/lib/genderSuggest";

// Turns pasted text into rows. Each line can be a bare name, or
// comma/tab-separated "Name, Age/Grade, School" — detected per line so a
// paste can mix both formats.
function parsePastedBlock(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      let parts;
      if (line.includes("\t")) parts = line.split("\t").map((p) => p.trim());
      else if (line.split(",").length >= 2) parts = line.split(",").map((p) => p.trim());
      else parts = [line];
      const [name = "", age = "", school = ""] = parts;
      return { name, age, school };
    })
    .filter((row) => row.name);
}

function makeId() {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function newStudent({ name, age = "", school = "" }) {
  return {
    id: makeId(),
    name,
    gender: suggestGender(name),
    age,
    school,
    health: "",
    consent: false,
    addedAt: new Date().toISOString()
  };
}

export default function OutreachEditor({ initialData }) {
  const [fieldsOn, setFieldsOn] = useState({ age: true, school: true, health: true, consent: true });
  const [students, setStudents] = useState(
    (initialData?.students || []).map((s) => ({ health: "", consent: false, ...s }))
  );
  const [pasteText, setPasteText] = useState("");
  const [singleName, setSingleName] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const stats = useMemo(() => {
    const girls = students.filter((s) => s.gender === "Girl").length;
    const boys = students.filter((s) => s.gender === "Boy").length;
    const unspec = students.filter((s) => s.gender === "Unspecified").length;
    return { total: students.length, girls, boys, unspec };
  }, [students]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || (s.school || "").toLowerCase().includes(q)
    );
  }, [students, search]);

  function addFromPaste() {
    const rows = parsePastedBlock(pasteText);
    if (!rows.length) return;
    setStudents((prev) => [...prev, ...rows.map((r) => newStudent(r))]);
    setPasteText("");
  }

  function addSingle() {
    if (!singleName.trim()) return;
    setStudents((prev) => [...prev, newStudent({ name: singleName.trim() })]);
    setSingleName("");
  }

  function updateStudent(id, key, value) {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  }

  function removeStudent(id) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleSave() {
    setStatus("saving");
    setMessage("");
    // Only non-sensitive fields are sent — health notes and consent never
    // leave the browser via this button. The API also enforces this itself.
    const payload = {
      students: students.map(({ id, name, gender, age, school, addedAt }) => ({
        id,
        name,
        gender,
        age,
        school,
        addedAt
      }))
    };
    try {
      const res = await fetch("/api/admin/outreach", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(result.error || "Save failed.");
        return;
      }
      setStatus("success");
      setMessage(`Saved ${result.saved} student(s) to the site. It will rebuild in about a minute.`);
    } catch {
      setStatus("error");
      setMessage("Network error — try again.");
    }
  }

  async function handleExport() {
    if (!students.length) return;
    const XLSX = await import("xlsx");
    const rows = students.map((s) => {
      const row = { Name: s.name, Gender: s.gender };
      if (fieldsOn.age) row["Age / Grade"] = s.age;
      if (fieldsOn.school) row["School"] = s.school;
      if (fieldsOn.health) row["Health notes"] = s.health;
      if (fieldsOn.consent) row["Consent / photo permission"] = s.consent ? "Yes" : "No";
      row["Added"] = new Date(s.addedAt).toLocaleString();
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Outreach");
    const summary = [
      { Metric: "Total registered", Value: stats.total },
      { Metric: "Girls", Value: stats.girls },
      { Metric: "Boys", Value: stats.boys },
      { Metric: "Not specified", Value: stats.unspec },
      { Metric: "Exported on", Value: new Date().toLocaleString() }
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), "Summary");
    XLSX.writeFile(wb, `outreach-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  return (
    <div>
      <h1 className="admin-page-title">Outreach Roll Call</h1>
      <p className="admin-page-sub">
        Register kids at today's outreach — paste a list of names or add them one at a time.
      </p>

      <div className="outreach-note">
        <strong>How saving works here:</strong> "Save to site" commits names, gender, age/grade and school
        to the site's repo. Health notes and consent are kept in this browser tab only and are never
        committed — use "Export Excel" to take those with you.
      </div>

      <Card title="Paste multiple students">
        <div className="admin-field">
          <label>One student per line — plain names, or "Name, Age/Grade, School"</label>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={"Sarah Nakato\nJohn Okello, 10, Kitante Primary School\nProscovia Auma\t8\tGayaza Road PS"}
            style={{ minHeight: "120px" }}
          />
        </div>
        <button type="button" className="admin-add-btn" onClick={addFromPaste}>
          <ClipboardPaste size={14} /> Add pasted students
        </button>
      </Card>

      <Card title="Add one student">
        <FieldRow>
          <Field label="Full name" value={singleName} onChange={setSingleName} />
        </FieldRow>
        <button type="button" className="admin-add-btn" onClick={addSingle}>
          <Plus size={14} /> Add student
        </button>
      </Card>

      <Card title="Fields to collect">
        <Checkbox label="Age / Grade" checked={fieldsOn.age} onChange={(v) => setFieldsOn((p) => ({ ...p, age: v }))} />
        <Checkbox label="School name" checked={fieldsOn.school} onChange={(v) => setFieldsOn((p) => ({ ...p, school: v }))} />
        <Checkbox label="Health notes (local + export only)" checked={fieldsOn.health} onChange={(v) => setFieldsOn((p) => ({ ...p, health: v }))} />
        <Checkbox label="Consent / photo permission (local + export only)" checked={fieldsOn.consent} onChange={(v) => setFieldsOn((p) => ({ ...p, consent: v }))} />
      </Card>

      <Card title={`Students (${stats.total})`}>
        <div className="outreach-stats">
          <span className="outreach-pill">Total: {stats.total}</span>
          <span className="outreach-pill girl">Girls: {stats.girls}</span>
          <span className="outreach-pill boy">Boys: {stats.boys}</span>
          <span className="outreach-pill unspec">Not specified: {stats.unspec}</span>
        </div>
        <div className="admin-field">
          <input
            type="text"
            placeholder="Search by name or school…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <p style={{ fontSize: "13px", color: "var(--muted)" }}>
            No students yet — paste a list above or add one by hand.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  {fieldsOn.age && <th>Age / Grade</th>}
                  {fieldsOn.school && <th>School</th>}
                  {fieldsOn.health && <th>Health notes</th>}
                  {fieldsOn.consent && <th>Consent</th>}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const initials = s.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
                  const genderClass = s.gender === "Girl" ? "girl" : s.gender === "Boy" ? "boy" : "unspec";
                  const avatarColor = s.gender === "Girl" ? "var(--gold)" : s.gender === "Boy" ? "var(--purple)" : "var(--muted)";
                  return (
                    <tr key={s.id}>
                      <td>
                        <div className="outreach-name-cell">
                          <span className="outreach-avatar" style={{ background: avatarColor }}>{initials}</span>
                          {s.name}
                        </div>
                      </td>
                      <td>
                        <select
                          className={`outreach-gender-select ${genderClass}`}
                          value={s.gender}
                          onChange={(e) => updateStudent(s.id, "gender", e.target.value)}
                        >
                          <option value="Girl">Girl</option>
                          <option value="Boy">Boy</option>
                          <option value="Unspecified">Not specified</option>
                        </select>
                      </td>
                      {fieldsOn.age && (
                        <td>
                          <input
                            className="outreach-table-input"
                            value={s.age}
                            onChange={(e) => updateStudent(s.id, "age", e.target.value)}
                          />
                        </td>
                      )}
                      {fieldsOn.school && (
                        <td>
                          <input
                            className="outreach-table-input"
                            value={s.school}
                            onChange={(e) => updateStudent(s.id, "school", e.target.value)}
                          />
                        </td>
                      )}
                      {fieldsOn.health && (
                        <td>
                          <input
                            className="outreach-table-input"
                            value={s.health}
                            placeholder="none"
                            onChange={(e) => updateStudent(s.id, "health", e.target.value)}
                          />
                        </td>
                      )}
                      {fieldsOn.consent && (
                        <td style={{ textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={s.consent}
                            onChange={(e) => updateStudent(s.id, "consent", e.target.checked)}
                          />
                        </td>
                      )}
                      <td className="admin-table-actions">
                        <button
                          type="button"
                          className="admin-icon-btn danger"
                          onClick={() => removeStudent(s.id)}
                          aria-label={`Remove ${s.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="admin-save-bar">
        <button className="admin-save-btn" onClick={handleSave} disabled={status === "saving"}>
          <Save size={15} /> {status === "saving" ? "Saving…" : "Save to site"}
        </button>
        <button type="button" className="admin-add-btn" onClick={handleExport}>
          <Download size={14} /> Export Excel
        </button>
        {status === "success" && (
          <span className="admin-save-status success">
            <CheckCircle2 size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} />
            {message}
          </span>
        )}
        {status === "error" && (
          <span className="admin-save-status error">
            <AlertCircle size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} />
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
