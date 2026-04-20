/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Moon, Sun, Stars, Compass, Send, Loader2, RefreshCw, ChevronRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAstrologyInsights, UserDetails, AstrologyInsights } from './services/gemini';

const translations: Record<string, any> = {
  English: {
    title: "Insights",
    subtitle: "Know Thyself.",
    personalAlignment: "Subject Parameters",
    personalAlignmentSub: "Provide birth data for systematic cross-disciplinary analysis.",
    firstName: "First Name",
    lastName: "Last Name",
    birthDate: "Birth Date",
    birthTime: "Birth Time",
    placeOfBirth: "Place of Birth",
    responseLanguage: "Response Language",
    analysisDate: "Analysis Date",
    timeframe: "Timeframe",
    yourQuestion: "Inquiry",
    analyzeBtn: "Execute Analysis",
    consulting: "Processing Data...",
    newInquiry: "New Inquiry",
    numerology: "Numerology",
    westernAstrology: "Western Astrology",
    kpSystem: "KP System",
    chineseAstrology: "Chinese Astrology",
    vibrationalPath: "Numerical Assessment",
    westernInterpretation: "Western Interpretation",
    kpInterpretation: "KP Interpretation",
    zodiacWisdom: "Zodiacal Evaluation",
    cosmicSynthesis: "Analytical Synthesis",
    error: "System error: Data retrieval failed. Please retry later.",
    guidedBy: "Analytical Framework",
    placeholders: {
      firstName: "Aria",
      lastName: "Moon",
      placeOfBirth: "Sedona, Arizona",
      question: "Provide inquiry for analysis..."
    },
    timeframes: {
      "Selected Day Only": "Selected Day Only",
      "3 Days Following": "3 Days Following",
      "Week Following": "Week Following",
      "Month of Selected Day": "Month of Selected Day"
    }
  },
  Dutch: {
    title: "Inzichten",
    subtitle: "Ken Uzelf.",
    personalAlignment: "Onderwerpparameters",
    personalAlignmentSub: "Verstrek geboortegegevens voor systematische cross-disciplinaire analyse.",
    firstName: "Voornaam",
    lastName: "Achternaam",
    birthDate: "Geboortedatum",
    birthTime: "Geboortetijd",
    placeOfBirth: "Geboorteplaats",
    responseLanguage: "Antwoordtaal",
    analysisDate: "Analysedatum",
    timeframe: "Tijdsbestek",
    yourQuestion: "Aanvraag",
    analyzeBtn: "Analyse Uitvoeren",
    consulting: "Gegevens Verwerken...",
    newInquiry: "Nieuwe Aanvraag",
    numerology: "Numerologie",
    westernAstrology: "Westerse Astrologie",
    kpSystem: "KP-systeem",
    chineseAstrology: "Chinese Astrologie",
    vibrationalPath: "Numerieke Beoordeling",
    westernInterpretation: "Westerse Interpretatie",
    kpInterpretation: "KP-interpretatie",
    zodiacWisdom: "Zodiacale Evaluatie",
    cosmicSynthesis: "Analytische Synthese",
    error: "Systeemfout: Gegevens ophalen mislukt. Probeer het later opnieuw.",
    guidedBy: "Analytisch Kader",
    placeholders: {
      firstName: "Aria",
      lastName: "Maan",
      placeOfBirth: "Amsterdam, Nederland",
      question: "Voer aanvraag in voor analyse..."
    },
    timeframes: {
      "Selected Day Only": "Alleen Geselecteerde Dag",
      "3 Days Following": "Volgende 3 Dagen",
      "Week Following": "Volgende Week",
      "Month of Selected Day": "Maand van Geselecteerde Dag"
    }
  },
  German: {
    title: "Einblicke",
    subtitle: "Erkenne dich selbst.",
    personalAlignment: "Subjektparameter",
    personalAlignmentSub: "Geben Sie Geburtsdaten für eine systematische interdisziplinäre Analyse an.",
    firstName: "Vorname",
    lastName: "Nachname",
    birthDate: "Geburtsdatum",
    birthTime: "Geburtszeit",
    placeOfBirth: "Geburtsort",
    responseLanguage: "Antwortsprache",
    analysisDate: "Analysedatum",
    timeframe: "Zeitraum",
    yourQuestion: "Anfrage",
    analyzeBtn: "Analyse ausführen",
    consulting: "Daten werden verarbeitet...",
    newInquiry: "Neue Anfrage",
    numerology: "Numerologie",
    westernAstrology: "Westliche Astrologie",
    kpSystem: "KP-System",
    chineseAstrology: "Chinesische Astrologie",
    vibrationalPath: "Numerische Bewertung",
    westernInterpretation: "Westliche Interpretation",
    kpInterpretation: "KP-Interpretation",
    zodiacWisdom: "Zodiakale Bewertung",
    cosmicSynthesis: "Analytische Synthese",
    error: "Systemfehler: Datenabruf fehlgeschlagen. Bitte später erneut versuchen.",
    guidedBy: "Analytischer Rahmen",
    placeholders: {
      firstName: "Aria",
      lastName: "Mond",
      placeOfBirth: "Berlin, Deutschland",
      question: "Anfrage für Analyse eingeben..."
    },
    timeframes: {
      "Selected Day Only": "Nur ausgewählter Tag",
      "3 Days Following": "Folgende 3 Tage",
      "Week Following": "Folgende Woche",
      "Month of Selected Day": "Monat des ausgewählten Tages"
    }
  },
  Spanish: {
    title: "Visiones",
    subtitle: "Conócete a ti mismo.",
    personalAlignment: "Parámetros del Sujeto",
    personalAlignmentSub: "Proporcione datos de nacimiento para un análisis sistemático interdisciplinario.",
    firstName: "Nombre",
    lastName: "Apellido",
    birthDate: "Fecha de Nacimiento",
    birthTime: "Hora de Nacimiento",
    placeOfBirth: "Lugar de Nacimiento",
    responseLanguage: "Idioma de Respuesta",
    analysisDate: "Fecha de Análisis",
    timeframe: "Plazo",
    yourQuestion: "Consulta",
    analyzeBtn: "Ejecutar Análisis",
    consulting: "Procesando Datos...",
    newInquiry: "Nueva Consulta",
    numerology: "Numerología",
    westernAstrology: "Astrología Occidental",
    kpSystem: "Sistema KP",
    chineseAstrology: "Astrología China",
    vibrationalPath: "Evaluación Numérica",
    westernInterpretation: "Interpretación Occidental",
    kpInterpretation: "Interpretación KP",
    zodiacWisdom: "Evaluación Zodiacal",
    cosmicSynthesis: "Síntesis Analítica",
    error: "Error del sistema: Fallo en la recuperación de datos. Reintente más tarde.",
    guidedBy: "Marco Analítico",
    placeholders: {
      firstName: "Aria",
      lastName: "Luna",
      placeOfBirth: "Madrid, España",
      question: "Proporcione consulta para análisis..."
    },
    timeframes: {
      "Selected Day Only": "Solo día seleccionado",
      "3 Days Following": "Siguientes 3 días",
      "Week Following": "Siguiente semana",
      "Month of Selected Day": "Mes del día seleccionado"
    }
  },
  French: {
    title: "Aperçus",
    subtitle: "Connais-toi toi-même.",
    personalAlignment: "Paramètres du Sujet",
    personalAlignmentSub: "Fournir les données de naissance pour une analyse systématique interdisciplinaire.",
    firstName: "Prénom",
    lastName: "Nom",
    birthDate: "Date de Naissance",
    birthTime: "Heure de Naissance",
    placeOfBirth: "Lieu de Naissance",
    responseLanguage: "Langue de Réponse",
    analysisDate: "Date d'Analyse",
    timeframe: "Période",
    yourQuestion: "Demande",
    analyzeBtn: "Exécuter l'Analyse",
    consulting: "Traitement des Données...",
    newInquiry: "Nouvelle Demande",
    numerology: "Numérologie",
    westernAstrology: "Astrologie Occidentale",
    kpSystem: "Système KP",
    chineseAstrology: "Astrologie Chinoise",
    vibrationalPath: "Évaluation Numérique",
    westernInterpretation: "Interprétation Occidentale",
    kpInterpretation: "Interprétation KP",
    zodiacWisdom: "Évaluation Zodiacale",
    cosmicSynthesis: "Synthèse Analytique",
    error: "Erreur système : Échec de la récupération des données. Veuillez réessayer plus tard.",
    guidedBy: "Cadre Analytique",
    placeholders: {
      firstName: "Aria",
      lastName: "Lune",
      placeOfBirth: "Paris, France",
      question: "Fournir une demande pour analyse..."
    },
    timeframes: {
      "Selected Day Only": "Jour sélectionné uniquement",
      "3 Days Following": "3 jours suivants",
      "Week Following": "Semaine suivante",
      "Month of Selected Day": "Mois du jour sélectionné"
    }
  }
};

