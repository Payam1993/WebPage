import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const translations = {
  en: {
    // Navbar
    nav: {
      services: "Services",
      about: "About",
      gallery: "Gallery",
      experience: "Experience",
      testimonials: "Testimonials",
      address: "Address",
      workWithUs: "Work With Us",
      ourTeam: "Our Massage Team",
      staffSignIn: "Staff Sign In",
      location: "Barcelona, Spain",
    },
    // Hero
    hero: {
      overline: "Wellness & Relaxation",
      titleLine1: "The Art of",
      titleLine2: "Lavin",
      description: "Surrender to tranquility in the heart of Barcelona. Where the art of massage meets contemporary luxury.",
      cta1: "Reserve Your Experience",
      cta2: "Explore Services",
      scroll: "Scroll to discover",
    },
    // Services
    services: {
      overline: "Our Services",
      title: "Curated Experiences",
      subtitle: "Each massage is thoughtfully designed to guide you through a journey of relaxation and well-being.",
      bookThis: "Book This Service",
      customCta: "Looking for something special?",
      customBtn: "Request a Custom Massage",
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
    // Reserve Room (for therapists)
    reserveRoom: {
      badge: "For massage professionals",
      contactUs: "Contact Us",
      subtitle: "Room reservation for massage professionals",
      message: "If you are a massage professional with experience and are looking for a room to welcome your clients, get in contact with us and we will contact you.",
      whatsappBtn: "Chat on WhatsApp",
      footer: "Our team is available Monday to Saturday, 10:00 - 20:00"
    },
    // About
    about: {
      overline: "Our Story",
      title: "Where Well-being Becomes Art",
      text1: "Nestled in the vibrant heart of Barcelona, Lavin was born from a simple belief: that true wellness is a moment of calm. Our sanctuary offers more than massage—it's an invitation to pause, reflect, and reconnect with yourself.",
      text2: "Founded in 2009, we've curated a team of skilled massage professionals who blend time-honored techniques from across the globe with a calm, personal approach. Each massage is a personalized journey of relaxation and well-being.",
      text3: "Our space draws inspiration from Barcelona's architectural beauty—the organic curves of Gaudí, the warm terracotta of Gothic quarters, the tranquil blues of the Mediterranean. Step inside and let the city's magic embrace you.",
      founderName: "Maria Elena",
      founderTitle: "Founder & Lead Massage Professional",
      stats: {
        years: "Years Experience",
        clients: "Happy Clients",
        therapists: "Massage Professionals",
        satisfaction: "Satisfaction Rate"
      }
    },
    // Gallery
    gallery: {
      overline: "Moments",
      title: "Gallery",
      subtitle: "A glimpse into the atmosphere of Lavin.",
      imageAlt: "Lavin gallery",
    },
    // Experience
    experience: {
      overline: "The Experience",
      title: "More Than a Massage",
      subtitle: "From the moment you arrive, every detail is designed to transport you to a state of complete serenity.",
      features: [
        { title: "Flexible Hours", description: "Open 7 days a week with early morning and late evening appointments available." },
        { title: "Personalized Care", description: "Every massage is adapted to your comfort and preferences." },
        { title: "Premium Products", description: "We use only organic, sustainably sourced oils and skincare products." },
        { title: "Expert Guidance", description: "Our massage team shares simple tips so the feeling of well-being can last a little longer." }
      ],
      amenitiesTitle: "Sanctuary Amenities",
      amenities: [
        "Private massage rooms",
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
        center: "Center",
        centerPlaceholder: "Select a center",
        room: "Room",
        roomPlaceholder: "Select a room (optional)",
        roomSelectCenterFirst: "Select a center first",
        optional: "(Optional)",
        date: "Preferred Date",
        time: "Preferred Time",
        duration: "Duration",
        availability: "Availability",
        selectCenterFirst: "Select a center to see room availability.",
        available: "Available",
        limited: "Limited",
        full: "Full",
        slotsTitle: "Available times",
        noSlots: "No available slots for this day. Try another date or room.",
        loading: "loading…",
        selectedSlot: "Selected",
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
        messagePlaceholder: "Any special requests or preferences we should know about?",
        submit: "Request Booking"
      },
      success: {
        title: "Thank You!",
        message: "Your booking request has been received. We'll contact you shortly to confirm your appointment."
      }
    },
    // Work With Us
    workWithUs: {
      title: "Work With Us",
      subtitle: "Become part of the Lavin family",
      formTitle: "Work With Us",
      formSubtitle: "Fill out the form below and we will get back to you shortly.",
      form: {
        name: "Name",
        namePlaceholder: "Your first name",
        surname: "Last Name",
        surnamePlaceholder: "Your last name",
        phone: "Contact Number",
        phonePlaceholder: "+34 XXX XXX XXX",
        email: "Email Address",
        emailPlaceholder: "your@email.com",
        gender: "Gender",
        genderPlaceholder: "Select gender",
        genderMan: "Man",
        genderFemale: "Female",
        genderOthers: "Others",
        experience: "Years of Experience",
        experiencePlaceholder: "Select experience",
        experienceMore: "More than 5",
        explanation: "Explanation",
        explanationPlaceholder: "Tell us a bit about yourself...",
        optional: "(Optional)",
        submit: "Submit Application",
        error: "Something went wrong. Please try again later."
      },
      success: {
        title: "Thank You!",
        message: "Thanks for your interest in working with us. We will get back to you shortly."
      },
      backToHome: "Back to Home"
    },
    // Our Team Page
    ourTeam: {
      title: "Our Massage Team",
      subtitle: "Meet the skilled hands behind your wellness journey",
      intro: "At Lavin, we take pride in our massage team. Each person brings their own touch, years of practice, and a genuine care for your comfort and well-being.",
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
      manageBookings: "Manage Bookings",
      temporaryPasswordNotice: "This account requires a new password. Please set one to continue.",
      confirmSignUp: "Please confirm your account first.",
      selectMfaNotice: "Select how you want to receive your verification code.",
      mfaNotice: "Multi-factor authentication is required. Enter the verification code from your authenticator app.",
      setNewPassword: "Set new password",
      newPassword: "New password",
      passwordsMismatch: "Passwords do not match.",
      continue: "Continue",
      verify: "Verify",
      mfaCode: "Verification code",
      totpSetupTitle: "Set up authenticator app",
      totpSetupHint: "Scan the QR code with your authenticator app, then enter the code.",
      userNotConfirmed: "Account not confirmed. Please contact admin.",
    },
    // Footer
    footer: {
      tagline: "Where well-being becomes art. Experience massage and wellness in the heart of Barcelona.",
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
      gallery: "Galería",
      experience: "Experiencia",
      testimonials: "Testimonios",
      address: "Dirección",
      workWithUs: "Trabaja con Nosotros",
      ourTeam: "Nuestro Equipo de Masaje",
      staffSignIn: "Acceso Personal",
      location: "Barcelona, España",
    },
    // Hero
    hero: {
      overline: "Bienestar y Relajación",
      titleLine1: "El Arte de",
      titleLine2: "Lavin",
      description: "Entrégate a la tranquilidad en el corazón de Barcelona. Donde el arte del masaje se encuentra con el lujo contemporáneo.",
      cta1: "Reserva Tu Experiencia",
      cta2: "Explorar Servicios",
      scroll: "Desplaza para descubrir",
    },
    // Services
    services: {
      overline: "Nuestros Servicios",
      title: "Experiencias Curadas",
      subtitle: "Cada masaje está cuidadosamente pensado para acompañarte en un momento de relajación y bienestar.",
      bookThis: "Reservar Este Servicio",
      customCta: "¿Buscas algo especial?",
      customBtn: "Solicitar un Masaje a Medida",
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
    reserveRoom: {
      badge: "Para masajistas",
      contactUs: "Contáctanos",
      subtitle: "Reserva de sala para masajistas",
      message: "Si eres masajista, tienes experiencia y buscas una sala para atender a tus clientes, ponte en contacto con nosotros y te contactaremos.",
      whatsappBtn: "Chatea por WhatsApp",
      footer: "Nuestro equipo está disponible de lunes a sábado, 10:00 - 20:00"
    },
    // About
    about: {
      overline: "Nuestra Historia",
      title: "Donde el Bienestar se Convierte en Arte",
      text1: "Ubicado en el vibrante corazón de Barcelona, Lavin nació de una simple creencia: que el verdadero bienestar es un momento de calma. Nuestro santuario ofrece más que masajes—es una invitación a pausar, reflexionar y reconectarte contigo mismo.",
      text2: "Fundado en 2009, hemos reunido un equipo de masajistas que combinan técnicas de masaje de todo el mundo con un enfoque calmado y personal. Cada masaje es un viaje de relajación y bienestar.",
      text3: "Nuestro espacio se inspira en la belleza arquitectónica de Barcelona—las curvas orgánicas de Gaudí, la cálida terracota de los barrios góticos, los tranquilos azules del Mediterráneo. Entra y deja que la magia de la ciudad te abrace.",
      founderName: "Maria Elena",
      founderTitle: "Fundadora y masajista principal",
      stats: {
        years: "Años de Experiencia",
        clients: "Clientes Felices",
        therapists: "Masajistas",
        satisfaction: "Tasa de Satisfacción"
      }
    },
    gallery: {
      overline: "Momentos",
      title: "Galería",
      subtitle: "Un vistazo a la atmósfera de Lavin.",
      imageAlt: "Galería Lavin",
    },
    // Experience
    experience: {
      overline: "La Experiencia",
      title: "Más Que un Masaje",
      subtitle: "Desde el momento en que llegas, cada detalle está diseñado para transportarte a un estado de serenidad completa.",
      features: [
        { title: "Horarios Flexibles", description: "Abierto los 7 días de la semana con citas disponibles temprano en la mañana y tarde en la noche." },
        { title: "Atención Personalizada", description: "Cada masaje se adapta a tu confort y a tus preferencias." },
        { title: "Productos Premium", description: "Utilizamos solo aceites y productos para el cuidado de la piel orgánicos y de origen sostenible." },
        { title: "Orientación Cercana", description: "Nuestro equipo de masaje comparte consejos sencillos para que la sensación de bienestar dure un poco más." }
      ],
      amenitiesTitle: "Comodidades del Santuario",
      amenities: [
        "Salas de masaje privadas",
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
        center: "Centro",
        centerPlaceholder: "Selecciona un centro",
        room: "Sala",
        roomPlaceholder: "Selecciona una sala (opcional)",
        roomSelectCenterFirst: "Selecciona un centro primero",
        optional: "(Opcional)",
        date: "Fecha Preferida",
        time: "Hora Preferida",
        duration: "Duración",
        availability: "Disponibilidad",
        selectCenterFirst: "Selecciona un centro para ver la disponibilidad de salas.",
        available: "Disponible",
        limited: "Limitado",
        full: "Completo",
        slotsTitle: "Horarios disponibles",
        noSlots: "No hay horarios disponibles este día. Prueba otra fecha o sala.",
        loading: "cargando…",
        selectedSlot: "Seleccionado",
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
        messagePlaceholder: "¿Alguna petición especial o preferencia que debamos saber?",
        submit: "Solicitar Reserva"
      },
      success: {
        title: "¡Gracias!",
        message: "Hemos recibido tu solicitud de reserva. Nos pondremos en contacto contigo pronto para confirmar tu cita."
      }
    },
    // Work With Us
    workWithUs: {
      title: "Trabaja con Nosotros",
      subtitle: "Forma parte de la familia Lavin",
      formTitle: "Trabaja con Nosotros",
      formSubtitle: "Completa el formulario y nos pondremos en contacto contigo pronto.",
      form: {
        name: "Nombre",
        namePlaceholder: "Tu nombre",
        surname: "Apellido",
        surnamePlaceholder: "Tu apellido",
        phone: "Número de Contacto",
        phonePlaceholder: "+34 XXX XXX XXX",
        email: "Correo Electrónico",
        emailPlaceholder: "tu@correo.com",
        gender: "Género",
        genderPlaceholder: "Selecciona el género",
        genderMan: "Hombre",
        genderFemale: "Mujer",
        genderOthers: "Otros",
        experience: "Años de Experiencia",
        experiencePlaceholder: "Selecciona la experiencia",
        experienceMore: "Más de 5",
        explanation: "Explicación",
        explanationPlaceholder: "Cuéntanos un poco sobre ti...",
        optional: "(Opcional)",
        submit: "Enviar Solicitud",
        error: "Algo salió mal. Por favor, inténtalo de nuevo más tarde."
      },
      success: {
        title: "¡Gracias!",
        message: "Gracias por tu interés en trabajar con nosotros. Nos pondremos en contacto contigo pronto."
      },
      backToHome: "Volver al Inicio"
    },
    // Our Team Page
    ourTeam: {
      title: "Nuestro Equipo de Masaje",
      subtitle: "Conoce las manos expertas detrás de tu momento de bienestar",
      intro: "En Lavin, nos enorgullecemos de nuestro equipo de masaje. Cada persona aporta su propio tacto, años de práctica y un cuidado genuino por tu confort y bienestar.",
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
      email: "Correo electrónico",
      emailPlaceholder: "tu@correo.com",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      rememberMe: "Recordarme",
      forgotPassword: "¿Olvidaste tu contraseña?",
      signIn: "Iniciar sesión",
      signOut: "Cerrar sesión",
      invalidCredentials: "Credenciales inválidas. Inténtalo de nuevo.",
      needHelp: "¿Necesitas ayuda?",
      contactAdmin: "Contacta al administrador",
      backToHome: "Volver al inicio",
      welcomeBack: "Bienvenido de nuevo",
      todayBookings: "Reservas de hoy",
      pendingRequests: "Solicitudes pendientes",
      viewSchedule: "Ver horario",
      manageBookings: "Gestionar reservas",
      temporaryPasswordNotice: "Esta cuenta requiere una nueva contraseña. Establécela para continuar.",
      confirmSignUp: "Confirma tu cuenta primero.",
      selectMfaNotice: "Elige cómo quieres recibir el código de verificación.",
      mfaNotice: "Se requiere autenticación en dos pasos. Introduce el código de tu aplicación autenticadora.",
      setNewPassword: "Establecer nueva contraseña",
      newPassword: "Nueva contraseña",
      passwordsMismatch: "Las contraseñas no coinciden.",
      continue: "Continuar",
      verify: "Verificar",
      mfaCode: "Código de verificación",
      totpSetupTitle: "Configurar aplicación autenticadora",
      totpSetupHint: "Escanea el código QR con tu app autenticadora e introduce el código.",
      userNotConfirmed: "Cuenta no confirmada. Contacta al administrador.",
    },
    // Footer
    footer: {
      tagline: "Donde el bienestar se convierte en arte. Disfruta del masaje y el bienestar en el corazón de Barcelona.",
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
      gallery: "Galeria",
      experience: "Experiència",
      testimonials: "Testimonis",
      address: "Adreça",
      workWithUs: "Treballa amb Nosaltres",
      ourTeam: "El Nostre Equip de Massatge",
      staffSignIn: "Accés Personal",
      location: "Barcelona, Catalunya",
    },
    // Hero
    hero: {
      overline: "Benestar i Relaxació",
      titleLine1: "L'Art de",
      titleLine2: "Lavin",
      description: "Lliura't a la tranquil·litat al cor de Barcelona. On l'art del massatge es troba amb el luxe contemporani.",
      cta1: "Reserva la Teva Experiència",
      cta2: "Explorar Serveis",
      scroll: "Desplaça per descobrir",
    },
    // Services
    services: {
      overline: "Els Nostres Serveis",
      title: "Experiències Curades",
      subtitle: "Cada massatge està pensat amb cura per acompanyar-te en un moment de relaxació i benestar.",
      bookThis: "Reservar Aquest Servei",
      customCta: "Busques alguna cosa especial?",
      customBtn: "Sol·licitar un Massatge a Mida",
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
    reserveRoom: {
      badge: "Per a massatgistes",
      contactUs: "Contacteu-nos",
      subtitle: "Reserva de sala per a massatgistes",
      message: "Si ets massatgista, tens experiència i busques una sala per atendre els teus clients, posa't en contacte amb nosaltres i et contactarem.",
      whatsappBtn: "Xateja per WhatsApp",
      footer: "El nostre equip està disponible de dilluns a dissabte, 10:00 - 20:00"
    },
    // About
    about: {
      overline: "La Nostra Història",
      title: "On el Benestar es Converteix en Art",
      text1: "Ubicat al vibrant cor de Barcelona, Lavin va néixer d'una simple creença: que el veritable benestar és un moment de calma. El nostre santuari ofereix més que massatges—és una invitació a pausar, reflexionar i reconnectar-te amb tu mateix.",
      text2: "Fundat el 2009, hem reunit un equip de massatgistes que combinen tècniques de massatge d'arreu del món amb un enfocament calmat i personal. Cada massatge és un viatge de relaxació i benestar.",
      text3: "El nostre espai s'inspira en la bellesa arquitectònica de Barcelona—les corbes orgàniques de Gaudí, la càlida terracota dels barris gòtics, els tranquils blaus del Mediterrani. Entra i deixa que la màgia de la ciutat t'abraci.",
      founderName: "Maria Elena",
      founderTitle: "Fundadora i massatgista principal",
      stats: {
        years: "Anys d'Experiència",
        clients: "Clients Feliços",
        therapists: "Massatgistes",
        satisfaction: "Taxa de Satisfacció"
      }
    },
    gallery: {
      overline: "Moments",
      title: "Galeria",
      subtitle: "Una mirada a l'atmosfera de Lavin.",
      imageAlt: "Galeria Lavin",
    },
    // Experience
    experience: {
      overline: "L'Experiència",
      title: "Més Que un Massatge",
      subtitle: "Des del moment en què arribes, cada detall està dissenyat per transportar-te a un estat de serenitat completa.",
      features: [
        { title: "Horaris Flexibles", description: "Obert els 7 dies de la setmana amb cites disponibles d'hora al matí i tard a la nit." },
        { title: "Atenció Personalitzada", description: "Cada massatge s'adapta al teu confort i a les teves preferències." },
        { title: "Productes Premium", description: "Utilitzem només olis i productes per a la cura de la pell orgànics i d'origen sostenible." },
        { title: "Orientació Propera", description: "El nostre equip de massatge comparteix consells senzills perquè la sensació de benestar duri una mica més." }
      ],
      amenitiesTitle: "Comoditats del Santuari",
      amenities: [
        "Sales de massatge privades",
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
        center: "Centre",
        centerPlaceholder: "Selecciona un centre",
        room: "Sala",
        roomPlaceholder: "Selecciona una sala (opcional)",
        roomSelectCenterFirst: "Selecciona un centre primer",
        optional: "(Opcional)",
        date: "Data Preferida",
        time: "Hora Preferida",
        duration: "Durada",
        availability: "Disponibilitat",
        selectCenterFirst: "Selecciona un centre per veure la disponibilitat de sales.",
        available: "Disponible",
        limited: "Limitat",
        full: "Complet",
        slotsTitle: "Horaris disponibles",
        noSlots: "No hi ha horaris disponibles aquest dia. Prova una altra data o sala.",
        loading: "carregant…",
        selectedSlot: "Seleccionat",
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
        messagePlaceholder: "Alguna petició especial o preferència que hàgim de saber?",
        submit: "Sol·licitar Reserva"
      },
      success: {
        title: "Gràcies!",
        message: "Hem rebut la teva sol·licitud de reserva. Ens posarem en contacte amb tu aviat per confirmar la teva cita."
      }
    },
    // Work With Us
    workWithUs: {
      title: "Treballa amb Nosaltres",
      subtitle: "Forma part de la família Lavin",
      formTitle: "Treballa amb Nosaltres",
      formSubtitle: "Completa el formulari i ens posarem en contacte amb tu aviat.",
      form: {
        name: "Nom",
        namePlaceholder: "El teu nom",
        surname: "Cognom",
        surnamePlaceholder: "El teu cognom",
        phone: "Número de Contacte",
        phonePlaceholder: "+34 XXX XXX XXX",
        email: "Correu Electrònic",
        emailPlaceholder: "el.teu@correu.com",
        gender: "Gènere",
        genderPlaceholder: "Selecciona el gènere",
        genderMan: "Home",
        genderFemale: "Dona",
        genderOthers: "Altres",
        experience: "Anys d'Experiència",
        experiencePlaceholder: "Selecciona l'experiència",
        experienceMore: "Més de 5",
        explanation: "Explicació",
        explanationPlaceholder: "Explica'ns una mica sobre tu...",
        optional: "(Opcional)",
        submit: "Enviar Sol·licitud",
        error: "Alguna cosa ha anat malament. Si us plau, torna-ho a provar més tard."
      },
      success: {
        title: "Gràcies!",
        message: "Gràcies pel teu interès a treballar amb nosaltres. Ens posarem en contacte amb tu aviat."
      },
      backToHome: "Tornar a l'Inici"
    },
    // Our Team Page
    ourTeam: {
      title: "El Nostre Equip de Massatge",
      subtitle: "Coneix les mans expertes darrere del teu moment de benestar",
      intro: "A Lavin, ens enorgullim del nostre equip de massatge. Cada persona aporta el seu propi tacte, anys de pràctica i una cura genuïna pel teu confort i benestar.",
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
      tagline: "On el benestar es converteix en art. Gaudeix del massatge i el benestar al cor de Barcelona.",
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
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('confession_lang')
      if (saved && translations[saved]) return saved
    } catch {
      // ignore
    }
    return 'es'
  })

  const t = translations[language] || translations.es

  const changeLanguage = (lang) => {
    if (!translations[lang]) return
    setLanguage(lang)
    try {
      localStorage.setItem('confession_lang', lang)
      document.documentElement.lang = lang
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    try {
      document.documentElement.lang = language
    } catch {
      // ignore
    }
  }, [language])

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

