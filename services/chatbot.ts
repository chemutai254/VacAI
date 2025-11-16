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
    content: "Vaccines are safe and effective ways to protect against serious diseases. They work by training your immune system to recognize and fight specific infections. All vaccines used in Kenya are approved by the Ministry of Health and WHO.",
    confidence: "high",
    sources: ["Kenya MOH", "WHO"],
  },
  babies: {
    content: "Babies need several vaccines starting from birth. The Kenya National Immunization Schedule includes BCG (at birth), Polio, Pentavalent (DPT-HepB-Hib), Pneumococcal, and Rotavirus vaccines at 6, 10, and 14 weeks. Measles vaccine is given at 9 months.",
    confidence: "high",
    sources: ["Kenya MOH - 2024 Immunization Schedule"],
  },
  mmr: {
    content: "The MMR vaccine is very safe. It protects against Measles, Mumps, and Rubella. Millions of doses have been safely administered worldwide. Common side effects are mild, such as slight fever or soreness at injection site, which resolve quickly.",
    confidence: "high",
    sources: ["WHO", "Kenya MOH"],
  },
  location: {
    content: "You can get vaccinated at government health facilities, county hospitals, health centers, and dispensaries across Kenya. Most routine vaccinations are free at public health facilities. Contact your nearest health facility for specific vaccine availability.",
    confidence: "high",
    sources: ["Kenya MOH"],
  },
};

export async function sendChatMessage(
  message: string,
  language: string
): Promise<ChatMessage> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerMessage = message.toLowerCase();
  let response = MOCK_RESPONSES.default;

  if (lowerMessage.includes("bab") || lowerMessage.includes("child") || lowerMessage.includes("infant")) {
    response = MOCK_RESPONSES.babies;
  } else if (lowerMessage.includes("mmr") || lowerMessage.includes("measles") || lowerMessage.includes("safe")) {
    response = MOCK_RESPONSES.mmr;
  } else if (lowerMessage.includes("where") || lowerMessage.includes("location") || lowerMessage.includes("get vaccin")) {
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
