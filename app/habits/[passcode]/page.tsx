'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  

const HabitPage = () => {
  const [habitData, setHabitData] = useState<any[]>([]);  
  const [error, setError] = useState<string>('');  
  const [loading, setLoading] = useState<boolean>(true);  
  const router = useRouter(); 

  useEffect(() => {
    
    const storedData = localStorage.getItem('habitData'); 

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


  const handleCompletionChange = (habitId: number) => {
    const updatedHabits = habitData.map((habit) => {
      if (habit.id === habitId) {
        const updatedHabit = { ...habit, completed: !habit.completed };
        return updatedHabit;
      }
      return habit;
    });

   
    setHabitData(updatedHabits);

  
    const storedData = localStorage.getItem('habitData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      parsedData.habitList = JSON.stringify(updatedHabits);
      localStorage.setItem('habitData', JSON.stringify(parsedData)); 
    }
  };


  if (error) {
    return <div className="text-red-500 text-lg">{error}</div>;
  }

 
  if (loading) {
    return <div className="text-lg">Loading habit data...</div>;
  }
  


  return (
    <div className="max-w-full mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Habits</h1>

    
      <button
        onClick={() => router.push('/')}  
        className="mb-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
      >
        Back to Home
      </button>

      <div className="flex justify-between">
     
        <div className="w-1/3 px-2">
          <h2 className="text-2xl font-semibold mt-8">Morning</h2>
          <div>
            {habitData
              .filter((habit) => habit.time === 'morning')
              .map((habit) => (
                <div key={habit.id} className="mb-3 p-3 border border-gray-300 rounded-md space-y-2">
                  <div className="text-sm">
                    <strong>Description:</strong> {habit.description}
                  </div>
                  <div className="text-sm">
                    <strong>Time of Day:</strong> {habit.time.charAt(0).toUpperCase() + habit.time.slice(1)}
                  </div>
                  <div className="flex items-center text-sm">
                    <label className="mr-2 flex items-center">
                      <input
                        type="checkbox"
                        checked={habit.completed}
                        onChange={() => handleCompletionChange(habit.id)}
                        className="mr-1 w-3 h-3"
                      />
                      {habit.completed ? 'Completed' : 'Not Completed'}
                    </label>
                  </div>
                </div>
              ))}
          </div>
        </div>

   
        <div className="w-1/3 px-2">
          <h2 className="text-2xl font-semibold mt-8">Afternoon</h2>
          <div>
            {habitData
              .filter((habit) => habit.time === 'afternoon')
              .map((habit) => (
                <div key={habit.id} className="mb-3 p-3 border border-gray-300 rounded-md space-y-2">
                  <div className="text-sm">
                    <strong>Description:</strong> {habit.description}
                  </div>
                  <div className="text-sm">
                    <strong>Time of Day:</strong> {habit.time.charAt(0).toUpperCase() + habit.time.slice(1)}
                  </div>
                  <div className="flex items-center text-sm">
                    <label className="mr-2 flex items-center">
                      <input
                        type="checkbox"
                        checked={habit.completed}
                        onChange={() => handleCompletionChange(habit.id)}
                        className="mr-1 w-3 h-3"
                      />
                      {habit.completed ? 'Completed' : 'Not Completed'}
                    </label>
                  </div>
                </div>
              ))}
          </div>
        </div>

   
        <div className="w-1/3 px-2">
          <h2 className="text-2xl font-semibold mt-8">Evening</h2>
          <div>
            {habitData
              .filter((habit) => habit.time === 'evening')
              .map((habit) => (
                <div key={habit.id} className="mb-3 p-3 border border-gray-300 rounded-md space-y-2">
                  <div className="text-sm">
                    <strong>Description:</strong> {habit.description}
                  </div>
                  <div className="text-sm">
                    <strong>Time of Day:</strong> {habit.time.charAt(0).toUpperCase() + habit.time.slice(1)}
                  </div>
                  <div className="flex items-center text-sm">
                    <label className="mr-2 flex items-center">
                      <input
                        type="checkbox"
                        checked={habit.completed}
                        onChange={() => handleCompletionChange(habit.id)}
                        className="mr-1 w-3 h-3"
                      />
                      {habit.completed ? 'Completed' : 'Not Completed'}
                    </label>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitPage;
