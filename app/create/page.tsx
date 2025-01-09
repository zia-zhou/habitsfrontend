'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 


type Habit = {
  id: number;
  description: string;
  time: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
};


const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const Habits = () => {
  
  const [habits, setHabits] = useState<Habit[]>([]);
  const [passcode, setPasscode] = useState<string>('');


  const [habitDescription, setHabitDescription] = useState<string>('');
  const [habitTime, setHabitTime] = useState<'morning' | 'afternoon' | 'evening' | ''>(''); 
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);

  const router = useRouter(); 

  
  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    const storedPasscode = localStorage.getItem('habitPasscode');

    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }

    if (storedPasscode) {
      setPasscode(storedPasscode);
    } else {
   
      const newPasscode = generatePasscode();
      setPasscode(newPasscode);
      localStorage.setItem('habitPasscode', newPasscode);
    }
  }, []);

 
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);


  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHabitDescription(e.target.value);
  };

 
  const handleTimeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setHabitTime(e.target.value as 'morning' | 'afternoon' | 'evening' | '');
  };

  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!habitDescription || !habitTime) {
      alert('Please fill out both fields!');
      return;
    }

    const newHabit: Habit = {
      id: editingHabitId ?? Date.now(), 
      description: habitDescription,
      time: habitTime as 'morning' | 'afternoon' | 'evening',
      completed: false, 
    };

    if (editingHabitId) {
     
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === editingHabitId ? { ...habit, ...newHabit } : habit
        )
      );
    } else {
  
      setHabits((prevHabits) => [...prevHabits, newHabit]);
    }

   
    setHabitDescription('');
    setHabitTime(''); 
    setEditingHabitId(null);
  };

 
  const handleEdit = (habitId: number) => {
    const habitToEdit = habits.find((habit) => habit.id === habitId);
    if (habitToEdit) {
      setEditingHabitId(habitToEdit.id);
      setHabitDescription(habitToEdit.description);
      setHabitTime(habitToEdit.time);
    }
  };


  const handleDelete = (habitId: number) => {
    const updatedHabits = habits.filter((habit) => habit.id !== habitId);

   
    setHabits(updatedHabits);

    
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  
  const handleCompletionChange = (habitId: number) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const saveHabitsToDatabase = async () => {
    try {
      const bodyData = {
        passcode: passcode, 
        habits: JSON.stringify(habits), 
      };
      
      const response = await fetch('http://localhost:8080/add', {
        method: 'POST',
        body: JSON.stringify(bodyData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        alert('Habits saved successfully!');
        localStorage.removeItem('habits');
        localStorage.removeItem('habitPasscode');
        router.push('/');
      } else {
        alert('Error saving habits to the database!');
      }
    } catch (error) {
      console.error('Error during saving habits:', error);
      alert('An error occurred while saving the habits.');
    }
  };
  

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create & Edit Your Habits</h1>


      <div className="mb-4">
        <p className="text-lg font-semibold">Your Habit List Passcode: {passcode}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="habit-description" className="block text-lg">Habit Description:</label>
          <input
            type="text"
            id="habit-description"
            value={habitDescription} 
            onChange={handleDescriptionChange}
            placeholder="E.g., Drink 8 cups of water"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="habit-time" className="block text-lg">Habit Time of Day:</label>
          <select
            id="habit-time"
            value={habitTime} 
            onChange={handleTimeChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Time of Day</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
          {editingHabitId ? 'Update Habit' : 'Add Habit'}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mt-8">Your Habits</h2>
      <ul className="mt-4">
        {habits.map((habit) => (
          <li key={habit.id} className="mb-2 flex justify-between items-center">
            <div>
              <strong>{habit.description}</strong> - <span className="italic">{habit.time}</span>
            </div>
            <div className="ml-4 flex items-center">
        
              <label className="mr-2">
                <input
                  type="checkbox"
                  checked={habit.completed}
                  onChange={() => handleCompletionChange(habit.id)}
                  className="mr-2"
                />
                Completed
              </label>

              <button
                onClick={() => handleEdit(habit.id)}
                className="bg-yellow-400 text-white p-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(habit.id)}
                className="bg-red-500 text-white p-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

    
      <div className="mt-4">
        <button
          onClick={saveHabitsToDatabase}
          className="bg-green-500 text-white p-2 rounded"
        >
          Save to Database
        </button>
        <button
        onClick={() => router.push('/')}  
        className="mb-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
      >
        Back to Home
      </button>
      </div>
    </div>
  );
};

export default Habits;
