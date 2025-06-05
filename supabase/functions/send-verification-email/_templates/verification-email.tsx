
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface VerificationEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email: string
}

export const VerificationEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  user_email,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address for MentorAI</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to MentorAI!</Heading>
        <Text style={text}>
          Thanks for signing up! Please verify your email address to get started with your personalized learning journey.
        </Text>
        <Link
          href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          target="_blank"
          style={button}
        >
          Verify Email Address
        </Link>
        <Text style={{ ...text, marginTop: '32px' }}>
          Or copy and paste this verification code:
        </Text>
        <code style={code}>{token}</code>
        <Text style={footer}>
          If you didn't create an account with MentorAI, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default VerificationEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const button = {
  backgroundColor: '#059669',
  borderRadius: '8px',
  color: '#fff',
  display: 'block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '16px 24px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  margin: '24px 0',
}

const code = {
  display: 'inline-block',
  padding: '16px 4.5%',
  width: '90.5%',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  border: '1px solid #eee',
  color: '#333',
  fontSize: '14px',
  fontFamily: 'monospace',
}

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '32px',
}
