import axios, { AxiosResponse, AxiosError } from "axios";
import { Target, Todo } from "../../types/types";

const api = axios.create({
  baseURL: "https://todo-caio.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
  },
});

// Func  para tratar erros
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

// GET: Pegar todos os Targets
export const getTargets = async (): Promise<Target[] | undefined> => {
  try {
    const response: AxiosResponse<Target[]> = await api.get("/api/Targets");
    return response.data;
  } catch (error) {
    handleError(error as AxiosError); // Tipagem explícita
    return undefined;
  }
};

// POST: Criar um novo Target
export const createTarget = async (
  target: Omit<Target, "id">
): Promise<Target | undefined> => {
  try {
    const response: AxiosResponse<Target> = await api.post(
      "/api/Targets",
      target
    );
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    return undefined;
  }
};

// PUT: Atualizar um Target existente
export const updateTarget = async (
  id: number,
  target: Omit<Target, "id">
): Promise<Target | undefined> => {
  try {
    const response: AxiosResponse<Target> = await api.put(
      `/api/Targets/${id}`, // Certifique-se de que a URL está correta e aceita o ID no parâmetro
      target
    );
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    return undefined;
  }
};

// DELETE: Deletar um Target existente
export const deleteTarget = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/Targets/${id}`);
  } catch (error) {
    handleError(error as AxiosError); // Tipagem explícita
  }
};

// Funções para Todos

// GET: Pegar todos os Todos
export const getTodos = async (): Promise<Todo[] | undefined> => {
  try {
    const response: AxiosResponse<Todo[]> = await api.get("/api/Todo");
    return response.data;
  } catch (error) {
    handleError(error as AxiosError); // Tipagem explícita
    return undefined;
  }
};

// POST: Criar um novo Todo
export const createTodo = async (
  todo: Omit<Todo, "id">
): Promise<Todo | undefined> => {
  try {
    const response: AxiosResponse<Todo> = await api.post("/api/Todo", todo);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError); // Tipagem explícita
    return undefined;
  }
};

// PUT: Atualizar um Todo existente
export const updateTodo = async (
  id: number,
  todo: Omit<Todo, "id">
): Promise<Todo | undefined> => {
  try {
    const response: AxiosResponse<Todo> = await api.put(
      `/api/Todo/${id}`,
      todo
    );
    return response.data;
  } catch (error) {
    handleError(error as AxiosError); // Tipagem explícita
    return undefined;
  }
};

// DELETE: Deletar um Todo existente
export const deleteTodo = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/Todo/${id}`);
  } catch (error) {
    handleError(error as AxiosError); // Tipagem explícita
  }
};
