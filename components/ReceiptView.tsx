
import React from 'react';
import { BillingData } from '../types';

interface Props {
  data: BillingData;
}

const ReceiptView: React.FC<Props> = ({ data }) => {
  // Using Egyptian Pound (EGP) formatting as requested
  const currencyFormatter = new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    currencyDisplay: 'symbol'
  });

  return (
    <div 
      className="bg-white rounded-sm overflow-hidden flex flex-col" 
      id="receipt-content"
      style={{ 
        width: '100%', 
        maxWidth: '210mm', 
        minHeight: '297mm', // Standard A4 height
        margin: '0 auto',
        padding: '20mm',
        boxSizing: 'border-box',
        boxShadow: '0 0 10px rgba(0,0,0,0.05)'
      }}
    >
      {/* Pharmacy Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{data.pharmacyName || 'PHARMACY RECEIPT'}</h1>
          <p className="text-xs text-slate-600 font-bold">{data.pharmacyAddress}</p>
          <p className="text-xs text-slate-600 font-bold">TEL: {data.pharmacyPhone}</p>
        </div>
        <div className="text-right">
          <div className="inline-block bg-slate-900 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-2">
            PharmaScan Digital Verified
          </div>
          <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Receipt #: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-10">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Details</p>
            <p className="text-lg font-black text-slate-900 leading-tight">{data.patientName || 'NOT SPECIFIED'}</p>
            <div className="flex flex-col gap-0.5 mt-2">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                Member No: <span className="text-slate-900 font-black">{data.memberNumber || 'N/A'}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-right">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Info</p>
            <p className="text-base font-black text-slate-900">DATE: {data.transactionDate || 'N/A'}</p>
            <p className="text-xs font-bold text-slate-600">RISK CARRIER: <span className="text-slate-900">{data.riskCarrier || 'N/A'}</span></p>
          </div>
        </div>
      </div>

      <div className="grow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="py-3 text-[10px] font-black uppercase tracking-widest text-slate-900">Description / Details</th>
              <th className="py-3 px-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-900 w-16">Qty</th>
              <th className="py-3 px-2 text-right text-[10px] font-black uppercase tracking-widest text-slate-900 w-24">U.Price</th>
              <th className="py-3 px-2 text-right text-[10px] font-black uppercase tracking-widest text-slate-900 w-24">Approved</th>
              <th className="py-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-900 w-28">Total Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.detailedBill.map((item, idx) => (
              <tr key={idx} className="align-top">
                <td className="py-4 pr-4">
                  <p className="text-sm font-black text-slate-900 uppercase leading-snug">{item.itemDescription}</p>
                </td>
                <td className="py-4 px-2 text-center font-mono text-sm text-slate-900">{item.quantity}</td>
                <td className="py-4 px-2 text-right font-mono text-sm text-slate-600 font-medium">
                  {currencyFormatter.format(item.unitPrice || 0)}
                </td>
                <td className="py-4 px-2 text-right font-mono text-sm text-green-700 font-bold">
                  {currencyFormatter.format(item.approvedAmount || 0)}
                </td>
                <td className="py-4 text-right font-mono text-sm font-black text-slate-900">
                  {currencyFormatter.format(item.totalPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 pt-8 border-t-2 border-slate-900 space-y-4 ml-auto w-full max-w-[420px]">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
          <span>Total Approved Amount</span>
          <span className="font-mono text-slate-900 text-sm">{currencyFormatter.format(data.totalApproved)}</span>
        </div>
        <div className="flex justify-between items-center pt-5 border-t border-slate-200">
          <span className="text-base font-black uppercase tracking-tighter">Net Amount Payable</span>
          <span className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{currencyFormatter.format(data.netAmount)}</span>
        </div>
      </div>

      <div className="mt-20 pt-8 border-t border-slate-100 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
          PharmaScan AI Automated Reconciliation System (EGP)
        </p>
        <div className="flex justify-center gap-10 opacity-30">
          <div className="h-10 w-24 bg-slate-200 rounded"></div>
          <div className="h-10 w-24 bg-slate-200 rounded"></div>
          <div className="h-10 w-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptView;
