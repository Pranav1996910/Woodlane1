import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth"
import { AdminDashboard } from "@/components/admin-dashboard"

// Server Component gate: this is the actual security boundary for the page
// (the API routes under app/api/admin/* check the same cookie again
// independently, since a page-level redirect alone wouldn't stop someone
// calling those routes directly). The old version of this page was a client
// component that checked `localStorage.adminAuth` in a useEffect — trivial to
// bypass, and it let the real content flash on screen before redirecting.
export default async function AdminPage() {
  const store = await cookies()
  const authed = verifyAdminSessionToken(store.get(ADMIN_SESSION_COOKIE)?.value)
  if (!authed) redirect("/admin/login")

  return <AdminDashboard />
}
