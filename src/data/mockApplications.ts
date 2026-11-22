import { Application, StatusHistoryItem } from '../types';
import { calculateEmi } from '../utils/emi';

function createMockApp(
  id: string,
  applicant: Application['applicant'],
  employment: Application['employment'],
  loanDetails: { amount: number; rate: number; tenure: number },
  doc: Application['document'],
  status: Application['status'],
  createdAt: string,
  remarks?: string
): Application {
  const emiCalc = calculateEmi(loanDetails.amount, loanDetails.rate, loanDetails.tenure);

  const history: StatusHistoryItem[] = [
    {
      status: 'Pending',
      changedAt: createdAt,
      remarks: 'Application submitted online.',
    },
  ];

  if (status === 'Under Review') {
    history.push({
      status: 'Under Review',
      changedAt: new Date(new Date(createdAt).getTime() + 86400000).toISOString(),
      remarks: remarks || 'Documents under verification by underwriting team.',
    });
  } else if (status === 'Approved') {
    history.push({
      status: 'Under Review',
      changedAt: new Date(new Date(createdAt).getTime() + 86400000).toISOString(),
      remarks: 'Documents verified. Credit assessment cleared.',
    });
    history.push({
      status: 'Approved',
      changedAt: new Date(new Date(createdAt).getTime() + 172800000).toISOString(),
      remarks: remarks || 'Sanction letter issued. Loan approved.',
    });
  } else if (status === 'Rejected') {
    history.push({
      status: 'Under Review',
      changedAt: new Date(new Date(createdAt).getTime() + 86400000).toISOString(),
      remarks: 'Underwriter review initiated.',
    });
    history.push({
      status: 'Rejected',
      changedAt: new Date(new Date(createdAt).getTime() + 172800000).toISOString(),
      remarks: remarks || 'Application does not meet eligibility threshold.',
    });
  }

  return {
    id,
    applicant,
    employment,
    loan: {
      ...loanDetails,
      ...emiCalc,
    },
    document: doc,
    status,
    createdAt,
    updatedAt: history[history.length - 1].changedAt,
    history,
  };
}

