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
      address: "Address",
      workWithUs: "Work With Us",
      ourTeam: "Our Therapists",
      staffSignIn: "Staff Sign In",
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
    },
    // Corporate
    corporate: {
      agreementBased: "Agreement Based",
      contactUs: "Contact Us",
      formSubtitle: "Fill out the form and we will contact you shortly.",
      name: "Name",
      namePlaceholder: "Your name",
      surname: "Surname",
      surnamePlaceholder: "Your surname",
      phone: "Phone Number",
      email: "Email",
      company: "Company Name",
      companyPlaceholder: "Your company name",
      submit: "Submit",
      successTitle: "Thank You!",
      successMessage: "We will get in contact with you as soon as possible.",
      close: "Close",
      // B2B Modal
      b2bSubtitle: "Business to Business Partnership",
      b2bMessage: "Interested in elevating your team's well-being through our premium corporate wellness programs? We'd love to discuss how we can create a tailored experience for your organization.",
      b2bCta: "For B2B collaborations and corporate inquiries, please contact us directly — we're here to help you design the perfect wellness solution for your company.",
      whatsappBtn: "Chat on WhatsApp",
      b2bFooter: "Our team is available Monday to Saturday, 10:00 - 20:00"
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
      bookNow: "Book Now",
      bookingForm: {
        title: "Request Booking",
        subtitle: "Fill in your details and we'll confirm your appointment",
        clientName: "Your Name",
        clientNamePlaceholder: "Enter your full name",
        clientPhone: "Phone Number",
        clientPhonePlaceholder: "+34 612 345 678",
        service: "Service",
        servicePlaceholder: "Select a service",
        date: "Preferred Date",
        time: "Preferred Time",
        duration: "Duration",
        submit: "Request Booking",
        success: "Booking Request Sent!",
        successMessage: "Thank you! We'll contact you shortly to confirm your appointment.",
        close: "Close",
        cancel: "Cancel",
        required: "Required",
      },
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
    // Work With Us
    workWithUs: {
      title: "Join Our Team",
      subtitle: "Become part of the Confession Barcelona family",
      intro: "Are you a professional massage therapist looking for an exceptional work environment? At Confession Barcelona, we offer qualified professionals the opportunity to practice in our premium wellness center.",
      offer: "What We Offer",
      offerItems: [
        "Private, fully-equipped treatment rooms available for rent",
        "Premium location in the heart of Barcelona",
        "Flexible scheduling options",
        "Professional and welcoming environment",
        "Access to our client base and booking system"
      ],
      requirements: "Requirements",
      requirementsItems: [
        "Professional massage therapy certification",
        "Minimum 2 years of experience",
        "Excellent communication skills",
        "Passion for wellness and client care"
      ],
      formTitle: "Apply Now",
      formSubtitle: "Fill out the form below and attach your CV. We will contact you shortly.",
      form: {
        name: "First Name",
        namePlaceholder: "Your first name",
        surname: "Surname",
        surnamePlaceholder: "Your surname",
        phone: "Phone Number",
        phonePlaceholder: "+34 XXX XXX XXX",
        email: "Email Address",
        emailPlaceholder: "your@email.com",
        emailOptional: "(Optional)",
        cv: "Upload CV",
        cvNote: "PDF or Word document (with photo recommended)",
        cvButton: "Choose File",
        cvNoFile: "No file selected",
        submit: "Submit Application"
      },
      success: {
        title: "Application Received!",
        message: "Thank you for your interest in joining our team. We will review your application and contact you soon."
      },
      backToHome: "Back to Home"
    },
    // Our Team Page
    ourTeam: {
      title: "Our Professional Therapists",
      subtitle: "Meet the skilled hands behind your wellness journey",
      intro: "At Confession Barcelona, we take pride in our exceptional team of certified massage therapists. Each member brings unique expertise, years of experience, and a genuine passion for helping you achieve optimal well-being.",
      experience: "years experience",
      languages: "Languages",
      specialties: "Specialties",
      certifications: "Certifications",
      bookWith: "Book with",
      backToHome: "Back to Home"
    },
    // Staff Login
    staffLogin: {
      title: "Staff Portal",
      subtitle: "Sign in to access the staff dashboard",
      email: "Email",
      emailPlaceholder: "your@email.com",
      password: "Password",
      confirmPassword: "Confirm Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      signIn: "Sign In",
      signOut: "Sign Out",
      invalidCredentials: "Invalid credentials. Please try again.",
      needHelp: "Need help?",
      contactAdmin: "Contact admin",
      backToHome: "Back to Home",
      welcomeBack: "Welcome Back",
      todayBookings: "Today's Bookings",
      pendingRequests: "Pending Requests",
      viewSchedule: "View Schedule",
      manageBookings: "Manage Bookings"
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
      address: "Dirección",
      workWithUs: "Trabaja con Nosotros",
      ourTeam: "Nuestros Terapeutas",
      staffSignIn: "Acceso Personal",
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
    },
    // Corporate
    corporate: {
      agreementBased: "Según Acuerdo",
      contactUs: "Contáctenos",
      formSubtitle: "Complete el formulario y nos pondremos en contacto pronto.",
      name: "Nombre",
      namePlaceholder: "Tu nombre",
      surname: "Apellido",
      surnamePlaceholder: "Tu apellido",
      phone: "Teléfono",
      email: "Correo Electrónico",
      company: "Nombre de Empresa",
      companyPlaceholder: "Nombre de tu empresa",
      submit: "Enviar",
      successTitle: "¡Gracias!",
      successMessage: "Nos pondremos en contacto contigo lo antes posible.",
      close: "Cerrar",
      // B2B Modal
      b2bSubtitle: "Colaboración Empresarial",
      b2bMessage: "¿Interesado en mejorar el bienestar de tu equipo con nuestros programas premium de wellness corporativo? Nos encantaría diseñar una experiencia personalizada para tu organización.",
      b2bCta: "Para colaboraciones B2B y consultas corporativas, por favor contáctanos directamente — estamos aquí para ayudarte a diseñar la solución de bienestar perfecta para tu empresa.",
      whatsappBtn: "Chatea por WhatsApp",
      b2bFooter: "Nuestro equipo está disponible de lunes a sábado, 10:00 - 20:00"
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
      bookNow: "Reservar Ahora",
      bookingForm: {
        title: "Solicitar Reserva",
        subtitle: "Completa tus datos y confirmaremos tu cita",
        clientName: "Tu Nombre",
        clientNamePlaceholder: "Ingresa tu nombre completo",
        clientPhone: "Teléfono",
        clientPhonePlaceholder: "+34 612 345 678",
        service: "Servicio",
        servicePlaceholder: "Selecciona un servicio",
        date: "Fecha Preferida",
        time: "Hora Preferida",
        duration: "Duración",
        submit: "Solicitar Reserva",
        success: "¡Solicitud Enviada!",
        successMessage: "¡Gracias! Nos pondremos en contacto contigo pronto para confirmar tu cita.",
        close: "Cerrar",
        cancel: "Cancelar",
        required: "Requerido",
      },
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
    // Work With Us
    workWithUs: {
      title: "Únete a Nuestro Equipo",
      subtitle: "Forma parte de la familia Confession Barcelona",
      intro: "¿Eres un terapeuta de masajes profesional buscando un entorno de trabajo excepcional? En Confession Barcelona, ofrecemos a profesionales cualificados la oportunidad de ejercer en nuestro centro de bienestar premium.",
      offer: "Lo Que Ofrecemos",
      offerItems: [
        "Salas de tratamiento privadas y completamente equipadas disponibles para alquiler",
        "Ubicación premium en el corazón de Barcelona",
        "Opciones de horarios flexibles",
        "Ambiente profesional y acogedor",
        "Acceso a nuestra base de clientes y sistema de reservas"
      ],
      requirements: "Requisitos",
      requirementsItems: [
        "Certificación profesional en terapia de masajes",
        "Mínimo 2 años de experiencia",
        "Excelentes habilidades de comunicación",
        "Pasión por el bienestar y la atención al cliente"
      ],
      formTitle: "Aplica Ahora",
      formSubtitle: "Completa el formulario a continuación y adjunta tu CV. Nos pondremos en contacto contigo pronto.",
      form: {
        name: "Nombre",
        namePlaceholder: "Tu nombre",
        surname: "Apellido",
        surnamePlaceholder: "Tu apellido",
        phone: "Número de Teléfono",
        phonePlaceholder: "+34 XXX XXX XXX",
        email: "Correo Electrónico",
        emailPlaceholder: "tu@correo.com",
        emailOptional: "(Opcional)",
        cv: "Subir CV",
        cvNote: "Documento PDF o Word (con foto recomendado)",
        cvButton: "Elegir Archivo",
        cvNoFile: "Ningún archivo seleccionado",
        submit: "Enviar Solicitud"
      },
      success: {
        title: "¡Solicitud Recibida!",
        message: "Gracias por tu interés en unirte a nuestro equipo. Revisaremos tu solicitud y te contactaremos pronto."
      },
      backToHome: "Volver al Inicio"
    },
    // Our Team Page
    ourTeam: {
      title: "Nuestros Terapeutas Profesionales",
      subtitle: "Conoce las manos expertas detrás de tu viaje de bienestar",
      intro: "En Confession Barcelona, nos enorgullecemos de nuestro excepcional equipo de terapeutas de masaje certificados. Cada miembro aporta experiencia única, años de práctica y una pasión genuina por ayudarte a alcanzar un bienestar óptimo.",
      experience: "años de experiencia",
      languages: "Idiomas",
      specialties: "Especialidades",
      certifications: "Certificaciones",
      bookWith: "Reservar con",
      backToHome: "Volver al Inicio"
    },
    // Staff Login
    staffLogin: {
      title: "Portal del Personal",
      subtitle: "Inicia sesión para acceder al panel de personal",
      email: "Correo Electrónico",
      emailPlaceholder: "tu@correo.com",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      rememberMe: "Recordarme",
      forgotPassword: "¿Olvidaste tu contraseña?",
      signIn: "Iniciar Sesión",
      signOut: "Cerrar Sesión",
      invalidCredentials: "Credenciales inválidas. Inténtalo de nuevo.",
      needHelp: "¿Necesitas ayuda?",
      contactAdmin: "Contacta al administrador",
      backToHome: "Volver al Inicio",
      welcomeBack: "Bienvenido de Nuevo",
      todayBookings: "Reservas de Hoy",
      pendingRequests: "Solicitudes Pendientes",
      viewSchedule: "Ver Horario",
      manageBookings: "Gestionar Reservas"
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
      address: "Adreça",
      workWithUs: "Treballa amb Nosaltres",
      ourTeam: "Els Nostres Terapeutes",
      staffSignIn: "Accés Personal",
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
    },
    // Corporate
    corporate: {
      agreementBased: "Segons Acord",
      contactUs: "Contacteu-nos",
      formSubtitle: "Completa el formulari i ens posarem en contacte aviat.",
      name: "Nom",
      namePlaceholder: "El teu nom",
      surname: "Cognom",
      surnamePlaceholder: "El teu cognom",
      phone: "Telèfon",
      email: "Correu Electrònic",
      company: "Nom de l'Empresa",
      companyPlaceholder: "Nom de la teva empresa",
      submit: "Enviar",
      successTitle: "Gràcies!",
      successMessage: "Ens posarem en contacte amb tu el més aviat possible.",
      close: "Tancar",
      // B2B Modal
      b2bSubtitle: "Col·laboració Empresarial",
      b2bMessage: "Interessat en millorar el benestar del teu equip amb els nostres programes premium de wellness corporatiu? Ens encantaria dissenyar una experiència personalitzada per a la teva organització.",
      b2bCta: "Per a col·laboracions B2B i consultes corporatives, si us plau contacta'ns directament — estem aquí per ajudar-te a dissenyar la solució de benestar perfecta per a la teva empresa.",
      whatsappBtn: "Xateja per WhatsApp",
      b2bFooter: "El nostre equip està disponible de dilluns a dissabte, 10:00 - 20:00"
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
      bookNow: "Reservar Ara",
      bookingForm: {
        title: "Sol·licitar Reserva",
        subtitle: "Completa les teves dades i confirmarem la teva cita",
        clientName: "El Teu Nom",
        clientNamePlaceholder: "Introdueix el teu nom complet",
        clientPhone: "Telèfon",
        clientPhonePlaceholder: "+34 612 345 678",
        service: "Servei",
        servicePlaceholder: "Selecciona un servei",
        date: "Data Preferida",
        time: "Hora Preferida",
        duration: "Durada",
        submit: "Sol·licitar Reserva",
        success: "Sol·licitud Enviada!",
        successMessage: "Gràcies! Ens posarem en contacte amb tu aviat per confirmar la teva cita.",
        close: "Tancar",
        cancel: "Cancel·lar",
        required: "Requerit",
      },
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
    // Work With Us
    workWithUs: {
      title: "Uneix-te al Nostre Equip",
      subtitle: "Forma part de la família Confession Barcelona",
      intro: "Ets un terapeuta de massatges professional buscant un entorn de treball excepcional? A Confession Barcelona, oferim a professionals qualificats l'oportunitat d'exercir al nostre centre de benestar premium.",
      offer: "El Que Oferim",
      offerItems: [
        "Sales de tractament privades i completament equipades disponibles per a lloguer",
        "Ubicació premium al cor de Barcelona",
        "Opcions d'horaris flexibles",
        "Ambient professional i acollidor",
        "Accés a la nostra base de clients i sistema de reserves"
      ],
      requirements: "Requisits",
      requirementsItems: [
        "Certificació professional en teràpia de massatges",
        "Mínim 2 anys d'experiència",
        "Excel·lents habilitats de comunicació",
        "Passió pel benestar i l'atenció al client"
      ],
      formTitle: "Aplica Ara",
      formSubtitle: "Completa el formulari a continuació i adjunta el teu CV. Ens posarem en contacte amb tu aviat.",
      form: {
        name: "Nom",
        namePlaceholder: "El teu nom",
        surname: "Cognom",
        surnamePlaceholder: "El teu cognom",
        phone: "Número de Telèfon",
        phonePlaceholder: "+34 XXX XXX XXX",
        email: "Correu Electrònic",
        emailPlaceholder: "el.teu@correu.com",
        emailOptional: "(Opcional)",
        cv: "Pujar CV",
        cvNote: "Document PDF o Word (amb foto recomanat)",
        cvButton: "Triar Arxiu",
        cvNoFile: "Cap arxiu seleccionat",
        submit: "Enviar Sol·licitud"
      },
      success: {
        title: "Sol·licitud Rebuda!",
        message: "Gràcies pel teu interès en unir-te al nostre equip. Revisarem la teva sol·licitud i et contactarem aviat."
      },
      backToHome: "Tornar a l'Inici"
    },
    // Our Team Page
    ourTeam: {
      title: "Els Nostres Terapeutes Professionals",
      subtitle: "Coneix les mans expertes darrere del teu viatge de benestar",
      intro: "A Confession Barcelona, ens enorgullim del nostre excepcional equip de terapeutes de massatge certificats. Cada membre aporta experiència única, anys de pràctica i una passió genuïna per ajudar-te a aconseguir un benestar òptim.",
      experience: "anys d'experiència",
      languages: "Idiomes",
      specialties: "Especialitats",
      certifications: "Certificacions",
      bookWith: "Reservar amb",
      backToHome: "Tornar a l'Inici"
    },
    // Staff Login
    staffLogin: {
      title: "Portal del Personal",
      subtitle: "Inicia sessió per accedir al panell de personal",
      email: "Correu Electrònic",
      emailPlaceholder: "el.teu@correu.com",
      password: "Contrasenya",
      confirmPassword: "Confirmar Contrasenya",
      rememberMe: "Recorda'm",
      forgotPassword: "Has oblidat la contrasenya?",
      signIn: "Iniciar Sessió",
      signOut: "Tancar Sessió",
      invalidCredentials: "Credencials invàlides. Torna-ho a provar.",
      needHelp: "Necessites ajuda?",
      contactAdmin: "Contacta l'administrador",
      backToHome: "Tornar a l'Inici",
      welcomeBack: "Benvingut de Nou",
      todayBookings: "Reserves d'Avui",
      pendingRequests: "Sol·licituds Pendents",
      viewSchedule: "Veure Horari",
      manageBookings: "Gestionar Reserves"
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

