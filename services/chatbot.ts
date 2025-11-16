export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: "high" | "medium" | "low";
  sources?: string[];
  timestamp: number;
}

const MOCK_RESPONSES_EN: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
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

const MOCK_RESPONSES_SW: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: {
    content: "Chanjo ni salama na zenye ufanisi katika kulinda dhidi ya magonjwa makali. Duniani kote, chanjo zinazuia vifo milioni 3-4 kwa mwaka. Nchini Kenya, Wizara ya Afya inatoa chanjo bure katika vituo zaidi ya 7,000 vya afya vya umma katika kaunti zote 47. Chanjo zote zinapitia majaribio makali ya usalama na mamlaka za kimataifa za afya pamoja na WHO, U.S. FDA, European Medicines Agency, na China's NMPA kabla ya kuidhinishwa.",
    confidence: "high",
  },
  babies: {
    content: "Kenya inafuata Ratiba ya Taifa ya Chanjo inayolingana na mazoezi bora ya kimataifa. Watoto wachanga hupokea: BCG wakati wa kuzaliwa, Polio (kipimo 0-4), Pentavalent/DPT-HepB-Hib (wiki 6, 10, 14), Pneumococcal (wiki 6, 10, 14), Rotavirus (wiki 6, 10), na Measles-Rubella miezi 9 na 18. Ratiba hii ni sawa na ile ya USA, Ulaya, na China, kwa tofauti ndogo za muda. Chanjo zote za kawaida za watoto wachanga ni bure katika vituo vya serikali nchini Kenya.",
    confidence: "high",
  },
  schedule: {
    content: "Ratiba ya Taifa ya Chanjo ya Kenya: Kuzaliwa (BCG, Polio 0), Wiki 6 (Polio 1, Penta 1, PCV 1, Rota 1), Wiki 10 (Polio 2, Penta 2, PCV 2, Rota 2), Wiki 14 (Polio 3, Penta 3, PCV 3), Miezi 9 (Measles-Rubella 1), Miezi 18 (Measles-Rubella 2). Ratiba hii imeunganishwa na mapendekezo ya kimataifa. Weka kadi ya chanjo ya mtoto wako salama na uilete kila unapotembelea kliniki.",
    confidence: "high",
  },
  location: {
    content: "Chanjo bure zinapatikana katika: Hospitali za kaunti (kaunti 47), Hospitali za wilaya (zaidi ya 400), Vituo vya afya (zaidi ya 3,000), na Zahanati (zaidi ya 4,000). Vituo vikuu ni pamoja na Hospitali ya Taifa ya Kenyatta (Nairobi), Hospitali ya Rufaa ya Moi (Eldoret), na Hospitali Kuu ya Pwani (Mombasa). Tembelea kituo cha karibu nawe au piga simu Kenya Health InfoLine: 719 kwa maeneo.",
    confidence: "high",
  },
  sideEffects: {
    content: "Athari za kawaida za chanjo kwa kawaida ni nyepesi na za muda mfupi: maumivu mahali pa sindano, homa ya chini, uchovu, au upele mdogo unaoisha kwa siku 1-2. Hizi zinaonyesha mfumo wako wa kinga unaj jenga ulinzi. Athari kali ni nadra sana - chini ya 1 kwa milioni ya vipimo. Mifumo ya ufuatiliaji wa kimataifa nchini USA, Ulaya, China, na kupitia WHO inafuatilia usalama wa chanjo kila wakati. Athari kali za mzio hutokea katika karibu 1 kwa 500,000 vipimo na zinaweza kutibiwa. Faida za chanjo zinazidi sana hatari ndogo.",
    confidence: "high",
  },
};

const MOCK_RESPONSES_KIK: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: {
    content: "Ithimi cia mĩĩrĩ nĩ thogora na nĩ cia kĩgũrũkĩri kũgitĩra mĩrimũ mĩrũ. Thĩ yothe, ithimi cia mĩĩrĩ nĩigitanagia gĩkuũ kĩa andũ miliyoni 3-4 o mwaka. Bũrũri-inĩ wa Kenya, Wizara ya Ũgima nĩĩtũhagĩra ithimi cia mĩĩrĩ cia thogora kũndũ kũingĩ gũkĩra 7,000 kwa vituo vya ũgima vya ũmũthĩngĩ kaunti-inĩ ciothe 47. Ithimi ciothe cia mĩĩrĩ nĩcigeragio wega nĩ mamlaka ma kimataifa ma ũgima marĩ hamwe na WHO, U.S. FDA, European Medicines Agency, na China's NMPA mbere ya gũtĩkĩrio.",
    confidence: "high",
  },
  babies: {
    content: "Kenya nĩĩrũmagĩrĩra Ratiba ya Bũrũri ya Ithimi cia Mĩĩrĩ ĩrĩa ĩhaananĩtie na mĩtugo mĩega ya thĩ yothe. Ciana iria nini nĩĩnyuuaga: BCG rĩrĩa iciarĩtwo, Polio (mĩigana 0-4), Pentavalent/DPT-HepB-Hib (ciumia 6, 10, 14), Pneumococcal (ciumia 6, 10, 14), Rotavirus (ciumia 6, 10), na Measles-Rubella mĩeri 9 na 18. Ratiba ĩno nĩ ta ĩrĩa ya USA, Ulaya, na China, no ĩrĩ na ũtiganu mũnini wa ihinda. Ithimi ciothe cia kawaida cia ciana iria nini nĩ cia thogora kũndũ kwa vituo vya thirikari thĩinĩ wa Kenya.",
    confidence: "high",
  },
  schedule: {
    content: "Ratiba ya Bũrũri ya Ithimi cia Mĩĩrĩ ya Kenya: Gũciarwo (BCG, Polio 0), Kiumia 6 (Polio 1, Penta 1, PCV 1, Rota 1), Kiumia 10 (Polio 2, Penta 2, PCV 2, Rota 2), Kiumia 14 (Polio 3, Penta 3, PCV 3), Mĩeri 9 (Measles-Rubella 1), Mĩeri 18 (Measles-Rubella 2). Ratiba ĩno nĩĩnyiitanĩtio na mathimo ma kimataifa. Iga karata ya ithimi cia mwana waku wega na ũmĩrehage o rĩrĩa ũgũthiĩ kĩlĩniki.",
    confidence: "high",
  },
  location: {
    content: "Ithimi cia mĩĩrĩ cia thogora irĩ kũndũ kũrĩ: Mahiga ma kaunti (kaunti 47), Mahiga ma sub-county (makĩria ma 400), Vituo vya ũgima (makĩria ma 3,000), na Zahanati (makĩria ma 4,000). Vituo ikũrũ nĩ ikĩrĩra Kĩhiga kĩa Taifa kĩa Kenyatta (Nairobi), Kĩhiga kĩa Kũruta na Kũrorera kĩa Moi (Eldoret), na Kĩhiga Kĩnene kĩa Pwani (Mombasa). Thii kĩhiga kĩrĩa kĩrĩ hakuhĩ nawe kana ũhone Kenya Health InfoLine: 719 nĩguo ũmenye kũndũ.",
    confidence: "high",
  },
  sideEffects: {
    content: "Athiri ma kawaida ma ithimi cia mĩĩrĩ maingĩ makagĩa maharũaru na ma ihinda inini: ruo handũ hao handũrĩtwo ndago, homa ya thĩ, ũnogu, kana mbũthũũ nini ĩrĩa ĩthiraga kwa matukũ 1-2. Icio nĩcionanagia atĩ mũthĩrĩrĩ waku wa kũgitanĩra mĩrimũ ũraaka ũgitĩri. Athiri marũru nĩ monanekaga nini mũno - makĩria ma 1 kwa miliyoni ya mĩigana. Mĩthiĩrĩre ya kũrũmbũiya ya kimataifa kũrĩa kũrĩ USA, Ulaya, China, na kũgererania na WHO nĩĩrũmbũiyaga thogora wa ithimi cia mĩĩrĩ hĩndĩ ciothe. Athiri marũru ma kũiguithia nĩmonanekaga harĩa hakuhĩ na 1 kwa 500,000 mĩigana na no mahonio. Wega wa ithimi cia mĩĩrĩ nĩũkĩrĩte mũno ũthakaro ũrĩa mũnini.",
    confidence: "high",
  },
};

