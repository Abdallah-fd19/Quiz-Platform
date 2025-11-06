import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IoIosSearch } from "react-icons/io";
import api from '../services/api';

const Home = () => {
  const [pagination, setPagination] = useState({next:null, previous:null, quizzesCount:0, totalPages:0})
  const [currentPage, setCurrentPage] = useState(1)
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const fetchQuizzes = async (url = '/quizzes/') => {
      try {
        setLoading(true);
        const data = await api.getQuizzes(url);
        setQuizzes(data.results);
        setPagination((prev) => ({...prev, next: data.next, previous: data.previous, quizzesCount:data.count, totalPages:Math.ceil(data.count/6)}))
        const pageMatch = url ? url.match(/page=(\d+)/) : null;
        setCurrentPage(pageMatch ? Number(pageMatch[1]) : 1);
      } catch (err) {
        setError('Failed to load quizzes');
        console.error('Error fetching quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleChange = (e)=>{
    setSearch(e.target.value)
  }

  const filteredQuizzes = quizzes.filter((quiz)=>{
    return quiz.title.toLowerCase().includes(search.toLowerCase())
  })



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Master Any Subject</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create, study, and share flashcards and quizzes to boost your learning
          </p>
          {!isAuthenticated && (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-white text-rose-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-rose-600 transition-colors inline-block"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quizzes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Available Quizzes</h2>
          <p className="text-gray-600 text-lg">
            Test your knowledge with our collection of quizzes
          </p>
        </div>
        <div className="max-w-[700px] mx-auto flex justify-center items-center gap-x-16">
          <div className="flex items-center w-full border-2 border-gray-200 rounded-xl px-4 hover:border-gray-300">
            <IoIosSearch className="text-gray-400 w-5 h-5"/>
            <input
              type="text"
              placeholder="Search by title"
              onChange={handleChange}
              value={search}
              className="w-full p-2 text-rose-500 outline-none bg-transparent"
            />            
          </div>

          
        </div>
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No quizzes available yet</h3>
            <p className="text-gray-500">Be the first to create a quiz!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
        <div className='flex justify-center items-center gap-3'>
          {pagination.previous && (
          <button onClick={() => fetchQuizzes(pagination.previous)} className='bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors cursor-pointer p-2 rounded-md'>Previous</button>
          )}
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <button key={i} onClick={() => fetchQuizzes(`/quizzes/?page=${i + 1}`)} className={`bg-rose-${currentPage === i + 1 ? "300" : "100"} text-rose-600 hover:bg-rose-200 transition-colors cursor-pointer p-2 rounded-md`}>
              {i + 1}
            </button>
          ))}
          {pagination.next && (
          <button onClick={() => fetchQuizzes(pagination.next)} className='bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors cursor-pointer p-2 rounded-md'>Next</button>
          )}

        </div>
      </div>
    </div>
  );
};

const QuizCard = ({ quiz }) => {
  const { isAuthenticated } = useAuth();
  const questionCount = quiz.questions?.length || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
            {quiz.title}
          </h3>
          <div className="bg-rose-100 text-rose-600 px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
            {questionCount} questions
          </div>
        </div>
        
        {quiz.description && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {quiz.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Created {new Date(quiz.created_at).toLocaleDateString()}
          </div>
          
          {isAuthenticated ? (
            <Link
              to={`/quiz/${quiz.id}`}
              className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors font-medium"
            >
              Start Quiz
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Login to Start
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
