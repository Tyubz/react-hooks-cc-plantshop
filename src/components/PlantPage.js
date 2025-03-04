import React, { useState, useEffect } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:6001/plants")
      .then((response) => response.json())
      .then((data) => setPlants(data))
      .catch((error) => console.error("Error fetching plants:", error));
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleToggleStock = (id) => {
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === id ? { ...plant, inStock: !plant.inStock } : plant
      )
    );

    // Optionally, update the backend
    const plantToUpdate = plants.find((plant) => plant.id === id);
    if (plantToUpdate) {
      fetch(`http://localhost:6001/plants/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inStock: !plantToUpdate.inStock }),
      })
        .then((response) => response.json())
        .then((updatedPlant) => {
          setPlants((prevPlants) =>
            prevPlants.map((plant) =>
              plant.id === id ? updatedPlant : plant
            )
          );
        })
        .catch((error) => console.error("Error updating plant:", error));
    }
  };

  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      <NewPlantForm onAddPlant={(newPlant) => setPlants([...plants, newPlant])} />
      <Search onSearch={handleSearch} />
      <PlantList plants={filteredPlants} onToggleStock={handleToggleStock} />
    </main>
  );
}

export default PlantPage;
