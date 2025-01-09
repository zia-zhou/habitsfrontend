'use client'; 

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 


type Habit = {
  id: number;
  description: string;
  time: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
};

const HabitPage = () => {

  const [habitData, setHabitData] = useState<Habit[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [newDescription, setNewDescription] = useState<string>('');
  const [newTime, setNewTime] = useState<'morning' | 'afternoon' | 'evening' | ''>(''); 
  const [passcode, setPasscode] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
   
    const storedData = localStorage.getItem('habitData');
    setPasscode(localStorage.getItem('passcode') || '');

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const habitList = parsedData?.habitList ? JSON.parse(parsedData.habitList) : [];

        if (Array.isArray(habitList)) {
          const timeOrder: { [key: string]: number } = { morning: 0, afternoon: 1, evening: 2 };

         
          const sortedHabits = habitList.sort((a: any, b: any) => timeOrder[a.time] - timeOrder[b.time]);

          setHabitData(sortedHabits); 
          setLoading(false);
        } else {
          setError('Habit list data is not an array.');
          setLoading(false);
        }
      } catch (error) {
        setError('Failed to parse habit data from localStorage.');
        setLoading(false);
      }
    } else {
      setError('No habit data found.');
      setLoading(false);
    }
  }, []);

 
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => setNewDescription(e.target.value);
  const handleTimeChange = (e: ChangeEvent<HTMLSelectElement>) => setNewTime(e.target.value as 'morning' | 'afternoon' | 'evening');


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newDescription || !newTime) {
        alert('Please enter a description and select a time of day.');
        return;
    }

    const newHabit: Habit = {
      id: editingHabit ? editingHabit.id : Date.now(),
      description: newDescription,
      time: newTime,
      completed: false,
    };

    const updatedHabits = editingHabit
      ? habitData.map((habit) => (habit.id === editingHabit.id ? newHabit : habit))
      : [...habitData, newHabit];

    setHabitData(updatedHabits);
    localStorage.setItem('habitData', JSON.stringify({ habitList: JSON.stringify(updatedHabits) }));


    setNewDescription('');
    setNewTime('');
    setEditingHabit(null);
  };


  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setNewDescription(habit.description);
    setNewTime(habit.time);
  };

  const handleDelete = (habitId: number) => {
    const updatedHabits = habitData.filter((habit) => habit.id !== habitId);
    setHabitData(updatedHabits);
    localStorage.setItem('habitData', JSON.stringify({ habitList: JSON.stringify(updatedHabits) }));
  };

  
  const handleCompletionChange = (habitId: number) => {
    const updatedHabits = habitData.map((habit) =>
      habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
    );
    setHabitData(updatedHabits);
    localStorage.setItem('habitData', JSON.stringify({ habitList: JSON.stringify(updatedHabits) }));
  };

 
  const handleSaveAllToDb = () => {
    const habitsId = localStorage.getItem('ID');
    if (!habitsId) {
        alert('No ID found in localStorage!');
        return;
      }
    const id = parseInt(habitsId, 10);
   
    if (!id) {
      alert('No ID found in localStorage!');
      return;
    }
    fetch(`http://localhost:8080/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habits: JSON.stringify(habitData) })
    })
    .then((response) => {
        if(response.ok){
            setHabitData([]);
            localStorage.setItem('habitData', JSON.stringify({ habitList: [] }));
            localStorage.removeItem('ID');
            localStorage.removeItem('passcode');
            router.push('/'); 
            
          alert('All habits saved successfully to the database!');
        }
       
    })
    .catch((error) => alert('Error saving habits: ' + error.message));
  };

  
  const handleDeleteAllFromDb = () => {
   
    const habitsId = localStorage.getItem('ID');
    if (!habitsId) {
        alert('No ID found in localStorage!');
        return;
      }
    const id = parseInt(habitsId, 10);
   
    if (!id) {
      alert('No ID found in localStorage!');
      return;
    }
  
    fetch(`http://localhost:8080/remove/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
      
          setHabitData([]);
          localStorage.setItem('habitData', JSON.stringify({ habitList: [] }));
          localStorage.removeItem('ID');
          localStorage.removeItem('passcode');
          router.push('/'); 
          alert('All habits deleted successfully from the database!');
        } else {
          alert('Error deleting all habits from the database');
        }
      })
      .catch((error) => alert('Error deleting all habits: ' + error.message));
  };


  if (loading) return <div>Loading habits...</div>;
  if (error) return <div>{error}</div>;

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
            value={newDescription}
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
            value={newTime}
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

        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
            {editingHabit ? 'Update Habit' : 'Add Habit'}
          </button>

          
        </div>
      </form>

<button
            onClick={handleSaveAllToDb}
            className="bg-blue-500 text-white p-2 rounded mt-4"
          >
            Save All to Database
          </button>

        
          <button
            onClick={handleDeleteAllFromDb}
            className="bg-red-500 text-white p-2 rounded mt-4"
          >
            Delete All Habits
          </button>
    
      <h2 className="text-2xl font-semibold mt-8">Your Habits</h2>
      <ul className="mt-4">
        {habitData.map((habit) => (
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
                onClick={() => handleEdit(habit)}
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
    </div>
  );
};

export default HabitPage;
