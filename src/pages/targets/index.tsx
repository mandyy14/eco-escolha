import { useState, useEffect } from "react";
import { Target } from "../../types/types";
import {
  createTarget,
  getTargets,
  updateTarget,
  deleteTarget,
} from "../api/api";
import * as S from "../targets/styles";

const TargetsPage = () => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [newTarget, setNewTarget] = useState<string>("");
  const [editingTargetId, setEditingTargetId] = useState<number | null>(null);
  const [editTargetTitle, setEditTargetTitle] = useState<string>("");

  // Carregar Targets na inicialização
  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const data = await getTargets();
        if (data) setTargets(data);
      } catch (error) {
        console.error("Erro ao buscar targets:", error);
      }
    };
    fetchTargets();
  }, []);

  // Adicionar Target
  const handleAddTarget = async (e: React.FormEvent) => {
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
        setNewTarget(""); // Limpar o input após a adição
      }
    } catch (error) {
      console.error("Erro ao adicionar target:", error);
    }
  };

  // Edição de Target
  const handleEditTarget = (target: Target) => {
    setEditingTargetId(target.id);
    setEditTargetTitle(target.title || "");
  };

  // Atualizar Target
  const handleUpdateTarget = async (e: React.FormEvent) => {
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
        setEditTargetTitle(""); // Limpar o campo de edição
      }
    } catch (error) {
      console.error("Erro ao atualizar target:", error);
    }
  };

  // Deletar Target
  const handleDeleteTarget = async (id: number) => {
    try {
      await deleteTarget(id);
      setTargets(targets.filter((target) => target.id !== id));
    } catch (error) {
      console.error("Erro ao deletar target:", error);
    }
  };

  return (
    <S.Container>
      <S.Title>Lista de Targets</S.Title>
      <S.Form onSubmit={handleAddTarget}>
        <S.Input
          type="text"
          value={newTarget}
          onChange={(e) => setNewTarget(e.target.value)}
          placeholder="Novo Target"
        />
        <S.Button type="submit">Adicionar Target</S.Button>
      </S.Form>

      <S.TargetList>
        {targets.map((target) => (
          <S.TargetItem key={target.id}>
            {editingTargetId === target.id ? (
              <S.EditForm onSubmit={handleUpdateTarget}>
                <S.Input
                  type="text"
                  value={editTargetTitle}
                  onChange={(e) => setEditTargetTitle(e.target.value)}
                />
                <S.ButtonGroup>
                  <S.Button type="submit">Salvar</S.Button>
                  <S.Button
                    type="button"
                    onClick={() => setEditingTargetId(null)}
                  >
                    Cancelar
                  </S.Button>
                </S.ButtonGroup>
              </S.EditForm>
            ) : (
              <>
                <span>{target.title}</span>
                <S.ButtonGroup>
                  <S.Button onClick={() => handleEditTarget(target)}>
                    Editar
                  </S.Button>
                  <S.Button onClick={() => handleDeleteTarget(target.id)}>
                    Deletar
                  </S.Button>
                </S.ButtonGroup>
              </>
            )}
          </S.TargetItem>
        ))}
      </S.TargetList>
    </S.Container>
  );
};

export default TargetsPage;
