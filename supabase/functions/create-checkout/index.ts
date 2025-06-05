
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create a Supabase client using the anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    const { priceId, tier } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2023-10-16" });
    
    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    let sessionConfig: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?success=true`,
      cancel_url: `${req.headers.get("origin")}/dashboard?canceled=true`,
    };

    // Set up line items based on tier or custom priceId
    if (priceId) {
      sessionConfig.line_items = [{ price: priceId, quantity: 1 }];
    } else {
      // Default pricing tiers
      const tierPricing = {
        Basic: { amount: 999, name: "Basic Plan" },
        Premium: { amount: 1999, name: "Premium Plan" },
        Enterprise: { amount: 4999, name: "Enterprise Plan" }
      };

      const pricing = tierPricing[tier as keyof typeof tierPricing] || tierPricing.Premium;
      
      sessionConfig.line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: { name: pricing.name },
            unit_amount: pricing.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
