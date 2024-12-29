import { supabase } from '@/supabase/supabaseClient';
import { Tables } from '../../../../database.types';

type Word = {
    word: string;
    meaning: string;
  };

export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const fetchUserData = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, Exp, Lv')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const fetchPostData = async (postId: string) => {
  const [allWordsResponse, postResponse] = await Promise.all([
    supabase.from('posts').select('words'),
    supabase.from('posts').select('id, title, words, description').eq('id', postId).single(),
  ]);

  if (allWordsResponse.error) throw allWordsResponse.error;
  if (postResponse.error) throw postResponse.error;

  const mergedWords = allWordsResponse.data
    ?.map((post) => post.words)
    .flat();

  const post = postResponse.data as Tables<'posts'>;

  return {
    mergedWords,
    post: { ...post, words: post.words as Word[] }, 
  };
};