const MOCK_RESPONSES_LUO: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: {
    content: "Yath mag thuolo gin kare kendo tiyo malongʼo e rito tuoche malich. E piny duto, yath mag thuolo gengo tho mar ji milion 3-4 higa ka higa. E piny Kenya, Wizara mar Ngima chiwo yath mag thuolo maonge chudo e kuonde madirom 7,000 mag ngima mag piny e kaunti duto 47. Yath mag thuolo duto kalogi matek mar rito kare gi jotelone mag ngima e piny duto kaachiel gi WHO, U.S. FDA, European Medicines Agency, kod China's NMPA kapok oyiego.",
    confidence: "high",
  },
  babies: {
    content: "Kenya luwo Chenro mar Piny mar Yath mag Thuolo moluoro gi timbe mabeyo mag piny duto. Nyithindo matindo yudo: BCG sa ma ginywolo, Polio (chenro 0-4), Pentavalent/DPT-HepB-Hib (jumbe 6, 10, 14), Pneumococcal (jumbe 6, 10, 14), Rotavirus (jumbe 6, 10), kod Measles-Rubella dweche 9 gi 18. Chenro-ni chalre gi mar USA, Ulaya, kod China, to nitie pogruok matin mar kinde. Yath mag thuolo duto mag kawaida mag nyithindo matindo gin maonge chudo e kuonde mag piny e piny Kenya.",
    confidence: "high",
  },
  schedule: {
    content: "Chenro mar Piny mar Yath mag Thuolo mar Kenya: Nywol (BCG, Polio 0), Juma 6 (Polio 1, Penta 1, PCV 1, Rota 1), Juma 10 (Polio 2, Penta 2, PCV 2, Rota 2), Juma 14 (Polio 3, Penta 3, PCV 3), Dweche 9 (Measles-Rubella 1), Dweche 18 (Measles-Rubella 2). Chenro-ni osekethi gi puonj mag piny duto. Kan karat mar yath mag thuolo mar nyathini maber kendo ikelgi kinde duto ma idhi e kliniki.",
    confidence: "high",
  },
  location: {
    content: "Yath mag thuolo maonge chudo yudore e: Yier mar kaunti (kaunti 47), Yier mar sub-kaunti (moloyo 400), Kuonde mag ngima (moloyo 3,000), kod Zahanati (moloyo 4,000). Kuonde madongo mogik e magi gin Yier mar Piny mar Kenyatta (Nairobi), Yier mar Puonj kod Refo mar Moi (Eldoret), kod Yier Maduongʼ mar Pwani (Mombasa). Dhi e kar ngima manie machiegni kodi kata luong Kenya Health InfoLine: 719 mondo iyud kuonde.",
    confidence: "high",
  },
  sideEffects: {
    content: "Chandruok mag kawaida mag yath mag thuolo kadiemo gin mayot kendo gin mar kinde matin: rem e kar chwoyo, liet matin, ool, kata nam matin marumo bang ndalo 1-2. Mago nyiso ni kaka ringri rito tuoche bedo ka gero rito. Chandruok malit gin madiemo ahinya - piny moloyo 1 e milion mag chenro. Chenro mar luwo mag piny duto e piny USA, Ulaya, China, kod kokalo gi WHO luwo rito mar yath mag thuolo kinde duto. Chandruok malit mag kwer timore machiegni gi 1 e 500,000 chenro kendo nyalore chang. Konyruok mar yath mag thuolo loyo ahinya chandruok matin.",
    confidence: "high",
  },
};

const MOCK_RESPONSES_KAM: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: {
    content: "Syĩthimi sya mwĩĩlĩ nĩ sya thogola na syĩ sya kĩgũlũkĩo kũũa mĩtũũ mĩnene. Thĩ yũmwe, syĩthimi sya mwĩĩlĩ nĩsyũĩaa ũkũũ wa andũ milioni 3-4 mwaka o mwaka. Nthĩ ya Kenya, Wizara ya Ũgima nĩyĩtũĩaa syĩthimi sya mwĩĩlĩ sya thogola kũma kũĩaa kana 7,000 kwa sĩtuo sya ũgima sya ũmũthĩ kaunti syothe 47. Syĩthimi syothe sya mwĩĩlĩ nĩsyĩkalelĩawa nesa nĩ mamlaka ma thĩ yũmwe ma ũgima na WHO, U.S. FDA, European Medicines Agency, na China's NMPA mbee ya kwendelewa.",
    confidence: "high",
  },
  babies: {
    content: "Kenya yĩlũĩlaa Latĩba ya Nthĩ ya Syĩthimi sya Mwĩĩlĩ ĩla ĩvĩanĩte na mĩtugo mĩega ya thĩ yũmwe. Twana tũnĩnĩ twĩkũawa: BCG ĩkĩ syakwalĩtwe, Polio (mĩwango 0-4), Pentavalent/DPT-HepB-Hib (syũmia 6, 10, 14), Pneumococcal (syũmia 6, 10, 14), Rotavirus (syũmia 6, 10), na Measles-Rubella myesĩ 9 na 18. Latĩba ĩĩ nĩ ta ya USA, Ulaya, na China, no yĩ na ũtigano mũnĩnĩ wa ĩkĩndĩ. Syĩthimi syothe sya kawaida sya twana tũnĩnĩ nĩ sya thogola kũma kwa sĩtuo sya syelikali nthĩ wa Kenya.",
    confidence: "high",
  },
  schedule: {
    content: "Latĩba ya Nthĩ ya Syĩthimi sya Mwĩĩlĩ ya Kenya: Kũsyalĩwa (BCG, Polio 0), Kyũmia 6 (Polio 1, Penta 1, PCV 1, Rota 1), Kyũmia 10 (Polio 2, Penta 2, PCV 2, Rota 2), Kyũmia 14 (Polio 3, Penta 3, PCV 3), Myesĩ 9 (Measles-Rubella 1), Myesĩ 18 (Measles-Rubella 2). Latĩba ĩĩ nĩyũnganĩsĩtwe na mathĩmo ma thĩ yũmwe. Ĩa kalata ya syĩthimi sya mwana waku nesa na ũmĩletage o ĩkĩ ũkathiĩ kĩlĩniki.",
    confidence: "high",
  },
  location: {
    content: "Syĩthimi sya mwĩĩlĩ sya thogola syĩ kũma kũĩaa: Ĩsĩtala sya kaunti (kaunti 47), Ĩsĩtala sya sub-kaunti (makĩĩa ma 400), Sĩtuo sya ũgima (makĩĩa ma 3,000), na Zahanati (makĩĩa ma 4,000). Sĩtuo ikũlũ nĩ syĩkĩlaa Ĩsĩtala ya Taifa ya Kenyatta (Nairobi), Ĩsĩtala ya Kũluta na Kũnenetheya ya Moi (Eldoret), na Ĩsĩtala Nene ya Pwani (Mombasa). Thiĩ kĩtuo kĩla kĩlĩ hakũĩ nawe kana ũhone Kenya Health InfoLine: 719 nĩũndũ wa kũmanya kũma.",
    confidence: "high",
  },
  sideEffects: {
    content: "Mathĩlĩ ma kawaida ma syĩthimi sya mwĩĩlĩ maingĩ makagĩa maũlũũ na ma ĩkĩndĩ ĩnĩnĩ: mĩthamo kũma kwathĩmĩtwo ndago, homa ya ĩsĩ, ũnonokĩ, kana mbũthũũ nĩnĩ ĩla ĩthĩlaaa kwa matũkũ 1-2. Ĩsyo nĩsyonanaaa atĩ mũthĩlĩlĩ waku wa kũũaa mĩtũũ ũlakũa ũũo. Mathĩlĩ manene nĩ moonekaa nĩnĩ mũno - makĩĩa ma 1 kwa milioni ya mĩwango. Mĩthĩĩlĩle ya kũlolelaa ya thĩ yũmwe kũla kũlĩ USA, Ulaya, China, na kũgelalana na WHO nĩyĩlolelaaaa thogola wa syĩthimi sya mwĩĩlĩ ĩkĩndĩ yothe. Mathĩlĩ manene ma kũĩaa nĩmoonekaa hakũĩ na 1 kwa 500,000 mĩwango na no mahonio. Ũega wa syĩthimi sya mwĩĩlĩ nĩũkĩlĩte mũno ũthakalo ũla mũnĩnĩ.",
    confidence: "high",
  },
};

