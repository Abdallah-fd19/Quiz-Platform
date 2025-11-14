import { FaBrain, FaLightbulb, FaBolt, FaBullseye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
 
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaBrain className="w-16 h-16 text-yellow-300 mr-3 animate-pulse" />
            <h1 className="text-6xl font-bold text-white animate-bounce">QuizMaster</h1>
          </div>
          <p className="text-2xl text-rose-100 font-medium">
            AI-Powered Quiz Generation
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
          Test your knowledge with intelligent, AI-generated questions tailored to any topic. 
          Challenge yourself, track your progress, and master new subjects with personalized quizzes.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
            <FaLightbulb className="w-10 h-10 text-yellow-300 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-white mb-2">AI Generated</h3>
            <p className="text-rose-100 text-sm">
              Smart questions created instantly on any topic
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
            <FaBolt className="w-10 h-10 text-yellow-300 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-white mb-2">Instant Feedback</h3>
            <p className="text-rose-100 text-sm">
              Get immediate results and detailed explanations
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
            <FaBullseye className="w-10 h-10 text-yellow-300 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-white mb-2">Track Progress</h3>
            <p className="text-rose-100 text-sm">
              Monitor your improvement and master new skills
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-rose-600 rounded-lg font-semibold text-lg hover:bg-rose-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
          >
            Sign Up Free
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-all w-full sm:w-auto"
          >
            Log In
          </button>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-rose-200 text-sm">
          Join QuizMater to improve your knowledge
        </p>
      </div>
    </div>
  );
}