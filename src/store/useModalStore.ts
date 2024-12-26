import { create } from "zustand";
import { User } from "../types/user";

// 상태 타입 정의
interface ModalState {
  isModalOpen: boolean;
  user: User | null;
  openModal: () => void;
  closeModal: () => void;
  setUser: (user: User) => void;
  logout: () => void;
}

// Zustand 스토어 생성
export const useModalStore = create<ModalState>((set) => ({
  isModalOpen: false,
  user: null,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, isModalOpen: false }),
}));

// 서버 상태 초기화하는 함수 추가
export function getServerModalState() {
  return useModalStore.getState()
}