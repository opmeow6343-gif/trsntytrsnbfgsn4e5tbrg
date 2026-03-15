import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verify the caller
    const { data: userData, error: userError } = await adminClient.auth.getUser(token);
    if (userError || !userData?.user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const caller = userData.user;

    // Check caller is admin using direct query (bypass RLS with service role)
    const { data: callerRole } = await adminClient
      .from("user_roles")
      .select("id")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!callerRole) {
      return new Response(JSON.stringify({ error: "Not authorized" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, email } = await req.json();
    console.log("Action:", action, "Email:", email);

    if (action === "list") {
      // Get all admin roles
      const { data: roles, error: rolesErr } = await adminClient
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      
      console.log("Roles found:", roles?.length, "Error:", rolesErr);
      
      if (rolesErr) {
        return new Response(JSON.stringify({ error: rolesErr.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const admins: string[] = [];
      for (const role of (roles || [])) {
        try {
          const { data: userResult, error: getUserErr } = await adminClient.auth.admin.getUserById(role.user_id);
          console.log("getUserById for", role.user_id, "result:", userResult?.user?.email, "error:", getUserErr);
          if (userResult?.user?.email) {
            admins.push(userResult.user.email);
          }
        } catch (e) {
          console.error("Failed to get user", role.user_id, e);
        }
      }

      console.log("Returning admins:", admins);
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

      // Find user by email using admin API
      const { data: listData, error: listErr } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      console.log("Listed users:", listData?.users?.length, "Error:", listErr);

      if (listErr) {
        return new Response(JSON.stringify({ error: "Failed to list users: " + listErr.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const target = listData?.users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
      if (!target) {
        return new Response(JSON.stringify({ error: "User not found. They must create an account first." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if already admin
      const { data: existing } = await adminClient
        .from("user_roles")
        .select("id")
        .eq("user_id", target.id)
        .eq("role", "admin")
        .maybeSingle();

      if (existing) {
        return new Response(JSON.stringify({ error: "Already an admin" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: insertErr } = await adminClient
        .from("user_roles")
        .insert({ user_id: target.id, role: "admin" });

      console.log("Insert result error:", insertErr);
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

      const { data: listData } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      const target = listData?.users?.find((u: any) => u.email?.toLowerCase() === email?.toLowerCase());
      if (!target) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await adminClient.from("user_roles").delete().eq("user_id", target.id).eq("role", "admin");
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
