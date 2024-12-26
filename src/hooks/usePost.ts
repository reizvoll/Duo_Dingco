import { supabase } from '@/supabase/supabase'
import { PostCard } from '@/types/PostCard'
import { useEffect, useState } from 'react'

export function usePost() {
  const [cards, setCards] = useState<PostCard[]>([
    { id: 1, word: '', meaning: '' },
  ])
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const mockSignIn = async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: '123123@naver.com', // Mock email from your Users table
        password: '123123', // Use a valid password for the mock user
      })

      if (error) {
        console.error('Mock sign-in failed:', error.message)
      } else {
        console.log('Mock user signed in:', data.user)
      }
    }

    const fetchSession = async () => {
      await mockSignIn() // Perform mock sign-in
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Error fetching session:', error)
        return
      }

      if (session?.user?.id) {
        setUserId(session.user.id)
      } else {
        console.error('No active session or user ID found.')
      }
    }

    fetchSession()
  }, [])

  const handleAddCard = () => {
    const newCard = {
      id: cards.length + 1,
      word: '',
      meaning: '',
    }
    setCards([...cards, newCard])
  }

  const handleRemoveCard = (id: number) => {
    setCards(cards.filter((card) => card.id !== id))
  }

  const handleInputChange = (
    id: number,
    field: 'word' | 'meaning',
    value: string,
  ) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card,
      ),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      throw new Error(
        'User ID is missing. This should never happen. Please ensure the user is authenticated.',
      )
    }

    const words = cards.map((card) => ({
      word: card.word,
      meaning: card.meaning,
    }))

    try {
      const { data: userCheck, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .limit(1)
        .single()

      if (userError || !userCheck) {
        console.error('User validation failed:', userError)
        return
      }

      const { data, error } = await supabase.from('posts').insert([
        {
          title,
          description,
          words,
          user_id: userCheck.id, // Ensure the user exists in the users table
        },
      ])

      if (error) {
        console.error('Error inserting data:', error)
      } else {
        console.log('Data inserted successfully:', data)
        setTitle('')
        setDescription('')
        setCards([{ id: 1, word: '', meaning: '' }])
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  return {
    cards,
    title,
    description,
    setTitle,
    setDescription,
    handleAddCard,
    handleRemoveCard,
    handleInputChange,
    handleSubmit,
  }
}
