import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, quiz } = location.state || {};

  if (!score && score !== 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No results found</h2>
          <p className="text-gray-600 mb-4">Please take a quiz first to see your results.</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding! You mastered this quiz!';
    if (score >= 80) return 'Great job! You did very well!';
    if (score >= 70) return 'Good work! You passed with flying colors!';
    if (score >= 60) return 'Not bad! You passed the quiz.';
    return 'Keep studying! You can do better next time.';
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🎉';
    if (score >= 80) return '👏';
    if (score >= 70) return '👍';
    if (score >= 60) return '😊';
    return '💪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{getScoreEmoji(score)}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz Complete!</h1>
          <p className="text-xl text-gray-600">{getScoreMessage(score)}</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {quiz?.title || 'Quiz Results'}
            </h2>
            
            <div className="mb-6">
              <div className={`text-6xl font-bold ${getScoreColor(score)} mb-2`}>
                {Math.round(score)}%
              </div>
              <div className="text-gray-600">
                {Math.round(score)} out of 100
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${
                  score >= 80 ? 'bg-green-500' : 
                  score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>

            {/* Performance Level */}
            <div className="inline-block px-6 py-2 rounded-full text-sm font-medium ${
              score >= 80 ? 'bg-green-100 text-green-800' : 
              score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }">
              {score >= 80 ? 'Excellent' : 
               score >= 60 ? 'Good' : 'Needs Improvement'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-rose-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors"
          >
            Back to Home
          </button>
          
          {quiz && (
            <button
              onClick={() => navigate(`/quiz/${quiz.id}`)}
              className="bg-gray-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Retake Quiz
            </button>
          )}
        </div>

        {/* Study Tips */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Study Tips
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                📚
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Review the Material</h4>
                <p className="text-gray-600 text-sm">
                  Go back and study the topics you missed to improve your understanding.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                🔄
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Practice Regularly</h4>
                <p className="text-gray-600 text-sm">
                  Consistent practice helps reinforce learning and improve retention.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                🎯
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Focus on Weak Areas</h4>
                <p className="text-gray-600 text-sm">
                  Identify and spend extra time on topics where you struggled.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                ⏰
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Take Your Time</h4>
                <p className="text-gray-600 text-sm">
                  Read questions carefully and don't rush through the quiz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
