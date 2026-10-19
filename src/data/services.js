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
  },
  {
    id: 'reserve-room',
    image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&q=80",
    detailImage: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1200&q=80",
    prices: {
      min30: null,
      min60: null,
      min90: null
    },
    isReserveRoom: true
  }
]

export const serviceTranslations = {
  en: {
    'deep-tissue': {
      name: "Deep Tissue Massage",
      shortDesc: "A firm massage that works the deeper layers of the muscles for a feeling of ease, comfort and well-being.",
      longDesc: "Deep tissue massage is a firm massage that works the deeper layers of the muscles. Slow, steady pressure helps you feel more comfortable and at ease, especially across the back, neck, shoulders and legs.\n\n**How does it work?**\n• The massage professional applies slow, firm pressure\n• Uses hands, fingers, knuckles, forearms or elbows\n• Movements follow the muscles to ease areas that feel tight\n\n**What is it for?**\n• Everyday muscle tightness\n• A feeling of heaviness after a long day\n• Comfort after time spent in the same posture\n• A deeper sense of relaxation and well-being\n\n**How does it feel?**\n• It can feel intense, and it should stay comfortable\n• A light tired feeling afterwards is common\n• Tell your massage professional if the pressure is too much\n\n**Important note:** This massage is offered for relaxation, comfort and well-being. The pressure is always adapted to you.",
      benefits: [
        "Eases everyday muscle tightness",
        "A feeling of warmth and ease",
        "Helps the body relax",
        "A more comfortable, mobile feeling",
        "A deeper sense of well-being"
      ],
      features: ["Firm pressure", "Muscle comfort", "Deep relaxation"]
    },
    'sports': {
      name: "Sports Massage",
      shortDesc: "A lively massage for active people, with firmer pressure and a faster rhythm, for comfort, freshness and well-being.",
      longDesc: "Sports massage is a massage for people who like to move. It uses firmer pressure and a quicker rhythm than a relaxing massage, so the body can feel fresh, comfortable and at ease.\n\n**How does it work?**\n• The massage professional applies firmer pressure\n• Fast and dynamic movements bring a sense of energy\n• The massage follows the areas you use most in your activity\n\n**What is it for?**\n• Feel prepared and comfortable before activity\n• Unwind after exercise\n• Ease the feeling of tired, tight muscles\n• Enjoy a fresher, lighter feeling\n\n**How does it feel?**\n• Intense and energizing\n• Firm pressure and a faster rhythm\n• Effective and comfortable, never painful\n\n**Important note:** This is a wellness massage for active people. The rhythm and pressure are adapted to your comfort, before or after activity.",
      benefits: [
        "A fresher, lighter feeling",
        "A more flexible, comfortable body",
        "Ease after activity",
        "Relaxation and well-being"
      ],
      features: ["Active lifestyle", "Firm rhythm", "Fresh feeling"]
    },
    'medical': {
      name: "Couple Relax Massage Experience",
      shortDesc: "A shared relaxing massage for two, to slow down together and enjoy calm, comfort and well-being.",
      longDesc: "The couple relax massage is a shared wellness experience for two. Side by side, each guest receives a gentle, unhurried massage focused on rest, comfort and a quiet moment together.\n\n**How does it work?**\n• Two guests enjoy a relaxing massage at the same time\n• Soft to medium pressure, adapted to each person's comfort\n• Slow, enveloping movements that invite calm\n\n**What is it for?**\n• Unwind together after a busy day\n• Share a quiet moment of care and well-being\n• Ease everyday tension and invite rest\n• Celebrate a special occasion in a calm setting\n\n**Areas included**\n• Back, neck and shoulders\n• Arms and hands\n• Legs and feet\n• Lower back\n\n**How does it feel?**\n• Relaxing, warm and unhurried\n• Comfortable pressure, always adjusted to you\n• A shared feeling of calm and lightness\n\n**Important note:** This is a massage and well-being experience for relaxation. Pressure and rhythm are always adapted to each guest.",
      benefits: [
        "Shared calm and rest",
        "Relaxation of body and mind",
        "A comfortable, unhurried pace",
        "A feeling of closeness and well-being"
      ],
      features: ["For two", "Relaxing", "Well-being"]
    },
    'relax': {
      name: "Sensitive Relax Massage",
      shortDesc: "An exclusive sensory experience designed to disconnect from daily rhythm and immerse yourself in a deep state of calm and well-being.",
      longDesc: "The relaxing massage is an exclusive sensory experience designed to disconnect from the daily rhythm and immerse yourself in a deep state of calm and well-being. Through soft and enveloping movements, the body and mind settle into a natural balance, providing a sensation of absolute rest.\n\n**How does it work?**\n• Slow, fluid and harmonious movements that invite deep relaxation\n• Light to medium pressure, carefully adapted for maximum comfort\n• Full body work, creating a continuous and enveloping experience\n\n**What is it recommended for?**\n• Release everyday stress and tension\n• Invite deep relaxation of body and mind\n• A feeling of warmth, ease and lightness\n• Rest, calm and integral well-being\n\n**Areas worked**\n• Back, neck and shoulders\n• Arms and hands\n• Legs and feet\n• Lumbar area\n\n**How does it feel?**\n• Deeply relaxing and comforting\n• Sensation of lightness and harmony\n• Delicate and pleasant pressure\n\n**Important note:** The relaxing massage is a wellness experience for rest and care. It offers a moment of disconnection and exclusive well-being.",
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
      shortDesc: "A deep and harmonizing massage where the body is worked through controlled and distributed pressure from the massage professional's feet.",
      longDesc: "The foot pressure massage is a deep and harmonizing wellness experience, where the body is worked through controlled and distributed pressure from the massage professional's feet. This ancestral technique allows a broader connection with the body, providing a sensation of intense calm, lightness and renewal.\n\nThanks to the even distribution of weight and moderate pressure, the massage feels enveloping and invites deep relaxation and a feeling of lightness.\n\n**How does it work?**\n• Moderate and constant pressure applied with the feet, in a controlled and comfortable way\n• Distributed pressure that covers large areas evenly\n• Slow, rhythmic and fluid movements that invite a deep state of relaxation\n• Pressure adapted to each guest's comfort\n\n**What is it recommended for?**\n• Ease deep physical and mental tension\n• Invite relaxation of body and mind\n• A feeling of warmth, lightness and flow\n• Calm, stability and integral well-being\n\n**Areas worked**\n• Complete back\n• Arms and hands\n• Legs and feet\n• Lumbar area\n• Face (optional, upon request)\n\n**How does it feel?**\n• Deeply calming and enveloping\n• A feeling of physical and mental ease\n• Firm but pleasant pressure\n• Lightness, fluidity and balance\n\n**Important note:** This massage is a wellness experience of relaxation, balance and general well-being. The pressure is moderate and always adapted to your comfort.",
      benefits: [
        "Deep relaxation of body and mind",
        "Reduction of stress and accumulated tension",
        "A feeling of warmth, lightness and energy",
        "A feeling of renewal and well-being",
        "Greater body connection and state of serenity"
      ],
      features: ["Barefoot technique", "Deep pressure", "Unique experience"]
    },
    'corporate': {
      name: "Corporate Wellness",
      shortDesc: "Exclusive wellness programs for hotels, businesses and organizations. Gift cards and special packages for your employees and clients.",
      longDesc: "Elevate your company's employee benefits with our Corporate Wellness Program. We partner with hotels, businesses, and organizations to provide exclusive wellness experiences that boost employee satisfaction, reduce stress, and promote a healthy work-life balance.\n\n**What We Offer**\n• Customized gift card programs for employee rewards and incentives\n• Special corporate rates for bulk purchases\n• Branded gift cards for your hotel guests or clients\n• Flexible redemption options for all our massage services\n• Corporate wellness events at your location\n\n**Perfect For**\n• Hotels looking to offer premium spa experiences to guests\n• Companies wanting to reward and motivate employees\n• HR departments seeking wellness benefits\n• Event organizers needing unique gift experiences\n• Client appreciation and loyalty programs\n\n**How It Works**\n• Contact us to discuss your specific needs\n• We create a customized proposal for your organization\n• Choose from gift cards, packages, or on-site services\n• Enjoy preferential corporate pricing\n• Simple invoicing and administration\n\n**Why Choose Lavin?**\n• Premium wellness experience in the heart of Barcelona\n• Professional massage team\n• Flexible scheduling and services\n• Dedicated corporate account management\n• Customizable packages to fit any budget",
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
    'reserve-room': {
      name: "Reserve Room",
      shortDesc: "If you are a massage professional with experience and are looking for a room to welcome your clients, get in contact with us and we will contact you.",
      longDesc: "If you are a massage professional with experience and are looking for a room to welcome your clients, get in contact with us and we will contact you.",
      benefits: [
        "Professional massage rooms",
        "Flexible reservation options",
        "Central Barcelona location",
        "Support for independent massage professionals"
      ],
      features: ["For massage professionals", "Room rental", "Contact us"],
      contactUs: "Contact Us to Reserve"
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
      therapist: "Preferred massage professional",
      therapistPlaceholder: "Select a massage professional",
      noPreference: "No preference / Random",
      viewTherapists: "View our massage team",
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
      shortDesc: "Un masaje firme que trabaja las capas más profundas de los músculos para una sensación de ligereza, confort y bienestar.",
      longDesc: "El masaje de tejido profundo es un masaje firme que trabaja las capas más profundas de los músculos. La presión lenta y constante ayuda a sentirte más cómodo y en calma, especialmente en la espalda, el cuello, los hombros y las piernas.\n\n**¿Cómo funciona?**\n• El masajista aplica presión lenta y firme\n• Usa manos, dedos, nudillos, antebrazos o codos\n• Los movimientos siguen los músculos para suavizar las zonas que se sienten tensas\n\n**¿Para qué se usa?**\n• Tensión muscular del día a día\n• Sensación de pesadez después de una jornada larga\n• Confort después de pasar tiempo en la misma postura\n• Una relajación más profunda y una sensación de bienestar\n\n**¿Cómo se siente?**\n• Puede sentirse intenso, y siempre debe resultar cómodo\n• Es habitual notar un ligero cansancio después\n• Es importante avisar al masajista si la presión es excesiva\n\n**Nota importante:** Este masaje se ofrece para la relajación, el confort y el bienestar. La presión se adapta siempre a ti.",
      benefits: [
        "Suaviza la tensión muscular del día a día",
        "Sensación de calor y ligereza",
        "Ayuda a relajar el cuerpo",
        "Una sensación más cómoda y suelta",
        "Una sensación más profunda de bienestar"
      ],
      features: ["Presión firme", "Confort muscular", "Relajación profunda"]
    },
    'sports': {
      name: "Masaje Deportivo",
      shortDesc: "Un masaje dinámico para personas activas, con presión más firme y un ritmo más vivo, para confort, frescura y bienestar.",
      longDesc: "El masaje deportivo es un masaje para personas a las que les gusta moverse. Utiliza una presión más firme y un ritmo más vivo que el masaje de relajación, para que el cuerpo se sienta fresco, cómodo y en calma.\n\n**¿Cómo funciona?**\n• El masajista aplica una presión más firme\n• Los movimientos rápidos y dinámicos aportan una sensación de energía\n• El masaje sigue las zonas que más utilizas en tu actividad\n\n**¿Para qué se usa?**\n• Sentirte preparado y cómodo antes de la actividad\n• Desconectar después del ejercicio\n• Suavizar la sensación de músculos cansados y tensos\n• Disfrutar de una sensación más fresca y ligera\n\n**¿Cómo se siente?**\n• Intenso y energizante\n• Presión firme y ritmo más rápido\n• Efectivo y cómodo, nunca doloroso\n\n**Nota importante:** Es un masaje de bienestar para personas activas. El ritmo y la presión se adaptan a tu confort, antes o después de la actividad.",
      benefits: [
        "Una sensación más fresca y ligera",
        "Un cuerpo más flexible y cómodo",
        "Calma después de la actividad",
        "Relajación y bienestar"
      ],
      features: ["Vida activa", "Ritmo firme", "Sensación fresca"]
    },
    'medical': {
      name: "Experiencia de masaje relajante en pareja",
      shortDesc: "Un masaje relajante compartido para dos, para desconectar juntos y disfrutar de calma, confort y bienestar.",
      longDesc: "El masaje relajante en pareja es una experiencia de bienestar compartida. Uno junto al otro, cada persona recibe un masaje suave y sin prisa, centrado en el descanso, el confort y un momento tranquilo en común.\n\n**¿Cómo funciona?**\n• Dos personas disfrutan de un masaje relajante al mismo tiempo\n• Presión suave a media, adaptada al confort de cada una\n• Movimientos lentos y envolventes que invitan a la calma\n\n**¿Para qué se usa?**\n• Desconectar juntos después de un día intenso\n• Compartir un momento tranquilo de cuidado y bienestar\n• Suavizar la tensión del día a día e invitar al descanso\n• Celebrar una ocasión especial en un entorno calmado\n\n**Zonas incluidas**\n• Espalda, cuello y hombros\n• Brazos y manos\n• Piernas y pies\n• Zona lumbar\n\n**¿Cómo se siente?**\n• Relajante, cálido y sin prisa\n• Presión cómoda, siempre ajustada a ti\n• Una sensación compartida de calma y ligereza\n\n**Nota importante:** Es una experiencia de masaje y bienestar para la relajación. La presión y el ritmo se adaptan siempre a cada persona.",
      benefits: [
        "Calma y descanso compartidos",
        "Relajación del cuerpo y la mente",
        "Un ritmo cómodo y sin prisa",
        "Sensación de cercanía y bienestar"
      ],
      features: ["Para dos", "Relajante", "Bienestar"]
    },
    'relax': {
      name: "Masaje Relajante – Experiencia Spa",
      shortDesc: "Experiencia sensorial exclusiva diseñada para desconectar del ritmo diario y sumergirse en un estado profundo de calma y bienestar.",
      longDesc: "El masaje relajante es una experiencia sensorial exclusiva diseñada para desconectar del ritmo diario y sumergirse en un estado profundo de calma y bienestar. A través de movimientos suaves y envolventes, el cuerpo y la mente encuentran un equilibrio natural y una sensación de descanso absoluto.\n\n**¿Cómo funciona?**\n• Movimientos lentos, fluidos y armoniosos que invitan a una relajación profunda\n• Presión suave a media, cuidadosamente adaptada para ofrecer máximo confort\n• Trabajo global del cuerpo, creando una experiencia continua y envolvente\n\n**¿Para qué se recomienda?**\n• Soltar el estrés y la tensión del día a día\n• Invitar a una relajación profunda del cuerpo y la mente\n• Una sensación de calor, ligereza y calma\n• Descanso, tranquilidad y bienestar integral\n\n**Zonas que se trabajan**\n• Espalda, cuello y hombros\n• Brazos y manos\n• Piernas y pies\n• Zona lumbar\n\n**¿Cómo se siente?**\n• Profundamente relajante y reconfortante\n• Sensación de ligereza y armonía\n• Presión delicada y placentera\n\n**Nota importante:** El masaje relajante es una experiencia de bienestar para el descanso y el cuidado. Ofrece un momento de desconexión y bienestar exclusivo.",
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
      shortDesc: "Un masaje profundo y armonizador, en el que el cuerpo se trabaja con la presión controlada y distribuida de los pies del masajista.",
      longDesc: "El masaje corporal con pies es una experiencia de bienestar profunda y armonizadora, en la que el cuerpo se trabaja con la presión controlada y distribuida de los pies del masajista. Esta técnica ancestral permite una conexión más amplia con el cuerpo y una sensación de calma intensa, ligereza y renovación.\n\nGracias a la distribución uniforme del peso y la presión moderada, el masaje se siente envolvente e invita a una relajación profunda y a una sensación de ligereza.\n\n**¿Cómo funciona?**\n• Presión moderada y constante aplicada con los pies, de forma controlada y cómoda\n• Presión distribuida que cubre zonas amplias de manera uniforme\n• Movimientos lentos, rítmicos y fluidos que invitan a un estado profundo de relajación\n• Presión adaptada al confort de cada persona\n\n**¿Para qué se recomienda?**\n• Suavizar tensiones físicas y mentales profundas\n• Invitar a la relajación del cuerpo y la mente\n• Una sensación de calor, ligereza y fluidez\n• Calma, estabilidad y bienestar integral\n\n**Zonas que se trabajan**\n• Espalda completa\n• Brazos y manos\n• Piernas y pies\n• Zona lumbar\n• Rostro (opcional, bajo petición)\n\n**¿Cómo se siente?**\n• Profundamente calmante y envolvente\n• Sensación de ligereza física y mental\n• Presión firme pero agradable\n• Ligereza, fluidez y equilibrio\n\n**Nota importante:** Este masaje es una experiencia de bienestar de relajación, equilibrio y bienestar general. La presión es moderada y siempre se adapta a tu confort.",
      benefits: [
        "Relajación profunda del cuerpo y la mente",
        "Reducción del estrés y la tensión acumulada",
        "Sensación de calor, ligereza y energía",
        "Sensación de renovación y bienestar",
        "Mayor conexión corporal y estado de serenidad"
      ],
      features: ["Técnica descalzo", "Presión profunda", "Experiencia única"]
    },
    'corporate': {
      name: "Bienestar Corporativo",
      shortDesc: "Programas exclusivos de bienestar para hoteles, empresas y organizaciones. Tarjetas regalo y paquetes especiales para sus empleados y clientes.",
      longDesc: "Eleve los beneficios de sus empleados con nuestro Programa de Bienestar Corporativo. Colaboramos con hoteles, empresas y organizaciones para ofrecer experiencias de bienestar exclusivas que aumentan la satisfacción de los empleados, reducen el estrés y promueven un equilibrio saludable entre trabajo y vida personal.\n\n**Lo Que Ofrecemos**\n• Programas de tarjetas regalo personalizadas para recompensas e incentivos de empleados\n• Tarifas corporativas especiales para compras al por mayor\n• Tarjetas regalo personalizadas para huéspedes de hotel o clientes\n• Opciones de canje flexibles para todos nuestros servicios de masaje\n• Eventos de bienestar corporativo en su ubicación\n\n**Perfecto Para**\n• Hoteles que buscan ofrecer experiencias spa premium a sus huéspedes\n• Empresas que desean recompensar y motivar a sus empleados\n• Departamentos de RRHH que buscan beneficios de bienestar\n• Organizadores de eventos que necesitan experiencias de regalo únicas\n• Programas de fidelización y agradecimiento a clientes\n\n**Cómo Funciona**\n• Contáctenos para discutir sus necesidades específicas\n• Creamos una propuesta personalizada para su organización\n• Elija entre tarjetas regalo, paquetes o servicios en su ubicación\n• Disfrute de precios corporativos preferenciales\n• Facturación y administración sencillas\n\n**¿Por Qué Elegir Lavin?**\n• Experiencia de bienestar premium en el corazón de Barcelona\n• Masajistas profesionales\n• Horarios y servicios flexibles\n• Gestión dedicada de cuentas corporativas\n• Paquetes personalizables para cualquier presupuesto",
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
    'reserve-room': {
      name: "Reservar Sala",
      shortDesc: "Si eres masajista, tienes experiencia y buscas una sala para atender a tus clientes, ponte en contacto con nosotros y te contactaremos.",
      longDesc: "Si eres masajista, tienes experiencia y buscas una sala para atender a tus clientes, ponte en contacto con nosotros y te contactaremos.",
      benefits: [
        "Salas profesionales de masaje",
        "Opciones de reserva flexibles",
        "Ubicación céntrica en Barcelona",
        "Apoyo para masajistas independientes"
      ],
      features: ["Para masajistas", "Alquiler de sala", "Contáctanos"],
      contactUs: "Contáctanos para reservar"
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
      therapist: "Masajista preferido",
      therapistPlaceholder: "Selecciona un masajista",
      noPreference: "Sin preferencia / Aleatorio",
      viewTherapists: "Ver nuestro equipo de masaje",
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
      shortDesc: "Un massatge ferm que treballa les capes més profundes dels músculs per a una sensació de confort i benestar.",
      longDesc: "El massatge de teixit profund és un massatge ferm que treballa les capes més profundes dels músculs. La pressió lenta i constant ajuda a sentir-te més còmode i en calma, especialment a l'esquena, el coll, les espatlles i les cames.\n\n**Com funciona?**\n• El massatgista aplica pressió lenta i ferma\n• Usa mans, dits, artells, avantbraços o colzes\n• Els moviments segueixen els músculs per suavitzar les zones que es senten tenses\n\n**Per a què s'usa?**\n• Tensió muscular del dia a dia\n• Sensació de pesadesa després d'una jornada llarga\n• Confort després de passar temps en la mateixa postura\n• Una relaxació més profunda i una sensació de benestar\n\n**Com es sent?**\n• Pot sentir-se intens, i sempre ha de resultar còmode\n• És habitual notar un lleuger cansament després\n• És important avisar el massatgista si la pressió és excessiva\n\n**Nota important:** Aquest massatge s'ofereix per a la relaxació, el confort i el benestar. La pressió s'adapta sempre a tu.",
      benefits: [
        "Suavitza la tensió muscular del dia a dia",
        "Sensació de calor i lleugeresa",
        "Ajuda a relaxar el cos",
        "Una sensació més còmoda i solta",
        "Una sensació més profunda de benestar"
      ],
      features: ["Pressió ferma", "Confort muscular", "Relaxació profunda"]
    },
    'sports': {
      name: "Massatge Esportiu",
      shortDesc: "Un massatge dinàmic per a persones actives, amb pressió més ferma i un ritme més viu, per a confort, frescor i benestar.",
      longDesc: "El massatge esportiu és un massatge per a persones a qui els agrada moure's. Utilitza una pressió més ferma i un ritme més viu que el massatge de relaxació, perquè el cos es senti fresc, còmode i en calma.\n\n**Com funciona?**\n• El massatgista aplica una pressió més ferma\n• Els moviments ràpids i dinàmics aporten una sensació d'energia\n• El massatge segueix les zones que més utilitzes en la teva activitat\n\n**Per a què s'usa?**\n• Sentir-te preparat i còmode abans de l'activitat\n• Desconnectar després de l'exercici\n• Suavitzar la sensació de músculs cansats i tensos\n• Gaudir d'una sensació més fresca i lleugera\n\n**Com es sent?**\n• Intens i energitzant\n• Pressió ferma i ritme més ràpid\n• Efectiu i còmode, mai dolorós\n\n**Nota important:** És un massatge de benestar per a persones actives. El ritme i la pressió s'adapten al teu confort, abans o després de l'activitat.",
      benefits: [
        "Una sensació més fresca i lleugera",
        "Un cos més flexible i còmode",
        "Calma després de l'activitat",
        "Relaxació i benestar"
      ],
      features: ["Vida activa", "Ritme ferm", "Sensació fresca"]
    },
    'medical': {
      name: "Experiència de massatge relaxant en parella",
      shortDesc: "Un massatge relaxant compartit per a dues persones, per desconnectar junts i gaudir de calma, confort i benestar.",
      longDesc: "El massatge relaxant en parella és una experiència de benestar compartida. Un al costat de l'altre, cada persona rep un massatge suau i sense pressa, centrat en el descans, el confort i un moment tranquil en comú.\n\n**Com funciona?**\n• Dues persones gaudeixen d'un massatge relaxant al mateix temps\n• Pressió suau a mitjana, adaptada al confort de cadascú\n• Moviments lents i envoltants que conviden a la calma\n\n**Per a què s'usa?**\n• Desconnectar junts després d'un dia intens\n• Compartir un moment tranquil de cura i benestar\n• Suavitzar la tensió del dia a dia i convidar al descans\n• Celebrar una ocasió especial en un entorn calmat\n\n**Zones incloses**\n• Esquena, coll i espatlles\n• Braços i mans\n• Cames i peus\n• Zona lumbar\n\n**Com es sent?**\n• Relaxant, càlid i sense pressa\n• Pressió còmoda, sempre ajustada a tu\n• Una sensació compartida de calma i lleugeresa\n\n**Nota important:** És una experiència de massatge i benestar per a la relaxació. La pressió i el ritme s'adapten sempre a cada persona.",
      benefits: [
        "Calma i descans compartits",
        "Relaxació del cos i la ment",
        "Un ritme còmode i sense pressa",
        "Sensació de proximitat i benestar"
      ],
      features: ["Per a dues persones", "Relaxant", "Benestar"]
    },
    'relax': {
      name: "Massatge Relaxant – Experiència Spa",
      shortDesc: "Experiència sensorial exclusiva dissenyada per desconnectar del ritme diari i submergir-se en un estat profund de calma i benestar.",
      longDesc: "El massatge relaxant és una experiència sensorial exclusiva dissenyada per desconnectar del ritme diari i submergir-se en un estat profund de calma i benestar. A través de moviments suaus i envoltants, el cos i la ment troben un equilibri natural i una sensació de descans absolut.\n\n**Com funciona?**\n• Moviments lents, fluids i harmoniosos que conviden a una relaxació profunda\n• Pressió suau a mitjana, curosament adaptada per oferir màxim confort\n• Treball global del cos, creant una experiència contínua i envoltant\n\n**Per a què es recomana?**\n• Deixar anar l'estrès i la tensió del dia a dia\n• Convidar a una relaxació profunda del cos i la ment\n• Una sensació de calor, lleugeresa i calma\n• Descans, tranquil·litat i benestar integral\n\n**Zones que es treballen**\n• Esquena, coll i espatlles\n• Braços i mans\n• Cames i peus\n• Zona lumbar\n\n**Com es sent?**\n• Profundament relaxant i reconfortant\n• Sensació de lleugeresa i harmonia\n• Pressió delicada i plaent\n\n**Nota important:** El massatge relaxant és una experiència de benestar per al descans i la cura. Ofereix un moment de desconnexió i benestar exclusiu.",
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
      shortDesc: "Un massatge profund i harmonitzador, en el qual el cos es treballa amb la pressió controlada i distribuïda dels peus del massatgista.",
      longDesc: "El massatge corporal amb peus és una experiència de benestar profunda i harmonitzadora, en la qual el cos es treballa amb la pressió controlada i distribuïda dels peus del massatgista. Aquesta tècnica ancestral permet una connexió més àmplia amb el cos i una sensació de calma intensa, lleugeresa i renovació.\n\nGràcies a la distribució uniforme del pes i la pressió moderada, el massatge es sent envoltant i convida a una relaxació profunda i a una sensació de lleugeresa.\n\n**Com funciona?**\n• Pressió moderada i constant aplicada amb els peus, de forma controlada i còmoda\n• Pressió distribuïda que cobreix zones àmplies de manera uniforme\n• Moviments lents, rítmics i fluids que conviden a un estat profund de relaxació\n• Pressió adaptada al confort de cada persona\n\n**Per a què es recomana?**\n• Suavitzar tensions físiques i mentals profundes\n• Convidar a la relaxació del cos i la ment\n• Una sensació de calor, lleugeresa i fluïdesa\n• Calma, estabilitat i benestar integral\n\n**Zones que es treballen**\n• Esquena completa\n• Braços i mans\n• Cames i peus\n• Zona lumbar\n• Rostre (opcional, sota petició)\n\n**Com es sent?**\n• Profundament calmant i envoltant\n• Sensació de lleugeresa física i mental\n• Pressió ferma però agradable\n• Lleugeresa, fluïdesa i equilibri\n\n**Nota important:** Aquest massatge és una experiència de benestar de relaxació, equilibri i benestar general. La pressió és moderada i sempre s'adapta al teu confort.",
      benefits: [
        "Relaxació profunda del cos i la ment",
        "Reducció de l'estrès i la tensió acumulada",
        "Sensació de calor, lleugeresa i energia",
        "Sensació de renovació i benestar",
        "Major connexió corporal i estat de serenitat"
      ],
      features: ["Tècnica descalç", "Pressió profunda", "Experiència única"]
    },
    'corporate': {
      name: "Benestar Corporatiu",
      shortDesc: "Programes exclusius de benestar per a hotels, empreses i organitzacions. Targetes regal i paquets especials per als seus empleats i clients.",
      longDesc: "Elevi els beneficis dels seus empleats amb el nostre Programa de Benestar Corporatiu. Col·laborem amb hotels, empreses i organitzacions per oferir experiències de benestar exclusives que augmenten la satisfacció dels empleats, redueixen l'estrès i promouen un equilibri saludable entre treball i vida personal.\n\n**El Que Oferim**\n• Programes de targetes regal personalitzades per a recompenses i incentius d'empleats\n• Tarifes corporatives especials per a compres a l'engròs\n• Targetes regal personalitzades per a hostes d'hotel o clients\n• Opcions de bescanvi flexibles per a tots els nostres serveis de massatge\n• Esdeveniments de benestar corporatiu a la seva ubicació\n\n**Perfecte Per A**\n• Hotels que busquen oferir experiències spa premium als seus hostes\n• Empreses que desitgen recompensar i motivar els seus empleats\n• Departaments de RRHH que busquen beneficis de benestar\n• Organitzadors d'esdeveniments que necessiten experiències de regal úniques\n• Programes de fidelització i agraïment a clients\n\n**Com Funciona**\n• Contacteu-nos per discutir les seves necessitats específiques\n• Creem una proposta personalitzada per a la seva organització\n• Triï entre targetes regal, paquets o serveis a la seva ubicació\n• Gaudeixi de preus corporatius preferencials\n• Facturació i administració senzilles\n\n**Per Què Triar Lavin?**\n• Experiència de benestar premium al cor de Barcelona\n• Massatgistes professionals\n• Horaris i serveis flexibles\n• Gestió dedicada de comptes corporatius\n• Paquets personalitzables per a qualsevol pressupost",
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
    'reserve-room': {
      name: "Reservar Sala",
      shortDesc: "Si ets massatgista, tens experiència i busques una sala per atendre els teus clients, posa't en contacte amb nosaltres i et contactarem.",
      longDesc: "Si ets massatgista, tens experiència i busques una sala per atendre els teus clients, posa't en contacte amb nosaltres i et contactarem.",
      benefits: [
        "Sales professionals de massatge",
        "Opcions de reserva flexibles",
        "Ubicació cèntrica a Barcelona",
        "Suport per a massatgistes independents"
      ],
      features: ["Per a massatgistes", "Lloguer de sala", "Contacteu-nos"],
      contactUs: "Contacteu-nos per reservar"
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
      therapist: "Massatgista preferit",
      therapistPlaceholder: "Selecciona un massatgista",
      noPreference: "Sense preferència / Aleatori",
      viewTherapists: "Veure el nostre equip de massatge",
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



