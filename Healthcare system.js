import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Search, Filter, Bell, Settings, BarChart3, UserPlus, Trash2, Edit, Eye, Phone, Mail, MapPin, Star, Plus, ChevronDown, ChevronRight, X, CheckCircle, AlertCircle } from 'lucide-react';

// Mock data
const initialDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    specialty: "Cardiologist",
    rating: 4.8,
    experience: "15 years",
    location: "Downtown Medical Center",
    language: "English, Spanish",
    fees: 150,
    phone: "+1-555-0123",
    email: "sarah.wilson@healthcenter.com",
    availability: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"],
    image: "👩‍⚕️"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Dentist",
    rating: 4.9,
    experience: "12 years",
    location: "City Dental Clinic",
    language: "English, Mandarin",
    fees: 100,
    phone: "+1-555-0124",
    email: "michael.chen@citydental.com",
    availability: ["8:00 AM", "9:00 AM", "1:00 PM", "4:00 PM", "5:00 PM"],
    image: "👨‍⚕️"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatologist",
    rating: 4.7,
    experience: "10 years",
    location: "Skin Care Center",
    language: "English, Spanish, French",
    fees: 120,
    phone: "+1-555-0125",
    email: "emily.rodriguez@skincare.com",
    availability: ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
    image: "👩‍⚕️"
  }
];

  const initialAppointments = [
  {
    id: 1,
    patientName: "Sneha Gardiner",
    doctorName: "Dr. Sarah Wilson",
    specialty: "Cardiologist",
    date: "2025-06-18",
    time: "10:00 AM",
    status: "confirmed",
    notes: "Regular checkup"
  },
  {
    id: 2,
    patientName: "Jane Smith",
    doctorName: "Dr. Michael Chen",
    specialty: "Dentist",
    date: "2025-06-20",
    time: "2:00 PM",
    status: "pending",
    notes: "Dental cleaning"
  }
];