const MOCK_RESPONSES_LUY: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: {
    content: "Chinduli chia mubili ni chimalafu kandi chikakola khubusia amalwale amanene. Munsi yosi, chinduli chia mubili chikhusitsa alufu khofu luswa 3-4 khila mwaka. Mu Kenya, Wizara ya Ebulamu yekhawa chinduli chia mubili chia bure mundu abakhopera 7,000 ebitundu ebia ebulamu ebia omwandu khila kaunti 47. Chinduli chiosi chia mubili chikhenyanga omupimi omunene khwa mamlaka cha munsi yosi khwa WHO, U.S. FDA, European Medicines Agency, nende China's NMPA mbele ye kulekhekerwa.",
    confidence: "high",
  },
  babies: {
    content: "Kenya yeetsalira Elisiti lya Taifa lya Chinduli chia Mubili liria likhukolana nende emisango emiafu echia munsi yosi. Abana abachende baliawa: BCG lwakhubalwa, Polio (emisambulo 0-4), Pentavalent/DPT-HepB-Hib (tsimikha 6, 10, 14), Pneumococcal (tsimikha 6, 10, 14), Rotavirus (tsimikha 6, 10), nende Measles-Rubella omweri 9 nende 18. Elisiti elio nilyo tawe lya USA, Ulaya, nende China, no lirindi obulika obuchende obwa obuleko. Chinduli chiosi chia kawaida chia abana abachende ni chia bure ebitundu ebia obukuru mu Kenya.",
    confidence: "high",
  },
  schedule: {
    content: "Elisiti lya Taifa lya Chinduli chia Mubili lya Kenya: Khubalwa (BCG, Polio 0), Tsimikha 6 (Polio 1, Penta 1, PCV 1, Rota 1), Tsimikha 10 (Polio 2, Penta 2, PCV 2, Rota 2), Tsimikha 14 (Polio 3, Penta 3, PCV 3), Omweri 9 (Measles-Rubella 1), Omweri 18 (Measles-Rubella 2). Elisiti elio liakhukolania nende obukomboli obwa munsi yosi. Khanga ekadi ya chinduli chia omwana wao malafu khandi urilete khila lwakhutsira kiliniki.",
    confidence: "high",
  },
  location: {
    content: "Chinduli chia mubili chia bure chikhopera mu: Esipitali esia kaunti (kaunti 47), Esipitali esia sub-kaunti (khopera 400), Ebitundu ebia ebulamu (khopera 3,000), nende Zahanati (khopera 4,000). Ebitundu ebinene nikho Esipitali ya Taifa ya Kenyatta (Nairobi), Esipitali ya Khwisomesa nende Khwesia ya Moi (Eldoret), nende Esipitali Khulwakho lwa Pwani (Mombasa). Tsira ebitundu ebia ebulamu ebirio bikhuhukhana nawe kandi ohofe Kenya Health InfoLine: 719 khwa ebitundu.",
    confidence: "high",
  },
  sideEffects: {
    content: "Amatshilo ka kawaida ka chinduli chia mubili kanji kariakaba kamalafu kandi ka obuleko obuchende: obulumia mundu ombaawo khalanga, efievre iachende, obukhafu, kandi omusono omuchende okhurumila amasiku 1-2. Akha khalanga atsi omubili wao wa khusitsia amalwale khulia khubekhania. Amatshilo ka omunene kariakaba karinji muno - pasi khofu 1 mu milioni ya emisambulo. Omupimi wa khulolera wa munsi yosi mundu omurindi USA, Ulaya, China, nende khukhubirila WHO khulolera obulamu obwa chinduli chia mubili obuleko yosi. Amatshilo ka omunene ka obwafu kaakhabanga hakhuhukhana nende 1 mu 500,000 emisambulo kandi kanyalwa khumianga. Obulamu obwa chinduli chia mubili bwopera muno obuwemu obuchende.",
    confidence: "high",
  },
};

const MOCK_RESPONSES_KAL: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: {
    content: "Kotunet chi keny chebo keny ak chi keny ketabukwenyan tugul che moiyotnenet. Ak echii kotinwek, kotunet chemotet kipkuren mising 3-4 keny kila mwaka. Ak piny Kenya, Wizara ak oboimoi kochobot kotunet che atagartar ak tinwekyot ab kotunet 7,000 ak kotunet ab pechot ab piny ak kaunti kotinwek 47. Kotunet kotinwek chebutkoi kotunet ne tilil ak mamlaka ak echii ak oboimoi kou ak WHO, U.S. FDA, European Medicines Agency, ak China's NMPA keny omei yik agobo tugul.",
    confidence: "high",
  },
  babies: {
    content: "Kenya kobuktei Kotunet ak Piny ak Kotunet che kobatkoi ak timwek ne tilil ak echii kotinwek. Lakwet che ngongut chotindo: BCG ketoret, Polio (kararan 0-4), Pentavalent/DPT-HepB-Hib (jumik 6, 10, 14), Pneumococcal (jumik 6, 10, 14), Rotavirus (jumik 6, 10), ak Measles-Rubella arwek 9 ak 18. Kotunet ne omakei ak ne USA, Ulaya, ak China, mana ketamun arget ne ngongut ak kora. Kotunet kotinwek ak tilil ak lakwet che ngongut chi atagartar ak tinwekyot ab kotunet ab piny ak Kenya.",
    confidence: "high",
  },
  schedule: {
    content: "Kotunet ak Piny ak Kotunet ak Kenya: Ketoret (BCG, Polio 0), Jumik 6 (Polio 1, Penta 1, PCV 1, Rota 1), Jumik 10 (Polio 2, Penta 2, PCV 2, Rota 2), Jumik 14 (Polio 3, Penta 3, PCV 3), Arwek 9 (Measles-Rubella 1), Arwek 18 (Measles-Rubella 2). Kotunet ne kobotkoi ak timwek ak echii kotinwek. Ngolei karata ak kotunet ak lakwani tilil ak kachobo kila ibotu kiliniki.",
    confidence: "high",
  },
  location: {
    content: "Kotunet che atagartar ketamun ak: Isipitali ak kaunti (kaunti 47), Isipitali ak sub-kaunti (kochop 400), Tinwekyot ab oboimoi (kochop 3,000), ak Zahanati (kochop 4,000). Tinwekyot ne kokwotik chebo Isipitali ak Piny ak Kenyatta (Nairobi), Isipitali ak Kobutei ak Kokeretei ak Moi (Eldoret), ak Isipitali Kokwotik ak Pwani (Mombasa). Botu tinwek ab oboimoi ne ketamun hagaitoi ak in ko chongi Kenya Health InfoLine: 719 keny bek tinwekyot.",
    confidence: "high",
  },
  sideEffects: {
    content: "Timwek ne maitet ak tilil ak kotunet chotindo chebo kokomukei ak kararan ne ngongut: ngumwa ak muut ne kepitkoi, timut ne ngongut, ngalal, ko nam ne ngongut ne komut betutik 1-2. Kunun komui atine muun wendi ak kongotet tugul kebuktei ngolel. Timwek ne moiyo chebo maitet kwee muno - ngat 1 ak milion ak kararan. Kotunet ak komui ak echii kotinwek ak muut ne ketamun USA, Ulaya, China, ak kochek ak WHO komui oboimoi ak kotunet kararan kotinwek. Timwek ne moiyo ak kwer ketamu hagaitoi ak 1 ak 500,000 kararan ak keyineng kocheng. Tilil ak kotunet kosoget muno timwek ne ngongut.",
    confidence: "high",
  },
};

