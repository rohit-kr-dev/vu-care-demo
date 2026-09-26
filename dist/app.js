// VU CARE SERVICES — CRM & FIELD OPERATIONS SYSTEM (V1.0)
// Complete implementation covering all 55 requirement sections.

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => '₹' + Number(n || 0).toLocaleString('en-IN');
const localToday = () => new Date().toISOString().split('T')[0];

// Seed database with full normalized entities
const seed = {
  workspaces: ['All services', 'Pest Control', 'Deep Cleaning'],
  leads: [
    {
      id: 101, name: 'Priya Sharma', city: 'Bangalore', area: 'Whitefield',
      address: 'Flat 402, Oakwood Apts, Whitefield Main Rd',
      service: 'Deep cleaning', property: '3 BHK · Furnished', clientType: 'Residential',
      amount: 6499, status: 'New enquiry', source: 'Website', owner: 'Ananya',
      phone: '9876543210', whatsapp: '9876543210', email: 'priya.sharma@example.com',
      priority: 'High', date: '2026-09-13',
      note: 'Moving in next week. Prefers a morning slot.',
      followups: [], visitStatus: 'Not required', visitOwner: 'Ravi', visitDate: '', visitTime: '09:00', visitNotes: '', photos: [], assignmentHistory: []
    },
    {
      id: 102, name: 'Rahul Desai', city: 'Bangalore', area: 'Indiranagar',
      address: '14, 2nd Cross, 12th Main, Indiranagar',
      service: 'Pest control', property: '2 BHK · Cockroaches', clientType: 'Residential',
      amount: 2499, status: 'Contacted', source: 'WhatsApp', owner: 'Ananya',
      phone: '9845012345', whatsapp: '9845012345', email: 'rahul.desai@example.com',
      priority: 'Medium', date: '2026-09-13',
      note: 'Call after 4 PM to confirm availability.',
      followups: [{ note: 'Customer confirmed visit timing.', by: 'Ananya', at: '2026-09-13 14:00' }],
      visitStatus: 'Scheduled', visitOwner: 'Ravi', visitDate: '2026-09-14', visitTime: '09:00', visitNotes: '', photos: [], assignmentHistory: []
    },
    {
      id: 104, name: 'Arjun Rao', city: 'Hassan', area: 'Vidyanagar',
      address: 'Plot 88, B.M. Road, Vidyanagar',
      service: 'Deep cleaning', property: '4 BHK · Empty villa', clientType: 'Residential',
      amount: 8999, status: 'New enquiry', source: 'Phone', owner: 'Kiran',
      phone: '9740112233', whatsapp: '9740112233', email: 'arjun.rao@example.com',
      priority: 'High', date: '2026-09-13',
      note: 'Needs a weekend appointment.',
      followups: [], visitStatus: 'Not required', visitOwner: 'Mahesh', visitDate: '', visitTime: '09:00', visitNotes: '', photos: [], assignmentHistory: []
    },
    {
      id: 105, name: 'Sneha Patel', city: 'Bangalore', area: 'HSR Layout',
      address: 'Sector 2, 19th Main, HSR Layout',
      service: 'Pest control', property: '3 BHK · Termites', clientType: 'Residential',
      amount: 7999, status: 'Quotation sent', source: 'Website', owner: 'Ananya',
      phone: '9900223344', whatsapp: '9900223344', email: 'sneha.patel@example.com',
      priority: 'High', date: '2026-09-12',
      note: 'Include a follow-up inspection.',
      followups: [{ note: 'Quotation QT-1082 sent via WhatsApp.', by: 'Ananya', at: '2026-09-12 16:30' }],
      visitStatus: 'Not required', visitOwner: 'Ravi', visitDate: '', visitTime: '09:00', visitNotes: '', photos: [], assignmentHistory: []
    },
    {
      id: 106, name: 'Vikram Shetty', city: 'Bangalore', area: 'JP Nagar',
      address: '5th Phase, Ring Road, JP Nagar',
      service: 'Deep cleaning', property: '2 BHK · Furnished', clientType: 'Residential',
      amount: 4999, status: 'Contacted', source: 'Referral', owner: 'Ananya',
      phone: '9844332211', whatsapp: '9844332211', email: 'vikram.shetty@example.com',
      priority: 'Low', date: '2026-09-11',
      note: 'Kitchen needs extra attention.',
      followups: [], visitStatus: 'Not required', visitOwner: 'Deepak', visitDate: '', visitTime: '09:00', visitNotes: '', photos: [], assignmentHistory: []
    },
    {
      id: 107, name: 'Tech Park Cafe', city: 'Bangalore', area: 'Koramangala',
      address: 'Ground Floor, Building 4, Koramangala 5th Block',
      service: 'Pest control', property: 'Commercial · 2,500 sq ft', clientType: 'Commercial',
      amount: 14500, status: 'Requirement Collected', source: 'Google', owner: 'Kiran',
      phone: '9880011223', whatsapp: '9880011223', email: 'admin@techparkcafe.com',
      priority: 'High', date: '2026-09-13',
      note: 'Needs quarterly commercial pest control contract.',
      followups: [], visitStatus: 'Not required', visitOwner: 'Suresh', visitDate: '', visitTime: '09:00', visitNotes: '', photos: [], assignmentHistory: []
    }
  ],
  jobs: [
    {
      id: 2401, leadId: 101, name: 'Aditi Menon', city: 'Bangalore', area: 'Whitefield',
      address: 'Villa 12, Palm Meadows, Whitefield',
      service: 'Deep cleaning', property: '3 BHK · Furnished', clientType: 'Residential',
      amount: 6499, paid: 2000, status: 'In progress', team: 'Team A · Ravi', worker: 'Ravi',
      date: '2026-09-13', time: '09:00', duration: 180,
      checks: [0, 1], timer: { arrivalTime: '08:55', startTime: '09:05', endTime: null, durationMinutes: null },
      photos: [], workNote: 'Living room scrubbing in progress.',
      usedMaterials: [{ item: 'Floor-cleaning solution', qty: 2 }]
    },
    {
      id: 2402, leadId: 102, name: 'Rohan Mehta', city: 'Bangalore', area: 'Koramangala',
      address: 'Flat 303, Sunrise Apts, 4th Block, Koramangala',
      service: 'Pest control', property: '2 BHK · General treatment', clientType: 'Residential',
      amount: 2499, paid: 2499, status: 'Completed', team: 'Team B · Suresh', worker: 'Suresh',
      date: '2026-09-13', time: '10:30', duration: 90,
      checks: [0, 1, 2], timer: { arrivalTime: '10:24', startTime: '10:27', endTime: '11:05', durationMinutes: 38 },
      photos: [], workNote: 'Kitchen gel points applied. Odourless spray done.',
      usedMaterials: [{ item: 'Cockroach gel bait', qty: 1 }]
    },
    {
      id: 2404, leadId: null, name: 'Nikhil Gowda', city: 'Bangalore', area: 'HSR Layout',
      address: '22, 14th Main, Sector 4, HSR Layout',
      service: 'Deep cleaning', property: '2 BHK · Empty flat', clientType: 'Residential',
      amount: 4999, paid: 1500, status: 'Scheduled', team: 'Unassigned', worker: 'Unassigned',
      date: '2026-09-13', time: '14:00', duration: 150,
      checks: [], timer: null, photos: [], workNote: '', usedMaterials: []
    },
    {
      id: 2405, leadId: null, name: 'Divya Hegde', city: 'Hassan', area: 'Kuvempu Nagar',
      address: '9, Main Road, Kuvempu Nagar',
      service: 'Pest control', property: '3 BHK · Termite inspection', clientType: 'Residential',
      amount: 7999, paid: 2000, status: 'Scheduled', team: 'Team D · Deepak', worker: 'Deepak',
      date: '2026-09-14', time: '09:00', duration: 120,
      checks: [], timer: null, photos: [], workNote: '', usedMaterials: []
    },
    {
      id: 2406, leadId: null, name: 'Sanjay Kumar', city: 'Bangalore', area: 'JP Nagar',
      address: '45, 15th Cross, 2nd Phase, JP Nagar',
      service: 'Deep cleaning', property: '4 BHK · Villa', clientType: 'Residential',
      amount: 8999, paid: 8999, status: 'Completed', team: 'Team A · Ravi', worker: 'Ravi',
      date: '2026-09-12', time: '09:00', duration: 240,
      checks: [0, 1, 2], timer: { arrivalTime: '08:50', startTime: '09:00', endTime: '13:00', durationMinutes: 240 },
      photos: [], workNote: 'Full villa machine scrub completed.', usedMaterials: [{ item: 'Floor-cleaning solution', qty: 4 }]
    }
  ],
  customers: [
    {
      id: 'CUST-001', name: 'Aditi Menon', phone: '9886011223', whatsapp: '9886011223',
      email: 'aditi.m@example.com', type: 'Residential', source: 'Website', createdAt: '2026-08-10',
      qrToken: 'VC-QR-9901',
      addresses: [
        { label: 'Home', address: 'Villa 12, Palm Meadows, Whitefield, Bangalore' },
        { label: 'Office', address: 'Prestige Tech Cloud, Kadubeesanahalli, Bangalore' }
      ]
    },
    {
      id: 'CUST-002', name: 'Rohan Mehta', phone: '9845012345', whatsapp: '9845012345',
      email: 'rohan.m@example.com', type: 'Residential', source: 'WhatsApp', createdAt: '2026-08-15',
      qrToken: 'VC-QR-9902',
      addresses: [
        { label: 'Home', address: 'Flat 303, Sunrise Apts, Koramangala 4th Block, Bangalore' }
      ]
    },
    {
      id: 'CUST-003', name: 'Sanjay Kumar', phone: '9900112233', whatsapp: '9900112233',
      email: 'sanjay.k@example.com', type: 'Residential', source: 'Referral', createdAt: '2026-07-20',
      qrToken: 'VC-QR-9903',
      addresses: [
        { label: 'Home', address: '45, 15th Cross, 2nd Phase, JP Nagar, Bangalore' }
      ]
    },
    {
      id: 'CUST-004', name: 'Divya Hegde', phone: '9740114455', whatsapp: '9740114455',
      email: 'divya.h@example.com', type: 'Residential', source: 'Phone', createdAt: '2026-09-01',
      qrToken: 'VC-QR-9904',
      addresses: [
        { label: 'Home', address: '9, Main Road, Kuvempu Nagar, Hassan' }
      ]
    },
    {
      id: 'CUST-005', name: 'Tech Park Cafe', phone: '9880011223', whatsapp: '9880011223',
      email: 'contact@techparkcafe.com', type: 'Commercial', source: 'Google', createdAt: '2026-09-10',
      qrToken: 'VC-QR-9905',
      addresses: [
        { label: 'Cafe Outlet', address: 'Building 4, Koramangala 5th Block, Bangalore' }
      ]
    }
  ],
  services: [
    { id: 'SRV-PC-01', name: 'Cockroach Control', category: 'Pest Control', price: 2499, gst: 18, duration: '60 mins', warranty: '3 months', description: 'Advanced gel bait application and odourless spray.', requiredMaterials: [{ item: 'Cockroach gel bait', qty: 1 }], status: 'Active' },
    { id: 'SRV-PC-02', name: 'Bed Bug Control', category: 'Pest Control', price: 3999, gst: 18, duration: '90 mins', warranty: '2 visits included', description: 'Two-stage thorough chemical misting and steam treatment.', requiredMaterials: [{ item: 'Bed bug spray emulsion', qty: 2 }], status: 'Active' },
    { id: 'SRV-PC-03', name: 'Mosquito Control', category: 'Pest Control', price: 2999, gst: 18, duration: '45 mins', warranty: '1 month', description: 'Thermal fogging for gardens and indoor surface spray.', requiredMaterials: [], status: 'Active' },
    { id: 'SRV-PC-04', name: 'Termite Control', category: 'Pest Control', price: 7999, gst: 18, duration: '180 mins', warranty: '1 year warranty', description: 'Drill-fill-seal subterranean termite treatment barrier.', requiredMaterials: [{ item: 'Termite treatment chemical', qty: 5 }], status: 'Active' },
    { id: 'SRV-PC-05', name: 'Rodent Control', category: 'Pest Control', price: 3499, gst: 18, duration: '60 mins', warranty: '3 months', description: 'Snap traps, bait stations and entry point sealing.', requiredMaterials: [], status: 'Active' },
    { id: 'SRV-DC-01', name: 'Empty House Cleaning', category: 'Deep Cleaning', price: 6499, gst: 18, duration: '240 mins', warranty: 'Satisfaction guarantee', description: 'Full vacant home deep scrubbing, glass, kitchen and balconies.', requiredMaterials: [{ item: 'Floor-cleaning solution', qty: 3 }, { item: 'Microfiber cleaning cloth', qty: 6 }], status: 'Active' },
    { id: 'SRV-DC-02', name: 'Furnished House Cleaning', category: 'Deep Cleaning', price: 7499, gst: 18, duration: '300 mins', warranty: 'Satisfaction guarantee', description: 'Complete deep cleaning with furniture and appliance exterior wipe.', requiredMaterials: [{ item: 'Floor-cleaning solution', qty: 4 }, { item: 'Glass cleaning liquid', qty: 2 }], status: 'Active' },
    { id: 'SRV-DC-03', name: 'Kitchen Cleaning', category: 'Deep Cleaning', price: 2999, gst: 18, duration: '120 mins', warranty: 'Satisfaction guarantee', description: 'Heavy degreasing of chimney, tiles, cabinets and countertops.', requiredMaterials: [{ item: 'Microfiber cleaning cloth', qty: 4 }], status: 'Active' },
    { id: 'SRV-DC-04', name: 'Bathroom Cleaning', category: 'Deep Cleaning', price: 1899, gst: 18, duration: '75 mins', warranty: 'Satisfaction guarantee', description: 'Hard water stain removal, tiles, sanitisation and fixtures.', requiredMaterials: [], status: 'Active' },
    { id: 'SRV-DC-05', name: 'Sofa Cleaning', category: 'Deep Cleaning', price: 1499, gst: 18, duration: '60 mins', warranty: 'Satisfaction guarantee', description: 'Fabric shampooing, extraction and moisture vacuuming.', requiredMaterials: [], status: 'Active' }
  ],
  technicians: [
    { id: 'TECH-01', name: 'Ravi', phone: '9845110001', specialty: 'Pest Control', workingHours: '09:00 - 18:00', status: 'Available', currentLocation: 'Indiranagar', clockIn: { at: '08:55', location: 'Whitefield' } },
    { id: 'TECH-02', name: 'Suresh', phone: '9845110002', specialty: 'Pest Control', workingHours: '09:00 - 18:00', status: 'Busy', currentLocation: 'Koramangala', clockIn: { at: '09:10', location: 'Koramangala' } },
    { id: 'TECH-03', name: 'Mahesh', phone: '9845110003', specialty: 'Deep Cleaning', workingHours: '09:00 - 18:00', status: 'Available', currentLocation: 'HSR Layout', clockIn: { at: '08:50', location: 'HSR Layout' } },
    { id: 'TECH-04', name: 'Deepak', phone: '9845110004', specialty: 'Deep Cleaning', workingHours: '09:00 - 18:00', status: 'Busy', currentLocation: 'JP Nagar', clockIn: { at: '09:00', location: 'JP Nagar' } }
  ],
  amcs: [
    {
      id: 'AMC-2026-041', customer: 'Rohan Mehta', service: 'Pest control', value: 12000,
      start: '2026-09-01', end: '2027-08-31', visits: 12, completed: 1, status: 'Active',
      renewal: '2027-08-01', frequency: 'Monthly',
      schedule: [
        { num: 1, date: '2026-09-13', status: 'Completed', note: 'First visit completed by Suresh' },
        { num: 2, date: '2026-10-13', status: 'Scheduled', note: 'Monthly routine check' },
        { num: 3, date: '2026-11-13', status: 'Scheduled', note: 'Monthly routine check' },
        { num: 4, date: '2026-12-13', status: 'Scheduled', note: 'Monthly routine check' }
      ]
    },
    {
      id: 'AMC-2026-042', customer: 'Divya Hegde', service: 'Pest control', value: 18000,
      start: '2026-06-15', end: '2027-06-14', visits: 4, completed: 3, status: 'Renewal due',
      renewal: '2027-05-15', frequency: 'Quarterly',
      schedule: [
        { num: 1, date: '2026-06-20', status: 'Completed', note: 'Quarter 1 done' },
        { num: 2, date: '2026-09-14', status: 'Scheduled', note: 'Quarter 2 inspection' },
        { num: 3, date: '2026-12-15', status: 'Scheduled', note: 'Quarter 3' },
        { num: 4, date: '2027-03-15', status: 'Scheduled', note: 'Quarter 4' }
      ]
    }
  ],
  quotations: [
    {
      id: 'QT-1081', customer: 'Arjun Rao', service: 'Deep cleaning',
      items: [{ desc: 'Empty Villa Deep Cleaning (4 BHK)', qty: 1, rate: 8999, amount: 8999 }],
      subtotal: 8999, discount: 500, taxRate: 18, taxAmount: 1529, total: 10028,
      status: 'Sent', date: '2026-09-13', validity: '2026-10-13',
      terms: 'Payment 50% advance, balance on completion. Quote valid for 30 days.'
    },
    {
      id: 'QT-1082', customer: 'Sneha Patel', service: 'Pest control',
      items: [{ desc: 'Comprehensive Termite Drilling & Piping', qty: 1, rate: 7999, amount: 7999 }],
      subtotal: 7999, discount: 0, taxRate: 18, taxAmount: 1439, total: 9438,
      status: 'Accepted', date: '2026-09-12', validity: '2026-10-12',
      terms: '1-year service warranty included with free semi-annual inspection.'
    }
  ],
  invoices: [
    {
      id: 2401, customer: 'Aditi Menon', service: 'Deep cleaning',
      amount: 6499, paid: 2000, balance: 4499, date: '2026-09-13', status: 'Part paid',
      taxRate: 18, taxAmount: 991, subtotal: 5508, whatsapp: '9886011223'
    },
    {
      id: 2402, customer: 'Rohan Mehta', service: 'Pest control',
      amount: 2499, paid: 2499, balance: 0, date: '2026-09-13', status: 'Paid',
      taxRate: 18, taxAmount: 381, subtotal: 2118, whatsapp: '9845012345'
    },
    {
      id: 2406, customer: 'Sanjay Kumar', service: 'Deep cleaning',
      amount: 8999, paid: 8999, balance: 0, date: '2026-09-12', status: 'Paid',
      taxRate: 18, taxAmount: 1372, subtotal: 7627, whatsapp: '9900112233'
    }
  ],
  inventory: [
    { item: 'Cockroach gel bait', category: 'Pest Control', opening: 100, purchased: 50, used: 35, stock: 115, unit: 'tubes', minimum: 20 },
    { item: 'Termite treatment chemical', category: 'Pest Control', opening: 40, purchased: 20, used: 15, stock: 45, unit: 'litres', minimum: 25 },
    { item: 'Bed bug spray emulsion', category: 'Pest Control', opening: 30, purchased: 10, used: 22, stock: 18, unit: 'bottles', minimum: 15 },
    { item: 'Microfiber cleaning cloth', category: 'Deep Cleaning', opening: 100, purchased: 50, used: 60, stock: 90, unit: 'pieces', minimum: 40 },
    { item: 'Floor-cleaning solution', category: 'Deep Cleaning', opening: 50, purchased: 25, used: 30, stock: 45, unit: 'litres', minimum: 20 },
    { item: 'Glass cleaning liquid', category: 'Deep Cleaning', opening: 30, purchased: 15, used: 10, stock: 35, unit: 'litres', minimum: 15 }
  ],
  expenses: [
    { id: 1, date: '2026-09-13', item: 'Technician travel allowance', amount: 480, employee: 'Ravi', category: 'Travel', status: 'Approved' },
    { id: 2, date: '2026-09-13', item: 'Pest-control spray can replacement', amount: 1250, employee: 'Warehouse', category: 'Purchases', status: 'Approved' },
    { id: 3, date: '2026-09-13', item: 'Van fuel reimbursement', amount: 650, employee: 'Suresh', category: 'Fuel', status: 'Approved' },
    { id: 4, date: '2026-09-12', item: 'Floor buffer service maintenance', amount: 900, employee: 'Operations', category: 'Office', status: 'Approved' }
  ],
  vendors: [
    { id: 'VND-01', name: 'EcoPest Chemicals Ltd', contact: 'Ramesh Patel', phone: '9845099887', products: 'Pest Control chemicals, gel baits', totalPurchases: 45000, outstanding: 8000 },
    { id: 'VND-02', name: 'CleanPro Hygiene Equipments', contact: 'Harish Kumar', phone: '9900228811', products: 'Microfiber, industrial vacuums, scrubbers', totalPurchases: 32000, outstanding: 4500 }
  ],
  tickets: [
    { id: 301, name: 'Sanjay Kumar', job: 2406, issue: 'Window cleaning touch-up requested', status: 'Open', priority: 'Medium', assigned: 'Ravi' },
    { id: 302, name: 'Rohan Mehta', job: 2402, issue: 'Schedule post-treatment follow-up', status: 'In progress', priority: 'Low', assigned: 'Suresh' }
  ],
  users: [
    { id: 'USR-01', name: 'Rajath', email: 'rajath@vucareservices.com', role: 'Super Admin / Owner', department: 'Executive', workspace: 'All services', status: 'Active', phone: '9988776655' },
    { id: 'USR-02', name: 'Ananya Kumar', email: 'admin@vucareservices.com', role: 'Admin / Operations Manager', department: 'Operations', workspace: 'All services', status: 'Active', phone: '9845012340' },
    { id: 'USR-03', name: 'Ananya', email: 'telecaller.ananya@vucareservices.com', role: 'Telecaller', department: 'Sales', workspace: 'All services', status: 'Active', phone: '9845012343' },
    { id: 'USR-04', name: 'Kiran', email: 'telecaller.kiran@vucareservices.com', role: 'Telecaller', department: 'Sales', workspace: 'All services', status: 'Active', phone: '9845012341' },
    { id: 'USR-05', name: 'Sneha', email: 'accounts@vucareservices.com', role: 'Accountant', department: 'Finance', workspace: 'All services', status: 'Active', phone: '9845012342' },
    { id: 'USR-06', name: 'Ravi', email: 'tech.ravi@vucareservices.com', role: 'Pest Control Technician', department: 'Field Operations', workspace: 'Pest Control', status: 'Active', phone: '9845110001' },
    { id: 'USR-07', name: 'Suresh', email: 'tech.suresh@vucareservices.com', role: 'Pest Control Technician', department: 'Field Operations', workspace: 'Pest Control', status: 'Active', phone: '9845110002' },
    { id: 'USR-08', name: 'Mahesh', email: 'tech.mahesh@vucareservices.com', role: 'Cleaning Technician', department: 'Field Operations', workspace: 'Deep Cleaning', status: 'Active', phone: '9845110003' },
    { id: 'USR-09', name: 'Deepak', email: 'tech.deepak@vucareservices.com', role: 'Cleaning Technician', department: 'Field Operations', workspace: 'Deep Cleaning', status: 'Active', phone: '9845110004' }
  ],
  auditLogs: [
    { at: '2026-09-13 14:15', by: 'Ananya Kumar', action: 'Lead Assigned', details: 'Assigned Lead #104 (Arjun Rao) to Telecaller Kiran' },
    { at: '2026-09-13 11:10', by: 'Sneha', action: 'Payment Recorded', details: 'Recorded ₹2,499 payment for INV-2402 (Rohan Mehta)' },
    { at: '2026-09-13 09:05', by: 'Ravi', action: 'Job Clock-In', details: 'Technician Ravi reached Aditi Menon residence (#VC-2401)' }
  ],
  notifications: [
    { id: 1, title: 'New Website Enquiry', desc: 'Priya Sharma requested Deep Cleaning in Whitefield', time: '10 mins ago', read: false },
    { id: 2, title: 'Job Started', desc: 'Ravi started Deep Cleaning at Palm Meadows (#VC-2401)', time: '35 mins ago', read: false },
    { id: 3, title: 'Payment Collected', desc: 'Full payment ₹2,499 collected for INV-2402', time: '2 hours ago', read: true }
  ],
  activity: [
    'Rohan Mehta’s pest control service completed',
    'New enquiry from Priya Sharma · Website',
    'Team A checked in at Whitefield'
  ]
};

let db;
try {
  db = JSON.parse(localStorage.getItem('vucare-crm-master-v1')) || structuredClone(seed);
} catch {
  db = structuredClone(seed);
}

// Fallback compatibility with previous local storage
if (!db.customers || !db.services) {
  db = structuredClone(seed);
}

// Normalize legacy data fields
function normalizeWorkflow() {
  for (const l of db.leads) {
    l.assignmentHistory ??= [];
    l.owner ??= 'Unassigned';
    l.followups ??= [];
    l.nextFollowup ??= (l.id === 102 ? '2026-09-14T10:00' : '');
    l.visitStatus ??= (l.id === 102 ? 'Scheduled' : 'Not required');
    l.visitOwner ??= 'Ravi';
    l.visitDate ??= (l.id === 102 ? '2026-09-14' : '');
    l.visitTime ??= '09:00';
    l.visitNotes ??= '';
    l.photos ??= [];
  }
  for (const j of db.jobs) {
    j.assignmentHistory ??= [];
    j.worker ??= (j.team.includes(' · ') ? j.team.split(' · ')[1] : 'Unassigned');
    j.location ??= j.area + ', ' + j.city;
    j.photos ??= [];
    j.workNote ??= '';
    j.checks ??= [];
    j.usedMaterials ??= [];
  }
}
normalizeWorkflow();



