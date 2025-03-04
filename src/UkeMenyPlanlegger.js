// UkemenyPlanlegger.js - Complete implementation exactly matching design examples
import React, { useState, useEffect } from 'react';
import MenuManager from './MenuManager';
import RecipeForm from './RecipeForm';
import { FiSearch, FiPlusCircle, FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi';

const UkemenyPlanlegger = () => {
  // State for recipes
  const [oppskrifter, setOppskrifter] = useState([
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
    {
      id: 2,
      navn: "Bakt søtpotet med kikerter",
      tidsbruk: "45 minutter",
      vanskelighetsgrad: "Middels",
      ingredienser: [
        { navn: "Søtpotet", mengde: "2 stk", pris: 25 },
        { navn: "Kikerter", mengde: "1 boks", pris: 15 },
        { navn: "Tahini", mengde: "2 ss", pris: 10 }
      ],
      fremgangsmaate: [
        "Forvarm ovnen til 200°C.",
        "Prikk hull i søtpotetene med en gaffel.",
        "Bak søtpotetene i ca. 40 minutter til de er møre.",
        "Bland kikerter med krydder og varm opp.",
        "Server kikertene over de bakte søtpotetene med tahini på topp."
      ],
      allergener: []
    },
    {
      id: 3,
      navn: "Quinoasalat med avokado",
      tidsbruk: "15 minutter",
      vanskelighetsgrad: "Enkel",
      ingredienser: [
        { navn: "Quinoa", mengde: "1 dl", pris: 18 },
        { navn: "Avokado", mengde: "1 stk", pris: 20 },
        { navn: "Sitron", mengde: "1/2 stk", pris: 5 }
      ],
      fremgangsmaate: [
        "Kok quinoa etter anvisning på pakken.",
        "Avkjøl quinoaen.",
        "Skjær avokado i terninger.",
        "Bland avokado med quinoa.",
        "Press over sitronsaft og server."
      ],
      allergener: []
    }
  ]);
  
  // User interaction state
  const [valgteMaaltider, setValgteMaaltider] = useState([]);
  const [budsjett, setBudsjett] = useState(1000);
  const [visBudsjett, setVisBudsjett] = useState(false);
  const [visDetaljer, setVisDetaljer] = useState(null);
  const [sokeord, setSokeord] = useState('');
  const [filtrerteOppskrifter, setFiltrerteOppskrifter] = useState(oppskrifter);
  const [feilmelding, setFeilmelding] = useState('');
  const [visOppskriftForm, setVisOppskriftForm] = useState(false);

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
    const alleIngredienser = [];
    valgteMaaltider.forEach(maaltid => {
      maaltid.ingredienser.forEach(ingrediens => {
        alleIngredienser.push({
          maaltid: maaltid.navn,
          ...ingrediens
        });
      });
    });
    
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
        if (!grupperteIngredienser[ingrediens.navn].maaltider.includes(ingrediens.maaltid)) {
          grupperteIngredienser[ingrediens.navn].mengde.push(ingrediens.mengde);
          grupperteIngredienser[ingrediens.navn].maaltider.push(ingrediens.maaltid);
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

  // Random dish selection
  const velgTilfeldigMåltid = () => {
    if (oppskrifter.length === 0) {
      setFeilmelding('Ingen oppskrifter å velge fra');
      return;
    }
    
    const tilfeldigIndex = Math.floor(Math.random() * oppskrifter.length);
    const valgtOppskrift = oppskrifter[tilfeldigIndex];
    
    if (valgteMaaltider.find(måltid => måltid.id === valgtOppskrift.id)) {
      setFeilmelding('Denne oppskriften er allerede i ukemenyen. Prøv igjen.');
      return;
    }
    
    if (valgteMaaltider.length >= 7) {
      setFeilmelding('Du kan maksimalt ha 7 måltider i ukemenyen');
      return;
    }
    
    setValgteMaaltider([...valgteMaaltider, valgtOppskrift]);
    setFeilmelding('');
  };
  
  // Random week menu generation
  const genererUkemeny = () => {
    if (oppskrifter.length < 7) {
      setFeilmelding(`Du har kun ${oppskrifter.length} oppskrifter. Legg til flere for å generere en hel ukemeny.`);
      return;
    }
    
    setValgteMaaltider([]);
    
    const tilgjengeligeOppskrifter = [...oppskrifter];
    const nyUkemeny = [];
    
    for (let i = 0; i < 7; i++) {
      if (tilgjengeligeOppskrifter.length === 0) break;
      
      const tilfeldigIndex = Math.floor(Math.random() * tilgjengeligeOppskrifter.length);
      nyUkemeny.push(tilgjengeligeOppskrifter[tilfeldigIndex]);
      
      tilgjengeligeOppskrifter.splice(tilfeldigIndex, 1);
    }
    
    setValgteMaaltider(nyUkemeny);
    setFeilmelding('');
  };

  // Add new recipe handler
  const leggTilOppskrift = (nyOppskrift) => {
    setOppskrifter([...oppskrifter, nyOppskrift]);
    setVisOppskriftForm(false);
  };

  const ukedager = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Glutenfri & Melkefri Ukemenyplanlegger
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Plan enkelt ukemenyer som passer for personer med cøliaki og melkeproteinallergi.
            Hold oversikt over kostnader og ingredienser.
          </p>
        </header>
        
        {/* Alert message */}
        {feilmelding && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow">
            <div className="flex items-center">
              <FiSearch className="mr-2 flex-shrink-0" size={20} />
              <span>{feilmelding}</span>
              <button 
                className="ml-auto text-red-500 hover:text-red-700"
                onClick={() => setFeilmelding('')}
              >
                &times;
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Recipes */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Oppskrifter</h2>
                <button
                  className="flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition duration-200"
                  onClick={() => setVisOppskriftForm(true)}
                >
                  <FiPlusCircle className="mr-1" />
                  Ny oppskrift
                </button>
              </div>

              {visOppskriftForm && (
                <RecipeForm
                  onAddRecipe={leggTilOppskrift}
                  onCancel={() => setVisOppskriftForm(false)}
                />
              )}
              
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Søk etter oppskrifter..."
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={sokeord}
                  onChange={(e) => setSokeord(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filtrerteOppskrifter.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">
                    Ingen oppskrifter funnet. Prøv et annet søkeord eller legg til nye oppskrifter.
                  </p>
                ) : (
                  filtrerteOppskrifter.map((oppskrift) => (
                    // Modern Recipe Card Design from examples
                    <div key={oppskrift.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                        {oppskrift.bilde ? (
                          <img 
                            src={oppskrift.bilde} 
                            alt={oppskrift.navn} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-xl font-medium">🍲</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{oppskrift.navn}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-500">{oppskrift.tidsbruk}</span>
                          </div>
                          <span className="text-sm font-semibold text-indigo-600">
                            {oppskrift.ingredienser.reduce((sum, i) => sum + i.pris, 0)} kr
                          </span>
                        </div>
                        <button 
                          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
                          onClick={() => leggTilMaaltid(oppskrift)}
                        >
                          Legg til i ukemeny
                        </button>
                        
                        <button
                          className="mt-2 w-full text-indigo-600 hover:text-indigo-800 text-sm flex items-center justify-center"
                          onClick={() => toggleVisDetaljer(oppskrift.id)}
                        >
                          {visDetaljer === oppskrift.id ? 'Skjul detaljer' : 'Vis detaljer'}
                          <svg className={`ml-1 w-4 h-4 transform ${visDetaljer === oppskrift.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {visDetaljer === oppskrift.id && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Ingredienser:</h4>
                            <div className="flex flex-wrap gap-1">
                              {oppskrift.ingredienser.map((ing, idx) => (
                                <span key={idx} className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1">
                                  {ing.navn} ({ing.pris} kr)
                                </span>
                              ))}
                            </div>
                            
                            <h4 className="text-sm font-medium text-gray-700 mt-3 mb-1">Fremgangsmåte:</h4>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
                              {oppskrift.fremgangsmaate.map((steg, idx) => (
                                <li key={idx}>{steg}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Middle + Right columns - Menu planning and tools */}
          <div className="lg:col-span-2">
            {/* Weekly menu planner */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Din ukemeny</h2>
                
                <div className="flex space-x-2">
                  <button
                    className="flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition duration-200"
                    onClick={velgTilfeldigMåltid}
                  >
                    <span className="mr-1">🎲</span> Velg tilfeldig
                  </button>
                  
                  <button
                    className="flex items-center text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg transition duration-200"
                    onClick={genererUkemeny}
                  >
                    <span className="mr-1">🔄</span> Generer ukemeny
                  </button>
                </div>
              </div>
              
              {valgteMaaltider.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-2">
                    Ingen måltider lagt til ennå
                  </p>
                  <p className="text-sm text-gray-400">
                    Velg måltider fra listen til venstre eller bruk knappene ovenfor for å generere en meny
                  </p>
                </div>
              ) : (
                // Calendar view from design examples
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-indigo-600 text-white p-4">
                    <h3 className="text-xl font-bold">Din Ukemeny</h3>
                    <p className="text-indigo-100">Mars 2025</p>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'].map(day => (
                      <div key={day} className="bg-indigo-50 text-center py-2 text-sm font-medium text-indigo-800">
                        {day}
                      </div>
                    ))}
                    
                    {ukedager.map((_, index) => (
                      <div key={index} className="bg-white p-3 h-36 hover:bg-indigo-50 transition-colors">
                        <div className="text-right text-xs text-gray-500 mb-2">{index + 4}</div>
                        {index < valgteMaaltider.length ? (
                          <div>
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                            <span className="text-sm font-medium">{valgteMaaltider[index].navn}</span>
                            <div className="mt-1 text-xs text-gray-600">
                              {valgteMaaltider[index].tidsbruk} · {valgteMaaltider[index].ingredienser.reduce((sum, i) => sum + i.pris, 0)} kr
                            </div>
                            <button
                              className="mt-2 text-red-500 hover:text-red-700 text-xs"
                              onClick={() => fjernMaaltid(index)}
                            >
                              Fjern
                            </button>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                            <span>+</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Budget display */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-medium text-gray-700">Totalpris:</span> 
                    <span className={`ml-1 ${beregnTotalPris() > budsjett ? 'text-red-600' : 'text-green-600'} font-bold`}>
                      {beregnTotalPris()} kr
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Budsjett:</span> 
                    <span className="ml-1 font-bold">{budsjett} kr</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div 
                    className={`h-2.5 rounded-full ${beregnTotalPris() > budsjett ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(beregnTotalPris() / budsjett * 100, 100)}%` }}
                  ></div>
                </div>
                
                {beregnTotalPris() > budsjett && (
                  <p className="text-red-500 text-xs">
                    Du er {beregnTotalPris() - budsjett} kr over budsjett
                  </p>
                )}
                {beregnTotalPris() <= budsjett && beregnTotalPris() > 0 && (
                  <p className="text-green-500 text-xs">
                    Du er {budsjett - beregnTotalPris()} kr under budsjett
                  </p>
                )}
                
                <button 
                  className="text-blue-500 text-sm hover:text-blue-700 mt-2"
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
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>500 kr</span>
                      <span>2000 kr</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Shopping list */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Handleliste</h2>
              
              {valgteMaaltider.length === 0 ? (
                <p className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  Legg til måltider for å generere en handleliste
                </p>
              ) : (
                <div>
                  <div className="mb-4 max-h-64 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ingrediens
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mengde
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pris
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {lagHandleliste().map((ingrediens, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-medium text-gray-800">{ingrediens.navn}</div>
                              <div className="text-xs text-gray-500">
                                {ingrediens.maaltider.join(', ')}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {ingrediens.mengde.join(' + ')}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              {ingrediens.pris} kr
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-t pt-4 flex justify-between items-center">
                    <div className="font-bold text-lg">
                      <span className="text-gray-700">Total:</span>
                      <span className="ml-2">{beregnTotalPris()} kr</span>
                    </div>
                    
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
                      onClick={() => window.print()}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Skriv ut handleliste
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* MenuManager component */}
            <MenuManager 
              meals={valgteMaaltider} 
              budget={budsjett}
              onLoadMenu={handleLoadMenu}
            />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-10 text-center text-gray-600 text-sm">
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
      
      {/* Custom scrollbar style */}
    
    </div>
  );
};

export default UkemenyPlanlegger;