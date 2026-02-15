import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const translations = {
  en: {
    // Age Gate
    ageGate: {
      warning: "Restricted Access — Adults Only",
      content: "This website contains explicit adult content including erotic massage services, BDSM, and domination experiences. Access is strictly limited to persons of legal age.",
      question: "I confirm that I am 18 years of age or older",
      enter: "Enter — I am over 18",
      exit: "Exit this website",
      legal: "In accordance with Spanish Law 34/2002 (LSSI-CE) and Organic Law 3/2018 (LOPDGDD), by clicking 'Enter' you declare under your own responsibility that you are of legal age (18+) in Spain, that you consent to access adult content, and that you accept our Terms of Service and Privacy Policy. Access by minors is strictly prohibited. The operator reserves the right to verify age and deny access. This declaration constitutes a binding legal statement.",
      termsLink: "Terms & Conditions",
      privacyLink: "Privacy Policy"
    },
    // Navbar
    nav: {
      services: "Sessions",
      about: "The Dungeon",
      experience: "Experience",
      testimonials: "Confessions",
      bookNow: "Submit",
      location: "Barcelona, Spain",
    },
    // Hero
    hero: {
      overline: "Surrender & Submit",
      titleLine1: "The Art of",
      titleLine2: "Domination",
      description: "Enter our sanctuary of power and surrender in the heart of Barcelona. Where your deepest desires meet exquisite control.",
      cta1: "Request Your Session",
      cta2: "Explore Sessions",
      scroll: "Scroll to discover",
    },
    // Services
    services: {
      overline: "Our Sessions",
      title: "Domination Experiences",
      subtitle: "Each session is meticulously crafted to guide you through a transformative journey of surrender, trust, and release.",
      bookThis: "Request This Session",
      customCta: "Seeking a unique experience?",
      customBtn: "Request Custom Session",
      items: [
        {
          name: "Surrender Ritual",
          description: "A powerful introduction to domination massage where control and release intertwine for deep physical and mental surrender.",
          features: ["Sensory control", "Guided surrender", "Deep release"]
        },
        {
          name: "Discipline & Devotion",
          description: "An intense session combining firm pressure with commanding presence for those who seek to submit completely.",
          features: ["Firm guidance", "Boundary exploration", "Total submission"]
        },
        {
          name: "Velvet Chains",
          description: "A luxurious experience of restrained pleasure where gentle bondage meets skilled therapeutic touch.",
          features: ["Silk restraints", "Teasing touch", "Controlled bliss"]
        },
        {
          name: "Dark Tantra",
          description: "An erotic fusion of tantric energy work and domination techniques for profound spiritual and physical awakening.",
          features: ["Energy control", "Tantric breath", "Power exchange"]
        },
        {
          name: "The Confession",
          description: "Our signature experience—a journey into your deepest fantasies guided by an experienced dominatrix.",
          features: ["Full surrender", "Fantasy exploration", "Cathartic release"]
        },
        {
          name: "Mistress's Choice",
          description: "Surrender all control. Your session is entirely at the discretion of your Mistress. Trust completely.",
          features: ["Surprise elements", "Complete trust", "Unknown pleasures"]
        }
      ]
    },
    // About
    about: {
      overline: "The Dungeon",
      title: "Where Power Becomes Art",
      text1: "Hidden in the shadows of Barcelona's Gothic Quarter, our exclusive dungeon was created for those who seek the extraordinary. This is not merely a space—it is a realm where power dynamics are explored with sophistication and care.",
      text2: "Since 2015, we have cultivated a sanctuary where experienced Mistresses guide willing souls through journeys of surrender. Our practitioners are masters of the ancient arts of domination, combining psychological expertise with therapeutic touch.",
      text3: "Every detail of our space speaks to the aesthetic of refined darkness—velvet drapes, leather furnishings, dim candlelight, and the whisper of chains. Here, your fantasies are not just accepted—they are elevated.",
      founderName: "Mistress Victoria",
      founderTitle: "Head Dominatrix & Founder",
      stats: {
        years: "Years Mastery",
        clients: "Devoted Submissives",
        therapists: "Expert Mistresses",
        satisfaction: "Satisfaction Rate"
      }
    },
    // Experience
    experience: {
      overline: "The Experience",
      title: "Beyond Ordinary Pleasure",
      subtitle: "From the moment you enter, every detail is designed to transport you into a world of exquisite surrender.",
      features: [
        { title: "Absolute Discretion", description: "Your privacy is sacred. Complete confidentiality in every interaction." },
        { title: "Personalized Rituals", description: "Each session is crafted to your limits, desires, and deepest fantasies." },
        { title: "Premium Equipment", description: "Only the finest restraints, implements, and accessories of the highest quality." },
        { title: "Aftercare Excellence", description: "Gentle aftercare ensures you return to reality with grace and care." }
      ],
      amenitiesTitle: "Dungeon Amenities",
      amenities: [
        "Private themed chambers",
        "Luxury shower facilities",
        "Fine wines & refreshments",
        "Premium restraint collection",
        "Meditation recovery room",
        "Silk robes provided"
      ]
    },
    // Testimonials
    testimonials: {
      overline: "Confessions",
      title: "Words from the Devoted",
      experience: "Experience"
    },
    // Booking
    booking: {
      overline: "Submit Your Request",
      title: "Begin Your Surrender",
      description: "Request your session of surrender. Our Mistress will review and respond within 24 hours.",
      location: "Location",
      phone: "Phone",
      hours: "Hours",
      hoursValue: "By appointment only\nDiscretion guaranteed",
      email: "Email",
      followUs: "Follow us:",
      form: {
        name: "Full Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "your@email.com",
        phone: "Phone",
        phonePlaceholder: "+34 XXX XXX XXX",
        service: "Session",
        servicePlaceholder: "Select a session",
        date: "Preferred Date",
        time: "Preferred Time",
        timePlaceholder: "Select time",
        message: "Your Confession",
        messagePlaceholder: "Tell us about your desires, limits, and any experience you may have...",
        submit: "Submit Request"
      },
      success: {
        title: "Request Received",
        message: "Your confession has been received. Your Mistress will contact you shortly to discuss your session."
      }
    },
    // Footer
    footer: {
      tagline: "Where power becomes art. Experience the finest domination in the heart of Barcelona.",
      newsletter: "Join our circle of devotion",
      servicesTitle: "Sessions",
      companyTitle: "The Dungeon",
      supportTitle: "Information",
      company: ["About Us", "Our Mistresses", "The Space", "Gift Experiences"],
      support: ["FAQs", "Discretion Policy", "Privacy Policy", "Terms of Service"],
      copyright: "All rights reserved.",
      madeWith: "Crafted with",
      inBarcelona: "in Barcelona"
    }
  },
  es: {
    // Age Gate
    ageGate: {
      warning: "Acceso Restringido — Solo Adultos",
      content: "Este sitio web contiene contenido explícito para adultos, incluyendo servicios de masaje erótico, BDSM y experiencias de dominación. El acceso está estrictamente limitado a personas mayores de edad.",
      question: "Confirmo que tengo 18 años de edad o más",
      enter: "Entrar — Soy mayor de 18",
      exit: "Salir de este sitio",
      legal: "De conformidad con la Ley 34/2002 (LSSI-CE) y la Ley Orgánica 3/2018 (LOPDGDD), al hacer clic en 'Entrar' declaras bajo tu propia responsabilidad que eres mayor de edad (18+) en España, que consientes acceder a contenido para adultos, y que aceptas nuestros Términos de Servicio y Política de Privacidad. El acceso de menores está estrictamente prohibido. El operador se reserva el derecho de verificar la edad y denegar el acceso. Esta declaración constituye una manifestación legal vinculante.",
      termsLink: "Términos y Condiciones",
      privacyLink: "Política de Privacidad"
    },
    // Navbar
    nav: {
      services: "Sesiones",
      about: "El Calabozo",
      experience: "Experiencia",
      testimonials: "Confesiones",
      bookNow: "Someterse",
      location: "Barcelona, España",
    },
    // Hero
    hero: {
      overline: "Entrega & Sumisión",
      titleLine1: "El Arte de la",
      titleLine2: "Dominación",
      description: "Entra en nuestro santuario de poder y entrega en el corazón de Barcelona. Donde tus deseos más profundos encuentran el control exquisito.",
      cta1: "Solicita Tu Sesión",
      cta2: "Explorar Sesiones",
      scroll: "Desplaza para descubrir",
    },
    // Services
    services: {
      overline: "Nuestras Sesiones",
      title: "Experiencias de Dominación",
      subtitle: "Cada sesión está meticulosamente diseñada para guiarte a través de un viaje transformador de entrega, confianza y liberación.",
      bookThis: "Solicitar Esta Sesión",
      customCta: "¿Buscas una experiencia única?",
      customBtn: "Solicitar Sesión Personalizada",
      items: [
        {
          name: "Ritual de Entrega",
          description: "Una poderosa introducción al masaje de dominación donde el control y la liberación se entrelazan para una profunda entrega física y mental.",
          features: ["Control sensorial", "Entrega guiada", "Liberación profunda"]
        },
        {
          name: "Disciplina y Devoción",
          description: "Una sesión intensa que combina presión firme con presencia imponente para quienes buscan someterse completamente.",
          features: ["Guía firme", "Exploración de límites", "Sumisión total"]
        },
        {
          name: "Cadenas de Terciopelo",
          description: "Una experiencia lujosa de placer restringido donde el bondage suave se encuentra con el toque terapéutico experto.",
          features: ["Restricciones de seda", "Toque provocador", "Éxtasis controlado"]
        },
        {
          name: "Tantra Oscuro",
          description: "Una fusión erótica de trabajo energético tántrico y técnicas de dominación para un profundo despertar espiritual y físico.",
          features: ["Control de energía", "Respiración tántrica", "Intercambio de poder"]
        },
        {
          name: "La Confesión",
          description: "Nuestra experiencia insignia—un viaje a tus fantasías más profundas guiado por una dominatrix experimentada.",
          features: ["Entrega total", "Exploración de fantasías", "Liberación catártica"]
        },
        {
          name: "Elección de la Ama",
          description: "Entrega todo el control. Tu sesión queda enteramente a discreción de tu Ama. Confía completamente.",
          features: ["Elementos sorpresa", "Confianza completa", "Placeres desconocidos"]
        }
      ]
    },
    // About
    about: {
      overline: "El Calabozo",
      title: "Donde el Poder se Convierte en Arte",
      text1: "Oculto en las sombras del Barrio Gótico de Barcelona, nuestro exclusivo calabozo fue creado para quienes buscan lo extraordinario. Este no es simplemente un espacio—es un reino donde las dinámicas de poder se exploran con sofisticación y cuidado.",
      text2: "Desde 2015, hemos cultivado un santuario donde Amas experimentadas guían a almas dispuestas a través de viajes de entrega. Nuestras practicantes son maestras de las artes antiguas de la dominación, combinando experiencia psicológica con toque terapéutico.",
      text3: "Cada detalle de nuestro espacio habla de la estética de la oscuridad refinada—cortinas de terciopelo, mobiliario de cuero, luz de velas tenue y el susurro de las cadenas. Aquí, tus fantasías no solo son aceptadas—son elevadas.",
      founderName: "Ama Victoria",
      founderTitle: "Dominatrix Principal y Fundadora",
      stats: {
        years: "Años de Maestría",
        clients: "Sumisos Devotos",
        therapists: "Amas Expertas",
        satisfaction: "Tasa de Satisfacción"
      }
    },
    // Experience
    experience: {
      overline: "La Experiencia",
      title: "Más Allá del Placer Ordinario",
      subtitle: "Desde el momento en que entras, cada detalle está diseñado para transportarte a un mundo de exquisita entrega.",
      features: [
        { title: "Discreción Absoluta", description: "Tu privacidad es sagrada. Confidencialidad completa en cada interacción." },
        { title: "Rituales Personalizados", description: "Cada sesión se adapta a tus límites, deseos y fantasías más profundas." },
        { title: "Equipamiento Premium", description: "Solo las mejores restricciones, implementos y accesorios de la más alta calidad." },
        { title: "Aftercare Excelente", description: "El cuidado posterior suave asegura que regreses a la realidad con gracia y atención." }
      ],
      amenitiesTitle: "Comodidades del Calabozo",
      amenities: [
        "Cámaras temáticas privadas",
        "Duchas de lujo",
        "Vinos finos y refrescos",
        "Colección premium de restricciones",
        "Sala de recuperación meditativa",
        "Batas de seda proporcionadas"
      ]
    },
    // Testimonials
    testimonials: {
      overline: "Confesiones",
      title: "Palabras de los Devotos",
      experience: "Experiencia"
    },
    // Booking
    booking: {
      overline: "Envía Tu Solicitud",
      title: "Comienza Tu Entrega",
      description: "Solicita tu sesión de entrega. Nuestra Ama revisará y responderá en 24 horas.",
      location: "Ubicación",
      phone: "Teléfono",
      hours: "Horario",
      hoursValue: "Solo con cita previa\nDiscreción garantizada",
      email: "Correo",
      followUs: "Síguenos:",
      form: {
        name: "Nombre Completo",
        namePlaceholder: "Tu nombre",
        email: "Correo Electrónico",
        emailPlaceholder: "tu@correo.com",
        phone: "Teléfono",
        phonePlaceholder: "+34 XXX XXX XXX",
        service: "Sesión",
        servicePlaceholder: "Selecciona una sesión",
        date: "Fecha Preferida",
        time: "Hora Preferida",
        timePlaceholder: "Selecciona hora",
        message: "Tu Confesión",
        messagePlaceholder: "Cuéntanos sobre tus deseos, límites y cualquier experiencia que puedas tener...",
        submit: "Enviar Solicitud"
      },
      success: {
        title: "Solicitud Recibida",
        message: "Tu confesión ha sido recibida. Tu Ama te contactará pronto para discutir tu sesión."
      }
    },
    // Footer
    footer: {
      tagline: "Donde el poder se convierte en arte. Experimenta la mejor dominación en el corazón de Barcelona.",
      newsletter: "Únete a nuestro círculo de devoción",
      servicesTitle: "Sesiones",
      companyTitle: "El Calabozo",
      supportTitle: "Información",
      company: ["Sobre Nosotros", "Nuestras Amas", "El Espacio", "Experiencias Regalo"],
      support: ["Preguntas Frecuentes", "Política de Discreción", "Política de Privacidad", "Términos de Servicio"],
      copyright: "Todos los derechos reservados.",
      madeWith: "Creado con",
      inBarcelona: "en Barcelona"
    }
  },
  ca: {
    // Age Gate
    ageGate: {
      warning: "Accés Restringit — Només Adults",
      content: "Aquest lloc web conté contingut explícit per a adults, incloent serveis de massatge eròtic, BDSM i experiències de dominació. L'accés està estrictament limitat a persones majors d'edat.",
      question: "Confirmo que tinc 18 anys d'edat o més",
      enter: "Entrar — Sóc major de 18",
      exit: "Sortir d'aquest lloc",
      legal: "De conformitat amb la Llei 34/2002 (LSSI-CE) i la Llei Orgànica 3/2018 (LOPDGDD), en fer clic a 'Entrar' declares sota la teva pròpia responsabilitat que ets major d'edat (18+) a Espanya, que consents accedir a contingut per a adults, i que acceptes els nostres Termes de Servei i Política de Privacitat. L'accés de menors està estrictament prohibit. L'operador es reserva el dret de verificar l'edat i denegar l'accés. Aquesta declaració constitueix una manifestació legal vinculant.",
      termsLink: "Termes i Condicions",
      privacyLink: "Política de Privacitat"
    },
    // Navbar
    nav: {
      services: "Sessions",
      about: "La Masmorra",
      experience: "Experiència",
      testimonials: "Confessions",
      bookNow: "Sotmetre's",
      location: "Barcelona, Catalunya",
    },
    // Hero
    hero: {
      overline: "Lliurament & Submissió",
      titleLine1: "L'Art de la",
      titleLine2: "Dominació",
      description: "Entra al nostre santuari de poder i lliurament al cor de Barcelona. On els teus desitjos més profunds troben el control exquisit.",
      cta1: "Sol·licita la Teva Sessió",
      cta2: "Explorar Sessions",
      scroll: "Desplaça per descobrir",
    },
    // Services
    services: {
      overline: "Les Nostres Sessions",
      title: "Experiències de Dominació",
      subtitle: "Cada sessió està meticulosament dissenyada per guiar-te a través d'un viatge transformador de lliurament, confiança i alliberament.",
      bookThis: "Sol·licitar Aquesta Sessió",
      customCta: "Busques una experiència única?",
      customBtn: "Sol·licitar Sessió Personalitzada",
      items: [
        {
          name: "Ritual de Lliurament",
          description: "Una poderosa introducció al massatge de dominació on el control i l'alliberament s'entrellacen per a un profund lliurament físic i mental.",
          features: ["Control sensorial", "Lliurament guiat", "Alliberament profund"]
        },
        {
          name: "Disciplina i Devoció",
          description: "Una sessió intensa que combina pressió ferma amb presència imponent per a qui busquen sotmetre's completament.",
          features: ["Guia ferma", "Exploració de límits", "Submissió total"]
        },
        {
          name: "Cadenes de Vellut",
          description: "Una experiència luxosa de plaer restringit on el bondage suau es troba amb el toc terapèutic expert.",
          features: ["Restriccions de seda", "Toc provocador", "Èxtasi controlat"]
        },
        {
          name: "Tantra Fosc",
          description: "Una fusió eròtica de treball energètic tàntric i tècniques de dominació per a un profund despertar espiritual i físic.",
          features: ["Control d'energia", "Respiració tàntrica", "Intercanvi de poder"]
        },
        {
          name: "La Confessió",
          description: "La nostra experiència insígnia—un viatge a les teves fantasies més profundes guiat per una dominatrix experimentada.",
          features: ["Lliurament total", "Exploració de fantasies", "Alliberament catàrtic"]
        },
        {
          name: "Elecció de l'Ama",
          description: "Lliura tot el control. La teva sessió queda enterament a discreció de la teva Ama. Confia completament.",
          features: ["Elements sorpresa", "Confiança completa", "Plaers desconeguts"]
        }
      ]
    },
    // About
    about: {
      overline: "La Masmorra",
      title: "On el Poder es Converteix en Art",
      text1: "Amagat a les ombres del Barri Gòtic de Barcelona, la nostra exclusiva masmorra va ser creada per a qui busquen l'extraordinari. Aquest no és simplement un espai—és un regne on les dinàmiques de poder s'exploren amb sofisticació i cura.",
      text2: "Des de 2015, hem cultivat un santuari on Ames experimentades guien ànimes disposades a través de viatges de lliurament. Les nostres practicants són mestres de les arts antigues de la dominació, combinant experiència psicològica amb toc terapèutic.",
      text3: "Cada detall del nostre espai parla de l'estètica de la foscor refinada—cortines de vellut, mobiliari de cuir, llum d'espelmes tènue i el xiuxiueig de les cadenes. Aquí, les teves fantasies no només són acceptades—són elevades.",
      founderName: "Ama Victoria",
      founderTitle: "Dominatrix Principal i Fundadora",
      stats: {
        years: "Anys de Mestratge",
        clients: "Submissos Devots",
        therapists: "Ames Expertes",
        satisfaction: "Taxa de Satisfacció"
      }
    },
    // Experience
    experience: {
      overline: "L'Experiència",
      title: "Més Enllà del Plaer Ordinari",
      subtitle: "Des del moment en què entres, cada detall està dissenyat per transportar-te a un món de lliurament exquisit.",
      features: [
        { title: "Discreció Absoluta", description: "La teva privacitat és sagrada. Confidencialitat completa en cada interacció." },
        { title: "Rituals Personalitzats", description: "Cada sessió s'adapta als teus límits, desitjos i fantasies més profundes." },
        { title: "Equipament Premium", description: "Només les millors restriccions, implementos i accessoris de la més alta qualitat." },
        { title: "Aftercare Excel·lent", description: "La cura posterior suau assegura que tornis a la realitat amb gràcia i atenció." }
      ],
      amenitiesTitle: "Comoditats de la Masmorra",
      amenities: [
        "Cambres temàtiques privades",
        "Dutxes de luxe",
        "Vins fins i refrescos",
        "Col·lecció premium de restriccions",
        "Sala de recuperació meditativa",
        "Barnussos de seda proporcionats"
      ]
    },
    // Testimonials
    testimonials: {
      overline: "Confessions",
      title: "Paraules dels Devots",
      experience: "Experiència"
    },
    // Booking
    booking: {
      overline: "Envia la Teva Sol·licitud",
      title: "Comença el Teu Lliurament",
      description: "Sol·licita la teva sessió de lliurament. La nostra Ama revisarà i respondrà en 24 hores.",
      location: "Ubicació",
      phone: "Telèfon",
      hours: "Horari",
      hoursValue: "Només amb cita prèvia\nDiscreció garantida",
      email: "Correu",
      followUs: "Segueix-nos:",
      form: {
        name: "Nom Complet",
        namePlaceholder: "El teu nom",
        email: "Correu Electrònic",
        emailPlaceholder: "el.teu@correu.com",
        phone: "Telèfon",
        phonePlaceholder: "+34 XXX XXX XXX",
        service: "Sessió",
        servicePlaceholder: "Selecciona una sessió",
        date: "Data Preferida",
        time: "Hora Preferida",
        timePlaceholder: "Selecciona hora",
        message: "La Teva Confessió",
        messagePlaceholder: "Explica'ns sobre els teus desitjos, límits i qualsevol experiència que puguis tenir...",
        submit: "Enviar Sol·licitud"
      },
      success: {
        title: "Sol·licitud Rebuda",
        message: "La teva confessió ha estat rebuda. La teva Ama et contactarà aviat per parlar de la teva sessió."
      }
    },
    // Footer
    footer: {
      tagline: "On el poder es converteix en art. Experimenta la millor dominació al cor de Barcelona.",
      newsletter: "Uneix-te al nostre cercle de devoció",
      servicesTitle: "Sessions",
      companyTitle: "La Masmorra",
      supportTitle: "Informació",
      company: ["Sobre Nosaltres", "Les Nostres Ames", "L'Espai", "Experiències Regal"],
      support: ["Preguntes Freqüents", "Política de Discreció", "Política de Privacitat", "Termes de Servei"],
      copyright: "Tots els drets reservats.",
      madeWith: "Creat amb",
      inBarcelona: "a Barcelona"
    }
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')

  const t = translations[language]

  const changeLanguage = (lang) => {
    setLanguage(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export default LanguageContext