const MOCK_RESPONSES_SO: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: {
    content: "Tallaalka waa badbaado oo waxtar leh oo ka ilaaliya cudurrada halis ah. Adduunka oo dhan, tallaalku wuxuu yareeya dhimashada milyan 3-4 sannad kasta. Dalka Kenya, Wasaaradda Caafimaadka ayaa bixisa tallaalo bilaash ah oo ka mid ah in ka badan 7,000 xarumaha caafimaadka dadweynaha ee 47-ka gobol. Dhammaan tallaalada ayaa la tijaabiyaa si adag amniga iyo hay'adaha caafimaadka adduunka oo ay ka mid yihiin WHO, U.S. FDA, European Medicines Agency, iyo China's NMPA ka hor inta aan la oggolaan.",
    confidence: "high",
  },
  babies: {
    content: "Kenya waxay raacaysaa Jadwalka Qaranka ee Tallaalka oo la mid ah hab-dhaqameedka ugu fiican adduunka. Dhallaanka yaryar waxay helaan: BCG markii la dhalo, Polio (qiyaasyo 0-4), Pentavalent/DPT-HepB-Hib (todobaadyo 6, 10, 14), Pneumococcal (todobaadyo 6, 10, 14), Rotavirus (todobaadyo 6, 10), iyo Measles-Rubella bilo 9 iyo 18. Jadwalkan wuxuu la mid yahay kan USA, Yurub, iyo Shiinaha, oo leh farqi yar oo waqti ah. Dhammaan tallaalada caadiga ah ee dhallaanka yaryar waa bilaash ah xarumaha dawladda Kenya.",
    confidence: "high",
  },
  schedule: {
    content: "Jadwalka Qaranka ee Tallaalka ee Kenya: Dhalasho (BCG, Polio 0), Toddobaad 6 (Polio 1, Penta 1, PCV 1, Rota 1), Toddobaad 10 (Polio 2, Penta 2, PCV 2, Rota 2), Toddobaad 14 (Polio 3, Penta 3, PCV 3), Bilo 9 (Measles-Rubella 1), Bilo 18 (Measles-Rubella 2). Jadwalkan wuxuu isku xiran yahay talooyinka caalamiga ah. Keydi kaadhka tallaalka ilmahaaga si ammaan ah oo keeni mar kasta oo aad tagto kilinikada.",
    confidence: "high",
  },
  location: {
    content: "Tallaalada bilaash ah ayaa laga helayaa: Isbitaalada gobolka (47 gobol), Isbitaalada hoose (in ka badan 400), Xarumaha caafimaadka (in ka badan 3,000), iyo Zahanati (in ka badan 4,000). Xarumaha waaweyn waxaa ka mid ah Isbitaalka Qaranka ee Kenyatta (Nairobi), Isbitaalka Waxbarasho iyo Tixraac ee Moi (Eldoret), iyo Isbitaalka Weyn ee Xeebta (Mombasa). Booqo xarunta caafimaadka ee kuu dhow ama wac Kenya Health InfoLine: 719 si aad u hesho meelaha.",
    confidence: "high",
  },
  sideEffects: {
    content: "Cawaaqibka caadiga ah ee tallaalku inta badan way fududahay oo waa kuwo waqti gaaban: xanuun meesha mudnaanta, qandho kooban, daal, ama kabax yar oo dhammaada 1-2 maalmood. Kuwan waxay muujinayaan in nidaamkaaga difaaca uu dhisayo difaac. Cawaaqibka daran aad bay u yar yihiin - ka yar 1 milyan qiyaas. Nidaamyada la socodka caalamiga ah ee dalal ay ka mid yihiin USA, Yurub, Shiinaha, iyo iyada oo loo marayo WHO waxay la socdaan amniga tallaalka had iyo jeer. Cawaaqibka xun ee allergiga waxay ku dhacaan qiyaastii 1 500,000 qiyaas oo la daweyn karo. Faa'iidada tallaalku way ka badan yihiin khataraha yar yar.",
    confidence: "high",
  },
};

const MOCK_RESPONSES_MIJ: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: { content: "Sindano za mwili ni salama na zenye ufanisi katika kulinda dhidi ya magonjwa makubwa. Duniani kote, sindano zinazuia vifo milioni 3-4 kwa mwaka. Nchini Kenya, Wizara ya Afya inatoa sindano bure katika vituo zaidi ya 7,000 vya afya vya umma katika kaunti zote 47. Sindano zote zinapitia majaribio makali ya usalama na mamlaka za kimataifa za afya pamoja na WHO, U.S. FDA, European Medicines Agency, na China's NMPA kabla ya kuidhinishwa.", confidence: "high" },
  babies: { content: "Kenya inafuata Ratiba ya Taifa ya Sindano inayolingana na mazoezi bora ya kimataifa. Watoto wachanga hupokea: BCG wakati wa kuzaliwa, Polio (kipimo 0-4), Pentavalent/DPT-HepB-Hib (wiki 6, 10, 14), Pneumococcal (wiki 6, 10, 14), Rotavirus (wiki 6, 10), na Measles-Rubella miezi 9 na 18. Ratiba hii ni sawa na ile ya USA, Ulaya, na China, kwa tofauti ndogo za muda. Sindano zote za kawaida za watoto wachanga ni bure katika vituo vya serikali nchini Kenya.", confidence: "high" },
  schedule: { content: "Ratiba ya Taifa ya Sindano ya Kenya: Kuzaliwa (BCG, Polio 0), Wiki 6 (Polio 1, Penta 1, PCV 1, Rota 1), Wiki 10 (Polio 2, Penta 2, PCV 2, Rota 2), Wiki 14 (Polio 3, Penta 3, PCV 3), Miezi 9 (Measles-Rubella 1), Miezi 18 (Measles-Rubella 2). Ratiba hii imeunganishwa na mapendekezo ya kimataifa. Weka kadi ya sindano ya mtoto wako salama na uilete kila unapotembelea kliniki.", confidence: "high" },
  location: { content: "Sindano bure zinapatikana katika: Hospitali za kaunti (kaunti 47), Hospitali za wilaya (zaidi ya 400), Vituo vya afya (zaidi ya 3,000), na Zahanati (zaidi ya 4,000). Vituo vikuu ni pamoja na Hospitali ya Taifa ya Kenyatta (Nairobi), Hospitali ya Rufaa ya Moi (Eldoret), na Hospitali Kuu ya Pwani (Mombasa). Tembelea kituo cha karibu nawe au piga simu Kenya Health InfoLine: 719 kwa maeneo.", confidence: "high" },
  sideEffects: { content: "Athari za kawaida za sindano kwa kawaida ni nyepesi na za muda mfupi: maumivu mahali pa sindano, homa ya chini, uchovu, au upele mdogo unaoisha kwa siku 1-2. Hizi zinaonyesha mfumo wako wa kinga unajenga ulinzi. Athari kali ni nadra sana - chini ya 1 kwa milioni ya vipimo. Mifumo ya ufuatiliaji wa kimataifa nchini USA, Ulaya, China, na kupitia WHO inafuatilia usalama wa sindano kila wakati. Athari kali za mzio hutokea katika karibu 1 kwa 500,000 vipimo na zinaweza kutibiwa. Faida za sindano zinazidi sana hatari ndogo.", confidence: "high" },
};

