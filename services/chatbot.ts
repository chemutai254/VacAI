export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: "high" | "medium" | "low";
  sources?: string[];
  timestamp: number;
}

const MOCK_RESPONSES: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: {
    content: "Vaccines are safe and effective ways to protect against serious diseases. Globally, vaccines prevent 3-4 million deaths annually. In Kenya, the Ministry of Health provides free vaccinations at over 7,000 public health facilities across all 47 counties. All vaccines undergo rigorous safety testing by multiple international health authorities including the WHO, U.S. FDA, European Medicines Agency, and China's NMPA before approval.",
    confidence: "high",
  },
  babies: {
    content: "Kenya follows the National Immunization Schedule aligned with global best practices. Babies receive: BCG at birth, Polio (0-4 doses), Pentavalent/DPT-HepB-Hib (6, 10, 14 weeks), Pneumococcal (6, 10, 14 weeks), Rotavirus (6, 10 weeks), and Measles-Rubella at 9 and 18 months. This schedule is similar to those in the USA, Europe, and China, with minor timing variations. All routine childhood vaccines are free at government facilities in Kenya.",
    confidence: "high",
  },
  mmr: {
    content: "The Measles-Rubella (MR) vaccine is very safe and widely used worldwide. Over 20 million doses have been administered in Kenya since 2016. International data shows that over 500 million MMR doses have been given in the United States since the 1970s with an excellent safety record. Side effects are typically mild - slight fever or rash that resolve within a few days. The vaccine prevents potentially fatal measles outbreaks. Global measles deaths have decreased by 73% between 2000-2018 thanks to vaccination programs.",
    confidence: "high",
  },
  location: {
    content: "Free vaccinations are available at: County referral hospitals (47 counties), Sub-county hospitals (over 400), Health centers (3,000+), and Dispensaries (4,000+). Major facilities include Kenyatta National Hospital (Nairobi), Moi Teaching and Referral Hospital (Eldoret), and Coast General Hospital (Mombasa). Visit your nearest facility or call Kenya Health InfoLine: 719 for locations.",
    confidence: "high",
  },
  schedule: {
    content: "The Kenya National Immunization Schedule: Birth (BCG, Polio 0), 6 weeks (Polio 1, Penta 1, PCV 1, Rota 1), 10 weeks (Polio 2, Penta 2, PCV 2, Rota 2), 14 weeks (Polio 3, Penta 3, PCV 3), 9 months (Measles-Rubella 1), 18 months (Measles-Rubella 2). This schedule is harmonized with international recommendations. Keep your child's immunization card safe and bring it to every clinic visit.",
    confidence: "high",
  },
  covid: {
    content: "COVID-19 vaccines are safe and effective. Multiple vaccines (mRNA, vector, and inactivated virus types) are available globally. In Kenya, authorized vaccines include Pfizer, AstraZeneca, Moderna, and Johnson & Johnson. Over 13 billion COVID-19 vaccine doses have been administered worldwide. Common side effects include arm soreness, fatigue, and mild fever for 1-2 days. Serious side effects are extremely rare. Vaccination significantly reduces risk of severe illness, hospitalization, and death.",
    confidence: "high",
  },
  hpv: {
    content: "The HPV vaccine prevents cervical cancer and other HPV-related cancers. Kenya introduced HPV vaccination for 10-year-old girls in 2019. The vaccine is highly effective when given before exposure to the virus. Over 135 countries worldwide include HPV in their national immunization programs. Clinical trials across the USA, Europe, Australia, and Asia have demonstrated 90-99% effectiveness in preventing HPV infections. The vaccine is given in 2 doses, 6-12 months apart.",
    confidence: "high",
  },
  flu: {
    content: "Annual flu vaccination is recommended for high-risk groups including pregnant women, elderly, young children, and people with chronic illnesses. Influenza causes 290,000-650,000 deaths globally each year. The flu vaccine is reformulated annually to match circulating strains identified through global surveillance networks. In Kenya, flu vaccines are available at private clinics and some county hospitals. Protection begins about 2 weeks after vaccination and lasts for the flu season.",
    confidence: "high",
  },
  tetanus: {
    content: "Tetanus vaccination saves over 100,000 newborn lives annually in developing countries. The vaccine is given as part of the pentavalent vaccine for babies and as Td/Tdap boosters. Pregnant women receive 2-5 doses to protect newborns from neonatal tetanus. The vaccine is one of the most effective, providing protection for 10 years after a booster. Tetanus is fatal in 10-20% of cases even with treatment, making vaccination critical.",
    confidence: "high",
  },
  polio: {
    content: "Polio vaccination has reduced global polio cases by over 99.9% since 1988. Kenya has been polio-free since 2011. The country uses both oral polio vaccine (OPV) and inactivated polio vaccine (IPV) as recommended globally. Only Afghanistan and Pakistan still have endemic wild polio transmission. The Global Polio Eradication Initiative, supported by all countries, aims for complete eradication. All children should complete the full polio vaccine series to maintain population immunity.",
    confidence: "high",
  },
  pneumococcal: {
    content: "The pneumococcal conjugate vaccine (PCV) protects against pneumonia, meningitis, and bloodstream infections. Before PCV introduction, pneumococcal disease killed over 800,000 children under 5 annually worldwide. Kenya introduced PCV13 in 2011, covering 13 disease-causing strains. The vaccine has reduced childhood pneumonia cases by 30-40% globally. It's given at 6, 10, and 14 weeks in Kenya, aligning with international schedules. The vaccine is safe with minimal side effects.",
    confidence: "high",
  },
  rotavirus: {
    content: "Rotavirus vaccine prevents severe diarrhea, the second leading cause of death in children under 5 globally. Kenya introduced rotavirus vaccination in 2014. The vaccine is given orally at 6 and 10 weeks. Before vaccine introduction, rotavirus caused over 450,000 child deaths annually worldwide. Countries using the vaccine have seen 40-90% reduction in severe rotavirus diarrhea. The vaccine is highly effective and well-tolerated, with only mild temporary side effects reported.",
    confidence: "high",
  },
  hepatitisB: {
    content: "Hepatitis B vaccine prevents chronic liver infection that can lead to cirrhosis and liver cancer. Globally, hepatitis B causes over 800,000 deaths annually. Kenya includes hepatitis B in the pentavalent vaccine given at 6, 10, and 14 weeks. Vaccination has reduced chronic hepatitis B infection rates by over 95% in countries with universal infant vaccination programs. The vaccine is safe and provides lifelong protection in over 95% of healthy infants when the full series is completed.",
    confidence: "high",
  },
  tuberculosis: {
    content: "The BCG vaccine protects against severe forms of tuberculosis in children, including TB meningitis and disseminated TB. Kenya gives BCG at birth, as recommended for countries with high TB burden. TB causes over 1.5 million deaths globally each year. While BCG doesn't fully prevent lung TB in adults, it provides 70-80% protection against severe childhood TB. The vaccine has been used for over 100 years with an excellent safety record across billions of doses administered worldwide.",
    confidence: "high",
  },
  pregnant: {
    content: "Pregnant women should receive tetanus toxoid, and influenza vaccines. COVID-19 vaccination is also recommended during pregnancy as it protects both mother and baby. The Tdap vaccine (tetanus, diphtheria, pertussis) should be given during each pregnancy, preferably at 27-36 weeks. Studies across multiple countries show these vaccines are safe during pregnancy and reduce infant illness. In Kenya, pregnant women receive tetanus vaccination through antenatal care services. Vaccines during pregnancy pass protective antibodies to the baby.",
    confidence: "high",
  },
  sideEffects: {
    content: "Common vaccine side effects are usually mild and temporary: pain at injection site, low-grade fever, fatigue, or mild rash lasting 1-2 days. These show your immune system is building protection. Serious side effects are extremely rare - less than 1 in a million doses. Global surveillance systems in the USA, Europe, China, and through WHO continuously monitor vaccine safety. Severe allergic reactions occur in about 1 in 500,000 doses and are treatable. The benefits of vaccination far outweigh the minimal risks.",
    confidence: "high",
  },
  effectiveness: {
    content: "Vaccine effectiveness varies by type: Measles vaccine is 97% effective with 2 doses, pertussis vaccine 80-85%, polio vaccine 99-100%, and pneumococcal vaccine 75-90%. These rates are consistent across global studies from the USA, Europe, Africa, and Asia. 'Herd immunity' occurs when 85-95% of a population is vaccinated, protecting even unvaccinated individuals. Vaccine effectiveness is monitored through continuous surveillance in all countries. Booster doses maintain protection for vaccines where immunity wanes over time.",
    confidence: "high",
  },
  allergies: {
    content: "True vaccine allergies are rare. Severe allergic reactions (anaphylaxis) occur in about 1 in 500,000 doses. Children with egg allergies can safely receive most vaccines, including MMR and flu vaccine, under medical supervision. Latex allergies are managed by using latex-free vaccine vials and syringes. If your child has had a severe allergic reaction to a previous vaccine dose, inform the healthcare provider before the next vaccination. Alternative vaccines or modified schedules can be arranged in consultation with an immunization specialist.",
    confidence: "high",
  },
  travel: {
    content: "Travel vaccines depend on your destination. For travel to yellow fever endemic areas (including parts of Kenya), yellow fever vaccine is required. Other travel vaccines include typhoid, hepatitis A, rabies (for wildlife exposure), and meningococcal vaccine (for Hajj pilgrims or travel to meningitis belt countries). Get vaccinated 4-6 weeks before travel for optimal protection. Kenya's international vaccination centers are located at Kenyatta National Hospital, Moi International Airport, and other major entry points. Bring your yellow card (international certificate of vaccination) when traveling.",
    confidence: "high",
  },
  newVaccines: {
    content: "New vaccines undergo 10-15 years of development and testing before approval. This includes laboratory studies, animal testing, and three phases of human clinical trials involving thousands of participants. Regulatory agencies in the USA, Europe, China, Japan, and through WHO review all safety and effectiveness data before approval. Post-approval, ongoing surveillance monitors millions of doses for rare side effects. Recent vaccine innovations include mRNA technology (COVID-19 vaccines), malaria vaccine (RTS,S approved for use in Kenya), and improved dengue vaccines. All new vaccines meet the same rigorous safety standards as traditional vaccines.",
    confidence: "high",
  },
};

