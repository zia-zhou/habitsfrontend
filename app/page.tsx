

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const UsersPage = () => {
  const router = useRouter();

  
  const handleCreateHabitList = () => {
    router.push('/create'); 
  };




  const handleEnterHabitSession = () => {
    router.push('/habits'); 
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="space-y-4">
        <button
          onClick={handleCreateHabitList}
          className="bg-blue-500 text-white p-4 rounded w-full"
        >
          Create New Habit List
        </button>

        

        <button
          onClick={handleEnterHabitSession}
          className="bg-green-500 text-white p-4 rounded w-full"
        >
          Enter / Modify / Delete Habits
        </button>
      </div>
    </div>
  );
};

export default UsersPage;
