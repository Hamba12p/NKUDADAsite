"use client";

import { useForm, ValidationError } from "@formspree/react";
import { CheckCircle2 } from "lucide-react";

const FORMSPREE_FORM_ID = "xvkpyvwd";

export default function SchoolSignupForm() {
  const [state, submitToFormspree] = useForm(FORMSPREE_FORM_ID);

  function handleSubmit(event) {
    const formData = new FormData(event.currentTarget);
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();

    const summary = {
      schoolName: formData.get("school_name"),
      contactPerson: formData.get("contact_person"),
      contact: phone || email,
      studentCount: formData.get("student_count"),
      preferredDates: formData.get("preferred_dates"),
      _gotcha: formData.get("_gotcha")
    };

    void fetch("/api/school-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(summary)
    }).catch((error) => {
      console.error("School sign-up backup failed:", error);
    });

    return submitToFormspree(event);
  }

  if (state.succeeded) {
    return (
      <div className="school-form-success" role="status">
        <span><CheckCircle2 size={42} /></span>
        <h3>Request received</h3>
        <p>
          Once you submit this form, our team reviews it and reaches out directly, usually within a few
          working days, to confirm dates, numbers, and any topics your school wants adjusted.
        </p>
      </div>
    );
  }

  return (
    <form className="school-signup-form" onSubmit={handleSubmit}>
      <div className="school-form-grid">
        <div className="school-form-field school-form-wide">
          <label htmlFor="school_name">School name</label>
          <input id="school_name" name="school_name" type="text" maxLength={200} required />
        </div>

        <div className="school-form-field">
          <label htmlFor="district_location">District / Location</label>
          <input id="district_location" name="district_location" type="text" maxLength={200} required />
        </div>

        <div className="school-form-field">
          <label htmlFor="contact_person">Contact person's name</label>
          <input id="contact_person" name="contact_person" type="text" maxLength={200} required />
        </div>

        <div className="school-form-field">
          <label htmlFor="school_role">Their role at the school</label>
          <select id="school_role" name="school_role" defaultValue="" required>
            <option value="" disabled>Select a role</option>
            <option>Headteacher</option>
            <option>Deputy</option>
            <option>Matron</option>
            <option>Teacher</option>
            <option>Other</option>
          </select>
        </div>

        <div className="school-form-field">
          <label htmlFor="phone">Phone number</label>
          <input id="phone" name="phone" type="tel" maxLength={200} required />
        </div>

        <div className="school-form-field">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" maxLength={200} required />
        </div>

        <div className="school-form-field">
          <label htmlFor="student_count">Roughly how many students would attend?</label>
          <input id="student_count" name="student_count" type="text" inputMode="numeric" maxLength={200} required />
        </div>

        <div className="school-form-field school-form-wide">
          <label htmlFor="classes_levels">Which classes/levels? (e.g. S.1–S.6, or specify)</label>
          <input id="classes_levels" name="classes_levels" type="text" maxLength={200} required />
        </div>

        <div className="school-form-field school-form-wide">
          <label htmlFor="preferred_dates">Preferred dates or term window</label>
          <input id="preferred_dates" name="preferred_dates" type="text" maxLength={200} required />
        </div>

        <div className="school-form-field school-form-wide">
          <label htmlFor="programme_focus">Anything you'd like us to focus on, or steer away from?</label>
          <textarea id="programme_focus" name="programme_focus" maxLength={200} />
          <p className="school-field-help">Some schools want us to adjust the SRH content — let us know here.</p>
        </div>

        <div className="school-form-field school-form-wide">
          <label htmlFor="referral_source">How did you hear about NK Udada?</label>
          <select id="referral_source" name="referral_source" defaultValue="" required>
            <option value="" disabled>Select one</option>
            <option>Instagram</option>
            <option>Another school</option>
            <option>A partner organisation</option>
            <option>Word of mouth</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="school-honeypot" aria-hidden="true">
        <label htmlFor="_gotcha">Leave this field empty</label>
        <input id="_gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <ValidationError errors={state.errors} className="school-form-error" />
      <button className="school-submit-btn" type="submit" disabled={state.submitting}>
        {state.submitting ? "Submitting…" : "Request a School Visit"}
      </button>
    </form>
  );
}