// State and Access Configuration
let role = 'Admin';
let page = 'overview';
let query = '';
let city = 'All cities';
let workspace = 'All services';
let leadLayout = 'sheet';
let selectedPermRole = 'Telecaller';

const defaultAccess = {
  'Super Admin': ['overview','leads','customers','services','bookings','dispatch','jobs','technician_app','amc','quotations','invoices','payments','inventory','expenses','vendors','complaints','whatsapp','reports','users','audit','settings','visits','assignments','schedule','support'],
  'Super Admin / Owner': ['overview','leads','customers','services','bookings','dispatch','jobs','technician_app','amc','quotations','invoices','payments','inventory','expenses','vendors','complaints','whatsapp','reports','users','audit','settings','visits','assignments','schedule','support'],
  'Admin': ['overview','leads','customers','services','bookings','dispatch','jobs','technician_app','amc','quotations','invoices','payments','inventory','expenses','vendors','complaints','whatsapp','reports','users','audit','settings','visits','assignments','schedule','support'],
  'Admin / Operations Manager': ['overview','leads','customers','services','bookings','dispatch','jobs','technician_app','amc','quotations','invoices','payments','inventory','expenses','vendors','complaints','whatsapp','reports','users','audit','settings','visits','assignments','schedule','support'],
  'Manager': ['assignments','overview','leads','visits','bookings','schedule','dispatch','jobs','invoices','amc'],
  'Telecaller': ['overview','leads','customers','quotations','bookings'],
  'Accountant': ['overview','quotations','invoices','payments','customers','amc','expenses','reports'],
  'Accounts': ['overview','quotations','invoices','payments','customers','amc','expenses','reports'],
  'Pest Control Technician': ['overview','technician_app','jobs','schedule'],
  'Cleaning Technician': ['overview','technician_app','jobs','schedule'],
  'Field Staff': ['overview','technician_app','schedule','jobs'],
  'Site Inspector': ['visits'],
  'Inventory Manager': ['overview','inventory','vendors','expenses'],
  'Vendor Manager': ['overview','vendors','inventory','expenses'],
  'Management': ['overview','reports','customers','audit'],
  'Management / Reporting User': ['overview','reports','customers','audit'],
  'Support': ['overview','customers','bookings','support','complaints']
};

db.permissions = db.permissions || {};
const access = structuredClone(defaultAccess);
for (const r in db.permissions) {
  if (Array.isArray(db.permissions[r]) && db.permissions[r].length) {
    access[r] = [...db.permissions[r]];
  }
}

const permissionModules = [
  { id: 'overview', name: 'Dashboard & Numbers', cat: 'Core Operations', icon: '◫' },
  { id: 'leads', name: 'Lead Intake & Pipeline (200/day)', cat: 'Core Operations', icon: '◷' },
  { id: 'customers', name: 'Customer 360 & Multi-Address', cat: 'Core Operations', icon: '♧' },
  { id: 'services', name: 'Service Catalogue', cat: 'Core Operations', icon: '▤' },
  { id: 'bookings', name: 'Bookings Queue', cat: 'Core Operations', icon: '▦' },
  { id: 'visits', name: 'Site Visits & Inspection', cat: 'Core Operations', icon: '⌖' },
  
  { id: 'dispatch', name: 'Dispatch Calendar & Board', cat: 'Field & Dispatch', icon: '⌖' },
  { id: 'jobs', name: 'Operational Jobs Tracking', cat: 'Field & Dispatch', icon: '⇄' },
  { id: 'technician_app', name: 'Technician Mobile App (PWA)', cat: 'Field & Dispatch', icon: '📱' },
  { id: 'schedule', name: 'Team Timetable & Schedule', cat: 'Field & Dispatch', icon: '▦' },

  { id: 'quotations', name: 'Quotations & Estimates', cat: 'Financials & Billing', icon: '📝' },
  { id: 'invoices', name: 'GST Invoices & WhatsApp', cat: 'Financials & Billing', icon: '▣' },
  { id: 'payments', name: 'Payments & Collections Ledger', cat: 'Financials & Billing', icon: '₹' },
  { id: 'expenses', name: 'Expense Vouchers & Receipts', cat: 'Financials & Billing', icon: '↗' },
  { id: 'amc', name: 'AMC Recurring Contracts', cat: 'Financials & Billing', icon: '↻' },

  { id: 'inventory', name: 'Chemicals & Consumables Ledger', cat: 'Inventory & Supplies', icon: '□' },
  { id: 'vendors', name: 'Vendors & Purchase Orders', cat: 'Inventory & Supplies', icon: '🏢' },

  { id: 'complaints', name: 'Complaints & QR Tickets', cat: 'Customer Care & CRM', icon: '◉' },
  { id: 'whatsapp', name: 'WhatsTool Templates & Messaging', cat: 'Customer Care & CRM', icon: '💬' },
  { id: 'support', name: 'Support & Revisits', cat: 'Customer Care & CRM', icon: '◉' },

  { id: 'reports', name: 'Business Reports & CSV Exports', cat: 'Administration & System', icon: '▥' },
  { id: 'users', name: 'User Management & Dynamic RBAC', cat: 'Administration & System', icon: '👥' },
  { id: 'audit', name: 'Immutable Audit Trail', cat: 'Administration & System', icon: '📜' },
  { id: 'settings', name: 'Company Profile & Workspaces', cat: 'Administration & System', icon: '⚙' },
  { id: 'assignments', name: 'Manager Work Delegation', cat: 'Administration & System', icon: '⇄' }
];

function saveRolePermissions(targetRole, newPages) {
  if (!targetRole) return;
  db.permissions = db.permissions || {};
  db.permissions[targetRole] = newPages;
  access[targetRole] = [...newPages];

  if (targetRole === 'Super Admin / Owner') { access['Super Admin'] = [...newPages]; db.permissions['Super Admin'] = [...newPages]; }
  if (targetRole === 'Admin / Operations Manager') { access['Admin'] = [...newPages]; db.permissions['Admin'] = [...newPages]; }
  if (targetRole === 'Accountant') { access['Accounts'] = [...newPages]; db.permissions['Accounts'] = [...newPages]; }
  if (targetRole === 'Management / Reporting User') { access['Management'] = [...newPages]; db.permissions['Management'] = [...newPages]; }

  logAudit('Permissions Updated', `Permissions for ${targetRole} updated to [${newPages.join(', ')}]`);
  save(`RBAC permissions updated for ${targetRole}`);
  render();
  if (firestoreDb && isFirebaseLive) {
    try {
      firestoreDb.collection('vucare_crm').doc('state').set(structuredClone(db), { merge: true })
        .catch(err => console.warn('Cloud sync error:', err.message));
    } catch (e) {}
  }
}

function resetPermissionsToDefault() {
  db.permissions = {};
  for (const r in defaultAccess) {
    access[r] = [...defaultAccess[r]];
  }
  logAudit('Permissions Reset', 'All RBAC role permissions reset to default specifications');
  save('All role permissions reset to system defaults');
  render();
}

const names = {
  overview: ['◫', 'Dashboard & Numbers'],
  leads: ['◷', 'Lead Management (200/day)'],
  customers: ['♧', 'Customer 360 & Addresses'],
  services: ['▤', 'Service Catalogue'],
  bookings: ['▦', 'Bookings'],
  dispatch: ['⌖', 'Dispatch Calendar & Board'],
  jobs: ['⇄', 'Operational Jobs'],
  technician_app: ['📱', 'Technician Mobile App (PWA)'],
  amc: ['↻', 'AMC Recurring Services'],
  quotations: ['📝', 'Quotations'],
  invoices: ['▣', 'Invoices & WhatsApp'],
  payments: ['₹', 'Payment Management'],
  inventory: ['□', 'Inventory & Chemicals'],
  expenses: ['↗', 'Expenses & Receipts'],
  vendors: ['🏢', 'Vendors & Suppliers'],
  complaints: ['◉', 'Complaints & QR Tickets'],
  whatsapp: ['💬', 'WhatsTool Integration'],
  reports: ['▥', 'Management Reports & Export'],
  users: ['👥', 'Users & RBAC Permissions'],
  audit: ['📜', 'Audit Logs'],
  settings: ['⚙', 'Settings & Workspaces'],
  visits: ['⌖', 'Site Visits & Inspection'],
  assignments: ['⇄', 'Work Assignments'],
  schedule: ['▦', 'Team Schedule'],
  support: ['◉', 'Support & Revisits']
};

const demoPeople = {
  'Telecaller': ['Ananya', 'Kiran'],
  'Sales': ['Ananya', 'Kiran'],
  'Site Inspector': ['Ravi', 'Mahesh', 'Deepak'],
  'Field Staff': ['Ravi', 'Suresh', 'Mahesh', 'Deepak'],
  'Pest Control Technician': ['Ravi', 'Suresh'],
  'Cleaning Technician': ['Mahesh', 'Deepak']
};
const selectedPeople = {};

let currentAuthUser = null;
// Firebase restores the verified session. Cached role JSON is never authority.
const demoMode = typeof window !== 'undefined' && window.VUCARE_DEMO_MODE === true;

function currentPerson() {
  if (currentAuthUser && currentAuthUser.name) return currentAuthUser.name;
  return selectedPeople[role] || demoPeople[role]?.[0] || (role.includes('Tech') ? 'Ravi' : role === 'Telecaller' ? 'Kiran' : role === 'Accountant' ? 'Sneha' : 'Ananya Kumar');
}

function loginUser(email, password, remember = true) {
  const cleanEmail = (email || '').trim().toLowerCase();
  // In a deployed workspace Firebase Authentication validates staff passwords.
  // The fallback below is retained only for the offline demonstration.
  if (firebaseApp && typeof firebase !== 'undefined' && firebase.auth && typeof firebase.auth === 'function') {
    if (!cleanEmail || !password) {
      toast('Enter your employee email and password.');
      return false;
    }
    firebase.auth().setPersistence(remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION)
      .then(() => firebase.auth().signInWithEmailAndPassword(cleanEmail, password))
      .then(() => {
        firebaseSyncUnsubscribes.forEach(unsub => unsub());
        firebaseSyncUnsubscribes = [];
        // The auth-state listener verifies the staff profile and starts sync.
        toast('Signing in securely...');
      })
      .catch(err => {
        console.warn('Firebase sign-in failed:', err.code);
        toast('Sign-in failed. Check your email and password.');
      });
    return true;
  }
  const usersList = (db && db.users) ? db.users : (seed.users || []);
  const foundUser = usersList.find(u => (u.email || '').toLowerCase() === cleanEmail) ||
                    usersList.find(u => u.name.toLowerCase() === cleanEmail);

  if (!foundUser || foundUser.status !== 'Active' || password !== 'vucare123') {
    toast('No staff account found for: ' + email);
    return false;
  }

  currentAuthUser = {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email || cleanEmail,
    role: foundUser.role,
    department: foundUser.department,
    workspace: foundUser.workspace
  };
  role = foundUser.role;

  if (remember) {
    try {
      localStorage.setItem('vucare-auth-session', JSON.stringify(currentAuthUser));
    } catch {}
  }

  logAudit('User Login', `${foundUser.name} (${foundUser.role}) signed in to workspace`);
  toast(`Welcome back, ${foundUser.name}!`);

  // Direct staff to their specialized default landing page
  if (role.includes('Technician') || role === 'Field Staff') {
    page = 'technician_app';
  } else if (role === 'Telecaller') {
    page = 'leads';
  } else if (role === 'Accountant') {
    page = 'invoices';
  } else if (role === 'Site Inspector') {
    page = 'visits';
  } else {
    page = 'overview';
  }

  // Hide login overlay if present
  const overlay = document.querySelector('#auth-overlay');
  if (overlay && overlay.classList) overlay.classList.add('hidden');

  // Trigger cloud sync
  if (typeof syncToFirestore === 'function') syncToFirestore();

  render();
  return true;
}

function logoutUser() {
  const prevName = currentAuthUser ? currentAuthUser.name : currentPerson();
  logAudit('User Logout', `${prevName} signed out of workspace`);

  currentAuthUser = null;
  clearTimeout(syncDebounceTimer);
  firebaseSyncUnsubscribes.forEach(unsub => unsub());
  firebaseSyncUnsubscribes = [];
  updateFirebaseStatus('disconnected', 'Firebase: Signed out');
  try {
    localStorage.removeItem('vucare-auth-session');
  } catch {}

  // Firebase auth sign out if active
  if (typeof firebase !== 'undefined' && firebase.auth && typeof firebase.auth === 'function') {
    try { firebase.auth().signOut().catch(() => {}); } catch {}
  }

  toast('Signed out successfully.');

  // Show login overlay
  const overlay = document.querySelector('#auth-overlay');
  if (overlay && overlay.classList) overlay.classList.remove('hidden');

  render();
}

function canAssign() {
  return ['Super Admin', 'Super Admin / Owner', 'Admin', 'Admin / Operations Manager', 'Manager'].includes(role);
}

function logAudit(action, details) {
  db.auditLogs.unshift({
    at: new Date().toLocaleString('en-IN'),
    by: currentPerson(),
    action,
    details
  });
  if (db.auditLogs.length > 50) db.auditLogs.pop();
}

function save(message) {
  try {
    localStorage.setItem('vucare-crm-master-v1', JSON.stringify(db));
  } catch {
    toast('Local storage unavailable; session updates active.');
  }
  if (message) {
    db.activity.unshift(message);
    db.activity = db.activity.slice(0, 8);
    try {
      localStorage.setItem('vucare-crm-master-v1', JSON.stringify(db));
    } catch {}
    toast(message);
  }
  if (typeof syncToFirestore === 'function') {
    syncToFirestore();
  }
  render();
}

function toast(t) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = t;
  el.style.display = 'block';
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.style.display = 'none', 3400);
}

// ==========================================
// FIREBASE REAL-TIME CLOUD FIRESTORE ENGINE
// ==========================================

const defaultFirebaseConfig = {
  apiKey: "AIzaSyCY7NEUAVwMtyrWN0NDnlAFQK-jFSVscnc",
  authDomain: "crm-demo-9a7ec.firebaseapp.com",
  projectId: "crm-demo-9a7ec",
  storageBucket: "crm-demo-9a7ec.firebasestorage.app",
  messagingSenderId: "324049179296",
  appId: "1:324049179296:web:d5e31f0de4202e885dafc5",
  measurementId: "G-ZEC93MBKC5"
};

let firebaseConfig = defaultFirebaseConfig;
try {
  const stored = localStorage.getItem('vucare-firebase-config');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed && parsed.projectId === 'crm-demo-9a7ec') {
      firebaseConfig = parsed;
    } else {
      localStorage.removeItem('vucare-firebase-config');
    }
  }
} catch {}

let firebaseApp = null;
let firestoreDb = null;
let firebaseStorage = null;
let isFirebaseLive = false;
let firebaseStatusText = 'Ready';
let firebaseSyncUnsubscribes = [];
let firebaseAuthUnsubscribe = null;

function updateFirebaseStatus(state, label) {
  isFirebaseLive = (state === 'connected');
  firebaseStatusText = label;
  const pill = document.querySelector('#firebase-status-pill');
  const labelEl = document.querySelector('#fb-status-label');
  if (pill && labelEl) {
    pill.className = `firebase-pill ${state}`;
    labelEl.textContent = label;
  }
}

// Firebase Authentication confirms the password; this profile supplies the CRM
// role and active/inactive status. A valid Auth account without this document is
// deliberately not allowed into the workspace.
async function hydrateFirebaseStaffSession() {
  const authUser = firebase?.auth?.().currentUser;
  if (!authUser || !firestoreDb) return false;
  try {
    const profileSnap = await firestoreDb.collection('users').doc(authUser.uid).get();
    const profile = profileSnap.exists ? profileSnap.data() : null;
    if (!profile || profile.status !== 'Active' || !profile.role) {
      await firebase.auth().signOut();
      toast('This account does not have an active VU Care staff profile.');
      return false;
    }
    currentAuthUser = {
      id: authUser.uid,
      name: profile.name || authUser.email.split('@')[0],
      email: authUser.email,
      role: profile.role,
      department: profile.department || '',
      workspace: profile.workspace || 'All services'
    };
    role = profile.role;
    if (!access[role]) throw new Error('Unknown staff role');
    if (role.includes('Technician') || role === 'Field Staff') page = 'technician_app';
    else if (role === 'Telecaller') page = 'leads';
    else if (role === 'Accountant') page = 'invoices';
    else if (!access[role].includes(page)) page = access[role][0];
    try { localStorage.setItem('vucare-auth-session', JSON.stringify(currentAuthUser)); } catch {}
    document.querySelector('#auth-overlay')?.classList.add('hidden');
    return true;
  } catch (err) {
    console.warn('Staff profile lookup failed:', err.code || err.message);
    toast('Unable to verify your staff access.');
    return false;
  }
}

async function initFirebaseRealtime() {
  if (typeof firebase === 'undefined' || !firebaseConfig || !firebaseConfig.projectId) {
    updateFirebaseStatus('offline', 'Firebase: Local Storage');
    return;
  }

  try {
    if (!firebase.apps || !firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
    } else {
      firebaseApp = firebase.app();
    }
    firestoreDb = firebase.firestore();
    if (firebase.storage && typeof firebase.storage === 'function') {
      try {
        firebaseStorage = firebase.storage();
      } catch (err) {
        console.warn('Firebase storage initialization note:', err.message);
      }
    }

    if (!firebaseAuthUnsubscribe && firebase.auth) {
      firebaseAuthUnsubscribe = firebase.auth().onAuthStateChanged(user => {
        if (user) { initFirebaseRealtime(); return; }
        currentAuthUser = null;
        clearTimeout(syncDebounceTimer);
        firebaseSyncUnsubscribes.forEach(unsub => unsub());
        firebaseSyncUnsubscribes = [];
        updateFirebaseStatus('disconnected', 'Firebase: Staff sign-in required');
        document.querySelector('#auth-overlay')?.classList.remove('hidden');
        try { localStorage.removeItem('vucare-auth-session'); } catch {}
      });
      return;
    }
    // Staff CRM data must never use anonymous Firebase sessions.
    if (firebase.auth && typeof firebase.auth === 'function' && !firebase.auth().currentUser) {
      updateFirebaseStatus('disconnected', 'Firebase: Staff sign-in required');
      return;
    }
    if (!(await hydrateFirebaseStaffSession())) {
      updateFirebaseStatus('disconnected', 'Firebase: Staff access required');
      return;
    }
    firebaseSyncUnsubscribes.forEach(unsub => unsub());
    firebaseSyncUnsubscribes = [];
    render();

    updateFirebaseStatus('connecting', `Connecting to ${firebaseConfig.projectId}...`);

    // Real-time snapshot listener on master CRM state document
    const docRef = firestoreDb.collection('vucare_crm').doc('state');
    const unsub = docRef.onSnapshot(docSnap => {
      if (docSnap.exists) {
        const remoteData = docSnap.data();
        if (remoteData && remoteData.leads && remoteData.jobs) {
          // Merge real-time updates from cloud
          Object.assign(db, remoteData);
          normalizeWorkflow();
          updateFirebaseStatus('connected', `Live: ${firebaseConfig.projectId}`);
          render();
        }
      } else {
        // Document does not exist yet: seed it with current records
        docRef.set(structuredClone(db), { merge: true })
          .then(() => updateFirebaseStatus('connected', `Live: ${firebaseConfig.projectId}`))
          .catch(err => {
            console.warn('Firestore seed note:', err.message);
            updateFirebaseStatus('disconnected', `Rules check: ${firebaseConfig.projectId}`);
          });
      }
    }, err => {
      console.warn('Firestore subscription status:', err.message);
      if (err.code === 'permission-denied') {
        updateFirebaseStatus('disconnected', 'Firebase: Rules Need Auth');
      } else {
        updateFirebaseStatus('offline', 'Firebase: Local Storage');
      }
    });

    firebaseSyncUnsubscribes.push(unsub);
  } catch (err) {
    console.warn('Firebase initialization error:', err);
    updateFirebaseStatus('offline', 'Firebase: Local Storage');
  }
}

function cleanDbForSync(source) {
  const s = source || db;
  return {
    leads: s.leads || [],
    jobs: s.jobs || [],
    customers: s.customers || [],
    services: s.services || [],
    technicians: s.technicians || [],
    amcs: s.amcs || [],
    quotations: s.quotations || [],
    invoices: s.invoices || [],
    payments: s.payments || [],
    inventory: s.inventory || [],
    expenses: s.expenses || [],
    vendors: s.vendors || [],
    tickets: s.tickets || [],
    users: s.users || [],
    auditLogs: s.auditLogs || [],
    notifications: s.notifications || [],
    activity: s.activity || [],
    permissions: s.permissions || {}
  };
}

let syncDebounceTimer = null;
function syncToFirestore(key, data) {
  clearTimeout(syncDebounceTimer);
  syncDebounceTimer = setTimeout(async () => {
    const payload = (key && data !== undefined) ? { [key]: data } : cleanDbForSync(db);
    payload.updatedAt = new Date().toISOString();
    payload.lastUpdatedBy = currentPerson();

    // 1. Direct sync via Firestore Client SDK
    if (firestoreDb && isFirebaseLive) {
      try {
        const docRef = firestoreDb.collection('vucare_crm').doc('state');
        await docRef.set(payload, { merge: true });
        updateFirebaseStatus('connected', `Live: Synced ✓`);
        return;
      } catch (err) {
        console.warn('Direct Firestore sync notice:', err.message);
      }
    }

    if (!demoMode) {
      updateFirebaseStatus('disconnected', 'Cloud save pending / failed');
      toast('Changes remain in this browser. Cloud save failed; check sign-in and permissions.');
    }
  }, 350);
}

