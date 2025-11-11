import { useEffect, useState } from "react";
import api from "../services/api";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler
);
const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState({})
  const  fetchDashboard = async ()=>{
    setIsLoading(true)
    setError(null)
    try {      
      const data = await api.dashboardData()
      setData(data)
    } catch (err) {
      setError(err.error)
    }
    finally{
      setIsLoading(false)
    }
  }
  useEffect(()=>{
    fetchDashboard()
  },[])

  if(isLoading){
    return(
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin size-32 rounded-full border-b-2 border-t-transparent border-rose-500"></div>
      </div>
      
    )
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
    <div className="p-6 space-y-6">

      {/* Page Header */}
      <h1 className="text-3xl font-bold">Welcome, {data.user_name}</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-600">Total attempts</p>
          <p className="text-2xl font-semibold">{data.total_attempts}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-600">Quizzes Average Score</p>
          <p className="text-2xl font-semibold">{Math.round((data.avg_score))}%</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-600">Correct / Wrong</p>
          <p className="text-xl font-semibold">✅ {data.correct_answers} / ❌ {data.wrong_answers}</p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Attempts Table */}
        <div className="bg-white text-center shadow rounded-lg p-4 border border-transparent hover:border-rose-500 transition-colors">
        <h2 className="text-xl font-semibold mb-3">Recent Attempts</h2>
        <table className="text-center border-collapse w-full">
          <thead>
            <tr className="border-b border-b-rose-500">
              <th className="p-2">Quiz</th>
              <th className="p-2">Last Score</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.recent_attempts.map((a)=>{
              return(
                <tr className="border-b border-b-rose-500 hover:bg-rose-50">
                  <td className="p-2">{a.quiz_title}</td>
                  <td className="p-2">{Math.round(a.score)}%</td>
                  <td className="p-2">{new Date(a.completed_at).toLocaleDateString("en-US",{month:"short", day:"numeric"})}</td>                
                </tr>
                )
            })}                        
          </tbody>
        </table>
        </div>
        {/* Performance Per Quiz */}
        <div className="bg-white text-center shadow rounded-lg p-4 border border-transparent hover:border-rose-500 transition-colors">
        <h2 className="text-xl font-semibold mb-3">Performance Per Quiz</h2>
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b border-b-rose-500">
              <th className="p-2">Quiz</th>
              <th className="p-2">Avg Score</th>
              <th className="p-2">Attempts</th>
            </tr>
          </thead>
          <tbody>
            {data.per_quiz_list.map((q)=>{
              return(
                <tr className="border-b border-b-rose-500 hover:bg-rose-50">
                  <td className="p-2">{q.quiz_title}</td>
                  <td className="p-2">{Math.round(q.avg_score)}%</td>
                  <td className="p-2">{q.attempts}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">

        {/* Line Chart - Recent Attempts */}
        <div className=" shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3 text-center">Recent Attempts</h2>
          <Line
            data={{
                labels: data.recent_attempts.map(a =>
                new Date(a.completed_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })
              ),
              datasets: [
                {
                  label: "Score (%)",
                  data: data.recent_attempts.map((a) => a.score),
                  borderColor: "#f43f5e",
                  backgroundColor: "rgba(244, 63, 94, 0.2)",
                  tension: 0.4, // smooth curve
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
                title: { display: false },
              },
              scales: {
                y: { beginAtZero: true, max: 100 },
              },
            }}
          />
        </div>

        {/* Bar Chart - Performance per Quiz */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3 text-center">Performance per Quiz</h2>
          <Bar
            data={{
              labels: data.per_quiz_list.map((q) => q.quiz_title),
              datasets: [
                {
                  label: "Avg Score (%)",
                  data: data.per_quiz_list.map((q) => q.avg_score),
                  backgroundColor: "rgb(244, 63, 94)",
                },
                {
                  label: "Attempts",
                  data: data.per_quiz_list.map((q) => q.attempts),
                  backgroundColor: "rgba(99,102,241,0.7)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>
            
    </div>
  );
};

export default Dashboard;
