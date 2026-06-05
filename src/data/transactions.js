export const MERCHANT = {
  name: "Adeyemi Stores",
  initials: "AS",
  id: "MID-004821",
  phone: "+234 803 456 7890",
  email: "adeyemi.stores@gmail.com",
  location: "Lagos, Nigeria",
  joined: "Jan 2024",
  tier: "Gold",
  category: "E-commerce",
  balance: 184500,
  lastFunded: "28 May 2026",
  weeklyChange: 100000,
  status: "Active",
};

export const TRANSACTIONS = [
  { id:"TXN-20261", date:"2024-05-28", time:"14:32", type:"funding",  desc:"Wallet top-up via bank transfer",          amount:100000, dir:"cr", balBefore:84500,   balAfter:184500, status:"success", shipment:null,        method:"Bank transfer", ref:"NIP/2605/1144", initiatedBy:"Merchant" },
  { id:"TXN-20255", date:"2025-05-27", time:"09:17", type:"debit",    desc:"Shipment debit — Lagos → Abuja",            amount:15500,  dir:"dr", balBefore:100000,  balAfter:84500,  status:"success", shipment:"SHP-00981", method:"Wallet",        ref:"—",             initiatedBy:"System"   },
  { id:"TXN-20249", date:"2025-05-25", time:"11:05", type:"debit",    desc:"Shipment debit — Lagos → Kano",             amount:18000,  dir:"dr", balBefore:118000,  balAfter:100000, status:"success", shipment:"SHP-00974", method:"Wallet",        ref:"—",             initiatedBy:"System"   },
  { id:"TXN-20240", date:"2024-05-23", time:"16:50", type:"refund",   desc:"Refund — cancelled shipment SHP-00961",     amount:13000,  dir:"cr", balBefore:105000,  balAfter:118000, status:"success", shipment:"SHP-00961", method:"System",        ref:"—",             initiatedBy:"System"   },
  { id:"TXN-20231", date:"2024-05-21", time:"08:44", type:"debit",    desc:"Shipment debit — Lagos → Port Harcourt",    amount:12500,  dir:"dr", balBefore:117500,  balAfter:105000, status:"success", shipment:"SHP-00953", method:"Wallet",        ref:"—",             initiatedBy:"System"   },
  { id:"TXN-20218", date:"2024-05-19", time:"13:22", type:"debit",    desc:"Shipment debit — Lagos → Ibadan",           amount:8000,   dir:"dr", balBefore:125500,  balAfter:117500, status:"success", shipment:"SHP-00940", method:"Wallet",        ref:"—",             initiatedBy:"System"   },
  { id:"TXN-20205", date:"2024-05-17", time:"10:09", type:"funding",  desc:"Wallet top-up via card payment",            amount:150000, dir:"cr", balBefore:-24500,  balAfter:125500, status:"success", shipment:null,        method:"Card",          ref:"PYS/1705/0882", initiatedBy:"Merchant" },
  { id:"TXN-20198", date:"2025-05-15", time:"17:31", type:"debit",    desc:"Shipment debit — Lagos → Enugu",            amount:16000,  dir:"dr", balBefore:-8500,   balAfter:-24500, status:"failed",  shipment:"SHP-00929", method:"Wallet",        ref:"—",             initiatedBy:"System"   },
  { id:"TXN-20187", date:"2025-05-12", time:"09:55", type:"debit",    desc:"Shipment debit — Lagos → Benin City",       amount:14500,  dir:"dr", balBefore:6000,    balAfter:-8500,  status:"pending", shipment:"SHP-00912", method:"Wallet",        ref:"—",             initiatedBy:"System"   },
  { id:"TXN-20175", date:"2025-05-09", time:"11:18", type:"reversal", desc:"Reversal — overcharge on SHP-00899",        amount:5500,   dir:"cr", balBefore:500,     balAfter:6000,   status:"success", shipment:"SHP-00899", method:"System",        ref:"—",             initiatedBy:"Admin"    },
  { id:"TXN-20162", date:"2025-05-06", time:"14:40", type:"debit",    desc:"Shipment debit — Lagos → Kaduna",           amount:19000,  dir:"dr", balBefore:19500,   balAfter:500,    status:"success", shipment:"SHP-00887", method:"Wallet",        ref:"—",             initiatedBy:"System"   },
  { id:"TXN-20150", date:"2024-05-03", time:"08:20", type:"funding",  desc:"Wallet top-up via USSD transfer",           amount:100000, dir:"cr", balBefore:-80500,  balAfter:19500,  status:"success", shipment:null,        method:"USSD",          ref:"USD/0305/0441", initiatedBy:"Merchant" },
];

export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export const YEARS = Array.from({ length: 17 }, (_, i) => 2010 + i); // 2010–2026