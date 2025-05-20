// functions/api/join-waitlist.js

const ALLOWED_ORIGINS = [
  "https://www.tinypaws.com", // Your production domain
  "https://tinypaws.pages.dev", // Your current Cloudflare Pages dev URL
  // Add any local development origins if you test index.html with a local server
  // e.g., "http://localhost:8000", "http://127.0.0.1:5500", "http://localhost:3000"
];

// KV Namespace binding name - ensure this matches your wrangler.jsonc/dashboard binding
const KV_NAMESPACE_BINDING = "WAITLIST_KV"; // This is the binding name we'll use in wrangler.jsonc

function getCorsHeaders(requestOrigin) {
  if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
    return {
      "Access-Control-Allow-Origin": requestOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
  }
  // More restrictive fallback if the origin is not in the allowed list or not provided
  // Or, you could choose to deny the request if origin is not present or not allowed.
  return {
    "Access-Control-Allow-Origin": "https://tinypaws.com", // Default to production or a safe default
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
}

export async function onRequest(context) {
  const { request, env } = context;
  const requestOrigin = request.headers.get("Origin");
  const corsHeaders = getCorsHeaders(requestOrigin);

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, message: "Method Not Allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body = await request.json();
    const { email, name, petName, petType } = body;

    // Basic validation
    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "A valid email address is required.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    if (!name || typeof name !== "string" || name.trim() === "") {
      return new Response(
        JSON.stringify({ success: false, message: "Your name is required." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    if (!petName || typeof petName !== "string" || petName.trim() === "") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Your pet's name is required.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    if (!petType || typeof petType !== "string" || petType.trim() === "") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please select your pet type.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const subscriberData = {
      name: name.trim(),
      petName: petName.trim(),
      petType: petType.trim(),
      signupDate: new Date().toISOString(),
      referer: request.headers.get("Referer"),
    };

    // Use email as the key in KV.
    // The binding name from wrangler.jsonc (KV_NAMESPACE_BINDING) is used to access the KV store via env.
    await env[KV_NAMESPACE_BINDING].put(
      email.toLowerCase(),
      JSON.stringify(subscriberData)
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully joined the waitlist! We'll be in touch.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(
      "Error processing waitlist request:",
      error.message,
      error.stack
    );
    // Avoid sending detailed error messages to the client in production for security
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred. Please try again later.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}
