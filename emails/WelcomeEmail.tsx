import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Text,
} from '@react-email/components';

export interface WelcomeEmailProps {
  name?: string;
  items?: string[];
  friends?: { name: string; birthday: string }[];
}

function getAge(birthday: string) {
  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export default function WelcomeEmail({
  name = 'there',
  items = [],
  friends = [],
}: WelcomeEmailProps) {
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{darkModeStyles}</style>
      </Head>
      <Preview>🎂 Birthday reminders from Birthdiary</Preview>

      <Body style={main} className="bd-body">
        <Container style={container} className="bd-card">
          <Text style={emoji}>🎂</Text>

          <Text style={badge} className="bd-badge">Birthdiary Reminder</Text>

          <Text style={title} className="bd-heading">
            Hi {name}, don’t forget today’s birthdays 🎉
          </Text>

          <Text style={subtitle} className="bd-text">
            Today is {todayFormatted}. Here’s who deserves a little birthday love.
          </Text>

          {friends.length > 0 ? (
            friends.map((friend, index) => {
              const age = getAge(friend.birthday);

              return (
                <Container key={index} style={birthdayCard} className="bd-birthday-card">
                  <Text style={friendName} className="bd-friend-name">🎈 {friend.name}</Text>
                  <Text style={friendInfo} className="bd-text">
                    is turning <strong>{age}</strong> today. Send a message, make a call,
                    or share a little love 💖
                  </Text>
                </Container>
              );
            })
          ) : (
            <Container style={emptyCard} className="bd-empty-card">
              <Text style={emptyTitle} className="bd-purple-accent">No birthdays today 🌸</Text>
              <Text style={emptyText} className="bd-text">
                Enjoy your day — Birthdiary will let you know when someone special is coming up.
              </Text>
            </Container>
          )}

          {items.length > 0 && (
            <Container style={upcomingBox} className="bd-upcoming-box">
              <Text style={sectionTitle} className="bd-orange-accent">Upcoming reminders</Text>

              {items.map((item, index) => (
                <Text key={index} style={upcomingItem} className="bd-text">
                  ✨ {item}
                </Text>
              ))}
            </Container>
          )}

          <Text style={signature} className="bd-accent">
            Keep celebrating the people you love.
            <br />
            — Birthdiary
          </Text>

          <Hr style={hr} className="bd-hr" />

          <Text style={footer} className="bd-muted">
            © {new Date().getFullYear()} Birthdiary. All rights reserved.
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
  padding: '32px 24px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '28px',
  border: '2px solid #fbcfe8',
  boxShadow: '0 18px 40px rgba(236, 72, 153, 0.16)',
};

const emoji = {
  fontSize: '52px',
  textAlign: 'center' as const,
  margin: '0 0 12px',
};

const badge = {
  margin: '0 auto 18px',
  width: 'fit-content',
  backgroundColor: '#fce7f3',
  color: '#db2777',
  borderRadius: '999px',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: '800',
  textAlign: 'center' as const,
};

const title = {
  margin: '0',
  color: '#111827',
  fontSize: '30px',
  lineHeight: '38px',
  fontWeight: '900',
  textAlign: 'center' as const,
};

const subtitle = {
  margin: '16px auto 26px',
  maxWidth: '460px',
  color: '#64748b',
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: '600',
  textAlign: 'center' as const,
};

const birthdayCard = {
  background: 'linear-gradient(135deg, #fce7f3 0%, #fef3c7 100%)',
  borderRadius: '24px',
  padding: '18px',
  margin: '0 0 14px',
  border: '1px solid #fbcfe8',
};

const friendName = {
  margin: '0 0 8px',
  color: '#be185d',
  fontSize: '20px',
  fontWeight: '900',
  textAlign: 'center' as const,
};

const friendInfo = {
  margin: '0',
  color: '#334155',
  fontSize: '15px',
  lineHeight: '24px',
  fontWeight: '600',
  textAlign: 'center' as const,
};

const emptyCard = {
  backgroundColor: '#faf5ff',
  borderRadius: '24px',
  padding: '20px',
  border: '1px solid #e9d5ff',
};

const emptyTitle = {
  margin: '0 0 8px',
  color: '#9333ea',
  fontSize: '18px',
  fontWeight: '900',
  textAlign: 'center' as const,
};

const emptyText = {
  margin: '0',
  color: '#64748b',
  fontSize: '15px',
  lineHeight: '24px',
  fontWeight: '600',
  textAlign: 'center' as const,
};

const upcomingBox = {
  marginTop: '24px',
  backgroundColor: '#fff7ed',
  borderRadius: '24px',
  padding: '18px',
  border: '1px solid #fed7aa',
};

const sectionTitle = {
  margin: '0 0 12px',
  color: '#ea580c',
  fontSize: '16px',
  fontWeight: '900',
};

const upcomingItem = {
  margin: '8px 0',
  color: '#475569',
  fontSize: '15px',
  lineHeight: '22px',
  fontWeight: '600',
};

const signature = {
  margin: '32px 0 0',
  color: '#db2777',
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: '800',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#fbcfe8',
  margin: '32px 0 18px',
};

const footer = {
  margin: '0',
  color: '#94a3b8',
  fontSize: '12px',
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
    .bd-muted { color: #9c948c !important; }
    .bd-accent { color: #f472b6 !important; }
    .bd-friend-name { color: #f9a8d4 !important; }
    .bd-purple-accent { color: #c084fc !important; }
    .bd-orange-accent { color: #fb923c !important; }
    .bd-badge { background-color: #4a1942 !important; color: #f9a8d4 !important; }
    .bd-hr { border-color: #5c4a3c !important; }
    .bd-birthday-card { background: linear-gradient(135deg, #3d2030 0%, #3a3418 100%) !important; border-color: #6b3350 !important; }
    .bd-empty-card { background-color: #2e2440 !important; border-color: #5b4380 !important; }
    .bd-upcoming-box { background-color: #3a2818 !important; border-color: #6b4a24 !important; }
  }
`;