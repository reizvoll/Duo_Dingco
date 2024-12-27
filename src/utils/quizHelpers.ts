// src/utils/quizHelpers.ts
import { supabase } from '@/supabase/supabaseClient';

type Word = {
    word: string;
    meaning: string;
  };
  
export const updateUserExpAndLevel = async (
  user: { id: string; Exp: number; Lv: number },
  setUser: React.Dispatch<React.SetStateAction<any>>
) => {
  if (user.Lv < 3) {
    let newExp = user.Exp + 10;
    let newLv = user.Lv;

    if (newExp >= 100) {
      newExp -= 100;
      newLv += 1;
    }

    if (newLv > 3) {
      newExp = 0;
      newLv = 3;
    }

    await supabase
      .from('users')
      .update({ Exp: newExp, Lv: newLv })
      .eq('id', user.id);

    setUser({ ...user, Exp: newExp, Lv: newLv });
  }
};

export const goToNextQuestion = (
  currentWordIndex: number,
  setCurrentWordIndex: React.Dispatch<React.SetStateAction<number>>,
  postWords: Word[],
  setRandomOptions: (postWords: Word[], currentWord: Word, allWords: Word[]) => void,
  allWords: Word[]
) => {
  setCurrentWordIndex((prevIndex) => {
    const totalWords = postWords.length || 0;
    const nextIndex = (prevIndex + 1) % totalWords;
    const nextWord = postWords[nextIndex];
    if (nextWord) setRandomOptions(postWords, nextWord, allWords);
    return nextIndex;
  });
};