const HealthcareSystem = () => {
  const [currentUser, setCurrentUser] = useState({ role: 'patient', name: 'Sneha Gardiner', id: 1 });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [doctors, setDoctors] = useState(initialDoctors);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "Appointment confirmed with Dr. Sarah Wilson", type: "success", time: "2 hours ago" },
    { id: 2, message: "Reminder: Appointment tomorrow at 10:00 AM", type: "info", time: "1 day ago" }
  ]);

  const specialties = ['Cardiologist', 'Dentist', 'Dermatologist', 'Neurologist', 'Orthopedic', 'Pediatrician'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === '' || doctor.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const userAppointments = appointments.filter(app => 
    currentUser.role === 'patient' ? app.patientName === currentUser.name : 
    currentUser.role === 'doctor' ? app.doctorName === currentUser.name : true
  );

  const BookingModal = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [notes, setNotes] = useState('');

    const handleBooking = () => {
      if (selectedDate && selectedTime && selectedDoctor) {
        const newAppointment = {
          id: appointments.length + 1,
          patientName: currentUser.name,
          doctorName: selectedDoctor.name,
          specialty: selectedDoctor.specialty,
          date: selectedDate,
          time: selectedTime,
          status: 'pending',
          notes: notes
        };
        setAppointments([...appointments, newAppointment]);
        setShowBookingModal(false);
        setSelectedDoctor(null);
        setSelectedDate('');
        setSelectedTime('');
        setNotes('');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Book Appointment</h3>
            <button onClick={() => setShowBookingModal(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          {selectedDoctor && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedDoctor.image}</span>
                <div>
                  <h4 className="font-medium">{selectedDoctor.name}</h4>
                  <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                  <p className="text-sm text-blue-600">${selectedDoctor.fees}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Select Time</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose time slot</option>
                {selectedDoctor?.availability.map((time, index) => (
                  <option key={index} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your symptoms or reason for visit..."
                className="w-full border rounded-lg px-3 py-2 h-20 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowBookingModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser.name}!</h2>
        <p className="opacity-90">
          {currentUser.role === 'patient' && "Manage your health appointments easily"}
          {currentUser.role === 'doctor' && "View your upcoming appointments and manage availability"}
          {currentUser.role === 'admin' && "Monitor system analytics and manage users"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-blue-600" size={24} />
            <h3 className="font-semibold">Upcoming Appointments</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">{userAppointments.filter(a => a.status === 'confirmed').length}</p>
          <p className="text-sm text-gray-600">Next: {userAppointments[0]?.date || 'None scheduled'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <User className="text-green-600" size={24} />
            <h3 className="font-semibold">
              {currentUser.role === 'admin' ? 'Total Doctors' : 'Available Doctors'}
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">{doctors.length}</p>
          <p className="text-sm text-gray-600">Across {specialties.length} specialties</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-purple-600" size={24} />
            <h3 className="font-semibold">This Month</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
          <p className="text-sm text-gray-600">Total appointments</p>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Appointments</h3>
        </div>
        <div className="p-6">
          {userAppointments.length > 0 ? (
            <div className="space-y-4">
              {userAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {currentUser.role === 'patient' ? appointment.doctorName : appointment.patientName}
                      </h4>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No appointments found</p>
          )}
        </div>
      </div>
    </div>
  );

  const DoctorsView = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">Find Doctors</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  {doctor.image}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{doctor.name}</h3>
                  <p className="text-gray-600">{doctor.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="text-yellow-500 fill-current" size={16} />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{doctor.experience} experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{doctor.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">${doctor.fees}</span>
                {currentUser.role === 'patient' && (
                  <button
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setShowBookingModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AppointmentsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {currentUser.role === 'patient' ? 'My Appointments' : 
           currentUser.role === 'doctor' ? 'Patient Appointments' : 'All Appointments'}
        </h2>
        {currentUser.role === 'patient' && (
          <button
            onClick={() => setActiveTab('doctors')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="inline mr-2" />
            Book New
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {currentUser.role === 'patient' ? 'Doctor' : 'Patient'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <User size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {currentUser.role === 'patient' ? appointment.doctorName : appointment.patientName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.specialty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{appointment.date}</div>
                    <div className="text-gray-500">{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AdminView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <UserPlus className="text-blue-600" size={24} />
            <h3 className="font-semibold">Total Patients</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">1,234</p>
          <p className="text-sm text-green-600">+12% this month</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <User className="text-green-600" size={24} />
            <h3 className="font-semibold">Active Doctors</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">{doctors.length}</p>
          <p className="text-sm text-blue-600">2 pending approval</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-purple-600" size={24} />
            <h3 className="font-semibold">Appointments Today</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">48</p>
          <p className="text-sm text-gray-600">85% completion rate</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-orange-600" size={24} />
            <h3 className="font-semibold">Revenue</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">$12,450</p>
          <p className="text-sm text-green-600">+8% from last month</p>
        </div>
      </div>

      {/* System Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Appointments by Specialty</h3>
          <div className="space-y-3">
            {specialties.map((specialty, index) => (
              <div key={specialty} className="flex items-center justify-between">
                <span className="text-sm">{specialty}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.random() * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.floor(Math.random() * 50) + 10}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium">New doctor approved</p>
                <p className="text-xs text-gray-600">Dr. James Wilson - Orthopedic</p>
              </div>
              <span className="text-xs text-gray-500">2h ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium">Peak appointment time</p>
                <p className="text-xs text-gray-600">10:00 AM - 12:00 PM</p>
              </div>
              <span className="text-xs text-gray-500">1d ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="text-yellow-600" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium">System maintenance</p>
                <p className="text-xs text-gray-600">Scheduled for Sunday 2:00 AM</p>
              </div>
              <span className="text-xs text-gray-500">3d ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'doctors':
        return <DoctorsView />;
      case 'appointments':
        return <AppointmentsView />;
      case 'admin':
        return <AdminView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H+</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">HealthCare System</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Selector */}
            <select
              value={currentUser.role}
              onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg relative"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 size={20} />
                  Dashboard
                </button>
              </li>
              
              {(currentUser.role === 'patient' || currentUser.role === 'admin') && (
                <li>
                  <button
                    onClick={() => setActiveTab('doctors')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'doctors' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <User size={20} />
                    Find Doctors
                  </button>
                </li>
              )}

              <li>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'appointments' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Calendar size={20} />
                  Appointments
                </button>
              </li>

              {currentUser.role === 'doctor' && (
                <>
                  <li>
                    <button
                      onClick={() => setActiveTab('schedule')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === 'schedule' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Clock size={20} />
                      My Schedule
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('patients')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === 'patients' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <UserPlus size={20} />
                      Patient Records
                    </button>
                  </li>
                </>
              )}

              {currentUser.role === 'admin' && (
                <li>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'admin' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Settings size={20} />
                    Admin Panel
                  </button>
                </li>
              )}

              <li className="pt-4 mt-4 border-t border-gray-200">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings size={20} />
                  Settings
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      {/* Booking Modal */}
      {showBookingModal && <BookingModal />}

      {/* Quick Action Button (for mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden">
        {currentUser.role === 'patient' && (
          <button
            onClick={() => setActiveTab('doctors')}
            className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <Plus size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default HealthcareSystem;