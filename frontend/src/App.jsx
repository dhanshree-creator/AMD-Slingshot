import React, { useState, useMemo } from 'react';
import { 
  Activity, ShieldAlert, CheckCircle, Info, Heart, Droplet, 
  Wind, ActivitySquare, AlertOctagon, ArrowRight, BookOpen, Microscope 
} from 'lucide-react';

const DISEASES = [
  { id: 'diabetes', name: 'Type 2 Diabetes', icon: <Activity className="w-5 h-5 text-cyan-400" /> },
  { id: 'hypertension', name: 'Hypertension', icon: <Heart className="w-5 h-5 text-rose-400" /> },
  { id: 'pcod', name: 'PCOD / PCOS', icon: <Wind className="w-5 h-5 text-fuchsia-400" /> },
  { id: 'thyroid', name: 'Thyroid (Hypo)', icon: <ActivitySquare className="w-5 h-5 text-purple-400" /> },
  { id: 'anemia', name: 'Anemia', icon: <Droplet className="w-5 h-5 text-red-500" /> },
  { id: 'kidneydisease', name: 'Kidney Disease', icon: <Droplet className="w-5 h-5 text-amber-500" /> },
  { id: 'heartdisease', name: 'Heart Disease', icon: <Heart className="w-5 h-5 text-orange-500" /> },
];

const DISEASE_NAME_MAP = DISEASES.reduce((acc, curr) => {
  acc[curr.id] = curr.name;
  return acc;
}, {});

const FOOD_DB = [
  { 
    name: "Bananas", 
    effects: {
      hypertension: { tier: 1, portion: "1 medium", nutrient: "Potassium", detail: "excretes sodium and relaxes blood vessels" },
      kidneydisease: { tier: 2, detail: "dangerously high in potassium for compromised kidneys" },
      diabetes: { tier: 3, cap: "half a small banana (ripe)" }
    }
  },
  {
    name: "Spinach",
    effects: {
      anemia: { tier: 1, portion: "1 cup cooked", nutrient: "Iron & Folate", detail: "raises hemoglobin levels" },
      kidneydisease: { tier: 2, detail: "high in oxalates and potassium" },
      thyroid: { tier: 2, detail: "goitrogenic properties if eaten in very large raw amounts" }
    }
  },
  {
    name: "White Rice",
    effects: {
      diabetes: { tier: 2, detail: "spikes blood glucose due to high glycemic index" },
      pcod: { tier: 2, detail: "high glycemic index worsens insulin resistance" },
      kidneydisease: { tier: 3, cap: "1 portion (low potassium, but limit overall carbs)" }
    }
  },
  {
    name: "Fenugreek Seeds (Methi)",
    effects: {
      diabetes: { tier: 1, portion: "10g soaked", nutrient: "Soluble Fiber", detail: "slows carbohydrate absorption" },
      pcod: { tier: 1, portion: "1 tsp soaked", nutrient: "Furostanolic Saponins", detail: "improves insulin sensitivity" }
    }
  },
  {
    name: "Salmon / Fatty Fish",
    effects: {
      heartdisease: { tier: 1, portion: "150g", nutrient: "Omega-3 EPA/DHA", detail: "reduces triglycerides and prevents arrhythmias" },
      thyroid: { tier: 1, portion: "100g", nutrient: "Selenium & Iodine", detail: "supports thyroid hormone conversion" },
      kidneydisease: { tier: 3, cap: "2 times a week max (watch protein accumulation)" }
    }
  },
  {
    name: "Bitter Gourd (Karela)",
    effects: {
      diabetes: { tier: 1, portion: "100g cooked or 30ml juice", nutrient: "Charantin", detail: "lowers blood glucose levels" }
    }
  },
  {
    name: "Coffee / Tea",
    effects: {
      anemia: { tier: 2, detail: "tannins severely block iron absorption if taken with meals" },
      hypertension: { tier: 3, cap: "1-2 small cups max" },
      pcod: { tier: 3, cap: "manage caffeine carefully as it impacts cortisol" }
    }
  }
];

