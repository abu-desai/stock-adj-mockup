'use client';

import React, { useState, useEffect } from 'react';

type LedgerEntry = {
  id: number;
  date: string;
  type: string;
  refNo: string;
  accountName: string;
  orderNo: string;
  otherRef: string;
  barcode: string;
  desc: string;
  qtyIn: number | null;
  qtyOut: number | null;
};

export default function TraceabilityDemo() {
  const [activeView, setActiveView] = useState('adjustment'); // 'adjustment' or 'ledger'
  
  // Form State
  const [direction, setDirection] = useState('');
  const [adjType, setAdjType] = useState('');
  
  // Dynamic Fields
  const [supplierCode, setSupplierCode] = useState('');
  const [invoiceRef, setInvoiceRef] = useState('');
  const [poRef, setPoRef] = useState('');
  const [embroidererCode, setEmbroidererCode] = useState('');
  const [deliveryRef, setDeliveryRef] = useState('');
  const [pendingJob, setPendingJob] = useState('');
  const [notes, setNotes] = useState('');
  const [adjustQty, setAdjustQty] = useState(1);

  // Mock Ledger Data
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([
    { id: 1, date: '02 Jul 2026', type: 'ADJ', refNo: '36792', accountName: 'Stock Adjustement', orderNo: '', otherRef: '', barcode: '205801010', desc: 'JSY P/O PLAIN PLN NAVY', qtyIn: 185, qtyOut: null },
    { id: 2, date: '02 Jul 2026', type: 'ADJ', refNo: '36793', accountName: 'Stock Adjustement', orderNo: '', otherRef: '', barcode: '205801010', desc: 'JSY P/O PLAIN PLN NAVY', qtyIn: null, qtyOut: 10 },
  ]);

  // Handle locking quantity if a pending job is selected
  useEffect(() => {
    if (pendingJob === 'JOB-1055') {
      setAdjustQty(50); // Matches the mock dispatch out
    }
  }, [pendingJob]);

  const handleSave = () => {
    if (!direction || !adjType) {
      alert("Please select a Direction and Adjustment Type.");
      return;
    }

    let newType = 'ADJ';
    let newAccountName = 'Stock Adjustment';
    let newOrderNo = '';
    let newOtherRef = '';

    if (adjType === 'SUPPLIER') {
      newType = 'RCV';
      newAccountName = supplierCode || 'Unknown Supplier';
      newOrderNo = poRef;
      newOtherRef = invoiceRef;
    } else if (adjType === 'EMBROIDERY') {
      newType = 'EMB';
      newAccountName = embroidererCode || 'Unknown Embroiderer';
      newOtherRef = direction === 'OUT' ? deliveryRef : pendingJob;
    } else if (adjType === 'DONATION') {
      newType = 'DON';
      newAccountName = 'Donations/Giveaways';
      newOtherRef = notes;
    } else if (adjType === 'DAMAGED') {
      newType = 'DMG';
      newAccountName = 'Damaged Garments';
      newOtherRef = notes;
    } else if (adjType === 'CORRECTION') {
      newType = 'COR';
      newAccountName = 'Stock Correction';
      newOtherRef = notes;
    } else if (adjType === 'SAMPLE') {
      newType = 'SMP';
      newAccountName = 'Customer Sample';
      newOtherRef = notes;
    }

    const isReceivingEmbroidery = direction === 'IN' && adjType === 'EMBROIDERY';
    const itemCode = isReceivingEmbroidery ? '2060' : '2058';
    const itemDesc = isReceivingEmbroidery ? 'JSY P/O GORDON ROAD NAVY' : 'JSY P/O PLAIN PLN NAVY';

    const newEntry = {
      id: Date.now(),
      date: '13 Aug 2026',
      type: newType,
      refNo: 'AUTO-' + Math.floor(Math.random() * 1000),
      accountName: newAccountName,
      orderNo: newOrderNo,
      otherRef: newOtherRef,
      barcode: itemCode + '010',
      desc: itemDesc,
      qtyIn: direction === 'IN' ? adjustQty : null,
      qtyOut: direction === 'OUT' ? adjustQty : null,
    };

    setLedgerEntries([...ledgerEntries, newEntry]);
    setActiveView('ledger');
    
    // Reset form
    setDirection('');
    setAdjType('');
    setSupplierCode('');
    setInvoiceRef('');
    setPoRef('');
    setEmbroidererCode('');
    setDeliveryRef('');
    setPendingJob('');
    setNotes('');
    setAdjustQty(1);
  };

  const isReceivingEmbroidery = direction === 'IN' && adjType === 'EMBROIDERY';
  const displayCode = isReceivingEmbroidery ? '2060' : '2058';
  const displayDesc = isReceivingEmbroidery ? 'JSY P/O GORDON ROAD NAVY' : 'JSY P/O PLAIN PLN NAVY';
  const isQtyLocked = pendingJob === 'JOB-1055';

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans text-sm text-gray-800">
      <div className="max-w-7xl mx-auto bg-white shadow-xl border border-gray-300 rounded overflow-hidden">
        
        {/* Top Navigation */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-4 py-3 flex justify-between items-center shadow">
          <span className="font-bold text-lg tracking-wide">Gem Schoolwear - Stock Adjustment/Ledger Prototype</span>
          <div className="space-x-2">
            <button 
              onClick={() => setActiveView('adjustment')}
              className={`px-4 py-1.5 rounded transition ${activeView === 'adjustment' ? 'bg-white text-blue-900 font-bold shadow' : 'bg-blue-700 hover:bg-blue-600'}`}
            >
              Stock Adjustment
            </button>
            <button 
              onClick={() => setActiveView('ledger')}
              className={`px-4 py-1.5 rounded transition ${activeView === 'ledger' ? 'bg-white text-blue-900 font-bold shadow' : 'bg-blue-700 hover:bg-blue-600'}`}
            >
              Ledger View
            </button>
          </div>
        </div>

        {/* --- ADJUSTMENT SCREEN VIEW --- */}
        {activeView === 'adjustment' && (
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Left Side: Legacy/Standard Fields Header (Simulating Delphi UI) */}
              <div className="flex-1 space-y-4">
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-md shadow-inner">
                  <h3 className="font-bold text-gray-600 mb-3 border-b pb-1">General Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-500 mb-1">A/C No.</label>
                      <input type="text" disabled value="1002" className="border border-gray-300 p-1.5 bg-gray-200 rounded" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-500 mb-1">Main Acc</label>
                      <input type="text" disabled value="Stock Adjustment" className="border border-gray-300 p-1.5 bg-gray-200 rounded" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-500 mb-1">Ref No.</label>
                      <input type="text" disabled value="AUTOMATIC" className="border border-gray-300 p-1.5 bg-gray-200 rounded" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-500 mb-1">Adj. Date</label>
                      <input type="text" disabled value="13/08/2026" className="border border-gray-300 p-1.5 bg-gray-200 rounded" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-500 mb-1">Dept Code</label>
                      <input type="text" disabled value="GEM" className="border border-gray-300 p-1.5 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: NEW Traceability Controls */}
              <div className="flex-1 border-l-4 border-blue-500 bg-blue-50 p-5 rounded-r-md shadow-sm">
                <h3 className="font-bold text-blue-900 mb-4 text-lg">Traceability & Categorization</h3>
                
                {/* 1. Direction */}
                <div className="mb-5 bg-white p-3 border border-blue-100 rounded shadow-sm">
                  <label className="font-semibold block mb-2 text-gray-700">1. Transaction Direction <span className="text-red-500">*</span></label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded border border-transparent hover:border-gray-200 transition">
                      <input type="radio" name="dir" value="IN" className="mr-2 w-4 h-4 text-blue-600" onChange={(e) => {setDirection(e.target.value); setAdjType(''); setPendingJob('');}} checked={direction === 'IN'} />
                      <span className="font-medium text-green-700">IN (Stock Increase)</span>
                    </label>
                    <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded border border-transparent hover:border-gray-200 transition">
                      <input type="radio" name="dir" value="OUT" className="mr-2 w-4 h-4 text-blue-600" onChange={(e) => {setDirection(e.target.value); setAdjType(''); setPendingJob('');}} checked={direction === 'OUT'} />
                      <span className="font-medium text-red-700">OUT (Stock Decrease)</span>
                    </label>
                  </div>
                </div>

                {/* 2. Type */}
                <div className="mb-5 bg-white p-3 border border-blue-100 rounded shadow-sm">
                  <label className="font-semibold block mb-2 text-gray-700">2. Adjustment Reason <span className="text-red-500">*</span></label>
                  <select 
                    className="w-full border border-gray-300 rounded p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={adjType}
                    onChange={(e) => {setAdjType(e.target.value); setPendingJob('');}}
                    disabled={!direction}
                  >
                    <option value="">-- Select Category --</option>
                    <option value="CORRECTION">General Stock Correction</option>
                    <option value="SAMPLE">Customer Samples</option>
                    
                    {direction === 'IN' && (
                      <>
                        <option value="SUPPLIER">Stock Received - External Supplier</option>
                        <option value="EMBROIDERY">Stock Received - Embroidery / Printing</option>
                      </>
                    )}
                    
                    {direction === 'OUT' && (
                      <>
                        <option value="EMBROIDERY">Sent Out - Embroidery / Printing</option>
                        <option value="DONATION">Donations / Giveaways</option>
                        <option value="DAMAGED">Damaged / Scrapped Garments</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Dynamic Fields Section */}
                {adjType && (
                  <div className="mt-4 animate-in fade-in duration-300">
                    
                    {adjType === 'SUPPLIER' && (
                      <div className="bg-white border-2 border-indigo-200 rounded-md p-4 space-y-3 shadow-sm">
                        <h4 className="font-bold text-indigo-800 border-b border-indigo-100 pb-2 mb-3">Required Supplier Data</h4>
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-gray-600 mb-1">Supplier Account (Database Lookup) *</label>
                          <select className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setSupplierCode(e.target.value)} value={supplierCode}>
                            <option value="">-- Select Supplier --</option>
                            <option value="SUP-EXOTEX">Exotex</option>
                            <option value="SUP-KEMKNIT">Kem-Knit</option>
                          </select>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex flex-col flex-1">
                            <label className="text-xs font-bold text-gray-600 mb-1">Supplier Invoice *</label>
                            <input type="text" className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="INV-000" onChange={(e) => setInvoiceRef(e.target.value)} value={invoiceRef}/>
                          </div>
                          <div className="flex flex-col flex-1">
                            <label className="text-xs font-bold text-gray-600 mb-1">P.O. Reference *</label>
                            <input type="text" className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="PO-000" onChange={(e) => setPoRef(e.target.value)} value={poRef}/>
                          </div>
                        </div>
                      </div>
                    )}

                    {adjType === 'EMBROIDERY' && (
                      <div className="bg-white border-2 border-purple-200 rounded-md p-4 space-y-3 shadow-sm">
                        <h4 className="font-bold text-purple-800 border-b border-purple-100 pb-2 mb-3">Required External Processing Data</h4>
                        
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-gray-600 mb-1">Embroiderer Account (Database Lookup) *</label>
                          <select className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none" onChange={(e) => setEmbroidererCode(e.target.value)} value={embroidererCode}>
                            <option value="">-- Select Embroiderer --</option>
                            <option value="EMB-MONOGRAMS">Monograms</option>
                            <option value="EMB-PALS">Pals</option>
                          </select>
                        </div>

                        {direction === 'OUT' && (
                          <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-600 mb-1">Job Ref / Delivery Note (To send with goods) *</label>
                            <input type="text" className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. JOB-1056" onChange={(e) => setDeliveryRef(e.target.value)} value={deliveryRef}/>
                          </div>
                        )}

                        {direction === 'IN' && (
                          <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-600 mb-1">Select Pending Job (To link quantities) *</label>
                            <select className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none" onChange={(e) => setPendingJob(e.target.value)} value={pendingJob}>
                              <option value="">-- Pending Dispatch Jobs --</option>
                              <option value="JOB-1055">JOB-1055 (50x Plain Navy Sent 01-Aug)</option>
                            </select>
                            {isQtyLocked && (
                              <p className="text-xs text-green-700 font-bold mt-2 bg-green-100 p-1.5 rounded">
                                ✔ Job Found! Incoming quantity is locked to match original dispatched amount (50).
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {(adjType === 'DONATION' || adjType === 'DAMAGED' || adjType === 'CORRECTION' || adjType === 'SAMPLE') && (
                      <div className="bg-white border-2 border-orange-200 rounded-md p-4 space-y-3 shadow-sm">
                        <h4 className="font-bold text-orange-800 border-b border-orange-100 pb-2 mb-3">Supporting Details</h4>
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-gray-600 mb-1">Notes / Authorization / Reason</label>
                          <input type="text" className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Provide context..." onChange={(e) => setNotes(e.target.value)} value={notes}/>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>

            {/* Simulated Grid (Data Entry Area) */}
            <div className="mt-8 border border-gray-300 rounded-md shadow-sm overflow-hidden bg-white">
              <div className="bg-gray-100 p-2 border-b border-gray-300 flex justify-between items-center font-semibold text-gray-700 text-sm">
                <span>Item Entry (Simulated Delphi Grid)</span>
                {isReceivingEmbroidery && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Stock Code dynamically changed for Receiving</span>
                )}
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-blue-50 text-blue-900 border-b border-gray-200">
                  <tr>
                    <th className="p-2">Stock Code</th>
                    <th className="p-2 w-1/3">Description</th>
                    <th className="p-2">Colour</th>
                    <th className="p-2">Size</th>
                    <th className="p-2 text-right">Unit Price</th>
                    <th className="p-2 text-right">Adjustment Qty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className={`p-2 font-mono font-bold ${isReceivingEmbroidery ? 'text-purple-700' : ''}`}>{displayCode}</td>
                    <td className={`p-2 font-bold ${isReceivingEmbroidery ? 'text-purple-700' : ''}`}>{displayDesc}</td>
                    <td className="p-2">NAVY</td>
                    <td className="p-2">36</td>
                    <td className="p-2 text-right">209.30</td>
                    <td className="p-2 text-right">
                      <input 
                        type="number" 
                        min="1" 
                        className={`w-20 border p-1 text-right rounded font-bold outline-none ${isQtyLocked ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' : 'border-gray-300 text-blue-800 focus:ring-2 focus:ring-blue-500'}`}
                        value={adjustQty}
                        onChange={(e) => setAdjustQty(Number(e.target.value))}
                        disabled={isQtyLocked}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
                <button 
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded shadow transition transform hover:scale-105"
                >
                  Post Transaction
                </button>
              </div>
            </div>

          </div>
        )}

        {/* --- LEDGER SCREEN VIEW --- */}
        {activeView === 'ledger' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2 text-blue-900">Inventory Ledger History</h2>
            <p className="text-gray-600 mb-6">Compare the old generic transactions with the new structured data generated by our improved UI.</p>
            
            <div className="overflow-x-auto border border-gray-300 rounded-md shadow-sm">
              <table className="w-full text-xs bg-white text-left whitespace-nowrap">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Ref No</th>
                    <th className="py-2.5 px-3 font-bold text-yellow-300">Account Name</th>
                    <th className="py-2.5 px-3 font-bold text-yellow-300">Order No</th>
                    <th className="py-2.5 px-3 font-bold text-yellow-300">Other Ref</th>
                    <th className="py-2.5 px-3">Barcode</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">In</th>
                    <th className="py-2.5 px-3 text-right">Out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ledgerEntries.map((entry, index) => {
                    const isNew = index >= 2;
                    return (
                      <tr key={entry.id} className={isNew ? 'bg-green-50 hover:bg-green-100 transition' : 'hover:bg-gray-50 transition text-gray-500'}>
                        <td className="py-2 px-3">{entry.date}</td>
                        <td className={`py-2 px-3 font-bold ${isNew ? 'text-blue-700' : 'text-gray-400'}`}>
                          {isNew && <span className="inline-block bg-blue-100 text-blue-800 rounded px-1 text-[10px] mr-1 mr-1">{entry.type}</span>}
                          {!isNew && entry.type}
                        </td>
                        <td className="py-2 px-3">{entry.refNo}</td>
                        <td className={`py-2 px-3 ${isNew ? 'font-bold text-gray-800' : ''}`}>{entry.accountName}</td>
                        <td className="py-2 px-3 text-blue-600 font-mono">{entry.orderNo}</td>
                        <td className="py-2 px-3 text-blue-600 font-mono">{entry.otherRef}</td>
                        <td className="py-2 px-3">{entry.barcode}</td>
                        <td className="py-2 px-3">{entry.desc}</td>
                        <td className="py-2 px-3 text-right font-semibold text-green-600">{entry.qtyIn || ''}</td>
                        <td className="py-2 px-3 text-right font-semibold text-red-600">{entry.qtyOut || ''}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
