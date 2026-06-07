import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Preview,
    Text,
  } from '@react-email/components';
  
  interface HappyBirthdayEmailProps {
    name?: string;
  }
  
  export default function HappyBirthdayEmail({
    name = 'friend',
  }: HappyBirthdayEmailProps) {
    return (
      <Html>
        <Head />
        <Preview>🎂 Happy Birthday from Birthdiary!</Preview>
  
        <Body style={main}>
          <Container style={container}>
            <Text style={emoji}>🎂</Text>
  
            <Text style={badge}>Birthdiary</Text>
  
            <Text style={title}>
              Happy Birthday, {name}! 🎉
            </Text>
  
            <Text style={paragraph}>
              Wishing you a beautiful day full of love, smiles, and tiny happy moments.
            </Text>
  
            <Text style={paragraph}>
              Thank you for being part of Birthdiary. Today is your day — enjoy every second of it. 💖
            </Text>
  
            <Hr style={hr} />
  
            <Text style={footer}>
              With love,
              <br />
              Birthdiary 🎈
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }
  
  const main = {
    backgroundColor: '#fff7ed',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: '24px 0',
  };
  
  const container = {
    margin: '0 auto',
    maxWidth: '560px',
    backgroundColor: '#ffffff',
    borderRadius: '28px',
    border: '2px solid #fbcfe8',
    padding: '32px 24px',
    boxShadow: '0 18px 40px rgba(236, 72, 153, 0.16)',
  };
  
  const emoji = {
    margin: '0 0 12px',
    textAlign: 'center' as const,
    fontSize: '56px',
  };
  
  const badge = {
    margin: '0 auto 18px',
    width: 'fit-content',
    backgroundColor: '#fce7f3',
    color: '#db2777',
    borderRadius: '999px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '900',
    textAlign: 'center' as const,
  };
  
  const title = {
    margin: '0',
    color: '#111827',
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: '900',
    textAlign: 'center' as const,
  };
  
  const paragraph = {
    margin: '18px auto 0',
    maxWidth: '440px',
    color: '#64748b',
    fontSize: '16px',
    lineHeight: '26px',
    fontWeight: '600',
    textAlign: 'center' as const,
  };
  
  const hr = {
    borderColor: '#fbcfe8',
    margin: '32px 0 18px',
  };
  
  const footer = {
    margin: '0',
    color: '#db2777',
    fontSize: '15px',
    lineHeight: '24px',
    fontWeight: '800',
    textAlign: 'center' as const,
  };