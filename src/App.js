import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import UkemenyOverview from './UkemenyOverview';
import RecipeManager from './RecipeManager';
import RecipeDetail from './RecipeDetail';
import { UkemenyProvider } from './UkemenyContext';

function App() {
  return (
    <UkemenyProvider>
      <Router>
        <div className="App">
          <nav className="bg-indigo-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
              <div className="text-xl font-bold">Ukemeny Planlegger</div>
              <ul className="flex space-x-6">
                <li>
                  <Link to="/" className="hover:text-indigo-200 transition-colors">
                    Ukemeny Oversikt
                  </Link>
                </li>
                <li>
                  <Link to="/recipes" className="hover:text-indigo-200 transition-colors">
                    Oppskrifter
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          
          <Routes>
            <Route path="/" element={<UkemenyOverview />} />
            <Route path="/recipes" element={<RecipeManager />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
          </Routes>
          
          {/* Footer */}
          <footer className="mt-10 text-center text-gray-600 text-sm pb-6">
            <div className="bg-yellow-50 p-6 rounded-xl shadow-sm max-w-3xl mx-auto">
              <h3 className="font-semibold mb-2 text-gray-800">Om Glutenfri & Melkefri Ukemenyplanlegger</h3>
              <p className="mb-2">
                Dette er en enkel app for å planlegge ukemenyer for personer med cøliaki og melkeproteinallergi.
                Du kan velge oppskrifter, tilpasse ukemenyen, og se den totale kostnaden.
              </p>
              <p>
                Alle data lagres lokalt i nettleseren din. Ingenting sendes til noen server.
              </p>
            </div>
            <p className="mt-6">© {new Date().getFullYear()} Ukemenyplanlegger</p>
          </footer>
        </div>
      </Router>
    </UkemenyProvider>
  );
}

export default App;