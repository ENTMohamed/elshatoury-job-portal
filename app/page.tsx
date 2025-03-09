import Link from 'next/link';

export default function Home() {
  const featuredJobs = [
    {
      id: 1,
      title: "مهندس برمجيات",
      company: "تك سوليوشنز",
      location: "القاهرة",
      type: "دوام كامل",
    },
    {
      id: 2,
      title: "مدير مشروع",
      company: "سمارت سيستمز",
      location: "الإسكندرية",
      type: "دوام كامل",
    },
    {
      id: 3,
      title: "مصمم واجهات المستخدم",
      company: "ديجيتال هب",
      location: "القاهرة",
      type: "عن بعد",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              ابحث عن وظيفتك المثالية
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              نوفر لك فرص عمل متميزة في أفضل الصيدليات. قدم الآن وانضم إلى فريقنا!
            </p>
            <div className="mt-10">
              <Link
                href="/apply"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-50 transition-colors"
              >
                قدم الآن
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">لماذا تختار العمل معنا؟</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">فرص متنوعة</h3>
              <p className="text-gray-600">
                نوفر فرص عمل متنوعة تناسب مختلف المؤهلات والخبرات
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">بيئة عمل مميزة</h3>
              <p className="text-gray-600">
                نحرص على توفير بيئة عمل محفزة ومريحة لجميع موظفينا
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">تطور مستمر</h3>
              <p className="text-gray-600">
                نقدم فرص للتدريب والتطوير المهني المستمر
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">الوظائف المميزة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {job.title}
              </h3>
              <p className="text-gray-600 mb-4">{job.company}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{job.location}</span>
                <span>{job.type}</span>
              </div>
              <Link
                href={`/jobs/${job.id}`}
                className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
              >
                عرض التفاصيل
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 