'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const jobs = [
    {
      id: 1,
      title: "مهندس برمجيات",
      company: "تك سوليوشنز",
      location: "القاهرة",
      type: "دوام كامل",
      description: "نبحث عن مهندس برمجيات ذو خبرة في تطوير تطبيقات الويب...",
      salary: "15,000 - 25,000 جنيه",
      requirements: ["خبرة 3+ سنوات", "React", "Node.js", "TypeScript"],
    },
    {
      id: 2,
      title: "مدير مشروع",
      company: "سمارت سيستمز",
      location: "الإسكندرية",
      type: "دوام كامل",
      description: "مطلوب مدير مشروع لقيادة فريق تطوير البرمجيات...",
      salary: "30,000 - 40,000 جنيه",
      requirements: ["خبرة 5+ سنوات", "إدارة الفرق", "Agile", "Scrum"],
    },
    // Add more job listings as needed
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="ابحث عن وظيفة..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 border rounded-md"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="all">جميع المواقع</option>
            <option value="القاهرة">القاهرة</option>
            <option value="الإسكندرية">الإسكندرية</option>
            <option value="عن بعد">عن بعد</option>
          </select>
          <select
            className="w-full px-4 py-2 border rounded-md"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">جميع أنواع الوظائف</option>
            <option value="دوام كامل">دوام كامل</option>
            <option value="دوام جزئي">دوام جزئي</option>
            <option value="عن بعد">عن بعد</option>
          </select>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {job.type}
              </span>
            </div>
            <p className="text-gray-700 mb-4">{job.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {job.requirements.map((req, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                >
                  {req}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-gray-600">
                <span className="ml-4">📍 {job.location}</span>
                <span>💰 {job.salary}</span>
              </div>
              <Link
                href={`/jobs/${job.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                تقدم للوظيفة
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 