export default function App() {
  const [selectedDiseases, setSelectedDiseases] = useState([]);

  const toggleDisease = (id) => {
    setSelectedDiseases(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const evaluation = useMemo(() => {
    if (selectedDiseases.length === 0) return null;

    const evaluated = FOOD_DB.map(food => {
      let t1 = [], t2 = [], t3 = [];
      selectedDiseases.forEach(d => {
        if (food.effects[d]) {
          if (food.effects[d].tier === 1) t1.push({ disease: d, ...food.effects[d] });
          if (food.effects[d].tier === 2) t2.push({ disease: d, ...food.effects[d] });
          if (food.effects[d].tier === 3) t3.push({ disease: d, ...food.effects[d] });
        }
      });
      return { food, t1, t2, t3 };
    }).filter(f => f.t1.length || f.t2.length || f.t3.length);

    const conflicts = [];
    const tier1 = [];
    const tier2 = [];
    const tier3 = [];

    evaluated.forEach(f => {
      if (f.t1.length > 0 && f.t2.length > 0) {
        conflicts.push(f);
      } else if (f.t2.length > 0) {
        tier2.push(f);
      } else if (f.t3.length > 0) {
        tier3.push(f);
      } else if (f.t1.length > 0) {
        tier1.push(f);
      }
    });

    return { conflicts, tier1, tier2, tier3 };
  }, [selectedDiseases]);

  return (
    <div className="min-h-screen bg-mesh text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-cyan-500 to-emerald-400 p-2 rounded-xl shadow-lg shadow-cyan-500/20">
              <Microscope className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                Disease-Food Intelligence Engine
              </h1>
              <p className="text-sm text-cyan-400/80 font-medium flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Grounded in WHO, NIH, and ICMR guidelines
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Disease Selector */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Patient Conditions
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Select one or more conditions to resolve dietary conflicts and map clinically precise nutritional guidelines.
            </p>
            
            <div className="flex flex-col gap-3">
              {DISEASES.map(d => {
                const isSelected = selectedDiseases.includes(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => toggleDisease(d.id)}
                    className={`flex items-center gap-3 w-full p-3.5 rounded-xl transition-all duration-300 border text-left ${
                      isSelected 
                        ? 'bg-slate-800/80 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50' 
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className={`transition-transform duration-300 ${isSelected ? 'scale-110' : 'opacity-70'}`}>
                      {d.icon}
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-slate-100' : 'text-slate-300'}`}>
                      {d.name}
                    </span>
                    {isSelected && <CheckCircle className="w-5 h-5 text-cyan-400 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Engine Results */}
        <div className="lg:col-span-8">
          {!evaluation ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-900/20 border border-slate-800/50 rounded-2xl border-dashed">
              <Microscope className="w-16 h-16 text-slate-700 mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">Awaiting Clinical Data</h3>
              <p className="text-slate-500 max-w-sm">
                Select patient health conditions from the panel to generate a precision nutrition matrix with multi-disease conflict resolution.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Stats / Overview */}
              <div className="flex items-center gap-4 mb-8 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50">
                <div className="flex-1 text-center border-r border-slate-800">
                  <div className="text-2xl font-bold text-emerald-400">{evaluation.tier1.length}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">Tier 1 Foods</div>
                </div>
                <div className="flex-1 text-center border-r border-slate-800">
                  <div className="text-2xl font-bold text-rose-400">{evaluation.tier2.length}</div>
                   <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">Tier 2 Avoids</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold text-red-500 flex justify-center items-center gap-1">
                    {evaluation.conflicts.length > 0 && <AlertOctagon className="w-5 h-5 animate-pulse" />}
                    {evaluation.conflicts.length}
                  </div>
                   <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">Conflicts</div>
                </div>
              </div>

              {/* CONFLICTS */}
              {evaluation.conflicts.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-lg font-bold text-red-500 flex items-center gap-2 mb-4">
                    <AlertOctagon className="w-5 h-5" />
                    Multi-Disease Conflicts
                  </h3>
                  <div className="space-y-4">
                    {evaluation.conflicts.map((item, idx) => (
                      <div key={idx} className="bg-red-950/20 border border-red-500/30 rounded-xl p-5 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                        <div className="flex items-center justify-between mb-3 border-b border-red-500/20 pb-3">
                          <span className="font-bold text-lg text-slate-100">{item.food.name}</span>
                          <span className="bg-red-500/10 text-red-400 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-red-500/20">
                            Warning
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-emerald-950/30 p-3 rounded-lg border border-emerald-900/50">
                            <h4 className="text-xs font-bold text-emerald-500 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5" /> Beneficial For
                            </h4>
                            {item.t1.map((b, i) => (
                              <div key={i} className="text-sm text-slate-300">
                                <span className="font-semibold text-slate-200">{DISEASE_NAME_MAP[b.disease]}</span>: 
                                <span className="text-slate-400 ml-1">Helps by {b.detail.toLowerCase()} via {b.nutrient}.</span>
                              </div>
                            ))}
                          </div>
                          <div className="bg-rose-950/30 p-3 rounded-lg border border-rose-900/50">
                            <h4 className="text-xs font-bold text-rose-500 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                              <ShieldAlert className="w-3.5 h-3.5" /> Harmful For
                            </h4>
                            {item.t2.map((h, i) => (
                              <div key={i} className="text-sm text-slate-300">
                                <span className="font-semibold text-slate-200">{DISEASE_NAME_MAP[h.disease]}</span>: 
                                <span className="text-rose-400/80 ml-1">Avoid because {h.detail.toLowerCase()}.</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-slate-400 bg-red-950/40 p-2.5 rounded border border-red-900/50 flex items-start gap-2">
                          <Info className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                          <span><strong>Clinical Protocol:</strong> This food creates a physiological contradiction between selected conditions. It is strictly advised to avoid this until specialized consultation.</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TIER 1 */}
              {evaluation.tier1.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5" />
                    Tier 1 (Eat)
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {evaluation.tier1.map((item, idx) => (
                      <div key={idx} className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-4 md:p-5 hover:border-emerald-500/40 transition-colors shadow-[0_4px_20px_rgba(16,185,129,0.03)]">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 shrink-0">
                            <Heart className="w-6 h-6 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-slate-100">{item.food.name}</h4>
                            <div className="mt-2 space-y-2">
                              {item.t1.map((b, i) => (
                                <div key={i} className="text-[15px] leading-relaxed text-slate-300 bg-slate-800/40 p-3 rounded-md border border-slate-700/50">
                                  <span className="font-semibold text-emerald-300">{b.portion}</span> — <span className="text-emerald-400/80 font-medium">{b.nutrient}</span> — <span className="text-slate-400">helps {DISEASE_NAME_MAP[b.disease].toLowerCase()} by {b.detail.toLowerCase()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TIER 2 */}
              {evaluation.tier2.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2 mb-4">
                    <ShieldAlert className="w-5 h-5" />
                    Tier 2 (Avoid)
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {evaluation.tier2.map((item, idx) => (
                      <div key={idx} className="bg-slate-900/60 border border-rose-500/20 rounded-xl p-4 md:p-5 hover:border-rose-500/40 transition-colors shadow-[0_4px_20px_rgba(244,63,94,0.03)]">
                         <div className="flex flex-col md:flex-row md:items-start gap-4">
                          <div className="bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 shrink-0">
                            <ShieldAlert className="w-6 h-6 text-rose-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-slate-100">{item.food.name}</h4>
                            <div className="mt-2 space-y-2">
                              {item.t2.map((h, i) => (
                                <div key={i} className="text-[15px] leading-relaxed text-slate-300 bg-slate-800/40 p-3 rounded-md border border-slate-700/50">
                                  <span className="text-rose-300 font-medium">{h.detail.toLowerCase()}</span> — <span className="text-slate-400 font-medium">avoid for {DISEASE_NAME_MAP[h.disease].toLowerCase()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TIER 3 */}
              {evaluation.tier3.length > 0 && (
                <div className="mb-10">
                   <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5" />
                    Tier 3 (Neutral / Moderation)
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {evaluation.tier3.map((item, idx) => (
                      <div key={idx} className="bg-slate-900/40 border border-amber-500/20 py-3 px-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <span className="font-bold text-slate-200">{item.food.name}</span>
                        <div className="flex flex-col gap-1 items-start md:items-end w-full md:w-auto">
                          {item.t3.map((limit, i) => (
                            <div key={i} className="text-sm bg-amber-500/10 text-amber-200/90 py-1 px-3 rounded-full border border-amber-500/20">
                              <span className="font-semibold opacity-70 mr-1">{DISEASE_NAME_MAP[limit.disease]}:</span> 
                              Cap at {limit.cap}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
