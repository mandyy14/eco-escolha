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

export const createTarget = async (
  target: Omit<Target, "id">
): Promise<Target | undefined> => {
  const targetPayload = {
    ...target,
    todo: target.todo ?? [], // Inicializa `todo` como array vazio se estiver indefinido
  };

  console.log("Payload de criação:", targetPayload);

  return handleRequest(() => api.post("/api/Targets", targetPayload));
};

export const updateTarget = async (
  id: number,
  target: Omit<Target, "id">
): Promise<Target | undefined> => {
  const updatePayload = {
    title: target.title ?? "",
    isComplete: target.isComplete,
    description: target.description ?? "",
    todo: target.todo ?? [],
  };

  console.log("Payload de atualização:", updatePayload);

  return handleRequest(() => api.put(`/api/Targets/${id}`, updatePayload));
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
  const todoPayload = { ...todo };

  console.log("Payload de criação de Todo:", todoPayload);

  return handleRequest(() => api.post("/api/Todo", todoPayload));
};

export const updateTodo = async (
  id: number,
  todo: Omit<Todo, "id">
): Promise<Todo | undefined> => {
  const updatePayload = { ...todo };

  console.log("Payload de atualização de Todo:", updatePayload);

  return handleRequest(() => api.put(`/api/Todo/${id}`, updatePayload));
};

export const deleteTodo = async (id: number): Promise<void> => {
  await handleRequest(() => api.delete(`/api/Todo/${id}`));
};
