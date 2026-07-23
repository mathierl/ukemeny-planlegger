import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { TbChefHat } from 'react-icons/tb';
import './App.css';
import UkemenyOverview from './UkemenyOverview';
import RecipeManager from './RecipeManager';
import RecipeDetail from './RecipeDetail';
import { UkemenyProvider } from './UkemenyContext';

const navLinkClass = ({ isActive }) =>
  `px-3 py-1.5 rounded-full text-sm transition-colors ${
    isActive ? 'bg-terracotta-700 text-cream-50' : 'text-cream-100 hover:bg-terracotta-600'
  }`;

function App() {
  return (
    <UkemenyProvider>
      <Router>
        <div className="App min-h-screen bg-cream-50">
          <nav className="bg-terracotta-500 text-cream-50 shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <TbChefHat size={22} aria-hidden="true" />
                Ukemeny Planlegger
              </div>
              <ul className="flex gap-1">
                <li>
                  <NavLink to="/" end className={navLinkClass}>
                    Ukemeny Oversikt
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/recipes" className={navLinkClass}>
                    Oppskrifter
                  </NavLink>
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
          <footer className="mt-10 text-center text-charcoal-muted text-sm pb-6">
            <div className="bg-cream-100 p-6 rounded-xl shadow-sm max-w-3xl mx-auto border border-cream-400">
              <h3 className="font-semibold mb-2 text-charcoal">Om Glutenfri & Melkefri Ukemenyplanlegger</h3>
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