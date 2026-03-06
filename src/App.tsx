import { useState } from 'react'
import './App.css'
import { Card } from './components/card/card';
import { useFoodData } from './hooks/useFoodList';
import { FoodFormModal } from './components/food-form-modal/food-form-modal';
import { useFoodDelete } from './hooks/useFoodDelete';
import type { FoodData } from './types/FoodData';

function App() {
  const { data } = useFoodData();

  const deleteMutation = useFoodDelete();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodData | null>(null);

  return (
    <div className="container">

      <header className="header">
        <div>
          <h1>Cardápio</h1>
          <p>Gerencie os produtos do seu restaurante</p>
        </div>

        <button 
          className="btn-create"
          onClick={() => setIsCreateOpen(true)}
        >
          + Novo produto
        </button>
      </header>

      <main className="content">

        <div className="card-grid">
          {data?.map(foodData => (
            <Card 
              key = {foodData.id}
              price = {foodData.price} 
              title = {foodData.title} 
              image = {foodData.image}
              onEdit = {() => setSelectedFood(foodData)}
            onDelete={() => {
              if(confirm("Deseja deletar esse produto?")) {
                deleteMutation.mutate(foodData.id!)
              }
            }}
            />
            ))}
        </div>

      </main>

      {/*Modal create*/}
      {isCreateOpen && (
        <FoodFormModal
          mode="create"
          closeModal={() => setIsCreateOpen(false)}
        />
      )}

      {/* Modal update */}
      {selectedFood && (
        <FoodFormModal
          mode="update"
          food={selectedFood}
          closeModal={() => setSelectedFood(null)}
        />
      )}

    </div>
  );
}

export default App
