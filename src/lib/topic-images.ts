/**
 * Yordamchi AI — Mavzuga mos professional ta'limiy rasmlar bazasi va qidiruv tizimi.
 * Barcha rasmlar Unsplash CDN orqali yuqori sifatli, 16:9 taqdimotlarga mos va CORS ochiq.
 */

export interface TopicPhoto {
  url: string;
  caption: string;
}

interface CategoryData {
  keywords: string[];
  photos: TopicPhoto[];
}

export const ACADEMIC_CATEGORIES: Record<string, CategoryData> = {
  // 1. DASTURLASH, JAVA, OOP VA DASTURIY TA'MINOT
  it_programming: {
    keywords: [
      'java', 'oop', 'dastur', 'kod', 'code', 'python', 'c++', 'c#', 'php', 'javascript', 'js',
      'algoritm', 'obyekt', 'klass', 'merosxo', 'polimorfizm', 'inkapsulyatsiya', 'interface',
      'funksiya', 'metod', 'developer', 'dasturchi', 'software', 'backend', 'frontend', 'kompyuter',
      'texnologiya', 'veb', 'web', 'framework', 'spring', 'react', 'node', 'dasturlash'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80',
        caption: 'Java va dasturlash kodi tahlili'
      },
      {
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80',
        caption: "Dasturiy arxitektura va loyihalash muhiti"
      },
      {
        url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=900&auto=format&fit=crop&q=80',
        caption: "Algoritmlar va ma'lumotlar tuzilmasi"
      },
      {
        url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&auto=format&fit=crop&q=80',
        caption: "Tizimli modellashtirish va OOP sinflar diagrammasi"
      },
      {
        url: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=900&auto=format&fit=crop&q=80',
        caption: "Mobil va dasturiy ilovalar yaratish"
      },
      {
        url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=900&auto=format&fit=crop&q=80',
        caption: "Ma'lumotlar bazasi va server texnologiyalari"
      }
    ]
  },

  // 2. SUN'IY INTELLEKT VA AXBOROT XAVFSIZLIGI
  it_ai_cyber: {
    keywords: [
      'ai', 'intellekt', 'neyron', 'machine learning', 'suniy intellekt', 'kiber', 'xavfsizlik',
      'hacker', 'security', 'data science', 'katta ma', 'robot', 'avtomat', 'tarmoq', 'server'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=900&auto=format&fit=crop&q=80',
        caption: "Sun'iy intellekt va neyron tarmoqlar texnologiyasi"
      },
      {
        url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&auto=format&fit=crop&q=80',
        caption: "Axborot xavfsizligi va ma'lumotlarni himoyalash"
      },
      {
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&auto=format&fit=crop&q=80',
        caption: "Kiberxavfsizlik va tarmoq infratuzilmasi"
      },
      {
        url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=80',
        caption: "Robototexnika va intellektual tizimlar"
      }
    ]
  },

  // 3. IQTISODIYOT, MOLIYA VA BANK ISHI
  economics_finance: {
    keywords: [
      'iqtisod', 'moliya', 'bank', 'kredit', 'soliq', 'invest', 'pul', 'buxgalter', 'audit',
      'byudjet', 'valyuta', 'inflyatsiya', 'birja', 'bozor', 'narx', 'fond', 'yaim', 'daromad'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&auto=format&fit=crop&q=80',
        caption: "Moliya bozori va iqtisodiy ko'rsatkichlar tahlili"
      },
      {
        url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=900&auto=format&fit=crop&q=80',
        caption: "Bank tizimi va investitsion loyihalar"
      },
      {
        url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&auto=format&fit=crop&q=80',
        caption: "Iqtisodiy tahlil va soliq rejalashtirish"
      },
      {
        url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=900&auto=format&fit=crop&q=80',
        caption: "Birja savdolari va moliya aktivlari"
      }
    ]
  },

  // 4. BIZNES, MENEJMENT VA MARKETING
  business_management: {
    keywords: [
      'biznes', 'menejment', 'marketing', 'boshqaruv', 'tadbirkor', 'reklama', 'strategiya',
      'savdo', 'mijoz', 'kompaniya', 'korxona', 'kadr', 'lider', 'reja', 'brend'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&auto=format&fit=crop&q=80',
        caption: "Strategik boshqaruv va biznes jarayonlari"
      },
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80',
        caption: "Marketing tadqiqotlari va bozor dinamikasi"
      },
      {
        url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&auto=format&fit=crop&q=80',
        caption: "Jamoaviy boshqaruv va loyiha muhokamasi"
      },
      {
        url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop&q=80',
        caption: "Biznes muzokaralari va hamkorlik"
      }
    ]
  },

  // 5. TIBBIYOT, ANATOMIYA VA SOG'LIQNI SAQLASH
  medicine_health: {
    keywords: [
      'tibbiyot', 'shifokor', 'vrach', 'salomatlik', 'davolash', 'kasallik', 'anatomiya',
      'yurak', 'qon', 'klinika', 'jarroh', 'shifoxona', 'terapiya', 'stomatolog', 'pediatriya',
      'organizm', 'diagnostika', 'profilaktika', 'neyro'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&auto=format&fit=crop&q=80',
        caption: "Klinik diagnostika va tibbiy ko'rik"
      },
      {
        url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&auto=format&fit=crop&q=80',
        caption: "Laboratoriya tahlili va mikroskopik tadqiqot"
      },
      {
        url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=900&auto=format&fit=crop&q=80',
        caption: "Zamonaviy jarrohlik va tibbiy muolaja"
      },
      {
        url: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=900&auto=format&fit=crop&q=80',
        caption: "Yurak-qon tomir tizimi va inson salomatligi"
      },
      {
        url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900&auto=format&fit=crop&q=80',
        caption: "Farmatsevtika va dori vositalari"
      }
    ]
  },

  // 6. HUQUQSHUNOSLIK VA DAVLAT BOSHQARUVI
  law_jurisprudence: {
    keywords: [
      'huquq', 'qonun', 'sud', 'advokat', 'konstitutsiya', 'adolat', 'prokuror', 'jinoyat',
      'fuqarolik', 'notariat', 'yuridik', 'kodeks', 'parlament', 'qonunchilik', 'huquqbuzarlik'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&auto=format&fit=crop&q=80',
        caption: "Sud tizimi va qonun ustuvorligi"
      },
      {
        url: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=900&auto=format&fit=crop&q=80',
        caption: "Adolat tarozisi va fuqarolik huquqlari"
      },
      {
        url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=900&auto=format&fit=crop&q=80',
        caption: "Yuridik shartnomalar va huquqiy amaliyot"
      },
      {
        url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900&auto=format&fit=crop&q=80',
        caption: "Davlat boshqaruvi va qonun chiqaruvchi organlar"
      }
    ]
  },

  // 7. O'ZBEKISTON TARIXI VA MADANIYATI
  history_uzbekistan: {
    keywords: [
      'tarix', 'temur', 'samarqand', 'buxoro', 'xiva', 'madaniyat', 'obida', 'arxeologiya',
      'ipak yoli', 'qadimiy', 'allomalar', 'bobur', 'ulugbek', 'navoiy', 'meros', 'muzey'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=900&auto=format&fit=crop&q=80',
        caption: "Samarqand Registon ansambli — milliy merosimiz"
      },
      {
        url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=900&auto=format&fit=crop&q=80',
        caption: "Qadimiy tarixiy qo'lyozmalar va manbalar"
      },
      {
        url: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=900&auto=format&fit=crop&q=80',
        caption: "Arxeologik yodgorliklar va muzey eksponatlari"
      },
      {
        url: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=900&auto=format&fit=crop&q=80',
        caption: "Buyuk Ipak yo'lining tarixiy obidalari"
      }
    ]
  },

  // 8. PEDAGOGIKA VA TA'LIM METODIKASI
  pedagogy_education: {
    keywords: [
      'pedagog', 'talim', 'maktab', 'oqituvchi', 'talaba', 'dars', 'metodika', 'tarbiya',
      'universitet', 'otm', 'malaka', 'mashgulot', 'innovatsion talim', 'bolalar'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&auto=format&fit=crop&q=80',
        caption: "Oliy ta'lim ma'ruza zali va akademik jarayon"
      },
      {
        url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&auto=format&fit=crop&q=80',
        caption: "Zamonaviy interfaol o'qitish metodikasi"
      },
      {
        url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&auto=format&fit=crop&q=80',
        caption: "Talabalar hamkorligi va ilmiy izlanish"
      },
      {
        url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&auto=format&fit=crop&q=80',
        caption: "Oliy ta'lim bitiruvchilari va ilmiy darajalar"
      }
    ]
  },

  // 9. PSIXOLOGIYA VA INSON RUHIYATI
  psychology: {
    keywords: [
      'psixolog', 'ruhiyat', 'miya', 'hissiyot', 'ong', 'xulq', 'stress', 'muloqot',
      'shaxs', 'xarakter', 'temperament', 'psixik', 'motivatsiya'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=900&auto=format&fit=crop&q=80',
        caption: "Inson miyasi va kognitiv jarayonlar"
      },
      {
        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=80',
        caption: "Psixologik maslahat va shaxslararo muloqot"
      },
      {
        url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=900&auto=format&fit=crop&q=80',
        caption: "Ruhiy muvozanat va ichki xotirjamlik"
      }
    ]
  },

  // 10. FIZIKA, ASTRONOMIYA VA ENERGETIKA
  physics_astronomy: {
    keywords: [
      'fizika', 'koinot', 'kosmos', 'energiya', 'yulduz', 'atom', 'elektr', 'quyosh',
      'sayyora', 'optika', 'mexanika', 'kvant', 'yoruglik', 'magnit', 'reaktor'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80',
        caption: "Koinot fazosi va orbital texnologiyalar"
      },
      {
        url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=900&auto=format&fit=crop&q=80',
        caption: "Astronomik hodisalar va yulduzlar tizimi"
      },
      {
        url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&auto=format&fit=crop&q=80',
        caption: "Qayta tiklanuvchi energiya va ekologik fizika"
      },
      {
        url: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=900&auto=format&fit=crop&q=80',
        caption: "Optik nurlar va kvant fizikasi tajribalari"
      }
    ]
  },

  // 11. KIMYO VA LABORATORIYA
  chemistry: {
    keywords: [
      'kimyo', 'laboratoriya', 'modda', 'reaksiya', 'molekula', 'organik', 'noorganik',
      'probirka', 'eritma', 'element', 'davriy jadval', 'sintez', 'polimer'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&auto=format&fit=crop&q=80',
        caption: "Kimyoviy eritmalar va laboratoriya tajribasi"
      },
      {
        url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=900&auto=format&fit=crop&q=80',
        caption: "Molekulyar modellar va kimyoviy bog'lanishlar"
      },
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80',
        caption: "Kimyo sanoati va neft-gaz texnologiyasi"
      }
    ]
  },

  // 12. BIOLOGIYA, GENETIKA VA EKOLOGIYA
  biology_ecology: {
    keywords: [
      'biologiya', 'tabiat', 'ekologiya', 'dnk', 'genetika', 'osimlik', 'hayvon', 'flora',
      'fauna', 'hujayra', 'evolyutsiya', 'biosfera', 'atrof-muhit', 'botanika', 'zoologiya'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=900&auto=format&fit=crop&q=80',
        caption: "Genetika va DNK spiral strukturasi"
      },
      {
        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80',
        caption: "Tabiat ekologiyasi va o'rmon biosferasi"
      },
      {
        url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=900&auto=format&fit=crop&q=80',
        caption: "Botanika va o'simliklarning rivojlanish bosqichlari"
      }
    ]
  },

  // 13. QISHLOQ XO'JALIGI VA AGROSANOAT
  agriculture: {
    keywords: [
      'qishloq', 'agro', 'hosil', 'fermer', 'yer', 'paxta', 'galla', 'bogdorchilik',
      'suv', 'sugorish', 'chorvachilik', 'veterinariya', 'agronomiya', 'issiqxona'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&auto=format&fit=crop&q=80',
        caption: "Qishloq xo'jaligi maydonlari va g'alla hosili"
      },
      {
        url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=900&auto=format&fit=crop&q=80',
        caption: "Zamonaviy agrotexnika va hosilni yig'ish"
      },
      {
        url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=900&auto=format&fit=crop&q=80',
        caption: "Zamonaviy issiqxona va gidroponika texnologiyasi"
      }
    ]
  },

  // 14. QURILISH, MUHANDISLIK VA ARXITEKTURA
  engineering_construction: {
    keywords: [
      'qurilish', 'bino', 'arxitektura', 'loyiha', 'muhandis', 'mexanika', 'konstruktsiya',
      'chizma', 'sanoat', 'texnika', 'zavod', 'mashinasozlik', 'avtomobil', 'transport'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&auto=format&fit=crop&q=80',
        caption: "Muhandislik loyihalari va arxitektura chizmalari"
      },
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80',
        caption: "Shaharsozlik va zamonaviy osmono'par binolar"
      },
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&auto=format&fit=crop&q=80',
        caption: "Sanoat texnikasi va mexanizmlar muhandisligi"
      },
      {
        url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=900&auto=format&fit=crop&q=80',
        caption: "Avtomobilsozlik va transport muhandisligi"
      }
    ]
  },

  // 15. ADABIYOT, TILSHUNOSLIK VA KITOBLAR
  literature_language: {
    keywords: [
      'adabiyot', 'til', 'tilshunos', 'kitob', 'kutubxona', 'sheriyat', 'yozuvchi', 'filologiya',
      'ona tili', 'lugat', 'tarjima', 'matn', 'ingliz', 'rus', 'roman', 'hikoya'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&auto=format&fit=crop&q=80',
        caption: "Kutubxona xazinasi va ilmiy adabiyotlar"
      },
      {
        url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&auto=format&fit=crop&q=80',
        caption: "Ijodiy yozuvchilik va badiiy adabiyot"
      },
      {
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&auto=format&fit=crop&q=80',
        caption: "Tilshunoslik va ilmiy tahlil daftari"
      }
    ]
  },

  // 16. SPORT VA JISMONIY TARBIYA
  sports: {
    keywords: [
      'sport', 'futbol', 'boks', 'kurash', 'yugurish', 'olimpiada', 'jismoniy', 'mashg',
      'musobaqa', 'stadion', 'chempion', 'soglom turmush', 'fitnes'
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&auto=format&fit=crop&q=80',
        caption: "Sport yutuqlari va yengil atletika"
      },
      {
        url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900&auto=format&fit=crop&q=80',
        caption: "Jamoaviy sport o'yinlari va futbol"
      },
      {
        url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80',
        caption: "Jismoniy tarbiya va salomatlik mashg'ulotlari"
      }
    ]
  }
};

