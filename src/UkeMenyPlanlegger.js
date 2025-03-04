// UkemenyPlanlegger.js with enhanced design
import React, { useState, useEffect } from 'react';
import MenuManager from './MenuManager';
import RecipeForm from './RecipeForm';
import { FiSearch, FiPlusCircle, FiChevronDown, FiChevronUp, FiTrash2, FiInfo, FiClock, FiDollarSign, FiCalendar, FiShoppingCart, FiShuffle } from 'react-icons/fi';

const UkemenyPlanlegger = () => {
  // State for recipes (keep your existing state)
  const [oppskrifter, setOppskrifter] = useState([
    // Your default recipes remain the same
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
    // Keep any other default recipes
  ]);
  
  // Keep all your existing state and functions
  const [valgteMaaltider, setValgteMaaltider] = useState([]);
  const [budsjett, setBudsjett] = useState(1000);
  const [visBudsjett, setVisBudsjett] = useState(false);
  const [visDetaljer, setVisDetaljer] = useState(null);
  const [sokeord, setSokeord] = useState('');
  const [filtrerteOppskrifter, setFiltrerteOppskrifter] = useState(oppskrifter);
  const [feilmelding, setFeilmelding] = useState('');
  const [visOppskriftForm, setVisOppskriftForm] = useState(false);

  // Your existing useEffect for filtering recipes
  useEffect(() => {
    const filtrerte = oppskrifter.filter(oppskrift => 
      oppskrift.navn.toLowerCase().includes(sokeord.toLowerCase())
    );
    setFiltrerteOppskrifter(filtrerte);
  }, [sokeord, oppskrifter]);

  // Keep all your existing handler functions
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

  const fjernMaaltid = (index) => {
    const nyeMaaltider = [...valgteMaaltider];
    nyeMaaltider.splice(index, 1);
    setValgteMaaltider(nyeMaaltider);
  };

  const beregnTotalPris = () => {
    return valgteMaaltider.reduce((total, maaltid) => {
      const maaltidPris = maaltid.ingredienser.reduce((sum, ingrediens) => 
        sum + ingrediens.pris, 0);
      return total + maaltidPris;
    }, 0);
  };

  const lagHandleliste = () => {
    // Keep your existing implementation
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

  const toggleVisDetaljer = (id) => {
    if (visDetaljer === id) {
      setVisDetaljer(null);
    } else {
      setVisDetaljer(id);
    }
  };

  const handleLoadMenu = (loadedMeals, loadedBudget) => {
    setValgteMaaltider(loadedMeals);
    
    if (loadedBudget) {
      setBudsjett(loadedBudget);
    }
    
    setVisDetaljer(null);
    setFeilmelding('');
  };

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

  const leggTilOppskrift = (nyOppskrift) => {
    setOppskrifter([...oppskrifter, nyOppskrift]);
    setVisOppskriftForm(false);
  };
  
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
  
  const ukedager = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];

  // Calculate percentage of budget used
  const budsjettProsent = Math.min(beregnTotalPris() / budsjett * 100, 100);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Enhanced Header */}
        <header className="mb-10 text-center">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 py-8 px-6 rounded-2xl text-white shadow-lg mb-6">
            <h1 className="text-4xl font-bold mb-3">
              Glutenfri & Melkefri Ukemenyplanlegger
            </h1>
            <p className="text-green-50 max-w-2xl mx-auto text-lg">
              Plan enkelt ukemenyer som passer for personer med cøliaki og melkeproteinallergi.
              Hold oversikt over kostnader og ingredienser.
            </p>
          </div>
        </header>
        
        {/* Alert message */}
        {feilmelding && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm animate-fadeIn">
            <div className="flex items-center">
              <FiInfo className="mr-2 flex-shrink-0" size={20} />
              <span>{feilmelding}</span>
              <button 
                className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                onClick={() => setFeilmelding('')}
              >
                &times;
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Recipes with enhanced styling */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Oppskrifter</h2>
                  <button
                    className="flex items-center text-sm bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-lg transition duration-200"
                    onClick={() => setVisOppskriftForm(true)}
                  >
                    <FiPlusCircle className="mr-1" />
                    Ny oppskrift
                  </button>
                </div>
              </div>

              {visOppskriftForm && (
                <RecipeForm
                  onAddRecipe={leggTilOppskrift}
                  onCancel={() => setVisOppskriftForm(false)}
                />
              )}
              
              <div className="p-5">
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
                
                <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-1 custom-scrollbar">
                  {filtrerteOppskrifter.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <p className="mb-2">Ingen oppskrifter funnet</p>
                      <p className="text-sm text-gray-400">Prøv et annet søkeord eller legg til nye oppskrifter</p>
                    </div>
                  ) : (
                    filtrerteOppskrifter.map((oppskrift) => (
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
                            
                            {/* Recipe details */}
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
          </div>
          
          {/* Middle + Right columns - Enhanced Menu planning and tools */}
          <div className="lg:col-span-2">
            {/* Enhanced Weekly menu planner */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Din ukemeny</h2>
                  
                  <div className="flex space-x-2">
                    <button
                      className="flex items-center text-sm bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-lg transition duration-200"
                      onClick={velgTilfeldigMåltid}
                    >
                      <span className="mr-1">🎲</span> Legg til tilfeldig
                    </button>
                    
                    <button
                      className="flex items-center text-sm bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-lg transition duration-200"
                      onClick={genererUkemeny}
                    >
                      <FiShuffle className="mr-1" /> Generer ukemeny
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                {valgteMaaltider.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-purple-200 rounded-lg bg-purple-50">
                    <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 text-purple-500">
                      <FiCalendar size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-purple-700 mb-2">Ingen måltider lagt til ennå</h3>
                    <p className="text-sm text-purple-600 max-w-md mx-auto">
                      Velg måltider fra listen til venstre eller bruk knappene ovenfor for å generere en meny
                    </p>
                  </div>
                ) : (
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
              </div>
              
              {/* Enhanced Budget display */}
              <div className="bg-gray-50 p-5 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">
                          <FiDollarSign size={16} />
                        </span>
                        <span className="font-medium text-gray-700">Totalpris:</span>
                      </div>
                      <span className={`text-xl font-bold ${beregnTotalPris() > budsjett ? 'text-red-600' : 'text-green-600'}`}>
                        {beregnTotalPris()} kr
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full ${
                          budsjettProsent >= 90 ? 'bg-red-500' : 
                          budsjettProsent >= 75 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${budsjettProsent}%` }}
                      ></div>
                    </div>
                    
                    {beregnTotalPris() > budsjett ? (
                      <p className="text-red-500 text-xs mt-1">
                        Du er {beregnTotalPris() - budsjett} kr over budsjett
                      </p>
                    ) : beregnTotalPris() > 0 ? (
                      <p className="text-green-500 text-xs mt-1">
                        Du er {budsjett - beregnTotalPris()} kr under budsjett
                      </p>
                    ) : null}
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        <span className="font-medium text-gray-700">Budsjett:</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">{budsjett} kr</span>
                    </div>
                    
                    <button 
                      className="text-blue-500 text-sm hover:text-blue-700 transition-colors flex items-center"
                      onClick={() => setVisBudsjett(!visBudsjett)}
                    >
                      {visBudsjett ? (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          Skjul budsjettjustering
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Juster budsjett
                        </>
                      )}
                    </button>
                    
                    {visBudsjett && (
                      <div className="mt-3 bg-gray-50 p-3 rounded-lg">
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
              </div>
              
              {/* Enhanced Shopping list */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FiShoppingCart className="mr-2" />
                    Handleliste
                  </h2>
                </div>
                
                <div className="p-5">
                  {valgteMaaltider.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-emerald-200 rounded-lg bg-emerald-50">
                      <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
                        <FiShoppingCart size={24} />
                      </div>
                      <p className="text-emerald-800 font-medium">
                        Legg til måltider for å generere en handleliste
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 border-b">
                          <div className="grid grid-cols-12 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="col-span-5 md:col-span-6">Ingrediens</div>
                            <div className="col-span-4 md:col-span-3">Mengde</div>
                            <div className="col-span-3 text-right">Pris</div>
                          </div>
                        </div>
                        
                        <div className="max-h-64 overflow-y-auto bg-white divide-y divide-gray-200">
                          {lagHandleliste().map((ingrediens, index) => (
                            <div key={index} className="grid grid-cols-12 px-4 py-3 hover:bg-gray-50 transition-colors">
                              <div className="col-span-5 md:col-span-6">
                                <div className="font-medium text-gray-800">{ingrediens.navn}</div>
                                <div className="text-xs text-gray-500 truncate">
                                  {ingrediens.maaltider.join(', ')}
                                </div>
                              </div>
                              <div className="col-span-4 md:col-span-3 text-sm text-gray-600">
                                {ingrediens.mengde.join(' + ')}
                              </div>
                              <div className="col-span-3 text-right font-medium text-blue-600">
                                {ingrediens.pris} kr
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0 mt-4">
                        <div className="bg-gray-50 px-4 py-2 rounded-lg flex items-center">
                          <span className="font-medium text-gray-700 mr-2">Total:</span>
                          <span className="text-xl font-bold text-blue-600">{beregnTotalPris()} kr</span>
                        </div>
                        
                        <button 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm"
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
              </div>
              
              {/* MenuManager component will go here */}
              <MenuManager 
                meals={valgteMaaltider} 
                budget={budsjett}
                onLoadMenu={handleLoadMenu}
              />
            </div>
          </div>
        </div>
        
        {/* Enhanced Footer */}
        <footer className="mt-12 text-center text-gray-600">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-8 rounded-2xl shadow-sm max-w-3xl mx-auto border border-yellow-100">
            <h3 className="font-semibold mb-3 text-lg text-amber-800">Om Glutenfri & Melkefri Ukemenyplanlegger</h3>
            <p className="mb-3 text-amber-700">
              Dette er en enkel app for å planlegge ukemenyer for personer med cøliaki og melkeproteinallergi.
              Du kan velge oppskrifter, tilpasse ukemenyen, og se den totale kostnaden.
            </p>
            <p className="text-amber-700">
              Alle data lagres lokalt i nettleseren din. Ingenting sendes til noen server.
            </p>
          </div>
          <p className="mt-6">© {new Date().getFullYear()} Ukemenyplanlegger</p>
        </footer>
      </div>
      
      {/* Custom scrollbar style */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #b8b8b8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #888;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .handleliste, .handleliste * {
            visibility: visible;
          }
          .handleliste {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UkemenyPlanlegger;