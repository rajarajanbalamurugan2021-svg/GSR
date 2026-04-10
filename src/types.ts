/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'Admin' | 'Doctor' | 'Staff' | 'Patient';

export interface User {
  id: number;
  name: string;
  role: Role;
  pass: string;
  phone?: string;
}

export interface Doctor extends User {
  spec: string;
  schedule: string;
  available: boolean;
}

export interface Patient extends User {
  gender: string;
  address: string;
  blood: string;
  reg: string;
  age: number;
}

export interface Staff extends User {
  dept: string;
  shift: string;
}

export interface Ambulance {
  id: number;
  vehicleNo: string;
  driver: string;
  dPhone: string;
  location: string;
  status: 'Available' | 'On-Duty' | 'Maintenance';
}

export interface AmbulanceBooking {
  id: number;
  ambulanceId: number;
  requestedBy: string;
  pickup: string;
  dest: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface FoodItem {
  id: number;
  name: string;
  cat: string;
  price: number;
}

export interface FoodOrder {
  id: number;
  menuItemId: number;
  qty: number;
  ward: string;
  requestedBy: string;
  date: string;
  status: 'Pending' | 'Delivered';
}

export interface Medicine {
  id: number;
  name: string;
  cat: string;
  price: number;
  stock: number;
}

export interface MedicineOrder {
  id: number;
  medicineId: number;
  qty: number;
  requestedBy: string;
  date: string;
  status: 'Pending' | 'Dispensed';
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  reason: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  priority: 'Emergency' | 'Urgent' | 'Normal' | 'Routine';
}

export interface MedicalRecord {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  diagnosis: string;
  prescription: string;
  notes: string;
}

export interface Bill {
  id: number;
  patientId: number;
  date: string;
  status: 'Paid' | 'Unpaid';
  consult: number;
  medicine: number;
  test: number;
  room: number;
  misc: number;
  total: number;
  payMethod?: string;
  paidAt?: string;
  txnId?: string;
}

export interface BloodDonor {
  id: number;
  name: string;
  blood: string;
  phone: string;
  address: string;
  lastDonation: string;
  available: boolean;
  regBy: string;
}

export interface OrganDonor {
  id: number;
  name: string;
  phone: string;
  blood: string;
  organs: string;
  regDate: string;
  regBy: string;
  consent: boolean;
}
