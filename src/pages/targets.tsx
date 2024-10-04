import { useState, useEffect } from "react";
import { Target } from "../types/types";
import {
  createTarget,
  getTargets,
  updateTarget,
  deleteTarget,
} from "../pages/api/api";

const TargetsPage = () => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [newTarget, setNewTarget] = useState<string>("");
  const [editingTargetId, setEditingTargetId] = useState<number | null>(null);
  const [editTargetTitle, setEditTargetTitle] = useState<string>("");

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const data = await getTargets();
        if (data) {
          setTargets(data);
        }
      } catch (error) {
        console.error("Erro ao buscar targets:", error);
      }
    };

    fetchTargets();
  }, []);

  const handleAddTarget = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!newTarget) return;

    try {
      const newTargetData: Omit<Target, "id"> = {
        title: newTarget,
        isComplete: false,
        description: "",
        todo: [],
      };

      const createdTarget = await createTarget(newTargetData);

      if (createdTarget) {
        setTargets([...targets, createdTarget]);
        setNewTarget(""); // Limpa o input após a adição
      }
    } catch (error) {
      console.error("Erro ao adicionar target:", error);
    }
  };

  // Iniciar o processo de edição
  const handleEditTarget = (target: Target): void => {
    setEditingTargetId(target.id);
    setEditTargetTitle(target.title || "");
  };

  // Atualizar Target
  const handleUpdateTarget = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (editingTargetId === null || !editTargetTitle) return;

    try {
      const updatedTargetData: Omit<Target, "id"> = {
        title: editTargetTitle,
        isComplete: false,
        description: "",
        todo: [],
      };

      const updatedTarget = await updateTarget(
        editingTargetId,
        updatedTargetData
      );

      if (updatedTarget) {
        setTargets(
          targets.map((target) =>
            target.id === editingTargetId ? updatedTarget : target
          )
        );
        setEditingTargetId(null);
        setEditTargetTitle("");
      }
    } catch (error) {
      console.error("Erro ao atualizar target:", error);
    }
  };
  const handleDeleteTarget = async (id: number): Promise<void> => {
    try {
      await deleteTarget(id);
      setTargets(targets.filter((target) => target.id !== id));
    } catch (error) {
      console.error("Erro ao deletar target:", error);
    }
  };

  return (
    <div>
      <h1>Lista de Targets</h1>

      <form onSubmit={handleAddTarget}>
        <input
          type="text"
          value={newTarget}
          onChange={(e) => setNewTarget(e.target.value)}
          placeholder="Novo Target"
        />
        <button type="submit">Adicionar Target</button>
      </form>

      <ul>
        {targets.map((target) => (
          <li key={target.id}>
            {editingTargetId === target.id ? (
              <form onSubmit={handleUpdateTarget}>
                <input
                  type="text"
                  value={editTargetTitle}
                  onChange={(e) => setEditTargetTitle(e.target.value)}
                />
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setEditingTargetId(null)}>
                  Cancelar
                </button>
              </form>
            ) : (
              <>
                {target.title}
                <button onClick={() => handleEditTarget(target)}>Editar</button>
                <button onClick={() => handleDeleteTarget(target.id)}>
                  Deletar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TargetsPage;
