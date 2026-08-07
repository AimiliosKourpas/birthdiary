import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  
  interface Props {
    name?: string;
  }
  
  const appUrl = 'https://yourbirthdiary.vercel.app/about';
  
  export default function RebrandAnnouncementEmail({ name = 'there' }: Props) {
    return (
      <Html>
        <Head>
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
          <style>{darkModeStyles}</style>
        </Head>
        <Preview>🎉 Birthdiary got a fresh new look!</Preview>

        <Body style={main} className="bd-body">
          <Container style={wrapper}>
            <Section style={hero}>
              <Text style={logo}>🎈 Birthdiary</Text>

              <Text style={emoji}>🎂✨🎉</Text>

              <Text style={title}>
                Birthdiary got a fresh new look!
              </Text>

              <Text style={subtitle}>
                Hi {name}, we made Birthdiary brighter, warmer, and easier to use.
              </Text>

              <Button href={appUrl} style={button}>
                Open Birthdiary
              </Button>
            </Section>

            <Section style={content} className="bd-card">
              <Text style={message} className="bd-text">
                Birthdiary started with one simple idea: help you remember the people you care about.
              </Text>

              <Text style={sectionTitle} className="bd-accent">What’s new?</Text>

              <Section style={pinkCard} className="bd-pink-card">
                <Text style={cardTitle} className="bd-heading">✨ Fresh new design</Text>
                <Text style={cardText} className="bd-text">
                  A more colorful and joyful look for your birthday diary.
                </Text>
              </Section>

              <Section style={yellowCard} className="bd-yellow-card">
                <Text style={cardTitle} className="bd-heading">📱 Better mobile experience</Text>
                <Text style={cardText} className="bd-text">
                  Smoother, cleaner, and easier to use from your phone.
                </Text>
              </Section>

              <Section style={purpleCard} className="bd-purple-card">
                <Text style={cardTitle} className="bd-heading">🎂 Improved birthday reminders</Text>
                <Text style={cardText} className="bd-text">
                  Keep track of special days and never miss a birthday again.
                </Text>
              </Section>

              <Section style={orangeCard} className="bd-orange-card">
                <Text style={cardTitle} className="bd-heading">💌 Birthday emails are coming</Text>
                <Text style={cardText} className="bd-text">
                  Soon, Birthdiary can send a sweet birthday message on your special day.
                </Text>
              </Section>

              <Text style={message} className="bd-text">
                Thank you for being part of Birthdiary. This little project means a lot to us.
              </Text>

              <Hr style={hr} className="bd-hr" />

              <Text style={footer} className="bd-accent">
                With love,
                <br />
                The Birthdiary Team 🎈
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }
  
  const main = {
    margin: '0',
    padding: '0',
    backgroundColor: '#fff1f7',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  };
  
  const wrapper = {
    margin: '0 auto',
    maxWidth: '620px',
    padding: '28px 14px',
  };
  
  const hero = {
    padding: '42px 30px',
    borderRadius: '34px 34px 0 0',
    background:
      'linear-gradient(135deg, #ec4899 0%, #fb7185 35%, #fb923c 70%, #facc15 100%)',
    textAlign: 'center' as const,
  };
  
  const logo = {
    margin: '0 0 18px',
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: '900',
  };
  
  const emoji = {
    margin: '0 0 18px',
    fontSize: '46px',
  };
  
  const title = {
    margin: '0',
    color: '#ffffff',
    fontSize: '36px',
    lineHeight: '44px',
    fontWeight: '900',
  };
  
  const subtitle = {
    margin: '18px auto 28px',
    maxWidth: '470px',
    color: '#fff7ed',
    fontSize: '17px',
    lineHeight: '28px',
    fontWeight: '750',
  };
  
  const button = {
    backgroundColor: '#ffffff',
    color: '#db2777',
    borderRadius: '999px',
    padding: '15px 28px',
    fontSize: '15px',
    fontWeight: '900',
    textDecoration: 'none',
    display: 'inline-block',
  };
  
  const content = {
    padding: '28px',
    backgroundColor: '#ffffff',
    borderRadius: '0 0 34px 34px',
    borderRight: '2px solid #f9a8d4',
    borderBottom: '2px solid #f9a8d4',
    borderLeft: '2px solid #f9a8d4',
  };
  
  const message = {
    margin: '0 auto 22px',
    maxWidth: '500px',
    color: '#475569',
    fontSize: '16px',
    lineHeight: '27px',
    fontWeight: '650',
    textAlign: 'center' as const,
  };
  
  const sectionTitle = {
    margin: '28px 0 18px',
    color: '#db2777',
    fontSize: '24px',
    fontWeight: '900',
    textAlign: 'center' as const,
  };
  
  const pinkCard = {
    backgroundColor: '#fdf2f8',
    border: '2px solid #f9a8d4',
    borderRadius: '24px',
    padding: '18px',
    margin: '0 0 14px',
  };
  
  const yellowCard = {
    backgroundColor: '#fefce8',
    border: '2px solid #fde047',
    borderRadius: '24px',
    padding: '18px',
    margin: '0 0 14px',
  };
  
  const purpleCard = {
    backgroundColor: '#faf5ff',
    border: '2px solid #d8b4fe',
    borderRadius: '24px',
    padding: '18px',
    margin: '0 0 14px',
  };
  
  const orangeCard = {
    backgroundColor: '#fff7ed',
    border: '2px solid #fdba74',
    borderRadius: '24px',
    padding: '18px',
    margin: '0 0 14px',
  };
  
  const cardTitle = {
    margin: '0 0 8px',
    color: '#111827',
    fontSize: '18px',
    lineHeight: '25px',
    fontWeight: '900',
  };
  
  const cardText = {
    margin: '0',
    color: '#64748b',
    fontSize: '15px',
    lineHeight: '24px',
    fontWeight: '650',
  };
  
  const hr = {
    borderColor: '#f9a8d4',
    margin: '30px 0 18px',
  };
  
  const footer = {
    margin: '0',
    color: '#db2777',
    fontSize: '15px',
    lineHeight: '24px',
    fontWeight: '900',
    textAlign: 'center' as const,
  };

  // Dark-mode overrides. Inline styles above always win unless a client
  // both keeps <style> blocks and respects prefers-color-scheme (Apple
  // Mail is the most reliable; some Gmail contexts support this too), so
  // !important is required here — inline style attributes otherwise
  // always beat a class selector regardless of source order. Clients that
  // strip <style> blocks entirely just keep the light-mode inline colors
  // above, which is the intended, safe fallback.
  //
  // The gradient hero section (hero/logo/emoji/title/subtitle/button) is
  // deliberately left untouched: it's already a fully saturated
  // pink-to-yellow gradient with white text, which email clients' dark
  // mode heuristics don't repaint (they target near-white/near-black
  // surfaces), so it already renders correctly in both modes as-is.
  const darkModeStyles = `
    @media (prefers-color-scheme: dark) {
      .bd-body { background-color: #171310 !important; }
      .bd-card { background-color: #332a24 !important; border-color: #5c4a3c !important; }
      .bd-heading { color: #f5efe9 !important; }
      .bd-text { color: #b9b0a8 !important; }
      .bd-accent { color: #f472b6 !important; }
      .bd-hr { border-color: #5c4a3c !important; }
      .bd-pink-card { background-color: #3d2030 !important; border-color: #6b3350 !important; }
      .bd-yellow-card { background-color: #3a3418 !important; border-color: #6b5f1f !important; }
      .bd-purple-card { background-color: #2e2440 !important; border-color: #5b4380 !important; }
      .bd-orange-card { background-color: #3a2818 !important; border-color: #6b4a24 !important; }
    }
  `;