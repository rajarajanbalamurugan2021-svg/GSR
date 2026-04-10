/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Doctor, Patient, Staff, Ambulance, AmbulanceBooking, FoodItem, Medicine, Appointment, MedicalRecord, Bill, BloodDonor, OrganDonor } from './types';

export const SEED_DOCTORS: Doctor[] = [
  { id: 301, name: "Dr. Aisha Patel", role: 'Doctor', spec: "Cardiology", phone: "9000000001", schedule: "Mon-Fri 09-17", available: true, pass: "doc301" },
  { id: 302, name: "Dr. Rajan Mehta", role: 'Doctor', spec: "Neurology", phone: "9000000002", schedule: "Mon-Sat 08-14", available: true, pass: "doc302" },
  { id: 303, name: "Dr. Sara Ali", role: 'Doctor', spec: "Orthopedics", phone: "9000000003", schedule: "Tue-Sat 10-18", available: true, pass: "doc303" },
  { id: 304, name: "Dr. Kevin Thomas", role: 'Doctor', spec: "General Medicine", phone: "9000000004", schedule: "Mon-Fri 07-15", available: true, pass: "doc304" },
  { id: 305, name: "Dr. Priya Sharma", role: 'Doctor', spec: "Pediatrics", phone: "9000000005", schedule: "Mon-Thu 09-16", available: true, pass: "doc305" },
];

export const SEED_PATIENTS: Patient[] = [
  { id: 1001, name: "Ramesh Kumar", role: 'Patient', gender: "Male", phone: "9100000001", address: "Chennai", blood: "A+", reg: "2025-01-10", age: 45, pass: "pat1001" },
  { id: 1002, name: "Lakshmi Devi", role: 'Patient', gender: "Female", phone: "9100000002", address: "Madurai", blood: "B+", reg: "2025-01-15", age: 32, pass: "pat1002" },
  { id: 1003, name: "Arjun Nair", role: 'Patient', gender: "Male", phone: "9100000003", address: "Coimbatore", blood: "O-", reg: "2025-02-01", age: 28, pass: "pat1003" },
];

export const SEED_STAFF: Staff[] = [
  { id: 2001, name: "Nurse Kavitha", role: 'Staff', dept: "ICU", phone: "9200000001", shift: "Morning", pass: "staff123" },
  { id: 2002, name: "Raj Technician", role: 'Staff', dept: "Pathology", phone: "9200000002", shift: "Evening", pass: "staff456" },
  { id: 2003, name: "Meena Sharma", role: 'Staff', dept: "Pharmacy", phone: "9200000003", shift: "Morning", pass: "staff789" },
];

export const SEED_AMBULANCES: Ambulance[] = [
  { id: 7001, vehicleNo: "TN01 AMB 001", driver: "Murugan", dPhone: "9300000001", location: "Anna Nagar, Chennai", status: "Available" },
  { id: 7002, vehicleNo: "TN01 AMB 002", driver: "Suresh", dPhone: "9300000002", location: "T. Nagar, Chennai", status: "Available" },
  { id: 7003, vehicleNo: "TN01 AMB 003", driver: "Balachander", dPhone: "9300000003", location: "Adyar, Chennai", status: "On-Duty" },
];

export const SEED_AMB_BOOKINGS: AmbulanceBooking[] = [
  { id: 7101, ambulanceId: 7003, requestedBy: "PATIENT-1001", pickup: "ECR, Chennai", dest: "GSR Hospital", time: "2026-02-19 09:32", status: "Confirmed" },
];

export const SEED_FOOD_MENU: FoodItem[] = [
  { id: 1, name: "Idli Sambar", cat: "Breakfast", price: 40 },
  { id: 2, name: "Veg Thali", cat: "Lunch", price: 80 },
  { id: 3, name: "Chapathi", cat: "Dinner", price: 60 },
  { id: 4, name: "Fruit Bowl", cat: "Snack", price: 50 },
  { id: 5, name: "Rice & Dal", cat: "Lunch", price: 70 },
  { id: 6, name: "Upma", cat: "Breakfast", price: 35 },
];

export const SEED_MEDICINES: Medicine[] = [
  { id: 1, name: "Paracetamol 500mg", cat: "Analgesic", price: 5, stock: 200 },
  { id: 2, name: "Amoxicillin 250mg", cat: "Antibiotic", price: 12, stock: 150 },
  { id: 3, name: "Amlodipine 5mg", cat: "Cardiac", price: 18, stock: 100 },
  { id: 4, name: "ORS Sachet", cat: "Electrolyte", price: 8, stock: 300 },
  { id: 5, name: "Cetirizine 10mg", cat: "Antiallergic", price: 6, stock: 180 },
];

export const SEED_APPOINTMENTS: Appointment[] = [
  { id: 4001, patientId: 1001, doctorId: 301, date: "2026-02-20", time: "10:00", reason: "Chest pain checkup", status: "Confirmed", priority: "Urgent" },
  { id: 4002, patientId: 1002, doctorId: 305, date: "2026-02-21", time: "11:00", reason: "Child vaccination", status: "Pending", priority: "Normal" },
];

export const SEED_RECORDS: MedicalRecord[] = [
  { id: 5001, patientId: 1001, doctorId: 301, date: "2026-01-15", diagnosis: "Hypertension Stage 1", prescription: "Amlodipine 5mg once daily", notes: "Reduce salt, exercise daily" },
];

export const SEED_BILLS: Bill[] = [
  { id: 6001, patientId: 1001, date: "2026-01-15", status: "Paid", consult: 500, medicine: 300, test: 200, room: 0, misc: 0, total: 1000, payMethod: "cash", paidAt: "2026-01-15 10:30", txnId: "CASH-6001-ABC" },
];

export const SEED_BLOOD_DONORS: BloodDonor[] = [
  { id: 10001, name: "Senthil Kumar", blood: "A+", phone: "9400000001", address: "Tambaram", lastDonation: "2025-11-10", available: true, regBy: "ADMIN" },
  { id: 10002, name: "Preethi Raj", blood: "O+", phone: "9400000002", address: "Porur", lastDonation: "2025-09-20", available: true, regBy: "ADMIN" },
];

export const SEED_ORGAN_DONORS: OrganDonor[] = [
  { id: 11001, name: "Vijay Anand", phone: "9500000001", blood: "B+", organs: "Kidney,Cornea", regDate: "2026-01-05", regBy: "ADMIN", consent: true },
];