export const INITIAL_MOCK_APPLICATIONS: Application[] = [
  createMockApp(
    'AA-2026-0008',
    {
      fullName: 'Priya Sharma',
      phone: '9820123456',
      email: 'priya.sharma@gmail.com',
      pan: 'ABCPS1234F',
      dob: '1993-04-15',
    },
    {
      employmentType: 'Salaried',
      companyName: 'Infosys Technologies Ltd',
      monthlySalary: 145000,
      existingEmis: 12000,
    },
    { amount: 1000000, rate: 10.5, tenure: 36 },
    {
      name: 'Priya_Sharma_PAN_SalarySlip.pdf',
      size: 1450000,
      type: 'application/pdf',
    },
    'Approved',
    '2026-11-18T10:30:00.000Z',
    'Strong credit profile (CIBIL 792) and verified banking credentials. Approved as requested.'
  ),
  createMockApp(
    'AA-2026-0007',
    {
      fullName: 'Rohan Verma',
      phone: '9811223344',
      email: 'rohan.verma@outlook.com',
      pan: 'BCDRV5678A',
      dob: '1988-11-20',
    },
    {
      employmentType: 'Self-Employed',
      businessName: 'Verma Electronics & Retail',
      annualTurnover: 2400000,
      existingEmis: 25000,
    },
    { amount: 750000, rate: 12.0, tenure: 24 },
    {
      name: 'GST_Returns_FY25_26.pdf',
      size: 1820000,
      type: 'application/pdf',
    },
    'Pending',
    '2026-11-19T14:15:00.000Z'
  ),
  createMockApp(
    'AA-2026-0006',
    {
      fullName: 'Ananya Iyer',
      phone: '9731234567',
      email: 'ananya.iyer@swiggy.in',
      pan: 'CDEAI9012B',
      dob: '1996-08-10',
    },
    {
      employmentType: 'Salaried',
      companyName: 'Bundl Technologies (Swiggy)',
      monthlySalary: 95000,
      existingEmis: 8000,
    },
    { amount: 500000, rate: 9.5, tenure: 24 },
    {
      name: 'Ananya_Iyer_Aadhaar_PAN.jpg',
      size: 980000,
      type: 'image/jpeg',
    },
    'Under Review',
    '2026-11-15T09:45:00.000Z',
    'Salary slips verified; physical workplace verification in progress.'
  ),
  createMockApp(
    'AA-2026-0005',
    {
      fullName: 'Vikram Malhotra',
      phone: '9876543210',
      email: 'vikram.malhotra@yahoo.com',
      pan: 'DEFVM3456C',
      dob: '1985-02-28',
    },
    {
      employmentType: 'Self-Employed',
      businessName: 'Malhotra Freight Logistics',
      annualTurnover: 1500000,
      existingEmis: 45000,
    },
    { amount: 1800000, rate: 14.5, tenure: 36 },
    {
      name: 'Bank_Statement_6M_Malhotra.pdf',
      size: 1950000,
      type: 'application/pdf',
    },
    'Rejected',
    '2026-11-10T16:20:00.000Z',
    'Total monthly debt obligation (₹1,06,942) exceeds 50% FOIR limit. Inadequate debt service coverage.'
  ),
  createMockApp(
    'AA-2026-0004',
    {
      fullName: 'Sneha Reddy',
      phone: '9848012345',
      email: 'sneha.reddy@titan.co.in',
      pan: 'EFGSR7890D',
      dob: '1991-06-18',
    },
    {
      employmentType: 'Salaried',
      companyName: 'Titan Company Limited',
      monthlySalary: 110000,
      existingEmis: 15000,
    },
    { amount: 600000, rate: 10.0, tenure: 36 },
    {
      name: 'Sneha_Reddy_PAN_Card.png',
      size: 640000,
      type: 'image/png',
    },
    'Approved',
    '2026-11-08T11:00:00.000Z',
    'Pre-approved customer with consistent income track record. Sanction letter issued.'
  ),
  createMockApp(
    'AA-2026-0003',
    {
      fullName: 'Rajesh Gupta',
      phone: '9920198765',
      email: 'rajesh.gupta@hdfcsec.com',
      pan: 'FGHKA2345E',
      dob: '1994-09-05',
    },
    {
      employmentType: 'Salaried',
      companyName: 'HDFC Securities Ltd',
      monthlySalary: 82000,
      existingEmis: 5000,
    },
    { amount: 400000, rate: 11.0, tenure: 18 },
    {
      name: 'Salary_Slip_Form16_Rajesh.pdf',
      size: 1100000,
      type: 'application/pdf',
    },
    'Pending',
    '2026-11-20T08:30:00.000Z'
  ),
  createMockApp(
    'AA-2026-0002',
    {
      fullName: 'Pooja Nair',
      phone: '9895054321',
      email: 'pooja.nair@nairdesigns.com',
      pan: 'GHIAB6789F',
      dob: '1990-12-14',
    },
    {
      employmentType: 'Self-Employed',
      businessName: 'Nair Architectural Studio',
      annualTurnover: 3200000,
      existingEmis: 30000,
    },
    { amount: 1200000, rate: 11.5, tenure: 48 },
    {
      name: 'Pooja_Nair_ITR_FY25.pdf',
      size: 1650000,
      type: 'application/pdf',
    },
    'Under Review',
    '2026-11-12T13:40:00.000Z',
    'Income tax returns validated; awaiting final credit committee approval.'
  ),
  createMockApp(
    'AA-2026-0001',
    {
      fullName: 'Amit Patel',
      phone: '9825067890',
      email: 'amit.patel@rediffmail.com',
      pan: 'HIJAP0123G',
      dob: '1998-03-22',
    },
    {
      employmentType: 'Salaried',
      companyName: 'Delta Express Logistics',
      monthlySalary: 28000,
      existingEmis: 9500,
    },
    { amount: 350000, rate: 13.5, tenure: 24 },
    {
      name: 'Amit_Patel_PAN_AddressProof.jpg',
      size: 890000,
      type: 'image/jpeg',
    },
    'Rejected',
    '2026-10-28T15:10:00.000Z',
    'Insufficient disposable income relative to requested EMI. High default risk.'
  ),
];
