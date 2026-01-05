
export interface BillItem {
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  approvedAmount: number;
}

export interface BillingData {
  patientName: string;
  memberNumber: string;
  transactionDate: string;
  riskCarrier: string;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyPhone: string;
  detailedBill: BillItem[];
  totalApproved: number;
  netAmount: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  REVIEW = 'REVIEW',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR'
}
