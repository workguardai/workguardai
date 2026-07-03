import { LegalScreen, type LegalSection } from './LegalScreen';

const SECTIONS: LegalSection[] = [
  {
    heading: 'Information we collect',
    body: 'We collect the account details you provide (name, work email, company), the drawings and project data you upload, and basic usage information needed to operate the service.',
  },
  {
    heading: 'How we use your information',
    body: 'We use your data to run WorkGuard AI: to parse your drawings, track progress, generate alerts, and support your account. We do not sell your data.',
  },
  {
    heading: 'Storage and security',
    body: 'Project data is isolated per organisation, access is role-based, and actions are recorded in an audit log. Data is stored on managed cloud infrastructure.',
  },
  {
    heading: 'Your rights',
    body: 'You can request access to, correction of, or deletion of your personal data at any time by contacting us.',
  },
  {
    heading: 'Contact',
    body: 'Questions about privacy can be sent to ek@workguardai.com.',
  },
];

export function PrivacyScreen() {
  return <LegalScreen title="Privacy policy" updated="July 2026" sections={SECTIONS} />;
}
