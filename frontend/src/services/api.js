const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async request(endpoint, options = {}) {
    // Check if endpoint is already a full URL
    let url;
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      url = endpoint;
    } else {
      url = `${this.baseURL}${endpoint}`;
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshToken();
        if (refreshed) {
          config.headers.Authorization = `Bearer ${this.token}`;
          return fetch(url, config);
        } else {
          this.clearToken();
          window.location.href = '/login';
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/users/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.access);
        localStorage.setItem('refresh_token', data.refresh);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  }

  // Auth endpoints
  async login(username, password) {
    const response = await this.request('/users/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok){
      throw new Error(data.error||"something went wrong")
    }
    this.setToken(data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  }

  async register(username, email, password, password2) {
    const response = await this.request('/users/register/', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, password2 }),
    });
    const data = await response.json();

    if (!response.ok){
      throw new Error(data.error||"something went wrong")
    }

    return data
  }

  async getProfile() {
    const response = await this.request('/users/profile/');
    return response.json();
  }

  // Quiz endpoints
  async getQuizzes(url = '/quizzes/') {
    const response = await this.request(url);
    return response.json();
  }

  async getQuiz(id) {
    const response = await this.request(`/quizzes/${id}/`);
    return response.json();
  }

  async submitQuiz(quizId, answers) {
    const response = await this.request(`/quizzes/${quizId}/submit/`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
    return response.json();
  }
  
  async generateQuiz(payload) {
    const response = await this.request('/quizzes/generate-quiz/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.json();
  }
  async dashboardData(){
    const response = await this.request('/quizzes/dashboard/stats/')
    return response.json();
  }
}



export default new ApiService();
