import Swal from 'sweetalert2';

export const showIncorrectModal = async (
  words: { meaning: string }[],
  user: { Lv: number; Exp: number } | null,
  totalQuestions: number,
  correctAnswers: number,
  onBack: () => void,
  onLearning: () => void
) => {
  const result = await Swal.fire({
    title: '틀린 문제 확인',
    html: `
      <div style="text-align: left;">
        ${words.map((word, index) => `<p>${index + 1}. 의미: ${word.meaning}</p>`).join('')}
      </div>
    `,
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: '뒤로가기',
    cancelButtonText: '학습페이지로 이동하기',
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: '퀴즈 완료!',
      html: `
        <p>현재 레벨: <strong>${user?.Lv}</strong></p>
        <p>현재 경험치: <strong>${user?.Exp}/100</strong></p>
        <p>${totalQuestions}문제 중 <strong>${correctAnswers}</strong>문제를 맞추셨습니다.</p>
      `,
      icon: 'success',
      allowOutsideClick: false,
      confirmButtonText: '퀴즈 리스트로 돌아가기',
    });
    onBack();
  } else {
    onLearning();
  }
};