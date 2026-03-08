"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import AnimatedNumber from "@/app/components/AnimatedNumber";
import { FaWhatsapp } from "react-icons/fa";


/* ================= Types ================= */

type Project = {
  id: number;
  title: string;
  description: string;
  image_url?: string | null;
  details?: {
    challenge?: string;
    strategy?: string[];
    results?: string[];
    category?: string;
    duration?: string;
  } | null;
};

type Service = {
  id: number;
  title: string;
  description: string;
  image_url?: string | null;
  featured?: boolean | null;
};

/* ================= Stat Component ================= */

function Stat({ number, label }: { number: number; label: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = number / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= number) {
        start = number;
        clearInterval(counter);
      }
      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(counter);
  }, [number]);

  return (
    <div className="text-center">
      <h3 className="text-4xl font-bold text-green-400">{count}+</h3>
      <p className="text-gray-500 mt-2">{label}</p>
    </div>
  );
}

/* ================= Main Component ================= */



export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState<'services' | 'projects' | 'packages'>('services');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const projectsTrackRef = useRef<HTMLDivElement | null>(null);
  const [projectsDragWidth, setProjectsDragWidth] = useState(0);
  const [projectsOffset, setProjectsOffset] = useState(0);
const [sent, setSent] = useState(false);
const [clients, setClients] = useState<any[]>([]);
const [editingClient, setEditingClient] = useState<any>(null);
const [name, setName] = useState("");
const [logo, setLogo] = useState("");
const [selectedCategory, setSelectedCategory] = useState<string>('All');

const categories = ['All', ...Array.from(new Set(projects.map(p => p.details?.category || 'Case Study')))];

// المشاريع المفلترة التي سيتم عرضها
const filteredProjects = selectedCategory === 'All' ? projects : projects.filter(p => p.details?.category === selectedCategory);



  /* ===== الباقات State ===== */
const [packages, setPackages] = useState<any[]>([]);
const [editingPackage, setEditingPackage] = useState<any>(null);
const [pkgOriginalPrice, setPkgOriginalPrice] = useState("");
const [pkgTitle, setPkgTitle] = useState("");
const [pkgDuration, setPkgDuration] = useState("");
const [pkgPrice, setPkgPrice] = useState("");
const [pkgFeatures, setPkgFeatures] = useState("");

  /* ===== Project State ===== */
 const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectImage, setNewProjectImage] = useState("");
    

  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editProjectTitle, setEditProjectTitle] = useState("");
  const [editProjectDesc, setEditProjectDesc] = useState("");
  const [editProjectImage, setEditProjectImage] = useState("");
  const [newProjectChallenge, setNewProjectChallenge] = useState("");
const [newProjectStrategy, setNewProjectStrategy] = useState(""); // كل نقطة في سطر
const [newProjectResults, setNewProjectResults] = useState("");   // كل نتيجة في سطر
const [newProjectCategory, setNewProjectCategory] = useState("E-commerce Case Study");
const [newProjectDuration, setNewProjectDuration] = useState("خلال 6 أشهر");

  /* ===== Service State ===== */
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServiceImage, setNewServiceImage] = useState("");
  const [newServiceFeatured, setNewServiceFeatured] = useState(false);

  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editServiceTitle, setEditServiceTitle] = useState("");
  const [editServiceDesc, setEditServiceDesc] = useState("");
  const [editServiceImage, setEditServiceImage] = useState("");
  const [editServiceFeatured, setEditServiceFeatured] = useState(false);






  /* ================= Fetch ================= */

  async function fetchData() {
    setLoading(true);

    const { data: projectsData } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: true });

    const { data: servicesData } = await supabase
      .from("services")
      .select("*")
      .order("featured", { ascending: false })
      .order("id", { ascending: true });

    setProjects(projectsData ?? []);
    setServices(servicesData ?? []);
    setLoading(false);
  }
