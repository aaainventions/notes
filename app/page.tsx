import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import NotesPage from './notes/page'; // renamed to make separation clear

export default async function HomePage() {
  const auth = (await cookies()).get('auth');
  if (!auth || auth.value !== 'true') {
    redirect('/login');
  }

  return <NotesPage />;
}

