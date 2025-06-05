
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { VerificationEmail } from './_templates/verification-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    console.log('Received webhook payload:', payload.substring(0, 200))
    console.log('Hook secret exists:', !!hookSecret)
    
    // Parse the webhook payload
    let webhookData
    try {
      if (hookSecret) {
        console.log('Verifying webhook with secret')
        const wh = new Webhook(hookSecret)
        webhookData = wh.verify(payload, headers)
      } else {
        console.log('No hook secret, parsing directly')
        webhookData = JSON.parse(payload)
      }
    } catch (error) {
      console.error('Webhook verification failed:', error)
      console.log('Attempting to parse payload directly')
      webhookData = JSON.parse(payload)
    }

    console.log('Webhook data:', JSON.stringify(webhookData, null, 2))

    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = webhookData as {
      user: {
        email: string
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
      }
    }

    console.log(`Processing ${email_action_type} for ${user.email}`)

    const html = await renderAsync(
      React.createElement(VerificationEmail, {
        supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
        token,
        token_hash,
        redirect_to,
        email_action_type,
        user_email: user.email,
      })
    )

    console.log('Sending email via Resend...')
    const { error } = await resend.emails.send({
      from: 'MentorAI <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Verify your email address - MentorAI',
      html,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    console.log(`Verification email sent successfully to ${user.email}`)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in send-verification-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