const loadClients = async () => {
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, logo_url");

  if (!error && data) {
    setClients(data);
  }
};
const loadPackages = async () => {
const { data } = await supabase
  .from("packages")
  .select("*")
  .order("id", { ascending: true });

  if (data) setPackages(data);
};
 const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  setUser(session?.user ?? null);
  fetchData();
};

  /* ================= Init ================= */

 useEffect(() => {
  loadClients();
  loadPackages();
  getSession();
}, []);

  useEffect(() => {
    const track = projectsTrackRef.current;
    if (!track) return;

    const updateWidth = () => {
      const scrollWidth = track.scrollWidth;
      const clientWidth = track.clientWidth;
      const maxDrag = scrollWidth - clientWidth;
      const clamped = maxDrag > 0 ? maxDrag : 0;
      setProjectsDragWidth(clamped);
      if (clamped === 0) {
        setProjectsOffset(0);
      } else {
        setProjectsOffset((current) =>
          Math.max(-clamped, Math.min(0, current))
        );
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [projects]);

  useEffect(() => {
    if (projectsDragWidth <= 0) return;

    const interval = setInterval(() => {
      setProjectsOffset((current) => {
        const step = 420;
        const next = current - step;
        if (Math.abs(next) > projectsDragWidth) return 0;
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [projectsDragWidth, projects.length]);

  /* ================= Project CRUD ================= */

  const addProject = async () => {
  if (!newProjectTitle || !newProjectDesc) {
    toast.error("اكتبي العنوان والوصف");
    return;
  }

  const details = {
    category: newProjectCategory,
    duration: newProjectDuration,
    challenge: newProjectChallenge || newProjectDesc,
    strategy: newProjectStrategy
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    results: newProjectResults
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
  };

  const { error } = await supabase.from("projects").insert({
    title: newProjectTitle,
    description: newProjectDesc,
    image_url: newProjectImage,
    details,
  });

  if (error) {
    toast.error(error.message);
    return;
  }

  toast.success("تم إضافة المشروع ✅");
  setNewProjectTitle("");
  setNewProjectDesc("");
  setNewProjectImage("");
  setNewProjectChallenge("");
  setNewProjectStrategy("");
  setNewProjectResults("");
  setNewProjectCategory("E-commerce Case Study");
  setNewProjectDuration("خلال 6 أشهر");

  fetchData();
};

  const deleteProject = async (id: number) => {
    if (!confirm("متأكدة عايزة تحذفي المشروع؟")) return;
    await supabase.from("projects").delete().eq("id", id);
    toast.success("تم الحذف 🗑");
    fetchData();
  };

  const saveProjectEdit = async () => {
    if (!editingProjectId) return;

    await supabase
      .from("projects")
      .update({
        title: editProjectTitle,
        description: editProjectDesc,
        image_url: editProjectImage,
      })
      .eq("id", editingProjectId);

    toast.success("تم تعديل المشروع ✏️");
    setEditingProjectId(null);
    fetchData();
  };


  /* ================= Service CRUD ================= */

  const addService = async () => {
    if (!newServiceTitle || !newServiceDesc) {
      toast.error("اكتبي بيانات الخدمة");
      return;
    }

    await supabase.from("services").insert({
      title: newServiceTitle,
      description: newServiceDesc,
      image_url: newServiceImage,
      featured: newServiceFeatured,
    });

    toast.success("تم إضافة الخدمة ✅");
    setNewServiceTitle("");
    setNewServiceDesc("");
    setNewServiceImage("");
    setNewServiceFeatured(false);
    fetchData();
  };

  const deleteService = async (id: number) => {
    if (!confirm("متأكدة عايزة تحذفي الخدمة؟")) return;
    await supabase.from("services").delete().eq("id", id);
    toast.success("تم حذف الخدمة 🗑");
    fetchData();
  };

  const saveServiceEdit = async () => {
    if (!editingServiceId) return;

    await supabase
      .from("services")
      .update({
        title: editServiceTitle,
        description: editServiceDesc,
        image_url: editServiceImage,
        featured: editServiceFeatured,
      })
      .eq("id", editingServiceId);

    toast.success("تم تعديل الخدمة ✏️");
    setEditingServiceId(null);
    fetchData();
  };
 
  

  /* ================= Logout ================= */

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };
const deleteClient = async (id: number) => {
  await supabase.from("clients").delete().eq("id", id);
  loadClients();
};

const openEdit = (client: any) => {
  setEditingClient(client);
  setName(client.name || "");
  setLogo(client.logo_url || "");
};

const updateClient = async () => {
  if (!editingClient) return;

  await supabase
    .from("clients")
    .update({
      name,
      logo_url: logo,
    })
    .eq("id", editingClient.id);

  setEditingClient(null);
  loadClients();
};
  if (loading) return <div className="text-white p-10">Loading...</div>;
  const addClient = async () => {
  await supabase.from("clients").insert({
    name,
    logo_url: logo,
  });

  setEditingClient(null);
  setName("");
  setLogo("");
  loadClients();
};
  const addPackage = async () => {
  try {
    const { error } = await supabase.from('packages').insert([{
      title: pkgTitle,
      duration: pkgDuration,
      price: pkgPrice,
      originalprice: pkgOriginalPrice,
      features: pkgFeatures ? pkgFeatures.split('\n').map((f: string) => f.trim()).filter(Boolean) : [],
    }]);
    if (error) throw error;
    toast.success('تم إضافة الباقة بنجاح!');
    resetPackage(); loadPackages();
  } catch (err: any) { toast.error('حدث خطأ: ' + err.message); }
};

const updatePackage = async () => {
  try {
    const { error } = await supabase.from('packages')
      .update({
        title: pkgTitle,
        duration: pkgDuration,
        price: pkgPrice,
        originalprice: pkgOriginalPrice,
        features: pkgFeatures ? pkgFeatures.split('\n').map((f: string) => f.trim()).filter(Boolean) : [],
      })
      .eq('id', editingPackage.id);
    if (error) throw error;
    toast.success('تم تعديل الباقة بنجاح!');
    resetPackage(); loadPackages();
  } catch (err: any) { toast.error('حدث خطأ: ' + err.message); }
};



 

  const deletePackage = async (id: number) => {
    await supabase.from('packages').delete().eq('id', id);
    loadPackages();
  };

  const resetPackage = () => {
    setEditingPackage(null);
    setPkgTitle('');
    setPkgDuration('');
    setPkgPrice('');
    setPkgFeatures('');
  };



  return (
<main className="text-white min-h-screen px-4 py-6 md:p-10 relative"
  style={{
    backgroundColor: '#030d07',
    backgroundImage: `
      linear-gradient(rgba(0,255,170,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,170,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px'
  }}
>


      <Toaster position="top-right" />

      {/* Header */}


      {/* Header */}
<div className="flex items-center justify-between px-4 md:px-8 pt-4 md:pt-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
        >
          <Image
            src="/logo.png"
            alt="Social Culture"
            width={110}
            height={60}
            className="object-contain drop-shadow-[0_0_8px_rgba(0,255,170,0.6)]"
            priority
          />
        </motion.div>

        {/* أزرار الدخول والخروج */}
        <div>
          {user ? (
            <button
              onClick={logout}
              className="bg-red-600 px-6 py-2 rounded-xl text-white text-sm font-bold hover:bg-red-700 transition shadow-lg"
            >
              تسجيل الخروج
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-[#0c1f17] text-green-400 border border-green-500/30 px-6 py-2 rounded-xl text-sm font-bold hover:bg-green-500 hover:text-black transition shadow-[0_0_15px_rgba(0,255,170,0.1)]"
            >
              Login
            </Link>
          )}
        </div>
      </div>


      {/* About */}
<div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
  <div className="absolute w-[700px] h-[700px] bg-green-500/10 rounded-full blur-[120px] top-[-200px] right-[-200px] animate-pulse" />
  <div className="absolute w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[100px] bottom-[-100px] left-[-100px] animate-pulse" />
  <div className="absolute w-[400px] h-[400px] bg-green-600/5 rounded-full blur-[80px] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2" />
</div>

   <section className="relative text-center py-12 md:py-24">
  <span className="inline-block bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
    🚀 وكالة التسويق الرقمي #1
  </span>
  <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-clip-text text-transparent">
    سوشيال كالتشر
  </h2>
  <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
    شريكك الرقمي المتكامل في إدارة الحضور الرقمي وزيادة المبيعات باحترافية.
  </p>
  <div className="flex gap-4 justify-center mt-8">
    <a
  href="#contact"
  onClick={(e) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }}
  className="bg-green-500 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition shadow-[0_0_20px_rgba(0,255,170,0.3)]"
>
  ابدأ معنا الآن
</a>

  <button
  onClick={() => {
    setActiveTab('packages');
    setTimeout(() => {
      document.getElementById('packages-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }}
  className="border border-green-500/40 text-green-400 px-8 py-3 rounded-full font-bold hover:bg-green-500/10 transition"
>
  شوف باقاتنا
</button>
  </div>
</section>

      {/* Stats */}
   
<section className="py-16 text-center">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
<div className="bg-gradient-to-br from-[#0c1f17] to-[#071510] border border-green-500/20 rounded-2xl p-6 hover:border-green-400/50 hover:shadow-[0_0_30px_rgba(0,255,170,0.08)] transition-all duration-300 hover:-translate-y-1">
      <div className="text-4xl mb-2">📈</div>
      <div className="text-4xl font-bold text-green-400"><AnimatedNumber value={120} />%+</div>
      <div className="text-gray-400 mt-2">علامة تجارية ناجحة</div>
    </div>
    <div className="bg-gradient-to-br from-[#0c1f17] to-[#071510] border border-green-500/20 rounded-2xl p-6 hover:border-green-400/50 hover:shadow-[0_0_30px_rgba(0,255,170,0.08)] transition-all duration-300 hover:-translate-y-1">

      <div className="text-4xl mb-2">💰</div>
      <div className="text-4xl font-bold text-green-400"><AnimatedNumber value={45} />%+</div>
      <div className="text-gray-400 mt-2">نمو في المبيعات</div>
    </div>
<div className="bg-gradient-to-br from-[#0c1f17] to-[#071510] border border-green-500/20 rounded-2xl p-6 hover:border-green-400/50 hover:shadow-[0_0_30px_rgba(0,255,170,0.08)] transition-all duration-300 hover:-translate-y-1">
      <div className="text-4xl mb-2">🔥</div>
      <div className="text-4xl font-bold text-green-400"><AnimatedNumber value={85} />%+</div>
      <div className="text-gray-400 mt-2">نمو التفاعل الرقمي</div>
    </div>
  </div>
</section>

      {/* Services */}
<section className="mt-24" id="packages-section">
        {/* ===== Tabs Header ===== */}
 {/* Tabs Header */}
<div className="flex justify-center mb-10">
<div className="bg-gradient-to-r from-[#0c1f17] to-[#071510] p-2 rounded-full flex gap-2 w-full max-w-xl border border-green-500/20 shadow-[0_0_30px_rgba(0,255,170,0.05)]">
    <button 
      onClick={() => setActiveTab('services')} 
      className={`flex-1 py-3 rounded-full font-bold transition-all duration-300 text-sm md:text-base ${
        activeTab === 'services' 
        ? 'bg-green-500 text-black shadow-md' 
        : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
      }`}
    >
      خدماتنا
    </button>
    <button 
      onClick={() => setActiveTab('projects')} 
      className={`flex-1 py-3 rounded-full font-bold transition-all duration-300 text-sm md:text-base ${
        activeTab === 'projects' 
        ? 'bg-green-500 text-black shadow-md' 
        : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
      }`}
    >
      مشاريعنا
    </button>
    <button 
      onClick={() => setActiveTab('packages')} 
      className={`flex-1 py-3 rounded-full font-bold transition-all duration-300 text-sm md:text-base ${
        activeTab === 'packages' 
        ? 'bg-green-500 text-black shadow-md' 
        : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
      }`}
    >
      باقاتنا
    </button>
  </div>
</div>

        {/* ===== Tab Content ===== */}
       <motion.div
  key={activeTab}
  initial={{ opacity: 0, y: 40, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
          {/* ================= Services ================= */}
          {activeTab === "services" && (
            <div>
         const updatePackage     {user && (
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-green-400">
                    خدماتنا
                  </h2>
                  <button
                    onClick={() => setShowServiceModal(true)}
                    className="bg-green-500 text-black px-6 py-2 rounded-xl font-bold hover:scale-105 transition"
                  >
                    + إضافة خدمة
                  </button>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-8">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`relative group p-6 rounded-3xl 
transition-all duration-300 ease-in-out
hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,255,150,0.15)]
hover:scale-[1.02]
${
  service.featured
    ? "bg-[#102d21] border-2 border-yellow-400 shadow-2xl scale-105"
   : "bg-gradient-to-br from-[#0c1f17] to-[#071510] border border-green-500/20 hover:border-green-400/40"
}`}
                  >

            {service.featured && (
              <span className="absolute -top-3 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                الأكثر طلبًا ⭐
              </span>
            )}

         {service.image_url && (
  <div className="relative w-full h-40 mb-4">
    <img 
      src={service.image_url} 
      alt={service.title} 
      className="w-full h-full object-cover rounded-xl" 
      loading="lazy"
    />
  </div>
)}



            )

            <h3 className="text-xl font-bold text-green-400 mb-3">
              {service.title}
            </h3>

            <p className="text-gray-400 text-sm">
              {service.description}
            </p>
            {user && (
  <div className="absolute inset-0 bg-black/60 
  backdrop-blur-sm 
  opacity-0 group-hover:opacity-100 
  transition duration-300 
  flex items-center justify-center gap-4 rounded-3xl">

    <button
      onClick={() => {
        setEditingServiceId(service.id);
        setEditServiceTitle(service.title);
        setEditServiceDesc(service.description);
        setEditServiceImage(service.image_url || "");
        setEditServiceFeatured(service.featured || false);
      }}
      className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
    >
      تعديل
    </button>

    <button
      onClick={() => deleteService(service.id)}
      className="bg-red-600 px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
    >
      حذف
    </button>
  </div>
)}

            {user && (
  <div className="flex gap-3 mt-6">
    <button
      onClick={() => {
        setEditingServiceId(service.id);
        setEditServiceTitle(service.title);
        setEditServiceDesc(service.description);
        setEditServiceImage(service.image_url || "");
        setEditServiceFeatured(service.featured || false);
      }}
      className="bg-yellow-500 text-black px-3 py-1 rounded text-sm"
    >
      تعديل
    </button>

    <button
      onClick={() => deleteService(service.id)}
      className="bg-red-600 px-3 py-1 rounded text-sm"
    >
      حذف
    </button>
  </div>
)}


                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= Projects ================= */}
{/* المشاريع */}
        {/* Projects */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(0,255,170,0.4)]'
:"bg-gradient-to-br from-[#0c1f17] to-[#071510] border border-green-500/20 rounded-2xl p-6 hover:border-green-400/50 hover:shadow-[0_0_30px_rgba(0,255,170,0.08)] transition-all duration-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-green-400">أعمالنا</h2>
              {user && (
                <button onClick={() => setShowProjectModal(true)} className="bg-green-500 text-black px-6 py-2 rounded-xl font-bold hover:scale-105 transition">
                  + إضافة مشروع
                </button>
              )}
            </div>

            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project: any) => {
                const imageUrl = project.imageurl || project.image_url;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={project.id}
                    className="bg-[#0c1f17] rounded-3xl p-6 border border-green-500/20 shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,255,150,0.15)] hover:scale-[1.02] flex flex-col h-full"
                  >
                    {/* الصورة */}
                    {imageUrl ? (
                      <div className="relative w-full h-40 mb-4 shrink-0">
                        <img
                          src={imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover rounded-xl"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-40 mb-4 shrink-0 bg-green-900/20 flex items-center justify-center rounded-xl border border-green-500/10">
                        <span className="text-green-500/50 text-sm font-semibold">لا توجد صورة مضافة</span>
                      </div>
                    )}

                    <div className="mb-3 mt-2">
                      <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-xs text-green-300">
                        {project.details?.category ?? 'دراسة حالة'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-green-400 mb-3">
                      {project.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                      {project.details?.challenge ?? project.description}
                    </p>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-green-500/10">
                      <Link href={`/projects/${project.id}`} className="text-green-400 text-sm hover:underline font-semibold">
                        عرض التفاصيل ←
                      </Link>

                      {user && (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEditingProjectId(project.id);
                              setEditProjectTitle(project.title);
                              setEditProjectDesc(project.description);
                              setEditProjectImage(imageUrl);
                            }}
                            className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-bold"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteProject(project.id);
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold"
                          >
                            حذف
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* packages */}
        {activeTab === 'packages' && (
          <div>
            {user && (
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-green-400">إدارة الباقات</h2>
                <button
                  onClick={() => setEditingPackage({})}
                  className="bg-green-500 text-black px-6 py-2 rounded-xl font-bold hover:scale-105 transition"
                >
                  + إضافة باقة
                </button>
              </div>
            )}

            {/* Grid Container */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pb-10 px-2 md:px-0">
              {packages.map((pkg: any, index: number) => {
                const isMiddle = index === 1 || index === 3;
                
                // هنا يتم فك دمج السعرين بشكل ذكي
                const priceStr = String(pkg.price || "");
                const hasOldPrice = priceStr.includes('|');
                const oldPrice = hasOldPrice ? priceStr.split('|')[0] : "";
                const currentPrice = hasOldPrice ? priceStr.split('|')[1] : priceStr;

                return (
                  <div
                    key={pkg.id}
                    className={`relative bg-[#0c1f17] rounded-3xl p-8 border border-green-500/20 shadow-xl transition-all duration-500 flex flex-col h-full ${
                      isMiddle
                        ? 'md:-mt-8 md:mb-8 border-yellow-400 z-10 shadow-[0_0_30px_rgba(250,204,21,0.15)]'
                        : ' hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(0,255,170,0.1)]'
                    }`}
                  >
                    {isMiddle && (
                      <div className="absolute -top-4 left-0 right-0 flex justify-center">
                        <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold px-6 py-1.5 rounded-full shadow-lg">
                          الأكثر طلباً
                        </span>
                      </div>
                    )}

                  {/* Package Header */}
<div className="text-center mb-8 border-b border-green-500/10 pb-6">
 <h3 className="text-2xl font-bold text-green-400 mb-4">{pkg.title}</h3>
<p className="text-sm text-gray-400 mb-2"> <span className="text-white font-semibold">{pkg.duration}</span></p>

  <p className="text-gray-400 text-sm mb-4">{pkg.duration}</p>
  <div className="flex flex-col items-center justify-center min-h-[100px]">
    {pkg.originalprice && pkg.originalprice.trim() !== "" && (
      <span className="text-gray-500 line-through text-lg mb-1">
        {pkg.originalprice} ريال
      </span>
    )}
    <div className="flex items-baseline gap-1">
      <span className="text-4xl font-bold text-yellow-400">{pkg.price}</span>
      <span className="text-gray-400 text-sm">ريال</span>
    </div>
    <span className="text-xs bg-red-600/20 text-red-500 border border-red-500/30 px-3 py-1 rounded-full font-bold mt-3 inline-block">
      عرض العيد 🎁
    </span>
  </div>
</div>


                    {/* Features List */}
                    <ul className="space-y-4 text-gray-300 text-sm flex-grow mb-8">
                      {pkg.features?.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="bg-green-500/20 p-1 rounded-full shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Admin Controls */}
                    {user ? (
                      <div className="flex gap-3 mt-auto pt-6 border-t border-green-500/20">
                        <button
                          onClick={() => {
                            setEditingPackage(pkg);
                            setPkgTitle(pkg.title || "");
                            setPkgDuration(pkg.duration || "");
                            setPkgPrice(currentPrice); // جلب السعر الجديد فقط للخانة
                            setPkgOriginalPrice(oldPrice); // جلب السعر القديم فقط للخانة
                            setPkgFeatures(pkg.features ? pkg.features.join("\n") : ""); 
                          }}
                          className="flex-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/50 hover:bg-yellow-500 hover:text-black transition-colors py-2.5 rounded-xl text-sm font-bold"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('هل أنت متأكد من الحذف؟')) deletePackage(pkg.id);
                          }}
                          className="flex-1 bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors py-2.5 rounded-xl text-sm font-bold"
                        >
                          حذف
                        </button>
                      </div>
                    ) : (
                      <div className="mt-auto">
                      <a
  href="#contact"
  onClick={(e) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }}
  className={`block w-full py-4 rounded-xl text-center font-bold transition-all duration-300 ${
    isMiddle
      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.3)]'
      : 'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-black'
  }`}
>
  {isMiddle ? '⭐ اطلب الباقة الآن' : 'اطلب الباقة'}
</a>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
</motion.div>
</section>

       
     


   
      {/* Add Service Modal */}
      {user && activeTab === "services" && showServiceModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0c1f17] p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-green-400 mb-4 font-bold">إضافة خدمة جديدة</h3>
            <input type="text" placeholder="العنوان" value={newServiceTitle} onChange={(e) => setNewServiceTitle(e.target.value)} className="w-full p-3 mb-3 rounded bg-black border border-green-600/30" />
            <input type="text" placeholder="الوصف" value={newServiceDesc} onChange={(e) => setNewServiceDesc(e.target.value)} className="w-full p-3 mb-3 rounded bg-black border border-green-600/30" />
            <input type="text" placeholder="رابط الصورة" value={newServiceImage} onChange={(e) => setNewServiceImage(e.target.value)} className="w-full p-3 mb-3 rounded bg-black border border-green-600/30" />
            <label className="block mb-3">
              <input type="checkbox" checked={newServiceFeatured} onChange={(e) => setNewServiceFeatured(e.target.checked)} /> خدمة مميزة؟
            </label>
            <div className="flex gap-3">
              <button onClick={addService} className="bg-green-500 px-6 py-2 rounded text-black font-bold">حفظ</button>
              <button onClick={() => setShowServiceModal(false)} className="bg-gray-600 px-6 py-2 rounded">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {user && editingServiceId !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0c1f17] p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-green-400 mb-4 font-bold">تعديل الخدمة</h3>
            <input value={editServiceTitle} onChange={(e) => setEditServiceTitle(e.target.value)} className="w-full p-3 mb-3 rounded bg-black border border-green-600/30" />
            <input value={editServiceDesc} onChange={(e) => setEditServiceDesc(e.target.value)} className="w-full p-3 mb-3 rounded bg-black border border-green-600/30" />
            <input value={editServiceImage} onChange={(e) => setEditServiceImage(e.target.value)} className="w-full p-3 mb-3 rounded bg-black border border-green-600/30" />
            <label className="block mb-3">
              <input type="checkbox" checked={editServiceFeatured} onChange={(e) => setEditServiceFeatured(e.target.checked)} /> خدمة مميزة؟
            </label>
            <div className="flex gap-3">
              <button onClick={saveServiceEdit} className="bg-green-500 px-6 py-2 rounded text-black">تعديل</button>
              <button onClick={() => setEditingServiceId(null)} className="bg-gray-600 px-6 py-2 rounded">إلغاء</button>
            </div>
          </div>
        </div>
      )}

           {/* packages model */}
      {editingPackage !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c1f17] p-8 rounded-xl w-full max-w-lg space-y-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-green-400 mb-6 text-center">
              {editingPackage.id ? 'تعديل الباقة' : 'إضافة باقة جديدة'}
            </h3>
            
            <input 
              placeholder="اسم الباقة (مثال: الباقة الأساسية - شهر)" 
              value={pkgTitle} 
              onChange={(e) => setPkgTitle(e.target.value)} 
              className="w-full p-3 bg-black border border-green-500/30 rounded-xl" 
            />
            <input
  placeholder="المدة (مثال: شهر، 3 أشهر، سنة)"
  value={pkgDuration}
  onChange={e => setPkgDuration(e.target.value)}
  className="w-full p-3 bg-black border border-green-500/30 rounded-xl"
/>
            
            <input 
              placeholder="السعر قبل الخصم (اختياري - سيظهر مشطوباً)" 
              value={pkgOriginalPrice} 
              onChange={(e) => setPkgOriginalPrice(e.target.value)} 
              className="w-full p-3 bg-black border border-green-500/30 rounded-xl" 
            />
            
            <input 
              placeholder="السعر الحالي" 
              value={pkgPrice} 
              onChange={(e) => setPkgPrice(e.target.value)} 
              className="w-full p-3 bg-black border border-green-500/30 rounded-xl" 
            />
            
            <textarea 
              placeholder="المميزات (افصل بينها بفاصلة ،)" 
              value={pkgFeatures} 
              onChange={(e) => setPkgFeatures(e.target.value)} 
              className="w-full p-3 bg-black border border-green-500/30 rounded-xl h-32" 
            />
            
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={resetPackage} className="bg-gray-600 px-6 py-3 rounded-xl text-white font-bold w-full">إلغاء</button>
              <button onClick={editingPackage.id ? updatePackage : addPackage} className="bg-green-600 px-6 py-3 rounded-xl text-black font-bold w-full">
                {editingPackage.id ? 'حفظ التعديلات' : 'إضافة الباقة'}
              </button>
            </div>
          </div>
        </div>
      )}



{/* CTA */}





 
  
<section id="contact" className="relative py-24 bg-gradient-to-b from-[#030d07] via-[#051209] to-black overflow-hidden">
      {/* subtle background glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto px-6">

        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-emerald-400 mb-4">

            خلينا نبدأ مشروعك
          </h2>
          <p className="text-gray-400">
            املأ النموذج وسنتواصل معك خلال 24 ساعة.
          </p>
        </div>

        {/* Animated Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-5 shadow-[0_0_60px_rgba(16,185,129,0.15)] mb-10"
        >
          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);

              const formData = new FormData(e.currentTarget);
              

              const name = formData.get("name") as string;
              const email = formData.get("email") as string;
              const message = formData.get("message") as string;
 // 🔐 Honeypot Anti-Spam
  const company = formData.get("company");
  if (company) {
    setLoading(false);
    return;
  }

  
              // validation بسيطة
              if (!name || !email || !message) {
                toast.error("من فضلك املأ جميع الحقول");
                setLoading(false);
                return;
              }

              const res = await fetch("/api/contact", {
                method: "POST",
                body: JSON.stringify({ name, email, message }),
              });

              setLoading(false);

              if (res.ok) {
                toast.success("تم إرسال الرسالة بنجاح 🚀");
                e.currentTarget.reset();
              } else {
                toast.error("حدث خطأ، حاول مرة أخرى");
              }
            }}
            
          >
            <input
  type="text"
  name="company"
  className="hidden"
/>
            <input
              name="name"
              type="text"
              placeholder="اسمك بالكامل"
              className="w-full bg-black/50 border border-emerald-500/30 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
            />

            <input
              name="email"
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full bg-black/50 border border-emerald-500/30 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
            />

            <textarea
              name="message"
              rows={4}
              placeholder="اكتب تفاصيل مشروعك..."
              className="w-full bg-black/50 border border-emerald-500/30 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-black font-semibold py-4 rounded-xl hover:scale-[1.02] transition duration-300 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                "إرسال الرسالة"
              )}
            </button>
          </form>
        </motion.div>

        {/* WhatsApp */}
        <div className="text-center border-t border-emerald-500/20 pt-8">
          <p className="text-gray-400 mb-4">
            أو يمكنك التواصل مباشرة عبر واتساب
          </p>

          <a
            href="https://wa.me/201011405879?text=مرحباً%20أرغب%20في%20بدء%20مشروع%20معكم"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-emerald-500 text-emerald-400 px-8 py-3 rounded-2xl hover:bg-emerald-500 hover:text-black transition duration-300"
          >
            <FaWhatsapp size={20} />
            تواصل عبر واتساب
          </a>
        </div>
      </div>
    </section>
    {editingClient && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-[#0c1f17] p-8 rounded-2xl w-[400px] space-y-4">

      <input
        placeholder="اسم العميل"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 bg-black border border-gray-600 w-full"
      />

      <input
        placeholder="رابط اللوجو"
        value={logo}
        onChange={(e) => setLogo(e.target.value)}
        className="p-2 bg-black border border-gray-600 w-full"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setEditingClient(null)}
          className="bg-gray-600 px-4 py-2 rounded"
        >
          إلغاء
        </button>

        <button
onClick={() => {
  if (editingClient?.id) {
    updateClient();
  } else {
    addClient();
  }
}}        >
          حفظ
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}
