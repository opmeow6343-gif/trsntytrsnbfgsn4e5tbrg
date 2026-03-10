import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) throw new Error("Not authenticated");

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: { user } } = await admin.auth.getUser(authHeader);
    if (!user) throw new Error("Invalid token");

    // Check caller is admin
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) throw new Error("Not authorized");

    const { action, email } = await req.json();

    if (action === "list") {
      const { data: roles } = await admin.from("user_roles").select("user_id").eq("role", "admin");
      const admins: string[] = [];
      for (const role of (roles || [])) {
        const { data: { user: u } } = await admin.auth.admin.getUserById(role.user_id);
        if (u?.email) admins.push(u.email);
      }
      return new Response(JSON.stringify({ admins }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "add") {
      const { data: { users } } = await admin.auth.admin.listUsers();
      const target = users.find((u: any) => u.email === email);
      if (!target) return new Response(JSON.stringify({ error: "User not found. They must create an account first." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
      const { data: existing } = await admin.from("user_roles").select("id").eq("user_id", target.id).eq("role", "admin").maybeSingle();
      if (existing) return new Response(JSON.stringify({ error: "Already an admin" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
      await admin.from("user_roles").insert({ user_id: target.id, role: "admin" });
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "remove") {
      if (email === user.email) return new Response(JSON.stringify({ error: "Cannot remove yourself" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
      const { data: { users } } = await admin.auth.admin.listUsers();
      const target = users.find((u: any) => u.email === email);
      if (!target) return new Response(JSON.stringify({ error: "User not found" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
      await admin.from("user_roles").delete().eq("user_id", target.id).eq("role", "admin");
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action");
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
