import { LegalScreen, type LegalSection } from './LegalScreen';

const SECTIONS: LegalSection[] = [
  {
    heading: 'Using the service',
    body: 'WorkGuard AI provides construction monitoring software. By using it you agree to these terms and to use the platform lawfully and as intended.',
  },
  {
    heading: 'Accounts',
    body: 'You are responsible for your account and for keeping your credentials secure. Notify us promptly of any unauthorised use.',
  },
  {
    heading: 'Your data',
    body: 'You retain ownership of the drawings and project data you upload. You grant us the rights needed to process that data to provide the service.',
  },
  {
    heading: 'Availability and changes',
    body: 'The platform is offered on an as-available basis during its current stage. We may update features and these terms, and will note the effective date here.',
  },
  {
    heading: 'Contact',
    body: 'Questions about these terms can be sent to ek@workguardai.com.',
  },
];

export function TermsScreen() {
  return <LegalScreen title="Terms of service" updated="July 2026" sections={SECTIONS} />;
}
