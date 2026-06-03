import type { CharacterResponseDto } from "@/api/model";
import { create } from "zustand";

interface CharacterState {
  character: CharacterResponseDto | null;
  /** Записать или полностью обновить данные персонажа */
  setCharacter: (character: CharacterResponseDto) => void;
  /** Частичное обновление статов на фронте для мгновенного отклика (оптимистичный UI) */
  updateCharacterData: (data: Partial<CharacterResponseDto>) => void;
  /** Очистить данные при логауте */
  clearCharacter: () => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  character: null,
  setCharacter: (character) => set({ character }),
  updateCharacterData: (data) =>
    set((state) => ({
      character: state.character ? { ...state.character, ...data } : null,
    })),
  clearCharacter: () => set({ character: null }),
}));
