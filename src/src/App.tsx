import { useState, useRef, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Progress } from './components/ui/progress'
import { toast, Toaster } from 'sonner'

// Datos de países para WhatsApp
const COUNTRIES = [
  { code: "+34", flag: "🇪🇸", name: "España", placeholder: "612 34 56 78" },
  { code: "+52", flag: "🇲🇽", name: "México", placeholder: "55 1234 5678" },
  { code: "+54", flag: "🇦🇷", name: "Argentina", placeholder: "11 1234-5678" },
  { code: "+57", flag: "🇨🇴", name: "Colombia", placeholder: "300 123 4567" },
  { code: "+51", flag: "🇵🇪", name: "Perú", placeholder: "987 654 321" },
  { code: "+56", flag: "🇨🇱", name: "Chile", placeholder: "9 8765 4321" },
];

// Datos de las preguntas organizadas por bloques
const EVALUATION_DATA = {
  blocks: [
    {
      title: "🔹 Bloque 1 – Equilibrio Personal",
      subtitle: "",
      description: "Objetivo: detectar desgaste interno.",
      questions: [
        "Siento que estoy desperdiciando mi potencial y no avanzo como debería.",
        "Me frustro porque otros menos preparados que yo tienen más éxito.",
        "Procrastino en decisiones importantes que podrían cambiar mi vida.",
        "Siento que estoy estancado y repitiendo los mismos errores una y otra vez.",
        "Me agoto mentalmente por cosas que antes me resultaban fáciles.",
        "Tengo miedo de que se me esté acabando el tiempo para lograr mis metas.",
        "Me despierto por las noches pensando en problemas que no logro resolver.",
        "Siento que trabajo mucho pero no veo resultados proporcionales a mi esfuerzo.",
      ],
    },
    {
      title: "🔹 Bloque 2 – Relaciones",
      subtitle: "",
      description: "Objetivo: detectar patrones de desconexión.",
      questions: [
        "Las personas importantes en mi vida no me valoran como merezco.",
        "Siento que doy mucho más de lo que recibo en mis relaciones.",
        "Mi familia no entiende mis decisiones profesionales y me juzga constantemente.",
        "Evito conversaciones importantes porque temo el conflicto o el rechazo.",
        "Siento que tengo que fingir ser alguien diferente para que me acepten.",
        "Mi pareja no me apoya en mis proyectos y siento que me frena en lugar de impulsarme.",
        "Me rodeo de personas que se quejan constantemente y drenan mi energía.",
        "Tengo dificultades para establecer límites claros con las personas tóxicas.",
      ],
    },
    {
      title: "🔹 Bloque 3 – Ventas / Liderazgo / Influencia",
      subtitle: "",
      description: "Objetivo: detectar bloqueos en comunicación persuasiva.",
      questions: [
        "Pierdo oportunidades de negocio porque no sé cómo cerrar ventas efectivamente.",
        "Siento que no tengo la autoridad ni el respeto que debería tener en mi trabajo.",
        "Me cuesta cobrar lo que realmente valgo por mis servicios o productos.",
        "Veo cómo otros con menos experiencia consiguen mejores resultados que yo.",
        "No logro que la gente haga lo que necesito, aunque sea lo mejor para ellos.",
        "Siento que mi potencial económico está muy por debajo de lo que podría ser.",
        "Me da miedo hablar en público o presentar mis ideas ante grupos importantes.",
      ],
    },
  ],
};

