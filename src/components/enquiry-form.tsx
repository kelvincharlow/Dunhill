"use client";
import { useState, type FormEvent } from "react";
import { projectValues, serviceInterests, validateEnquiry } from "@/lib/enquiry";
import styles from "@/app/contact/contact.module.css";

export function EnquiryForm({ deliveryEnabled }: {deliveryEnabled:boolean}) {
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState("");
  const [draft,setDraft]=useState("");
  const [accepted,setAccepted]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); if(busy)return;
    setStatus("");setDraft("");setAccepted(false);
    const form=event.currentTarget;
    const raw=Object.fromEntries(new FormData(form));
    const result=validateEnquiry({...raw,consent:raw.consent==="on"});
    if(!result.data){setStatus(result.error || "Please check your details.");return;}
    const d=result.data;
    const body=`Name: ${d.name}\nCompany: ${d.company || "Not specified"}\nEmail: ${d.email}\nPhone: ${d.phone || "Not specified"}\nInterest: ${d.service}\nLocation: ${d.location || "Not specified"}\nEstimated value: ${d.value}\n\n${d.description}`;
    const draftUrl=`mailto:info@dunhillbcon.com?subject=${encodeURIComponent(`${d.service} enquiry — ${d.name}`)}&body=${encodeURIComponent(body)}`;
    setDraft(draftUrl);
    if(!deliveryEnabled){setStatus("Your email draft is ready. Nothing has been sent. Open it below and send it from your email app.");return;}
    setBusy(true);
    try {
      const response=await fetch("/api/enquiry",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d),signal:AbortSignal.timeout(15000)});
      const answer=await response.json();
      if(!response.ok || answer.accepted!==true)throw new Error(answer.error || "Delivery could not be confirmed.");
      setAccepted(true);setDraft("");setStatus("Your enquiry has been accepted for delivery. Thank you for contacting Dunhill.");form.reset();
    }catch(error){setStatus(error instanceof Error && error.name!=="TimeoutError" ? error.message : "Delivery could not be confirmed. Your details are still here; you can use the email draft below.");}
    finally{setBusy(false);}
  }
  return <form className={styles.form} onSubmit={submit} aria-label="Contact Dunhill" aria-busy={busy}>
    <p className={styles.formNote}>Fields marked * are required. Company, phone and project details can be left blank for a general enquiry.</p>
    {!deliveryEnabled && <p className={styles.notice}>Online submission is being connected. For now, this form prepares an email draft for you to send.</p>}
    <fieldset disabled={busy}><legend>Your details</legend><div className={styles.fields}>
      <label>Name *<input name="name" autoComplete="name" required maxLength={100} /></label>
      <label>Company <span>(optional)</span><input name="company" autoComplete="organization" maxLength={160} /></label>
      <label>Email *<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      <label>Phone <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
    </div></fieldset>
    <fieldset disabled={busy}><legend>How can we help?</legend><div className={styles.fields}>
      <label className={styles.full}>Service or enquiry interest *<select name="service" defaultValue="" required><option value="" disabled>Select an interest</option>{serviceInterests.map(s=><option key={s}>{s}</option>)}</select></label>
      <label>Project location <span>(optional)</span><input name="location" maxLength={160} placeholder="Town, county or site location" /></label>
      <label>Estimated project value <span>(optional)</span><select name="value" defaultValue="Not specified">{projectValues.map(v=><option key={v}>{v}</option>)}</select></label>
      <label className={styles.full}>Project description or message *<textarea name="description" rows={6} required minLength={10} maxLength={5000} placeholder="Tell us about your project, requirements, timeline or question." /><small>10–5,000 characters. Please don’t include sensitive documents or financial account details.</small></label>
    </div></fieldset>
    <div className={styles.trap} aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className={styles.consent}><input name="consent" type="checkbox" required disabled={busy} /><span>I agree that Dunhill may use these details to respond to my enquiry. *</span></label>
    <p className={styles.formNote}>Please provide only the information needed for your enquiry. An email draft stays in your email app until you send it.</p>
    <button className="button" type="submit" disabled={busy}>{busy ? "Submitting…" : deliveryEnabled ? "Submit enquiry" : "Prepare email enquiry"}<span aria-hidden="true">↗</span></button>
    <div role="status" aria-live="polite" aria-atomic="true">{status && <p className={styles.feedback}>{status}</p>}</div>
    {draft && !accepted && <a className="text-link" href={draft}>Open email draft <span aria-hidden="true">↗</span></a>}
    <noscript><p>Please enable JavaScript to use the form, or email info@dunhillbcon.com directly.</p></noscript>
  </form>;
}
