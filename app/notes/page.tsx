'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


interface Note {
  _id: string;
  content: string;
  date: string;
  done: boolean;
}

export default function NotesPage() {

  
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('pending');

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const res = await axios.get<Note[]>('/api/notes');
      setNotes(res.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  }

  async function addNote() {
    if (!newNote.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    try {
      await axios.post('/api/notes', {
        content: newNote,
        date: today,
      });
      setNewNote('');
      fetchNotes();
    } catch (err) {
      console.error('Error adding note:', err);
    }
  }

  async function toggleDone(id: string, done: boolean) {
    try {
      await axios.patch(`/api/notes/${id}`, { done: !done });
      fetchNotes();
    } catch (err) {
      console.error('Error toggling done:', err);
    }
  }

  async function deleteNote(id: string) {
    try {
      await axios.delete(`/api/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  }

  async function editNote(id: string, content: string) {
    try {
      await axios.put(`/api/notes/${id}`, { content });
      setEditingNoteId(null);
      setEditContent('');
      fetchNotes();
    } catch (err) {
      console.error('Error editing note:', err);
    }
  }

  const filteredNotes = notes
    .filter((note) => note.content.toLowerCase().includes(search.toLowerCase()))
    .filter((note) => {
      if (filter === 'pending') return !note.done;
      if (filter === 'done') return note.done;
      return true;
    });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex gap-2 mb-4">
        <Input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add new note"
        />
        <Button onClick={addNote}>Add</Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full md:w-1/2"
        />
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'done' ? 'default' : 'outline'}
            onClick={() => setFilter('done')}
          >
            Done
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredNotes.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
            >
              <Card className={`relative group ${note.done ? 'bg-green-100 dark:bg-green-900' : ''}`}>
                <CardContent className="p-4">
                  {editingNoteId === note._id ? (
                    <div className="flex flex-col gap-2">
                      <Input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => editNote(note._id, editContent)}
                          size="sm"
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingNoteId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="font-medium text-lg mb-1 break-words">{note.content}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">{note.date}</div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleDone(note._id, note.done)}
                        >
                          {note.done ? 'Mark as Undone' : 'Mark as Done'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditContent(note.content);
                            setEditingNoteId(note._id);
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteNote(note._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
