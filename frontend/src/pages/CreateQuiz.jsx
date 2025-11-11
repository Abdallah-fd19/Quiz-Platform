import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { RiRobot2Line } from "react-icons/ri";

const CreateQuiz = () => {
  const [formData, setFormData] = useState({ topic: '', num_questions: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);    
    try {
      const quiz = await api.generateQuiz({
        topic: formData.topic,
        num_questions: Number(formData.num_questions) || 5,
      });
      navigate(`/quiz/${quiz.id}`);
    } catch (err) {
      setError(err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex justify-center items-center bg-gradient-to-br from-rose-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-5xl">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Form */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-100 to-purple-100 rounded-full mb-4">
                  <RiRobot2Line className="text-rose-500 text-lg" />
                  <span className="text-sm font-semibold text-rose-700">AI Powered</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  Create Your Quiz
                </h1>
                <p className="text-gray-600 text-lg">
                  Generate a custom quiz powered by AI. Enter your topic and let us create engaging questions for you.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="topic"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Topic
                  </label>
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="e.g., JavaScript, World History, Biology"
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 
                             transition-all duration-200 placeholder:text-gray-400
                             hover:border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="num_questions"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    id="num_questions"
                    name="num_questions"
                    value={formData.num_questions}
                    onChange={handleChange}
                    placeholder="5"
                    min="1"
                    max="7"
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 
                             transition-all duration-200 placeholder:text-gray-400
                             hover:border-gray-300"
                  />
                  <p className="text-xs text-gray-500">Between 1 and 7 questions</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-purple-600 
                           text-white font-semibold rounded-xl shadow-lg
                           hover:from-rose-600 hover:to-purple-700 
                           transform hover:scale-[1.02] active:scale-[0.98]
                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin  h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <RiRobot2Line className="text-xl" />
                      <span>Generate Quiz</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Side - Visual Element */}
            <div className="hidden md:flex items-center justify-center p-12 
                          bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-600
                          relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-rose-300 rounded-full blur-2xl"></div>
              </div>
              
              {/* Robot Icon */}
              <div className="relative z-10 text-center">
                <div className="mb-6 inline-flex items-center justify-center w-32 h-32 
                              bg-white/20 backdrop-blur-md rounded-3xl 
                              border-2 border-white/30 shadow-2xl
                              transform hover:scale-110 transition-transform duration-300">
                  <RiRobot2Line className="text-white text-6xl" />
                </div>
                <h3 className="text-white text-2xl font-bold mb-2">AI Quiz Generator</h3>
                <p className="text-white/80 text-sm max-w-xs">
                  Create engaging quizzes in seconds with the power of artificial intelligence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold text-gray-800 mb-1">Fast Generation</h4>
            <p className="text-sm text-gray-600">Get your quiz ready in seconds</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold text-gray-800 mb-1">Custom Topics</h4>
            <p className="text-sm text-gray-600">Choose any subject you want</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-semibold text-gray-800 mb-1">Flexible Questions</h4>
            <p className="text-sm text-gray-600">Adjust the number of questions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
