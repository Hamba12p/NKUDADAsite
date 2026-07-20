"use client";

import { useState } from "react";
import { PartyPopper } from "lucide-react";

export default function VolunteerForm({ volunteer }) {
  const [status, setStatus] = useState("idle"); // idle | sending | error | success
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const form = e.target;
    try {
      const res = await fetch(volunteer.formEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg("Something went wrong — try again");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error — try again");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success visible">
        <div className="form-success-icon">
          <PartyPopper size={40} />
        </div>
        <h3>{volunteer.successTitle}</h3>
        <p>{volunteer.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="first_name" placeholder="Amina" required />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="last_name" placeholder="Nakato" required />
        </div>
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" name="email" placeholder="you@example.com" required />
      </div>
      <div className="form-group">
        <label>Phone / WhatsApp</label>
        <input type="tel" name="phone" placeholder="+256 7XX XXX XXX" />
      </div>
      <div className="form-group">
        <label>Area of Interest</label>
        <select name="area_of_interest" required defaultValue="">
          <option value="" disabled>Select your area...</option>
          {volunteer.areasOfInterest.map((area) => (
            <option key={area}>{area}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Why do you want to volunteer? (optional)</label>
        <textarea
          name="motivation"
          placeholder="Tell us a little about yourself and why NK Udada's mission resonates with you..."
        ></textarea>
      </div>
      <button type="submit" className="btn-submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Submit Interest →"}
      </button>
      {status === "error" && (
        <p className="form-note" style={{ color: "var(--gold-lt)" }}>{errorMsg}</p>
      )}
      <p className="form-note">{volunteer.formNote}</p>
    </form>
  );
}