const MOCK_RESPONSES_TUV: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: { content: "Ng'ikalakar ng'ikokion akonito ekore akuj na alokori ngikamatak ng'akipi. Ka ekar kotere, ng'ikalakar akokono eng'ol ekokio ng'imurok nga kirruc 3-4 ka alopar. Ka piny Kenya, Wizara ng'o ikokion akuju ng'ikalakar nga kokori ka ng'itunga nga lopot 7,000 nga ikokion nga imurok ka county kotere 47. Ng'ikalakar kotere ekokono akirang'un nga kanyit nga ikokion ka WHO, U.S. FDA, European Medicines Agency, na China's NMPA ngolo aamun ekokut.", confidence: "high" },
  babies: { content: "Kenya ekodokin ng'ipetio nga piny nga ng'ikalakar nga ekokwaan karin nga timbe nga aapei nga ekar kotere. Ng'itunoi nga lotokou ekobuno: BCG ka eyala, Polio (ng'ipetio 0-4), Pentavalent/DPT-HepB-Hib (ng'iwiki 6, 10, 14), Pneumococcal (ng'iwiki 6, 10, 14), Rotavirus (ng'iwiki 6, 10), kana Measles-Rubella ng'ilapa 9 na 18. Ng'ipetio neni ekokaan karin nga ne USA, Ulaya, na China, karin totokou nga lotokou nga ikinde. Ng'ikalakar kotere nga timbe nga ng'itunoi nga lotokou ekokori ka ng'itunga nga serikali ka Kenya.", confidence: "high" },
  schedule: { content: "Ng'ipetio nga Piny nga Ng'ikalakar nga Kenya: Eyala (BCG, Polio 0), Ng'iwiki 6 (Polio 1, Penta 1, PCV 1, Rota 1), Ng'iwiki 10 (Polio 2, Penta 2, PCV 2, Rota 2), Ng'iwiki 14 (Polio 3, Penta 3, PCV 3), Ng'ilapa 9 (Measles-Rubella 1), Ng'ilapa 18 (Measles-Rubella 2). Ng'ipetio neni ekokwan karin ng'itimut nga ekar kotere. Keng'etikin kadi nga ng'ikalakar nga emoni ijo aapei kana ilet akuj ka eyakin kiliniki.", confidence: "high" },
  location: { content: "Ng'ikalakar nga kokori ekobobun ka: Hospitali nga county (county 47), Hospitali nga sub-county (lopot 400), Ng'itunga nga ikokion (lopot 3,000), na Zahanati (lopot 4,000). Ng'itunga nga kijowanan ekobunete Hospitali nga Piny nga Kenyatta (Nairobi), Hospitali nga Ng'iruut na Ng'ipunet nga Moi (Eldoret), na Hospitali Kijowanan nga Pwani (Mombasa). Yakin eng'itunga nga ikokion nga ekiliau nabo kana iyokin Kenya Health InfoLine: 719 ka eng'itunga.", confidence: "high" },
  sideEffects: { content: "Ng'ikokut nga timbe nga ng'ikalakar akuj ekobaan nga lotokou na nga ikinde nga lotokou: ng'ikonyit ka akimat nga sindano, homa nga chini, ng'ingor, kana upele nga lotokou nga ekirumo ka ng'iparan 1-2. Neni ekonanakino ato mfumo ijo nga ikokion ekoakat ng'ikiliau. Ng'ikokut nga kijowanan ekobaan nga lotokou ajakin - kes nga 1 ka ng'imurok nga vipimo. Ng'ipetio nga ng'ipurutan nga ekar kotere ka USA, Ulaya, China, na ka WHO ekopurutukino usalama nga ng'ikalakar akuj akuj. Ng'ikokut nga kijowanan nga allergiga ekobobuno ka lotokou nga 1 ka 500,000 ng'ipetio na ekobonete akimiok. Ng'ikokioni nga ng'ikalakar ekolopoto ajakin ng'ikokut nga lotokou.", confidence: "high" },
};

const MOCK_RESPONSES_SAQ: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: { content: "Nkalakar le nkokion lanaa lari sidai la kore alokori nkiteng' nasipa. Ang'a eng'eno, nkalakar ataaku eng'ol ekuo nkera naa aare 3-4 kewarie ang'wan. Ang'a pung' Kenya, Wizara ang'o ikokion ataaku nkalakar siata ang'a nkitunga naa ikokion naa murran ang'a county kotua 47 naa lopoto 7,000. Nkalakar kotua atauany akiang'una naa ene siata ang'a WHO, U.S. FDA, European Medicines Agency, la China's NMPA kabla aa kiterusho.", confidence: "high" },
  babies: { content: "Kenya etolo Ratiba aa Pung' aa Nkalakar eng'eno ekokulakino kaarti ang'a timbe naa apei ang'a eng'eno. Nkera naa lotokou eamunya: BCG entomononi, Polio (ratiba 0-4), Pentavalent/DPT-HepB-Hib (ng'iwiki 6, 10, 14), Pneumococcal (ng'iwiki 6, 10, 14), Rotavirus (ng'iwiki 6, 10), la Measles-Rubella ng'ilapa 9 la 18. Ratiba eni eng'eno ng'are le USA, Ulaya, la China, kaarti totokou aa lotokou aa ikindi. Nkalakar kotua aa timbe aa nkera naa lotokou taata siata ang'a nkitunga aa serikali ang'a Kenya.", confidence: "high" },
  schedule: { content: "Ratiba aa Pung' aa Nkalakar aa Kenya: Entomononi (BCG, Polio 0), Ng'iwiki 6 (Polio 1, Penta 1, PCV 1, Rota 1), Ng'iwiki 10 (Polio 2, Penta 2, PCV 2, Rota 2), Ng'iwiki 14 (Polio 3, Penta 3, PCV 3), Ng'ilapa 9 (Measles-Rubella 1), Ng'ilapa 18 (Measles-Rubella 2). Ratiba eni etorunyishoo kaateng'a timut aa eng'eno. Taa siata kadi aa nkalakar aa emonyo apei la leto akuan entomononi kiliniki.", confidence: "high" },
  location: { content: "Nkalakar siata atamunu ang'a: Hospitali aa county (county 47), Hospitali aa sub-county (lopoto 400), Nkitunga aa ikokion (lopoto 3,000), la Zahanati (lopoto 4,000). Nkitunga naa kijowanan eng'eno Hospitali aa Pung' aa Kenyatta (Nairobi), Hospitali aa Ng'iruut la Ng'ipunet aa Moi (Eldoret), la Hospitali Kijowanan aa Pwani (Mombasa). Yakin eng'itunga aa ikokion eng'eno ekiamu nabo kuna iyokin Kenya Health InfoLine: 719 aa eng'itunga.", confidence: "high" },
  sideEffects: { content: "Nkokut aa timbe aa nkalakar akuan atamunu aa lotokou la aa ikindi aa lotokou: nkonyit ang'a akimat aa sindano, homa aa chini, ng'ingor, kuna upele aa lotokou eng'eno ekurumo ang'a ng'iparan 1-2. Eni etonyakino aton mfumo ijo aa ikokion etoakat ng'ikiliau. Nkokut aa kijowanan atamunu aa lotokou atashe - siaa 1 ang'a ng'imurok aa vipimo. Ng'ipetio aa ng'ipurutan aa eng'eno ang'a USA, Ulaya, China, la ang'a WHO epurutukino usalama aa nkalakar akuan akuan. Nkokut aa kijowanan aa allergiga atamunu ang'a lotokou aa 1 ang'a 500,000 ng'ipetio la atamunu akimiok. Ng'ikokioni aa nkalakar elopoto atashe nkokut aa lotokou.", confidence: "high" },
};

