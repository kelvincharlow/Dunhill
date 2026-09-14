"use client";

import { ArrowIcon } from "@/components/arrow-icon";

import { useState, type FormEvent } from "react";
import { projectValues, serviceInterests, validateEnquiry } from "@/lib/enquiry";
import styles from "@/app/contact/contact.module.css";

export function EnquiryForm({ deliveryEnabled, initialService = "", initialDescription = "" }: {deliveryEnabled:boolean; initialService?:string; initialDescription?:string}) {
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
  function clearPreparedDraft() {
    if (draft || status || accepted) { setDraft(""); setStatus(""); setAccepted(false); }
  }
  return <form className={styles.form} onSubmit={submit} onChange={clearPreparedDraft} aria-label="Contact Dunhill" aria-busy={busy}>
    <p className={styles.formNote}>Fields marked * are required.</p>
    {!deliveryEnabled && <p className={styles.notice}>This form prepares an email draft. You’ll review and send it from your email app.</p>}
    <fieldset disabled={busy}><legend className="sr-only">Your enquiry details</legend><div className={styles.fields}>
      <label>Name *<input name="name" autoComplete="name" required maxLength={100} /></label>
      <label>Email *<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      <label className={styles.full}>What can we help with? *<select key={initialService} name="service" defaultValue={initialService} required><option value="" disabled>Select an interest</option>{serviceInterests.map(s=><option key={s}>{s}</option>)}</select></label>
      <label className={styles.full}>Your message *<textarea key={initialDescription} defaultValue={initialDescription} name="description" rows={initialDescription ? 9 : 5} required minLength={10} maxLength={5000} aria-describedby="message-help" placeholder="Tell us what you have in mind, or ask us a question." /><small id="message-help">At least 10 characters. Include your reference or deadline if relevant.</small></label>
    </div></fieldset>
    <details className={styles.optional}><summary>Add contact or project details <span>(optional)</span><i aria-hidden="true">+</i></summary><fieldset disabled={busy}><legend className="sr-only">Optional information</legend><div className={styles.fields}>
      <label>Company<input name="company" autoComplete="organization" maxLength={160} /></label>
      <label>Phone<input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
      <label>Project location<input name="location" maxLength={160} placeholder="Town, county or site" /></label>
      <label>Estimated project value<select name="value" defaultValue="Not specified">{projectValues.map(v=><option key={v}>{v}</option>)}</select></label>
    </div></fieldset></details>
    <div className={styles.trap} aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className={styles.consent}><input name="consent" type="checkbox" required disabled={busy} /><span>I agree that Dunhill may use these details to respond to my enquiry. *</span></label>
    <button className="button" type="submit" disabled={busy}>{busy ? "Submitting…" : deliveryEnabled ? "Submit enquiry" : "Prepare email draft"}<span aria-hidden="true"><ArrowIcon /></span></button>
    <div role="status" aria-live="polite" aria-atomic="true">{status && <p className={styles.feedback}>{status}</p>}</div>
    {draft && !accepted && <a className="text-link" href={draft}>Open email draft <span aria-hidden="true"><ArrowIcon /></span></a>}
    <noscript><p>Please enable JavaScript to use the form, or email info@dunhillbcon.com directly.</p></noscript>
  </form>;
}
