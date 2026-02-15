/**
 * Erotic Brand - Language Context
 * 
 * Provides translations specific to the erotic brand UI.
 * Based on Erotic_Project_Sample translations.
 */

import { createContext, useContext, useState } from 'react'

const EroticLanguageContext = createContext()

export const eroticTranslations = {
  en: {
    // Age Gate
    ageGate: {
      warning: "Restricted Access — Adults Only",
      content: "This website contains explicit adult content including erotic massage services, BDSM, and domination experiences. Access is strictly limited to persons of legal age.",
      question: "I confirm that I am 18 years of age or older",
      enter: "Enter — I am over 18",
      exit: "Exit this website",
      legal: "In accordance with Spanish Law 34/2002 (LSSI-CE) and Organic Law 3/2018 (LOPDGDD), by clicking 'Enter' you declare under your own responsibility that you are of legal age (18+) in Spain, that you consent to access adult content, and that you accept our Terms of Service and Privacy Policy. Access by minors is strictly prohibited."
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
    },
    // Services
    services: {
      overline: "Our Sessions",
      title: "Domination Experiences",
      subtitle: "Each session is meticulously crafted to guide you through a transformative journey of surrender, trust, and release.",
      bookThis: "Request This Session",
      customCta: "Seeking a unique experience?",
      customBtn: "Request Custom Session",
    },
    // About
    about: {
      overline: "The Dungeon",
      title: "Where Power Becomes Art",
      text1: "Hidden in the shadows of Barcelona's Gothic Quarter, our exclusive dungeon was created for those who seek the extraordinary.",
      text2: "Since 2015, we have cultivated a sanctuary where experienced Mistresses guide willing souls through journeys of surrender.",
      text3: "Every detail of our space speaks to the aesthetic of refined darkness—velvet drapes, leather furnishings, dim candlelight, and the whisper of chains.",
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
      subtitle: "Request your session of surrender. Our Mistress will review and respond within 24 hours.",
      description: "Request your session of surrender. Our Mistress will review and respond within 24 hours.",
      location: "Location",
      phone: "Phone",
      hours: "Hours",
      hoursValue: "By appointment only\nDiscretion guaranteed",
      email: "Email",
      followUs: "Follow us:",
      orFillForm: "or fill the form below",
      cancel: "Cancel",
      submit: "Submit Request",
      success: "Request Received",
      successMessage: "Your confession has been received. Our Mistress will contact you within 24 hours to arrange your session.",
      close: "Close",
      fields: {
        name: "Full Name",
        phone: "Phone Number",
        service: "Session",
        date: "Preferred Date",
        time: "Preferred Time",
        duration: "Duration"
      },
      placeholders: {
        name: "Your name",
        phone: "+34 XXX XXX XXX",
        service: "Select a session"
      },
      errors: {
        nameRequired: "Your name is required",
        phoneRequired: "Phone number is required",
        serviceRequired: "Please select a session",
        dateRequired: "Date is required",
        timeRequired: "Time is required"
      },
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
      content: "Este sitio web contiene contenido explícito para adultos, incluyendo servicios de masaje erótico, BDSM y experiencias de dominación.",
      question: "Confirmo que tengo 18 años de edad o más",
      enter: "Entrar — Soy mayor de 18",
      exit: "Salir de este sitio",
      legal: "De conformidad con la Ley 34/2002 (LSSI-CE) y la Ley Orgánica 3/2018 (LOPDGDD), al hacer clic en 'Entrar' declaras bajo tu propia responsabilidad que eres mayor de edad (18+) en España."
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
    },
    // Services
    services: {
      overline: "Nuestras Sesiones",
      title: "Experiencias de Dominación",
      subtitle: "Cada sesión está meticulosamente diseñada para guiarte a través de un viaje transformador de entrega, confianza y liberación.",
      bookThis: "Solicitar Esta Sesión",
      customCta: "¿Buscas una experiencia única?",
      customBtn: "Solicitar Sesión Personalizada",
    },
    // About
    about: {
      overline: "El Calabozo",
      title: "Donde el Poder se Convierte en Arte",
      text1: "Oculto en las sombras del Barrio Gótico de Barcelona, nuestro exclusivo calabozo fue creado para quienes buscan lo extraordinario.",
      text2: "Desde 2015, hemos cultivado un santuario donde Amas experimentadas guían a almas dispuestas a través de viajes de entrega.",
      text3: "Cada detalle de nuestro espacio habla de la estética de la oscuridad refinada—cortinas de terciopelo, mobiliario de cuero, luz de velas tenue.",
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
        { title: "Aftercare Excelente", description: "El cuidado posterior suave asegura que regreses a la realidad con gracia." }
      ],
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
      subtitle: "Solicita tu sesión de entrega. Nuestra Ama revisará y responderá en 24 horas.",
      description: "Solicita tu sesión de entrega. Nuestra Ama revisará y responderá en 24 horas.",
      location: "Ubicación",
      phone: "Teléfono",
      hours: "Horario",
      hoursValue: "Solo con cita previa\nDiscreción garantizada",
      email: "Correo",
      followUs: "Síguenos:",
      orFillForm: "o completa el formulario",
      cancel: "Cancelar",
      submit: "Enviar Solicitud",
      success: "Solicitud Recibida",
      successMessage: "Tu confesión ha sido recibida. Nuestra Ama te contactará en 24 horas para organizar tu sesión.",
      close: "Cerrar",
      fields: {
        name: "Nombre Completo",
        phone: "Número de Teléfono",
        service: "Sesión",
        date: "Fecha Preferida",
        time: "Hora Preferida",
        duration: "Duración"
      },
      placeholders: {
        name: "Tu nombre",
        phone: "+34 XXX XXX XXX",
        service: "Selecciona una sesión"
      },
      errors: {
        nameRequired: "Tu nombre es requerido",
        phoneRequired: "El número de teléfono es requerido",
        serviceRequired: "Por favor selecciona una sesión",
        dateRequired: "La fecha es requerida",
        timeRequired: "La hora es requerida"
      },
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
        messagePlaceholder: "Cuéntanos sobre tus deseos, límites y cualquier experiencia...",
        submit: "Enviar Solicitud"
      }
    },
    // Footer
    footer: {
      tagline: "Donde el poder se convierte en arte. Experimenta la mejor dominación en Barcelona.",
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
      content: "Aquest lloc web conté contingut explícit per a adults, incloent serveis de massatge eròtic, BDSM i experiències de dominació.",
      question: "Confirmo que tinc 18 anys d'edat o més",
      enter: "Entrar — Sóc major de 18",
      exit: "Sortir d'aquest lloc",
      legal: "De conformitat amb la Llei 34/2002 (LSSI-CE) i la Llei Orgànica 3/2018 (LOPDGDD), en fer clic a 'Entrar' declares sota la teva pròpia responsabilitat que ets major d'edat (18+) a Espanya."
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
    },
    // Services
    services: {
      overline: "Les Nostres Sessions",
      title: "Experiències de Dominació",
      subtitle: "Cada sessió està meticulosament dissenyada per guiar-te a través d'un viatge transformador de lliurament, confiança i alliberament.",
      bookThis: "Sol·licitar Aquesta Sessió",
      customCta: "Busques una experiència única?",
      customBtn: "Sol·licitar Sessió Personalitzada",
    },
    // About
    about: {
      overline: "La Masmorra",
      title: "On el Poder es Converteix en Art",
      text1: "Amagat a les ombres del Barri Gòtic de Barcelona, la nostra exclusiva masmorra va ser creada per a qui busquen l'extraordinari.",
      text2: "Des de 2015, hem cultivat un santuari on Ames experimentades guien ànimes disposades a través de viatges de lliurament.",
      text3: "Cada detall del nostre espai parla de l'estètica de la foscor refinada—cortines de vellut, mobiliari de cuir, llum d'espelmes tènue.",
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
        { title: "Aftercare Excel·lent", description: "La cura posterior suau assegura que tornis a la realitat amb gràcia." }
      ],
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
      subtitle: "Sol·licita la teva sessió de lliurament. La nostra Ama revisarà i respondrà en 24 hores.",
      description: "Sol·licita la teva sessió de lliurament. La nostra Ama revisarà i respondrà en 24 hores.",
      location: "Ubicació",
      phone: "Telèfon",
      hours: "Horari",
      hoursValue: "Només amb cita prèvia\nDiscreció garantida",
      email: "Correu",
      followUs: "Segueix-nos:",
      orFillForm: "o omple el formulari",
      cancel: "Cancel·lar",
      submit: "Enviar Sol·licitud",
      success: "Sol·licitud Rebuda",
      successMessage: "La teva confessió ha estat rebuda. La nostra Ama et contactarà en 24 hores per organitzar la teva sessió.",
      close: "Tancar",
      fields: {
        name: "Nom Complet",
        phone: "Número de Telèfon",
        service: "Sessió",
        date: "Data Preferida",
        time: "Hora Preferida",
        duration: "Durada"
      },
      placeholders: {
        name: "El teu nom",
        phone: "+34 XXX XXX XXX",
        service: "Selecciona una sessió"
      },
      errors: {
        nameRequired: "El teu nom és requerit",
        phoneRequired: "El número de telèfon és requerit",
        serviceRequired: "Si us plau selecciona una sessió",
        dateRequired: "La data és requerida",
        timeRequired: "L'hora és requerida"
      },
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
        messagePlaceholder: "Explica'ns sobre els teus desitjos, límits i qualsevol experiència...",
        submit: "Enviar Sol·licitud"
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

export const EroticLanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')

  const t = eroticTranslations[language]

  const changeLanguage = (lang) => {
    setLanguage(lang)
  }

  return (
    <EroticLanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </EroticLanguageContext.Provider>
  )
}

export const useEroticLanguage = () => {
  const context = useContext(EroticLanguageContext)
  if (!context) {
    throw new Error('useEroticLanguage must be used within an EroticLanguageProvider')
  }
  return context
}

export default EroticLanguageContext
