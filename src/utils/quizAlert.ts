import Swal from 'sweetalert2';

export const showQuizCompletionAlert = async (
  userLevel: number,
  userExp: number,
  totalQuestions: number,
  correctAnswers: number,
  onQuizList: () => void,
  onShowIncorrectModal: () => void
) => {
  const result = await Swal.fire({
    title: '퀴즈 완료!',
    html: `
      <p>현재 레벨: <strong>${userLevel}</strong></p>
      <p>현재 경험치: <strong>${userExp}/100</strong></p>
      <p>${totalQuestions}문제 중 <strong>${correctAnswers}문제</strong>를 맞추셨습니다.</p>
    `,
    icon: 'success',
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: '퀴즈 리스트로 돌아가기',
    cancelButtonText: '틀린 문제 확인하기',
  });

  if (result.isConfirmed) {
    onQuizList();
  } else {
    onShowIncorrectModal();
  }
};