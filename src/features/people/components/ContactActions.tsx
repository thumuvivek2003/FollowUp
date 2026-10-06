import { MessageCircle, MessageSquareText, Phone } from 'lucide-react';
import { contactLinks } from '../../../lib/phone';
import { IconAction } from './IconAction';

export function ContactActions({ phone, name }: { phone: string; name: string }) {
  const links = contactLinks(phone);

  return (
    <>
      <IconAction href={links.call} label={`Call ${name}`} tone="green">
        <Phone className="size-4 fill-current" />
      </IconAction>
      <IconAction href={links.whatsapp} label={`WhatsApp ${name}`} tone="green" external>
        <MessageCircle className="size-4.5" />
      </IconAction>
      <IconAction href={links.sms} label={`Message ${name}`} tone="blue">
        <MessageSquareText className="size-4.5" />
      </IconAction>
    </>
  );
}
