import type { AppLocale } from '@/i18n/types';
import type { LiteLLMModel } from '@/types/litellm';

export const MOCK_MODELS: LiteLLMModel[] = [
  { id: 'gpt-4o', object: 'model', owned_by: 'openai' },
  { id: 'gpt-4o-mini', object: 'model', owned_by: 'openai' },
  { id: 'claude-3-5-sonnet', object: 'model', owned_by: 'anthropic' },
  { id: 'gemini-2.0-flash', object: 'model', owned_by: 'google' },
];

const MOCK_REPLIES_EN: Record<string, string[]> = {
  default: [
    "I'm on the padel court — ask me about the point and I'll answer.",
    'Good question. Let me read the score and the next shot with you.',
    'From my side of the court, I would take that off the glass and come up.',
  ],
};

const MOCK_REPLIES_ES: Record<string, string[]> = {
  default: [
    'Estoy en la cancha — preguntame por el punto y te respondo.',
    'Buena pregunta. Miremos el marcador y el próximo golpe.',
    'Desde mi lado, la bajaría al cristal y subiría a la red.',
  ],
};

const MOCK_FOOTER_EN =
  '\n\n*(Mock mode — enable live LiteLLM in `.env`)*';
const MOCK_FOOTER_ES =
  '\n\n*(Modo mock — activá LiteLLM live en `.env`)*';

const MOCK_PEER_OPENERS_EN = [
  'Nice hold. Do we take the next one at the net?',
  'Their lob is sitting up — I can cover the glass.',
  'Between points: want the serve out wide?',
];

const MOCK_PEER_OPENERS_ES = [
  'Buen aguante. ¿La próxima la tomamos en la red?',
  'El globo les queda alto — yo cubro el cristal.',
  'Entre puntos: ¿el saque abierto?',
];

const MOCK_PEER_REPLIES_EN = [
  'Yes. I stay back, you step in if it is short.',
  'Agreed — cross it and we close together.',
  'Good. One more ball to the glass, then we finish.',
];

const MOCK_PEER_REPLIES_ES = [
  'Dale. Yo me quedo atrás y vos entrás si queda corta.',
  'De acuerdo — cruzala y cerramos juntos.',
  'Bien. Una más al cristal y definimos.',
];

export function getMockPeerReply(
  agentName: string,
  peerName: string,
  isOpener: boolean,
  locale: AppLocale = 'en',
): string {
  if (isOpener) {
    const pool = locale === 'es' ? MOCK_PEER_OPENERS_ES : MOCK_PEER_OPENERS_EN;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const pool = locale === 'es' ? MOCK_PEER_REPLIES_ES : MOCK_PEER_REPLIES_EN;
  const line = pool[Math.floor(Math.random() * pool.length)];
  if (locale === 'es') {
    return `${line} (${agentName} a ${peerName})`;
  }
  return `${line} (${agentName} to ${peerName})`;
}

export function getMockAssistantReply(
  agentName: string,
  userMessage: string,
  locale: AppLocale = 'en',
): string {
  const pools = locale === 'es' ? MOCK_REPLIES_ES : MOCK_REPLIES_EN;
  const pool = pools[agentName.toLowerCase()] ?? pools.default;
  const snippet =
    userMessage.length > 60 ? `${userMessage.slice(0, 60)}…` : userMessage;
  const base = pool[Math.floor(Math.random() * pool.length)];

  if (locale === 'es') {
    return `${base}\n\nPreguntaste sobre **"${snippet}"**. Una idea rápida:\n\n- Dividilo en pasos más chicos\n- Probá un cambio a la vez\n- Mirá el \`CHECKLIST.md\` para próximas ideas${MOCK_FOOTER_ES}`;
  }

  return `${base}\n\nYou asked about **"${snippet}"**. Here's a quick take:\n\n- Break it into smaller steps\n- Test one change at a time\n- Check the \`CHECKLIST.md\` for next ideas${MOCK_FOOTER_EN}`;
}
