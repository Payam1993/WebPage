import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const translations = {
  en: {
    // Navbar
    nav: {
      services: "Services",
      about: "About",
      experience: "Experience",
      testimonials: "Testimonials",
      bookNow: "Book Now",
      location: "Barcelona, Spain",
    },
    // Hero
    hero: {
      overline: "Wellness & Relaxation",
      titleLine1: "The Art of",
      titleLine2: "Confession",
      description: "Surrender to tranquility in the heart of Barcelona. Where ancient healing traditions meet contemporary luxury.",
      cta1: "Reserve Your Experience",
      cta2: "Explore Services",
      scroll: "Scroll to discover",
    },
    // Services
    services: {
      overline: "Our Services",
      title: "Curated Experiences",
      subtitle: "Each treatment is thoughtfully designed to guide you through a transformative journey of relaxation and renewal.",
      bookThis: "Book This Service",
      customCta: "Looking for something special?",
      customBtn: "Request Custom Treatment",
      items: [
        {
          name: "Signature Confession",
          description: "Our signature full-body massage combining Swedish, deep tissue, and aromatherapy techniques for complete relaxation.",
          features: ["Hot stones", "Essential oils", "Scalp massage"]
        },
        {
          name: "Deep Tissue Revival",
          description: "Targeted pressure therapy to release chronic muscle tension and restore natural body alignment.",
          features: ["Muscle release", "Posture correction", "Pain relief"]
        },
        {
          name: "Mediterranean Ritual",
          description: "A luxurious journey inspired by ancient Mediterranean wellness traditions with olive oil and sea salt.",
          features: ["Body scrub", "Warm wrap", "Facial massage"]
        },
        {
          name: "Couples Harmony",
          description: "Share the experience of relaxation with your partner in our exclusive couples suite.",
          features: ["Private suite", "Champagne", "Synchronized massage"]
        },
        {
          name: "Hot Stone Therapy",
          description: "Heated basalt stones melt away tension while promoting deep muscle relaxation and energy flow.",
          features: ["Volcanic stones", "Heat therapy", "Energy balance"]
        },
        {
          name: "Aromatherapy Bliss",
          description: "Custom-blended essential oils paired with gentle Swedish techniques for sensory harmony.",
          features: ["Custom blends", "Mood enhancement", "Gentle touch"]
        }
      ]
    },
    // About
    about: {
      overline: "Our Story",
      title: "Where Healing Becomes Art",
      text1: "Nestled in the vibrant heart of Barcelona, Confession was born from a simple belief: that true wellness transcends the physical. Our sanctuary offers more than massage—it's an invitation to pause, reflect, and reconnect with yourself.",
      text2: "Founded in 2009, we've curated a team of world-class therapists who blend time-honored techniques from across the globe with innovative approaches. Each treatment is a personalized journey, tailored to your body's unique needs.",
      text3: "Our space draws inspiration from Barcelona's architectural beauty—the organic curves of Gaudí, the warm terracotta of Gothic quarters, the tranquil blues of the Mediterranean. Step inside and let the city's magic embrace you.",
      founderName: "Maria Elena",
      founderTitle: "Founder & Lead Therapist",
      stats: {
        years: "Years Experience",
        clients: "Happy Clients",
        therapists: "Expert Therapists",
        satisfaction: "Satisfaction Rate"
      }
    },
    // Experience
    experience: {
      overline: "The Experience",
      title: "More Than a Massage",
      subtitle: "From the moment you arrive, every detail is designed to transport you to a state of complete serenity.",
      features: [
        { title: "Flexible Hours", description: "Open 7 days a week with early morning and late evening appointments available." },
        { title: "Personalized Care", description: "Every treatment is customized to your specific needs and preferences." },
        { title: "Premium Products", description: "We use only organic, sustainably sourced oils and skincare products." },
        { title: "Expert Guidance", description: "Our therapists provide aftercare tips to extend your treatment benefits." }
      ],
      amenitiesTitle: "Sanctuary Amenities",
      amenities: [
        "Private treatment rooms",
        "Rainfall showers",
        "Organic herbal teas",
        "Heated massage beds",
        "Meditation lounge",
        "Complimentary robes"
      ]
    },
    // Testimonials
    testimonials: {
      overline: "Testimonials",
      title: "Words of Gratitude",
      experience: "Experience"
    },
    // Booking
    booking: {
      overline: "Book Your Session",
      title: "Begin Your Journey",
      description: "Reserve your moment of tranquility. Our team will confirm your appointment within 24 hours.",
      location: "Location",
      phone: "Phone",
      hours: "Hours",
      hoursValue: "Mon - Sat: 9:00 - 22:00\nSun: 9:00 - 20:00",
      email: "Email",
      followUs: "Follow us:",
      form: {
        name: "Full Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "your@email.com",
        phone: "Phone",
        phonePlaceholder: "+34 XXX XXX XXX",
        service: "Service",
        servicePlaceholder: "Select a service",
        date: "Preferred Date",
        time: "Preferred Time",
        timePlaceholder: "Select time",
        message: "Special Requests",
        messagePlaceholder: "Any special requests or health considerations we should know about?",
        submit: "Request Booking"
      },
      success: {
        title: "Thank You!",
        message: "Your booking request has been received. We'll contact you shortly to confirm your appointment."
      }
    },
    // Footer
    footer: {
      tagline: "Where healing becomes art. Experience the finest massage therapy in the heart of Barcelona.",
      newsletter: "Join our wellness circle",
      servicesTitle: "Services",
      companyTitle: "Company",
      supportTitle: "Support",
      company: ["About Us", "Our Team", "Careers", "Gift Cards"],
      support: ["FAQs", "Cancellation Policy", "Privacy Policy", "Terms of Service"],
      copyright: "All rights reserved.",
      madeWith: "Made with",
      inBarcelona: "in Barcelona"
    }
  },
  es: {
    // Navbar
    nav: {
      services: "Servicios",
      about: "Nosotros",
      experience: "Experiencia",
      testimonials: "Testimonios",
      bookNow: "Reservar",
      location: "Barcelona, España",
    },
    // Hero
    hero: {
      overline: "Bienestar y Relajación",
      titleLine1: "El Arte de",
      titleLine2: "Confession",
      description: "Entrégate a la tranquilidad en el corazón de Barcelona. Donde las antiguas tradiciones curativas se encuentran con el lujo contemporáneo.",
      cta1: "Reserva Tu Experiencia",
      cta2: "Explorar Servicios",
      scroll: "Desplaza para descubrir",
    },
    // Services
    services: {
      overline: "Nuestros Servicios",
      title: "Experiencias Curadas",
      subtitle: "Cada tratamiento está cuidadosamente diseñado para guiarte a través de un viaje transformador de relajación y renovación.",
      bookThis: "Reservar Este Servicio",
      customCta: "¿Buscas algo especial?",
      customBtn: "Solicitar Tratamiento Personalizado",
      items: [
        {
          name: "Signature Confession",
          description: "Nuestro masaje corporal completo característico que combina técnicas suecas, de tejido profundo y aromaterapia para una relajación completa.",
          features: ["Piedras calientes", "Aceites esenciales", "Masaje capilar"]
        },
        {
          name: "Deep Tissue Revival",
          description: "Terapia de presión dirigida para liberar la tensión muscular crónica y restaurar la alineación natural del cuerpo.",
          features: ["Liberación muscular", "Corrección postural", "Alivio del dolor"]
        },
        {
          name: "Ritual Mediterráneo",
          description: "Un viaje lujoso inspirado en las antiguas tradiciones de bienestar mediterráneas con aceite de oliva y sal marina.",
          features: ["Exfoliación corporal", "Envoltura cálida", "Masaje facial"]
        },
        {
          name: "Armonía en Pareja",
          description: "Comparte la experiencia de relajación con tu pareja en nuestra exclusiva suite para parejas.",
          features: ["Suite privada", "Champagne", "Masaje sincronizado"]
        },
        {
          name: "Terapia de Piedras Calientes",
          description: "Las piedras de basalto calentadas derriten la tensión mientras promueven la relajación muscular profunda y el flujo de energía.",
          features: ["Piedras volcánicas", "Terapia de calor", "Equilibrio energético"]
        },
        {
          name: "Aromaterapia Bliss",
          description: "Aceites esenciales mezclados a medida combinados con técnicas suecas suaves para la armonía sensorial.",
          features: ["Mezclas personalizadas", "Mejora del ánimo", "Toque suave"]
        }
      ]
    },
    // About
    about: {
      overline: "Nuestra Historia",
      title: "Donde la Curación se Convierte en Arte",
      text1: "Ubicado en el vibrante corazón de Barcelona, Confession nació de una simple creencia: que el verdadero bienestar trasciende lo físico. Nuestro santuario ofrece más que masajes—es una invitación a pausar, reflexionar y reconectarte contigo mismo.",
      text2: "Fundado en 2009, hemos reunido un equipo de terapeutas de clase mundial que combinan técnicas consagradas de todo el mundo con enfoques innovadores. Cada tratamiento es un viaje personalizado, adaptado a las necesidades únicas de tu cuerpo.",
      text3: "Nuestro espacio se inspira en la belleza arquitectónica de Barcelona—las curvas orgánicas de Gaudí, la cálida terracota de los barrios góticos, los tranquilos azules del Mediterráneo. Entra y deja que la magia de la ciudad te abrace.",
      founderName: "Maria Elena",
      founderTitle: "Fundadora y Terapeuta Principal",
      stats: {
        years: "Años de Experiencia",
        clients: "Clientes Felices",
        therapists: "Terapeutas Expertos",
        satisfaction: "Tasa de Satisfacción"
      }
    },
    // Experience
    experience: {
      overline: "La Experiencia",
      title: "Más Que un Masaje",
      subtitle: "Desde el momento en que llegas, cada detalle está diseñado para transportarte a un estado de serenidad completa.",
      features: [
        { title: "Horarios Flexibles", description: "Abierto los 7 días de la semana con citas disponibles temprano en la mañana y tarde en la noche." },
        { title: "Atención Personalizada", description: "Cada tratamiento se personaliza según tus necesidades y preferencias específicas." },
        { title: "Productos Premium", description: "Utilizamos solo aceites y productos para el cuidado de la piel orgánicos y de origen sostenible." },
        { title: "Orientación Experta", description: "Nuestros terapeutas proporcionan consejos de cuidado posterior para extender los beneficios de tu tratamiento." }
      ],
      amenitiesTitle: "Comodidades del Santuario",
      amenities: [
        "Salas de tratamiento privadas",
        "Duchas de lluvia",
        "Tés de hierbas orgánicos",
        "Camas de masaje climatizadas",
        "Salón de meditación",
        "Batas de cortesía"
      ]
    },
    // Testimonials
    testimonials: {
      overline: "Testimonios",
      title: "Palabras de Gratitud",
      experience: "Experiencia"
    },
    // Booking
    booking: {
      overline: "Reserva Tu Sesión",
      title: "Comienza Tu Viaje",
      description: "Reserva tu momento de tranquilidad. Nuestro equipo confirmará tu cita en un plazo de 24 horas.",
      location: "Ubicación",
      phone: "Teléfono",
      hours: "Horario",
      hoursValue: "Lun - Sáb: 9:00 - 22:00\nDom: 9:00 - 20:00",
      email: "Correo",
      followUs: "Síguenos:",
      form: {
        name: "Nombre Completo",
        namePlaceholder: "Tu nombre",
        email: "Correo Electrónico",
        emailPlaceholder: "tu@correo.com",
        phone: "Teléfono",
        phonePlaceholder: "+34 XXX XXX XXX",
        service: "Servicio",
        servicePlaceholder: "Selecciona un servicio",
        date: "Fecha Preferida",
        time: "Hora Preferida",
        timePlaceholder: "Selecciona hora",
        message: "Solicitudes Especiales",
        messagePlaceholder: "¿Alguna solicitud especial o consideración de salud que debamos saber?",
        submit: "Solicitar Reserva"
      },
      success: {
        title: "¡Gracias!",
        message: "Hemos recibido tu solicitud de reserva. Nos pondremos en contacto contigo pronto para confirmar tu cita."
      }
    },
    // Footer
    footer: {
      tagline: "Donde la curación se convierte en arte. Experimenta la mejor terapia de masajes en el corazón de Barcelona.",
      newsletter: "Únete a nuestro círculo de bienestar",
      servicesTitle: "Servicios",
      companyTitle: "Empresa",
      supportTitle: "Soporte",
      company: ["Sobre Nosotros", "Nuestro Equipo", "Carreras", "Tarjetas Regalo"],
      support: ["Preguntas Frecuentes", "Política de Cancelación", "Política de Privacidad", "Términos de Servicio"],
      copyright: "Todos los derechos reservados.",
      madeWith: "Hecho con",
      inBarcelona: "en Barcelona"
    }
  },
  ca: {
    // Navbar
    nav: {
      services: "Serveis",
      about: "Nosaltres",
      experience: "Experiència",
      testimonials: "Testimonis",
      bookNow: "Reservar",
      location: "Barcelona, Catalunya",
    },
    // Hero
    hero: {
      overline: "Benestar i Relaxació",
      titleLine1: "L'Art de",
      titleLine2: "Confession",
      description: "Lliura't a la tranquil·litat al cor de Barcelona. On les antigues tradicions curatives es troben amb el luxe contemporani.",
      cta1: "Reserva la Teva Experiència",
      cta2: "Explorar Serveis",
      scroll: "Desplaça per descobrir",
    },
    // Services
    services: {
      overline: "Els Nostres Serveis",
      title: "Experiències Curades",
      subtitle: "Cada tractament està acuradament dissenyat per guiar-te a través d'un viatge transformador de relaxació i renovació.",
      bookThis: "Reservar Aquest Servei",
      customCta: "Busques alguna cosa especial?",
      customBtn: "Sol·licitar Tractament Personalitzat",
      items: [
        {
          name: "Signature Confession",
          description: "El nostre massatge corporal complet característic que combina tècniques sueques, de teixit profund i aromateràpia per a una relaxació completa.",
          features: ["Pedres calentes", "Olis essencials", "Massatge capil·lar"]
        },
        {
          name: "Deep Tissue Revival",
          description: "Teràpia de pressió dirigida per alliberar la tensió muscular crònica i restaurar l'alineació natural del cos.",
          features: ["Alliberament muscular", "Correcció postural", "Alleujament del dolor"]
        },
        {
          name: "Ritual Mediterrani",
          description: "Un viatge luxós inspirat en les antigues tradicions de benestar mediterrànies amb oli d'oliva i sal marina.",
          features: ["Exfoliació corporal", "Embolcall càlid", "Massatge facial"]
        },
        {
          name: "Harmonia en Parella",
          description: "Comparteix l'experiència de relaxació amb la teva parella a la nostra exclusiva suite per a parelles.",
          features: ["Suite privada", "Xampany", "Massatge sincronitzat"]
        },
        {
          name: "Teràpia de Pedres Calentes",
          description: "Les pedres de basalt escalfades fonen la tensió mentre promouen la relaxació muscular profunda i el flux d'energia.",
          features: ["Pedres volcàniques", "Teràpia de calor", "Equilibri energètic"]
        },
        {
          name: "Aromateràpia Bliss",
          description: "Olis essencials barrejats a mida combinats amb tècniques sueques suaus per a l'harmonia sensorial.",
          features: ["Barreges personalitzades", "Millora de l'ànim", "Toc suau"]
        }
      ]
    },
    // About
    about: {
      overline: "La Nostra Història",
      title: "On la Curació es Converteix en Art",
      text1: "Ubicat al vibrant cor de Barcelona, Confession va néixer d'una simple creença: que el veritable benestar transcendeix el físic. El nostre santuari ofereix més que massatges—és una invitació a pausar, reflexionar i reconnectar-te amb tu mateix.",
      text2: "Fundat el 2009, hem reunit un equip de terapeutes de classe mundial que combinen tècniques consagrades de tot el món amb enfocaments innovadors. Cada tractament és un viatge personalitzat, adaptat a les necessitats úniques del teu cos.",
      text3: "El nostre espai s'inspira en la bellesa arquitectònica de Barcelona—les corbes orgàniques de Gaudí, la càlida terracota dels barris gòtics, els tranquils blaus del Mediterrani. Entra i deixa que la màgia de la ciutat t'abraci.",
      founderName: "Maria Elena",
      founderTitle: "Fundadora i Terapeuta Principal",
      stats: {
        years: "Anys d'Experiència",
        clients: "Clients Feliços",
        therapists: "Terapeutes Experts",
        satisfaction: "Taxa de Satisfacció"
      }
    },
    // Experience
    experience: {
      overline: "L'Experiència",
      title: "Més Que un Massatge",
      subtitle: "Des del moment en què arribes, cada detall està dissenyat per transportar-te a un estat de serenitat completa.",
      features: [
        { title: "Horaris Flexibles", description: "Obert els 7 dies de la setmana amb cites disponibles d'hora al matí i tard a la nit." },
        { title: "Atenció Personalitzada", description: "Cada tractament es personalitza segons les teves necessitats i preferències específiques." },
        { title: "Productes Premium", description: "Utilitzem només olis i productes per a la cura de la pell orgànics i d'origen sostenible." },
        { title: "Orientació Experta", description: "Els nostres terapeutes proporcionen consells de cura posterior per estendre els beneficis del teu tractament." }
      ],
      amenitiesTitle: "Comoditats del Santuari",
      amenities: [
        "Sales de tractament privades",
        "Dutxes de pluja",
        "Tès d'herbes orgànics",
        "Llits de massatge climatitzats",
        "Saló de meditació",
        "Barnussos de cortesia"
      ]
    },
    // Testimonials
    testimonials: {
      overline: "Testimonis",
      title: "Paraules de Gratitud",
      experience: "Experiència"
    },
    // Booking
    booking: {
      overline: "Reserva la Teva Sessió",
      title: "Comença el Teu Viatge",
      description: "Reserva el teu moment de tranquil·litat. El nostre equip confirmarà la teva cita en un termini de 24 hores.",
      location: "Ubicació",
      phone: "Telèfon",
      hours: "Horari",
      hoursValue: "Dll - Dis: 9:00 - 22:00\nDg: 9:00 - 20:00",
      email: "Correu",
      followUs: "Segueix-nos:",
      form: {
        name: "Nom Complet",
        namePlaceholder: "El teu nom",
        email: "Correu Electrònic",
        emailPlaceholder: "el.teu@correu.com",
        phone: "Telèfon",
        phonePlaceholder: "+34 XXX XXX XXX",
        service: "Servei",
        servicePlaceholder: "Selecciona un servei",
        date: "Data Preferida",
        time: "Hora Preferida",
        timePlaceholder: "Selecciona hora",
        message: "Sol·licituds Especials",
        messagePlaceholder: "Alguna sol·licitud especial o consideració de salut que haguem de saber?",
        submit: "Sol·licitar Reserva"
      },
      success: {
        title: "Gràcies!",
        message: "Hem rebut la teva sol·licitud de reserva. Ens posarem en contacte amb tu aviat per confirmar la teva cita."
      }
    },
    // Footer
    footer: {
      tagline: "On la curació es converteix en art. Experimenta la millor teràpia de massatges al cor de Barcelona.",
      newsletter: "Uneix-te al nostre cercle de benestar",
      servicesTitle: "Serveis",
      companyTitle: "Empresa",
      supportTitle: "Suport",
      company: ["Sobre Nosaltres", "El Nostre Equip", "Carreres", "Targetes Regal"],
      support: ["Preguntes Freqüents", "Política de Cancel·lació", "Política de Privacitat", "Termes de Servei"],
      copyright: "Tots els drets reservats.",
      madeWith: "Fet amb",
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