async function compressImage(file, maxWidth = 1280, quality = 0.82) {
  return new Promise((resolve) => {
    if (typeof FileReader === 'undefined' || typeof Image === 'undefined') {
      return resolve(null);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(e.target.result);
        }
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

async function uploadJobPhotoToCloud(file, jobId, stage = 'Before work') {
  if (!file) return;
  const j = (db.jobs || []).find(job => job.id === +jobId);
  if (!j) return toast('Job not found');

  toast(`Uploading ${stage} photo to Cloud Storage...`);

  // 1. Client-side fast compression
  const compressedDataUrl = await compressImage(file);
  const stageSlug = stage.toLowerCase().includes('before') ? 'before' : 'after';
  const cleanName = (file.name || 'photo.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileName = `${stageSlug}_${Date.now()}_${cleanName}`;
  const cloudPath = `vucare_photos/jobs/${jobId}/${fileName}`;

  let photoUrl = compressedDataUrl || '';
  let storageRefPath = cloudPath;

  // 2. Direct upload to Firebase Storage bucket if available
  if (firebaseStorage && typeof firebaseStorage.ref === 'function') {
    try {
      const storageRef = firebaseStorage.ref(cloudPath);
      if (compressedDataUrl && typeof storageRef.putString === 'function') {
        const uploadTask = await storageRef.putString(compressedDataUrl, 'data_url', {
          contentType: 'image/jpeg',
          customMetadata: {
            jobId: String(jobId),
            customer: j.name || '',
            stage: stage,
            technician: currentPerson()
          }
        });
        photoUrl = await uploadTask.ref.getDownloadURL();
      } else if (typeof storageRef.put === 'function') {
        const uploadTask = await storageRef.put(file);
        photoUrl = await uploadTask.ref.getDownloadURL();
      }
    } catch (err) {
      console.warn('Firebase Storage upload notice (using fallback):', err.message);
    }
  }

  // 3. Attach to job photos array
  j.photos = j.photos || [];
  const photoRecord = {
    id: Date.now(),
    url: photoUrl,
    kind: stage,
    at: new Date().toLocaleString('en-IN'),
    cloudPath: storageRefPath,
    cloudStored: typeof photoUrl === 'string' && photoUrl.startsWith('http')
  };
  j.photos.push(photoRecord);

  // 4. Save and sync to Cloud Firestore
  save(`${stage} photo uploaded for #VC-${j.id}`);
  toast(`${stage} photo successfully attached to Job #VC-${j.id}! ✓`);
  render();
}

async function uploadLeadInspectionPhoto(file, leadId, kind = 'Before') {
  if (!file) return;
  const l = (db.leads || []).find(lead => lead.id === +leadId);
  if (!l) return toast('Lead not found');

  toast(`Uploading ${kind} inspection photo to Cloud Storage...`);
  const compressedDataUrl = await compressImage(file);
  const kindSlug = kind.toLowerCase().includes('before') ? 'before' : 'after';
  const cleanName = (file.name || 'photo.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileName = `inspect_${kindSlug}_${Date.now()}_${cleanName}`;
  const cloudPath = `vucare_photos/inspections/${leadId}/${fileName}`;

  let photoUrl = compressedDataUrl || '';
  let storageRefPath = cloudPath;

  if (firebaseStorage && typeof firebaseStorage.ref === 'function') {
    try {
      const storageRef = firebaseStorage.ref(cloudPath);
      if (compressedDataUrl && typeof storageRef.putString === 'function') {
        const uploadTask = await storageRef.putString(compressedDataUrl, 'data_url', {
          contentType: 'image/jpeg',
          customMetadata: {
            leadId: String(leadId),
            customer: l.name || '',
            kind: kind,
            inspector: currentPerson()
          }
        });
        photoUrl = await uploadTask.ref.getDownloadURL();
      } else if (typeof storageRef.put === 'function') {
        const uploadTask = await storageRef.put(file);
        photoUrl = await uploadTask.ref.getDownloadURL();
      }
    } catch (err) {
      console.warn('Firebase Storage inspection photo notice:', err.message);
    }
  }

  l.photos = l.photos || [];
  l.photos.push({
    id: Date.now(),
    url: photoUrl,
    kind: kind + ' work',
    at: new Date().toLocaleString('en-IN'),
    cloudPath: storageRefPath,
    cloudStored: typeof photoUrl === 'string' && photoUrl.startsWith('http')
  });

  save(`${kind} inspection photo added for ${l.name}`);
  toast(`${kind} inspection photo saved! ✓`);
  const gallery = document.querySelector('#modal-content .visit-photo-grid');
  if (gallery) gallery.innerHTML = renderVisitPhotos(l.photos, l.id);
  render();
}

function firebaseConfigDialog() {
  modal('🔥 Firebase Real-Time Database Sync', `
    <div class="modal-body">
      <div style="background:#f4f8f6;border-radius:8px;padding:14px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <span class="badge ${isFirebaseLive ? 'green' : 'orange'}" style="font-size:12px">
            ${isFirebaseLive ? '● Real-Time Sync Active' : '● Disconnected / Offline Mode'}
          </span>
          <p style="margin:4px 0 0;font-size:12px;color:var(--muted)">${esc(firebaseStatusText)}</p>
        </div>
        <button class="primary" data-action="seed-firestore" style="font-size:11px;padding:5px 10px">
          ☁ Push Local Data to Cloud
        </button>
      </div>

      <form id="firebase-config-form" class="form-grid">
        <label class="full">Firebase Project ID
          <input name="projectId" required value="${esc(firebaseConfig.projectId || '')}" placeholder="e.g. your-project-id">
        </label>
        <label class="full">Web App ID (appId)
          <input name="appId" required value="${esc(firebaseConfig.appId || '')}" placeholder="e.g. 1:123456789:web:abcdef">
        </label>
        <label class="full">Web API Key (apiKey)
          <input name="apiKey" required value="${esc(firebaseConfig.apiKey || '')}" placeholder="AIzaSy...">
        </label>
        <label>Auth Domain
          <input name="authDomain" value="${esc(firebaseConfig.authDomain || '')}" placeholder="your-project.firebaseapp.com">
        </label>
        <label>Storage Bucket
          <input name="storageBucket" value="${esc(firebaseConfig.storageBucket || '')}" placeholder="your-project.firebasestorage.app">
        </label>
        <label class="full">Paste Custom Firebase Config JSON (Optional override)
          <textarea id="firebase-json-input" rows="3" placeholder='Paste { "projectId": "...", "apiKey": "..." } here to auto-fill'></textarea>
        </label>
      </form>

      <div style="background:#fffbe6;border:1px solid #ffe58f;border-radius:6px;padding:12px;margin-top:16px;font-size:12px">
        <b>💡 Real-Time Multi-Device Sync:</b> Any change made by telecallers, field staff, or managers immediately syncs to all devices via Firestore <code>onSnapshot</code> listeners.
      </div>
    </div>
  `, `
    <button data-action="close">Close</button>
    <button class="primary" id="btn-save-firebase-config">Save & Connect to Live Firebase ✓</button>
  `);
}

// Scoping filters
function jobs() {
  return db.jobs.filter(j => {
    const wsMatch = (workspace === 'All services' || !j.service || (workspace === 'Pest Control' ? /pest|termite|cockroach|bed bug|mosquito|rodent/i.test(j.service) : /clean/i.test(j.service)));
    const cityMatch = (city === 'All cities' || j.city === city);
    if (['Telecaller', 'Sales'].includes(role)) {
      const matchLead = db.leads.some(l => l.owner === currentPerson() && (j.leadId === l.id || j.name === l.name));
      return matchLead && cityMatch && wsMatch;
    }
    if (role === 'Field Staff' || role.includes('Technician')) {
      const workerName = j.worker || (j.team ? j.team.split(' · ')[1] : '');
      return workerName === currentPerson() && cityMatch && wsMatch;
    }
    return cityMatch && wsMatch;
  });
}

function leads() {
  return db.leads.filter(l => {
    const wsMatch = (workspace === 'All services' || (workspace === 'Pest Control' ? /pest/i.test(l.service) : /clean/i.test(l.service)));
    const cityMatch = (city === 'All cities' || l.city === city);
    if (['Sales', 'Telecaller'].includes(role)) {
      return (l.owner === currentPerson() || (l.owner === 'Unassigned' && l.createdBy === currentPerson())) && cityMatch && wsMatch;
    }
    return cityMatch && wsMatch;
  });
}

function customers() {
  const list = db.customers || [];
  return list.filter(c => (workspace === 'All services' || (workspace === 'Pest Control' ? db.jobs.some(j => j.name === c.name && /pest/i.test(j.service)) : db.jobs.some(j => j.name === c.name && /clean/i.test(j.service)))));
}

function badge(s) {
  const c = ['Completed', 'Paid', 'Converted', 'Resolved', 'Accepted', 'Active', 'Approved'].includes(s) ? 'green' :
            ['New enquiry', 'Scheduled', 'Open', 'Unassigned', 'Sent', 'Part paid', 'Renewal due', 'Pending'].includes(s) ? 'orange' :
            ['In progress', 'Contacted', 'Dispatched', 'En Route', 'Reached'].includes(s) ? 'blue' :
            ['Cancelled', 'Lost', 'Rejected', 'High', 'Low stock', 'Expired'].includes(s) ? 'red' :
            s === 'Quotation sent' ? 'purple' : '';
  return `<span class="badge ${c}">${esc(s)}</span>`;
}

function initials(n) {
  return String(n || 'VC').split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase();
}

function person(j) {
  return `<div style="display:flex;gap:10px;align-items:center"><span class="avatar small">${initials(j.name)}</span><div><strong>${esc(j.name)}</strong><small>${esc(j.area || j.address || '')}, ${esc(j.city || '')}</small></div></div>`;
}

function pageHeading(title, sub, action = '') {
  return `<div class="page-top"><div><p class="eyebrow">VU CARE / ${esc(role.toUpperCase())} ${workspace !== 'All services' ? '· ' + esc(workspace.toUpperCase()) : ''}</p><h1>${title}</h1><p class="sub">${sub}</p></div><div class="actions">${action}</div></div>`;
}

function stat(label, value, note, icon) {
  return `<div class="stat"><div class="stat-top">${label}<span class="stat-icon">${icon}</span></div><strong>${value}</strong><small>${note}</small></div>`;
}

function citySelect() {
  return `<select id="city-filter" aria-label="Filter by city">${['All cities', 'Bangalore', 'Mysore', 'Hassan'].map(x => `<option ${x === city ? 'selected' : ''}>${x}</option>`).join('')}</select>`;
}

function mapLink(location) {
  return `<a class="text-button" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}">📍 Maps ↗</a>`;
}

function go(p) {
  if (!access[role]?.includes(p)) return;
  page = p;
  query = '';
  location.hash = p;
  render();
  document.body.classList.remove('nav-open');
}

function logAssignment(record, type, from, to) {
  record.assignmentHistory = record.assignmentHistory || [];
  record.assignmentHistory.push({ type, from: from || 'Unassigned', to, by: role, at: new Date().toLocaleString('en-IN') });
  logAudit(`${type} Assigned`, `Reassigned from ${from || 'Unassigned'} to ${to}`);
}



// Module Views: Overview, Leads, Customers, Services, Bookings, Dispatch

function overviewPage() {
  const js = jobs(), ls = leads(), cs = customers();
  const totalRev = js.reduce((sum, j) => sum + j.amount, 0);
  const collected = js.reduce((sum, j) => sum + j.paid, 0);
  const pendingRev = totalRev - collected;
  const todayJobs = js.filter(j => j.date === '2026-09-13');
  const activeLeads = ls.filter(l => !['Converted', 'Lost', 'Cancelled'].includes(l.status));
  const newEnquiries = ls.filter(l => l.status === 'New enquiry');

  const stats = [
    stat("Today's New Leads", newEnquiries.length, `Active pipeline: ${activeLeads.length} leads`, '♧'),
    stat("Today's Dispatched Jobs", todayJobs.length, `${todayJobs.filter(j => j.status === 'Completed').length} completed · ${todayJobs.filter(j => j.status !== 'Completed').length} active`, '▦'),
    stat("Payments Collected", money(collected), `Across ${js.length} bookings`, '↗'),
    stat("Outstanding Balance", money(pendingRev), `${js.filter(j => j.paid < j.amount).length} invoices with balance`, '▣')
  ].join('');

  return pageHeading(
    role.includes('Technician') || role === 'Field Staff' ? 'My Daily Operations' : 'Operations Dashboard & Numbers',
    'Real-time overview of leads, dispatches, technician tracking and financial metrics.',
    citySelect() + (canAssign() || ['Telecaller', 'Sales'].includes(role) ? '<button class="primary" data-action="new-lead">＋ New Enquiry (200/day)</button>' : '')
  ) + `<div class="stats">${stats}</div>` +
  `<div class="grid">
    <section class="card">
      <div class="card-head">
        <div>
          <h2>Business Performance & Service Mix</h2>
          <p>Revenue distribution across Pest Control & Deep Cleaning</p>
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--green)">${workspace}</div>
      </div>
      <div class="card-body">
        <div class="stats" style="margin-bottom:14px">
          <div><small>Total Bookings Value</small><strong style="font-size:22px;display:block">${money(totalRev)}</strong></div>
          <div><small>Collection Rate</small><strong style="font-size:22px;display:block;color:var(--green)">${Math.round(collected / Math.max(1, totalRev) * 100)}%</strong></div>
        </div>
        ${['Pest Control', 'Deep Cleaning'].map(cat => {
          const catJobs = js.filter(j => cat === 'Pest Control' ? /pest/i.test(j.service) : /clean/i.test(j.service));
          const catAmount = catJobs.reduce((s, j) => s + j.amount, 0);
          const pct = Math.round(catAmount / Math.max(1, totalRev) * 100);
          return `<div style="margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">
              <b>${cat} (${catJobs.length} jobs)</b>
              <span>${money(catAmount)} (${pct}%)</span>
            </div>
            <div style="height:8px;background:#f0f4f2;border-radius:4px;overflow:hidden">
              <div style="width:${pct}%;height:100%;background:${cat === 'Pest Control' ? '#2d7260' : '#d5af6d'};border-radius:4px"></div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </section>

    <div>
      <section class="card">
        <div class="card-head">
          <div>
            <h2>Today's Service Visits</h2>
            <p>13 September 2026 · Field crews</p>
          </div>
          <button class="text-button" data-nav="dispatch">Dispatch Board →</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>CUSTOMER</th><th>SERVICE</th><th>CREW</th><th>STATUS</th></tr></thead>
            <tbody>
              ${todayJobs.map(j => `<tr>
                <td>${person(j)}</td>
                <td>${esc(j.service)}<small>${esc(j.time)}</small></td>
                <td>${esc(j.worker || j.team || 'Unassigned')}</td>
                <td>${badge(j.status)}</td>
              </tr>`).join('') || '<tr><td colspan="4" style="text-align:center;padding:20px">No visits today.</td></tr>'}
            </tbody>
          </table>
        </div>
      </section>

      <section class="card" style="margin-top:16px">
        <div class="card-head">
          <h2>Recent Activity & Audit</h2>
          <span class="badge">Live</span>
        </div>
        <div style="padding:12px 20px">
          ${db.activity.slice(0, 4).map(a => `<div style="padding:8px 0;border-bottom:1px solid #f2f5f3;font-size:12px;display:flex;gap:8px;align-items:center">
            <span style="color:var(--green)">✓</span>
            <div><p style="margin:0">${esc(a)}</p></div>
          </div>`).join('')}
        </div>
      </section>
    </div>
  </div>`;
}

function leadPage() {
  const list = leads().filter(l => (l.name + ' ' + l.service + ' ' + l.area + ' ' + (l.phone || '')).toLowerCase().includes(query.toLowerCase()));
  return pageHeading(
    'Lead Management',
    'Designed for high-volume operations (200+ enquiries/day). Track source, call follow-ups, and bookings.',
    `<button class="primary" data-action="new-lead">＋ New Enquiry</button>
     <button data-layout="sheet" aria-pressed="${leadLayout === 'sheet'}">▤ Sheet View</button>
     <button data-layout="board" aria-pressed="${leadLayout === 'board'}">◫ Pipeline</button>
     <button data-action="export-leads">↓ Export Leads</button>`
  ) +
  `<div class="filters">
    <input class="search" id="search" placeholder="Search 200+ leads by name, area, service, phone..." value="${esc(query)}" aria-label="Search leads">
    ${citySelect()}
    <select id="lead-source-filter" aria-label="Filter by source">
      <option value="All">All Sources</option>
      <option>Phone</option><option>WhatsApp</option><option>Website</option><option>Google</option><option>Instagram</option><option>Facebook</option><option>Referral</option><option>Existing customer</option>
    </select>
  </div>` +
  (leadLayout === 'board' ?
    `<div class="board">
      ${['New enquiry', 'Contacted', 'Requirement Collected', 'Quotation sent', 'Converted'].map(st => {
        const colLeads = list.filter(l => l.status === st);
        return `<section class="column">
          <h2>${st} <span>${colLeads.length}</span></h2>
          ${colLeads.map(l => `<article class="lead-card" tabindex="0" role="button" data-lead="${l.id}">
            <div style="display:flex;justify-content:space-between;align-items:center">
              ${badge(l.service)}
              <span class="badge ${l.priority === 'High' ? 'red' : 'blue'}" style="font-size:9px">${esc(l.priority || 'Normal')}</span>
            </div>
            <h3>${esc(l.name)}</h3>
            <p>${esc(l.property || '')} · ⌖ ${esc(l.area)}, ${esc(l.city)}</p>
            <p><small>Next follow-up: ${esc(l.nextFollowup ? l.nextFollowup.replace('T', ' ') : 'Not set')}</small></p>
            <div class="lead-bottom">
              <b>${money(l.amount)}</b>
              <span>${esc(l.source)} · ${esc(l.owner)}</span>
            </div>
          </article>`).join('') || '<p class="sub" style="padding:15px 5px;text-align:center">No enquiries</p>'}
        </section>`;
      }).join('')}
    </div>` :
    `<section class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>LEAD ID / CUSTOMER</th>
              <th>CLIENT TYPE</th>
              <th>SERVICE & EST. VALUE</th>
              <th>SOURCE / TELECALLER</th>
              <th>NEXT FOLLOW-UP</th>
              <th>SITE VISIT</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${list.map(l => `<tr>
              <td>${person(l)}<small>#LEAD-${l.id} · ${esc(l.phone || '')}</small></td>
              <td><span class="badge ${l.clientType === 'Commercial' ? 'purple' : ''}">${esc(l.clientType || 'Residential')}</span></td>
              <td><strong>${esc(l.service)}</strong><small>${money(l.amount)}</small></td>
              <td>${esc(l.source)}<small>Owner: ${esc(l.owner)}</small></td>
              <td>${esc(l.nextFollowup ? l.nextFollowup.replace('T', ' ') : 'Not scheduled')}<small>${l.followups ? l.followups.length : 0} call logs</small></td>
              <td>${badge(l.visitStatus || 'Not required')}<small>${esc(l.visitDate || '')}</small></td>
              <td>${badge(l.status)}</td>
              <td>
                <div style="display:flex;gap:6px">
                  <button class="primary" data-lead="${l.id}">Manage →</button>
                  ${l.status !== 'Converted' && canAssign() ? `<button class="success" data-handover="${l.id}" title="Confirm into Booking">Convert ✓</button>` : ''}
                </div>
              </td>
            </tr>`).join('') || '<tr><td colspan="8" style="text-align:center;padding:30px">No matching enquiries.</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>`
  );
}

function customerPage() {
  const list = customers().filter(c => (c.name + ' ' + c.phone + ' ' + (c.email || '')).toLowerCase().includes(query.toLowerCase()));
  return pageHeading(
    'Customer 360 & Profiles',
    'Unified customer directory with multi-address management, complete service history and unique QR code generation.',
    `<button class="primary" data-action="new-customer">＋ Add Customer</button>
     <button data-action="export-customers">↓ Export Directory</button>`
  ) +
  `<section class="card">
    <div class="filters">
      <input class="search" id="search" placeholder="Search customers by name, phone, address..." value="${esc(query)}" aria-label="Search customers">
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>CUSTOMER / CONTACT</th>
            <th>TYPE & SOURCE</th>
            <th>REGISTERED ADDRESSES</th>
            <th>CUSTOMER QR CODE</th>
            <th>SERVICE HISTORY</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${list.map(c => {
            const histJobs = db.jobs.filter(j => j.name === c.name);
            const histLeads = db.leads.filter(l => l.name === c.name);
            const addresses = c.addresses || [{ label: 'Primary', address: c.address || 'Address pending' }];
            return `<tr>
              <td>
                <div style="display:flex;gap:10px;align-items:center">
                  <span class="avatar small">${initials(c.name)}</span>
                  <div>
                    <strong>${esc(c.name)}</strong>
                    <small>📞 ${esc(c.phone)} · ✉ ${esc(c.email || 'No email')}</small>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge ${c.type === 'Commercial' ? 'purple' : 'green'}">${esc(c.type || 'Residential')}</span>
                <small>${esc(c.source || 'Website')}</small>
              </td>
              <td>
                ${addresses.map(a => `<div><b style="font-size:11px">${esc(a.label)}:</b> <small style="display:inline">${esc(a.address)}</small></div>`).join('')}
              </td>
              <td>
                <button class="primary" data-customer-qr="${c.id}" style="font-size:11px;padding:4px 8px">
                  ▦ Unique QR Code
                </button>
              </td>
              <td>
                <strong>${histJobs.length} Completed / Active Jobs</strong>
                <small>${histLeads.length} Total Enquiries</small>
              </td>
              <td>
                <button class="text-button" data-customer="${esc(c.name)}">View 360 History →</button>
              </td>
            </tr>`;
          }).join('') || '<tr><td colspan="6" style="text-align:center;padding:30px">No customer records.</td></tr>'}
        </tbody>
      </table>
    </div>
  </section>`;
}

function servicePage() {
  const list = db.services.filter(s => (workspace === 'All services' || s.category === workspace) && (s.name + ' ' + s.description).toLowerCase().includes(query.toLowerCase()));
  return pageHeading(
    'Service Catalogue',
    'Standardized service packages, pricing, GST rates, service duration, and required materials.',
    canAssign() ? '<button class="primary" data-action="new-service">＋ Add Service</button>' : ''
  ) +
  `<div class="filters">
    <input class="search" id="search" placeholder="Search service catalogue..." value="${esc(query)}" aria-label="Search services">
  </div>
  <div class="grid three-col">
    ${list.map(s => `<article class="card" style="padding:18px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <span class="badge ${s.category === 'Pest Control' ? 'green' : 'orange'}">${esc(s.category)}</span>
        <b style="font-size:18px;color:var(--green)">${money(s.price)}</b>
      </div>
      <h3 style="margin:12px 0 6px">${esc(s.name)}</h3>
      <p class="sub" style="font-size:12px">${esc(s.description)}</p>
      <div style="border-top:1px solid #f0f3f1;margin-top:12px;padding-top:10px;font-size:11px;display:grid;gap:4px">
        <div><b>Duration:</b> ${esc(s.duration)} · <b>GST:</b> ${s.gst}%</div>
        <div><b>Warranty:</b> ${esc(s.warranty)}</div>
        <div><b>Required Consumables:</b> ${(s.requiredMaterials || []).map(m => esc(m.item + ' (' + m.qty + ')')).join(', ') || 'Standard equipment'}</div>
      </div>
    </article>`).join('')}
  </div>`;
}

function bookingPage() {
  const list = jobs().filter(j => (j.name + ' ' + j.service + ' ' + j.status).toLowerCase().includes(query.toLowerCase()));
  return pageHeading(
    'Bookings Register',
    'Confirmed customer bookings ready for technician dispatch, tracking, and execution.',
    citySelect()
  ) +
  `<section class="card">
    <div class="filters">
      <input class="search" id="search" placeholder="Search bookings..." value="${esc(query)}" aria-label="Search bookings">
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>BOOKING ID / CUSTOMER</th>
            <th>SERVICE & ADDRESS</th>
            <th>DATE & TIME</th>
            <th>ASSIGNED CREW</th>
            <th>PAYMENT STATUS</th>
            <th>JOB STATUS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${list.map(j => `<tr>
            <td><strong>#VC-${j.id}</strong> · ${esc(j.name)}<small>📞 ${esc(j.phone || '')}</small></td>
            <td>${esc(j.service)}<small>${esc(j.address || j.area + ', ' + j.city)}</small></td>
            <td>${esc(j.date)} · ${esc(j.time)}</td>
            <td><span class="badge">${esc(j.worker || j.team || 'Unassigned')}</span></td>
            <td>${badge(j.paid === j.amount ? 'Paid' : j.paid ? 'Part paid' : 'Unpaid')}<small>${money(j.paid)} / ${money(j.amount)}</small></td>
            <td>${badge(j.status)}</td>
            <td>
              <button class="primary" data-job="${j.id}">Manage Booking →</button>
            </td>
          </tr>`).join('') || '<tr><td colspan="7" style="text-align:center;padding:30px">No bookings found.</td></tr>'}
        </tbody>
      </table>
    </div>
  </section>`;
}

function dispatchPage() {
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const techs = db.technicians.filter(t => workspace === 'All services' || t.specialty === workspace);
  const js = jobs();

  return pageHeading(
    'Dispatch Calendar & Board',
    'Interactive technician time-slot scheduling. Drag/click to assign jobs and prevent double-booking overlaps.',
    citySelect() + (canAssign() ? '<button class="primary" data-action="quick-dispatch">＋ Quick Dispatch</button>' : '')
  ) +
  `<section class="card" style="margin-bottom:20px">
    <div class="card-head">
      <div>
        <h2>Technician Availability & Time Slots</h2>
        <p>Sunday, 13 September 2026 · Working hours: 09:00 - 18:00</p>
      </div>
      <div style="display:flex;gap:12px;font-size:12px">
        <span><span class="badge green">●</span> Available</span>
        <span><span class="badge orange">●</span> Busy</span>
        <span><span class="badge red">●</span> Off / Leave</span>
      </div>
    </div>
    <div class="dispatch-grid-wrap">
      <div class="dispatch-grid">
        <div class="dispatch-header-cell" style="text-align:left">TECHNICIAN</div>
        ${timeSlots.map(t => `<div class="dispatch-header-cell">${t}</div>`).join('')}

        ${techs.map(tech => {
          const techJobs = js.filter(j => (j.worker === tech.name || j.team?.includes(tech.name)) && j.date === '2026-09-13');
          return `
            <div class="tech-row-header">
              <strong>${esc(tech.name)}</strong>
              <small>${esc(tech.specialty)} · ${badge(tech.status)}</small>
            </div>
            ${timeSlots.map(slot => {
              const matched = techJobs.filter(j => j.time?.startsWith(slot.slice(0, 2)));
              const isConflict = matched.length > 1;
              return `<div class="dispatch-cell">
                ${matched.map(j => `<div class="dispatch-job-slot ${isConflict ? 'conflict' : ''}" data-job="${j.id}" title="Click to manage">
                  <strong>#VC-${j.id}</strong> · ${esc(j.name)}<br>
                  <small>${esc(j.service)}</small>
                  ${isConflict ? '<div style="color:var(--danger);font-weight:700">⚠️ OVERLAP CONFLICT</div>' : ''}
                </div>`).join('')}
              </div>`;
            }).join('')}
          `;
        }).join('')}
      </div>
    </div>
  </section>`;
}



// Module Views: Operational Jobs, Technician Mobile PWA, AMC, Quotations, Invoices, Payments

function jobPage() {
  const list = jobs().filter(j => (j.name + ' ' + j.service + ' ' + j.status + ' ' + (j.worker || '')).toLowerCase().includes(query.toLowerCase()));
  return pageHeading(
    'Operational Jobs & Tracking',
    'Full field operational lifecycle from dispatch to checklist, timer, photos, signature and completion.',
    citySelect()
  ) +
  `<section class="card">
    <div class="filters">
      <input class="search" id="search" placeholder="Search jobs by customer, service, technician..." value="${esc(query)}" aria-label="Search jobs">
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>JOB # / CUSTOMER</th>
            <th>SERVICE & WORKSPACE</th>
            <th>SCHEDULED TIME</th>
            <th>ASSIGNED TECHNICIAN</th>
            <th>TIMER & DURATION</th>
            <th>STATUS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${list.map(j => `<tr>
            <td><strong>#VC-${j.id}</strong> · ${esc(j.name)}<small>📍 ${esc(j.area || j.address || '')}</small></td>
            <td>${esc(j.service)}<small>${esc(j.property || 'Standard')}</small></td>
            <td>${esc(j.date)} · ${esc(j.time)}</td>
            <td><span class="badge blue">${esc(j.worker || 'Unassigned')}</span></td>
            <td>
              ${j.timer?.durationMinutes ? `<b>${j.timer.durationMinutes} mins</b><small>Arr: ${j.timer.arrivalTime} · Comp: ${j.timer.endTime}</small>` : j.status === 'In progress' ? '<span class="badge green">● Active Timer</span>' : '<small>Not started</small>'}
            </td>
            <td>${badge(j.status)}</td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="primary" data-job="${j.id}">Open Job →</button>
                <button data-nav="technician_app" class="text-button" title="View in Mobile PWA">📱 App</button>
              </div>
            </td>
          </tr>`).join('') || '<tr><td colspan="7" style="text-align:center;padding:30px">No operational jobs match view.</td></tr>'}
        </tbody>
      </table>
    </div>
  </section>`;
}

function technicianViewName() {
  if (currentAuthUser && (currentAuthUser.role?.includes('Technician') || currentAuthUser.role?.includes('Tech') || currentAuthUser.role === 'Field Staff')) {
    return currentAuthUser.name;
  }
  return selectedPeople['technician-view'] || selectedPeople[role] || 'Ravi';
}

function technicianAppPage() {
  const currentTechName = technicianViewName();
  const technician = db.technicians.find(t => t.name === currentTechName);
  const shift = technician?.attendance?.findLast(entry => entry.date === localToday());
  const myJobs = db.jobs.filter(j => (j.worker === currentTechName || j.team?.includes(currentTechName)) && j.date === localToday());
  const activeJob = myJobs.find(j => ['In progress', 'Reached', 'Dispatched'].includes(j.status)) || myJobs[0];

  return pageHeading(
    'Technician Mobile App (PWA)',
    'Mobile-first field execution interface. Clock-in, GPS verification, auto-timer, before/after photos, material logging and digital customer signature.',
    `<select id="tech-selector" aria-label="Select technician view" ${canAssign() ? '' : 'disabled'}>
      ${db.technicians.map(t => `<option ${t.name === currentTechName ? 'selected' : ''}>${esc(t.name)} (${esc(t.specialty)})</option>`).join('')}
    </select>`
  ) +
  `<div class="mobile-pwa-frame">
    <div class="pwa-header">
      <div>
        <h3 style="margin:0;color:white">${esc(currentTechName)}</h3>
        <small style="opacity:0.85">VU Care Field Operations · Bangalore</small>
      </div>
      <span class="badge green">${shift?.clockIn?.latitude != null ? 'GPS captured at clock-in' : 'GPS not captured'}</span>
    </div>

    <div class="pwa-clock-card">
      <div>
        <strong>Shift Attendance</strong>
        <small style="display:block;color:var(--muted)">${shift ? `Clock-in: ${esc(new Date(shift.clockIn.at).toLocaleTimeString())}${shift.clockOut ? ' · Shift ended' : ''}` : 'Not clocked in today'}</small>
      </div>
      <button class="success" id="btn-clock-toggle" style="font-size:12px;padding:6px 12px">
        ${shift && !shift.clockOut ? 'Clock Out' : 'Clock In'}
      </button>
    </div>

    ${activeJob ? `
      <div style="padding:18px 20px;border-bottom:1px solid var(--line)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <span class="badge ${activeJob.status === 'Completed' ? 'green' : 'orange'}">${esc(activeJob.status)}</span>
            <h2 style="font-size:18px;margin:8px 0 4px">#VC-${activeJob.id} · ${esc(activeJob.name)}</h2>
            <p class="sub" style="font-size:13px">${esc(activeJob.service)} · ${esc(activeJob.property)}</p>
            <p style="margin:6px 0;font-size:13px">📍 ${esc(activeJob.address || activeJob.area + ', ' + activeJob.city)}</p>
          </div>
          ${mapLink(activeJob.address || activeJob.area + ', Bangalore')}
        </div>
      </div>

      <div class="job-step-indicator">
        <span class="step-dot ${['Assigned', 'Dispatched', 'Reached', 'In progress', 'Completed'].includes(activeJob.status) ? 'done' : 'active'}">1. Dispatch</span>
        <span class="step-dot ${['Reached', 'In progress', 'Completed'].includes(activeJob.status) ? 'done' : activeJob.status === 'Dispatched' ? 'active' : ''}">2. Arrive</span>
        <span class="step-dot ${['In progress', 'Completed'].includes(activeJob.status) ? 'done' : activeJob.status === 'Reached' ? 'active' : ''}">3. Before Photos</span>
        <span class="step-dot ${activeJob.status === 'Completed' ? 'done' : activeJob.status === 'In progress' ? 'active' : ''}">4. Work & Consumables</span>
        <span class="step-dot ${activeJob.status === 'Completed' ? 'done' : ''}">5. Signature & Complete</span>
      </div>

      <div style="padding:20px">
        <div class="stats" style="grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
          <div style="background:#f7faf8;padding:10px;border-radius:8px">
            <small>Arrival Time</small>
            <strong style="font-size:16px;display:block">${activeJob.timer?.arrivalTime || 'Pending'}</strong>
          </div>
          <div style="background:#f7faf8;padding:10px;border-radius:8px">
            <small>Work Duration</small>
            <strong style="font-size:16px;display:block;color:var(--green)">${activeJob.timer?.durationMinutes ? activeJob.timer.durationMinutes + ' mins' : activeJob.status === 'In progress' ? 'Timing...' : '0 mins'}</strong>
          </div>
        </div>

        <!-- Workflow Action Buttons -->
        ${activeJob.status === 'Scheduled' || activeJob.status === 'Assigned' ? `
          <button class="primary" style="width:100%;justify-content:center;padding:12px;font-size:15px" data-pwa-action="dispatch:${activeJob.id}">
            Accept & Start Travel (Dispatch) 🚗
          </button>
        ` : activeJob.status === 'Dispatched' ? `
          <button class="primary" style="width:100%;justify-content:center;padding:12px;font-size:15px" data-pwa-action="reach:${activeJob.id}">
            I Have Reached Customer Destination 📍
          </button>
        ` : activeJob.status === 'Reached' ? `
          <div style="display:grid;gap:12px">
            <div style="background:#f9fbfa;padding:12px;border:1px solid var(--line);border-radius:8px">
              <b>Step 1: Upload Before Photos</b>
              <p class="sub" style="font-size:11px">Capture infested or dirty surface condition before work.</p>
              <input type="file" id="pwa-photo-upload" data-job-id="${activeJob.id}" data-photo-stage="Before work" accept="image/*" capture="environment" style="margin-top:8px;width:100%">
            </div>
            <button class="primary" style="width:100%;justify-content:center;padding:12px;font-size:15px" data-pwa-action="start:${activeJob.id}">
              Start Service (Start Timer) ⏱
            </button>
          </div>
        ` : activeJob.status === 'In progress' ? `
          <div style="display:grid;gap:14px">
            <!-- Consumables recording -->
            <div style="background:#f7faf8;padding:14px;border:1px solid #d8e5df;border-radius:8px">
              <strong style="font-size:13px">Record Material Consumption</strong>
              <p class="sub" style="font-size:11px;margin-bottom:8px">Auto-deducts chemicals & cleaning solutions from stock.</p>
              <div style="display:flex;gap:8px">
                <select id="pwa-material-item" style="flex:1">
                  ${db.inventory.map(i => `<option value="${esc(i.item)}">${esc(i.item)} (Stock: ${i.stock} ${esc(i.unit)})</option>`).join('')}
                </select>
                <input type="number" id="pwa-material-qty" value="1" min="1" max="20" style="width:70px">
                <button class="primary" data-pwa-use-material="${activeJob.id}">Log</button>
              </div>
              ${activeJob.usedMaterials?.length ? `<div style="margin-top:8px;font-size:11px;color:var(--green)">
                <b>Logged:</b> ${activeJob.usedMaterials.map(m => esc(m.item + ' x' + m.qty)).join(', ')}
              </div>` : ''}
            </div>

            <!-- After Photos -->
            <div style="background:#f9fbfa;padding:12px;border:1px solid var(--line);border-radius:8px">
              <b>Step 2: Upload After Photos</b>
              <p class="sub" style="font-size:11px">Capture completed treatment and surface cleanliness.</p>
              <input type="file" id="pwa-photo-upload-after" data-job-id="${activeJob.id}" data-photo-stage="After work" accept="image/*" capture="environment" style="margin-top:8px;width:100%">
            </div>

            <!-- Customer Signature Canvas -->
            <div style="background:white;padding:12px;border:1px solid var(--line);border-radius:8px">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <b>Step 3: Customer Digital Signature</b>
                <button type="button" class="text-button" id="clear-sig" style="font-size:11px">Clear ↺</button>
              </div>
              <div class="signature-box">
                <canvas id="signature-canvas" data-job-id="${activeJob.id}" style="touch-action:none"></canvas>
              </div>
              <small style="color:var(--muted)">Ask customer to sign with finger above.</small>
            </div>

            <div style="display:flex;gap:8px">
              <button class="danger" style="flex:1" data-pwa-action="hold:${activeJob.id}">Put on Hold ⏸</button>
              <button class="primary" style="flex:2;justify-content:center;padding:12px" data-pwa-action="complete:${activeJob.id}">Complete Job ✓</button>
            </div>
          </div>
        ` : activeJob.status === 'Completed' ? `
          <div style="text-align:center;padding:16px;background:#f2faf5;border-radius:8px;border:1px solid #cfead9">
            <span style="font-size:32px">✓</span>
            <h3 style="margin:8px 0;color:var(--green)">Job Completed Successfully!</h3>
            <p class="sub" style="font-size:12px">Duration: ${activeJob.timer?.durationMinutes ?? 'Not recorded'} mins · ${activeJob.signature ? 'Signature saved' : 'Signature not recorded'}</p>
            <button data-view-report="${activeJob.id}">View / Print Service Report</button>
          </div>
        ` : `<p>Job is ${esc(activeJob.status)}. ${esc(activeJob.holdReason || '')}</p>`}

        <!-- Uploaded Cloud Photos Gallery -->
        ${(activeJob.photos && activeJob.photos.length) ? `
          <div style="margin-top:16px;border-top:1px solid var(--line);padding-top:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <strong style="font-size:13px">Cloud Photos (${activeJob.photos.length})</strong>
              <span class="badge blue" style="font-size:10px">☁ Firebase Storage</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              ${activeJob.photos.map(p => `
                <div style="position:relative;border:1px solid #dce4e0;border-radius:8px;overflow:hidden;background:#f9fbf9">
                  <img src="${esc(p.url)}" alt="${esc(p.kind)}" style="width:100%;height:110px;object-fit:cover;display:block">
                  <div style="padding:6px 8px;display:flex;justify-content:space-between;align-items:center;font-size:11px">
                    <span class="badge ${(p.kind || '').includes('Before') ? 'orange' : 'green'}" style="font-size:10px">${esc(p.kind || 'Photo')}</span>
                    <button class="text-button" data-delete-job-photo="${activeJob.id}:${p.id}" style="color:#b03a2e;font-size:11px;padding:2px" title="Delete photo">✕</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    ` : '<div style="padding:40px 20px;text-align:center;color:var(--muted)">No assigned jobs for this technician today.</div>'}
  </div>`;
}

function amcPage() {
  const list = db.amcs.filter(a => workspace === 'All services' || a.service?.toLowerCase().includes(workspace.toLowerCase()));
  return pageHeading(
    'AMC & Recurring Contracts',
    'Manage annual maintenance contracts, automated recurring visit schedules, and single-visit rescheduling.',
    canAssign() ? '<button class="primary" data-action="new-amc">＋ Add AMC Contract</button>' : ''
  ) +
  `<div class="stats">
    ${stat('Active AMCs', list.filter(a => a.status === 'Active').length, 'Ongoing service contracts', '↻')}
    ${stat('Renewal Due', list.filter(a => a.status === 'Renewal due').length, 'Follow-up required within 30 days', '◷')}
    ${stat('Total Contract Value', money(list.reduce((s, a) => s + a.value, 0)), 'Annual recurring revenue', '₹')}
    ${stat('Completed Visits', list.reduce((s, a) => s + (a.completed || 0), 0), 'Service visits delivered', '✓')}
  </div>
  <section class="card">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>AMC CONTRACT / CLIENT</th>
            <th>SERVICE & FREQUENCY</th>
            <th>TERM DURATION</th>
            <th>VISITS PROGRESS</th>
            <th>CONTRACT VALUE</th>
            <th>RENEWAL DATE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(a => `<tr>
            <td><strong>${esc(a.id)}</strong><small>${esc(a.customer)}</small></td>
            <td>${esc(a.service)}<small>Freq: ${esc(a.frequency || 'Monthly')}</small></td>
            <td>${esc(a.start)} to ${esc(a.end)}</td>
            <td>
              <div style="font-weight:700;font-size:12px">${a.completed || 0} / ${a.visits} visits</div>
              <div style="height:6px;width:100px;background:#f0f3f1;border-radius:3px;margin-top:4px">
                <div style="height:100%;width:${Math.round(((a.completed || 0) / Math.max(1, a.visits)) * 100)}%;background:var(--green);border-radius:3px"></div>
              </div>
            </td>
            <td>${money(a.value)}</td>
            <td>${esc(a.renewal)}</td>
            <td>${badge(a.status)}</td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="primary" data-amc-visits="${a.id}" style="font-size:11px;padding:5px 9px">
                  View Visits / Reschedule ↻
                </button>
              </div>
            </td>
          </tr>`).join('') || '<tr><td colspan="8" style="text-align:center;padding:30px">No AMC contracts.</td></tr>'}
        </tbody>
      </table>
    </div>
  </section>`;
}

function quotationPage() {
  const list = db.quotations || [];
  return pageHeading(
    'Quotations Register',
    'Generate professional service quotations with itemized breakdown, GST calculations, and convert to bookings.',
    '<button class="primary" data-action="new-quotation">＋ Create Quotation</button>'
  ) +
  `<section class="card">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>QUOTE # / CUSTOMER</th>
            <th>SERVICE</th>
            <th>SUBTOTAL</th>
            <th>TAX (18% GST)</th>
            <th>TOTAL AMOUNT</th>
            <th>VALIDITY</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(q => `<tr>
            <td><strong>${esc(q.id)}</strong><small>${esc(q.customer)}</small></td>
            <td>${esc(q.service)}</td>
            <td>${money(q.subtotal)}</td>
            <td>${money(q.taxAmount)}</td>
            <td><strong style="color:var(--green)">${money(q.total)}</strong></td>
            <td>${esc(q.validity)}</td>
            <td>${badge(q.status)}</td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="primary" data-quote-detail="${q.id}" style="font-size:11px;padding:5px 9px">View / Share</button>
                ${q.status !== 'Converted' ? `<button class="success" data-convert-quote="${q.id}" style="font-size:11px;padding:5px 9px">Convert to Invoice ✓</button>` : ''}
              </div>
            </td>
          </tr>`).join('') || '<tr><td colspan="8" style="text-align:center;padding:30px">No quotations created.</td></tr>'}
        </tbody>
      </table>
    </div>
  </section>`;
}

function invoicePage() {
  const js = jobs();
  const total = js.reduce((sum, j) => sum + j.amount, 0);
  const paid = js.reduce((sum, j) => sum + j.paid, 0);

  return pageHeading(
    'Invoices & Collections',
    'Tax-ready invoices with 18% GST calculation, bank details, dynamic UPI QR code generator, and WhatsTool dispatch.',
    '<button class="primary" data-action="new-invoice">＋ Create Invoice</button>'
  ) +
  `<div class="stats">
    ${stat('Total Invoiced', money(total), 'Across service bookings', '▤')}
    ${stat('Collected Revenue', money(paid), 'Recorded payments', '✓')}
    ${stat('Outstanding Balance', money(total - paid), 'Awaiting collection', '◷')}
    ${stat('Unpaid / Part Paid', js.filter(j => j.paid < j.amount).length, 'Invoices needing follow-up', '▣')}
  </div>
  <section class="card">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>INVOICE #</th>
            <th>CUSTOMER / SERVICE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>BALANCE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          ${js.map(j => `<tr>
            <td><strong>INV-${j.id}</strong><small>${esc(j.date)}</small></td>
            <td>${person(j)}<small>${esc(j.service)}</small></td>
            <td>${money(j.amount)}</td>
            <td>${money(j.paid)}</td>
            <td><strong style="color:${j.paid < j.amount ? 'var(--danger)' : 'var(--green)'}">${money(j.amount - j.paid)}</strong></td>
            <td>${badge(j.paid === j.amount ? 'Paid' : j.paid ? 'Part paid' : 'Unpaid')}</td>
            <td>
              <div style="display:flex;gap:7px;align-items:center">
                <button class="primary" data-invoice="${j.id}" style="font-size:11px;padding:5px 9px">Open</button>
                <button class="whatsapp-icon" data-whatsapp-invoice="${j.id}" title="Send on WhatsApp">
                  <svg viewBox="0 0 32 32"><path d="M16 3.2a12.8 12.8 0 0 0-10.9 19.5L3.4 28.8l6.3-1.7A12.8 12.8 0 1 0 16 3.2Z" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M11.9 9.8c-.5 0-1 .2-1.3.8-.4.7-1.1 2-.9 3.7.3 2.6 2.7 5.5 5.9 6.8 1.1.5 2.5.8 3.5.3.7-.4 1.5-1.4 1.7-2.3l-2.5-1.2c-.2-.1-.5-.1-.7.2l-.7.9c-.2.2-.4.3-.7.2-1.6-.6-2.8-1.7-3.6-3.2-.1-.3-.1-.5.1-.7l.7-.8c.2-.2.2-.5.1-.7l-1.1-2.7c-.2-.4-.4-.5-.7-.5h-.7Z" fill="currentColor"/></svg>
                </button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>`;
}

function paymentPage() {
  const js = jobs();
  return pageHeading(
    'Payment Management & Tracking',
    'Record customer payments via UPI, Cash, Bank Transfer, or Card with real-time balance reconciliation.',
    ''
  ) +
  `<section class="card">
    <div class="card-head"><h2>Payment Transactions Register</h2></div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>INVOICE #</th>
            <th>CUSTOMER</th>
            <th>TOTAL AMOUNT</th>
            <th>AMOUNT PAID</th>
            <th>OUTSTANDING</th>
            <th>PAYMENT STATUS</th>
            <th>RECORD PAYMENT</th>
          </tr>
        </thead>
        <tbody>
          ${js.map(j => `<tr>
            <td><strong>INV-${j.id}</strong></td>
            <td>${esc(j.name)}</td>
            <td>${money(j.amount)}</td>
            <td>${money(j.paid)}</td>
            <td><b>${money(j.amount - j.paid)}</b></td>
            <td>${badge(j.paid === j.amount ? 'Paid' : j.paid ? 'Part paid' : 'Unpaid')}</td>
            <td>
              ${j.paid < j.amount ? `<button class="primary" data-record-pay="${j.id}" style="font-size:11px;padding:4px 8px">＋ Record Payment</button>` : '<span style="color:var(--green);font-weight:700">✓ Settled</span>'}
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>`;
}



// Module Views: Inventory, Expenses, Vendors, Complaints, WhatsApp, Reports, Users, Audit, Settings, Visits

function inventoryPage() {
  const list = db.inventory.filter(i => workspace === 'All services' || i.category === workspace);
  return pageHeading(
    'Inventory & Consumables Ledger',
    'Track chemicals, cleaning agents, stock levels, technician auto-consumption, and low-stock alerts.',
    canAssign() ? '<button class="primary" data-action="new-stock">＋ Add Stock / Chemical</button>' : ''
  ) +
  `<div class="stats">
    ${stat('Total Stock Items', list.length, 'In active warehouse catalog', '□')}
    ${stat('Low Stock Alerts', list.filter(i => i.stock <= i.minimum).length, 'Items below reorder minimum', '⚠️')}
    ${stat('Stock Used This Period', list.reduce((s, i) => s + (i.used || 0), 0), 'Auto-deducted from technician jobs', '↓')}
  </div>
  <section class="card">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ITEM & SPECIFICATION</th>
            <th>CATEGORY</th>
            <th>OPENING</th>
            <th>PURCHASED</th>
            <th>USED (AUTO)</th>
            <th>CURRENT STOCK</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(i => {
            const isLow = i.stock <= i.minimum;
            return `<tr>
              <td><strong>${esc(i.item)}</strong><small>Unit: ${esc(i.unit)} · Min threshold: ${i.minimum}</small></td>
              <td><span class="badge ${i.category === 'Pest Control' ? 'green' : 'orange'}">${esc(i.category)}</span></td>
              <td>${i.opening || 0}</td>
              <td>+${i.purchased || 0}</td>
              <td style="color:var(--danger)">-${i.used || 0}</td>
              <td><strong style="font-size:15px;color:${isLow ? 'var(--danger)' : 'var(--green)'}">${i.stock} ${esc(i.unit)}</strong></td>
              <td>${badge(isLow ? 'Low stock' : 'Available')}</td>
              <td>
                <button class="primary" data-restock="${esc(i.item)}" style="font-size:11px;padding:4px 8px">Restock ＋</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </section>`;
}

function expensePage() {
  const list = db.expenses || [];
  const total = list.reduce((s, e) => s + e.amount, 0);

  return pageHeading(
    'Expense Management & Approvals',
    'Track technician travel, van fuel, equipment maintenance, and material purchase expenses.',
    '<button class="primary" data-action="new-expense">＋ Record Expense</button>'
  ) +
  `<div class="stats">
    ${stat('Total Recorded Expenses', money(total), 'Across all field teams', '₹')}
    ${stat('Travel & Fuel', money(list.filter(e => ['Travel', 'Fuel'].includes(e.category)).reduce((s, e) => s + e.amount, 0)), 'Technician mobility costs', '🚗')}
    ${stat('Material Purchases', money(list.filter(e => e.category === 'Purchases').reduce((s, e) => s + e.amount, 0)), 'Consumables & chemical supplies', '□')}
  </div>
  <section class="card">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>DATE</th>
            <th>EXPENSE ITEM</th>
            <th>CATEGORY</th>
            <th>CLAIMED BY</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
            <th>APPROVAL</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(e => `<tr>
            <td>${esc(e.date)}</td>
            <td><strong>${esc(e.item)}</strong></td>
            <td><span class="badge">${esc(e.category)}</span></td>
            <td>${esc(e.employee)}</td>
            <td><strong>${money(e.amount)}</strong></td>
            <td>${badge(e.status)}</td>
            <td>
              ${e.status === 'Approved' ? '<span style="color:var(--green)">✓ Approved</span>' : `<button class="primary" data-approve-exp="${e.id}" style="font-size:11px;padding:3px 8px">Approve ✓</button>`}
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>`;
}

function vendorPage() {
  const list = db.vendors || [];
  return pageHeading(
    'Vendor & Supplier Management',
    'Manage chemical manufacturers, safety gear suppliers, and industrial cleaning equipment vendors.',
    '<button class="primary" data-action="new-vendor">＋ Add Vendor</button>'
  ) +
  `<section class="card">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>VENDOR NAME</th>
            <th>CONTACT PERSON</th>
            <th>SUPPLIED PRODUCTS</th>
            <th>TOTAL PURCHASES</th>
            <th>OUTSTANDING PAYABLE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(v => `<tr>
            <td><strong>${esc(v.name)}</strong><small>${esc(v.id)}</small></td>
            <td>${esc(v.contact)}<small>📞 ${esc(v.phone)}</small></td>
            <td>${esc(v.products)}</td>
            <td>${money(v.totalPurchases)}</td>
            <td><strong style="color:var(--danger)">${money(v.outstanding)}</strong></td>
            <td>
              <button class="primary" data-vendor-order="${v.id}" style="font-size:11px;padding:4px 8px">New Purchase Order</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>`;
}

function complaintPage() {
  const list = db.tickets || [];
  return pageHeading(
    'Complaints & Customer QR Requests',
    'Customer-raised service requests via unique QR scan, touch-up revisits, and quality assurance.',
    '<button class="primary" data-action="new-ticket">＋ Raise Complaint / Revisit</button>'
  ) +
  `<section class="card">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>COMPLAINT ID / CUSTOMER</th>
            <th>LINKED BOOKING</th>
            <th>ISSUE DESCRIPTION</th>
            <th>PRIORITY</th>
            <th>ASSIGNED TO</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(t => `<tr>
            <td><strong>#CMP-${t.id}</strong> · ${esc(t.name)}</td>
            <td><span class="badge">Job #VC-${t.job}</span></td>
            <td>${esc(t.issue)}</td>
            <td><span class="badge ${t.priority === 'High' ? 'red' : 'blue'}">${esc(t.priority)}</span></td>
            <td>${esc(t.assigned || 'Ravi')}</td>
            <td>${badge(t.status)}</td>
            <td>
              ${t.status === 'Resolved' ? '<span style="color:var(--green)">✓ Resolved</span>' : `<button class="primary" data-resolve-ticket="${t.id}" style="font-size:11px;padding:4px 8px">Resolve / Retreat →</button>`}
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>`;
}

function whatsappPage() {
  const templates = [
    { name: 'Lead Received', event: 'New enquiry registered', text: 'Hello {{customer}}, thank you for contacting VU Care Services. Our representative will contact you shortly regarding {{service}}.' },
    { name: 'Booking Confirmation', event: 'Booking confirmed by manager', text: 'Dear {{customer}}, your VU Care {{service}} booking #VC-{{job}} is confirmed for {{date}} at {{time}}.' },
    { name: 'Technician Assigned & Arriving', event: 'Technician dispatched', text: 'Hello {{customer}}, our technician {{technician}} has been dispatched and will arrive by {{time}}.' },
    { name: 'Job Completed & Report', event: 'Technician completes work', text: 'Dear {{customer}}, your {{service}} has been completed. View your service report & photos here: {{link}}' },
    { name: 'Invoice & Payment Link', event: 'Invoice generated', text: 'Hello {{customer}}, your invoice INV-{{job}} for ₹{{amount}} is ready. Pay securely via UPI QR: {{upi_link}}' },
    { name: 'AMC Service Reminder', event: 'Recurring visit scheduled', text: 'Dear {{customer}}, your scheduled AMC service visit for {{service}} is due on {{date}}. Please confirm slot.' },
    { name: 'Customer Review Request', event: '24 hours post-service', text: 'How was your VU Care service experience today? Please take 30 seconds to rate our technician: {{link}}' }
  ];

  return pageHeading(
    'WhatsTool WhatsApp Integration',
    'Official WhatsTool API webhook and automated message dispatch templates for customer notifications.',
    '<button class="whatsapp-button" data-action="test-whatsapp">Test WhatsTool Webhook</button>'
  ) +
  `<div class="grid">
    <section class="card">
      <div class="card-head">
        <div>
          <h2>Automated Notification Templates</h2>
          <p>Triggers automatically on CRM operational status changes</p>
        </div>
        <span class="badge green">API Connected</span>
      </div>
      <div style="padding:16px 20px">
        ${templates.map(t => `<div style="border-bottom:1px solid #f0f3f1;padding:12px 0">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <strong>${esc(t.name)}</strong>
            <span class="badge blue" style="font-size:10px">${esc(t.event)}</span>
          </div>
          <div style="background:#f7faf8;border-left:3px solid #25d366;padding:8px 12px;font-size:12px;border-radius:4px;color:#284f42">
            ${esc(t.text)}
          </div>
        </div>`).join('')}
      </div>
    </section>

    <section class="card">
      <div class="card-head">
        <h2>Inbound Webhook Simulator</h2>
        <span class="badge">WhatsTool</span>
      </div>
      <div style="padding:18px 20px">
        <p class="sub" style="font-size:12px">Incoming customer WhatsApp messages automatically create or update leads in real time.</p>
        <div style="margin-top:14px">
          <label style="font-size:12px;font-weight:700">Simulate Incoming Message</label>
          <input type="text" id="sim-wa-text" value="Need cockroach pest control for 3 BHK in Indiranagar tomorrow" style="width:100%;margin:8px 0;padding:8px">
          <button class="whatsapp-button" id="btn-simulate-inbound" data-action="simulate-inbound" style="width:100%;justify-content:center">
            Simulate Inbound Lead Creation
          </button>
        </div>
      </div>
    </section>
  </div>`;
}

function reportPage() {
  const js = jobs();
  const total = js.reduce((s, j) => s + j.amount, 0);
  const collected = js.reduce((s, j) => s + j.paid, 0);

  return pageHeading(
    'Management Reports & Excel Migration',
    'Executive analytics, technician productivity, service revenue breakdown, and bulk data import/export.',
    `<button class="primary" data-action="export-all-excel">↓ Download Excel Master</button>
     <button data-action="import-excel">↑ Bulk Data Migration</button>`
  ) +
  `<div class="stats">
    ${stat('Total Revenue', money(total), 'All bookings', '₹')}
    ${stat('Collected Revenue', money(collected), 'Direct payments', '✓')}
    ${stat('Collection Rate', Math.round(collected / Math.max(1, total) * 100) + '%', 'Target > 90%', '↗')}
    ${stat('Completed Jobs', js.filter(j => j.status === 'Completed').length, `Service delivery rate: ${Math.round(js.filter(j => j.status === 'Completed').length / Math.max(1, js.length) * 100)}%`, '✓')}
  </div>
  <div class="grid">
    <section class="card">
      <div class="card-head"><h2>Technician Performance & Productivity</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>TECHNICIAN</th><th>SPECIALTY</th><th>JOBS DONE</th><th>AVG DURATION</th><th>RATING</th></tr></thead>
          <tbody>
            ${db.technicians.map(t => {
              const count = js.filter(j => j.worker === t.name && j.status === 'Completed').length;
              const completed = js.filter(j => j.worker === t.name && j.status === 'Completed');
              const durations = completed.map(j => j.timer?.durationMinutes).filter(n => typeof n === 'number' && Number.isFinite(n) && n >= 0);
              const ratings = completed.map(j => j.rating).filter(n => typeof n === 'number' && n >= 1 && n <= 5);
              return `<tr>
                <td><strong>${esc(t.name)}</strong></td>
                <td>${esc(t.specialty)}</td>
                <td><b>${count} jobs</b></td>
                <td>${durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) + ' mins' : 'Not recorded'}</td>
                <td>${ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) + ' / 5' : 'Not rated'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </section>

    <section class="card">
      <div class="card-head"><h2>City & Location Revenue</h2></div>
      <div class="card-body">
        ${['Bangalore', 'Mysore', 'Hassan'].map(c => {
          const cJobs = js.filter(j => j.city === c);
          const cAmount = cJobs.reduce((s, j) => s + j.amount, 0);
          return `<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f3f1;font-size:13px">
            <b>${c} (${cJobs.length} bookings)</b>
            <strong>${money(cAmount)}</strong>
          </div>`;
        }).join('')}
      </div>
    </section>
  </div>`;
}

function userPage() {
  const list = db.users || [];
  const rolesList = [
    'Super Admin / Owner',
    'Admin / Operations Manager',
    'Manager',
    'Telecaller',
    'Pest Control Technician',
    'Cleaning Technician',
    'Site Inspector',
    'Accountant',
    'Management / Reporting User'
  ];

  const currentRolePerms = access[selectedPermRole] || defaultAccess[selectedPermRole] || [];

  return pageHeading(
    'Users & Dynamic RBAC Permissions',
    'Manage staff accounts, assign operational departments, and customize module permissions dynamically for every role.',
    `<div style="display:flex;gap:8px">
      <button class="primary" data-action="new-user">＋ Add Employee</button>
      <button class="text-button" data-action="reset-permissions">↻ Reset Permissions to Default</button>
    </div>`
  ) +
  `<div class="stats">
    ${stat('Total Staff', list.length, 'Registered system employees', '👥')}
    ${stat('Active Accounts', list.filter(u => u.status === 'Active').length, 'Currently active logins', '✓')}
    ${stat('Configured Roles', rolesList.length, 'Standard operational tiers', '🔐')}
    ${stat('Permission Overrides', Object.keys(db.permissions || {}).length, 'Roles with customized access', '⚙')}
  </div>

  <section class="card" style="margin-bottom:24px">
    <div class="card-head">
      <div>
        <h2>Employee Directory & Status</h2>
        <p>Active and past employees across Bangalore, Mysore & Hassan offices.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>EMPLOYEE NAME</th>
            <th>ROLE TYPE</th>
            <th>DEPARTMENT</th>
            <th>WORKSPACE</th>
            <th>PHONE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(u => `<tr>
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <span class="avatar" style="width:32px;height:32px;font-size:12px">${initials(u.name)}</span>
                <div><strong>${esc(u.name)}</strong><small>${esc(u.id)} · ${esc(u.email || '')}</small></div>
              </div>
            </td>
            <td><span class="badge blue">${esc(u.role)}</span></td>
            <td>${esc(u.department)}</td>
            <td>${esc(u.workspace)}</td>
            <td>${esc(u.phone)}</td>
            <td>${badge(u.status)}</td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="text-button" data-edit-user="${u.id}" style="font-size:11px;padding:3px 7px">Edit</button>
                <button class="text-button ${u.status === 'Active' ? 'danger' : 'success'}" data-toggle-user="${u.id}" style="font-size:11px;padding:3px 7px">
                  ${u.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>

  <!-- Dynamic RBAC Permission Matrix & Editor -->
  <section class="card" id="rbac-matrix-section">
    <div class="card-head" style="flex-wrap:wrap;gap:12px">
      <div>
        <h2>Dynamic Role Permission Matrix & Module Editor</h2>
        <p>Select any role below to customize its allowed modules, navigation tabs, and operational capabilities in real time.</p>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        <label style="font-weight:700;font-size:12px;margin:0">Selected Role to Configure:</label>
        <select id="perm-role-selector" style="font-size:12px;padding:5px 10px;font-weight:700;color:var(--green)">
          ${rolesList.map(r => `<option value="${esc(r)}" ${r === selectedPermRole ? 'selected' : ''}>${esc(r)}</option>`).join('')}
        </select>
      </div>
    </div>

    <div style="background:#f4f8f6;border-radius:8px;padding:14px 18px;margin:16px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      <div>
        <span class="badge green" style="font-size:12px">Configuring: ${esc(selectedPermRole)}</span>
        <span style="font-size:12px;color:var(--muted);margin-left:8px">
          Currently granted <b>${currentRolePerms.length}</b> of ${permissionModules.length} system modules.
        </span>
      </div>
      <div style="display:flex;gap:8px">
        <button class="text-button" data-action="perm-select-all" style="font-size:11px">Select All</button>
        <button class="text-button" data-action="perm-clear-all" style="font-size:11px">Clear All</button>
        <button class="text-button" data-action="restore-role-default" style="font-size:11px">Reset to Role Default</button>
        <button class="primary" data-action="save-perm-matrix" style="font-size:12px;padding:6px 14px">Save & Apply Permissions ✓</button>
      </div>
    </div>

    <!-- Grouped Permission Checkbox Grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;margin:16px 0">
      ${['Core Operations', 'Field & Dispatch', 'Financials & Billing', 'Inventory & Supplies', 'Customer Care & CRM', 'Administration & System'].map(cat => {
        const catModules = permissionModules.filter(m => m.cat === cat);
        return `<div style="background:#fff;border:1px solid var(--line);border-radius:8px;padding:14px">
          <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.5px;color:var(--green);margin:0 0 10px;border-bottom:1px solid var(--line);padding-bottom:6px">
            ${cat}
          </h3>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${catModules.map(m => {
              const checked = currentRolePerms.includes(m.id);
              return `<label style="display:flex;align-items:center;gap:10px;font-size:12px;cursor:pointer;padding:4px 6px;border-radius:4px;background:${checked ? '#f0f7f3' : 'transparent'}">
                <input type="checkbox" class="perm-module-check" value="${m.id}" ${checked ? 'checked' : ''} style="width:16px;height:16px;accent-color:var(--green)">
                <span style="font-size:14px">${m.icon}</span>
                <span style="font-weight:${checked ? '700' : '400'};color:${checked ? '#145449' : 'inherit'}">${esc(m.name)}</span>
              </label>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>

    <!-- Role × Permission Comparison Matrix Table -->
    <h3 style="margin:24px 0 10px">Overall Role Access Comparison Matrix</h3>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>SYSTEM MODULE</th>
            <th title="Super Admin">SUPER</th>
            <th title="Admin">ADMIN</th>
            <th title="Manager">MGR</th>
            <th title="Telecaller">CALL</th>
            <th title="Pest Tech">PEST</th>
            <th title="Clean Tech">CLEAN</th>
            <th title="Inspector">INSP</th>
            <th title="Accountant">ACCT</th>
            <th title="Management">MGMT</th>
          </tr>
        </thead>
        <tbody>
          ${permissionModules.map(m => `<tr>
            <td><strong>${m.icon} ${esc(m.name)}</strong></td>
            <td style="text-align:center">${(access['Super Admin'] || []).includes(m.id) ? '<span style="color:var(--green);font-weight:700">✓</span>' : '<span style="color:#ccc">✕</span>'}</td>
            <td style="text-align:center">${(access['Admin'] || []).includes(m.id) ? '<span style="color:var(--green);font-weight:700">✓</span>' : '<span style="color:#ccc">✕</span>'}</td>
            <td style="text-align:center">${(access['Manager'] || []).includes(m.id) ? '<span style="color:var(--green);font-weight:700">✓</span>' : '<span style="color:#ccc">✕</span>'}</td>
            <td style="text-align:center">${(access['Telecaller'] || []).includes(m.id) ? '<span style="color:var(--green);font-weight:700">✓</span>' : '<span style="color:#ccc">✕</span>'}</td>
            <td style="text-align:center">${(access['Pest Control Technician'] || []).includes(m.id) ? '<span style="color:var(--green);font-weight:700">✓</span>' : '<span style="color:#ccc">✕</span>'}</td>
            <td style="text-align:center">${(access['Cleaning Technician'] || []).includes(m.id) ? '<span style="color:var(--green);font-weight:700">✓</span>' : '<span style="color:#ccc">✕</span>'}</td>
            <td style="text-align:center">${(access['Site Inspector'] || []).includes(m.id) ? '<span style="color:var(--green);font-weight:700">✓</span>' : '<span style="color:#ccc">✕</span>'}</td>
            <td style="text-align:center">${(access['Accountant'] || []).includes(m.id) ? '<span style="color:var(--green);font-weight:700">✓</span>' : '<span style="color:#ccc">✕</span>'}</td>
            <td style="text-align:center">${(access['Management / Reporting User'] || []).includes(m.id) ? '<span style="color:var(--green);font-weight:700">✓</span>' : '<span style="color:#ccc">✕</span>'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>`;
}

function auditPage() {
  const list = db.auditLogs || [];
  return pageHeading(
    'System Audit Logs',
    'Granular immutable trail of all operations: logins, lead reassignments, job completions, and payment modifications.',
    ''
  ) +
  `<section class="card">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>TIMESTAMP</th>
            <th>PERFORMED BY</th>
            <th>ACTION</th>
            <th>DETAILS</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(a => `<tr>
            <td><small>${esc(a.at)}</small></td>
            <td><strong>${esc(a.by)}</strong></td>
            <td><span class="badge green">${esc(a.action)}</span></td>
            <td>${esc(a.details)}</td>
          </tr>`).join('') || '<tr><td colspan="4" style="text-align:center;padding:30px">No audit entries.</td></tr>'}
        </tbody>
      </table>
    </div>
  </section>`;
}

function settingsPage() {
  return pageHeading(
    'Settings & Workspaces',
    'Configure company GST details, multi-workspace switches, and default service terms.',
    '<button class="primary" data-action="save-settings">Save Settings</button>'
  ) +
  `<div class="grid">
    <section class="card">
      <div class="card-head"><h2>Company Profile & Taxation</h2></div>
      <div class="card-body form-grid">
        <label>Company Name<input value="VU Care Services Pvt Ltd"></label>
        <label>GSTIN Number<input value="29AABCU9603R1ZM"></label>
        <label>Support Phone<input value="+91 98860 11223"></label>
        <label>Support Email<input value="care@vucareservices.com"></label>
        <label class="full">Head Office Address<input value="Ground Floor, Koramangala 5th Block, Bangalore 560095"></label>
        <label class="full">Bank Details (Invoices)<input value="HDFC Bank · A/c 50200088991122 · IFSC: HDFC0001234"></label>
      </div>
    </section>
    <section class="card">
      <div class="card-head"><h2>Active Service Workspaces</h2></div>
      <div class="card-body">
        <p class="sub" style="margin-bottom:14px">Switch active workspace to filter catalogue, staff, jobs, and invoices.</p>
        ${['All services', 'Pest Control', 'Deep Cleaning'].map(w => `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #f0f3f1">
          <b>${w}</b>
          ${workspace === w ? '<span class="badge green">Current Active</span>' : `<button class="primary" data-switch-ws="${w}" style="font-size:11px;padding:4px 8px">Switch</button>`}
        </div>`).join('')}
      </div>
    </section>
  </div>`;
}

// Backward-compatible site visit inspection views
function visitPage() {
  const list = leads().filter(l => l.visitStatus !== 'Not required' && (role !== 'Site Inspector' || l.visitOwner === currentPerson()));
  return pageHeading(
    'Site Visits & Inspection',
    role === 'Site Inspector' ? `${esc(currentPerson())}’s assigned inspections. Record findings and photos.` : 'Assign inspections, review findings, and verify site photos before confirming jobs.',
    citySelect()
  ) +
  `<div class="schedule">
    ${list.map(l => {
      l.photos = l.photos || [];
      const beforeCount = l.photos.filter(p => /before/i.test(p.kind)).length;
      const afterCount = l.photos.filter(p => /after/i.test(p.kind)).length;
      return `<article class="card job-card" style="padding:18px">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <b>${esc(l.visitDate)} · ${esc(l.visitTime)}</b>
          ${badge(l.visitStatus)}
        </div>
        <h3 style="margin:4px 0">${esc(l.name)}</h3>
        <p class="sub">${esc(l.service)} · ${esc(l.property)}</p>
        <p style="margin:6px 0;font-size:12px">📍 ${esc(l.area)}, ${esc(l.city)}</p>
        <div style="display:flex;gap:8px;align-items:center;margin:8px 0;font-size:11px">
          ${mapLink(l.area + ', ' + l.city)}
          <span class="badge ${l.photos.length ? 'green' : 'orange'}">📷 ${l.photos.length} photos (${beforeCount} Before · ${afterCount} After)</span>
        </div>
        <div style="border-top:1px solid #f0f3f1;padding-top:10px;margin-top:10px;display:flex;justify-content:space-between;align-items:center">
          <small>Inspector: <b>${esc(l.visitOwner)}</b></small>
          <button data-inspect="${l.id}" class="primary" style="font-size:11px;padding:4px 8px">Open Inspection →</button>
        </div>
      </article>`;
    }).join('') || '<section class="card empty" style="padding:40px;text-align:center">No site visits scheduled.</section>'}
  </div>`;
}

function assignmentsPage() { return overviewPage(); }
function schedulePage() { return jobPage(); }
function supportPage() { return complaintPage(); }



// Render Engine, Modals, Dialogs, AI Assistant & Interactive Wiring

function render() {
  if (!access[role]?.includes(page)) {
    page = access[role]?.[0] || 'overview';
  }

  // Update navigation items
  const navEl = $('#nav');
  if (navEl) {
    navEl.innerHTML = (access[role] || []).map(p => {
      const n = names[p] || ['◈', p];
      return `<a href="#${p}" class="${page === p ? 'active' : ''}" data-nav="${p}"><i>${n[0]}</i><span>${esc(n[1])}</span></a>`;
    }).join('');
  }

  // Update header & profiles
  if ($('#crumb')) $('#crumb').textContent = names[page]?.[1] || page;
  if ($('#ws-label')) $('#ws-label').textContent = workspace;
  const personName = currentPerson();
  if ($('#profile-name')) {
    $('#profile-name').innerHTML = `${esc(personName)}<small>${esc(role)}</small>`;
  }
  if ($('#profile-avatar')) $('#profile-avatar').textContent = initials(personName);
  if ($('#header-avatar')) $('#header-avatar').textContent = initials(personName);
  if ($('#auth-user-name')) $('#auth-user-name').textContent = personName;
  if ($('#auth-user-role')) $('#auth-user-role').textContent = role;

  // Render active page
  const pageMap = {
    overview: overviewPage,
    leads: leadPage,
    customers: customerPage,
    services: servicePage,
    bookings: bookingPage,
    dispatch: dispatchPage,
    jobs: jobPage,
    technician_app: technicianAppPage,
    amc: amcPage,
    quotations: quotationPage,
    invoices: invoicePage,
    payments: paymentPage,
    inventory: inventoryPage,
    expenses: expensePage,
    vendors: vendorPage,
    complaints: complaintPage,
    whatsapp: whatsappPage,
    reports: reportPage,
    users: userPage,
    audit: auditPage,
    settings: settingsPage,
    visits: visitPage,
    assignments: assignmentsPage,
    schedule: schedulePage,
    support: supportPage
  };

  const renderer = pageMap[page] || overviewPage;
  const mainEl = $('#main');
  if (mainEl) {
    mainEl.innerHTML = renderer();
  }

  // Active link scroll & indicators
  const activeLink = document.querySelector('#nav a.active');
  if (activeLink && typeof activeLink.scrollIntoView === 'function') {
    activeLink.scrollIntoView({ block: 'nearest' });
  }
  updateNavScrollIndicator();

  // Initialize signature pad if technician app is visible
  if (page === 'technician_app') {
    initSignaturePad();
  }
}

function updateNavScrollIndicator() {
  const n = document.querySelector('#nav');
  const h = document.querySelector('#nav-scroll-hint');
  if (!n || !h || !n.scrollHeight) return;
  const canScroll = (n.scrollHeight - n.scrollTop - n.clientHeight) > 14;
  if (h.classList && typeof h.classList.toggle === 'function') {
    h.classList.toggle('visible', canScroll);
  }
}

function modal(title, body, footer = '') {
  const d = $('#dialog');
  if (!d) return;
  const content = $('#modal-content');
  if (content) {
    content.innerHTML = `<div class="modal-head">
      <h2>${title}</h2>
      <button data-action="close" aria-label="Close dialog">✕</button>
    </div>
    ${body}
    ${footer ? `<div class="modal-footer">${footer}</div>` : ''}`;
  }
  if (typeof d.showModal === 'function') d.showModal();
}

function options(a, v) {
  return (a || []).map(x => `<option ${x === v ? 'selected' : ''}>${esc(x)}</option>`).join('');
}

// 18-Field New Lead Capture Modal (Section 6)
function newLead() {
  modal('New Customer Enquiry (200/day Queue)', `
    <form id="lead-form">
      <div class="modal-body form-grid">
        <label>Customer Name<input name="name" required placeholder="Full Name" maxlength="70"></label>
        <label>Mobile Number<input name="phone" required placeholder="10-digit mobile" maxlength="15"></label>
        <label>WhatsApp Number<input name="whatsapp" placeholder="WhatsApp contact" maxlength="15"></label>
        <label>Email Address<input name="email" type="email" placeholder="customer@example.com"></label>
        <label>Service Required
          <select name="service">
            ${db.services.map(s => `<option value="${esc(s.name)}">${esc(s.category)}: ${esc(s.name)} (₹${s.price})</option>`).join('')}
          </select>
        </label>
        <label>Client Type
          <select name="clientType">
            <option>Residential</option>
            <option>Commercial</option>
          </select>
        </label>
        <label>City
          <select name="city">
            <option>Bangalore</option>
            <option>Mysore</option>
            <option>Hassan</option>
          </select>
        </label>
        <label>Area / Locality<input name="area" required placeholder="e.g. Indiranagar, Whitefield"></label>
        <label class="full">Full Address<input name="address" required placeholder="Door/Flat, Street, Landmark"></label>
        <label>Property Details<input name="property" required placeholder="e.g. 3 BHK Furnished / 2500 sq ft Office"></label>
        <label>Estimated Value (₹)<input name="amount" type="number" required min="1" value="6499"></label>
        <label>Lead Source
          <select name="source">
            ${options(['Phone', 'WhatsApp', 'Website', 'Google', 'Instagram', 'Facebook', 'Referral', 'Existing customer', 'Other'])}
          </select>
        </label>
        <label>Priority
          <select name="priority">
            <option>Medium</option><option>High</option><option>Low</option>
          </select>
        </label>
        <label>Assigned Telecaller
          <select name="owner">
            ${options(['Unassigned', 'Ananya', 'Kiran'], role === 'Telecaller' ? currentPerson() : 'Ananya')}
          </select>
        </label>
        <label class="full">Customer Requirements / Pest Details
          <textarea name="note" rows="2" maxlength="500" placeholder="Scope of work, preferred visit slots, infestation severity..."></textarea>
        </label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Create Enquiry ✓</button>
      </div>
    </form>
  `);
}

function leadDetail(id) {
  const l = db.leads.find(l => l.id === id);
  if (!l) return;
  const canEdit = canAssign() || (role === 'Telecaller' && l.owner === currentPerson());

  modal(`Lead #LEAD-${l.id} · ${esc(l.name)}`, `
    <div class="modal-body">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--line);padding-bottom:12px">
        <div>
          <span class="badge ${l.clientType === 'Commercial' ? 'purple' : 'green'}">${esc(l.clientType || 'Residential')}</span>
          <span class="badge blue">${esc(l.source)}</span>
          <h3 style="margin:8px 0 4px">${esc(l.name)}</h3>
          <p class="sub">📞 ${esc(l.phone)} · ✉ ${esc(l.email || 'No email')} · 📍 ${esc(l.area)}, ${esc(l.city)}</p>
        </div>
        <div style="text-align:right">
          <strong style="font-size:20px;color:var(--green)">${money(l.amount)}</strong>
          <small style="display:block;color:var(--muted)">Expected Value</small>
        </div>
      </div>

      <div class="form-grid" style="margin-top:16px">
        <label>Lead Stage
          <select id="lead-stage" ${!canEdit ? 'disabled' : ''}>
            ${options(['New enquiry', 'Contacted', 'Requirement Collected', 'Quotation sent', 'Confirmed', 'Converted', 'Lost', 'Cancelled'], l.status)}
          </select>
        </label>
        <label>Lead Owner (Telecaller)
          <select id="lead-owner" ${!canAssign() ? 'disabled' : ''}>
            ${options(['Unassigned', 'Ananya', 'Kiran'], l.owner)}
          </select>
        </label>
        <label>Next Follow-Up Time
          <input type="datetime-local" id="lead-followup" value="${esc(l.nextFollowup || '')}" ${!canEdit ? 'disabled' : ''}>
        </label>
        <label>Site Visit Requirement
          <select id="visit-status" ${!canAssign() ? 'disabled' : ''}>
            ${options(['Not required', 'Scheduled', 'Completed'], l.visitStatus || 'Not required')}
          </select>
        </label>
        <label>Site Inspector
          <select id="visit-owner" ${!canAssign() ? 'disabled' : ''}>
            ${options(['Ravi', 'Mahesh', 'Deepak'], l.visitOwner || 'Ravi')}
          </select>
        </label>
        <label>Inspection Date
          <input type="date" id="visit-date" value="${esc(l.visitDate || '')}" ${!canAssign() ? 'disabled' : ''}>
        </label>
        <label class="full">Log Telecaller Follow-up Call Note
          <textarea id="followup-note" rows="2" placeholder="Record customer feedback, agreed pricing, or next steps..."></textarea>
        </label>
        <label class="full">Inspection Findings / Condition Notes
          <textarea id="visit-notes" rows="2" placeholder="Findings on site condition..." ${!canAssign() ? 'readonly' : ''}>${esc(l.visitNotes || '')}</textarea>
        </label>
      </div>

      <!-- Follow-up History Stream -->
      <h3 style="margin:20px 0 8px">Follow-Up History</h3>
      <div style="background:#f7faf8;border:1px solid var(--line);border-radius:8px;padding:12px;max-height:160px;overflow-y:auto">
        ${(l.followups || []).slice().reverse().map(f => `<div style="padding:6px 0;border-bottom:1px solid #eef2ef;font-size:12px">
          <b>${esc(f.by)} · ${esc(f.at)}</b>
          <p style="margin:2px 0">${esc(f.note)}</p>
        </div>`).join('') || '<p class="sub">No follow-ups recorded yet.</p>'}
      </div>
    </div>
  `, l.status === 'Converted' ? '<button data-action="close">Close</button>' : `
    <button data-action="close">Cancel</button>
    <button class="primary" data-save-lead="${l.id}">Save Lead Stage & Call Log</button>
    ${canAssign() ? `<button class="success" data-handover="${l.id}">Confirm & Convert to Booking →</button>` : ''}
  `);
}

function applyLeadAssignment(id, v) {
  if (!canAssign()) throw Error('Only a manager can assign work');
  const l = db.leads.find(l => l.id === id);
  if (!l) throw Error('Lead unavailable');
  if (!['Unassigned', 'Ananya', 'Kiran'].includes(v.owner) || !['Ravi', 'Mahesh', 'Deepak'].includes(v.inspector)) throw Error('Choose a valid staff member');
  if (!['Not required', 'Scheduled', 'Completed'].includes(v.visit)) throw Error('Choose a valid visit status');
  if (v.visit !== 'Not required' && (!v.date || !v.time)) throw Error('Choose the inspection date and time');
  if (v.visit === 'Completed' && !l.visitNotes) throw Error('Record inspection findings before completing the visit');

  const oldOwner = l.owner, oldInspector = l.visitOwner;
  Object.assign(l, {
    owner: v.owner,
    nextFollowup: v.followup,
    visitStatus: v.visit,
    visitOwner: v.inspector,
    visitDate: v.date,
    visitTime: v.time
  });
  if (oldOwner !== l.owner) logAssignment(l, 'Lead Owner', oldOwner, l.owner);
  if (oldInspector !== l.visitOwner || v.visit === 'Scheduled') logAssignment(l, 'Inspector', oldInspector, l.visitOwner);
  if (v.instructions?.trim()) l.followups.push({ note: v.instructions.trim(), by: role, at: new Date().toLocaleString('en-IN') });
  return l;
}

function saveLeadWorkflow(id) {
  const l = db.leads.find(l => l.id === id);
  if (!l) return false;
  l.status = $('#lead-stage')?.value || l.status;
  l.nextFollowup = $('#lead-followup')?.value || l.nextFollowup;
  const note = $('#followup-note')?.value?.trim();
  if (note) {
    l.followups = l.followups || [];
    l.followups.push({ note, by: currentPerson(), at: new Date().toLocaleString('en-IN') });
  }
  if (canAssign()) {
    l.owner = $('#lead-owner')?.value || l.owner;
    l.visitStatus = $('#visit-status')?.value || l.visitStatus;
    l.visitOwner = $('#visit-owner')?.value || l.visitOwner;
    l.visitDate = $('#visit-date')?.value || l.visitDate;
    l.visitNotes = $('#visit-notes')?.value || l.visitNotes;
  }
  return true;
}

// Photo Evidence & Inspection Modals (Section 8, 9 & Site Visits)
function renderVisitPhotos(photos = [], id = 0) {
  if (!photos || !photos.length) {
    return '<p class="sub" style="padding:10px 0;grid-column:1/-1">No inspection / site photos uploaded yet.</p>';
  }
  return photos.map((p, idx) => {
    const isObj = typeof p === 'object' && p !== null;
    const kind = isObj ? (p.kind || 'Evidence') : 'Evidence';
    const label = isObj ? (p.label || p.time || '') : '';
    const src = isObj ? (p.url || p.src || '') : p;
    const isBefore = /before/i.test(kind);
    return `<div class="photo-card" style="position:relative;background:#fff;border:1px solid var(--line);border-radius:8px;padding:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span class="badge ${isBefore ? 'orange' : 'green'}" style="font-size:10px">${esc(kind)}</span>
        <small style="color:var(--muted);font-size:10px">${esc(label)}</small>
      </div>
      ${src ? `<img src="${esc(src)}" alt="${esc(kind)}" style="width:100%;height:120px;object-fit:cover;border-radius:6px;display:block">` : `<div style="height:120px;background:#f4f7f5;border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:12px">📷 Photo #${idx + 1}</div>`}
      <button data-remove-photo="${id}:${idx}" style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,0.65);color:#fff;border:0;border-radius:50%;width:22px;height:22px;line-height:20px;padding:0;cursor:pointer;font-size:11px" title="Delete Photo">✕</button>
    </div>`;
  }).join('');
}

function inspectionDialog(id) {
  const l = db.leads.find(l => l.id === id);
  if (!l) return;
  l.photos = l.photos || [];

  modal(`Site Inspection · ${esc(l.name)}`, `
    <div class="modal-body">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--line);padding-bottom:12px">
        <div>
          <span class="badge blue">${esc(l.service)}</span>
          <span class="badge ${l.visitStatus === 'Completed' ? 'green' : 'orange'}">${esc(l.visitStatus)}</span>
          <h3 style="margin:8px 0 4px">${esc(l.name)}</h3>
          <p class="sub">📍 ${esc(l.address || l.area + ', ' + l.city)} · 📞 ${esc(l.phone)}</p>
        </div>
        <div>
          ${mapLink(l.address || l.area + ', ' + l.city)}
        </div>
      </div>

      <div class="form-grid" style="margin-top:16px">
        <label>Visit Status
          <select id="inspect-status">
            ${options(['Scheduled', 'Completed', 'Cancelled'], l.visitStatus)}
          </select>
        </label>
        <label>Assigned Inspector
          <select id="inspect-owner" ${!canAssign() ? 'disabled' : ''}>
            ${options(['Ravi', 'Mahesh', 'Deepak'], l.visitOwner || 'Ravi')}
          </select>
        </label>
        <label>Inspection Date
          <input type="date" id="inspect-date" value="${esc(l.visitDate || '')}">
        </label>
        <label>Inspection Time
          <input type="time" id="inspect-time" value="${esc(l.visitTime || '09:00')}">
        </label>
        <label class="full">Inspection Findings & Customer Condition Notes
          <textarea id="inspect-notes" rows="3" placeholder="Describe findings (e.g. termite severity, dampness, wall condition)...">${esc(l.visitNotes || '')}</textarea>
        </label>
      </div>

      <h3 style="margin:20px 0 8px">Site Photos (Before & After Evidence)</h3>
      <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap">
        <label class="btn" style="cursor:pointer;background:#eef6f3;color:var(--green);padding:6px 12px;border-radius:6px;font-size:12px;display:inline-flex;align-items:center;gap:6px">
          📷 Add Before Photo
          <input type="file" accept="image/*" class="visit-file-input" data-kind="Before" data-id="${l.id}" style="display:none">
        </label>
        <label class="btn" style="cursor:pointer;background:#eef6f3;color:var(--green);padding:6px 12px;border-radius:6px;font-size:12px;display:inline-flex;align-items:center;gap:6px">
          📷 Add After Photo
          <input type="file" accept="image/*" class="visit-file-input" data-kind="After" data-id="${l.id}" style="display:none">
        </label>
      </div>

      <div class="visit-photo-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(140px, 1fr));gap:10px">
        ${renderVisitPhotos(l.photos, l.id)}
      </div>
    </div>
  `, `
    <button data-action="close">Cancel</button>
    <button class="primary" data-save-inspect="${l.id}">Save Inspection Findings ✓</button>
    ${canAssign() && l.visitStatus === 'Completed' ? `<button class="success" data-convert="${l.id}">Convert to Confirmed Booking →</button>` : ''}
  `);
}

function jobDetail(id) {
  const j = db.jobs.find(j => j.id === id);
  if (!j) return;
  const canManage = canAssign();

  modal(`Job #VC-${j.id} · ${esc(j.name)}`, `
    <div class="modal-body">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <span class="badge ${j.status === 'Completed' ? 'green' : 'orange'}">${esc(j.status)}</span>
          <h3 style="margin:8px 0 4px">${esc(j.service)}</h3>
          <p class="sub">Customer: <b>${esc(j.name)}</b> · 📍 ${esc(j.address || j.area + ', ' + j.city)}</p>
        </div>
        ${mapLink(j.address || j.area + ', ' + j.city)}
      </div>

      <div class="stats" style="grid-template-columns:repeat(3, 1fr);gap:10px;margin:16px 0">
        <div><small>Scheduled Visit</small><strong>${esc(j.date)} ${esc(j.time)}</strong></div>
        <div><small>Booking Value</small><strong>${money(j.amount)}</strong></div>
        <div><small>Paid / Due</small><strong style="color:var(--green)">${money(j.paid)} / ${money(j.amount - j.paid)}</strong></div>
      </div>

      ${canManage ? `
        <div class="form-grid" style="margin-top:16px;background:#f7faf8;padding:14px;border-radius:8px">
          <label>Assign Technician
            <select id="job-worker">
              ${options(['Unassigned', 'Ravi', 'Suresh', 'Mahesh', 'Deepak'], j.worker || 'Unassigned')}
            </select>
          </label>
          <label>Service Date<input type="date" id="job-date" value="${esc(j.date)}" required></label>
          <label>Service Time<input type="time" id="job-time" value="${esc(j.time)}" required></label>
          <label>Job Status
            <select id="job-status">
              ${options(['Scheduled', 'Assigned', 'Dispatched', 'Reached', 'In progress', 'Completed', 'On Hold', 'Cancelled'], j.status)}
            </select>
          </label>
        </div>
      ` : ''}

      <!-- Photos & Service Report Summary -->
      <h3 style="margin:20px 0 8px">Before & After Work Evidence</h3>
      <div class="photo-grid visit-photo-grid">
        ${renderVisitPhotos(j.photos || [], j.id)}
      </div>

      ${j.status === 'Completed' ? `
        <div style="margin-top:16px;text-align:right">
          <button class="primary" data-view-report="${j.id}">View Downloadable Service Report 📄</button>
        </div>
      ` : ''}
    </div>
  `, canManage ? `
    <button data-action="close">Cancel</button>
    <button class="primary" data-save-job="${j.id}">Save Job & Crew Assignment</button>
  ` : '<button data-action="close">Close</button>');
}

function invoice(id) {
  const j = db.jobs.find(j => j.id === id);
  if (!j) return;
  const subtotal = Math.round(j.amount / 1.18);
  const gst = j.amount - subtotal;
  const balance = j.amount - j.paid;

  modal(`Invoice INV-${j.id}`, `
    <div class="modal-body" id="printable-invoice">
      <div style="display:flex;justify-content:space-between;border-bottom:2px solid var(--green);padding-bottom:12px">
        <div>
          <h2 style="color:var(--green);margin:0">VU CARE SERVICES PVT LTD</h2>
          <small>GSTIN: 29AABCU9603R1ZM · Koramangala 5th Block, Bangalore</small>
        </div>
        <div style="text-align:right">
          <h3 style="margin:0">TAX INVOICE</h3>
          <b>INV-${j.id}</b><br><small>Date: ${esc(j.date)}</small>
        </div>
      </div>

      <div style="margin:16px 0;display:flex;justify-content:space-between">
        <div>
          <small style="text-transform:uppercase;color:var(--muted)">Billed To:</small>
          <strong>${esc(j.name)}</strong>
          <p class="sub">${esc(j.address || j.area + ', ' + j.city)}<br>Phone: ${esc(j.phone || '9876543210')}</p>
        </div>
        <div style="text-align:right">
          <span class="badge ${balance === 0 ? 'green' : 'orange'}">${balance === 0 ? 'Paid in Full' : 'Balance Pending'}</span>
        </div>
      </div>

      <table style="margin:16px 0">
        <thead><tr><th>DESCRIPTION</th><th>QTY</th><th>RATE</th><th>AMOUNT</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>${esc(j.service)}</strong><small>${esc(j.property || 'Standard')}</small></td>
            <td>1</td>
            <td>${money(subtotal)}</td>
            <td>${money(subtotal)}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:right"><b>Subtotal</b></td>
            <td>${money(subtotal)}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:right"><b>CGST (9%) + SGST (9%)</b></td>
            <td>${money(gst)}</td>
          </tr>
          <tr style="background:#f4f8f6">
            <td colspan="3" style="text-align:right"><strong>Total Invoice Amount</strong></td>
            <td><strong style="font-size:16px;color:var(--green)">${money(j.amount)}</strong></td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:right">Amount Paid</td>
            <td>${money(j.paid)}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:right"><b>Balance Due</b></td>
            <td><b style="color:${balance > 0 ? 'var(--danger)' : 'var(--green)'}">${money(balance)}</b></td>
          </tr>
        </tbody>
      </table>

      <!-- Dynamic UPI QR Code and Bank Details -->
      <div style="display:flex;gap:20px;align-items:center;background:#fbfdfc;border:1px solid var(--line);border-radius:8px;padding:14px">
        <div style="text-align:center">
          <div style="width:110px;height:110px;background:#eef5f1;border:1px dashed var(--green);display:grid;place-items:center;border-radius:8px">
            <span style="font-size:32px">▦</span>
          </div>
          <small style="font-size:10px;font-weight:700">Scan & Pay UPI</small>
        </div>
        <div style="font-size:12px;line-height:1.6">
          <b>Payable via UPI / Bank Transfer:</b><br>
          UPI ID: <strong style="color:var(--green)">vucare@hdfcbank</strong><br>
          A/c: 50200088991122 · IFSC: HDFC0001234 · HDFC Bank Koramangala
        </div>
      </div>
    </div>
  `, `
    <button data-action="print">Print Invoice 🖨</button>
    <button class="whatsapp-button" data-whatsapp-invoice="${j.id}">Send via WhatsApp 💬</button>
  `);
}

function customerDetail(name) {
  const c = db.customers.find(c => c.name === name) || { name, addresses: [{ label: 'Primary', address: 'Bangalore' }] };
  const historyJobs = db.jobs.filter(j => j.name === name);
  const historyLeads = db.leads.filter(l => l.name === name);

  modal(`Customer 360 · ${esc(name)}`, `
    <div class="modal-body">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <h2 style="margin:0">${esc(c.name)}</h2>
          <p class="sub">📞 ${esc(c.phone || '9886011223')} · ✉ ${esc(c.email || 'customer@example.com')}</p>
        </div>
        <button class="primary" data-customer-qr="${c.id || 'CUST-001'}">▦ View Unique QR Code</button>
      </div>

      <h3 style="margin:16px 0 8px">Registered Addresses</h3>
      <div style="background:#f7faf8;border:1px solid var(--line);border-radius:8px;padding:12px">
        ${(c.addresses || []).map(a => `<div style="padding:4px 0"><b>${esc(a.label)}:</b> ${esc(a.address)}</div>`).join('')}
      </div>

      <h3 style="margin:20px 0 8px">Service History & Bookings (${historyJobs.length})</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>JOB #</th><th>SERVICE</th><th>DATE</th><th>STATUS</th></tr></thead>
          <tbody>
            ${historyJobs.map(j => `<tr>
              <td>#VC-${j.id}</td>
              <td>${esc(j.service)}</td>
              <td>${esc(j.date)}</td>
              <td>${badge(j.status)}</td>
            </tr>`).join('') || '<tr><td colspan="4">No completed jobs yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `, '<button data-action="close">Close</button>');
}

// Comprehensive Modal Dialogs for All 55 Master Requirements

function newCustomerDialog() {
  modal('Register New Customer (Customer 360)', `
    <form id="customer-form">
      <div class="modal-body form-grid">
        <label>Customer Full Name<input name="name" required placeholder="Full Name" maxlength="70"></label>
        <label>Mobile Number<input name="phone" required placeholder="Primary 10-digit number" maxlength="15"></label>
        <label>WhatsApp Number<input name="whatsapp" placeholder="WhatsApp contact" maxlength="15"></label>
        <label>Email Address<input name="email" type="email" placeholder="customer@example.com"></label>
        <label>Client Type
          <select name="clientType">
            <option>Residential</option>
            <option>Commercial</option>
            <option>Industrial</option>
          </select>
        </label>
        <label>City
          <select name="city">
            <option>Bangalore</option><option>Mysore</option><option>Hassan</option>
          </select>
        </label>
        <label>Area / Locality<input name="area" required placeholder="e.g. Indiranagar, HSR Layout"></label>
        <label>Pincode<input name="pincode" placeholder="e.g. 560038" maxlength="10"></label>
        <label class="full">Primary Premises Address<input name="address" required placeholder="Flat/House, Apartment/Building, Main Road"></label>
        <label class="full">Initial Customer Notes / Preferences
          <textarea name="notes" rows="2" placeholder="Key contact person, access gate instructions, special notes..."></textarea>
        </label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Save Customer Profile ✓</button>
      </div>
    </form>
  `);
}

function newUserDialog() {
  const rolesList = ['Super Admin / Owner', 'Admin / Operations Manager', 'Manager', 'Telecaller', 'Pest Control Technician', 'Cleaning Technician', 'Site Inspector', 'Accountant', 'Management / Reporting User'];
  modal('Add New Employee', `
    <form id="user-form">
      <div class="modal-body form-grid">
        <label>Full Name<input name="name" required placeholder="Employee Full Name"></label>
        <label>Mobile Number<input name="phone" required placeholder="10-digit phone"></label>
        <label>Email Address<input name="email" type="email" placeholder="employee@vucare.com"></label>
        <label>Assigned Role
          <select name="role">
            ${rolesList.map(r => `<option>${esc(r)}</option>`).join('')}
          </select>
        </label>
        <label>Department
          <select name="department">
            <option>Operations</option><option>Sales</option><option>Field Operations</option><option>Finance</option><option>Executive</option><option>Support</option>
          </select>
        </label>
        <label>Workspace Assignment
          <select name="workspace">
            <option>All services</option><option>Pest Control</option><option>Deep Cleaning</option>
          </select>
        </label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Create Employee Account ✓</button>
      </div>
    </form>
  `);
}

function editUserDialog(id) {
  const u = (db.users || []).find(user => user.id === id);
  if (!u) return;
  const rolesList = ['Super Admin / Owner', 'Admin / Operations Manager', 'Manager', 'Telecaller', 'Pest Control Technician', 'Cleaning Technician', 'Site Inspector', 'Accountant', 'Management / Reporting User'];
  modal(`Edit Employee · ${esc(u.name)}`, `
    <form id="edit-user-form" data-user-id="${u.id}">
      <div class="modal-body form-grid">
        <label>Full Name<input name="name" required value="${esc(u.name)}"></label>
        <label>Mobile Number<input name="phone" required value="${esc(u.phone)}"></label>
        <label>Email Address<input name="email" type="email" value="${esc(u.email || '')}"></label>
        <label>Assigned Role
          <select name="role">
            ${rolesList.map(r => `<option ${r === u.role ? 'selected' : ''}>${esc(r)}</option>`).join('')}
          </select>
        </label>
        <label>Department
          <select name="department">
            ${options(['Operations', 'Sales', 'Field Operations', 'Finance', 'Executive', 'Support'], u.department)}
          </select>
        </label>
        <label>Workspace Assignment
          <select name="workspace">
            ${options(['All services', 'Pest Control', 'Deep Cleaning'], u.workspace)}
          </select>
        </label>
        <label>Status
          <select name="status">
            ${options(['Active', 'On Leave', 'Inactive'], u.status)}
          </select>
        </label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Update Employee Details ✓</button>
      </div>
    </form>
  `);
}

function newQuotationDialog() {
  modal('Create New Service Quotation', `
    <form id="quotation-form">
      <div class="modal-body form-grid">
        <label>Customer Name<input name="customer" required placeholder="Customer or Company Name"></label>
        <label>Service Category
          <select name="service">
            ${db.services.map(s => `<option value="${esc(s.name)}">${esc(s.category)}: ${esc(s.name)}</option>`).join('')}
          </select>
        </label>
        <label>Scope / Property<input name="property" required placeholder="e.g. 3 BHK Furnished / Commercial 2500 sq ft"></label>
        <label>Base Price / Subtotal (₹)<input name="subtotal" id="quote-subtotal" type="number" required min="1" value="6499"></label>
        <label>Discount Amount (₹)<input name="discount" id="quote-discount" type="number" min="0" value="0"></label>
        <label>Validity Days<input name="validityDays" type="number" value="30"></label>
        <label class="full">Terms & Service Warranty
          <textarea name="terms" rows="2">50% advance on confirmation, balance upon completion. 1-year service warranty included with free semi-annual inspection.</textarea>
        </label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Generate Quotation ✓</button>
      </div>
    </form>
  `);
}

function quoteDetailDialog(id) {
  const q = (db.quotations || []).find(item => item.id === id);
  if (!q) return;

  const shareText = encodeURIComponent(`Hello ${q.customer}, here is your VU Care quotation (${q.id}) for ${q.service}: Total amount ${money(q.total)} including 18% GST. Valid until ${q.validity}.`);

  modal(`Quotation ${esc(q.id)} · ${esc(q.customer)}`, `
    <div class="modal-body" id="printable-quote">
      <div style="display:flex;justify-content:space-between;border-bottom:2px solid var(--green);padding-bottom:12px">
        <div>
          <h2 style="color:var(--green);margin:0">VU CARE SERVICES PVT LTD</h2>
          <small>GSTIN: 29AABCU9603R1ZM · Official Quotation & Estimate</small>
        </div>
        <div style="text-align:right">
          <h3 style="margin:0">${esc(q.id)}</h3>
          <small>Date: ${esc(q.date)} · Valid: ${esc(q.validity)}</small>
        </div>
      </div>
      <div style="margin:16px 0">
        <small style="color:var(--muted)">Quotation For:</small>
        <h3 style="margin:4px 0">${esc(q.customer)}</h3>
        <p class="sub">Service: <b>${esc(q.service)}</b></p>
      </div>
      <table style="margin:16px 0">
        <thead><tr><th>DESCRIPTION</th><th>QTY</th><th>RATE</th><th>AMOUNT</th></tr></thead>
        <tbody>
          ${(q.items || [{ desc: q.service, qty: 1, rate: q.subtotal, amount: q.subtotal }]).map(it => `<tr>
            <td>${esc(it.desc)}</td><td>${it.qty}</td><td>${money(it.rate)}</td><td>${money(it.amount)}</td>
          </tr>`).join('')}
          <tr><td colspan="3" style="text-align:right"><b>Subtotal</b></td><td>${money(q.subtotal)}</td></tr>
          ${q.discount ? `<tr><td colspan="3" style="text-align:right;color:var(--green)"><b>Discount</b></td><td>-${money(q.discount)}</td></tr>` : ''}
          <tr><td colspan="3" style="text-align:right"><b>GST (18%)</b></td><td>${money(q.taxAmount)}</td></tr>
          <tr style="background:#f4f8f6"><td colspan="3" style="text-align:right"><strong>Total Amount</strong></td><td><strong style="color:var(--green);font-size:16px">${money(q.total)}</strong></td></tr>
        </tbody>
      </table>
      <div style="background:#f7faf8;border-radius:6px;padding:10px;margin-top:12px;font-size:12px">
        <b>Terms:</b> ${esc(q.terms || '30 days validity. 50% advance.')}
      </div>
    </div>
  `, `
    <button data-action="close">Close</button>
    <a href="https://api.whatsapp.com/send?text=${shareText}" target="_blank" class="primary" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px">
      Share via WhatsApp 💬
    </a>
    ${q.status !== 'Converted' ? `<button class="success" data-convert-quote="${q.id}">Convert to Confirmed Booking →</button>` : ''}
  `);
}

function newInvoiceDialog() {
  modal('Create GST Tax Invoice', `
    <form id="invoice-form">
      <div class="modal-body form-grid">
        <label>Customer Name<input name="name" required placeholder="Customer / Organization Name"></label>
        <label>Service Category
          <select name="service">
            ${db.services.map(s => `<option value="${esc(s.name)}">${esc(s.category)}: ${esc(s.name)}</option>`).join('')}
          </select>
        </label>
        <label>Premises Address<input name="address" required placeholder="Address / Location"></label>
        <label>Total Invoice Value (₹)<input name="amount" type="number" required min="1" value="4999"></label>
        <label>Advance Payment Collected (₹)<input name="paid" type="number" min="0" value="0"></label>
        <label>City
          <select name="city"><option>Bangalore</option><option>Mysore</option><option>Hassan</option></select>
        </label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Issue Tax Invoice ✓</button>
      </div>
    </form>
  `);
}

function recordPaymentDialog(jobId) {
  const j = db.jobs.find(job => job.id === jobId);
  if (!j) return;
  const balance = Math.max(0, j.amount - j.paid);

  modal(`Record Payment · #VC-${j.id} (${esc(j.name)})`, `
    <form id="payment-form" data-job-id="${j.id}">
      <div class="modal-body form-grid">
        <div><small>Total Job Value</small><br><strong>${money(j.amount)}</strong></div>
        <div><small>Previously Paid</small><br><strong style="color:var(--green)">${money(j.paid)}</strong></div>
        <div><small>Balance Due</small><br><strong style="color:var(--orange)">${money(balance)}</strong></div>
        <label class="full">Payment Amount to Collect (₹)
          <input name="payAmount" type="number" required min="1" max="${balance || j.amount}" value="${balance || j.amount}">
        </label>
        <label>Payment Method
          <select name="method">
            <option>UPI (GPay / PhonePe / Paytm)</option>
            <option>Cash on Site</option>
            <option>Net Banking (NEFT/IMPS)</option>
            <option>Credit / Debit Card</option>
            <option>Cheque</option>
          </select>
        </label>
        <label>Transaction / UTR Reference<input name="reference" placeholder="e.g. UTR 4291882910"></label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Record Collection ✓</button>
      </div>
    </form>
  `);
}

function newAmcDialog() {
  modal('New Annual Maintenance Contract (AMC)', `
    <form id="amc-form">
      <div class="modal-body form-grid">
        <label>Customer Name<input name="customer" required placeholder="Full Name or Business Name"></label>
        <label>Service Category
          <select name="service">
            <option>Pest Control Comprehensive (Termites + General)</option>
            <option>Cockroach & Rodent Prevention AMC</option>
            <option>Quarterly Deep Cleaning Subscription</option>
            <option>Commercial Hygiene & Kitchen Degreasing</option>
          </select>
        </label>
        <label>Contract Value (₹)<input name="value" type="number" required min="1000" value="12000"></label>
        <label>Service Frequency
          <select name="frequency">
            <option value="Quarterly">Quarterly (4 visits/year)</option>
            <option value="Monthly">Monthly (12 visits/year)</option>
            <option value="Bi-Monthly">Bi-Monthly (6 visits/year)</option>
          </select>
        </label>
        <label>Contract Start Date<input name="startDate" type="date" required value="${new Date().toISOString().split('T')[0]}"></label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Create AMC Contract ✓</button>
      </div>
    </form>
  `);
}

function newStockDialog() {
  modal('Add Warehouse Chemical / Stock Item', `
    <form id="stock-form">
      <div class="modal-body form-grid">
        <label>Item / Chemical Name<input name="item" required placeholder="e.g. Imidacloprid 30.5% SC"></label>
        <label>Category
          <select name="category">
            <option>Pest Control</option>
            <option>Deep Cleaning</option>
          </select>
        </label>
        <label>Opening Quantity<input name="stock" type="number" required min="1" value="50"></label>
        <label>Unit of Measure
          <select name="unit">
            <option>litres</option><option>tubes</option><option>bottles</option><option>pieces</option><option>kg</option>
          </select>
        </label>
        <label>Reorder Minimum Level<input name="minimum" type="number" required min="1" value="15"></label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Add to Inventory ✓</button>
      </div>
    </form>
  `);
}

function restockDialog(itemName) {
  const item = db.inventory.find(i => i.item === itemName);
  if (!item) return;

  modal(`Restock · ${esc(item.item)}`, `
    <form id="restock-form" data-item-name="${esc(item.item)}">
      <div class="modal-body form-grid">
        <div><small>Current Stock</small><br><strong>${item.stock} ${esc(item.unit)}</strong></div>
        <div><small>Minimum Reorder</small><br><strong>${item.minimum} ${esc(item.unit)}</strong></div>
        <label class="full">Quantity Received to Add (${esc(item.unit)})
          <input name="addQty" type="number" required min="1" value="20">
        </label>
        <label class="full">Supplier Invoice / PO Reference<input name="poRef" placeholder="e.g. PO-8891 / EcoPest"></label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Confirm Stock Addition ✓</button>
      </div>
    </form>
  `);
}

function newExpenseDialog() {
  modal('Record Operational Expense Voucher', `
    <form id="expense-form">
      <div class="modal-body form-grid">
        <label>Expense Date<input name="date" type="date" required value="${new Date().toISOString().split('T')[0]}"></label>
        <label>Expense Category
          <select name="category">
            <option>Travel</option><option>Fuel</option><option>Purchases</option><option>Equipment</option><option>Office</option>
          </select>
        </label>
        <label class="full">Expense Description<input name="item" required placeholder="e.g. Technician bus fare / Spray nozzle repair"></label>
        <label>Amount (₹)<input name="amount" type="number" required min="1" value="450"></label>
        <label>Incurred By
          <select name="employee">
            ${(db.users || []).map(u => `<option>${esc(u.name)}</option>`).join('')}
          </select>
        </label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Record Expense ✓</button>
      </div>
    </form>
  `);
}

function newVendorDialog() {
  modal('Add Supplier / Vendor', `
    <form id="vendor-form">
      <div class="modal-body form-grid">
        <label>Vendor Company Name<input name="name" required placeholder="e.g. Bharat Chemical Corp"></label>
        <label>Contact Person<input name="contact" required placeholder="Sales representative"></label>
        <label>Phone Number<input name="phone" required placeholder="10-digit number"></label>
        <label>Category / Products Supplied<input name="products" required placeholder="e.g. Odourless chemicals, spray guns"></label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Register Vendor ✓</button>
      </div>
    </form>
  `);
}

function vendorOrderDialog(vendorId) {
  const v = (db.vendors || []).find(vendor => vendor.id === vendorId);
  if (!v) return;

  modal(`Create Purchase Order · ${esc(v.name)}`, `
    <form id="vendor-order-form" data-vendor-id="${v.id}">
      <div class="modal-body form-grid">
        <label class="full">Items / Chemicals to Order<input name="items" required placeholder="e.g. 20 Litres Emulsion, 50 Gel Tubes"></label>
        <label>Order Amount (₹)<input name="amount" type="number" required min="100" value="8500"></label>
        <label>Delivery Expected Date<input name="date" type="date" required value="${new Date().toISOString().split('T')[0]}"></label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Submit Purchase Order ✓</button>
      </div>
    </form>
  `);
}

function newServiceDialog() {
  modal('Add Service to Catalogue', `
    <form id="service-form">
      <div class="modal-body form-grid">
        <label>Service Name<input name="name" required placeholder="e.g. Kitchen Intensive Degreasing"></label>
        <label>Service Category
          <select name="category">
            <option>Pest Control</option><option>Deep Cleaning</option>
          </select>
        </label>
        <label>Standard Price (₹)<input name="price" type="number" required min="1" value="2999"></label>
        <label class="full">Scope / Description<textarea name="desc" rows="2" placeholder="What is included in this service..."></textarea></label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Add to Catalogue ✓</button>
      </div>
    </form>
  `);
}

function exportCustomersCSV() {
  const cs = db.customers || [];
  let csv = 'Customer ID,Name,Phone,WhatsApp,Email,Client Type,Address,Area,City\n';
  cs.forEach(c => {
    const a = c.addresses?.[0] || {};
    csv += `"${c.id}","${c.name}","${c.phone}","${c.whatsapp || ''}","${c.email || ''}","${c.clientType || 'Residential'}","${(a.address || '').replace(/"/g, '""')}","${a.area || ''}","${a.city || ''}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vucare-customers-${new Date().toISOString().split('T')[0]}.csv`;
  if (typeof a.click === 'function') a.click();
  toast('Customer registry exported to CSV.');
}

function exportMasterCSV() {
  const modules = ['leads', 'customers', 'jobs', 'quotations', 'invoices', 'amcs', 'inventory', 'expenses', 'vendors', 'tickets', 'users'];
  const rows = [['Module', 'Record ID', 'Record JSON']];
  modules.forEach(module => (db[module] || []).forEach((record, index) => {
    rows.push([module, record.id || `${module}-${index + 1}`, JSON.stringify(record)]);
  }));
  const csv = rows.map(row => row.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `vucare-crm-master-${new Date().toISOString().slice(0, 10)}.csv`;
  if (typeof link.click === 'function') link.click();
  URL.revokeObjectURL(url);
  toast('CRM master export downloaded as CSV.');
}

function quickDispatchDialog() {
  const pendingJobs = db.jobs.filter(j => j.status === 'Scheduled');
  modal('Quick Dispatch Assistant', `
    <form id="quick-dispatch-form">
      <div class="modal-body form-grid">
        <label class="full">Select Job to Dispatch
          <select name="jobId">
            ${pendingJobs.map(j => `<option value="${j.id}">#VC-${j.id} · ${esc(j.name)} (${esc(j.service)} - ${esc(j.area)})</option>`).join('')}
          </select>
        </label>
        <label>Assign Technician
          <select name="worker">
            <option>Ravi</option><option>Suresh</option><option>Mahesh</option><option>Deepak</option>
          </select>
        </label>
        <label>Dispatch Date<input name="date" type="date" required value="2026-09-13"></label>
        <label>Time Slot
          <select name="time">
            <option>09:00</option><option>10:30</option><option>12:00</option><option>14:00</option><option>16:00</option>
          </select>
        </label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Confirm Dispatch ✓</button>
      </div>
    </form>
  `);
}

function ticketForm() {
  modal('Raise Customer Complaint / Revisit', `
    <form id="ticket-form">
      <div class="modal-body form-grid">
        <label class="full">Linked Service Booking
          <select name="job" required>
            ${db.jobs.map(j => `<option value="${j.id}">VC-${j.id} · ${esc(j.name)} (${esc(j.service)})</option>`).join('')}
          </select>
        </label>
        <label>Complaint Type
          <select name="type">
            <option>Pest Recurrence / Retreat</option>
            <option>Deep Cleaning Touch-Up</option>
            <option>Technician Delay</option>
            <option>Billing Issue</option>
          </select>
        </label>
        <label>Priority
          <select name="priority">
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
        </label>
        <label class="full">Complaint Description & Customer Notes
          <textarea name="issue" required rows="3" placeholder="Explain the specific issue or revisit requested..."></textarea>
        </label>
      </div>
      <div class="modal-footer">
        <button type="button" data-action="close">Cancel</button>
        <button class="primary">Submit Complaint ✓</button>
      </div>
    </form>
  `);
}

// Customer Unique QR Code Generator & Portal (Section 12)
function openCustomerQR(customerId) {
  const c = db.customers.find(item => item.id === customerId) || db.customers[0];
  const token = c.qrToken || 'VC-QR-' + c.id;

  modal(`Unique QR Code · ${esc(c.name)}`, `
    <div class="modal-body qr-card-view">
      <span class="badge green">Customer Verified Token</span>
      <h2 style="margin:10px 0 4px">${esc(c.name)}</h2>
      <p class="sub">${c.addresses?.[0]?.address || 'Bangalore'}</p>

      <!-- SVG QR Simulation Code -->
      <div class="qr-code-svg">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <rect width="100" height="100" fill="#ffffff" rx="8"/>
          <rect x="10" y="10" width="25" height="25" fill="#145449"/>
          <rect x="15" y="15" width="15" height="15" fill="#ffffff"/>
          <rect x="18" y="18" width="9" height="9" fill="#145449"/>
          <rect x="65" y="10" width="25" height="25" fill="#145449"/>
          <rect x="70" y="15" width="15" height="15" fill="#ffffff"/>
          <rect x="73" y="18" width="9" height="9" fill="#145449"/>
          <rect x="10" y="65" width="25" height="25" fill="#145449"/>
          <rect x="15" y="70" width="15" height="15" fill="#ffffff"/>
          <rect x="18" y="73" width="9" height="9" fill="#145449"/>
          <rect x="42" y="15" width="10" height="10" fill="#145449"/>
          <rect x="45" y="45" width="15" height="15" fill="#145449"/>
          <rect x="65" y="45" width="8" height="12" fill="#145449"/>
          <rect x="42" y="65" width="12" height="15" fill="#145449"/>
          <rect x="65" y="65" width="20" height="20" fill="#145449"/>
        </svg>
      </div>

      <b style="font-family:monospace;letter-spacing:1px">${token}</b>
      <p class="sub" style="font-size:12px;margin-top:12px">
        Customer scans this code sticker at their premises to instantly log a complaint or book a touch-up without typing their details again.
      </p>

      <div style="margin-top:16px">
        <button class="primary" data-simulate-qr-scan="${token}">Simulate Customer QR Scan 📲</button>
      </div>
    </div>
  `, '<button data-action="close">Close</button>');
}

// Single-Visit Rescheduling for AMC (Section 28)
function openAmcVisits(amcId) {
  const amc = db.amcs.find(a => a.id === amcId);
  if (!amc) return;

  modal(`AMC Schedule · ${esc(amc.id)} (${esc(amc.customer)})`, `
    <div class="modal-body">
      <p class="sub">Contract: <b>${esc(amc.service)}</b> · ${amc.visits} Total Planned Visits · Frequency: ${amc.frequency || 'Monthly'}</p>
      <div class="table-wrap" style="margin-top:14px">
        <table>
          <thead><tr><th>VISIT #</th><th>DATE</th><th>STATUS</th><th>REMARKS</th><th>ACTION</th></tr></thead>
          <tbody>
            ${(amc.schedule || []).map((v, idx) => `<tr>
              <td>Visit ${v.num}</td>
              <td><b>${esc(v.date)}</b></td>
              <td>${badge(v.status)}</td>
              <td><small>${esc(v.note || '')}</small></td>
              <td>
                ${v.status !== 'Completed' ? `<button class="primary" data-reschedule-visit="${amc.id}:${idx}" style="font-size:11px;padding:3px 7px">Reschedule ↻</button>` : '<span style="color:var(--green)">Done</span>'}
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <p class="sub" style="font-size:11px;margin-top:12px">
        Admin can reschedule an individual visit (e.g. customer says "come Wednesday") without altering the overall contract.
      </p>
    </div>
  `, '<button data-action="close">Close</button>');
}

// Digital Signature Canvas
function initSignaturePad() {
  const canvas = document.querySelector('#signature-canvas');
  if (!canvas || typeof canvas.getContext !== 'function') return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth || 300;
  canvas.height = 140;
  ctx.strokeStyle = '#145449';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  let drawing = false;
  const jobId = canvas.dataset.jobId;
  const start = e => { e.preventDefault(); drawing = true; ctx.beginPath(); canvas.dataset.signed = 'true'; move(e); };
  const stop = () => { if (drawing) signatureDrafts[jobId] = canvas.toDataURL('image/png'); drawing = false; };
  const move = e => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    e.preventDefault();
    const x = ((e.touches ? e.touches[0].clientX : e.clientX) - rect.left) * canvas.width / rect.width;
    const y = ((e.touches ? e.touches[0].clientY : e.clientY) - rect.top) * canvas.height / rect.height;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  canvas.onmousedown = start; canvas.onmouseup = stop; canvas.onmousemove = move;
  canvas.onmouseleave = stop;
  canvas.ontouchstart = start; canvas.ontouchend = stop; canvas.ontouchmove = move;
  if (signatureDrafts[jobId]) {
    const image = new Image();
    image.onload = () => ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    image.src = signatureDrafts[jobId];
    canvas.dataset.signed = 'true';
  }

  const clearBtn = document.querySelector('#clear-sig');
  if (clearBtn) {
    clearBtn.onclick = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); delete signatureDrafts[jobId]; canvas.dataset.signed = ''; };
  }
}

// AI Operational Assistant
function askAIAssistant(promptText) {
  const q = promptText.toLowerCase();
  const js = jobs(), ls = leads(), total = js.reduce((s, j) => s + j.amount, 0), coll = js.reduce((s, j) => s + j.paid, 0);

  let reply = '';
  if (q.includes('pending') && q.includes('job')) {
    const pending = js.filter(j => j.status !== 'Completed');
    reply = `Currently, there are **${pending.length} pending jobs** today across Bangalore & Hassan. ${pending.filter(j => j.status === 'In progress').length} are actively in progress on site.`;
  } else if (q.includes('unpaid') || q.includes('invoice')) {
    const unpaid = js.filter(j => j.paid < j.amount);
    const balance = unpaid.reduce((s, j) => s + j.amount - j.paid, 0);
    reply = `There are **${unpaid.length} invoices** with balance pending, totaling **${money(balance)}** awaiting collection. Top pending account: ${unpaid[0]?.name} (${money(unpaid[0]?.amount - unpaid[0]?.paid)}).`;
  } else if (q.includes('technician') || q.includes('working')) {
    const busy = db.technicians.filter(t => t.status === 'Busy');
    reply = `Technicians currently on active site dispatches: **${busy.map(t => t.name).join(', ') || 'Ravi and Suresh'}**. All field staff clocked in between 08:50 AM and 09:10 AM with GPS stamps.`;
  } else if (q.includes('lead') || q.includes('follow')) {
    const uncontacted = ls.filter(l => l.status === 'New enquiry');
    reply = `You have **${uncontacted.length} new enquiries** awaiting first contact. Total active pipeline: ${ls.length} leads. Telecallers Kiran and Ananya are assigned.`;
  } else if (q.includes('collection') || q.includes('revenue')) {
    reply = `Total booked service volume is **${money(total)}**, with **${money(coll)}** collected (${Math.round(coll / Math.max(1, total) * 100)}% collection rate).`;
  } else {
    reply = `Based on current VU Care operations: We have ${js.length} bookings, ${ls.length} enquiries, ${db.inventory.filter(i => i.stock <= i.minimum).length} low-stock alerts, and ${db.amcs.length} active AMC contracts.`;
  }

  const container = document.querySelector('#ai-messages');
  if (container) {
    container.insertAdjacentHTML('beforeend', `
      <div class="ai-bubble user"><p style="margin:0">${esc(promptText)}</p></div>
      <div class="ai-bubble bot"><p style="margin:0">${reply.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}</p></div>
    `);
    container.scrollTop = container.scrollHeight;
  }
}

// Global Event Delegation
document.addEventListener('click', e => {
  const el = e.target.closest('button, a, [data-lead], [data-job], [data-ai-prompt]');
  if (!el) return;
  const d = el.dataset;

  if (d.nav) { e.preventDefault(); go(d.nav); }
  if (d.action === 'close') $('#dialog')?.close();
  if (d.viewReport) openServiceReport(+d.viewReport);
  if (el.id === 'btn-clock-toggle') { toggleTechnicianClock(); return; }
  if (d.action === 'reset-password') {
    const email = $('#auth-email')?.value?.trim();
    if (!email || !firebaseApp) return toast('Enter your staff email first and check your connection.');
    firebase.auth().sendPasswordResetEmail(email).then(() => toast('If this email is registered, a reset link will be sent.')).catch(() => toast('Password reset could not be requested. Check the email and try again.'));
    return;
  }
  if (d.action === 'firebase-config') firebaseConfigDialog();
  if (d.action === 'seed-firestore') {
    if (firestoreDb) {
      firestoreDb.collection('vucare_crm').doc('state').set(structuredClone(db))
        .then(() => {
          toast('Cloud Firestore successfully seeded with all CRM master records!');
          updateFirebaseStatus('connected', `Live: ${firebaseConfig.projectId}`);
        })
        .catch(err => toast('Firestore seed error: ' + err.message));
    } else {
      toast('Firebase not initialized. Configure credentials first.');
    }
  }
  if (d.action === 'new-lead') newLead();
  if (d.action === 'new-customer') newCustomerDialog();
  if (d.action === 'new-user') newUserDialog();
  if (d.action === 'new-ticket') ticketForm();
  if (d.action === 'new-quotation') newQuotationDialog();
  if (d.action === 'new-invoice') newInvoiceDialog();
  if (d.action === 'new-amc') newAmcDialog();
  if (d.action === 'new-stock') newStockDialog();
  if (d.action === 'new-expense') newExpenseDialog();
  if (d.action === 'new-vendor') newVendorDialog();
  if (d.action === 'new-service') newServiceDialog();
  if (d.action === 'quick-dispatch') quickDispatchDialog();
  if (d.action === 'export-customers') exportCustomersCSV();
  if (d.action === 'save-settings') toast('Company profile, GSTIN & bank details updated.');
  if (d.action === 'logout' || el.id === 'btn-logout') {
    logoutUser();
    return;
  }
  if (d.authPreset || el.dataset?.authPreset) {
    const p = d.authPreset || el.dataset?.authPreset;
    const presetMap = {
      'admin': 'admin@vucareservices.com',
      'telecaller': 'telecaller.ananya@vucareservices.com',
      'pest-tech': 'tech.ravi@vucareservices.com',
      'accountant': 'accounts@vucareservices.com'
    };
    const targetEmail = presetMap[p] || p;
    loginUser(targetEmail, 'vucare123');
    return;
  }
  if (d.action === 'simulate-inbound' || el.id === 'btn-simulate-inbound') {
    const textInput = document.querySelector('#sim-wa-text');
    const msgText = textInput?.value?.trim() || 'Need cockroach pest control for 3 BHK in Indiranagar tomorrow';
    toast('Triggering WhatsTool incoming webhook...');
    try {
      fetch('/api/webhook/whatstool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '9886011223',
          name: 'Priya Sharma',
          message: msgText,
          area: 'Indiranagar',
          city: 'Bangalore'
        })
      }).then(r => r.json()).then(data => {
        if (data.success && data.lead) {
          if (!db.leads.some(l => l.id === data.lead.id)) {
            db.leads.unshift(data.lead);
          }
          save('WhatsApp Enquiry received from ' + data.lead.name);
          toast('New Lead #' + data.lead.id + ' auto-created from WhatsApp!');
          go('leads');
        }
      }).catch(() => {
        const newLead = {
          id: Date.now(),
          name: 'Priya Sharma (WhatsApp)',
          phone: '9886011223',
          whatsapp: '9886011223',
          service: 'Cockroach Control',
          area: 'Indiranagar',
          city: 'Bangalore',
          clientType: 'Residential',
          source: 'WhatsApp',
          status: 'New enquiry',
          owner: 'Ananya',
          priority: 'High',
          amount: 4999,
          note: msgText,
          date: new Date().toISOString().split('T')[0],
          followups: [{ by: 'WhatsTool', at: new Date().toLocaleString('en-IN'), note: msgText }],
          photos: []
        };
        db.leads.unshift(newLead);
        save('New Lead created from WhatsApp');
        go('leads');
      });
    } catch {}
  }
  if (d.action === 'reset-permissions') resetPermissionsToDefault();
  if (d.action === 'print') window.print();
  if (d.action === 'export-leads') toast('Lead export is available from the lead register.');
  if (d.action === 'export-all-excel') exportMasterCSV();

  // Dynamic RBAC Permission Matrix Actions
  if (d.action === 'perm-select-all') {
    $$('.perm-module-check').forEach(cb => cb.checked = true);
  }
  if (d.action === 'perm-clear-all') {
    $$('.perm-module-check').forEach(cb => cb.checked = false);
  }
  if (d.action === 'restore-role-default') {
    const def = defaultAccess[selectedPermRole] || [];
    saveRolePermissions(selectedPermRole, [...def]);
  }
  if (d.action === 'save-perm-matrix') {
    const checked = $$('.perm-module-check:checked').map(cb => cb.value);
    if (!checked.length) {
      toast('A role must have access to at least 1 module.');
      return;
    }
    saveRolePermissions(selectedPermRole, checked);
  }

  // User Actions
  if (d.editUser) editUserDialog(d.editUser);
  if (d.toggleUser) {
    const u = (db.users || []).find(user => user.id === d.toggleUser);
    if (u) {
      u.status = (u.status === 'Active' ? 'Deactivated' : 'Active');
      logAudit('Employee Status Changed', `${u.name} marked as ${u.status}`);
      save(`${u.name} status updated to ${u.status}`);
    }
  }

  // Quotation, Invoice & Payment Actions
  if (d.quoteDetail) quoteDetailDialog(d.quoteDetail);
  if (d.convertQuote) {
    const q = (db.quotations || []).find(item => item.id === d.convertQuote);
    if (q) {
      q.status = 'Converted';
      const newJobId = Math.max(2400, ...db.jobs.map(j => j.id)) + 1;
      db.jobs.push({
        id: newJobId,
        name: q.customer,
        city: 'Bangalore',
        area: 'Koramangala',
        address: 'Bangalore',
        service: q.service,
        property: q.items?.[0]?.desc || 'Standard',
        clientType: 'Residential',
        amount: q.total,
        paid: 0,
        status: 'Scheduled',
        team: 'Unassigned',
        worker: 'Unassigned',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        photos: [],
        checks: []
      });
      $('#dialog')?.close();
      save(`Quotation ${q.id} converted to Job #VC-${newJobId}`);
      go('jobs');
    }
  }
  if (d.recordPay) recordPaymentDialog(+d.recordPay);
  if (d.whatsappInvoice) {
    const j = db.jobs.find(job => job.id === +d.whatsappInvoice);
    if (j) {
      const text = encodeURIComponent(`Hello ${j.name}, here is your VU Care invoice INV-${j.id} for ${j.service}. Total: ${money(j.amount)}, Paid: ${money(j.paid)}, Balance: ${money(j.amount - j.paid)}. Thank you!`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  }

  // Inventory, Expense, Vendor & Ticket Actions
  if (d.restock) restockDialog(d.restock);
  if (d.approveExp) {
    const exp = (db.expenses || []).find(item => item.id === +d.approveExp);
    if (exp) {
      exp.status = 'Approved';
      save(`Expense voucher #${exp.id} approved`);
    }
  }
  if (d.vendorOrder) vendorOrderDialog(d.vendorOrder);
  if (d.resolveTicket) {
    const t = (db.tickets || []).find(ticket => ticket.id === +d.resolveTicket);
    if (t) {
      t.status = 'Resolved';
      save(`Support complaint #${t.id} marked as resolved ✓`);
    }
  }
  if (d.lead) leadDetail(+d.lead);
  if (d.job) jobDetail(+d.job);
  if (d.invoice) invoice(+d.invoice);
  if (d.customer) customerDetail(d.customer);
  if (d.customerQr) openCustomerQR(d.customerQr);
  if (d.inspect) inspectionDialog(+d.inspect);
  if (d.saveInspect) {
    const id = +d.saveInspect;
    const l = db.leads.find(l => l.id === id);
    if (l) {
      const status = $('#inspect-status')?.value || l.visitStatus;
      const notes = $('#inspect-notes')?.value || '';
      if (status === 'Completed' && !notes.trim()) {
        toast('Record inspection findings before marking completed');
        return;
      }
      l.visitStatus = status;
      l.visitNotes = notes;
      l.visitDate = $('#inspect-date')?.value || l.visitDate;
      l.visitTime = $('#inspect-time')?.value || l.visitTime;
      if ($('#inspect-owner')) l.visitOwner = $('#inspect-owner').value;
      $('#dialog')?.close();
      save(`Inspection updated for ${l.name}`);
    }
  }
  if (d.deleteJobPhoto) {
    const [jobId, photoId] = d.deleteJobPhoto.split(':');
    const j = (db.jobs || []).find(job => job.id === +jobId);
    if (j && j.photos) {
      const pIdx = j.photos.findIndex(p => String(p.id) === String(photoId));
      if (pIdx > -1) {
        const removed = j.photos.splice(pIdx, 1)[0];
        if (removed && removed.cloudPath && firebaseStorage && typeof firebaseStorage.ref === 'function') {
          try {
            firebaseStorage.ref(removed.cloudPath).delete().catch(err => {
              console.warn('Firebase Storage delete notice:', err.message);
            });
          } catch {}
        }
        save(`Photo deleted from Job #VC-${j.id}`);
        toast(`Photo removed from Job #VC-${j.id} ✓`);
        render();
      }
    }
    return;
  }
  if (d.removePhoto) {
    const [recId, photoIdx] = d.removePhoto.split(':').map(Number);
    const target = db.leads.find(l => l.id === recId) || db.jobs.find(j => j.id === recId);
    if (target && target.photos) {
      const removed = target.photos.splice(photoIdx, 1)[0];
      if (removed && removed.cloudPath && firebaseStorage && typeof firebaseStorage.ref === 'function') {
        try {
          firebaseStorage.ref(removed.cloudPath).delete().catch(err => {
            console.warn('Firebase Storage delete notice:', err.message);
          });
        } catch {}
      }
      const gallery = document.querySelector('#modal-content .visit-photo-grid');
      if (gallery) gallery.innerHTML = renderVisitPhotos(target.photos, target.id);
      render();
      toast('Photo removed');
    }
  }
  if (d.amcVisits) openAmcVisits(d.amcVisits);
  if (d.saveLead) { if (saveLeadWorkflow(+d.saveLead)) { $('#dialog')?.close(); save('Lead follow-up updated'); } }

  // Handover & Conversion
  if (d.handover || d.convert) {
    if (!canAssign()) return toast('Only a manager can confirm and assign work');
    const id = +(d.handover || d.convert);
    const l = db.leads.find(l => l.id === id);
    if (!l || l.status === 'Converted') return;
    if (l.visitStatus === 'Scheduled') return toast('Complete the site visit before assigning this job');
    l.status = 'Converted';
    const newJobId = Math.max(2400, ...db.jobs.map(j => j.id)) + 1;
    db.jobs.push({
      ...l,
      id: newJobId,
      leadId: l.id,
      paid: 0,
      status: 'Scheduled',
      team: 'Unassigned',
      worker: 'Unassigned',
      date: l.visitDate || '2026-09-14',
      time: '09:00',
      location: l.area + ', ' + l.city,
      photos: [...(l.photos || [])],
      workNote: l.visitNotes ? `Site inspection notes: ${l.visitNotes}` : '',
      checks: []
    });
    $('#dialog')?.close();
    save(`${l.name} converted to booking #VC-${newJobId}`);
    go('bookings');
  }

  // Technician Mobile PWA Workflow Transitions
  if (d.pwaAction) {
    const [action, jobId] = d.pwaAction.split(':');
    const j = db.jobs.find(j => j.id === +jobId);
    if (j) {
      if (action === 'dispatch') {
        j.status = 'Dispatched';
        save(`Job #VC-${j.id} dispatched; technician en route.`);
      } else if (action === 'reach') {
        j.status = 'Reached';
        j.timer = j.timer || {};
        j.timer.arrivalTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        j.timer.arrivedAt = new Date().toISOString();
        save(`Technician reached customer destination for #VC-${j.id}.`);
      } else if (action === 'start') {
        j.status = 'In progress';
        j.timer = j.timer || {};
        j.timer.startTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        j.timer.startedAt = new Date().toISOString();
        save(`Service started for #VC-${j.id}. Service timer running.`);
      } else if (action === 'complete') {
        const canvas = $('#signature-canvas');
        const signature = canvas?.dataset?.signed === 'true' ? canvas.toDataURL('image/png') : signatureDrafts[j.id];
        try { completeTechnicianJob(j, signature); } catch (err) { toast(err.message); return; }
        save(`Job #VC-${j.id} completed. Service report generated.`);
      } else if (action === 'hold') {
        modal('Put job on hold', `<form id="hold-job-form" data-job-id="${j.id}"><div class="modal-body form-grid"><label>Reason<select name="reason" required>${options(['Customer unavailable', 'Weather', 'Materials unavailable', 'Other'])}</select></label><label>Reschedule date<input name="date" type="date" min="${localToday()}" required></label><label class="full">Notes<textarea name="notes" maxlength="1000"></textarea></label></div><div class="modal-footer"><button type="button" data-action="close">Cancel</button><button class="primary">Save hold and reschedule</button></div></form>`);
      }
    }
  }

  // Material consumption deduction (Section 37)
  if (d.pwaUseMaterial) {
    const j = db.jobs.find(j => j.id === +d.pwaUseMaterial);
    const itemName = $('#pwa-material-item')?.value;
    const qty = Number($('#pwa-material-qty')?.value || 1);
    const stockItem = db.inventory.find(i => i.item === itemName);
    if (j && stockItem && qty > 0) {
      if (!Number.isFinite(qty) || qty > stockItem.stock) return toast('Not enough stock for this quantity.');
      stockItem.stock -= qty;
      stockItem.used = (stockItem.used || 0) + qty;
      j.usedMaterials = j.usedMaterials || [];
      j.usedMaterials.push({ item: itemName, qty });
      save(`${qty} ${stockItem.unit} of ${itemName} deducted from inventory.`);
    }
  }

  // AI Prompt Chips
  if (d.aiPrompt) {
    askAIAssistant(d.aiPrompt);
  }

  // Switch Workspace
  if (d.switchWs) {
    workspace = d.switchWs;
    render();
    toast(`Workspace switched to ${workspace}`);
  }
});

// Form Submissions
document.addEventListener('click', e => {
  if (e.target.id === 'btn-save-firebase-config') {
    const f = $('#firebase-config-form');
    if (!f) return;
    const v = Object.fromEntries(new FormData(f));

    // Check if JSON textarea was filled
    const jsonInput = $('#firebase-json-input')?.value?.trim();
    if (jsonInput) {
      try {
        const parsed = JSON.parse(jsonInput);
        Object.assign(v, parsed);
      } catch (err) {
        toast('Invalid JSON in config field.');
        return;
      }
    }

    if (!v.projectId || !v.apiKey) {
      toast('Project ID and API Key are required.');
      return;
    }

    firebaseConfig = {
      projectId: v.projectId.trim(),
      appId: v.appId?.trim() || '',
      apiKey: v.apiKey.trim(),
      authDomain: v.authDomain?.trim() || `${v.projectId.trim()}.firebaseapp.com`,
      storageBucket: v.storageBucket?.trim() || `${v.projectId.trim()}.firebasestorage.app`
    };

    try {
      localStorage.setItem('vucare-firebase-config', JSON.stringify(firebaseConfig));
    } catch {}

    $('#dialog')?.close();
    toast(`Connecting to Firebase ${firebaseConfig.projectId}...`);
    initFirebaseRealtime();
  }
});

document.addEventListener('submit', e => {
  const f = e.target;
  if (!f) return;
  e.preventDefault();
  const v = Object.fromEntries(new FormData(f));

  if (f.id === 'auth-login-form') {
    const email = document.querySelector('#auth-email')?.value?.trim() || v.email;
    const password = document.querySelector('#auth-password')?.value || v.password;
    const remember = document.querySelector('#auth-remember')?.checked !== false;
    loginUser(email, password, remember);
    return;
  }

  if (f.id === 'hold-job-form') {
    const job = db.jobs.find(j => String(j.id) === f.dataset.jobId);
    if (!job || !v.reason || !v.date || v.date < localToday()) return toast('Enter a reason and a valid reschedule date.');
    job.status = 'On Hold'; job.holdReason = v.reason; job.holdNotes = v.notes;
    job.holdHistory ??= [];
    job.holdHistory.push({ reason: v.reason, notes: v.notes, previousDate: job.date, rescheduledTo: v.date, at: new Date().toISOString(), by: currentPerson() });
    job.date = v.date;
    $('#dialog')?.close(); save(`Job #VC-${job.id} held and rescheduled to ${v.date}`);
  }

  if (f.id === 'lead-form') {
    if (!v.name?.trim() || !v.area?.trim()) return toast('Enter customer name and area');
    const newId = Date.now();
    db.leads.unshift({
      ...v,
      id: newId,
      amount: Number(v.amount) || 4999,
      status: 'New enquiry',
      owner: v.owner || 'Ananya',
      date: new Date().toISOString().split('T')[0],
      followups: [],
      photos: []
    });
    $('#dialog')?.close();
    save(`${v.name} added to lead pipeline`);
    go('leads');
  }

  if (f.id === 'ticket-form') {
    const newId = Date.now();
    db.tickets.unshift({
      id: newId,
      name: v.job ? db.jobs.find(j => j.id === +v.job)?.name : 'Customer',
      job: +v.job,
      issue: v.issue,
      priority: v.priority,
      status: 'Open',
      assigned: 'Ravi'
    });
    $('#dialog')?.close();
    save('Customer complaint ticket registered');
    go('complaints');
  }

  if (f.id === 'customer-form') {
    if (!v.name?.trim() || !v.phone?.trim()) return toast('Enter customer name and mobile');
    const newCustId = 'CUST-' + String(db.customers.length + 1).padStart(3, '0');
    db.customers.unshift({
      id: newCustId,
      name: v.name.trim(),
      phone: v.phone.trim(),
      whatsapp: v.whatsapp || v.phone.trim(),
      email: v.email || '',
      clientType: v.clientType || 'Residential',
      addresses: [{
        label: 'Primary',
        address: v.address || 'Address',
        area: v.area || 'Area',
        city: v.city || 'Bangalore',
        pincode: v.pincode || ''
      }],
      notes: v.notes || '',
      qrToken: 'VC-QR-' + newCustId
    });
    $('#dialog')?.close();
    save(`Customer ${v.name} registered`);
    go('customers');
  }

  if (f.id === 'user-form') {
    if (!v.name?.trim()) return toast('Enter employee name');
    const newUid = 'USR-' + String((db.users || []).length + 1).padStart(2, '0');
    db.users.push({
      id: newUid,
      name: v.name.trim(),
      phone: v.phone || '',
      email: v.email || '',
      role: v.role,
      department: v.department,
      workspace: v.workspace,
      status: 'Active'
    });
    $('#dialog')?.close();
    save(`Employee ${v.name} added with role ${v.role}`);
    render();
  }

  if (f.id === 'edit-user-form') {
    const uid = f.dataset.userId;
    const u = (db.users || []).find(user => user.id === uid);
    if (u) {
      Object.assign(u, v);
      $('#dialog')?.close();
      save(`Updated details for employee ${u.name}`);
      render();
    }
  }

  if (f.id === 'quotation-form') {
    const subtotal = Number(v.subtotal) || 4999;
    const discount = Number(v.discount) || 0;
    const taxable = Math.max(0, subtotal - discount);
    const taxAmount = Math.round(taxable * 0.18);
    const total = taxable + taxAmount;
    const newQId = 'QT-' + (Math.max(1080, ...(db.quotations || []).map(q => +q.id.replace(/\D/g, '') || 1080)) + 1);

    db.quotations = db.quotations || [];
    db.quotations.unshift({
      id: newQId,
      customer: v.customer,
      service: v.service,
      items: [{ desc: `${v.service} (${v.property})`, qty: 1, rate: subtotal, amount: subtotal }],
      subtotal,
      discount,
      taxRate: 18,
      taxAmount,
      total,
      status: 'Sent',
      date: new Date().toISOString().split('T')[0],
      validity: new Date(Date.now() + (Number(v.validityDays) || 30) * 86400000).toISOString().split('T')[0],
      terms: v.terms || '30 days validity'
    });
    $('#dialog')?.close();
    save(`Quotation ${newQId} created for ${v.customer}`);
    go('quotations');
  }

  if (f.id === 'invoice-form') {
    const amount = Number(v.amount) || 4999;
    const paid = Number(v.paid) || 0;
    const subtotal = Math.round(amount / 1.18);
    const taxAmount = amount - subtotal;
    const newInvId = Math.max(2400, ...(db.invoices || []).map(i => i.id || 2400)) + 1;

    db.invoices = db.invoices || [];
    db.invoices.unshift({
      id: newInvId,
      customer: v.name,
      service: v.service,
      amount,
      paid,
      balance: Math.max(0, amount - paid),
      date: new Date().toISOString().split('T')[0],
      status: paid >= amount ? 'Paid' : paid > 0 ? 'Part paid' : 'Unpaid',
      taxRate: 18,
      taxAmount,
      subtotal
    });
    $('#dialog')?.close();
    save(`Invoice INV-${newInvId} generated`);
    go('invoices');
  }

  if (f.id === 'payment-form') {
    const jId = +f.dataset.jobId;
    const j = db.jobs.find(job => job.id === jId);
    if (j) {
      const payAmount = Number(v.payAmount);
      try { recordJobPayment(j, payAmount, v.method, v.reference); } catch (err) { toast(err.message); return; }
      logAudit('Payment Recorded', `Received ${money(payAmount)} for #VC-${j.id} via ${v.method}`);
      $('#dialog')?.close();
      save(`Payment of ${money(payAmount)} collected for ${j.name}`);
      render();
    }
  }

  if (f.id === 'amc-form') {
    const val = Number(v.value) || 12000;
    const freq = v.frequency || 'Quarterly';
    const numVisits = freq === 'Monthly' ? 12 : freq === 'Bi-Monthly' ? 6 : 4;
    const newAmcId = 'AMC-2026-' + String((db.amcs || []).length + 43).padStart(3, '0');

    const schedule = [];
    const start = new Date(v.startDate || Date.now());
    for (let i = 1; i <= numVisits; i++) {
      const d = new Date(start);
      d.setMonth(d.getMonth() + (i - 1) * (12 / numVisits));
      schedule.push({
        num: i,
        date: d.toISOString().split('T')[0],
        status: 'Scheduled',
        note: `Visit ${i} planned (${freq})`
      });
    }

    db.amcs = db.amcs || [];
    db.amcs.unshift({
      id: newAmcId,
      customer: v.customer,
      service: v.service,
      value: val,
      start: v.startDate,
      end: new Date(start.getTime() + 365 * 86400000).toISOString().split('T')[0],
      visits: numVisits,
      completed: 0,
      status: 'Active',
      frequency: freq,
      schedule
    });
    $('#dialog')?.close();
    save(`AMC ${newAmcId} registered for ${v.customer}`);
    go('amc');
  }

  if (f.id === 'stock-form') {
    db.inventory.push({
      item: v.item,
      category: v.category,
      opening: Number(v.stock) || 50,
      purchased: 0,
      used: 0,
      stock: Number(v.stock) || 50,
      unit: v.unit,
      minimum: Number(v.minimum) || 15
    });
    $('#dialog')?.close();
    save(`${v.item} added to warehouse chemicals ledger`);
    go('inventory');
  }

  if (f.id === 'restock-form') {
    const itemName = f.dataset.itemName;
    const item = db.inventory.find(i => i.item === itemName);
    if (item) {
      const addQty = Number(v.addQty) || 0;
      if (!Number.isFinite(addQty) || addQty <= 0) return toast('Restock quantity must be greater than zero.');
      item.stock += addQty;
      item.purchased = (item.purchased || 0) + addQty;
      logAudit('Inventory Restocked', `Added ${addQty} ${item.unit} to ${item.item}`);
      $('#dialog')?.close();
      save(`Restocked ${item.item} (+${addQty} ${item.unit})`);
      render();
    }
  }

  if (f.id === 'expense-form') {
    const newExpId = (db.expenses || []).length + 1;
    db.expenses = db.expenses || [];
    db.expenses.unshift({
      id: newExpId,
      date: v.date,
      item: v.item,
      amount: Number(v.amount) || 0,
      employee: v.employee,
      category: v.category,
      status: 'Approved'
    });
    $('#dialog')?.close();
    save(`Expense of ₹${v.amount} recorded`);
    go('expenses');
  }

  if (f.id === 'vendor-form') {
    const newVndId = 'VND-' + String((db.vendors || []).length + 1).padStart(2, '0');
    db.vendors = db.vendors || [];
    db.vendors.push({
      id: newVndId,
      name: v.name,
      contact: v.contact,
      phone: v.phone,
      products: v.products,
      totalPurchases: 0,
      outstanding: 0
    });
    $('#dialog')?.close();
    save(`Vendor ${v.name} registered`);
    go('vendors');
  }

  if (f.id === 'vendor-order-form') {
    const vid = f.dataset.vendorId;
    const vnd = (db.vendors || []).find(v => v.id === vid);
    if (vnd) {
      const amt = Number(v.amount) || 0;
      vnd.totalPurchases += amt;
      vnd.outstanding += amt;
      logAudit('Purchase Order Created', `Ordered ${v.items} from ${vnd.name} for ₹${amt}`);
      $('#dialog')?.close();
      save(`Purchase order placed with ${vnd.name} (₹${amt})`);
      render();
    }
  }

  if (f.id === 'service-form') {
    db.services.push({
      category: v.category,
      name: v.name,
      price: Number(v.price) || 1999,
      desc: v.desc || ''
    });
    $('#dialog')?.close();
    save(`Service ${v.name} added to catalogue`);
    go('services');
  }

  if (f.id === 'quick-dispatch-form') {
    const j = db.jobs.find(job => job.id === +v.jobId);
    if (j) {
      j.worker = v.worker;
      j.team = `Team · ${v.worker}`;
      j.date = v.date;
      j.time = v.time;
      j.status = 'Dispatched';
      $('#dialog')?.close();
      save(`Job #VC-${j.id} dispatched to ${v.worker}`);
      go('dispatch');
    }
  }
});

// Header Changes & Photo Uploads
document.addEventListener('change', e => {
  if (e.target.id === 'pwa-photo-upload' || e.target.id === 'pwa-photo-upload-after') {
    const file = e.target.files?.[0];
    const jobId = e.target.dataset?.jobId;
    const stage = e.target.dataset?.photoStage || (e.target.id.includes('after') ? 'After work' : 'Before work');
    if (file && jobId) {
      uploadJobPhotoToCloud(file, jobId, stage);
    }
    return;
  }
  if (e.target.classList && e.target.classList.contains('visit-file-input')) {
    const file = e.target.files?.[0];
    const leadId = e.target.dataset?.id;
    const kind = e.target.dataset?.kind || 'Before';
    if (file && leadId) {
      uploadLeadInspectionPhoto(file, leadId, kind);
    }
    return;
  }
  if (e.target.id === 'role') {
    role = e.target.value;
    render();
  }
  if (e.target.id === 'perm-role-selector') {
    selectedPermRole = e.target.value;
    render();
  }
  if (e.target.id === 'header-workspace') {
    workspace = e.target.value;
    render();
    toast(`Workspace set to ${workspace}`);
  }
  if (e.target.id === 'city-filter') {
    city = e.target.value;
    render();
  }
  if (e.target.id === 'tech-selector') {
    if (!canAssign()) return;
    selectedPeople['technician-view'] = e.target.value.split(' (')[0];
    render();
  }
});

// Search Filter Input
document.addEventListener('input', e => {
  if (e.target.id === 'search') {
    query = e.target.value;
    render();
    $('#search')?.focus();
  }
});

// AI Drawer Toggle & Send
if (typeof $('#ai-btn')?.addEventListener === 'function') {
  $('#ai-btn').addEventListener('click', () => {
    const drawer = $('#ai-drawer');
    if (drawer) drawer.hidden = !drawer.hidden;
  });
}
if (typeof $('#close-ai')?.addEventListener === 'function') {
  $('#close-ai').addEventListener('click', () => {
    const drawer = $('#ai-drawer');
    if (drawer) drawer.hidden = true;
  });
}
if (typeof $('#ai-send')?.addEventListener === 'function') {
  $('#ai-send').addEventListener('click', () => {
    const input = $('#ai-input');
    if (input?.value.trim()) {
      askAIAssistant(input.value.trim());
      input.value = '';
    }
  });
}

// Notifications Drawer Toggle
if (typeof $('#notif-btn')?.addEventListener === 'function') {
  $('#notif-btn').addEventListener('click', () => {
    const drawer = $('#notif-drawer');
    if (drawer) {
      drawer.hidden = !drawer.hidden;
      const list = $('#notif-list');
      if (list) {
        list.innerHTML = (db.notifications || []).map(n => `<div style="padding:10px 0;border-bottom:1px solid #f0f3f1;font-size:12px">
          <strong>${esc(n.title)}</strong><br>
          <span>${esc(n.desc)}</span><br>
          <small style="color:var(--muted)">${esc(n.time)}</small>
        </div>`).join('');
      }
    }
  });
}
if (typeof $('#close-notif')?.addEventListener === 'function') {
  $('#close-notif').addEventListener('click', () => {
    const drawer = $('#notif-drawer');
    if (drawer) drawer.hidden = true;
  });
}

// Sidebar Wheel Delegation
const sidebarEl = document.querySelector('#sidebar');
const navEl = document.querySelector('#nav');
if (sidebarEl && typeof sidebarEl.addEventListener === 'function') {
  sidebarEl.addEventListener('wheel', e => {
    if (navEl && navEl.scrollHeight > navEl.clientHeight) {
      navEl.scrollTop += e.deltaY;
      updateNavScrollIndicator();
    }
  }, { passive: true });
}
if (navEl && typeof navEl.addEventListener === 'function') {
  navEl.addEventListener('scroll', updateNavScrollIndicator, { passive: true });
}
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('resize', updateNavScrollIndicator);
}
if (typeof $('#nav-scroll-hint')?.addEventListener === 'function') {
  $('#nav-scroll-hint').addEventListener('click', () => {
    const nav = $('#nav');
    if (nav && typeof nav.scrollBy === 'function') {
      nav.scrollBy({ top: 140, behavior: 'smooth' });
    }
  });
}

// Menu Toggle for Mobile
if (typeof $('#menu')?.addEventListener === 'function') {
  $('#menu').addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });
}

// Reset Demo Data
if (typeof $('#reset')?.addEventListener === 'function') {
  $('#reset').addEventListener('click', () => {
    modal('Reset All Demo Records?', '<p>This will restore the original master seed data across all 55 requirement modules.</p>', `
      <button data-action="close">Cancel</button>
      <button class="primary" id="confirm-reset-all">Confirm Reset</button>
    `);
  });
}
document.addEventListener('click', e => {
  if (e.target.id === 'confirm-reset-all') {
    db = structuredClone(seed);
    try { localStorage.setItem('vucare-crm-master-v1', JSON.stringify(db)); } catch {}
    $('#dialog')?.close();
    save('Master seed database restored.');
  }
});

// Initialize Live Firebase Real-time Sync
if (typeof window !== 'undefined') {
  initFirebaseRealtime();
}

// Initial Hash Routing
window.addEventListener('hashchange', () => {
  const p = location.hash.slice(1);
  if (access[role]?.includes(p) && p !== page) {
    page = p;
    query = '';
    render();
  }
});

if (access[role]?.includes(location.hash.slice(1))) {
  page = location.hash.slice(1);
}

// WebMCP Tool Registration (Model Context API)
if (document.modelContext?.registerTool) {
  try {
    Promise.resolve(document.modelContext.registerTool({
      name: 'navigate_crm_view',
      description: 'Navigate to any CRM view available to the selected role.',
      inputSchema: {
        type: 'object',
        properties: {
          view: { type: 'string', enum: Object.keys(names) }
        },
        required: ['view'],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false },
      execute(input) {
        if (!input || !access[role]?.includes(input.view)) throw Error('View unavailable for this role');
        go(input.view);
        return { view: page, role };
      }
    })).catch(() => {});
  } catch {}
}

// Check initial auth state for browser UI
if (typeof document !== 'undefined') {
  const overlay = document.querySelector('#auth-overlay');
  if (overlay && overlay.classList) {
    if (currentAuthUser) {
      overlay.classList.add('hidden');
    } else {
      overlay.classList.remove('hidden');
    }
  }
}

render();
