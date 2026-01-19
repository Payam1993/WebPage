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
      min30: 50,
      min60: 90,
      min90: 110
    }
  },
  {
    id: 'corporate',
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80",
    detailImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80",
    prices: {
      min30: null,
      min60: null,
      min90: null
    },
    isCorporate: true
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
      shortDesc: "Therapeutic massage designed for active people and athletes, using greater force and faster movements to improve performance and speed up recovery.",
      longDesc: "Sports massage is a type of therapeutic massage designed for active people and athletes. It uses greater force and faster movements than relaxation massage, with the goal of improving performance and speeding up recovery.\n\n**How does it work?**\n• The therapist applies firmer pressure to work the muscles deeply\n• Fast and dynamic movements are used to stimulate the muscles\n• Techniques are adapted to the muscle groups most used in each sport or activity\n\n**What is it used for?**\n• Prepare muscles before physical activity\n• Promote recovery after exercise\n• Reduce muscle tension and fatigue\n• Help prevent sports injuries\n\n**How does it feel?**\n• It feels like an intense and energizing massage\n• The pressure is firm and the rhythm faster\n• It should be effective, not painful\n\n**Important note:** Sports massage is functional and specific, not just relaxing. The intensity and speed vary depending on the timing (before or after exercise) and should be performed by a trained professional.",
      benefits: [
        "Improves blood circulation",
        "Increases muscle flexibility",
        "Optimizes physical performance",
        "Reduces pain and recovery time"
      ],
      features: ["Athletic focus", "Injury prevention", "Performance boost"]
    },
    'medical': {
      name: "Medical Massage",
      shortDesc: "Therapeutic and relaxing massage, but more intense and deeper than a traditional massage, focused on treating specific muscle pain.",
      longDesc: "Medical massage is a type of therapeutic and relaxing massage, but more intense and deeper than a traditional massage. It is focused on treating specific muscle pain, loaded areas, and discomfort caused by injuries, stress, or poor posture.\n\n**How does it work?**\n• Combines relaxing techniques with deeper pressure\n• The therapist works in a localized manner, according to the patient's pain\n• Focuses on key points of the body where tension accumulates\n\n**What is it used for?**\n• Relieve muscle and joint pain\n• Treat contractures and stiffness\n• Help in the recovery of minor injuries\n• Reduce physical stress and accumulated tension\n\n**Most common areas and pain points**\n• Neck and shoulders (stress and poor posture)\n• Upper and lower back\n• Lumbar area\n• Hips and glutes\n• Legs and calves\n\n**How does it feel?**\n• It is a relaxing but firm massage\n• It may feel intense in loaded areas\n• It should always be controlled and tolerable, not painful\n\n**Important note:** Medical massage is personalized according to the patient's needs. The intensity is adjusted to each person and should be performed by a trained professional, especially when there is chronic pain or discomfort.",
      benefits: [
        "Reduces muscle pain",
        "Relaxes body and mind",
        "Improves mobility",
        "Promotes muscle recovery"
      ],
      features: ["Therapeutic", "Rehabilitation", "Medical focus"]
    },
    'relax': {
      name: "Sensitive Relax Massage",
      shortDesc: "An exclusive sensory experience designed to disconnect from daily rhythm and immerse yourself in a deep state of calm and well-being.",
      longDesc: "The relaxing massage is an exclusive sensory experience designed to disconnect from the daily rhythm and immerse yourself in a deep state of calm and well-being. Through soft and enveloping movements, the body and mind enter a natural balance, providing a sensation of absolute rest.\n\n**How does it work?**\n• Slow, fluid and harmonious movements that induce deep relaxation\n• Light to medium pressure, carefully adapted for maximum comfort\n• Full body work, creating a continuous and enveloping experience\n\n**What is it recommended for?**\n• Release stress and emotional tension\n• Promote deep relaxation of the nervous system\n• Improve circulation and body oxygenation\n• Promote rest, calm and integral well-being\n\n**Areas worked**\n• Back, neck and shoulders\n• Arms and hands\n• Legs and feet\n• Lumbar area\n\n**How does it feel?**\n• Deeply relaxing and comforting\n• Sensation of lightness and harmony\n• No pain, with delicate and pleasant pressure\n\n**Important note:** The relaxing massage is ideal for those seeking an absolute rest spa experience. It is not designed to treat specific muscle discomfort, but to offer a moment of disconnection, care and exclusive well-being.",
      benefits: [
        "Deep relaxation of body and mind",
        "Reduction of stress and accumulated fatigue",
        "Improved mood",
        "Sensation of balance, serenity and renewal"
      ],
      features: ["Gentle touch", "Stress relief", "Deep relaxation"]
    },
    'feet': {
      name: "Foot Pressure Massage",
      shortDesc: "A deep and harmonizing therapeutic experience where the body is worked through controlled and distributed pressure from the therapist's feet.",
      longDesc: "The foot pressure massage is a deep and harmonizing therapeutic experience, where the body is worked through controlled and distributed pressure from the therapist's feet. This ancestral technique allows for a broader connection with the body, providing a sensation of intense calm, lightness and energetic renewal.\n\nThanks to the uniform distribution of weight and moderate pressure, the massage acts in an enveloping way, promoting deep relaxation and the body's natural detoxification processes.\n\n**How does it work?**\n• Moderate and constant pressure applied with the feet, in a controlled and safe manner\n• Distributed force that allows working large areas without generating punctual tension\n• Slow, rhythmic and fluid movements that induce a deep state of relaxation\n• Personalized pressure adaptation according to client needs\n\n**What is it recommended for?**\n• Release deep physical and mental tensions\n• Promote relaxation of the nervous system\n• Stimulate circulation and natural body drainage\n• Support detoxification and energetic balance processes\n• Induce a sensation of calm, stability and integral well-being\n\n**Areas worked**\n• Complete back\n• Arms and hands\n• Legs and feet\n• Lumbar area\n• Face (optional, upon request)\n\n**How does it feel?**\n• Deeply calming and enveloping\n• Sensation of physical and mental release\n• Firm but pleasant pressure, without pain\n• Sensation of lightness, fluidity and body balance\n\n**Important note:** This massage is designed for those seeking a deep experience of relaxation, balance and general well-being. The pressure is moderate and always adapted to client comfort, offering a safe, respectful and highly revitalizing experience.",
      benefits: [
        "Deep relaxation of body and mind",
        "Reduction of stress and accumulated tension",
        "Improved circulation and body energy",
        "Sensation of internal cleansing and renewal",
        "Greater body connection and state of serenity"
      ],
      features: ["Barefoot technique", "Deep pressure", "Unique experience"]
    },
    'corporate': {
      name: "Corporate Wellness",
      shortDesc: "Exclusive wellness programs for hotels, businesses and organizations. Gift cards and special packages for your employees and clients.",
      longDesc: "Elevate your company's employee benefits with our Corporate Wellness Program. We partner with hotels, businesses, and organizations to provide exclusive wellness experiences that boost employee satisfaction, reduce stress, and promote a healthy work-life balance.\n\n**What We Offer**\n• Customized gift card programs for employee rewards and incentives\n• Special corporate rates for bulk purchases\n• Branded gift cards for your hotel guests or clients\n• Flexible redemption options for all our massage services\n• Corporate wellness events at your location\n\n**Perfect For**\n• Hotels looking to offer premium spa experiences to guests\n• Companies wanting to reward and motivate employees\n• HR departments seeking wellness benefits\n• Event organizers needing unique gift experiences\n• Client appreciation and loyalty programs\n\n**How It Works**\n• Contact us to discuss your specific needs\n• We create a customized proposal for your organization\n• Choose from gift cards, packages, or on-site services\n• Enjoy preferential corporate pricing\n• Simple invoicing and administration\n\n**Why Choose Confession Barcelona?**\n• Premium wellness experience in the heart of Barcelona\n• Professional, certified therapists\n• Flexible scheduling and services\n• Dedicated corporate account management\n• Customizable packages to fit any budget",
      benefits: [
        "Boost employee satisfaction and retention",
        "Reduce workplace stress and burnout",
        "Unique reward and incentive options",
        "Special corporate rates",
        "Customized wellness solutions"
      ],
      features: ["Gift Cards", "Corporate Rates", "Custom Packages"],
      contactUs: "Contact Us for Corporate Pricing"
    },
    consultMore: "For sessions over 90 min, please contact us",
    duration: "Duration",
    price: "Price",
    reserve: "Reserve Now",
    askQuestion: "Ask a Question",
    benefits: "Benefits",
    backToServices: "Back to Services",
    selectDuration: "Select Duration",
    // Reservation Form
    reservation: {
      title: "Book Your Session",
      subtitle: "Fill in your details to check availability",
      name: "Name",
      namePlaceholder: "Your name",
      surname: "Surname",
      surnamePlaceholder: "Your surname",
      phone: "Phone Number",
      phonePlaceholder: "+34 XXX XXX XXX",
      email: "Email",
      emailPlaceholder: "your@email.com",
      emailOptional: "(Optional)",
      therapist: "Preferred Therapist",
      therapistPlaceholder: "Select a therapist",
      noPreference: "No preference / Random",
      viewTherapists: "View our therapists",
      service: "Service",
      servicePlaceholder: "Select a service",
      duration: "Duration",
      checkAvailability: "Check Availability",
      successTitle: "Request Received!",
      successMessage: "We will contact you shortly to confirm your booking.",
      close: "Close"
    }
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
      shortDesc: "Masaje terapéutico diseñado para personas activas y deportistas, utilizando mayor fuerza y movimientos más rápidos para mejorar el rendimiento y acelerar la recuperación.",
      longDesc: "El masaje deportivo es un tipo de masaje terapéutico diseñado para personas activas y deportistas. Utiliza mayor fuerza y movimientos más rápidos que el masaje de relajación, con el objetivo de mejorar el rendimiento y acelerar la recuperación.\n\n**¿Cómo funciona?**\n• El terapeuta aplica presión más fuerte para trabajar los músculos en profundidad\n• Se utilizan movimientos rápidos y dinámicos para estimular los músculos\n• Las técnicas se adaptan a los grupos musculares más usados en cada deporte o actividad\n\n**¿Para qué se usa?**\n• Preparar los músculos antes de la actividad física\n• Favorecer la recuperación después del ejercicio\n• Reducir tensión muscular y fatiga\n• Ayudar a prevenir lesiones deportivas\n\n**¿Cómo se siente?**\n• Se percibe como un masaje intenso y energizante\n• La presión es firme y el ritmo más rápido\n• Debe ser efectivo, no doloroso\n\n**Nota importante:** El masaje deportivo es funcional y específico, no solo relajante. La intensidad y la velocidad varían según el momento (antes o después del ejercicio) y debe ser realizado por un profesional capacitado.",
      benefits: [
        "Mejora la circulación sanguínea",
        "Aumenta la flexibilidad muscular",
        "Optimiza el rendimiento físico",
        "Disminuye el dolor y el tiempo de recuperación"
      ],
      features: ["Enfoque atlético", "Prevención de lesiones", "Mejora del rendimiento"]
    },
    'medical': {
      name: "Masaje Médico",
      shortDesc: "Masaje terapéutico y relajante, pero más intenso y profundo que un masaje tradicional, enfocado en tratar dolores musculares específicos.",
      longDesc: "El masaje médico es un tipo de masaje terapéutico y relajante, pero más intenso y profundo que un masaje tradicional. Está enfocado en tratar dolores musculares específicos, zonas cargadas y molestias causadas por lesiones, estrés o malas posturas.\n\n**¿Cómo funciona?**\n• Combina técnicas relajantes con presión más profunda\n• El terapeuta trabaja de forma localizada, según el dolor del paciente\n• Se enfoca en puntos clave del cuerpo donde se acumula tensión\n\n**¿Para qué se usa?**\n• Aliviar dolores musculares y articulares\n• Tratar contracturas y rigidez\n• Ayudar en la recuperación de lesiones leves\n• Reducir el estrés físico y la tensión acumulada\n\n**Zonas y puntos más comunes con dolor**\n• Cuello y hombros (estrés y mala postura)\n• Espalda alta y baja\n• Zona lumbar\n• Caderas y glúteos\n• Piernas y pantorrillas\n\n**¿Cómo se siente?**\n• Es un masaje relajante pero firme\n• Puede sentirse intenso en zonas cargadas\n• Siempre debe ser controlado y tolerable, no doloroso\n\n**Nota importante:** El masaje médico es personalizado según las necesidades del paciente. La intensidad se ajusta a cada persona y debe ser realizado por un profesional capacitado, especialmente cuando hay dolor o molestias crónicas.",
      benefits: [
        "Disminuye el dolor muscular",
        "Relaja el cuerpo y la mente",
        "Mejora la movilidad",
        "Favorece la recuperación muscular"
      ],
      features: ["Terapéutico", "Rehabilitación", "Enfoque médico"]
    },
    'relax': {
      name: "Masaje Relajante – Experiencia Spa",
      shortDesc: "Experiencia sensorial exclusiva diseñada para desconectar del ritmo diario y sumergirse en un estado profundo de calma y bienestar.",
      longDesc: "El masaje relajante es una experiencia sensorial exclusiva diseñada para desconectar del ritmo diario y sumergirse en un estado profundo de calma y bienestar. A través de movimientos suaves y envolventes, el cuerpo y la mente entran en un equilibrio natural, proporcionando una sensación de descanso absoluto.\n\n**¿Cómo funciona?**\n• Movimientos lentos, fluidos y armoniosos que inducen una relajación profunda\n• Presión suave a media, cuidadosamente adaptada para ofrecer máximo confort\n• Trabajo global del cuerpo, creando una experiencia continua y envolvente\n\n**¿Para qué se recomienda?**\n• Liberar el estrés y la tensión emocional\n• Favorecer la relajación profunda del sistema nervioso\n• Mejorar la circulación y la oxigenación del cuerpo\n• Promover el descanso, la calma y el bienestar integral\n\n**Zonas que se trabajan**\n• Espalda, cuello y hombros\n• Brazos y manos\n• Piernas y pies\n• Zona lumbar\n\n**¿Cómo se siente?**\n• Profundamente relajante y reconfortante\n• Sensación de ligereza y armonía\n• Sin dolor, con una presión delicada y placentera\n\n**Nota importante:** El masaje relajante es ideal para quienes buscan una experiencia spa de descanso absoluto. No está diseñado para tratar molestias musculares específicas, sino para ofrecer un momento de desconexión, cuidado y bienestar exclusivo.",
      benefits: [
        "Relajación profunda del cuerpo y la mente",
        "Reducción del estrés y la fatiga acumulada",
        "Mejora del estado de ánimo",
        "Sensación de equilibrio, serenidad y renovación"
      ],
      features: ["Toque suave", "Alivio del estrés", "Relajación profunda"]
    },
    'feet': {
      name: "Masaje Corporal con Pies",
      shortDesc: "Experiencia terapéutica profunda y armonizadora, en la que el cuerpo es trabajado mediante la presión controlada y distribuida de los pies del terapeuta.",
      longDesc: "El masaje corporal con pies es una experiencia terapéutica profunda y armonizadora, en la que el cuerpo es trabajado mediante la presión controlada y distribuida de los pies del terapeuta. Esta técnica ancestral permite una conexión más amplia con el cuerpo, proporcionando una sensación de calma intensa, ligereza y renovación energética.\n\nGracias a la distribución uniforme del peso y la presión moderada, el masaje actúa de forma envolvente, favoreciendo la relajación profunda y los procesos naturales de desintoxicación del organismo.\n\n**¿Cómo funciona?**\n• Presión moderada y constante aplicada con los pies, de forma controlada y segura\n• Fuerza distribuida que permite trabajar zonas amplias sin generar tensión puntual\n• Movimientos lentos, rítmicos y fluidos que inducen un estado profundo de relajación\n• Adaptación personalizada de la presión según las necesidades del cliente\n\n**¿Para qué se recomienda?**\n• Liberar tensiones físicas y mentales profundas\n• Favorecer la relajación del sistema nervioso\n• Estimular la circulación y el drenaje natural del cuerpo\n• Apoyar procesos de desintoxicación y equilibrio energético\n• Inducir una sensación de calma, estabilidad y bienestar integral\n\n**Zonas que se trabajan**\n• Espalda completa\n• Brazos y manos\n• Piernas y pies\n• Zona lumbar\n• Rostro (opcional, bajo petición)\n\n**¿Cómo se siente?**\n• Profundamente calmante y envolvente\n• Sensación de descarga física y mental\n• Presión firme pero agradable, sin dolor\n• Sensación de ligereza, fluidez y equilibrio corporal\n\n**Nota importante:** Este masaje está diseñado para quienes buscan una experiencia profunda de relajación, equilibrio y bienestar general. La presión es moderada y siempre adaptada a la comodidad del cliente, ofreciendo una experiencia segura, respetuosa y altamente revitalizante.",
      benefits: [
        "Relajación profunda del cuerpo y la mente",
        "Reducción del estrés y la tensión acumulada",
        "Mejora de la circulación y la energía corporal",
        "Sensación de limpieza interna y renovación",
        "Mayor conexión corporal y estado de serenidad"
      ],
      features: ["Técnica descalzo", "Presión profunda", "Experiencia única"]
    },
    'corporate': {
      name: "Bienestar Corporativo",
      shortDesc: "Programas exclusivos de bienestar para hoteles, empresas y organizaciones. Tarjetas regalo y paquetes especiales para sus empleados y clientes.",
      longDesc: "Eleve los beneficios de sus empleados con nuestro Programa de Bienestar Corporativo. Colaboramos con hoteles, empresas y organizaciones para ofrecer experiencias de bienestar exclusivas que aumentan la satisfacción de los empleados, reducen el estrés y promueven un equilibrio saludable entre trabajo y vida personal.\n\n**Lo Que Ofrecemos**\n• Programas de tarjetas regalo personalizadas para recompensas e incentivos de empleados\n• Tarifas corporativas especiales para compras al por mayor\n• Tarjetas regalo personalizadas para huéspedes de hotel o clientes\n• Opciones de canje flexibles para todos nuestros servicios de masaje\n• Eventos de bienestar corporativo en su ubicación\n\n**Perfecto Para**\n• Hoteles que buscan ofrecer experiencias spa premium a sus huéspedes\n• Empresas que desean recompensar y motivar a sus empleados\n• Departamentos de RRHH que buscan beneficios de bienestar\n• Organizadores de eventos que necesitan experiencias de regalo únicas\n• Programas de fidelización y agradecimiento a clientes\n\n**Cómo Funciona**\n• Contáctenos para discutir sus necesidades específicas\n• Creamos una propuesta personalizada para su organización\n• Elija entre tarjetas regalo, paquetes o servicios en su ubicación\n• Disfrute de precios corporativos preferenciales\n• Facturación y administración sencillas\n\n**¿Por Qué Elegir Confession Barcelona?**\n• Experiencia de bienestar premium en el corazón de Barcelona\n• Terapeutas profesionales y certificados\n• Horarios y servicios flexibles\n• Gestión dedicada de cuentas corporativas\n• Paquetes personalizables para cualquier presupuesto",
      benefits: [
        "Aumenta la satisfacción y retención de empleados",
        "Reduce el estrés y el agotamiento laboral",
        "Opciones únicas de recompensa e incentivos",
        "Tarifas corporativas especiales",
        "Soluciones de bienestar personalizadas"
      ],
      features: ["Tarjetas Regalo", "Tarifas Corporativas", "Paquetes Personalizados"],
      contactUs: "Contáctenos para Precios Corporativos"
    },
    consultMore: "Para sesiones de más de 90 min, contáctenos",
    duration: "Duración",
    price: "Precio",
    reserve: "Reservar Ahora",
    askQuestion: "Hacer una Pregunta",
    benefits: "Beneficios",
    backToServices: "Volver a Servicios",
    selectDuration: "Seleccionar Duración",
    // Reservation Form
    reservation: {
      title: "Reserva Tu Sesión",
      subtitle: "Completa tus datos para verificar disponibilidad",
      name: "Nombre",
      namePlaceholder: "Tu nombre",
      surname: "Apellido",
      surnamePlaceholder: "Tu apellido",
      phone: "Teléfono",
      phonePlaceholder: "+34 XXX XXX XXX",
      email: "Correo Electrónico",
      emailPlaceholder: "tu@email.com",
      emailOptional: "(Opcional)",
      therapist: "Terapeuta Preferido",
      therapistPlaceholder: "Selecciona un terapeuta",
      noPreference: "Sin preferencia / Aleatorio",
      viewTherapists: "Ver nuestros terapeutas",
      service: "Servicio",
      servicePlaceholder: "Selecciona un servicio",
      duration: "Duración",
      checkAvailability: "Comprobar Disponibilidad",
      successTitle: "¡Solicitud Recibida!",
      successMessage: "Nos pondremos en contacto contigo pronto para confirmar tu reserva.",
      close: "Cerrar"
    }
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
      shortDesc: "Massatge terapèutic dissenyat per a persones actives i esportistes, utilitzant més força i moviments més ràpids per millorar el rendiment i accelerar la recuperació.",
      longDesc: "El massatge esportiu és un tipus de massatge terapèutic dissenyat per a persones actives i esportistes. Utilitza més força i moviments més ràpids que el massatge de relaxació, amb l'objectiu de millorar el rendiment i accelerar la recuperació.\n\n**Com funciona?**\n• El terapeuta aplica pressió més forta per treballar els músculs en profunditat\n• S'utilitzen moviments ràpids i dinàmics per estimular els músculs\n• Les tècniques s'adapten als grups musculars més usats en cada esport o activitat\n\n**Per a què s'usa?**\n• Preparar els músculs abans de l'activitat física\n• Afavorir la recuperació després de l'exercici\n• Reduir tensió muscular i fatiga\n• Ajudar a prevenir lesions esportives\n\n**Com es sent?**\n• Es percep com un massatge intens i energitzant\n• La pressió és ferma i el ritme més ràpid\n• Ha de ser efectiu, no dolorós\n\n**Nota important:** El massatge esportiu és funcional i específic, no només relaxant. La intensitat i la velocitat varien segons el moment (abans o després de l'exercici) i ha de ser realitzat per un professional capacitat.",
      benefits: [
        "Millora la circulació sanguínia",
        "Augmenta la flexibilitat muscular",
        "Optimitza el rendiment físic",
        "Disminueix el dolor i el temps de recuperació"
      ],
      features: ["Enfocament atlètic", "Prevenció de lesions", "Millora del rendiment"]
    },
    'medical': {
      name: "Massatge Mèdic",
      shortDesc: "Massatge terapèutic i relaxant, però més intens i profund que un massatge tradicional, enfocat a tractar dolors musculars específics.",
      longDesc: "El massatge mèdic és un tipus de massatge terapèutic i relaxant, però més intens i profund que un massatge tradicional. Està enfocat a tractar dolors musculars específics, zones carregades i molèsties causades per lesions, estrès o males postures.\n\n**Com funciona?**\n• Combina tècniques relaxants amb pressió més profunda\n• El terapeuta treballa de forma localitzada, segons el dolor del pacient\n• S'enfoca en punts clau del cos on s'acumula tensió\n\n**Per a què s'usa?**\n• Alleujar dolors musculars i articulars\n• Tractar contractures i rigidesa\n• Ajudar en la recuperació de lesions lleus\n• Reduir l'estrès físic i la tensió acumulada\n\n**Zones i punts més comuns amb dolor**\n• Coll i espatlles (estrès i mala postura)\n• Esquena alta i baixa\n• Zona lumbar\n• Malucs i glutis\n• Cames i panxells\n\n**Com es sent?**\n• És un massatge relaxant però ferm\n• Pot sentir-se intens en zones carregades\n• Sempre ha de ser controlat i tolerable, no dolorós\n\n**Nota important:** El massatge mèdic és personalitzat segons les necessitats del pacient. La intensitat s'ajusta a cada persona i ha de ser realitzat per un professional capacitat, especialment quan hi ha dolor o molèsties cròniques.",
      benefits: [
        "Disminueix el dolor muscular",
        "Relaxa el cos i la ment",
        "Millora la mobilitat",
        "Afavoreix la recuperació muscular"
      ],
      features: ["Terapèutic", "Rehabilitació", "Enfocament mèdic"]
    },
    'relax': {
      name: "Massatge Relaxant – Experiència Spa",
      shortDesc: "Experiència sensorial exclusiva dissenyada per desconnectar del ritme diari i submergir-se en un estat profund de calma i benestar.",
      longDesc: "El massatge relaxant és una experiència sensorial exclusiva dissenyada per desconnectar del ritme diari i submergir-se en un estat profund de calma i benestar. A través de moviments suaus i envoltants, el cos i la ment entren en un equilibri natural, proporcionant una sensació de descans absolut.\n\n**Com funciona?**\n• Moviments lents, fluids i harmoniosos que indueixen una relaxació profunda\n• Pressió suau a mitjana, curosament adaptada per oferir màxim confort\n• Treball global del cos, creant una experiència contínua i envoltant\n\n**Per a què es recomana?**\n• Alliberar l'estrès i la tensió emocional\n• Afavorir la relaxació profunda del sistema nerviós\n• Millorar la circulació i l'oxigenació del cos\n• Promoure el descans, la calma i el benestar integral\n\n**Zones que es treballen**\n• Esquena, coll i espatlles\n• Braços i mans\n• Cames i peus\n• Zona lumbar\n\n**Com es sent?**\n• Profundament relaxant i reconfortant\n• Sensació de lleugeresa i harmonia\n• Sense dolor, amb una pressió delicada i plaent\n\n**Nota important:** El massatge relaxant és ideal per a qui busquen una experiència spa de descans absolut. No està dissenyat per tractar molèsties musculars específiques, sinó per oferir un moment de desconnexió, cura i benestar exclusiu.",
      benefits: [
        "Relaxació profunda del cos i la ment",
        "Reducció de l'estrès i la fatiga acumulada",
        "Millora de l'estat d'ànim",
        "Sensació d'equilibri, serenitat i renovació"
      ],
      features: ["Toc suau", "Alleujament de l'estrès", "Relaxació profunda"]
    },
    'feet': {
      name: "Massatge Corporal amb Peus",
      shortDesc: "Experiència terapèutica profunda i harmonitzadora, en la qual el cos és treballat mitjançant la pressió controlada i distribuïda dels peus del terapeuta.",
      longDesc: "El massatge corporal amb peus és una experiència terapèutica profunda i harmonitzadora, en la qual el cos és treballat mitjançant la pressió controlada i distribuïda dels peus del terapeuta. Aquesta tècnica ancestral permet una connexió més àmplia amb el cos, proporcionant una sensació de calma intensa, lleugeresa i renovació energètica.\n\nGràcies a la distribució uniforme del pes i la pressió moderada, el massatge actua de forma envoltant, afavorint la relaxació profunda i els processos naturals de desintoxicació de l'organisme.\n\n**Com funciona?**\n• Pressió moderada i constant aplicada amb els peus, de forma controlada i segura\n• Força distribuïda que permet treballar zones àmplies sense generar tensió puntual\n• Moviments lents, rítmics i fluids que indueixen un estat profund de relaxació\n• Adaptació personalitzada de la pressió segons les necessitats del client\n\n**Per a què es recomana?**\n• Alliberar tensions físiques i mentals profundes\n• Afavorir la relaxació del sistema nerviós\n• Estimular la circulació i el drenatge natural del cos\n• Donar suport a processos de desintoxicació i equilibri energètic\n• Induir una sensació de calma, estabilitat i benestar integral\n\n**Zones que es treballen**\n• Esquena completa\n• Braços i mans\n• Cames i peus\n• Zona lumbar\n• Rostre (opcional, sota petició)\n\n**Com es sent?**\n• Profundament calmant i envoltant\n• Sensació de descàrrega física i mental\n• Pressió ferma però agradable, sense dolor\n• Sensació de lleugeresa, fluïdesa i equilibri corporal\n\n**Nota important:** Aquest massatge està dissenyat per a qui busquen una experiència profunda de relaxació, equilibri i benestar general. La pressió és moderada i sempre adaptada a la comoditat del client, oferint una experiència segura, respectuosa i altament revitalitzant.",
      benefits: [
        "Relaxació profunda del cos i la ment",
        "Reducció de l'estrès i la tensió acumulada",
        "Millora de la circulació i l'energia corporal",
        "Sensació de neteja interna i renovació",
        "Major connexió corporal i estat de serenitat"
      ],
      features: ["Tècnica descalç", "Pressió profunda", "Experiència única"]
    },
    'corporate': {
      name: "Benestar Corporatiu",
      shortDesc: "Programes exclusius de benestar per a hotels, empreses i organitzacions. Targetes regal i paquets especials per als seus empleats i clients.",
      longDesc: "Elevi els beneficis dels seus empleats amb el nostre Programa de Benestar Corporatiu. Col·laborem amb hotels, empreses i organitzacions per oferir experiències de benestar exclusives que augmenten la satisfacció dels empleats, redueixen l'estrès i promouen un equilibri saludable entre treball i vida personal.\n\n**El Que Oferim**\n• Programes de targetes regal personalitzades per a recompenses i incentius d'empleats\n• Tarifes corporatives especials per a compres a l'engròs\n• Targetes regal personalitzades per a hostes d'hotel o clients\n• Opcions de bescanvi flexibles per a tots els nostres serveis de massatge\n• Esdeveniments de benestar corporatiu a la seva ubicació\n\n**Perfecte Per A**\n• Hotels que busquen oferir experiències spa premium als seus hostes\n• Empreses que desitgen recompensar i motivar els seus empleats\n• Departaments de RRHH que busquen beneficis de benestar\n• Organitzadors d'esdeveniments que necessiten experiències de regal úniques\n• Programes de fidelització i agraïment a clients\n\n**Com Funciona**\n• Contacteu-nos per discutir les seves necessitats específiques\n• Creem una proposta personalitzada per a la seva organització\n• Triï entre targetes regal, paquets o serveis a la seva ubicació\n• Gaudeixi de preus corporatius preferencials\n• Facturació i administració senzilles\n\n**Per Què Triar Confession Barcelona?**\n• Experiència de benestar premium al cor de Barcelona\n• Terapeutes professionals i certificats\n• Horaris i serveis flexibles\n• Gestió dedicada de comptes corporatius\n• Paquets personalitzables per a qualsevol pressupost",
      benefits: [
        "Augmenta la satisfacció i retenció d'empleats",
        "Redueix l'estrès i l'esgotament laboral",
        "Opcions úniques de recompensa i incentius",
        "Tarifes corporatives especials",
        "Solucions de benestar personalitzades"
      ],
      features: ["Targetes Regal", "Tarifes Corporatives", "Paquets Personalitzats"],
      contactUs: "Contacteu-nos per a Preus Corporatius"
    },
    consultMore: "Per a sessions de més de 90 min, contacteu-nos",
    duration: "Durada",
    price: "Preu",
    reserve: "Reservar Ara",
    askQuestion: "Fer una Pregunta",
    benefits: "Beneficis",
    backToServices: "Tornar a Serveis",
    selectDuration: "Seleccionar Durada",
    // Reservation Form
    reservation: {
      title: "Reserva la Teva Sessió",
      subtitle: "Completa les teves dades per verificar disponibilitat",
      name: "Nom",
      namePlaceholder: "El teu nom",
      surname: "Cognom",
      surnamePlaceholder: "El teu cognom",
      phone: "Telèfon",
      phonePlaceholder: "+34 XXX XXX XXX",
      email: "Correu Electrònic",
      emailPlaceholder: "el_teu@email.com",
      emailOptional: "(Opcional)",
      therapist: "Terapeuta Preferit",
      therapistPlaceholder: "Selecciona un terapeuta",
      noPreference: "Sense preferència / Aleatori",
      viewTherapists: "Veure els nostres terapeutes",
      service: "Servei",
      servicePlaceholder: "Selecciona un servei",
      duration: "Durada",
      checkAvailability: "Comprovar Disponibilitat",
      successTitle: "Sol·licitud Rebuda!",
      successMessage: "Ens posarem en contacte amb tu aviat per confirmar la teva reserva.",
      close: "Tancar"
    }
  }
}

