"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { credentialGroups, credentialDocuments } from "@/lib/credentials";
import styles from "@/app/compliance/compliance.module.css";

export function CredentialRequest() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();
  const allSelected = selected.length === credentialDocuments.length;
  function continueRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    params.set("service", "Compliance documents");
    for (const id of new FormData(event.currentTarget).getAll("documents")) params.append("documents", String(id));
    router.push(`/contact?${params}#enquiry`);
  }
  return <form className={styles.requestLayout} action="/contact#enquiry" method="get" onSubmit={continueRequest} aria-label="Choose credentials to request">
    <input type="hidden" name="service" value="Compliance documents" />
    <div><div className={styles.registerHeading}><h2 id="register-title">Choose what you need.</h2><button type="button" onClick={() => setSelected(allSelected ? [] : credentialDocuments.map(document => document.id))}>{allSelected ? "Clear selection" : "Select all documents"}</button></div>
      <div className={styles.groups}>{credentialGroups.map((group, index) => <fieldset key={group.title}><legend><span>0{index + 1}</span>{group.title}</legend><p>{group.description}</p>{group.documents.map(document => <label className={styles.document} key={document.id}><input type="checkbox" name="documents" value={document.id} checked={selected.includes(document.id)} onChange={event => setSelected(current => event.target.checked ? [...current, document.id] : current.filter(id => id !== document.id))} /><span>{document.title}</span><svg viewBox="0 0 24 28" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M4 2h10l6 6v18H4ZM14 2v6h6M8 13h8M8 17h8M8 21h5" /></svg></label>)}</fieldset>)}</div>
    </div>
    <aside className={styles.summary} aria-labelledby="request-title"><p className="eyebrow">YOUR DOCUMENT REQUEST</p><h2 id="request-title">One request.<br /><em>Everything you need.</em></h2><p className={styles.selectionCount} role="status">{selected.length} {selected.length === 1 ? "document selected" : "documents selected"}</p>{selected.length ? <ul>{credentialDocuments.filter(document => selected.includes(document.id)).map(document => <li key={document.id}>{document.title}</li>)}</ul> : <p className={styles.empty}>Choose individual documents, select the full list, or continue with a general credentials enquiry.</p>}<button type="submit" className="button">Continue to request <span aria-hidden="true">↗</span></button><p className={styles.nextStep}>Next: add your contact details, project reference and deadline. Your selected documents will be included.</p><a className="text-link" href="mailto:info@dunhillbcon.com?subject=Company%20credentials%20enquiry">Email the team directly <span aria-hidden="true">↗</span></a></aside>
  </form>;
}