const MOCK_RESPONSES_MAS: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: { content: "Nkalakar le nkokion lenaa sidai sana le kore olokori nkiteng' nasipa. Naa eng'eno, nkalakar ataaku eng'ol ekuo nkera naa aare 3-4 kewarie ng'wen. Naa pung' Kenya, Wizara ng'o ikokion ataaku nkalakar siata naa nkitunga naa ikokion naa murran naa county kotua 47 naa lopoto 7,000. Nkalakar kotua atauany akiang'una naa sidai sana naa WHO, U.S. FDA, European Medicines Agency, le China's NMPA kabla aa kiterusho.", confidence: "high" },
  babies: { content: "Kenya etolo Ratiba aa Pung' aa Nkalakar eng'eno ekokulakino kaarti naa timbe naa apei naa eng'eno. Nkera naa lotokou eamunya: BCG entomononi, Polio (ratiba 0-4), Pentavalent/DPT-HepB-Hib (ng'iwiki 6, 10, 14), Pneumococcal (ng'iwiki 6, 10, 14), Rotavirus (ng'iwiki 6, 10), le Measles-Rubella ng'ilapa 9 le 18. Ratiba eni eng'eno ng'are le USA, Ulaya, le China, kaarti totokou aa lotokou aa ikindi. Nkalakar kotua aa timbe aa nkera naa lotokou taata siata naa nkitunga aa serikali naa Kenya.", confidence: "high" },
  schedule: { content: "Ratiba aa Pung' aa Nkalakar aa Kenya: Entomononi (BCG, Polio 0), Ng'iwiki 6 (Polio 1, Penta 1, PCV 1, Rota 1), Ng'iwiki 10 (Polio 2, Penta 2, PCV 2, Rota 2), Ng'iwiki 14 (Polio 3, Penta 3, PCV 3), Ng'ilapa 9 (Measles-Rubella 1), Ng'ilapa 18 (Measles-Rubella 2). Ratiba eni etorunyishoo kaateng'a timut aa eng'eno. Taa siata kadi aa nkalakar aa emonyo apei le leto ng'uen entomononi kiliniki.", confidence: "high" },
  location: { content: "Nkalakar siata atamunu naa: Hospitali aa county (county 47), Hospitali aa sub-county (lopoto 400), Nkitunga aa ikokion (lopoto 3,000), le Zahanati (lopoto 4,000). Nkitunga naa kijowanan eng'eno Hospitali aa Pung' aa Kenyatta (Nairobi), Hospitali aa Ng'iruut le Ng'ipunet aa Moi (Eldoret), le Hospitali Kijowanan aa Pwani (Mombasa). Yakin eng'itunga aa ikokion eng'eno ekiamu nabo kuna iyokin Kenya Health InfoLine: 719 aa eng'itunga.", confidence: "high" },
  sideEffects: { content: "Nkokut aa timbe aa nkalakar ng'uan atamunu aa lotokou le aa ikindi aa lotokou: nkonyit naa akimat aa sindano, homa aa chini, ng'ingor, kuna upele aa lotokou eng'eno ekurumo naa ng'iparan 1-2. Eni etonyakino aton mfumo ijo aa ikokion etoakat ng'ikiliau. Nkokut aa kijowanan atamunu aa lotokou sana - siaa 1 naa ng'imurok aa vipimo. Ng'ipetio aa ng'ipurutan aa eng'eno naa USA, Ulaya, China, le naa WHO epurutukino usalama aa nkalakar ng'uan ng'uan. Nkokut aa kijowanan aa allergiga atamunu naa lotokou aa 1 naa 500,000 ng'ipetio le atamunu akimiok. Ng'ikokioni aa nkalakar elopoto sana nkokut aa lotokou.", confidence: "high" },
};

const MOCK_RESPONSES_REL: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: { content: "Chanjo ni salama na zenye ufanisi katika kulinda dhidi ya magonjwa makubwa. Duniani kote, chanjo zinazuia vifo milioni 3-4 kwa mwaka. Nchini Kenya, Wizara ya Afya inatoa chanjo bure katika vituo zaidi ya 7,000 vya afya vya umma katika kaunti zote 47. Chanjo zote zinapitia majaribio makali ya usalama na mamlaka za kimataifa za afya pamoja na WHO, U.S. FDA, European Medicines Agency, na China's NMPA kabla ya kuidhinishwa.", confidence: "high" },
  babies: { content: "Kenya inafuata Ratiba ya Taifa ya Chanjo inayolingana na mazoezi bora ya kimataifa. Watoto wachanga hupokea: BCG wakati wa kuzaliwa, Polio (kipimo 0-4), Pentavalent/DPT-HepB-Hib (wiki 6, 10, 14), Pneumococcal (wiki 6, 10, 14), Rotavirus (wiki 6, 10), na Measles-Rubella miezi 9 na 18. Ratiba hii ni sawa na ile ya USA, Ulaya, na China, kwa tofauti ndogo za muda. Chanjo zote za kawaida za watoto wachanga ni bure katika vituo vya serikali nchini Kenya.", confidence: "high" },
  schedule: { content: "Ratiba ya Taifa ya Chanjo ya Kenya: Kuzaliwa (BCG, Polio 0), Wiki 6 (Polio 1, Penta 1, PCV 1, Rota 1), Wiki 10 (Polio 2, Penta 2, PCV 2, Rota 2), Wiki 14 (Polio 3, Penta 3, PCV 3), Miezi 9 (Measles-Rubella 1), Miezi 18 (Measles-Rubella 2). Ratiba hii imeunganishwa na mapendekezo ya kimataifa. Weka kadi ya chanjo ya mtoto wako salama na uilete kila unapotembelea kliniki.", confidence: "high" },
  location: { content: "Chanjo bure zinapatikana katika: Hospitali za kaunti (kaunti 47), Hospitali za wilaya (zaidi ya 400), Vituo vya afya (zaidi ya 3,000), na Zahanati (zaidi ya 4,000). Vituo vikuu ni pamoja na Hospitali ya Taifa ya Kenyatta (Nairobi), Hospitali ya Rufaa ya Moi (Eldoret), na Hospitali Kuu ya Pwani (Mombasa). Tembelea kituo cha karibu nawe au piga simu Kenya Health InfoLine: 719 kwa maeneo.", confidence: "high" },
  sideEffects: { content: "Athari za kawaida za chanjo kwa kawaida ni nyepesi na za muda mfupi: maumivu mahali pa sindano, homa ya chini, uchovu, au upele mdogo unaoisha kwa siku 1-2. Hizi zinaonyesha mfumo wako wa kinga unajenga ulinzi. Athari kali ni nadra sana - chini ya 1 kwa milioni ya vipimo. Mifumo ya ufuatiliaji wa kimataifa nchini USA, Ulaya, China, na kupitia WHO inafuatilia usalama wa chanjo kila wakati. Athari kali za mzio hutokea katika karibu 1 kwa 500,000 vipimo na zinaweza kutibiwa. Faida za chanjo zinazidi sana hatari ndogo.", confidence: "high" },
};

