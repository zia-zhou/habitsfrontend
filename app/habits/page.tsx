'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const HabitAccess = () => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [habitData, setHabitData] = useState<any | null>(null); 
  const router = useRouter();

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasscode(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
  
      const clickedButton = e.nativeEvent.submitter?.name;

     
      const response = await fetch(`http://localhost:8080/${passcode}`);

      if (response.ok) {
        
        const habit = await response.json();
        

      
        localStorage.setItem('habitData', JSON.stringify(habit)); 
        localStorage.setItem('passcode', JSON.stringify(passcode));
        localStorage.setItem('ID', JSON.stringify(habit.id));
 
        if (clickedButton === 'access') {
         
          router.push(`/habits/${passcode}`);
        } else if (clickedButton === 'edit') {
         
          router.push(`/habits/modify/${passcode}`);
        }
      } else {
       
        setError('Invalid passcode or error fetching data.');
      }
    } catch (error) {
      setError('An error occurred while fetching the habit data.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Enter Passcode to Access Your Habits</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="passcode" className="block text-lg">Passcode:</label>
          <input
            type="text"
            id="passcode"
            value={passcode}
            onChange={handlePasswordChange}
            placeholder="Enter your passcode"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}

        
        <button
          type="submit"
          name="access"
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Access Habits
        </button>

      
        <button
          type="submit"
          name="edit"
          className="bg-yellow-500 text-white p-2 rounded mt-4"
        >
          Edit Your Habit
        </button>
      </form>

      {habitData && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Your Habit:</h2>
          <pre>{JSON.stringify(habitData, null, 2)}</pre>  
        </div>
      )}
    </div>
  );
};

export default HabitAccess;
