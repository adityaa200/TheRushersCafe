import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function getKeySecret(): Promise<string | null> {
  let keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
  if (keySecret) return keySecret;

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("app_secrets")
    .select("value")
    .eq("key", "RAZORPAY_KEY_SECRET")
    .single();

  if (error || !data) return null;
  return data.value;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !db_order_id) {
      return new Response(
        JSON.stringify({ error: "Missing payment verification fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const razorpayKeySecret = await getKeySecret();

    if (!razorpayKeySecret) {
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify signature: HMAC SHA256 of (razorpay_order_id + "|" + razorpay_payment_id) with key secret
    const encoder = new TextEncoder();
    const keyData = encoder.encode(razorpayKeySecret);
    const messageData = encoder.encode(`${razorpay_order_id}|${razorpay_payment_id}`);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const computedSignature = signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (computedSignature !== razorpay_signature) {
      await supabase
        .from("orders")
        .update({ payment_status: "FAILED" })
        .eq("id", db_order_id);

      return new Response(
        JSON.stringify({ error: "Payment verification failed", verified: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Signature verified — update order
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "PAID",
        payment_id: razorpay_payment_id,
        status: "CONFIRMED",
      })
      .eq("id", db_order_id);

    if (error) {
      return new Response(
        JSON.stringify({ error: "Payment verified but failed to update order", details: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ verified: true, message: "Payment verified successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
