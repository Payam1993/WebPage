export const servicesData = [
  {
    id: 'deep-tissue',
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
    detailImage: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1200&q=80",
    prices: {
      min30: 40,
      min60: 70,
      min90: 100
    }
  },
  {
    id: 'sports',
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80",
    detailImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80",
    prices: {
      min30: 45,
      min60: 75,
      min90: 110
    }
  },
  {
    id: 'medical',
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
    detailImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80",
    prices: {
      min30: 55,
      min60: 80,
      min90: 120
    }
  },
  {
    id: 'relax',
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80",
    detailImage: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&q=80",
    prices: {
      min30: 40,
      min60: 60,
      min90: 80
    }
  },
  {
    id: 'feet',
    image: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=600&q=80",
    detailImage: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=1200&q=80",
    prices: {
      min30: 60,
      min60: 100,
      min90: 120
    }
  }
]

export const serviceTranslations = {
  en: {
    'deep-tissue': {
      name: "Deep Tissue Massage",
      shortDesc: "Therapeutic massage that works the deepest layers of muscles and connective tissue to relieve chronic pain and tension.",
      longDesc: "Deep tissue massage is a type of therapeutic massage that works the deepest layers of muscles and connective tissue. It is primarily used to relieve chronic muscle pain, tension, and stiffness, especially in the back, neck, shoulders, and legs.\n\n**How does it work?**\n• The therapist applies slow, firm pressure\n• Uses hands, fingers, knuckles, forearms, or elbows\n• Movements follow or cross muscle fibers to release tense areas\n\n**What is it used for?**\n• Persistent muscle pain\n• Contractures and accumulated tension\n• Minor sports injuries\n• Problems caused by poor posture\n• Lack of mobility or flexibility\n\n**How does it feel?**\n• It can be intense, but it shouldn't hurt too much\n• It's normal to feel slight discomfort or muscle fatigue afterwards\n• It's important to tell the therapist if the pressure is too much\n\n**Important note:** This massage is not just for relaxation, but to treat specific muscle problems. It should be performed by a trained professional and is not recommended for everyone.",
      benefits: [
        "Reduces muscle tension",
        "Improves blood circulation",
        "Helps relax muscles",
        "Promotes better mobility",
        "Relieves chronic pain"
      ],
      features: ["Deep pressure", "Muscle release", "Pain relief"]
    },
    'sports': {
      name: "Sports Massage",
      shortDesc: "Specialized massage for athletes to prevent injuries, prepare for events, and enhance recovery.",
      longDesc: "Sports massage is specifically designed for people who are involved in physical activity. It helps prevent and treat injuries, enhance athletic performance, and reduce recovery time. Whether you're a professional athlete or a weekend warrior, sports massage can help you perform at your best. Our therapists are trained in the latest techniques to address the specific needs of active individuals.",
      benefits: [
        "Prevents sports injuries",
        "Improves flexibility",
        "Enhances performance",
        "Speeds up recovery",
        "Reduces muscle soreness"
      ],
      features: ["Athletic focus", "Injury prevention", "Performance boost"]
    },
    'medical': {
      name: "Medical Massage",
      shortDesc: "Therapeutic massage prescribed for specific medical conditions and rehabilitation needs.",
      longDesc: "Medical massage is outcome-based massage, primarily the application of a specific treatment targeted to the specific problem(s) the patient presents. The treatment is administered after a thorough assessment/evaluation by the medical massage therapist with specific outcomes being the basis for treatment. It differs from regular massage in that it is specifically designed to treat diagnosed medical conditions.",
      benefits: [
        "Treats specific conditions",
        "Aids rehabilitation",
        "Reduces chronic pain",
        "Improves mobility",
        "Complements medical treatment"
      ],
      features: ["Therapeutic", "Rehabilitation", "Medical focus"]
    },
    'relax': {
      name: "Sensitive Relax Massage",
      shortDesc: "Gentle, soothing massage designed for ultimate relaxation and stress relief.",
      longDesc: "Our Sensitive Relax Massage is perfect for those seeking a gentle, nurturing touch. Using light to medium pressure, this massage promotes deep relaxation, reduces stress hormones, and creates a sense of overall well-being. The slow, flowing strokes calm the nervous system and help you disconnect from daily tensions. Ideal for those new to massage or who prefer a softer approach.",
      benefits: [
        "Deep relaxation",
        "Stress reduction",
        "Improved sleep",
        "Mental clarity",
        "Emotional balance"
      ],
      features: ["Gentle touch", "Stress relief", "Deep relaxation"]
    },
    'feet': {
      name: "Massage with Feet",
      shortDesc: "Unique barefoot massage technique using the therapist's feet for deep, broad pressure.",
      longDesc: "Ashiatsu, or barefoot massage, is a unique technique where the therapist uses their feet to deliver deep, flowing strokes. This allows for broader coverage and deeper pressure than traditional hand massage, while remaining comfortable and relaxing. The therapist holds onto overhead bars for balance and control, delivering consistent pressure that melts away tension. This is an exceptional choice for those who love deep pressure massage.",
      benefits: [
        "Extra deep pressure",
        "Broad, flowing strokes",
        "Full body coverage",
        "Unique experience",
        "Long-lasting relief"
      ],
      features: ["Barefoot technique", "Deep pressure", "Unique experience"]
    },
    consultMore: "For sessions over 90 min, please contact us",
    duration: "Duration",
    price: "Price",
    reserve: "Reserve Now",
    askQuestion: "Ask a Question",
    benefits: "Benefits",
    backToServices: "Back to Services",
    selectDuration: "Select Duration"
  },
  es: {
    'deep-tissue': {
      name: "Masaje de Tejido Profundo",
      shortDesc: "Masaje terapéutico que trabaja las capas más profundas de los músculos y del tejido conectivo para aliviar dolores crónicos y tensión.",
      longDesc: "El masaje de tejido profundo es un tipo de masaje terapéutico que trabaja las capas más profundas de los músculos y del tejido conectivo. Se utiliza principalmente para aliviar dolores musculares crónicos, tensión y rigidez, especialmente en la espalda, el cuello, los hombros y las piernas.\n\n**¿Cómo funciona?**\n• El terapeuta aplica presión lenta y firme\n• Usa manos, dedos, nudillos, antebrazos o codos\n• Los movimientos siguen o cruzan las fibras musculares para liberar zonas tensas\n\n**¿Para qué se usa?**\n• Dolor muscular persistente\n• Contracturas y tensión acumulada\n• Lesiones deportivas leves\n• Problemas causados por mala postura\n• Falta de movilidad o flexibilidad\n\n**¿Cómo se siente?**\n• Puede ser intenso, pero no debe doler demasiado\n• Es normal sentir ligera molestia o cansancio muscular después\n• Es importante avisar al terapeuta si la presión es excesiva\n\n**Nota importante:** Este masaje no es solo para relajarse, sino para tratar problemas musculares específicos. Debe realizarlo un profesional capacitado, y no es recomendable para todas las personas.",
      benefits: [
        "Reduce la tensión muscular",
        "Mejora la circulación sanguínea",
        "Ayuda a relajar los músculos",
        "Favorece una mejor movilidad",
        "Alivia el dolor crónico"
      ],
      features: ["Presión profunda", "Liberación muscular", "Alivio del dolor"]
    },
    'sports': {
      name: "Masaje Deportivo",
      shortDesc: "Masaje especializado para atletas para prevenir lesiones, prepararse para eventos y mejorar la recuperación.",
      longDesc: "El masaje deportivo está específicamente diseñado para personas que realizan actividad física. Ayuda a prevenir y tratar lesiones, mejora el rendimiento atlético y reduce el tiempo de recuperación. Ya seas un atleta profesional o un deportista de fin de semana, el masaje deportivo puede ayudarte a rendir al máximo. Nuestros terapeutas están capacitados en las últimas técnicas para abordar las necesidades específicas de las personas activas.",
      benefits: [
        "Previene lesiones deportivas",
        "Mejora la flexibilidad",
        "Mejora el rendimiento",
        "Acelera la recuperación",
        "Reduce el dolor muscular"
      ],
      features: ["Enfoque atlético", "Prevención de lesiones", "Mejora del rendimiento"]
    },
    'medical': {
      name: "Masaje Médico",
      shortDesc: "Masaje terapéutico prescrito para condiciones médicas específicas y necesidades de rehabilitación.",
      longDesc: "El masaje médico está basado en resultados, principalmente la aplicación de un tratamiento específico dirigido a los problemas específicos que presenta el paciente. El tratamiento se administra después de una evaluación exhaustiva por parte del terapeuta de masaje médico con resultados específicos siendo la base del tratamiento. Se diferencia del masaje regular en que está específicamente diseñado para tratar condiciones médicas diagnosticadas.",
      benefits: [
        "Trata condiciones específicas",
        "Ayuda a la rehabilitación",
        "Reduce el dolor crónico",
        "Mejora la movilidad",
        "Complementa el tratamiento médico"
      ],
      features: ["Terapéutico", "Rehabilitación", "Enfoque médico"]
    },
    'relax': {
      name: "Masaje Sensitivo Relajante",
      shortDesc: "Masaje suave y reconfortante diseñado para la máxima relajación y alivio del estrés.",
      longDesc: "Nuestro Masaje Sensitivo Relajante es perfecto para aquellos que buscan un toque suave y nutritivo. Usando presión ligera a media, este masaje promueve una relajación profunda, reduce las hormonas del estrés y crea una sensación de bienestar general. Los movimientos lentos y fluidos calman el sistema nervioso y te ayudan a desconectarte de las tensiones diarias. Ideal para quienes son nuevos en el masaje o prefieren un enfoque más suave.",
      benefits: [
        "Relajación profunda",
        "Reducción del estrés",
        "Mejora del sueño",
        "Claridad mental",
        "Equilibrio emocional"
      ],
      features: ["Toque suave", "Alivio del estrés", "Relajación profunda"]
    },
    'feet': {
      name: "Masaje con Pies",
      shortDesc: "Técnica única de masaje descalzo usando los pies del terapeuta para una presión profunda y amplia.",
      longDesc: "Ashiatsu, o masaje descalzo, es una técnica única donde el terapeuta usa sus pies para dar golpes profundos y fluidos. Esto permite una cobertura más amplia y una presión más profunda que el masaje tradicional con las manos, mientras permanece cómodo y relajante. El terapeuta se sostiene de barras superiores para equilibrio y control, entregando una presión consistente que derrite la tensión. Esta es una opción excepcional para aquellos que aman el masaje de presión profunda.",
      benefits: [
        "Presión extra profunda",
        "Golpes amplios y fluidos",
        "Cobertura de cuerpo completo",
        "Experiencia única",
        "Alivio duradero"
      ],
      features: ["Técnica descalzo", "Presión profunda", "Experiencia única"]
    },
    consultMore: "Para sesiones de más de 90 min, contáctenos",
    duration: "Duración",
    price: "Precio",
    reserve: "Reservar Ahora",
    askQuestion: "Hacer una Pregunta",
    benefits: "Beneficios",
    backToServices: "Volver a Servicios",
    selectDuration: "Seleccionar Duración"
  },
  ca: {
    'deep-tissue': {
      name: "Massatge de Teixit Profund",
      shortDesc: "Massatge terapèutic que treballa les capes més profundes dels músculs i del teixit connectiu per alleujar dolors crònics i tensió.",
      longDesc: "El massatge de teixit profund és un tipus de massatge terapèutic que treballa les capes més profundes dels músculs i del teixit connectiu. S'utilitza principalment per alleujar dolors musculars crònics, tensió i rigidesa, especialment a l'esquena, el coll, les espatlles i les cames.\n\n**Com funciona?**\n• El terapeuta aplica pressió lenta i ferma\n• Usa mans, dits, artells, avantbraços o colzes\n• Els moviments segueixen o creuen les fibres musculars per alliberar zones tenses\n\n**Per a què s'usa?**\n• Dolor muscular persistent\n• Contractures i tensió acumulada\n• Lesions esportives lleus\n• Problemes causats per mala postura\n• Falta de mobilitat o flexibilitat\n\n**Com es sent?**\n• Pot ser intens, però no hauria de fer massa mal\n• És normal sentir lleugera molèstia o cansament muscular després\n• És important avisar al terapeuta si la pressió és excessiva\n\n**Nota important:** Aquest massatge no és només per relaxar-se, sinó per tractar problemes musculars específics. Ha de realitzar-lo un professional capacitat, i no és recomanable per a totes les persones.",
      benefits: [
        "Redueix la tensió muscular",
        "Millora la circulació sanguínia",
        "Ajuda a relaxar els músculs",
        "Afavoreix una millor mobilitat",
        "Alleuja el dolor crònic"
      ],
      features: ["Pressió profunda", "Alliberament muscular", "Alleujament del dolor"]
    },
    'sports': {
      name: "Massatge Esportiu",
      shortDesc: "Massatge especialitzat per a atletes per prevenir lesions, preparar-se per a esdeveniments i millorar la recuperació.",
      longDesc: "El massatge esportiu està específicament dissenyat per a persones que fan activitat física. Ajuda a prevenir i tractar lesions, millora el rendiment atlètic i redueix el temps de recuperació. Siguis un atleta professional o un esportista de cap de setmana, el massatge esportiu pot ajudar-te a rendir al màxim. Els nostres terapeutes estan capacitats en les últimes tècniques per abordar les necessitats específiques de les persones actives.",
      benefits: [
        "Prevé lesions esportives",
        "Millora la flexibilitat",
        "Millora el rendiment",
        "Accelera la recuperació",
        "Redueix el dolor muscular"
      ],
      features: ["Enfocament atlètic", "Prevenció de lesions", "Millora del rendiment"]
    },
    'medical': {
      name: "Massatge Mèdic",
      shortDesc: "Massatge terapèutic prescrit per a condicions mèdiques específiques i necessitats de rehabilitació.",
      longDesc: "El massatge mèdic està basat en resultats, principalment l'aplicació d'un tractament específic dirigit als problemes específics que presenta el pacient. El tractament s'administra després d'una avaluació exhaustiva per part del terapeuta de massatge mèdic amb resultats específics sent la base del tractament. Es diferencia del massatge regular en què està específicament dissenyat per tractar condicions mèdiques diagnosticades.",
      benefits: [
        "Tracta condicions específiques",
        "Ajuda a la rehabilitació",
        "Redueix el dolor crònic",
        "Millora la mobilitat",
        "Complementa el tractament mèdic"
      ],
      features: ["Terapèutic", "Rehabilitació", "Enfocament mèdic"]
    },
    'relax': {
      name: "Massatge Sensitiu Relaxant",
      shortDesc: "Massatge suau i reconfortant dissenyat per a la màxima relaxació i alleujament de l'estrès.",
      longDesc: "El nostre Massatge Sensitiu Relaxant és perfecte per a aquells que busquen un toc suau i nutritiu. Usant pressió lleugera a mitjana, aquest massatge promou una relaxació profunda, redueix les hormones de l'estrès i crea una sensació de benestar general. Els moviments lents i fluids calmen el sistema nerviós i t'ajuden a desconnectar de les tensions diàries. Ideal per a qui són nous en el massatge o prefereixen un enfocament més suau.",
      benefits: [
        "Relaxació profunda",
        "Reducció de l'estrès",
        "Millora del son",
        "Claredat mental",
        "Equilibri emocional"
      ],
      features: ["Toc suau", "Alleujament de l'estrès", "Relaxació profunda"]
    },
    'feet': {
      name: "Massatge amb Peus",
      shortDesc: "Tècnica única de massatge descalç usant els peus del terapeuta per a una pressió profunda i àmplia.",
      longDesc: "Ashiatsu, o massatge descalç, és una tècnica única on el terapeuta usa els seus peus per donar cops profunds i fluids. Això permet una cobertura més àmplia i una pressió més profunda que el massatge tradicional amb les mans, mentre roman còmode i relaxant. El terapeuta es sosté de barres superiors per equilibri i control, entregant una pressió consistent que fon la tensió. Aquesta és una opció excepcional per a aquells que estimen el massatge de pressió profunda.",
      benefits: [
        "Pressió extra profunda",
        "Cops amplis i fluids",
        "Cobertura de cos complet",
        "Experiència única",
        "Alleujament durador"
      ],
      features: ["Tècnica descalç", "Pressió profunda", "Experiència única"]
    },
    consultMore: "Per a sessions de més de 90 min, contacteu-nos",
    duration: "Durada",
    price: "Preu",
    reserve: "Reservar Ara",
    askQuestion: "Fer una Pregunta",
    benefits: "Beneficis",
    backToServices: "Tornar a Serveis",
    selectDuration: "Seleccionar Durada"
  }
}