/**
 * Berilgan mavzu, slayd sarlavhasi va kalit so'zlarga ASOSLANGAN haqiqiy mos rasm topish
 */
export function getSmartTopicPhoto(
  query: string = '',
  topic: string = '',
  slideTitle: string = '',
  slideIndex: number = 0
): TopicPhoto {
  const combinedText = `${query} ${topic} ${slideTitle}`.toLowerCase();

  let bestCategoryKey = 'it_programming';
  let maxScore = -1;

  for (const [key, category] of Object.entries(ACADEMIC_CATEGORIES)) {
    let score = 0;
    for (const kw of category.keywords) {
      if (combinedText.includes(kw)) {
        // Topicda kelsa 3 ball, sarlavhada kelsa 2 ball
        if (topic.toLowerCase().includes(kw)) score += 3;
        else if (slideTitle.toLowerCase().includes(kw)) score += 2;
        else score += 1;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestCategoryKey = key;
    }
  }

  // Agar biron kalit so'z mos tushsa, o'sha fandan rasm tanlaymiz
  const targetCategory = ACADEMIC_CATEGORIES[bestCategoryKey];
  const photos = targetCategory.photos;
  const selectedPhoto = photos[Math.abs(slideIndex) % photos.length];

  return {
    url: selectedPhoto.url,
    caption: selectedPhoto.caption
  };
}

/**
 * Mavzuga mos bir nechta rasmlar ro'yxatini qaytarish (Modal uchun)
 */
export function getPhotosForTopic(topic: string): TopicPhoto[] {
  const t = topic.toLowerCase();
  for (const [, category] of Object.entries(ACADEMIC_CATEGORIES)) {
    for (const kw of category.keywords) {
      if (t.includes(kw)) {
        return category.photos;
      }
    }
  }
  return ACADEMIC_CATEGORIES.it_programming.photos;
}