export default function App() {
  const [details, setDetails] = useState<UserDetails>({
    firstName: '',
    lastName: '',
    dob: '',
    timeOfBirth: '',
    placeOfBirth: '',
    question: '',
    language: 'English',
    currentDate: new Date().toLocaleDateString(),
    analysisDate: new Date().toISOString().split('T')[0],
    timeframe: 'Selected Day Only',
  });

  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<AstrologyInsights | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = translations[details.language] || translations.English;

  const isFormValid = useMemo(() => {
    return (
      details.firstName.trim() !== '' &&
      details.lastName.trim() !== '' &&
      details.dob !== '' &&
      details.timeOfBirth !== '' &&
      details.placeOfBirth.trim() !== '' &&
      details.question.trim() !== ''
    );
  }, [details]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (value: string) => {
    setDetails(prev => ({ ...prev, language: value }));
  };

  const handleTimeframeChange = (value: string) => {
    setDetails(prev => ({ ...prev, timeframe: value }));
  };

  const handleAnalyze = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getAstrologyInsights({
        ...details,
        currentDate: new Date().toLocaleDateString(details.language === 'English' ? 'en-US' : details.language === 'Dutch' ? 'nl-NL' : details.language === 'German' ? 'de-DE' : details.language === 'Spanish' ? 'es-ES' : 'fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        analysisDate: new Date(details.analysisDate).toLocaleDateString(details.language === 'English' ? 'en-US' : details.language === 'Dutch' ? 'nl-NL' : details.language === 'German' ? 'de-DE' : details.language === 'Spanish' ? 'es-ES' : 'fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
      setInsights(result);
    } catch (err) {
      setError(t.error);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInsights(null);
    setDetails(prev => ({ ...prev, question: '' }));
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 md:p-10 font-sans selection:bg-accent-gold selection:text-bg-deep">
      <div className="max-w-6xl w-full flex flex-col h-full">
        {/* Header */}
        <header className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-4xl font-sans font-bold tracking-[0.2em] uppercase gold-text">
              {t.title}
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-text-dim text-sm mt-2 tracking-wide"
          >
            {t.subtitle} • {new Date().toLocaleDateString(details.language === 'English' ? 'en-US' : details.language === 'Dutch' ? 'nl-NL' : details.language === 'German' ? 'de-DE' : details.language === 'Spanish' ? 'es-ES' : 'fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })}
          </motion.p>
        </header>

        <main className="flex-grow">
          <div className={`grid gap-8 ${insights ? 'lg:grid-cols-[340px_1fr]' : 'max-w-xl mx-auto'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key="form-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel p-6 space-y-6 h-fit"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-serif gold-text">{t.personalAlignment}</h2>
                  <p className="text-text-dim text-xs">{t.personalAlignmentSub}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-[11px] uppercase tracking-wider text-text-dim">{t.firstName}</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder={t.placeholders.firstName}
                      value={details.firstName}
                      onChange={handleInputChange}
                      className="bg-black/5 border-glass-border text-text-main placeholder:text-text-dim/40 focus:border-accent-gold transition-colors h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-[11px] uppercase tracking-wider text-text-dim">{t.lastName}</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder={t.placeholders.lastName}
                      value={details.lastName}
                      onChange={handleInputChange}
                      className="bg-black/5 border-glass-border text-text-main placeholder:text-text-dim/40 focus:border-accent-gold transition-colors h-10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="dob" className="text-[11px] uppercase tracking-wider text-text-dim">{t.birthDate}</Label>
                      <Input
                        id="dob"
                        name="dob"
                        type="date"
                        value={details.dob}
                        onChange={handleInputChange}
                        className="bg-black/5 border-glass-border text-text-main focus:border-accent-gold transition-colors h-10 [color-scheme:light]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="timeOfBirth" className="text-[11px] uppercase tracking-wider text-text-dim">{t.birthTime}</Label>
                      <Input
                        id="timeOfBirth"
                        name="timeOfBirth"
                        type="time"
                        value={details.timeOfBirth}
                        onChange={handleInputChange}
                        className="bg-black/5 border-glass-border text-text-main focus:border-accent-gold transition-colors h-10 [color-scheme:light]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="placeOfBirth" className="text-[11px] uppercase tracking-wider text-text-dim">{t.placeOfBirth}</Label>
                    <Input
                      id="placeOfBirth"
                      name="placeOfBirth"
                      placeholder={t.placeholders.placeOfBirth}
                      value={details.placeOfBirth}
                      onChange={handleInputChange}
                      className="bg-black/5 border-glass-border text-text-main placeholder:text-text-dim/40 focus:border-accent-gold transition-colors h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="language" className="text-[11px] uppercase tracking-wider text-text-dim">{t.responseLanguage}</Label>
                    <Select onValueChange={handleLanguageChange} value={details.language}>
                      <SelectTrigger className="bg-black/5 border-glass-border text-text-main focus:border-accent-gold h-10">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-glass-border text-text-main">
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Dutch">Nederlands</SelectItem>
                        <SelectItem value="German">Deutsch</SelectItem>
                        <SelectItem value="Spanish">Español</SelectItem>
                        <SelectItem value="French">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="analysisDate" className="text-[11px] uppercase tracking-wider text-text-dim">{t.analysisDate}</Label>
                      <Input
                        id="analysisDate"
                        name="analysisDate"
                        type="date"
                        value={details.analysisDate}
                        onChange={handleInputChange}
                        className="bg-black/5 border-glass-border text-text-main focus:border-accent-gold transition-colors h-10 [color-scheme:light]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="timeframe" className="text-[11px] uppercase tracking-wider text-text-dim">{t.timeframe}</Label>
                      <Select onValueChange={handleTimeframeChange} value={details.timeframe}>
                        <SelectTrigger className="bg-black/5 border-glass-border text-text-main focus:border-accent-gold h-10">
                          <SelectValue placeholder="Select Timeframe" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-glass-border text-text-main">
                          <SelectItem value="Selected Day Only">{t.timeframes["Selected Day Only"]}</SelectItem>
                          <SelectItem value="3 Days Following">{t.timeframes["3 Days Following"]}</SelectItem>
                          <SelectItem value="Week Following">{t.timeframes["Week Following"]}</SelectItem>
                          <SelectItem value="Month of Selected Day">{t.timeframes["Month of Selected Day"]}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="question" className="text-[11px] uppercase tracking-wider text-text-dim">{t.yourQuestion}</Label>
                    <Textarea
                      id="question"
                      name="question"
                      placeholder={t.placeholders.question}
                      value={details.question}
                      onChange={handleInputChange}
                      className="bg-black/5 border-glass-border text-text-main placeholder:text-text-dim/40 focus:border-accent-gold transition-colors min-h-[80px] resize-none text-sm"
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-xs italic text-center">{error}</p>
                  )}

                  <Button
                    onClick={handleAnalyze}
                    disabled={!isFormValid || loading}
                    className="w-full h-12 bg-accent-gold hover:bg-accent-gold/90 text-white font-bold uppercase tracking-[2px] rounded-xl gold-shadow transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      t.analyzeBtn
                    )}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {insights && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="grid gap-4">
                    {/* Numerology */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="glass-panel p-6 flex gap-5 items-start"
                    >
                      <div className="icon-circle text-xl gold-text font-serif">{insights.lifePathNumber}</div>
                      <div className="space-y-1">
                        <span className="badge">{t.numerology}</span>
                        <h3 className="text-lg font-serif gold-text">{t.vibrationalPath}</h3>
                        <p className="text-sm leading-relaxed text-text-main/85">{insights.numerology}</p>
                      </div>
                    </motion.div>

                    {/* Western Astrology */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="glass-panel p-6 flex gap-5 items-start"
                    >
                      <div className="icon-circle text-2xl gold-text">☀️</div>
                      <div className="space-y-1">
                        <span className="badge">{t.westernAstrology}</span>
                        <h3 className="text-lg font-serif gold-text">{t.westernInterpretation}</h3>
                        <p className="text-sm leading-relaxed text-text-main/85">{insights.westernAstrology}</p>
                      </div>
                    </motion.div>

                    {/* KP System */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="glass-panel p-6 flex gap-5 items-start"
                    >
                      <div className="icon-circle text-2xl gold-text">☾</div>
                      <div className="space-y-1">
                        <span className="badge">{t.kpSystem}</span>
                        <h3 className="text-lg font-serif gold-text">{t.kpInterpretation}</h3>
                        <p className="text-sm leading-relaxed text-text-main/85">{insights.kpSystem}</p>
                      </div>
                    </motion.div>

                    {/* Chinese Astrology */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="glass-panel p-6 flex gap-5 items-start"
                    >
                      <div className="icon-circle text-2xl gold-text">{insights.chineseZodiacAnimal}</div>
                      <div className="space-y-1">
                        <span className="badge">{t.chineseAstrology}</span>
                        <h3 className="text-lg font-serif gold-text">{t.zodiacWisdom}</h3>
                        <p className="text-sm leading-relaxed text-text-main/85">{insights.chineseAstrology}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Final Conclusion */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-panel p-8 border-t-4 border-accent-gold/50"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-accent-gold/10 rounded-lg">
                        <Sparkles className="w-6 h-6 gold-text" />
                      </div>
                      <h3 className="text-2xl font-serif gold-text">{t.cosmicSynthesis}</h3>
                    </div>
                    <p className="text-lg leading-relaxed text-text-main italic font-light">
                      {insights.conclusion}
                    </p>
                  </motion.div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={handleReset}
                      className="text-accent-gold hover:text-accent-gold/80 hover:bg-black/5"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {t.newInquiry}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center mt-10 opacity-50">
          <p className="text-[10px] uppercase tracking-[0.3em] text-text-dim">
            © {new Date().getFullYear()} {t.title} • {t.guidedBy}
          </p>
        </footer>
      </div>
    </div>
  );
}
