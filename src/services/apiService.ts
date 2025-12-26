import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
// import { City, Alumni, ApiResponse } from "../types/index";

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = "http://localhost:5000") {
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Token'ı localStorage'dan oku
    this.token = localStorage.getItem("authToken");
    if (this.token) {
      this.setAuthHeader(this.token);
    }

    // Response interceptor - 401 hatasını kontrol et
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/auth";
        }
        return Promise.reject(error);
      }
    );
  }

  private setAuthHeader(token: string) {
    this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    this.token = token;
  }

  public setToken(token: string) {
    this.setAuthHeader(token);
    localStorage.setItem("authToken", token);
  }

  public clearToken() {
    delete this.api.defaults.headers.common["Authorization"];
    this.token = null;
    localStorage.removeItem("authToken");
  }

  // Cities API
  async getAllCities(): Promise<AxiosResponse<any>> {
    return this.api.get("/api/cities");
  }

  // Auth API
  async register(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<AxiosResponse<any>> {
    const response = await this.api.post("/api/auth/register", data);
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async login(email: string, password: string): Promise<AxiosResponse<any>> {
    const response = await this.api.post("/api/auth/login", { email, password });
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async logout() {
    this.clearToken();
  }

  // User API
  async getUserProfile(): Promise<AxiosResponse<any>> {
    return this.api.get("/api/users/profile");
  }

  async updateUserProfile(data: {
    first_name?: string;
    last_name?: string;
    workplace?: string;
    location?: string;
    sector?: string;
    seniority?: string;
    position?: string;
  }): Promise<AxiosResponse<any>> {
    return this.api.patch("/api/users/profile", data);
  }

  async getUserById(userId: string): Promise<AxiosResponse<any>> {
    return this.api.get(`/api/users/${userId}`);
  }

  // Cities API
  async getCityStats(): Promise<AxiosResponse<any>> {
    return this.api.get("/api/cities/stats");
  }

  async searchCities(query: string): Promise<AxiosResponse<any>> {
    return this.api.get("/api/cities/search", { params: { query } });
  }

  async getCity(id: string): Promise<AxiosResponse<any>> {
    return this.api.get(`/api/cities/${id}`);
  }

  // Alumni API
  async getAllAlumni(): Promise<AxiosResponse<any>> {
    return this.api.get("/api/alumni");
  }

  async getAlumniStats(): Promise<AxiosResponse<any>> {
    return this.api.get("/api/alumni/stats");
  }

  async searchAlumni(params?: {
    city?: string;
    country?: string;
    department?: string;
    currentCompany?: string;
    searchTerm?: string;
  }): Promise<AxiosResponse<any>> {
    return this.api.get("/api/alumni/search", { params });
  }

  async getAlumni(id: string): Promise<AxiosResponse<any>> {
    return this.api.get(`/api/alumni/${id}`);
  }

  // Health Check
  async healthCheck(): Promise<AxiosResponse<any>> {
    return this.api.get("/api/health");
  }
}

export const apiService = new ApiService(
  import.meta.env.VITE_API_URL || "http://localhost:5000"
);

export default apiService;
