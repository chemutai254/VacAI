export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: "high" | "medium" | "low";
  sources?: string[];
  timestamp: number;
}

const MOCK_RESPONSES: { [key: string]: { content: string; confidence: "high" | "medium" | "low"; sources: string[] } } = {
  default: {
    content: "Vaccines are safe and effective ways to protect against serious diseases in Kenya. The Ministry of Health provides free vaccinations at over 7,000 public health facilities across all 47 counties. All vaccines used are WHO-prequalified and approved by the Pharmacy and Poisons Board.",
    confidence: "high",
    sources: ["Kenya MOH", "WHO"],
  },
  babies: {
    content: "Kenya follows the National Immunization Schedule. Babies receive: BCG at birth, Polio (0-4 doses), Pentavalent/DPT-HepB-Hib (6, 10, 14 weeks), Pneumococcal (6, 10, 14 weeks), Rotavirus (6, 10 weeks), and Measles-Rubella at 9 and 18 months. All routine childhood vaccines are free at government facilities in Kenya.",
    confidence: "high",
    sources: ["Kenya MOH - 2024 Immunization Schedule", "UNICEF Kenya"],
  },
  mmr: {
    content: "The Measles-Rubella (MR) vaccine is very safe and widely used in Kenya. Over 20 million doses have been administered in Kenya since 2016. Side effects are typically mild - slight fever or rash that resolve within a few days. The vaccine prevents potentially fatal measles outbreaks common in East Africa.",
    confidence: "high",
    sources: ["WHO", "Kenya MOH", "Kenyatta National Hospital"],
  },
  location: {
    content: "Free vaccinations are available at: County referral hospitals (47 counties), Sub-county hospitals (over 400), Health centers (3,000+), and Dispensaries (4,000+). Major facilities include Kenyatta National Hospital (Nairobi), Moi Teaching and Referral Hospital (Eldoret), and Coast General Hospital (Mombasa). Visit your nearest facility or call Kenya Health InfoLine: 719 for locations.",
    confidence: "high",
    sources: ["Kenya MOH", "Kenya Health InfoLine"],
  },
  schedule: {
    content: "The Kenya National Immunization Schedule: Birth (BCG, Polio 0), 6 weeks (Polio 1, Penta 1, PCV 1, Rota 1), 10 weeks (Polio 2, Penta 2, PCV 2, Rota 2), 14 weeks (Polio 3, Penta 3, PCV 3), 9 months (Measles-Rubella 1), 18 months (Measles-Rubella 2). Keep your child's immunization card safe and bring it to every clinic visit.",
    confidence: "high",
    sources: ["Kenya MOH - National Immunization Programme"],
  },
};

export async function sendChatMessage(
  message: string,
  language: string
): Promise<ChatMessage> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerMessage = message.toLowerCase();
  let response = MOCK_RESPONSES.default;

  if (lowerMessage.includes("bab") || lowerMessage.includes("child") || lowerMessage.includes("infant") || lowerMessage.includes("watoto") || lowerMessage.includes("mtoto")) {
    response = MOCK_RESPONSES.babies;
  } else if (lowerMessage.includes("when") || lowerMessage.includes("schedule") || lowerMessage.includes("ratiba") || lowerMessage.includes("lini")) {
    response = MOCK_RESPONSES.schedule;
  } else if (lowerMessage.includes("mmr") || lowerMessage.includes("measles") || lowerMessage.includes("safe") || lowerMessage.includes("usalama")) {
    response = MOCK_RESPONSES.mmr;
  } else if (lowerMessage.includes("where") || lowerMessage.includes("location") || lowerMessage.includes("get vaccin") || lowerMessage.includes("wapi") || lowerMessage.includes("kituo")) {
    response = MOCK_RESPONSES.location;
  }

  return {
    id: Date.now().toString(),
    role: "assistant",
    content: response.content,
    confidence: response.confidence,
    sources: response.sources,
    timestamp: Date.now(),
  };
}

export function detectUnsafeQuery(message: string): boolean {
  const unsafePatterns = [
    /how to make/i,
    /diy vaccine/i,
    /avoid vaccine/i,
    /skip vaccine/i,
    /vaccine harmful/i,
    /vaccine dangerous/i,
  ];

  return unsafePatterns.some((pattern) => pattern.test(message));
}
