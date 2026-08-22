"use client";

import { useMemo, useState } from "react";
import OutreachEditor from "@/components/admin/OutreachEditor";

function formatSubmittedDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export default function OutreachAdminTabs({ outreach, schoolSignups }) {
  const [activeTab, setActiveTab] = useState("roll-call");
  const signups = useMemo(
    () => [...(schoolSignups?.signups || [])].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)),
    [schoolSignups]
  );

  return (
    <div>
      <div className="admin-outreach-tabs" role="tablist" aria-label="Outreach administration">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "roll-call"}
          className={activeTab === "roll-call" ? "active" : ""}
          onClick={() => setActiveTab("roll-call")}
        >
          Outreach Roll Call
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "school-signups"}
          className={activeTab === "school-signups" ? "active" : ""}
          onClick={() => setActiveTab("school-signups")}
        >
          School Sign-ups <span>{signups.length}</span>
        </button>
      </div>

      {activeTab === "roll-call" ? (
        <OutreachEditor initialData={outreach} />
      ) : (
        <section aria-labelledby="school-signups-heading">
          <h1 className="admin-page-title" id="school-signups-heading">School Sign-ups</h1>
          <p className="admin-page-sub">School visit requests submitted through the public partnerships page.</p>

          <div className="admin-card">
            {signups.length === 0 ? (
              <div className="school-signups-empty">No school visit requests have been submitted yet.</div>
            ) : (
              <div className="school-signups-table-wrap">
                <table className="admin-table school-signups-table">
                  <thead>
                    <tr>
                      <th>School name</th>
                      <th>Contact person</th>
                      <th>Contact</th>
                      <th>Student count</th>
                      <th>Preferred dates</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signups.map((signup) => (
                      <tr key={signup.id}>
                        <td data-label="School name"><strong>{signup.schoolName}</strong></td>
                        <td data-label="Contact person">{signup.contactPerson}</td>
                        <td data-label="Contact">{signup.contact}</td>
                        <td data-label="Student count">{signup.studentCount}</td>
                        <td data-label="Preferred dates">{signup.preferredDates}</td>
                        <td data-label="Submitted">{formatSubmittedDate(signup.addedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