const MOCK_RESPONSES_EBU: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: { content: "Ithimi cia mĩĩri nĩ cia thogora na cia kĩgũrũkĩri kũgitĩra mĩrimũ mĩrũ. Thĩ yothe, ithimi cia mĩĩri nĩigitanagia gĩkuũ kĩa andũ miliyoni 3-4 o mwaka. Bũrũri wa Kenya, Wizara ya Ũgima nĩĩtũhagĩra ithimi cia mĩĩri cia thogora kũndũ kũingĩ gũkĩra 7,000 kwa vituo vya ũgima vya ũmũthĩngĩ kaunti ciothe 47. Ithimi ciothe cia mĩĩri nĩcigeragio wega nĩ mamlaka ma kimataifa ma ũgima marĩ hamwe na WHO, U.S. FDA, European Medicines Agency, na China's NMPA mbere ya gũtĩkĩrio.", confidence: "high" },
  babies: { content: "Kenya nĩĩrũmagĩrĩra Ratiba ya Bũrũri ya Ithimi cia Mĩĩri ĩrĩa ĩhaananĩtie na mĩtugo mĩega ya thĩ yothe. Ciana iria nini nĩĩnyuuaga: BCG rĩrĩa iciarĩtwo, Polio (mĩigana 0-4), Pentavalent/DPT-HepB-Hib (ciumia 6, 10, 14), Pneumococcal (ciumia 6, 10, 14), Rotavirus (ciumia 6, 10), na Measles-Rubella mĩeri 9 na 18. Ratiba ĩno nĩ ta ĩrĩa ya USA, Ulaya, na China, no ĩrĩ na ũtiganu mũnini wa ihinda. Ithimi ciothe cia kawaida cia ciana iria nini nĩ cia thogora kũndũ kwa vituo vya thirikari thĩinĩ wa Kenya.", confidence: "high" },
  schedule: { content: "Ratiba ya Bũrũri ya Ithimi cia Mĩĩri ya Kenya: Gũciarwo (BCG, Polio 0), Kiumia 6 (Polio 1, Penta 1, PCV 1, Rota 1), Kiumia 10 (Polio 2, Penta 2, PCV 2, Rota 2), Kiumia 14 (Polio 3, Penta 3, PCV 3), Mĩeri 9 (Measles-Rubella 1), Mĩeri 18 (Measles-Rubella 2). Ratiba ĩno nĩĩnyiitanĩtio na mathimo ma kimataifa. Iga karata ya ithimi cia mwana waku wega na ũmĩrehage o rĩrĩa ũgũthiĩ kĩlĩniki.", confidence: "high" },
  location: { content: "Ithimi cia mĩĩri cia thogora irĩ kũndũ kũrĩ: Mahiga ma kaunti (kaunti 47), Mahiga ma sub-county (makĩria ma 400), Vituo vya ũgima (makĩria ma 3,000), na Zahanati (makĩria ma 4,000). Vituo ikũrũ nĩ ikĩrĩra Kĩhiga kĩa Taifa kĩa Kenyatta (Nairobi), Kĩhiga kĩa Kũruta na Kũrorera kĩa Moi (Eldoret), na Kĩhiga Kĩnene kĩa Pwani (Mombasa). Thii kĩhiga kĩrĩa kĩrĩ hakuhĩ nawe kana ũhone Kenya Health InfoLine: 719 nĩguo ũmenye kũndũ.", confidence: "high" },
  sideEffects: { content: "Athiri ma kawaida ma ithimi cia mĩĩri maingĩ makagĩa maharũaru na ma ihinda inini: ruo handũ hao handũrĩtwo ndago, homa ya thĩ, ũnogu, kana mbũthũũ nini ĩrĩa ĩthiraga kwa matukũ 1-2. Icio nĩcionanagia atĩ mũthĩrĩrĩ waku wa kũgitanĩra mĩrimũ ũraaka ũgitĩri. Athiri marũru nĩ monanekaga nini mũno - makĩria ma 1 kwa miliyoni ya mĩigana. Mĩthiĩrĩre ya kũrũmbũiya ya kimataifa kũrĩa kũrĩ USA, Ulaya, China, na kũgererania na WHO nĩĩrũmbũiyaga thogora wa ithimi cia mĩĩri hĩndĩ ciothe. Athiri marũru ma kũiguithia nĩmonanekaga harĩa hakuhĩ na 1 kwa 500,000 mĩigana na no mahonio. Wega wa ithimi cia mĩĩri nĩũkĩrĩte mũno ũthakaro ũrĩa mũnini.", confidence: "high" },
};

const MOCK_RESPONSES_MER: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } = {
  default: { content: "Ithimi cia mĩĩri nĩ cia thogora na cia kĩgũrũkĩri kũgitĩra mĩrimũ mĩrũ. Thĩ yothe, ithimi cia mĩĩri nĩigitanagia gĩkuũ kĩa andũ miliyoni 3-4 o mwaka. Bũrũri wa Kenya, Wizara ya Ũgima nĩĩtũhagĩra ithimi cia mĩĩri cia thogora kũndũ kũingĩ gũkĩra 7,000 kwa vituo vya ũgima vya ũmũthĩngĩ kaunti ciothe 47. Ithimi ciothe cia mĩĩri nĩcigeragio wega nĩ mamlaka ma kimataifa ma ũgima marĩ hamwe na WHO, U.S. FDA, European Medicines Agency, na China's NMPA mbere ya gũtĩkĩrio.", confidence: "high" },
  babies: { content: "Kenya nĩĩrũmagĩrĩra Ratiba ya Bũrũri ya Ithimi cia Mĩĩri ĩrĩa ĩhaananĩtie na mĩtugo mĩega ya thĩ yothe. Ciana iria nini nĩĩnyuuaga: BCG rĩrĩa iciarĩtwo, Polio (mĩigana 0-4), Pentavalent/DPT-HepB-Hib (ciumia 6, 10, 14), Pneumococcal (ciumia 6, 10, 14), Rotavirus (ciumia 6, 10), na Measles-Rubella mĩeri 9 na 18. Ratiba ĩno nĩ ta ĩrĩa ya USA, Ulaya, na China, no ĩrĩ na ũtiganu mũnini wa ihinda. Ithimi ciothe cia kawaida cia ciana iria nini nĩ cia thogora kũndũ kwa vituo vya thirikari thĩinĩ wa Kenya.", confidence: "high" },
  schedule: { content: "Ratiba ya Bũrũri ya Ithimi cia Mĩĩri ya Kenya: Gũciarwo (BCG, Polio 0), Kiumia 6 (Polio 1, Penta 1, PCV 1, Rota 1), Kiumia 10 (Polio 2, Penta 2, PCV 2, Rota 2), Kiumia 14 (Polio 3, Penta 3, PCV 3), Mĩeri 9 (Measles-Rubella 1), Mĩeri 18 (Measles-Rubella 2). Ratiba ĩno nĩĩnyiitanĩtio na mathimo ma kimataifa. Iga karata ya ithimi cia mwana waku wega na ũmĩrehage o rĩrĩa ũgũthiĩ kĩlĩniki.", confidence: "high" },
  location: { content: "Ithimi cia mĩĩri cia thogora irĩ kũndũ kũrĩ: Mahiga ma kaunti (kaunti 47), Mahiga ma sub-county (makĩria ma 400), Vituo vya ũgima (makĩria ma 3,000), na Zahanati (makĩria ma 4,000). Vituo ikũrũ nĩ ikĩrĩra Kĩhiga kĩa Taifa kĩa Kenyatta (Nairobi), Kĩhiga kĩa Kũruta na Kũrorera kĩa Moi (Eldoret), na Kĩhiga Kĩnene kĩa Pwani (Mombasa). Thii kĩhiga kĩrĩa kĩrĩ hakuhĩ nawe kana ũhone Kenya Health InfoLine: 719 nĩguo ũmenye kũndũ.", confidence: "high" },
  sideEffects: { content: "Athiri ma kawaida ma ithimi cia mĩĩri maingĩ makagĩa maharũaru na ma ihinda inini: ruo handũ hao handũrĩtwo ndago, homa ya thĩ, ũnogu, kana mbũthũũ nini ĩrĩa ĩthiraga kwa matukũ 1-2. Icio nĩcionanagia atĩ mũthĩrĩrĩ waku wa kũgitanĩra mĩrimũ ũraaka ũgitĩri. Athiri marũru nĩ monanekaga nini mũno - makĩria ma 1 kwa miliyoni ya mĩigana. Mĩthiĩrĩre ya kũrũmbũiya ya kimataifa kũrĩa kũrĩ USA, Ulaya, China, na kũgererania na WHO nĩĩrũmbũiyaga thogora wa ithimi cia mĩĩri hĩndĩ ciothe. Athiri marũru ma kũiguithia nĩmonanekaga harĩa hakuhĩ na 1 kwa 500,000 mĩigana na no mahonio. Wega wa ithimi cia mĩĩri nĩũkĩrĩte mũno ũthakaro ũrĩa mũnini.", confidence: "high" },
};

