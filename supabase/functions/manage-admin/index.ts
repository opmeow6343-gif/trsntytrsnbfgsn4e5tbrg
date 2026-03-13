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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const admin = createClient(supabaseUrl, serviceRoleKey);

    // Verify the caller
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData?.user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const caller = userData.user;

    // Check caller is admin
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: caller.id, _role: "admin" });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Not authorized" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, email } = await req.json();
    console.log("Action:", action, "Email:", email);

    if (action === "list") {
      const { data: roles, error: rolesErr } = await admin.from("user_roles").select("user_id").eq("role", "admin");
      console.log("Roles found:", roles?.length, "Error:", rolesErr);
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
      if (!email) {
        return new Response(JSON.stringify({ error: "Email is required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Find user by email
      const { data: { users }, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
      console.log("Listed users:", users?.length, "Error:", listErr);

      const target = users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
      if (!target) {
        return new Response(JSON.stringify({ error: "User not found. They must create an account first." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: existing } = await admin.from("user_roles").select("id").eq("user_id", target.id).eq("role", "admin").maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ error: "Already an admin" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: insertErr } = await admin.from("user_roles").insert({ user_id: target.id, role: "admin" });
      console.log("Insert error:", insertErr);
      if (insertErr) {
        return new Response(JSON.stringify({ error: insertErr.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "remove") {
      if (email?.toLowerCase() === caller.email?.toLowerCase()) {
        return new Response(JSON.stringify({ error: "Cannot remove yourself" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 });
      const target = users?.find((u: any) => u.email?.toLowerCase() === email?.toLowerCase());
      if (!target) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await admin.from("user_roles").delete().eq("user_id", target.id).eq("role", "admin");
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
