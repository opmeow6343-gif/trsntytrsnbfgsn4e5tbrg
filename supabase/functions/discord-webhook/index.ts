import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ticketId, email, type, specs, action } = await req.json();
    if (!ticketId) {
      return new Response(JSON.stringify({ error: "Missing ticketId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const settingsRes = await fetch(
      `${supabaseUrl}/rest/v1/webhook_settings?select=*&limit=1`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    );
    const settings = await settingsRes.json();

    if (!settings?.[0]?.enabled || !settings[0].discord_webhook_url) {
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const webhookUrl = settings[0].discord_webhook_url;
    const pingId = settings[0].discord_ping_id || "";

    // Action: "needs_reply" — ticket needs admin attention
    if (action === "needs_reply") {
      const content = pingId
        ? `<@${pingId}> ⚠️ **Ticket #${ticketId.toUpperCase()}** needs your reply! User is waiting.`
        : `⚠️ **Ticket #${ticketId.toUpperCase()}** needs your reply! User is waiting.`;

      const embed = {
        title: `💬 Reply Needed — #${ticketId.toUpperCase()}`,
        description: `The user has sent a new message and is waiting for an admin reply.`,
        color: 0xf59e0b,
        fields: [
          { name: "📧 Customer", value: email || "N/A", inline: true },
          { name: "🆔 Ticket", value: `\`#${ticketId.toUpperCase()}\``, inline: true },
        ],
        footer: {
          text: "AlphaCloud • Reply in admin panel",
          icon_url: "https://cdn.discordapp.com/embed/avatars/0.png",
        },
        timestamp: new Date().toISOString(),
      };

      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content || undefined,
          embeds: [embed],
          username: "AlphaCloud Alerts",
        }),
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default action: new ticket notification
    const specFields = Object.entries(specs || {}).map(([key, value]) => ({
      name: `📌 ${key}`, value: String(value), inline: true,
    }));

    const typeLabel = type === "minecraft" ? "⛏️ Minecraft Server" : type === "bot" ? "🤖 Discord Bot" : "🚀 Booster";
    const typeEmoji = type === "minecraft" ? "⛏️" : type === "bot" ? "🤖" : "🚀";
    const color = type === "minecraft" ? 0x22c55e : type === "bot" ? 0x3b82f6 : 0xa855f7;

    const embed = {
      title: `🎫 New Order — #${ticketId.toUpperCase()}`,
      description: `A new **${typeLabel}** order has been placed!\n\n${typeEmoji} **Customer:** ${email || "N/A"}`,
      color,
      fields: [
        { name: "📧 Email", value: email || "N/A", inline: true },
        { name: "📋 Type", value: typeLabel, inline: true },
        { name: "🆔 Ticket ID", value: `\`#${ticketId.toUpperCase()}\``, inline: true },
        ...specFields,
      ],
      footer: {
        text: "AlphaCloud Ticket System • Reply in admin panel",
        icon_url: "https://cdn.discordapp.com/embed/avatars/0.png",
      },
      timestamp: new Date().toISOString(),
      thumbnail: {
        url: type === "minecraft"
          ? "https://cdn-icons-png.flaticon.com/512/2989/2989972.png"
          : type === "bot"
          ? "https://cdn-icons-png.flaticon.com/512/2626/2626279.png"
          : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      },
    };

    const content = pingId ? `<@${pingId}> 🔔 New ticket!` : "";

    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: content || undefined,
        embeds: [embed],
        username: "AlphaCloud",
      }),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      console.error("Discord webhook error:", errText);
      return new Response(JSON.stringify({ error: "Discord webhook failed", details: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
