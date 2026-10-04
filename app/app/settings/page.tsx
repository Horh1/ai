import { createClient } from "@/lib/supabase/server";
import WorkspaceForm from "./workspace-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.user?.id ?? "")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: organization } = membership?.organization_id
    ? await supabase.from("organizations").select("id, name, industry, description").eq("id", membership.organization_id).single()
    : { data: null };

  return <WorkspaceForm organization={organization} role={membership?.role ?? "manager"} />;
}
