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
      <Head />
      <Preview>🎂 Birthday reminders from Birthdiary</Preview>

      <Body style={main}>
        <Container style={container}>
          <Text style={emoji}>🎂</Text>

          <Text style={badge}>Birthdiary Reminder</Text>

          <Text style={title}>
            Hi {name}, don’t forget today’s birthdays 🎉
          </Text>

          <Text style={subtitle}>
            Today is {todayFormatted}. Here’s who deserves a little birthday love.
          </Text>

          {friends.length > 0 ? (
            friends.map((friend, index) => {
              const age = getAge(friend.birthday);

              return (
                <Container key={index} style={birthdayCard}>
                  <Text style={friendName}>🎈 {friend.name}</Text>
                  <Text style={friendInfo}>
                    is turning <strong>{age}</strong> today. Send a message, make a call,
                    or share a little love 💖
                  </Text>
                </Container>
              );
            })
          ) : (
            <Container style={emptyCard}>
              <Text style={emptyTitle}>No birthdays today 🌸</Text>
              <Text style={emptyText}>
                Enjoy your day — Birthdiary will let you know when someone special is coming up.
              </Text>
            </Container>
          )}

          {items.length > 0 && (
            <Container style={upcomingBox}>
              <Text style={sectionTitle}>Upcoming reminders</Text>

              {items.map((item, index) => (
                <Text key={index} style={upcomingItem}>
                  ✨ {item}
                </Text>
              ))}
            </Container>
          )}

          <Text style={signature}>
            Keep celebrating the people you love.
            <br />
            — Birthdiary
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
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