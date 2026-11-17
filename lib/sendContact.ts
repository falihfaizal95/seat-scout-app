/** Posts a contact form to /api/contact. Resolves on success, throws with a user-facing message otherwise. */
export async function sendContact(fields: Record<string, string>): Promise<void> {
  let res: Response;
  try {
    res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
  } catch {
    throw new Error("Network error. Please check your connection and try again.");
  }
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error || "Something went wrong. Please try again.");
  }
}
