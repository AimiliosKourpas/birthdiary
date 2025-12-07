// /emails/WelcomeEmail.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export interface WelcomeEmailProps {
  name?: string;
  items?: string[];
  friends?: { name: string; birthday: string }[]; // birthday as YYYY-MM-DD string
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

function getAge(birthday: string) {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const WelcomeEmail = ({
  name = 'there',
  items = [],
  friends = [],
}: WelcomeEmailProps) => {
  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>Don’t forget to wish your friends a happy birthday today!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={title}>🎉 BIRTHDIARY 🎉</Text>

          <Text style={highlight}>
            Don’t forget today — {todayFormatted} — to send a happy birthday to:
          </Text>

          {friends.length > 0 ? (
            friends.map((friend, idx) => {
              const age = getAge(friend.birthday);
              return (
                <Text key={idx} style={friendText}>
                  🎂 <strong>{friend.name}</strong> — is turning <strong>{age}</strong> today! 🥳
                </Text>
              );
            })
          ) : (
            <Text style={paragraph}>No birthdays today — enjoy your day!</Text>
          )}

          {items.length > 0 && (
            <>
              <Text style={paragraph}>Upcoming reminders:</Text>
              <ul>
                {items.map((item, idx) => (
                  <li key={idx}>
                    <Text style={paragraph}>• {item}</Text>
                  </li>
                ))}
              </ul>
            </>
          )}

          <Text style={signature}>
            Thanks for being with us!<br />
            — The BirthDiary
          </Text>

          <Hr style={hr} />
          <Text style={footer}>
            © {new Date().getFullYear()} BirthDiary, All rights reserved.<br />
            123 Memory Lane, Internet City
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  backgroundColor: '#f9fafb',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 24px 48px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

const title = {
  fontSize: '28px',
  fontWeight: '800',
  textAlign: 'center' as const,
  color: '#4f46e5', // Indigo-600
  marginBottom: '24px',
};

const highlight = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#2563eb', // Blue-600
  marginBottom: '16px',
  textAlign: 'center' as const,
};

const friendText = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#111827', // Gray-900
  marginBottom: '12px',
  textAlign: 'center' as const,
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#374151', // Gray-700
  marginBottom: '12px',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
};

const button = {
  backgroundColor: '#3b82f6', // Tailwind blue-500
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '14px 28px',
  display: 'inline-block',
  cursor: 'pointer',
};

const signature = {
  fontSize: '16px',
  fontStyle: 'italic',
  color: '#6b7280', // Gray-500
  marginTop: '40px',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#e5e7eb', // Tailwind gray-200
  margin: '40px 0 20px',
};

const footer = {
  color: '#9ca3af', // Tailwind gray-400
  fontSize: '12px',
  textAlign: 'center' as const,
};
