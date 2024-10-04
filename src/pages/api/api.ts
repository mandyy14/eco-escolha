import axios, { AxiosResponse, AxiosError } from "axios";
import { Target, Todo } from "../../types/types";

// Configurando API
const api = axios.create({
  baseURL: "https://todo-caio.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
  },
});

// Func para tratar erros
const handleError = (error: AxiosError): void => {
  if (error.response) {
    console.error("Erro na requisição:", error.response.data);
  } else if (error.request) {
    console.error("Nenhuma resposta recebida:", error.request);
  } else {
    console.error("Erro ao configurar a requisição:", error.message);
  }
  throw error;
};

// Função auxiliar para requisições com tratamento de erro
const handleRequest = async <T>(
  request: () => Promise<AxiosResponse<T>>
): Promise<T | undefined> => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    return undefined;
  }
};

// GET: All Targets
export const getTargets = async (): Promise<Target[] | undefined> => {
  return handleRequest(() => api.get("/api/Targets"));
};

//SOCORROOOOOOOOOO - caiu enviando payload para o servidor
export const createTarget = async (
  target: Omit<Target, "id">
): Promise<Target | undefined> => {
  console.log("Enviando payload para o servidor:", target);

  try {
    const response = await api.post("/api/Targets", target);
    console.log("Resposta do servidor:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar target:", error);
    return undefined;
  }
};

export const updateTarget = async (
  id: number,
  target: Omit<Target, "id">
): Promise<Target | undefined> => {
  return handleRequest(() => api.put(`/api/Targets/${id}`, target));
};

export const deleteTarget = async (id: number): Promise<void> => {
  await handleRequest(() => api.delete(`/api/Targets/${id}`));
};

// GET: All todos os Todos
export const getTodos = async (): Promise<Todo[] | undefined> => {
  return handleRequest(() => api.get("/api/Todo"));
};

export const createTodo = async (
  todo: Omit<Todo, "id">
): Promise<Todo | undefined> => {
  return handleRequest(() => api.post("/api/Todo", todo));
};

export const updateTodo = async (
  id: number,
  todo: Omit<Todo, "id">
): Promise<Todo | undefined> => {
  return handleRequest(() => api.put(`/api/Todo/${id}`, todo));
};

export const deleteTodo = async (id: number): Promise<void> => {
  await handleRequest(() => api.delete(`/api/Todo/${id}`));
};
