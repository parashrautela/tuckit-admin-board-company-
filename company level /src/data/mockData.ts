import {
  AdminSession,
  Booking,
  Terminal,
  StateCoverage,
  LockerItem,
  PESITStudent,
  PESITManager,
  RefundRequest,
  RefundTransaction,
  StaffCreditRequest,
  StaffProfile,
  PricingConfig,
  StateGSTConfig,
  UserItem,
  AdminUser,
  RoleConfig,
  AuditLog,
  AlertItem,
} from '../types';

export const initialAdminSession: AdminSession = {
  id: 'usr_superadmin_01',
  username: 'parash',
  name: 'Parash Rautela',
  email: 'parash@tuckit.in',
  role: 'SUPERADMIN',
  roleName: 'SUPERADMIN',
  permissions: ['ALL'],
  avatarUrl: '',
};

export const stateCoverageConfig: { state: string; total: number; online: number; offline: number; cities: string[] }[] = [
  { state: 'Karnataka', total: 57, online: 52, offline: 5, cities: ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'] },
  { state: 'Maharashtra', total: 28, online: 28, offline: 0, cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'] },
  { state: 'Telangana', total: 25, online: 24, offline: 1, cities: ['Hyderabad', 'Secunderabad', 'Warangal'] },
  { state: 'Uttar Pradesh', total: 22, online: 21, offline: 1, cities: ['Noida', 'Lucknow', 'Varanasi', 'Agra'] },
  { state: 'Kerala', total: 21, online: 19, offline: 2, cities: ['Kochi', 'Trivandrum', 'Calicut'] },
  { state: 'Tamil Nadu', total: 17, online: 16, offline: 1, cities: ['Chennai', 'Coimbatore', 'Madurai'] },
  { state: 'Madhya Pradesh', total: 11, online: 11, offline: 0, cities: ['Indore', 'Bhopal', 'Ujjain'] },
  { state: 'Rajasthan', total: 10, online: 10, offline: 0, cities: ['Jaipur', 'Udaipur', 'Jodhpur'] },
  { state: 'Gujarat', total: 7, online: 7, offline: 0, cities: ['Ahmedabad', 'Surat', 'Vadodara'] },
  { state: 'Odisha', total: 7, online: 6, offline: 1, cities: ['Bhubaneswar', 'Puri', 'Cuttack'] },
  { state: 'Delhi', total: 6, online: 6, offline: 0, cities: ['New Delhi', 'Connaught Place', 'Aerocity'] },
  { state: 'Goa', total: 5, online: 4, offline: 1, cities: ['Panaji', 'Calangute', 'Margao'] },
  { state: 'Himachal Pradesh', total: 5, online: 3, offline: 2, cities: ['Shimla', 'Manali', 'Dharamshala'] },
  { state: 'Andhra Pradesh', total: 4, online: 4, offline: 0, cities: ['Visakhapatnam', 'Vijayawada', 'Tirupati'] },
  { state: 'Uttarakhand', total: 4, online: 4, offline: 0, cities: ['Dehradun', 'Rishikesh', 'Haridwar'] },
  { state: 'Jharkhand', total: 3, online: 2, offline: 1, cities: ['Ranchi', 'Jamshedpur'] },
  { state: 'Punjab', total: 2, online: 2, offline: 0, cities: ['Amritsar', 'Chandigarh'] },
  { state: 'West Bengal', total: 2, online: 2, offline: 0, cities: ['Kolkata', 'Howrah'] },
  { state: 'Chhattisgarh', total: 1, online: 1, offline: 0, cities: ['Raipur'] },
  { state: 'Haryana', total: 1, online: 1, offline: 0, cities: ['Gurugram'] },
];

const siteNamesByState: Record<string, string[]> = {
  Karnataka: [
    'Orion Mall Bangalore', 'Phoenix Marketcity Whitefield', 'Forum Mall Koramangala', 'PESIT South Campus Kiosk',
    'Bangalore City Railway Station', 'Kempegowda Bus Station', 'Mantri Square Mall', 'Nexus Shantiniketan',
    'Garuda Mall Magrath Rd', 'Lulu Global Mall Rajajinagar', 'Nexus Mall Koramangala Level 1', 'Nexus Mall Koramangala Level 2',
    'Brigade Orion Gateway', 'Indiranagar Metro Station', 'MG Road Metro Hub', 'Cubbon Park Metro Plaza',
    'Mysore Central Bus Terminal', 'Mall of Mysore', 'Mysore Palace North Gate', 'Mangalore City Centre Mall',
    'Forum Fiza Mall Mangalore', 'Hubli Urban Oasis Mall', 'PESIT Ring Road Block A', 'PESIT Ring Road Block B',
    'PESIT Engineering Tech Park', 'PESIT Central Library Kiosk', 'HSR Layout BDA Complex', 'Koramangala 5th Block Kiosk',
    'Electronic City Phase 1 Plaza', 'Electronic City Phase 2 Hub', 'Bellandur EcoSpace Transit Hub', 'Whitefield ITPL Main Gate',
    'Bagmane Tech Park CV Raman Nagar', 'Manyata Tech Park Gate 1', 'Manyata Tech Park Gate 5', 'Hebbal Flyover Transit',
    'Yelahanka New Town Kiosk', 'Jayanagar 4th Block Shopping Complex', 'JP Nagar Central Mall', 'Bannerghatta Royal Meenakshi Mall',
    'Kengeri Metro Terminal', 'Majestic Metro Interchange Lower', 'Majestic Metro Interchange Upper', 'Yeshwantpur Railway Station PF 1',
    'Yeshwantpur Railway Station PF 6', 'Cantonment Station North Entry', 'KR Puram Station Skywalk', 'Marathahalli Multiplex Plaza',
    'Sarjapur Central Junction', 'Domlur TTMC Bus Station', 'Shivajinagar Bus Station Entry', 'Malleswaram 8th Cross Corner',
    'Commercial Street Main Entry', 'Brigade Road Rex Plaza', 'Church Street Metro Plaza', 'Banashankari TTMC Complex', 'PESIT South Hostel Block'
  ],
  Maharashtra: [
    'Phoenix Palladium Lower Parel', 'Inorbit Mall Malad', 'R City Mall Ghatkopar', 'Oberoi Mall Goregaon',
    'Infinity Mall Andheri', 'Viviana Mall Thane', 'Korum Mall Thane', 'Seawoods Grand Central Navi Mumbai',
    'CSMT Station Main Hall', 'Dadar Central Station PF 1', 'Bandra Terminus Departure', 'Andheri West Metro Concourse',
    'Ghatkopar Metro Hub', 'Chhatrapati Shivaji Maharaj Airport T2', 'Phoenix Marketcity Viman Nagar Pune', 'Seasons Mall Hadapsar Pune',
    'Amanora Mall Pune', 'Westend Mall Aundh Pune', 'Pune Junction Railway Station', 'Shivajinagar Bus Stand Pune',
    'Pavillion Mall SB Road Pune', 'Elpro City Square Pimpri', 'Empress City Mall Nagpur', 'Eternity Mall Nagpur',
    'Nagpur Metro Sitabuldi Interchange', 'City Centre Mall Nashik', 'Nashik Road Railway Station', 'Kashid Beach Tourist Kiosk'
  ],
  Telangana: [
    'Inorbit Mall Cyberabad', 'Sarath City Capital Mall Gachibowli', 'GVK One Mall Banjara Hills', 'Forum Sujana Mall Kukatpally',
    'Next Galleria Mall Panjagutta', 'Next Galleria Mall Irrum Manzil', 'Secunderabad Railway Station Main PF', 'Hyderabad Deccan Nampally Station',
    'Kacheguda Railway Station Entry', 'Rajiv Gandhi International Airport Arrival', 'Hitec City Metro Station', 'Raidurg Metro Terminal',
    'Ameerpet Metro Interchange', 'Jubilee Hills Checkpost Metro', 'Charminar Heritage Plaza Kiosk', 'Salargunj Museum Tourist Entry',
    'Golkonda Fort Visitor Center', 'DLF Cyber City Food Court Hub', 'Knowledge City Salarpuria Sattva', 'Mindspace Madhapur Gate 2',
    'Financial District WaveRock Kiosk', 'Kukatpally Housing Board Plaza', 'Warangal Urban Mall', 'Warangal Railway Station Entry', 'Kazipet Junction Concourse'
  ],
  'Uttar Pradesh': [
    'DLF Mall of India Noida', 'The Great India Place Sector 38 Noida', 'Gardens Galleria Mall Noida', 'Wave Mall Noida Sector 18',
    'Logix City Centre Noida Sector 32', 'Noida Electronic City Metro', 'Botanical Garden Metro Hub Noida', 'Pheonix United Mall Lucknow',
    'Lulu Mall Lucknow Sushant Golf City', 'Palassio Mall Lucknow Gomti Nagar', 'Wave Mall Gomti Nagar Lucknow', 'Charbagh Railway Station Lucknow',
    'Lucknow Metro CCS Airport Station', 'Hazratganj Metro Underground Concourse', 'Kashi Vishwanath Corridor Varanasi Gate 4', 'Varanasi Junction Cantt Station',
    'Banaras Railway Station Main Entry', 'Taj Mahal East Gate Tourist Center Agra', 'TDI Mall Fatehabad Road Agra', 'Agra Cantt Railway Station',
    'Pacific Mall Sahibabad Ghaziabad', 'Gaur Central Mall RDC Raj Nagar'
  ],
  Kerala: [
    'Lulu International Mall Edappally Kochi', 'Centre Square Mall MG Road Kochi', 'Oberon Mall NH Bypass Kochi', 'Forum Kochi Maradu',
    'Ernakulam South Railway Station', 'Ernakulam Town North Station', 'Kochi Water Metro High Court Terminal', 'Kochi Water Metro Fort Kochi Terminal',
    'Cochin International Airport Nedumbassery', 'Aluva Metro Concourse', 'MG Road Metro Station Kochi', 'Lulu Mall Thiruvananthapuram Akkulam',
    'Mall of Travancore Chacka Thiruvananthapuram', 'Thiruvananthapuram Central Railway Station', 'Technopark Phase 1 Main Gate Trivandrum', 'Technopark Phase 3 SEZ Kiosk',
    'Hilite Mall Calicut Bypass Road', 'Gokulam Galleria Mall Calicut', 'Calicut Railway Station Main Entrance', 'Varkala Cliff Promenade Kiosk', 'Munnar Town Tourist Helpdesk'
  ],
  'Tamil Nadu': [
    'Express Avenue Mall Royapettah Chennai', 'Phoenix Marketcity Velachery Chennai', 'VR Chennai Anna Nagar', 'Nexus Vijaya Mall Vadapalani Chennai',
    'Marina Mall OMR Chennai', 'Chennai Central Puratchi Thalaivar Station', 'Chennai Egmore Railway Station Concourse', 'Chennai International Airport T1',
    'Airport Metro Station Chennai', 'Chennai Central Metro Interchange', 'T Nagar Ranganathan Street Entry', 'Brookefields Mall Coimbatore',
    'Prozone Mall Saravanampatti Coimbatore', 'Coimbatore Junction Railway Station', 'Madurai Meenakshi Temple East Tower', 'Madurai Junction Railway Station', 'Tiruchirappalli Junction Main Hall'
  ],
  'Madhya Pradesh': [
    'Treasure Island Mall MG Road Indore', 'C21 Mall AB Road Indore', 'Phoenix Citadel Mall Indore Bypass', 'Indore Junction Railway Station',
    '56 Dukan Street Food Hub Indore', 'DB City Mall Hoshangabad Road Bhopal', 'Aashima The Lake City Mall Bhopal', 'Bhopal Junction Railway Station',
    'Rani Kamlapati Railway Station Concourse', 'Mahakaleshwar Temple Corridor Gate 1 Ujjain', 'Mahakaleshwar Temple Corridor Gate 3 Ujjain'
  ],
  Rajasthan: [
    'World Trade Park JLN Marg Jaipur', 'MGF Metropolitan Mall Jaipur', 'Pink Square Mall Raja Park Jaipur', 'Jaipur Junction Railway Station',
    'Sindhi Camp Bus Central Concourse Jaipur', 'Hawa Mahal Heritage Tourist Kiosk Jaipur', 'Amer Fort Visitor Facility Jaipur', 'Nexus Celebration Mall Udaipur',
    'Udaipur City Railway Station', 'Jodhpur Junction Railway Station Gate 1'
  ],
  Gujarat: [
    'Nexus Ahmedabad One Mall Vastrapur', 'Palladium Mall Thaltej Ahmedabad', 'Ahmedabad Junction Kalupur Railway Station', 'Sabarmati Riverfront Promenade Kiosk',
    'VR Surat Dumas Road', 'Surat Railway Station Main Concourse', 'Inorbit Mall Gorwa Vadodara'
  ],
  Odisha: [
    'Esplanade One Mall Rasulgarh Bhubaneswar', 'Nexus DN Regalia Mall Patrapada Bhubaneswar', 'Bhubaneswar Railway Station Master Canteen Entry', 'Bhubaneswar New Railway Station Concourse',
    'Puri Jagannath Temple Grand Road Kiosk', 'Puri Railway Station Sea Beach Concourse', 'Netaji Birthplace Museum Tourist Plaza Cuttack'
  ],
  Delhi: [
    'Select CITYWALK Saket New Delhi', 'DLF Promenade Vasant Kunj New Delhi', 'Pacific Mall Tagore Garden New Delhi',
    'Connaught Place Inner Circle Block B', 'New Delhi Railway Station Paharganj Entry', 'Indira Gandhi Airport T3 Metro Concourse'
  ],
  Goa: [
    'Mall De Goa Porvorim', 'Caculo Mall Panaji', 'Calangute Beach Promenade Hub', 'Baga Beach Tourism Kiosk', 'Madgaon Junction Railway Station'
  ],
  'Himachal Pradesh': [
    'Mall Road Shimla Ridge Plaza', 'Shimla Old Bus Stand Tourist Counter', 'Mall Road Manali Main Square', 'Manali Solang Valley Base Kiosk', 'McLeod Ganj Main Temple Road Dharamshala'
  ],
  'Andhra Pradesh': [
    'CMR Central Mall Visakhapatnam', 'Visakhapatnam Railway Station PF 1', 'PVP Square Mall Vijayawada', 'Tirupati Central Bus Station Alipiri Gate'
  ],
  Uttarakhand: [
    'Pacific Mall Rajpur Road Dehradun', 'Dehradun Railway Station Main Entry', 'Triveni Ghat Promenade Rishikesh', 'Har Ki Pauri Ghat Tourist Helpdesk Haridwar'
  ],
  Jharkhand: [
    'Mall Decore Lalpur Ranchi', 'Ranchi Junction Railway Station', 'P&M Hi-Tech City Centre Mall Jamshedpur'
  ],
  Punjab: [
    'Mall of Amritsar GT Road', 'Golden Temple Heritage Walk Plaza Amritsar'
  ],
  'West Bengal': [
    'South City Mall Prince Anwar Shah Rd Kolkata', 'Howrah Railway Station Old Complex Concourse'
  ],
  Chhattisgarh: [
    'Magneto The Mall Labhandi Raipur'
  ],
  Haryana: [
    'Ambience Mall NH-8 Gurugram'
  ]
};

// Generate 238 terminals exactly
export function generateMockTerminals(): Terminal[] {
  const terminals: Terminal[] = [];
  let globalIndex = 1;

  stateCoverageConfig.forEach(sc => {
    const sites = siteNamesByState[sc.state] || [];
    let offlineCountAssigned = 0;

    for (let i = 0; i < sc.total; i++) {
      const isOffline = offlineCountAssigned < sc.offline;
      if (isOffline) {
        offlineCountAssigned++;
      }

      const siteName = sites[i] || `${sc.state} Locker Terminal ${i + 1}`;
      const city = sc.cities[i % sc.cities.length];
      const codeNum = String(globalIndex).padStart(3, '0');
      const code = `TCK-${sc.state.substring(0, 2).toUpperCase()}-${codeNum}`;
      const locationPin = `${5000 + globalIndex}`;
      const deviceType: 'LEGACY' | 'BEST VIEW' | 'NEXTGEN' = i % 3 === 0 ? 'LEGACY' : (i % 3 === 1 ? 'BEST VIEW' : 'NEXTGEN');
      const networkType: 'LAN' | 'SIM' | 'WiFi' | 'WS' = i % 4 === 0 ? 'LAN' : (i % 4 === 1 ? 'SIM' : (i % 4 === 2 ? 'WiFi' : 'WS'));
      const siteType: Terminal['siteType'] = siteName.includes('Mall') ? 'Mall' : (siteName.includes('Railway') || siteName.includes('Station') ? 'Railway' : (siteName.includes('PESIT') || siteName.includes('Campus') ? 'Campus' : (siteName.includes('Airport') ? 'Airport' : (siteName.includes('Temple') ? 'Temple' : (siteName.includes('Metro') ? 'Metro' : 'Commercial')))));
      const lockerType: Terminal['lockerType'] = i % 5 === 0 ? 'MOBILE' : (i % 7 === 0 ? 'HYBRID' : 'BAGGAGE');
      const firmwareVersion = i % 2 === 0 ? 'v1.1.23' : 'v1.2.04';

      const heartbeatSecondsAgo = isOffline ? Math.floor(Math.random() * 3600) + 120 : Math.floor(Math.random() * 25) + 2;
      const lastHeartbeatDate = new Date(Date.now() - heartbeatSecondsAgo * 1000);
      const lastHeartbeatAt = `${lastHeartbeatDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

      const totalLockers = lockerType === 'MOBILE' ? 24 : (lockerType === 'HYBRID' ? 32 : 18);
      const occupiedLockers = isOffline ? 0 : Math.floor(totalLockers * (0.3 + Math.random() * 0.5));
      const availableLockers = totalLockers - occupiedLockers;

      terminals.push({
        id: `term_${code.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        code,
        siteName,
        state: sc.state,
        city,
        siteType,
        lockerType,
        lifecycleStatus: 'ACTIVE',
        connectivityStatus: isOffline ? 'OFFLINE' : 'ONLINE',
        networkType,
        firmwareVersion,
        deviceType,
        locationPin,
        lastHeartbeatAt,
        heartbeatSecondsAgo,
        totalLockers,
        availableLockers,
        occupiedLockers,
        ipAddress: `192.168.1.${10 + (globalIndex % 240)}`,
        tailscaleIp: `100.64.0.${globalIndex}`,
      });

      globalIndex++;
    }
  });

  return terminals;
}

export const initialTerminals: Terminal[] = generateMockTerminals();

export function calculateStateCoverage(terminals: Terminal[]): StateCoverage[] {
  const map: Record<string, StateCoverage> = {};
  terminals.forEach(t => {
    if (!map[t.state]) {
      map[t.state] = { state: t.state, total: 0, online: 0, offline: 0 };
    }
    map[t.state].total++;
    if (t.connectivityStatus === 'ONLINE') {
      map[t.state].online++;
    } else {
      map[t.state].offline++;
    }
  });
  return Object.values(map).sort((a, b) => b.total - a.total);
}

export const initialBookings: Booking[] = [
  {
    id: 'bkg_001',
    serialNumber: 1,
    terminalCode: 'TCK-KA-001',
    invoiceNumber: 'TCK-INV-2026-8891',
    customerName: 'Aarav Sharma',
    mobileNumber: '+91 98450 12345',
    openDateTime: 'Aug 16, 2026 10:30 AM',
    bookingStatus: 'ACTIVE',
    paymentMethod: 'UPI',
    dateOfBirth: '14-06-1994',
    lockName: 'LKR-A04',
    passcode: '8821',
    duration: '3 Hours (Remaining: 45m)',
    bookingType: 'BAGGAGE',
    bookingSource: 'Touchscreen',
    siteType: 'Mall',
    state: 'Karnataka',
    city: 'Bangalore',
    amount: 150,
  },
  {
    id: 'bkg_002',
    serialNumber: 2,
    terminalCode: 'TCK-KA-004',
    invoiceNumber: 'TCK-INV-2026-8892',
    customerName: 'Priya Iyer',
    mobileNumber: '+91 97312 45678',
    openDateTime: 'Aug 16, 2026 11:15 AM',
    bookingStatus: 'ACTIVE',
    paymentMethod: 'ONLINE',
    dateOfBirth: '22-09-1998',
    lockName: 'LKR-B02',
    passcode: '4509',
    duration: '6 Hours (Remaining: 3h 10m)',
    bookingType: 'BAGGAGE',
    bookingSource: 'Web',
    siteType: 'Campus',
    state: 'Karnataka',
    city: 'Bangalore',
    amount: 250,
  },
  {
    id: 'bkg_003',
    serialNumber: 3,
    terminalCode: 'TCK-MH-058',
    invoiceNumber: 'TCK-INV-2026-8893',
    customerName: 'Rohan Mehta',
    mobileNumber: '+91 98200 98765',
    openDateTime: 'Aug 16, 2026 09:00 AM',
    bookingStatus: 'ACTIVE',
    paymentMethod: 'PAY LATER',
    dateOfBirth: '05-12-1991',
    lockName: 'LKR-M01',
    passcode: '7734',
    duration: '12 Hours (Remaining: 6h 30m)',
    bookingType: 'MOBILE',
    bookingSource: 'Mobile App',
    siteType: 'Mall',
    state: 'Maharashtra',
    city: 'Mumbai',
    amount: 350,
  },
  {
    id: 'bkg_004',
    serialNumber: 4,
    terminalCode: 'TCK-DL-138',
    invoiceNumber: 'TCK-INV-2026-8894',
    customerName: 'Karan Malhotra',
    mobileNumber: '+91 98110 33445',
    openDateTime: 'Aug 16, 2026 08:45 AM',
    bookingStatus: 'COMPLETED',
    paymentMethod: 'UPI',
    dateOfBirth: '19-03-1989',
    lockName: 'LKR-C08',
    passcode: '1920',
    duration: '2 Hours (Retrieved)',
    bookingType: 'BAGGAGE',
    bookingSource: 'Touchscreen',
    siteType: 'Railway',
    state: 'Delhi',
    city: 'New Delhi',
    amount: 100,
  },
  {
    id: 'bkg_005',
    serialNumber: 5,
    terminalCode: 'TCK-TN-111',
    invoiceNumber: 'TCK-INV-2026-8895',
    customerName: 'Ananya Sundaram',
    mobileNumber: '+91 94440 55667',
    openDateTime: 'Aug 16, 2026 01:20 PM',
    bookingStatus: 'ACTIVE',
    paymentMethod: 'CARD',
    dateOfBirth: '30-07-2001',
    lockName: 'LKR-A01',
    passcode: '9081',
    duration: '1 Hour (Remaining: 20m)',
    bookingType: 'BAGGAGE',
    bookingSource: 'Web',
    siteType: 'Mall',
    state: 'Tamil Nadu',
    city: 'Chennai',
    amount: 80,
  },
  {
    id: 'bkg_006',
    serialNumber: 6,
    terminalCode: 'TCK-TG-086',
    invoiceNumber: 'TCK-INV-2026-8896',
    customerName: 'Vikram Reddy',
    mobileNumber: '+91 99890 22331',
    openDateTime: 'Aug 16, 2026 12:00 PM',
    bookingStatus: 'ACTIVE',
    paymentMethod: 'UPI',
    dateOfBirth: '11-11-1995',
    lockName: 'LKR-D03',
    passcode: '6312',
    duration: '24 Hours (Remaining: 18h)',
    bookingType: 'BAGGAGE',
    bookingSource: 'Touchscreen',
    siteType: 'Metro',
    state: 'Telangana',
    city: 'Hyderabad',
    amount: 500,
  },
  {
    id: 'bkg_007',
    serialNumber: 7,
    terminalCode: 'TCK-UP-117',
    invoiceNumber: 'TCK-INV-2026-8897',
    customerName: 'Sneha Verma',
    mobileNumber: '+91 96500 88990',
    openDateTime: 'Aug 16, 2026 02:10 PM',
    bookingStatus: 'ACTIVE',
    paymentMethod: 'ONLINE',
    dateOfBirth: '08-04-1996',
    lockName: 'LKR-B05',
    passcode: '3341',
    duration: '3 Hours (Remaining: 2h 15m)',
    bookingType: 'BAGGAGE',
    bookingSource: 'Mobile App',
    siteType: 'Mall',
    state: 'Uttar Pradesh',
    city: 'Noida',
    amount: 150,
  },
  {
    id: 'bkg_008',
    serialNumber: 8,
    terminalCode: 'TCK-KL-132',
    invoiceNumber: 'TCK-INV-2026-8898',
    customerName: 'Mathew George',
    mobileNumber: '+91 94470 11223',
    openDateTime: 'Aug 15, 2026 05:30 PM',
    bookingStatus: 'OVERDUE',
    paymentMethod: 'PAY LATER',
    dateOfBirth: '17-08-1988',
    lockName: 'LKR-A09',
    passcode: '5120',
    duration: '6 Hours (Overdue by 15h)',
    bookingType: 'BAGGAGE',
    bookingSource: 'Web',
    siteType: 'Mall',
    state: 'Kerala',
    city: 'Kochi',
    amount: 250,
    extraCharges: 450,
  },
  {
    id: 'bkg_009',
    serialNumber: 9,
    terminalCode: 'TCK-RJ-149',
    invoiceNumber: 'TCK-INV-2026-8899',
    customerName: 'Divya Rathore',
    mobileNumber: '+91 94140 77889',
    openDateTime: 'Aug 16, 2026 10:00 AM',
    bookingStatus: 'COMPLETED',
    paymentMethod: 'UPI',
    dateOfBirth: '25-01-1993',
    lockName: 'LKR-M04',
    passcode: '8092',
    duration: '4 Hours (Retrieved)',
    bookingType: 'MOBILE',
    bookingSource: 'Touchscreen',
    siteType: 'Commercial',
    state: 'Rajasthan',
    city: 'Jaipur',
    amount: 120,
  },
  {
    id: 'bkg_010',
    serialNumber: 10,
    terminalCode: 'TCK-GA-144',
    invoiceNumber: 'TCK-INV-2026-8900',
    customerName: 'Alex Fernandes',
    mobileNumber: '+91 98221 44556',
    openDateTime: 'Aug 16, 2026 01:45 PM',
    bookingStatus: 'ACTIVE',
    paymentMethod: 'ONLINE',
    dateOfBirth: '10-10-1990',
    lockName: 'LKR-C02',
    passcode: '6740',
    duration: '6 Hours (Remaining: 4h 30m)',
    bookingType: 'BAGGAGE',
    bookingSource: 'Web',
    siteType: 'Commercial',
    state: 'Goa',
    city: 'Calangute',
    amount: 300,
  }
];

export const initialPESITStudents: PESITStudent[] = [
  { id: 'pes_std_01', rollNumber: 'PES1UG22CS001', name: 'Tanmay Bhatt', department: 'Computer Science', year: '3rd Year', rfidCard: 'RFID-8891024', assignedTerminal: 'TCK-KA-004', assignedLocker: 'LKR-A02', allocatedAt: 'Aug 01, 2026', status: 'ACTIVE' },
  { id: 'pes_std_02', rollNumber: 'PES1UG22EC045', name: 'Sahana Murthy', department: 'Electronics & Comm.', year: '3rd Year', rfidCard: 'RFID-8891025', assignedTerminal: 'TCK-KA-004', assignedLocker: 'LKR-A03', allocatedAt: 'Aug 01, 2026', status: 'ACTIVE' },
  { id: 'pes_std_03', rollNumber: 'PES1UG23ME012', name: 'Gautam Nambiar', department: 'Mechanical Engg.', year: '2nd Year', rfidCard: 'RFID-8891026', assignedTerminal: 'TCK-KA-023', assignedLocker: 'LKR-B01', allocatedAt: 'Aug 02, 2026', status: 'ACTIVE' },
  { id: 'pes_std_04', rollNumber: 'PES1UG21IS088', name: 'Pooja Hegde', department: 'Information Science', year: '4th Year', rfidCard: 'RFID-8891027', assignedTerminal: 'TCK-KA-024', assignedLocker: 'LKR-B04', allocatedAt: 'Aug 03, 2026', status: 'SUSPENDED' },
  { id: 'pes_std_05', rollNumber: 'PES1UG24BT003', name: 'Karthik Rao', department: 'Biotechnology', year: '1st Year', rfidCard: 'RFID-8891028', assignedTerminal: 'TCK-KA-026', assignedLocker: 'LKR-C01', allocatedAt: 'Aug 05, 2026', status: 'ACTIVE' },
];

export const initialPESITManagers: PESITManager[] = [
  { id: 'pes_mgr_01', name: 'Dr. Suresh Kumar', employeeId: 'EMP-PES-104', department: 'Campus Facilities', mobileNumber: '+91 98450 99887', email: 'sureshk@pes.edu', assignedTerminals: ['TCK-KA-004', 'TCK-KA-023', 'TCK-KA-024'], status: 'ACTIVE' },
  { id: 'pes_mgr_02', name: 'Nalini Swaminathan', employeeId: 'EMP-PES-109', department: 'Hostel Admin', mobileNumber: '+91 97312 88776', email: 'nalinis@pes.edu', assignedTerminals: ['TCK-KA-025', 'TCK-KA-026', 'TCK-KA-057'], status: 'ACTIVE' },
];

export const initialRefundRequests: RefundRequest[] = [
  { id: 'ref_req_01', bookingInvoice: 'TCK-INV-2026-8840', customerName: 'Harish Kalyan', mobileNumber: '+91 98840 12345', terminalCode: 'TCK-TN-111', amount: 150, requestedAt: 'Aug 16, 2026 09:15 AM', reason: 'Door did not unlock automatically; customer had to store elsewhere.', status: 'PENDING', paymentGatewayRef: 'rzp_pay_998129031' },
  { id: 'ref_req_02', bookingInvoice: 'TCK-INV-2026-8799', customerName: 'Zoya Khan', mobileNumber: '+91 98201 55443', terminalCode: 'TCK-MH-058', amount: 250, requestedAt: 'Aug 15, 2026 04:45 PM', reason: 'Excess billing deducted due to server time lag during checkout.', status: 'PENDING', paymentGatewayRef: 'rzp_pay_998124501' },
  { id: 'ref_req_03', bookingInvoice: 'TCK-INV-2026-8650', customerName: 'Varun Joshi', mobileNumber: '+91 94140 22110', terminalCode: 'TCK-RJ-149', amount: 80, requestedAt: 'Aug 14, 2026 11:30 AM', reason: 'Immediate cancellation within 5 mins grace period.', status: 'APPROVED', paymentGatewayRef: 'rzp_pay_998089123' },
];

export const initialRefundTransactions: RefundTransaction[] = [
  { id: 'ref_tx_01', refundId: 'ref_req_03', bookingInvoice: 'TCK-INV-2026-8650', customerName: 'Varun Joshi', amount: 80, settledAt: 'Aug 14, 2026 02:00 PM', status: 'SETTLED', gateway: 'Razorpay UPI Autopay', processedBy: 'parash' },
  { id: 'ref_tx_02', refundId: 'ref_req_00', bookingInvoice: 'TCK-INV-2026-8510', customerName: 'Kavita Menon', amount: 200, settledAt: 'Aug 13, 2026 05:12 PM', status: 'SETTLED', gateway: 'Paytm PG', processedBy: 'parash' },
  { id: 'ref_tx_03', refundId: 'ref_req_99', bookingInvoice: 'TCK-INV-2026-8422', customerName: 'Abhishek Roy', amount: 100, settledAt: 'Aug 12, 2026 10:45 AM', status: 'SETTLED', gateway: 'PhonePe PG', processedBy: 'parash' },
];

export const initialStaffCreditRequests: StaffCreditRequest[] = [
  { id: 'stf_req_01', staffName: 'Mahesh Patil', staffMobile: '+91 98220 33441', amount: 5000, requestedAt: 'Aug 16, 2026 08:30 AM', purpose: 'Float cash requirement for Terminal cash collection at Phoenix Palladium', status: 'PENDING' },
  { id: 'stf_req_02', staffName: 'Sanjay Gowda', staffMobile: '+91 97410 88223', amount: 3500, requestedAt: 'Aug 15, 2026 01:10 PM', purpose: 'Locker maintenance spares and offline cash buffer for Orion Mall', status: 'APPROVED' },
];

export const initialStaffProfiles: StaffProfile[] = [
  { id: 'stf_01', name: 'Mahesh Patil', mobile: '+91 98220 33441', role: 'CASH_COLLECTOR', branch: 'Mumbai Metro South', creditLimit: 25000, cashCollected: 18450, pendingSettlement: 18450, status: 'AVAILABLE', bankAccount: 'HDFC - 501004891238', ifscCode: 'HDFC0000240' },
  { id: 'stf_02', name: 'Sanjay Gowda', mobile: '+91 97410 88223', role: 'CASH_COLLECTOR', branch: 'Bangalore Central', creditLimit: 30000, cashCollected: 12200, pendingSettlement: 12200, status: 'AVAILABLE', bankAccount: 'ICICI - 002105018923', ifscCode: 'ICIC0000021' },
  { id: 'stf_03', name: 'Raghavan Pillai', mobile: '+91 94470 66554', role: 'FIELD_ENGINEER', branch: 'Kochi & Ernakulam Hub', creditLimit: 15000, cashCollected: 4500, pendingSettlement: 0, status: 'AVAILABLE', bankAccount: 'SBI - 20391823901', ifscCode: 'SBIN0008421' },
  { id: 'stf_04', name: 'Deepak Sharma', mobile: '+91 98110 77112', role: 'SUPERVISOR', branch: 'Delhi NCR Hub', creditLimit: 50000, cashCollected: 31000, pendingSettlement: 31000, status: 'AVAILABLE', bankAccount: 'Axis - 91802004561', ifscCode: 'UTIB0000120' },
];

export const initialPricingConfigs: PricingConfig[] = [
  { id: 'prc_01', siteType: 'Mall', lockerSize: 'Small (Baggage)', hourlyRate: 40, threeHourRate: 100, sixHourRate: 180, twelveHourRate: 280, twentyFourHourRate: 400, excessHourlyRate: 50, freeGraceMinutes: 15 },
  { id: 'prc_02', siteType: 'Mall', lockerSize: 'Medium (Baggage)', hourlyRate: 60, threeHourRate: 150, sixHourRate: 250, twelveHourRate: 380, twentyFourHourRate: 550, excessHourlyRate: 70, freeGraceMinutes: 15 },
  { id: 'prc_03', siteType: 'Mall', lockerSize: 'Large (Baggage)', hourlyRate: 80, threeHourRate: 200, sixHourRate: 340, twelveHourRate: 480, twentyFourHourRate: 700, excessHourlyRate: 90, freeGraceMinutes: 15 },
  { id: 'prc_04', siteType: 'Mall', lockerSize: 'XL (Baggage)', hourlyRate: 100, threeHourRate: 250, sixHourRate: 420, twelveHourRate: 600, twentyFourHourRate: 850, excessHourlyRate: 110, freeGraceMinutes: 15 },
  { id: 'prc_05', siteType: 'Mall', lockerSize: '2 Phone (Mobile)', hourlyRate: 25, threeHourRate: 60, sixHourRate: 100, twelveHourRate: 160, twentyFourHourRate: 220, excessHourlyRate: 30, freeGraceMinutes: 15 },
  { id: 'prc_06', siteType: 'Railway', lockerSize: 'Large (Baggage)', hourlyRate: 50, threeHourRate: 120, sixHourRate: 200, twelveHourRate: 300, twentyFourHourRate: 450, excessHourlyRate: 60, freeGraceMinutes: 20 },
  { id: 'prc_07', siteType: 'Airport', lockerSize: 'XL (Baggage)', hourlyRate: 120, threeHourRate: 300, sixHourRate: 500, twelveHourRate: 750, twentyFourHourRate: 1100, excessHourlyRate: 140, freeGraceMinutes: 15 },
  { id: 'prc_08', siteType: 'Campus', lockerSize: 'Medium (Baggage)', hourlyRate: 20, threeHourRate: 50, sixHourRate: 80, twelveHourRate: 120, twentyFourHourRate: 180, excessHourlyRate: 25, freeGraceMinutes: 30 },
];

export const initialStateGST: StateGSTConfig[] = [
  { id: 'gst_01', state: 'Karnataka', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE', updatedAt: '01-04-2026' },
  { id: 'gst_02', state: 'Maharashtra', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE', updatedAt: '01-04-2026' },
  { id: 'gst_03', state: 'Telangana', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE', updatedAt: '01-04-2026' },
  { id: 'gst_04', state: 'Delhi', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE', updatedAt: '01-04-2026' },
  { id: 'gst_05', state: 'Tamil Nadu', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE', updatedAt: '01-04-2026' },
  { id: 'gst_06', state: 'Uttar Pradesh', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE', updatedAt: '01-04-2026' },
  { id: 'gst_07', state: 'Kerala', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE', updatedAt: '01-04-2026' },
  { id: 'gst_08', state: 'Gujarat', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE', updatedAt: '01-04-2026' },
  { id: 'gst_09', state: 'Rajasthan', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE', updatedAt: '01-04-2026' },
  { id: 'gst_10', state: 'Madhya Pradesh', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE', updatedAt: '01-04-2026' },
];

export const initialUsers: UserItem[] = [
  { id: 'usr_c_01', name: 'Aarav Sharma', mobileNumber: '+91 98450 12345', email: 'aarav.sharma@gmail.com', totalBookings: 14, lastBookingDate: 'Aug 16, 2026', status: 'ACTIVE' },
  { id: 'usr_c_02', name: 'Priya Iyer', mobileNumber: '+91 97312 45678', email: 'priya.iyer@pes.edu', totalBookings: 28, lastBookingDate: 'Aug 16, 2026', status: 'ACTIVE' },
  { id: 'usr_c_03', name: 'Rohan Mehta', mobileNumber: '+91 98200 98765', email: 'rohan.mehta@yahoo.co.in', totalBookings: 8, lastBookingDate: 'Aug 16, 2026', status: 'ACTIVE' },
  { id: 'usr_c_04', name: 'Sunil Jaggi', mobileNumber: '+91 98101 44332', email: 'suniljaggi99@outlook.com', totalBookings: 3, lastBookingDate: 'Jul 28, 2026', status: 'BLOCKED', blockedReason: 'Repeated non-payment in pay-later checkout + door tampering', blockedAt: 'Jul 29, 2026 02:15 PM', blockedBy: 'parash' },
  { id: 'usr_c_05', name: 'Karan Malhotra', mobileNumber: '+91 98110 33445', email: 'karan.m@gmail.com', totalBookings: 5, lastBookingDate: 'Aug 16, 2026', status: 'ACTIVE' },
  { id: 'usr_c_06', name: 'Ananya Sundaram', mobileNumber: '+91 94440 55667', email: 'ananya.sundaram@hotmail.com', totalBookings: 19, lastBookingDate: 'Aug 16, 2026', status: 'ACTIVE' },
];

export const initialAdmins: AdminUser[] = [
  { id: 'adm_01', username: 'parash', name: 'Parash Rautela', email: 'parash@tuckit.in', role: 'SUPERADMIN', roleName: 'SUPERADMIN', status: 'ACTIVE', lastLogin: 'Aug 17, 2026 01:45 AM' },
  { id: 'adm_02', username: 'operations_team', name: 'Central Ops Desk', email: 'ops@tuckit.in', role: 'OPERATIONS', roleName: 'Operations Lead', status: 'ACTIVE', lastLogin: 'Aug 16, 2026 10:20 PM' },
  { id: 'adm_03', username: 'field_blr', name: 'BLR Field Support', email: 'support.blr@tuckit.in', role: 'FIELD_STAFF', roleName: 'Field Engineer', status: 'ACTIVE', lastLogin: 'Aug 16, 2026 06:14 PM' },
  { id: 'adm_04', username: 'pes_admin', name: 'Dr. Suresh (PES Admin)', email: 'sureshk@pes.edu', role: 'PESIT_MANAGER', roleName: 'PESIT Campus Manager', status: 'ACTIVE', lastLogin: 'Aug 16, 2026 04:30 PM' },
];

export const initialRoles: RoleConfig[] = [
  { id: 'role_01', name: 'SUPERADMIN', description: 'Full root access to hardware, IoT remote telemetry, financial configurations, role engineering, and database overrides.', userCount: 1, permissions: ['ALL'] },
  { id: 'role_02', name: 'OPERATIONS', description: 'Operational control over bookings, terminals, remote assistance, refunds, and alerts.', userCount: 4, permissions: ['PAGE:DASHBOARD', 'PAGE:BOOKINGS', 'PAGE:REPORTS', 'PAGE:TERMINALS', 'PAGE:REFUNDS', 'PAGE:ALERTS', 'ACTION:LOCKER_FORCE_OPEN', 'ACTION:LOCKER_RELEASE', 'ACTION:TERMINAL_REBOOT'] },
  { id: 'role_03', name: 'FIELD_STAFF', description: 'On-site terminal diagnostics, software update execution, cash collection and physical locker inspections.', userCount: 8, permissions: ['PAGE:TERMINALS', 'PAGE:STAFF', 'ACTION:LOCKER_FORCE_OPEN', 'ACTION:LOCKER_REPORT_FAULTY'] },
  { id: 'role_04', name: 'PESIT_MANAGER', description: 'Restricted administrative view for PESIT campus locker stations, student RFID assignment and batch release.', userCount: 2, permissions: ['PAGE:PESIT_DASHBOARD', 'ACTION:PESIT_MANAGER_MANAGE'] },
];

export const initialAuditLogs: AuditLog[] = [
  { id: 'aud_01', timestamp: 'Aug 17, 2026 01:40 AM', actor: 'parash', actorRole: 'SUPERADMIN', action: 'TERMINAL_REMOTE_HEARTBEAT_POLL', resource: 'TERMINAL_CLUSTER', resourceId: 'ALL_238', ipAddress: '103.212.144.12', status: 'SUCCESS', details: 'Automated 10s WebSocket polling heartbeat re-synchronized across 238 terminals.' },
  { id: 'aud_02', timestamp: 'Aug 16, 2026 11:32 PM', actor: 'parash', actorRole: 'SUPERADMIN', action: 'LOCKER_FORCE_OPEN', resource: 'LOCKER', resourceId: 'TCK-KA-001/LKR-A04', ipAddress: '103.212.144.12', status: 'SUCCESS', details: 'Operator manual override: Force opened locker LKR-A04 for verification.' },
  { id: 'aud_03', timestamp: 'Aug 16, 2026 09:14 PM', actor: 'operations_team', actorRole: 'OPERATIONS', action: 'REFUND_APPROVED', resource: 'REFUND', resourceId: 'ref_req_03', ipAddress: '49.207.210.88', status: 'SUCCESS', details: 'Refund of ₹80 initiated via Razorpay UPI Autopay for invoice TCK-INV-2026-8650.' },
  { id: 'aud_04', timestamp: 'Aug 16, 2026 05:45 PM', actor: 'field_blr', actorRole: 'FIELD_STAFF', action: 'TERMINAL_RESTART', resource: 'TERMINAL', resourceId: 'TCK-KA-057', ipAddress: '157.48.112.90', status: 'SUCCESS', details: 'Triggered soft reboot command over MQTT/WS for PESIT South Hostel Kiosk.' },
  { id: 'aud_05', timestamp: 'Aug 16, 2026 02:15 PM', actor: 'parash', actorRole: 'SUPERADMIN', action: 'USER_BLACKLIST', resource: 'USER', resourceId: 'usr_c_04', ipAddress: '103.212.144.12', status: 'WARNING', details: 'Blacklisted mobile +91 98101 44332 due to repeated unpaid locker abandonments.' },
];

export const initialAlerts: AlertItem[] = [
  { id: 'alt_01', severity: 'HIGH', title: 'Terminal Offline (> 15 mins)', description: 'TCK-HP-145 (Shimla Old Bus Stand Tourist Counter) lost WebSocket connection.', terminalCode: 'TCK-HP-145', timestamp: '12m ago', status: 'UNRESOLVED' },
  { id: 'alt_02', severity: 'HIGH', title: 'Door Tamper Sensor Tripped', description: 'TCK-KA-004 Locker LKR-B03 door closed sensor unlatched unexpectedly without active unlock.', terminalCode: 'TCK-KA-004', timestamp: '24m ago', status: 'ACKNOWLEDGED' },
  { id: 'alt_03', severity: 'MEDIUM', title: 'High Latency / Slow Network', description: 'TCK-KL-132 ping response time exceeded 4,200ms on 4G SIM fallback.', terminalCode: 'TCK-KL-132', timestamp: '48m ago', status: 'UNRESOLVED' },
  { id: 'alt_04', severity: 'LOW', title: 'Firmware Update Available', description: '18 legacy terminals eligible for OTA firmware upgrade to v1.2.04.', terminalCode: 'GLOBAL', timestamp: '2h ago', status: 'ACKNOWLEDGED' },
];
