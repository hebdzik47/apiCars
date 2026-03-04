import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const API_URL = "http://192.168.103.91:5005/api/cars";

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");




  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error("Błąd pobierania danych:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchCars();
  }, []);

  const addCar = async (newCar) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCar),
      });



      if (!response.ok) {
        throw new Error("Błąd podczas dodawania");
      }

      const savedCar = await response.json();
      setCars((prevCars) => [...prevCars, savedCar]);
    } catch (error) {
      console.error("Błąd dodawania auta:", error);
    }
  };

  const deleteCar = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Błąd podczas usuwania");
      }

      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
    } catch (error) {
      console.error("Błąd usuwania auta:", error);
    }
  };



  const shownCars = cars.filter(
    (car) =>
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) || car.brand.toLowerCase().includes(searchTerm.toLowerCase()) || car.description.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center mb-4">Lista Samochodów</h1>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="🔍 Szukaj po modelu, marce lub opisie..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : (
        <div className="row">
          {shownCars.map((car) => (
            <div key={car.id} className="col-12 col-sm-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={car.img}
                  className="card-img-top"
                  alt={car.model}
                  style={{ height: "200px", objectFit: "cover" }}
                />

                <div className="card-body d-flex flex-column">
                  <h6 className="text-muted mb-1">{car.brand}</h6>
                  <h5 className="card-title fw-bold">{car.model}</h5>

                  <p className="card-text mb-1">
                    <strong>Rok:</strong> {car.year}
                  </p>

                  <p className="card-text mb-1">
                    <strong>Cena:</strong>{" "}
                    <span className="text-primary fw-semibold">
                      {car.price} zł
                    </span>
                  </p>

                  <p className="card-text text-muted small mb-3">
                    {car.description}
                  </p>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="badge bg-secondary">
                      ID: {car.id}
                    </span>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteCar(car.id)}
                    >
                      Usuń
                    </button>
                  </div>
                </div>

              </div>

            </div>

          ))}
        </div>
      )}



      <h2 className="mt-5">Dodaj Samochód</h2>

      <form
        className="row g-3"
        onSubmit={(e) => {
          e.preventDefault();

          const newCar = {
            brand: e.target.brand.value,  model: e.target.model.value,
            year: parseInt(e.target.year.value),  price: parseFloat(e.target.price.value),
            img: e.target.img.value,  description: e.target.description.value,
          };

          addCar(newCar);
          e.target.reset();
        }}

      >
        <div className="col-md-3">
          <input
            type="text"   name="brand"
            className="form-control"  placeholder="Marka"  required
          />
        </div>

        <div className="col-md-3">
          <input
          type="text"  name="model"
            className="form-control"   placeholder="Model"    required
          />
        </div>

        <div className="col-md-2">
          <input
            type="number"     name="year"
            className="form-control"   placeholder="Rok"   required
          />
        </div>

        <div className="col-md-2">
          <input
            type="number"  name="price"  step="0.01"   
             className="form-control"  placeholder="Cena" required
          />
        </div>

        <div className="col-md-2">
          <input
            type="text"     name="img"
           className="form-control"     placeholder="URL zdjęcia"  required
          />
        </div>

        <div className="col-12">
          <textarea
            name="description"  className="form-control"
            placeholder="Opis samochodu"  rows="3"   required
          ></textarea>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">

            Dodaj
          </button>
        </div>

      </form>
      
    </div>

  );
}

export default App;