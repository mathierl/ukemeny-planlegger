import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUkemeny } from './UkemenyContext';
import MenuManager from './MenuManager';
import { FiSearch, FiInfo, FiX, FiPlus } from 'react-icons/fi';
import DayRecipeSelector from './DayRecipeSelector';

const UkemenyOverview = () => {
  const { 
    valgteMaaltider, 
    fjernMaaltid, 
    budsjett, 
    setBudsjett,
    feilmelding, 
    setFeilmelding,
    beregnTotalPris,
    lagHandleliste,
    velgTilfeldigMåltid,
    genererUkemeny,
    handleLoadMenu
  } = useUkemeny();

  const [visBudsjett, setVisBudsjett] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const ukedager = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
  
  // Handle day click to show recipe selector
  const handleDayClick = (index) => {
    setSelectedDay(index);
  };
  
  // Close the day recipe selector
  const handleCloseSelector = () => {
    setSelectedDay(null);
  };

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
              <FiInfo className="mr-2 flex-shrink-0" size={20} />
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
        
        {/* Recipe selector modal */}
        {selectedDay !== null && (
          <DayRecipeSelector 
            dayIndex={selectedDay} 
            dayName={ukedager[selectedDay]} 
            onClose={handleCloseSelector} 
          />
        )}
        
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
                Velg måltider fra oppskrifter-siden eller bruk knappene ovenfor for å generere en meny
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
                  <div 
                    key={index} 
                    className="bg-white hover:bg-indigo-50 transition-colors cursor-pointer relative h-64"
                    onClick={() => handleDayClick(index)}
                  >
                    <div className="p-2 flex flex-col h-full">
                      <div className="text-right text-xs text-gray-500 mb-1">{index + 4}</div>
                      
                      {index < valgteMaaltider.length && valgteMaaltider[index] ? (
                        <div className="flex flex-col h-full">
                          {/* Recipe with image */}
                          <div className="h-20 overflow-hidden rounded-t-lg bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                            {valgteMaaltider[index].bilde ? (
                              <img 
                                src={valgteMaaltider[index].bilde} 
                                alt={valgteMaaltider[index].navn} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-xl">🍲</span>
                            )}
                          </div>
                          
                          <div className="px-1 py-2 flex-grow flex flex-col">
                            <span className="text-sm font-medium line-clamp-2 mb-auto">{valgteMaaltider[index].navn}</span>
                            
                            <div className="mt-1 text-xs text-gray-600">
                              <div className="flex justify-between mb-2">
                                <span>{valgteMaaltider[index].tidsbruk}</span>
                                <span className="font-semibold">{valgteMaaltider[index].ingredienser.reduce((sum, i) => sum + i.pris, 0)} kr</span>
                              </div>
                            </div>
                            
                            <button
                              className="mt-auto bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded w-full text-center transition-colors text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                fjernMaaltid(index);
                              }}
                            >
                              Fjern måltid
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-indigo-500 hover:bg-indigo-100 mb-2">
                            <FiPlus size={30} />
                          </div>
                          <span className="text-sm text-gray-500">Legg til måltid</span>
                        </div>
                      )}
                    </div>
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
        <MenuManager />
      </div>
    </div>
  );
};

export default UkemenyOverview;