type Screen = "welcome" | "whatsapp" | "evaluation" | "completed";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [currentBlock, setCurrentBlock] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [userWhatsApp, setUserWhatsApp] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const totalQuestions = EVALUATION_DATA.blocks.reduce((sum, block) => sum + block.questions.length, 0);
  const currentQuestionIndex = EVALUATION_DATA.blocks
    .slice(0, currentBlock)
    .reduce((sum, block) => sum + block.questions.length, 0) + currentQuestion;

  const handleStartEvaluation = () => {
    setCurrentScreen("whatsapp");
  };

  const handleWhatsAppSubmit = () => {
    if (!userWhatsApp.trim()) {
      toast.error("Por favor ingresa tu número de WhatsApp");
      return;
    }
    
    const cleanNumber = userWhatsApp.replace(/\D/g, '');
    if (cleanNumber.length < 6) {
      toast.error("Por favor ingresa un número de WhatsApp válido");
      return;
    }
    
    setCurrentScreen("evaluation");
    setCurrentBlock(0);
    setCurrentQuestion(0);
    setResponses([]);
  };

  const handleResponse = (value: number) => {
    const newResponses = [...responses, value];
    setResponses(newResponses);

    if (currentQuestion < EVALUATION_DATA.blocks[currentBlock].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentBlock < EVALUATION_DATA.blocks.length - 1) {
      setCurrentBlock(currentBlock + 1);
      setCurrentQuestion(0);
    } else {
      // Evaluación completada
      setCurrentScreen("completed");
      toast.success("¡Evaluación completada! Recibirás tus resultados pronto.");
    }
  };

  const handleGoBack = () => {
    if (responses.length === 0) return;

    const newResponses = responses.slice(0, -1);
    setResponses(newResponses);

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentBlock > 0) {
      setCurrentBlock(currentBlock - 1);
      setCurrentQuestion(EVALUATION_DATA.blocks[currentBlock - 1].questions.length - 1);
    }
  };

  if (currentScreen === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-stone-900 tracking-tight mb-4">
              🏆 Millonario Emocional
            </CardTitle>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-stone-800 leading-tight">
                Evaluación Gratuita
              </h2>
              <p className="text-lg text-stone-700 leading-relaxed">
                En pocos minutos descubrirás si tu <strong>COMPORTAMIENTO</strong> es tu mayor aliado o tu mayor freno.
              </p>
              <div className="space-y-2 text-left">
                <p className="text-stone-600 flex items-center">
                  👉 <span className="ml-2">Estrés que te impulsa o te roba energía.</span>
                </p>
                <p className="text-stone-600 flex items-center">
                  👉 <span className="ml-2">Relaciones profesionales y familiares que te restan o te suman.</span>
                </p>
                <p className="text-stone-600 flex items-center">
                  👉 <span className="ml-2">Influencia/Liderazgo/Ventas que abren puertas… o las cierran.</span>
                </p>
              </div>
              <p className="text-stone-600 italic">
                No hay respuestas buenas ni malas. Solo la verdad que necesitas para recuperar tu claridad.
              </p>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
              <p className="text-sm text-stone-600 font-medium">
                🔥 +2,847 personas ya han descubierto su potencial • Solo 5 minutos
              </p>
            </div>
            <Button 
              onClick={handleStartEvaluation}
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-900 hover:to-black w-full transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Empezar evaluación
            </Button>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-xs text-stone-500">
              <p className="leading-relaxed">
                <strong>Nota:</strong> Esta evaluación es una herramienta de autoconocimiento. Su objetivo es generar reflexión sobre áreas clave para el alto rendimiento.
              </p>
            </div>
          </CardContent>
        </Card>
        <Toaster richColors position="bottom-right" />
      </div>
    );
  }

  if (currentScreen === "whatsapp") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-stone-900">
              📱 Información de contacto
            </CardTitle>
            <p className="text-stone-600 mt-2">
              Para enviarte tus resultados personalizados
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <div className="flex gap-2">
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="flex items-center gap-2 px-3 py-2 border border-stone-300 rounded-md bg-white hover:bg-stone-50 min-w-[100px]"
                  >
                    <span>{selectedCountry.flag}</span>
                    <span className="text-sm">{selectedCountry.code}</span>
                  </button>
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-stone-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                      {COUNTRIES.map((country) => (
                        <button
                          key={country.code}
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowCountryDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-stone-50 text