const LANGUAGE_UNAVAILABLE_MESSAGES: { [key: string]: string } = {
  sw: "[Tafsiri ya Kiswahili inaendelea / Translation in progress]\n\nKwa sasa, majibu haya ni kwa Kiingereza. Tafsiri kamili itapatikana hivi karibuni.\n\n(Currently, responses are in English. Full translations coming soon.)\n\n",
  ki: "[Kugarũra kũring'ire kwa Gikũyũ / Translation in progress]\n\nRĩu, macookio macio ni ma Kĩĩngereza. Kugarũra kwa ũkinyanĩrĩria nĩkũrĩhonokia.\n\n(Currently, responses are in English. Full translations coming soon.)\n\n",
  luo: "[Loko e Dholuo pod timo / Translation in progress]\n\nSani, duoko mag penjruok ni e English. Loko moikore biro piyo piyo.\n\n(Currently, responses are in English. Full translations coming soon.)\n\n",
  kam: "[Kuandika kwa Kikamba nikusyawa / Translation in progress]\n\nUu, maathya mayo ni ma Kiingereza. Kuandika kulaelaa kuuka na inya.\n\n(Currently, responses are in English. Full translations coming soon.)\n\n",
  luy: "[Khusindikha khu Luhya khurira / Translation in progress]\n\nSasalia, amasio ka kamakava ka English. Khusindikha khamalafu kharira amalaa.\n\n(Currently, responses are in English. Full translations coming soon.)\n\n",
  kal: "[Kotunet ak Kalenjin kochere / Translation in progress]\n\nSasit, itoryet ago ak English. Kotunet ne mising buna abagenge.\n\n(Currently, responses are in English. Full translations coming soon.)\n\n",
  so: "[Turjumaad Soomaali socoto / Translation in progress]\n\nHadda, jawaabaha waa Ingiriis. Turjumaad dhamays ah waa imaanaysaa dhawaan.\n\n(Currently, responses are in English. Full translations coming soon.)\n\n",
};

const LANGUAGE_RESPONSE_MAP: { [key: string]: { [key: string]: { content: string; confidence: "high" | "medium" | "low" } } } = {
  en: MOCK_RESPONSES_EN,
  sw: MOCK_RESPONSES_SW,
  ki: MOCK_RESPONSES_KIK,
  luo: MOCK_RESPONSES_LUO,
  kam: MOCK_RESPONSES_KAM,
  luy: MOCK_RESPONSES_LUY,
  kal: MOCK_RESPONSES_KAL,
  so: MOCK_RESPONSES_SO,
  mij: MOCK_RESPONSES_MIJ,
  tuv: MOCK_RESPONSES_TUV,
  saq: MOCK_RESPONSES_SAQ,
  mas: MOCK_RESPONSES_MAS,
  rel: MOCK_RESPONSES_REL,
  ebu: MOCK_RESPONSES_EBU,
  mer: MOCK_RESPONSES_MER,
};

function getLocalizedResponse(responseKey: string, language: string): { content: string; confidence: "high" | "medium" | "low" } {
  const languageResponses = LANGUAGE_RESPONSE_MAP[language];
  
  if (languageResponses && languageResponses[responseKey]) {
    return languageResponses[responseKey];
  }
  
  if (languageResponses && languageResponses.default) {
    return languageResponses.default;
  }
  
  return MOCK_RESPONSES_EN[responseKey] || MOCK_RESPONSES_EN.default;
}

function addLanguageFallback(content: string, language: string): string {
  const languageHasTranslations = LANGUAGE_RESPONSE_MAP[language] !== undefined;
  
  if (languageHasTranslations || language === "en") {
    return content;
  }
  
  const prefix = LANGUAGE_UNAVAILABLE_MESSAGES[language] || 
    `[Translation in progress]\n\nCurrently, responses are in English. Full ${language.toUpperCase()} translations coming soon.\n\n`;
  return prefix + content;
}

export async function sendChatMessage(
  message: string,
  language: string
): Promise<ChatMessage> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerMessage = message.toLowerCase();
  let responseKey = "default";

  if (lowerMessage.includes("covid") || lowerMessage.includes("corona") || lowerMessage.includes("mrna") || lowerMessage.includes("pfizer") || lowerMessage.includes("moderna")) {
    responseKey = "covid";
  } else if (lowerMessage.includes("hpv") || lowerMessage.includes("cervical") || lowerMessage.includes("cancer")) {
    responseKey = "hpv";
  } else if (lowerMessage.includes("flu") || lowerMessage.includes("influenza") || lowerMessage.includes("homa")) {
    responseKey = "flu";
  } else if (lowerMessage.includes("tetanus") || lowerMessage.includes("lockjaw") || lowerMessage.includes("pepopunda")) {
    responseKey = "tetanus";
  } else if (lowerMessage.includes("polio") || lowerMessage.includes("paralysis")) {
    responseKey = "polio";
  } else if (lowerMessage.includes("pneumo") || lowerMessage.includes("pneumonia")) {
    responseKey = "pneumococcal";
  } else if (lowerMessage.includes("rota") || lowerMessage.includes("diarr") || lowerMessage.includes("kuharisha")) {
    responseKey = "rotavirus";
  } else if (lowerMessage.includes("hepatitis") || lowerMessage.includes("liver") || lowerMessage.includes("ini")) {
    responseKey = "hepatitisB";
  } else if (lowerMessage.includes("bcg") || lowerMessage.includes("tb") || lowerMessage.includes("tuberc") || lowerMessage.includes("kifua")) {
    responseKey = "tuberculosis";
  } else if (lowerMessage.includes("pregnan") || lowerMessage.includes("mimba") || lowerMessage.includes("expecting") || lowerMessage.includes("mjamzito")) {
    responseKey = "pregnant";
  } else if (lowerMessage.includes("side effect") || lowerMessage.includes("reaction") || lowerMessage.includes("athiri")) {
    responseKey = "sideEffects";
  } else if (lowerMessage.includes("effective") || lowerMessage.includes("work") || lowerMessage.includes("herd") || lowerMessage.includes("immunity")) {
    responseKey = "effectiveness";
  } else if (lowerMessage.includes("allerg") || lowerMessage.includes("egg") || lowerMessage.includes("latex")) {
    responseKey = "allergies";
  } else if (lowerMessage.includes("travel") || lowerMessage.includes("yellow fever") || lowerMessage.includes("trip") || lowerMessage.includes("safari")) {
    responseKey = "travel";
  } else if (lowerMessage.includes("new vaccin") || lowerMessage.includes("recent") || lowerMessage.includes("latest") || lowerMessage.includes("development") || lowerMessage.includes("malaria")) {
    responseKey = "newVaccines";
  } else if (lowerMessage.includes("bab") || lowerMessage.includes("child") || lowerMessage.includes("infant") || lowerMessage.includes("watoto") || lowerMessage.includes("mtoto")) {
    responseKey = "babies";
  } else if (lowerMessage.includes("when") || lowerMessage.includes("schedule") || lowerMessage.includes("ratiba") || lowerMessage.includes("lini")) {
    responseKey = "schedule";
  } else if (lowerMessage.includes("mmr") || lowerMessage.includes("measles") || lowerMessage.includes("rubella") || lowerMessage.includes("surua")) {
    responseKey = "mmr";
  } else if (lowerMessage.includes("where") || lowerMessage.includes("location") || lowerMessage.includes("get vaccin") || lowerMessage.includes("wapi") || lowerMessage.includes("kituo")) {
    responseKey = "location";
  }

  const response = getLocalizedResponse(responseKey, language);
  const finalContent = addLanguageFallback(response.content, language);

  return {
    id: Date.now().toString(),
    role: "assistant",
    content: finalContent,
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
