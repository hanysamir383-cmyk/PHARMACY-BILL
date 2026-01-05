
import React from 'react';
import { User, CreditCard, Calendar, Shield, List, DollarSign, MapPin } from 'lucide-react';
import { BillingData, BillItem } from '../types';

interface Props {
  data: BillingData;
  onUpdate: (data: BillingData) => void;
}

const ExtractionResults: React.FC<Props> = ({ data, onUpdate }) => {
  const handleChange = (field: keyof BillingData, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleItemChange = (index: number, field: keyof BillItem, value: any) => {
    const newItems = [...data.detailedBill];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate({ ...data, detailedBill: newItems });
  };

  const addItem = () => {
    onUpdate({
      ...data,
      detailedBill: [...data.detailedBill, { itemDescription: '', quantity: 1, unitPrice: 0, totalPrice: 0, approvedAmount: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = data.detailedBill.filter(((_, i) => i !== index));
    onUpdate({ ...data, detailedBill: newItems });
  };

  return (
    <div className="space-y-6">
      {/* Pharmacy Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Pharmacy Details</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Pharmacy Name</label>
            <input 
              type="text" 
              value={data.pharmacyName || ''} 
              onChange={(e) => handleChange('pharmacyName', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              placeholder="Pharmacy Name"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">Pharmacy Phone</label>
              <input 
                type="text" 
                value={data.pharmacyPhone || ''} 
                onChange={(e) => handleChange('pharmacyPhone', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Phone Number"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">Pharmacy Address</label>
              <input 
                type="text" 
                value={data.pharmacyAddress || ''} 
                onChange={(e) => handleChange('pharmacyAddress', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Street Address, City"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <User className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Patient & Member Details</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Patient Name</label>
            <input 
              type="text" 
              value={data.patientName || ''} 
              onChange={(e) => handleChange('patientName', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Transaction Date</label>
            <input 
              type="text" 
              value={data.transactionDate || ''} 
              onChange={(e) => handleChange('transactionDate', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Member Number</label>
            <input 
              type="text" 
              value={data.memberNumber || ''} 
              onChange={(e) => handleChange('memberNumber', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter Member ID"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Risk Carrier</label>
            <input 
              type="text" 
              value={data.riskCarrier || ''} 
              onChange={(e) => handleChange('riskCarrier', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Detailed Bill Items</h3>
          </div>
          <button 
            onClick={addItem}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            + Add Item
          </button>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="px-6 py-3 text-left font-semibold uppercase text-xs">Description</th>
                <th className="px-2 py-3 text-center font-semibold uppercase text-xs w-16">Qty</th>
                <th className="px-2 py-3 text-right font-semibold uppercase text-xs w-20">U.Price</th>
                <th className="px-2 py-3 text-right font-semibold uppercase text-xs w-20">Approved</th>
                <th className="px-2 py-3 text-right font-semibold uppercase text-xs w-24">Total</th>
                <th className="px-4 py-3 text-right font-semibold uppercase text-xs"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.detailedBill.map((item, idx) => (
                <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 min-w-[180px]">
                    <input 
                      type="text" 
                      value={item.itemDescription || ''} 
                      onChange={(e) => handleItemChange(idx, 'itemDescription', e.target.value)}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-3">
                    <input 
                      type="number" 
                      value={item.quantity || 0} 
                      onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value))}
                      className="w-full bg-transparent border-none p-0 text-center focus:ring-0 text-sm focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-3 text-right">
                    <input 
                      type="number" 
                      step="0.01"
                      value={item.unitPrice || 0} 
                      onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value))}
                      className="w-full bg-transparent border-none p-0 text-right focus:ring-0 text-sm font-mono focus:outline-none text-slate-500"
                    />
                  </td>
                  <td className="px-2 py-3 text-right">
                    <input 
                      type="number" 
                      step="0.01"
                      value={item.approvedAmount || 0} 
                      onChange={(e) => handleItemChange(idx, 'approvedAmount', parseFloat(e.target.value))}
                      className="w-full bg-transparent border-none p-0 text-right focus:ring-0 text-sm font-mono focus:outline-none text-green-600"
                    />
                  </td>
                  <td className="px-2 py-3 text-right">
                    <input 
                      type="number" 
                      step="0.01"
                      value={item.totalPrice || 0} 
                      onChange={(e) => handleItemChange(idx, 'totalPrice', parseFloat(e.target.value))}
                      className="w-full bg-transparent border-none p-0 text-right focus:ring-0 text-sm font-mono font-bold focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 text-xs font-bold uppercase">
                      DEL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Financial Summary (EGP)</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Total Approved</label>
            <input 
              type="number" 
              step="0.01"
              value={data.totalApproved || 0} 
              onChange={(e) => handleChange('totalApproved', parseFloat(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Net Amount Payable</label>
            <input 
              type="number" 
              step="0.01"
              value={data.netAmount || 0} 
              onChange={(e) => handleChange('netAmount', parseFloat(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractionResults;
