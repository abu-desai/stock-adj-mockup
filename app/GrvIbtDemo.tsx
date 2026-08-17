'use client';

import React, { useState } from 'react';

export default function GrvIbtDemo() {
  // State for the Quick IBT toggle
  const [enableQuickIbt, setEnableQuickIbt] = useState(true);
  const [showIbtModal, setShowIbtModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock Data for the GRV Grid
  const [grvItems, setGrvItems] = useState([
    { id: 1, code: '205801004', desc: 'JSY P/O PLAIN PLN NAVY', colour: 'NAVY', size: '24', supplierCost: 200.00, landedCost: 215.00, qty: 100 },
    { id: 2, code: '205801005', desc: 'JSY P/O PLAIN PLN NAVY', colour: 'NAVY', size: '26', supplierCost: 220.00, landedCost: 235.00, qty: 150 },
  ]);

  // State to track allocation quantities in the modal
  const [allocations, setAllocations] = useState({
    item1_branch02: 0,
    item2_branch02: 0,
  });

  const handleInitialSave = () => {
    if (enableQuickIbt) {
      // Intercept the save and show the IBT allocation modal
      setShowIbtModal(true);
    } else {
      // Standard save behavior
      alert("Standard GRV Saved successfully. No IBT generated.");
    }
  };

  const handleProcessComplete = () => {
    setShowIbtModal(false);
    setIsSuccess(true);
    
    // Reset after 3 seconds to allow re-testing
    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans text-sm text-gray-800 relative">
      <div className="max-w-7xl mx-auto bg-white shadow-xl border border-gray-300 rounded overflow-hidden">
        
        {/* Top Navigation */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white px-4 py-3 flex justify-between items-center shadow">
          <span className="font-bold text-lg tracking-wide">Gem Schoolwear - GRV & Quick IBT Prototype</span>
        </div>

        {/* --- MAIN GRV SCREEN --- */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
             <div className="flex-1 space-y-4">
                {/* Header Information mimicking Delphi UI */}
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-md shadow-inner flex gap-8">
                  <div className="space-y-2 w-1/3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-gray-500">A/C No.</label>
                      <input type="text" disabled value="210" className="border border-gray-300 p-1 bg-gray-200 rounded w-2/3" />
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-gray-500">Account Name</label>
                      <input type="text" disabled value="EXOTEX TEXTILES C.C" className="border border-gray-300 p-1 bg-green-800 text-white font-bold rounded w-2/3" />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <label className="text-xs font-semibold text-gray-500">Supplier Order No</label>
                      <input type="text" value="PURCHASES" className="border border-gray-300 p-1 bg-white rounded w-2/3" readOnly/>
                    </div>
                  </div>
                  
                  <div className="space-y-2 w-1/3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-gray-500">G.R.V No</label>
                      <input type="text" disabled value="AUTOMATIC" className="border border-gray-300 p-1 bg-gray-200 rounded w-2/3" />
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-gray-500">G.R.V Date</label>
                      <input type="text" disabled value="17/08/2026" className="border border-gray-300 p-1 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* Quick IBT Toggle Section */}
          <div className="my-6 p-4 bg-blue-50 border-2 border-blue-400 rounded-md shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-blue-900 text-base">Inter-Branch Transfer (IBT) Automation</h3>
              <p className="text-xs text-blue-700 mt-1">Enable this to automatically allocate stock to branches immediately after saving this GRV.</p>
            </div>
            <label className="flex items-center cursor-pointer bg-white p-2 px-4 rounded border border-blue-300 shadow-sm hover:bg-blue-100 transition">
              <input 
                type="checkbox" 
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-3"
                checked={enableQuickIbt}
                onChange={(e) => setEnableQuickIbt(e.target.checked)}
              />
              <span className="font-bold text-blue-900">Allocate to Branches on Save</span>
            </label>
          </div>

          {/* GRV Grid */}
          <div className="border border-gray-300 rounded-md shadow-sm overflow-hidden bg-white">
            <div className="bg-gray-100 p-2 border-b border-gray-300 font-semibold text-gray-700 text-sm">
              Goods Received Entry
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-50 text-emerald-900 border-b border-gray-200">
                <tr>
                  <th className="p-2">Stock Code</th>
                  <th className="p-2 w-1/4">Description</th>
                  <th className="p-2">Colour</th>
                  <th className="p-2">Size</th>
                  <th className="p-2 text-right bg-yellow-100 border-l border-yellow-200">Supplier Cost (Excl.Vat)</th>
                  <th className="p-2 text-right bg-green-100 border-r border-green-200">Internal Cost (Excl.Vat)</th>
                  <th className="p-2 text-right">Quantity</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {grvItems.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2 font-mono">{item.code}</td>
                    <td className="p-2 font-bold">{item.desc}</td>
                    <td className="p-2">{item.colour}</td>
                    <td className="p-2">{item.size}</td>
                    <td className="p-2 text-right bg-yellow-50 font-mono border-l border-yellow-100">{item.supplierCost.toFixed(2)}</td>
                    <td className="p-2 text-right bg-green-50 font-bold text-green-700 border-r border-green-100">{item.landedCost.toFixed(2)}</td>
                    <td className="p-2 text-right font-bold">{item.qty}</td>
                    <td className="p-2 text-right">{(item.supplierCost * item.qty).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
              <button 
                onClick={handleInitialSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-8 rounded shadow transition transform hover:scale-105"
              >
                Save G.R.V
              </button>
            </div>
          </div>
        </div>

        {/* --- SUCCESS MESSAGE OVERLAY --- */}
        {isSuccess && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-2xl font-bold text-base flex items-center gap-3 animate-bounce">
            ✅ GRV #10455 Saved and IBT-OUT #2000 Generated Successfully!
          </div>
        )}

        {/* --- QUICK IBT MODAL OVERLAY --- */}
        {showIbtModal && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
              
              <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Quick IBT Allocation</h2>
                <button onClick={() => setShowIbtModal(false)} className="text-white hover:text-red-300 font-bold text-xl">&times;</button>
              </div>
              
              <div className="p-6">
                <p className="mb-4 text-gray-600">Allocate the newly received stock to branches. Leave at 0 to keep stock in the main warehouse.</p>
                
                <table className="w-full text-left text-sm mb-6 border border-gray-200">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-2 border-b">Stock Item</th>
                      <th className="p-2 border-b text-center text-green-700 bg-green-50">Total Received</th>
                      <th className="p-2 border-b text-center border-l">Transfer to: 02 - GEM CITY CENTER</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border-b">
                        <div className="font-bold">JSY P/O PLAIN PLN NAVY</div>
                        <div className="text-xs text-gray-500">Size: 24 | NAVY</div>
                      </td>
                      <td className="p-3 border-b text-center font-bold text-green-700 bg-green-50">100</td>
                      <td className="p-3 border-b text-center border-l bg-blue-50">
                        <input 
                          type="number" 
                          min="0"
                          max="100"
                          className="w-20 border border-gray-300 p-1 text-center rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                          value={allocations.item1_branch02}
                          onChange={(e) => setAllocations({...allocations, item1_branch02: Number(e.target.value)})}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b">
                        <div className="font-bold">JSY P/O PLAIN PLN NAVY</div>
                        <div className="text-xs text-gray-500">Size: 26 | NAVY</div>
                      </td>
                      <td className="p-3 border-b text-center font-bold text-green-700 bg-green-50">150</td>
                      <td className="p-3 border-b text-center border-l bg-blue-50">
                         <input 
                          type="number" 
                          min="0"
                          max="150"
                          className="w-20 border border-gray-300 p-1 text-center rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                          value={allocations.item2_branch02}
                          onChange={(e) => setAllocations({...allocations, item2_branch02: Number(e.target.value)})}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => setShowIbtModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleProcessComplete}
                    className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-bold shadow"
                  >
                    Confirm & Generate IBT
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
