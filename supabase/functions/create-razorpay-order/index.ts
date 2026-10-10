import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function getRazorpayKeys(): Promise<{ keyId: string; keySecret: string } | null> {
  let keyId = Deno.env.get("RAZORPAY_KEY_ID");
  let keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

  if (keyId && keySecret) return { keyId, keySecret };

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("app_secrets")
    .select("key, value")
    .in("key", ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"]);

  if (error || !data) return null;

  const keyMap: Record<string, string> = {};
  for (const row of data) {
    keyMap[row.key] = row.value;
  }

  keyId = keyMap["RAZORPAY_KEY_ID"];
  keySecret = keyMap["RAZORPAY_KEY_SECRET"];

  if (keyId && keySecret) return { keyId, keySecret };
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { items, total, customer_name, customer_phone } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Items are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const amountInPaise = Math.round(Number(total) * 100);

    if (amountInPaise < 100) {
      return new Response(
        JSON.stringify({ error: "Minimum order amount is ₹1" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const keys = await getRazorpayKeys();

    if (!keys) {
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Razorpay order via API
    const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${keys.keyId}:${keys.keySecret}`)}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rc_${Date.now()}`,
        notes: {
          customer_name: customer_name || "",
          customer_phone: customer_phone || "",
        },
      }),
    });

    if (!rzpResponse.ok) {
      let rzpError = await rzpResponse.text();
      try {
        const parsed = JSON.parse(rzpError);
        rzpError = parsed.error?.description || parsed.error?.message || rzpError;
      } catch {
        // keep raw text
      }
      return new Response(
        JSON.stringify({ error: "Failed to create payment order", details: rzpError }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rzpOrder = await rzpResponse.json();

    // Store order in Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const orderId = `ORD-${Date.now().toString().slice(-8)}`;

    const { data: dbOrder, error: dbError } = await supabase
      .from("orders")
      .insert({
        order_id: orderId,
        customer_name: customer_name || "",
        customer_phone: customer_phone || "",
        items: items,
        total: Number(total),
        status: "PENDING",
        payment_status: "PENDING",
        razorpay_order_id: rzpOrder.id,
        notes: "Online order",
      })
      .select()
      .single();

    if (dbError) {
      return new Response(
        JSON.stringify({ error: "Failed to save order", details: dbError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        razorpay_order_id: rzpOrder.id,
        razorpay_key_id: keys.keyId,
        amount: amountInPaise,
        currency: "INR",
        db_order_id: dbOrder.id,
        order_id: orderId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
