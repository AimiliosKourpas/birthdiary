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
        <Head>
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
          <style>{darkModeStyles}</style>
        </Head>
        <Preview>🎂 Happy Birthday from Birthdiary!</Preview>

        <Body style={main} className="bd-body">
          <Container style={container} className="bd-card">
            <Text style={emoji}>🎂</Text>

            <Text style={badge} className="bd-badge">Birthdiary</Text>

            <Text style={title} className="bd-heading">
              Happy Birthday, {name}! 🎉
            </Text>

            <Text style={paragraph} className="bd-text">
              Wishing you a beautiful day full of love, smiles, and tiny happy moments.
            </Text>

            <Text style={paragraph} className="bd-text">
              Thank you for being part of Birthdiary. Today is your day — enjoy every second of it. 💖
            </Text>

            <Hr style={hr} className="bd-hr" />

            <Text style={footer} className="bd-accent">
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

  // Dark-mode overrides. Inline styles above always win unless a client
  // both keeps <style> blocks and respects prefers-color-scheme (Apple
  // Mail is the most reliable; some Gmail contexts support this too), so
  // !important is required here — inline style attributes otherwise
  // always beat a class selector regardless of source order. Clients that
  // strip <style> blocks entirely just keep the light-mode inline colors
  // above, which is the intended, safe fallback.
  const darkModeStyles = `
    @media (prefers-color-scheme: dark) {
      .bd-body { background-color: #171310 !important; }
      .bd-card { background-color: #332a24 !important; border-color: #5c4a3c !important; }
      .bd-heading { color: #f5efe9 !important; }
      .bd-text { color: #b9b0a8 !important; }
      .bd-accent { color: #f472b6 !important; }
      .bd-badge { background-color: #4a1942 !important; color: #f9a8d4 !important; }
      .bd-hr { border-color: #5c4a3c !important; }
    }
  `;