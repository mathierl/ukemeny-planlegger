import React, { useState } from 'react';
import { useUkemeny } from './UkemenyContext';
import MenuManager from './MenuManager';
import { TbInfoCircle, TbPlus, TbTrash, TbDice5, TbRefresh, TbSoup, TbPrinter } from 'react-icons/tb';
import DayRecipeSelector from './DayRecipeSelector';
import DietTags from './DietTags';

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
    genererUkemeny
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

  const overBudget = beregnTotalPris() > budsjett;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-charcoal mb-2">
            Glutenfri & Melkefri Ukemenyplanlegger
          </h1>
          <p className="text-charcoal-muted max-w-2xl mx-auto">
            Plan enkelt ukemenyer som passer for personer med cøliaki og melkeproteinallergi.
            Hold oversikt over kostnader og ingredienser.
          </p>
        </header>

        {/* Alert message */}
        {feilmelding && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <TbInfoCircle className="mr-2 flex-shrink-0" size={20} aria-hidden="true" />
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
        <div className="bg-white rounded-2xl shadow-sm border border-cream-300 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
            <h2 className="text-xl font-semibold text-charcoal">Din ukemeny</h2>

            <div className="flex gap-2">
              <button
                className="flex items-center text-sm bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 px-3 py-2 rounded-xl transition-colors"
                onClick={velgTilfeldigMåltid}
              >
                <TbDice5 className="mr-1.5" size={16} aria-hidden="true" /> Velg tilfeldig
              </button>

              <button
                className="flex items-center text-sm bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 px-3 py-2 rounded-xl transition-colors"
                onClick={genererUkemeny}
              >
                <TbRefresh className="mr-1.5" size={16} aria-hidden="true" /> Generer ukemeny
              </button>
            </div>
          </div>

          {valgteMaaltider.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-cream-400 rounded-xl">
              <p className="text-charcoal-muted mb-2">
                Ingen måltider lagt til ennå
              </p>
              <p className="text-sm text-charcoal-muted">
                Velg måltider fra oppskrifter-siden eller bruk knappene ovenfor for å generere en meny
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ukedager.map((dayName, index) => {
                const meal = index < valgteMaaltider.length ? valgteMaaltider[index] : null;
                const price = meal ? meal.ingredienser.reduce((sum, i) => sum + i.pris, 0) : null;

                return (
                  <div
                    key={dayName}
                    className="bg-cream-200 rounded-2xl p-5 cursor-pointer hover:shadow-md transition-shadow flex flex-col"
                    onClick={() => handleDayClick(index)}
                  >
                    <div className="flex justify-between items-baseline mb-3.5">
                      <span className="text-[13px] text-charcoal-muted tracking-wide">{dayName}</span>
                      {price !== null && <span className="text-[13px] text-charcoal-muted">kr {price}</span>}
                    </div>

                    {meal ? (
                      <>
                        <div className="bg-cream-400 rounded-xl h-28 flex items-center justify-center mb-3.5 overflow-hidden">
                          {meal.bilde ? (
                            <img
                              src={meal.bilde}
                              alt={meal.navn}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <TbSoup size={32} className="text-terracotta-500" aria-hidden="true" />
                          )}
                        </div>

                        <h3 className="text-lg font-medium text-charcoal mb-2 line-clamp-2">{meal.navn}</h3>
                        <DietTags className="mb-4" />

                        <button
                          className="w-full mt-auto bg-red-50 hover:bg-red-100 text-red-700 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            fjernMaaltid(index);
                          }}
                        >
                          <TbTrash size={16} aria-hidden="true" />
                          Fjern måltid
                        </button>
                      </>
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center py-8">
                        <div className="w-14 h-14 rounded-full bg-cream-400 flex items-center justify-center text-terracotta-500 mb-2">
                          <TbPlus size={28} aria-hidden="true" />
                        </div>
                        <span className="text-sm text-charcoal-muted">Legg til måltid</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Budget display */}
          <div className="border-t border-cream-300 pt-4 mt-5">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-medium text-charcoal-muted">Totalpris:</span>
                <span className={`ml-1 ${overBudget ? 'text-red-600' : 'text-moss-700'} font-bold`}>
                  {beregnTotalPris()} kr
                </span>
              </div>
              <div>
                <span className="font-medium text-charcoal-muted">Budsjett:</span>
                <span className="ml-1 font-bold text-charcoal">{budsjett} kr</span>
              </div>
            </div>

            <div className="w-full bg-cream-300 rounded-full h-2.5 mb-1">
              <div
                className={`h-2.5 rounded-full ${overBudget ? 'bg-red-500' : 'bg-moss-500'}`}
                style={{ width: `${Math.min(beregnTotalPris() / budsjett * 100, 100)}%` }}
              ></div>
            </div>

            {overBudget && (
              <p className="text-red-500 text-xs">
                Du er {beregnTotalPris() - budsjett} kr over budsjett
              </p>
            )}
            {!overBudget && beregnTotalPris() > 0 && (
              <p className="text-moss-700 text-xs">
                Du er {budsjett - beregnTotalPris()} kr under budsjett
              </p>
            )}

            <button
              className="text-terracotta-600 text-sm hover:text-terracotta-700 mt-2"
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
                  className="w-full h-2 bg-cream-300 rounded-lg appearance-none cursor-pointer accent-terracotta-500"
                />
                <div className="flex justify-between text-xs text-charcoal-muted mt-1">
                  <span>500 kr</span>
                  <span>2000 kr</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Shopping list */}
        <div className="bg-white rounded-2xl shadow-sm border border-cream-300 p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-semibold text-charcoal mb-4">Handleliste</h2>

          {valgteMaaltider.length === 0 ? (
            <p className="text-center py-6 text-charcoal-muted border-2 border-dashed border-cream-400 rounded-xl">
              Legg til måltider for å generere en handleliste
            </p>
          ) : (
            <div>
              <div className="mb-4 max-h-64 overflow-y-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="min-w-full divide-y divide-cream-300">
                  <thead className="bg-cream-100">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-charcoal-muted uppercase tracking-wider">
                        Ingrediens
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-charcoal-muted uppercase tracking-wider">
                        Mengde
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-charcoal-muted uppercase tracking-wider">
                        Pris
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-cream-200">
                    {lagHandleliste().map((ingrediens, index) => (
                      <tr key={index} className="hover:bg-cream-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-charcoal">{ingrediens.navn}</div>
                          <div className="text-xs text-charcoal-muted">
                            {ingrediens.maaltider.join(', ')}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-charcoal">
                          {ingrediens.mengde.join(' + ')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-charcoal">
                          {ingrediens.pris} kr
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-cream-300 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="font-bold text-lg">
                  <span className="text-charcoal-muted">Total:</span>
                  <span className="ml-2 text-charcoal">{beregnTotalPris()} kr</span>
                </div>

                <button
                  className="bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 px-4 py-2 rounded-xl flex items-center justify-center transition-colors"
                  onClick={() => window.print()}
                >
                  <TbPrinter className="mr-2" size={16} aria-hidden="true" />
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