export async function sendChatMessage(
  message: string,
  language: string
): Promise<ChatMessage> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerMessage = message.toLowerCase();
  let response = MOCK_RESPONSES.default;

  if (lowerMessage.includes("covid") || lowerMessage.includes("corona") || lowerMessage.includes("mrna") || lowerMessage.includes("pfizer") || lowerMessage.includes("moderna")) {
    response = MOCK_RESPONSES.covid;
  } else if (lowerMessage.includes("hpv") || lowerMessage.includes("cervical") || lowerMessage.includes("cancer")) {
    response = MOCK_RESPONSES.hpv;
  } else if (lowerMessage.includes("flu") || lowerMessage.includes("influenza") || lowerMessage.includes("homa")) {
    response = MOCK_RESPONSES.flu;
  } else if (lowerMessage.includes("tetanus") || lowerMessage.includes("lockjaw") || lowerMessage.includes("pepopunda")) {
    response = MOCK_RESPONSES.tetanus;
  } else if (lowerMessage.includes("polio") || lowerMessage.includes("paralysis")) {
    response = MOCK_RESPONSES.polio;
  } else if (lowerMessage.includes("pneumo") || lowerMessage.includes("pneumonia")) {
    response = MOCK_RESPONSES.pneumococcal;
  } else if (lowerMessage.includes("rota") || lowerMessage.includes("diarr") || lowerMessage.includes("kuharisha")) {
    response = MOCK_RESPONSES.rotavirus;
  } else if (lowerMessage.includes("hepatitis") || lowerMessage.includes("liver") || lowerMessage.includes("ini")) {
    response = MOCK_RESPONSES.hepatitisB;
  } else if (lowerMessage.includes("bcg") || lowerMessage.includes("tb") || lowerMessage.includes("tuberc") || lowerMessage.includes("kifua")) {
    response = MOCK_RESPONSES.tuberculosis;
  } else if (lowerMessage.includes("pregnan") || lowerMessage.includes("mimba") || lowerMessage.includes("expecting") || lowerMessage.includes("mjamzito")) {
    response = MOCK_RESPONSES.pregnant;
  } else if (lowerMessage.includes("side effect") || lowerMessage.includes("reaction") || lowerMessage.includes("athiri")) {
    response = MOCK_RESPONSES.sideEffects;
  } else if (lowerMessage.includes("effective") || lowerMessage.includes("work") || lowerMessage.includes("herd") || lowerMessage.includes("immunity")) {
    response = MOCK_RESPONSES.effectiveness;
  } else if (lowerMessage.includes("allerg") || lowerMessage.includes("egg") || lowerMessage.includes("latex")) {
    response = MOCK_RESPONSES.allergies;
  } else if (lowerMessage.includes("travel") || lowerMessage.includes("yellow fever") || lowerMessage.includes("trip") || lowerMessage.includes("safari")) {
    response = MOCK_RESPONSES.travel;
  } else if (lowerMessage.includes("new vaccin") || lowerMessage.includes("recent") || lowerMessage.includes("latest") || lowerMessage.includes("development") || lowerMessage.includes("malaria")) {
    response = MOCK_RESPONSES.newVaccines;
  } else if (lowerMessage.includes("bab") || lowerMessage.includes("child") || lowerMessage.includes("infant") || lowerMessage.includes("watoto") || lowerMessage.includes("mtoto")) {
    response = MOCK_RESPONSES.babies;
  } else if (lowerMessage.includes("when") || lowerMessage.includes("schedule") || lowerMessage.includes("ratiba") || lowerMessage.includes("lini")) {
    response = MOCK_RESPONSES.schedule;
  } else if (lowerMessage.includes("mmr") || lowerMessage.includes("measles") || lowerMessage.includes("rubella") || lowerMessage.includes("surua")) {
    response = MOCK_RESPONSES.mmr;
  } else if (lowerMessage.includes("where") || lowerMessage.includes("location") || lowerMessage.includes("get vaccin") || lowerMessage.includes("wapi") || lowerMessage.includes("kituo")) {
    response = MOCK_RESPONSES.location;
  }

  return {
    id: Date.now().toString(),
    role: "assistant",
    content: response.content,
    confidence: response.confidence,
    timestamp: Date.now(),
  };
}

export const chatbotService = {
  sendMessage: sendChatMessage,
};

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
