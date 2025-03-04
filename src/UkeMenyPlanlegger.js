// UkemenyPlanlegger.js
import React, { useState, useEffect } from 'react';
import MenuManager from './MenuManager';

const UkemenyPlanlegger = () => {
  // State for recipes
  const [oppskrifter, setOppskrifter] = useState([
    // Here you can add your default recipes
    {
      id: 1,
      navn: "Kjøttdeiggryte med ris",
      tidsbruk: "20-30 minutter",
      vanskelighetsgrad: "Enkel",
      ingredienser: [
        { navn: "Kjøttdeig", mengde: "400g", pris: 65 },
        { navn: "Løk", mengde: "1 stk", pris: 5 },
        { navn: "Paprika", mengde: "1 stk", pris: 15 },
        { navn: "Hermetiske tomater", mengde: "1 boks", pris: 15 },
        { navn: "Glutenfri buljongterning", mengde: "1 stk", pris: 3 },
        { navn: "Ris", mengde: "2 dl", pris: 10 }
      ],
      fremgangsmaate: [
        "Finhakk løk og paprika.",
        "Brun kjøttdeigen i en gryte.",
        "Tilsett løk og paprika, stek i 2-3 minutter.",
        "Ha i hermetiske tomater og buljongterning.",
        "La småkoke i 15 minutter.",
        "Kok ris etter anvisning på pakken.",
        "Server kjøttdeiggryta over risen."
      ],
      allergener: []
    },
    // Add more recipes...
  ]);
  
  // State for user interaction
  const [valgteMaaltider, setValgteMaaltider] = useState([]);
  const [budsjett, setBudsjett] = useState(1000);
  const [visBudsjett, setVisBudsjett] = useState(false);
  const [visDetaljer, setVisDetaljer] = useState(null);
  const [sokeord, setSokeord] = useState('');
  const [filtrerteOppskrifter, setFiltrerteOppskrifter] = useState(oppskrifter);
  const [feilmelding, setFeilmelding] = useState('');

  // Filter recipes based on search term
  useEffect(() => {
    const filtrerte = oppskrifter.filter(oppskrift => 
      oppskrift.navn.toLowerCase().includes(sokeord.toLowerCase())
    );
    setFiltrerteOppskrifter(filtrerte);
  }, [sokeord, oppskrifter]);

  // Add a meal to the weekly menu
  const leggTilMaaltid = (oppskrift) => {
    if (valgteMaaltider.length >= 7) {
      setFeilmelding('Du kan maksimalt ha 7 måltider i ukemenyen');
      return;
    }
    
    if (valgteMaaltider.find(maaltid => maaltid.id === oppskrift.id)) {
      setFeilmelding('Denne oppskriften er allerede i ukemenyen');
      return;
    }
    
    setValgteMaaltider([...valgteMaaltider, oppskrift]);
    setFeilmelding('');
  };

  // Remove a meal from the weekly menu
  const fjernMaaltid = (index) => {
    const nyeMaaltider = [...valgteMaaltider];
    nyeMaaltider.splice(index, 1);
    setValgteMaaltider(nyeMaaltider);
  };

  // Calculate total price of the menu
  const beregnTotalPris = () => {
    return valgteMaaltider.reduce((total, maaltid) => {
      const maaltidPris = maaltid.ingredienser.reduce((sum, ingrediens) => 
        sum + ingrediens.pris, 0);
      return total + maaltidPris;
    }, 0);
  };

  // Generate shopping list based on selected meals
  const lagHandleliste = () => {
    // Gather all ingredients
    const alleIngredienser = [];
    valgteMaaltider.forEach(maaltid => {
      maaltid.ingredienser.forEach(ingrediens => {
        alleIngredienser.push({
          maaltid: maaltid.navn,
          ...ingrediens
        });
      });
    });
    
    // Consolidate similar ingredients
    const grupperteIngredienser = {};
    alleIngredienser.forEach(ingrediens => {
      if (!grupperteIngredienser[ingrediens.navn]) {
        grupperteIngredienser[ingrediens.navn] = {
          navn: ingrediens.navn,
          mengde: [ingrediens.mengde],
          pris: ingrediens.pris,
          maaltider: [ingrediens.maaltid]
        };
      } else {
        // Same ingredient used in multiple meals
        if (!grupperteIngredienser[ingrediens.navn].maaltider.includes(ingrediens.maaltid)) {
          grupperteIngredienser[ingrediens.navn].mengde.push(ingrediens.mengde);
          grupperteIngredienser[ingrediens.navn].maaltider.push(ingrediens.maaltid);
          // Don't add price multiple times
        }
      }
    });
    
    return Object.values(grupperteIngredienser);
  };

  // Toggle recipe details view
  const toggleVisDetaljer = (id) => {
    if (visDetaljer === id) {
      setVisDetaljer(null);
    } else {
      setVisDetaljer(id);
    }
  };

  // Handle loading a saved menu
  const handleLoadMenu = (loadedMeals, loadedBudget) => {
    setValgteMaaltider(loadedMeals);
    
    if (loadedBudget) {
      setBudsjett(loadedBudget);
    }
    
    setVisDetaljer(null);
    setFeilmelding('');
  };

  const ukedager = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Glutenfri & Melkefri Ukemenyplanlegger</h1>
      
      {feilmelding && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{feilmelding}</span>
          <span 
            className="absolute top-0 bottom-0 right-0 px-4 py-3" 
            onClick={() => setFeilmelding('')}
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left column - Recipes */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Oppskrifter</h2>
            
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Søk etter oppskrifter..."
                  className="w-full p-2 border rounded pl-10"
                  value={sokeord}
                  onChange={(e) => setSokeord(e.target.value)}
                />
                <svg 
                  className="absolute left-3 top-2.5 text-gray-400" 
                  width="18" 
                  height="18" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filtrerteOppskrifter.map((oppskrift) => (
                <div key={oppskrift.id} className="border rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{oppskrift.navn}</h3>
                      <p className="text-sm text-gray-600">
                        Tidsbruk: {oppskrift.tidsbruk} | 
                        Pris: {oppskrift.ingredienser.reduce((sum, i) => sum + i.pris, 0)} kr
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-500"
                        onClick={() => toggleVisDetaljer(oppskrift.id)}
                      >
                        {visDetaljer === oppskrift.id ? 'Skjul' : 'Vis'}
                      </button>
                      <button 
                        className="bg-green-500 text-white rounded px-2 py-1 text-sm"
                        onClick={() => leggTilMaaltid(oppskrift)}
                      >
                        + Legg til
                      </button>
                    </div>
                  </div>
                  
                  {visDetaljer === oppskrift.id && (
                    <div className="mt-3 text-sm">
                      <div className="mb-2">
                        <strong>Ingredienser:</strong>
                        <ul className="list-disc pl-5">
                          {oppskrift.ingredienser.map((ingrediens, idx) => (
                            <li key={idx}>
                              {ingrediens.navn} ({ingrediens.mengde}) - {ingrediens.pris} kr
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Fremgangsmåte:</strong>
                        <ol className="list-decimal pl-5">
                          {oppskrift.fremgangsmaate.map((steg, idx) => (
                            <li key={idx}>{steg}</li>
                          ))}
                        </ol>
                      </div>
                      <div className="mt-2">
                        <strong>Allergener:</strong> {oppskrift.allergener.length === 0 ? 'Ingen' : oppskrift.allergener.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {filtrerteOppskrifter.length === 0 && (
                <p className="text-center py-4 text-gray-500">Ingen oppskrifter funnet.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column - Weekly menu and shopping list */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Din ukemeny</h2>
            
            <div className="space-y-2 mb-4">
              {valgteMaaltider.length === 0 ? (
                <p className="text-center py-4 text-gray-500">
                  Ingen måltider lagt til. Velg måltider fra listen til venstre.
                </p>
              ) : (
                valgteMaaltider.map((maaltid, index) => (
                  <div key={index} className="border rounded p-2 flex justify-between items-center">
                    <div>
                      <span className="font-medium">{ukedager[index]}</span>: {maaltid.navn}
                    </div>
                    <button 
                      className="text-red-500"
                      onClick={() => fjernMaaltid(index)}
                    >
                      Fjern
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex justify-between items-center border-t pt-2">
              <div>
                <span className="font-medium">Totalpris:</span> {beregnTotalPris()} kr
              </div>
              <div>
                <span className="font-medium">Budsjett:</span> {budsjett} kr
              </div>
            </div>
            
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${beregnTotalPris() > budsjett ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(beregnTotalPris() / budsjett * 100, 100)}%` }}
                ></div>
              </div>
              {beregnTotalPris() > budsjett && (
                <p className="text-red-500 text-xs mt-1">
                  Du er {beregnTotalPris() - budsjett} kr over budsjett
                </p>
              )}
              {beregnTotalPris() <= budsjett && beregnTotalPris() > 0 && (
                <p className="text-green-500 text-xs mt-1">
                  Du er {budsjett - beregnTotalPris()} kr under budsjett
                </p>
              )}
            </div>
            
            <div className="mt-4">
              <button 
                className="text-blue-500 text-sm"
                onClick={() => setVisBudsjett(!visBudsjett)}
              >
                {visBudsjett ? 'Skjul budsjettjustering' : 'Juster budsjett'}
              </button>
              
              {visBudsjett && (
                <div className="mt-2">
                  <input
                    type="range"
                    min="500"
                    max="2000"
                    step="100"
                    value={budsjett}
                    onChange={(e) => setBudsjett(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>500 kr</span>
                    <span>2000 kr</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Handleliste</h2>
            
            {valgteMaaltider.length === 0 ? (
              <p className="text-center py-4 text-gray-500">
                Legg til måltider for å generere en handleliste.
              </p>
            ) : (
              <div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {lagHandleliste().map((ingrediens, index) => (
                    <div key={index} className="flex justify-between text-sm py-1 border-b">
                      <div>
                        <span className="font-medium">{ingrediens.navn}</span>
                        <div className="text-xs text-gray-500">
                          Brukes i: {ingrediens.maaltider.join(', ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div>{ingrediens.mengde.join(' + ')}</div>
                        <div className="text-gray-600">{ingrediens.pris} kr</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-2 border-t flex justify-between font-medium">
                  <span>Total kostnad:</span>
                  <span>{beregnTotalPris()} kr</span>
                </div>
                
                <button 
                  className="mt-4 bg-blue-500 text-white w-full py-2 rounded font-medium"
                  onClick={() => alert('Handleliste lagret!')}
                >
                  Lagre handleliste
                </button>
              </div>
            )}
          </div>
          
          {/* Add the MenuManager component here */}
          <MenuManager 
            meals={valgteMaaltider} 
            budget={budsjett}
            onLoadMenu={handleLoadMenu}
          />
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg text-sm">
        <h3 className="font-semibold mb-2">Om Glutenfri & Melkefri Ukemenyplanlegger</h3>
        <p>
          Dette er en enkel app for å planlegge ukemenyer for personer med cøliaki og melkeproteinallergi.
          Du kan velge oppskrifter, tilpasse ukemenyen, og se den totale kostnaden.
        </p>
        <p className="mt-2">
          Alle data lagres lokalt i nettleseren din og forsvinner ikke når du lukker nettleseren.
        </p>
      </div>
    </div>
  );
};

export default UkemenyPlanlegger;