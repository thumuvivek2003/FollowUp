import { MessageCircle, MessageSquareText, Phone } from 'lucide-react';
import { contactLinks } from '../../../lib/phone';

const base =
  'flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition active:scale-[0.97] sm:h-12';

export function ContactActions({ phone, name }: { phone: string; name: string }) {
  const links = contactLinks(phone);

  return (
    <div className="grid grid-cols-3 gap-2">
      <a
        href={links.call}
        aria-label={`Call ${name}`}
        className={`${base} bg-green-600 text-white shadow-sm shadow-green-600/25 hover:bg-green-700`}
      >
        <Phone className="size-4.5 fill-current" />
        Call
      </a>
      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp ${name}`}
        className={`${base} bg-green-50 text-green-700 hover:bg-green-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700`}
      >
        <MessageCircle className="size-4.5 text-green-600 dark:text-green-400" />
        WhatsApp
      </a>
      <a
        href={links.sms}
        aria-label={`Message ${name}`}
        className={`${base} bg-blue-600 text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700`}
      >
        <MessageSquareText className="size-4.5" />
        Message
      </a>
    </div>
  );
}
