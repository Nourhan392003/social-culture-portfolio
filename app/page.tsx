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
const [activeTab, setActiveTab] = useState<"services" | "projects" | "packages">("packages");
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
  const { data } = await supabase.from("packages").select("*");

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
await supabase.from("packages").insert([
  {
    title: pkgTitle,
    duration: pkgDuration,
    price: pkgPrice,
    original_price: pkgOriginalPrice,
    features: pkgFeatures.split("\n"),
  },
]);

  resetPackage();
  loadPackages();
};

const updatePackage = async () => {
  await supabase
    .from("packages")
    .update({
      title: pkgTitle,
      duration: pkgDuration,
      price: pkgPrice,
      features: pkgFeatures.split("\n"),
    })
    .eq("id", editingPackage.id);

  resetPackage();
  loadPackages();
};
{/*packages*/}

const deletePackage = async (id: number) => {
  await supabase.from("packages").delete().eq("id", id);
  loadPackages();
};

const resetPackage = () => {
  setEditingPackage(null);
  setPkgTitle("");
  setPkgDuration("");
  setPkgPrice("");
  setPkgFeatures("");
};
  return (
    <main className="bg-black text-white min-h-screen p-10">
      <Toaster position="top-right" />

      {/* Header */}


<div className="flex items-center justify-between px-8 pt-6">
 
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

  {user && (
    <button
      onClick={logout}
      className="bg-red-600 px-4 py-2 rounded-lg text-sm"
    >
      Logout
    </button>
  )}
</div>

      {/* About */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
  <div className="absolute w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl animate-pulse top-[-150px] right-[-150px]" />
  <div className="absolute w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-3xl animate-pulse bottom-[-150px] left-[-150px]" />
</div>
     <section className="relative text-center py-24">
        <h2 className="text-6xl font-bold text-green-400 mb-6">
          سوشيال كالتشر
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          شريكك الرقمي المتكامل في إدارة الحضور الرقمي
          وزيادة المبيعات باحترافية.
        </p>
      </section>

      {/* Stats */}
     <section className="py-16 text-center">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
    <div className="bg-[#0c1f17] border border-green-500/20 rounded-2xl p-6">
<div className="text-4xl font-bold text-green-400">
  <AnimatedNumber value={120} />%+
</div>      <div className="text-gray-400 mt-2">علامة تجارية ناجحة</div>
    </div>

    <div className="bg-[#0c1f17] border border-green-500/20 rounded-2xl p-6">
     <div className="text-4xl font-bold text-green-400">
  <AnimatedNumber value={45} />%+
</div>
      <div className="text-gray-400 mt-2">نمو في المبيعات</div>
    </div>

    <div className="bg-[#0c1f17] border border-green-500/20 rounded-2xl p-6">
      <div className="text-4xl font-bold text-green-400">
  <AnimatedNumber value={85} />%+
</div>
      <div className="text-gray-400 mt-2">نمو التفاعل الرقمي</div>
    </div>
  </div>
</section>

      {/* Services */}
      <section className="mt-24">
        {/* ===== Tabs Header ===== */}
       <div className="bg-[#0c1f17] p-2 rounded-full flex gap-2">

  <button
    onClick={() => setActiveTab("services")}
    className={`px-6 py-2 rounded-full font-bold transition ${
      activeTab === "services"
        ? "bg-green-500 text-black"
        : "text-green-400 hover:bg-green-500/10"
    }`}
  >
    خدماتنا
  </button>

  <button
    onClick={() => setActiveTab("projects")}
    className={`px-6 py-2 rounded-full font-bold transition ${
      activeTab === "projects"
        ? "bg-green-500 text-black"
        : "text-green-400 hover:bg-green-500/10"
    }`}
  >
    مشاريعنا
  </button>

  {/* 🔥 الجديد */}
  <button
    onClick={() => setActiveTab("packages")}
    className={`px-6 py-2 rounded-full font-bold transition ${
      activeTab === "packages"
        ? "bg-green-500 text-black"
        : "text-green-400 hover:bg-green-500/10"
    }`}
  >
    باقاتنا
  </button>

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
              {user && (
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
    : "bg-[#0c1f17] border border-green-500/20"
}`}
                  >

            {service.featured && (
              <span className="absolute -top-3 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                الأكثر طلبًا ⭐
              </span>
            )}

            {service.image_url && (
              <img
                src={service.image_url}
                alt={service.title}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
            )}

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
          {activeTab === "projects" && (
            <div>
              {user && (
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-green-400">
                    مشاريعنا
                  </h2>
                  <button
                    onClick={() => setShowProjectModal(true)}
                    className="bg-green-500 text-black px-6 py-2 rounded-xl font-bold hover:scale-105 transition"
                  >
                    + إضافة مشروع
                  </button>
                </div>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {projects.map((project) => (
    <div
      key={project.id}
      className="bg-[#0c1f17] rounded-3xl p-6 border border-green-500/20 shadow-xl transition hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,255,150,0.15)]"
    >
      {project.image_url && (
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-56 object-cover rounded-2xl mb-5"
        />
      )}

      <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-xs text-green-300">
        {project.details?.category ?? "Case Study"}
      </span>

      <h3 className="text-2xl font-bold text-green-400 my-4">
        {project.title}
      </h3>

      <p className="text-gray-400 text-sm mb-4">
        {project.details?.challenge ?? project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {(project.details?.results ?? []).slice(0, 2).map((r, i) => (
          <span
            key={i}
            className="px-3 py-1 text-xs rounded-full bg-black/30 border border-green-400/40"
          >
            {r}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Link
          href={`/projects/${project.id}`}
          className="text-green-400 text-sm hover:underline"
        >
          عرض التفاصيل →
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
                setEditProjectImage(project.image_url || "");
              }}
              className="bg-yellow-500 text-black px-3 py-1 rounded text-xs"
            >
              تعديل
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteProject(project.id);
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-xs"
            >
              حذف
            </button>
          </div>
        )}
      </div>
    </div>
  ))}
</div>
              </div>
          )}
          {/*packages*/}
{activeTab === "packages" && (
  <div>

    {user && (
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-green-400">
          باقاتنا
        </h2>

        <button
          onClick={() => setEditingPackage({})}
          className="bg-green-500 text-black px-6 py-2 rounded-xl font-bold hover:scale-105 transition"
        >
          + إضافة باقة
        </button>
      </div>
    )}

    {/* Grid / Scroll Container */}
 {/* Grid / Scroll Container */}
<div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4">

  {packages.map((pkg, index) => {
    const isMiddle = index === 1;

    return (
      <div
        key={pkg.id}
        className={`relative bg-[#0c1f17] rounded-3xl p-6 border border-green-500/20 shadow-xl transition duration-500 min-w-[280px] md:min-w-0
        ${isMiddle ? "md:scale-110 border-yellow-400 z-10" : "hover:scale-105"}
        `}
      >

        {isMiddle && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-4 py-1 rounded-full">
            الأكثر طلباً ⭐
          </span>
        )}

        <h3 className="text-xl font-bold text-green-400 mb-2">
          {pkg.duration}
        </h3>

        <div className="mb-4">
         <p className="text-gray-500 line-through text-lg">
  {pkg.original_price} ريال
</p>

          <p className="text-3xl font-bold text-yellow-400">
            {pkg.price} ريال
          </p>

          <span className="text-xs bg-red-600 px-3 py-1 rounded-full font-bold">
            عرض العيد 🎉
          </span>
        </div>

        <ul className="space-y-2 text-gray-300 text-sm">
          {(pkg.features || []).map((f: string, i: number) => (
            <li key={i}>• {f}</li>
          ))}
        </ul>

      </div>
    );
  })}
</div>
</div>
)}
        </motion.div>
      </section>

     {/* Client Logos */}
<section className="py-24 bg-black overflow-hidden">
  <div className="max-w-6xl mx-auto px-6 mb-16 text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-green-400 mb-4">
      عملاؤنا
    </h2>
    <p className="text-gray-500">
      نعتز بثقة شركائنا في مختلف القطاعات
    </p>
  </div>

  <div className="relative w-full overflow-hidden group">

    {/* Fade edges */}
    <div className="absolute left-0 top-0 w-40 h-full bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

    <motion.div
      className="flex gap-16 md:gap-24"
      animate={{ x: ["0%", "-50%"] }}
      transition={{
        repeat: Infinity,
        duration: Math.max(20, clients.length * 5),
        ease: "linear",
      }}
      whileHover={{ animationPlayState: "paused" }}
    >
      {[...clients, ...clients].map((client, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center min-w-[140px] md:min-w-[180px] transition duration-300"
        >
          {client.logo_url ? (
            <img
              src={client.logo_url}
              alt={client.name}
              className="max-h-10 md:max-h-12 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition duration-300"
            />
          ) : (
            <span className="text-gray-500 text-sm md:text-base">
              {client.name}
            </span>
          )}
        </div>
      ))}
    </motion.div>
  </div>
</section>

      {/* Add Service Modal */}
      {user && activeTab === "services" && showServiceModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0c1f17] p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-green-400 mb-4 font-bold">
              إضافة خدمة جديدة
            </h3>

            <input
              type="text"
              placeholder="عنوان الخدمة"
              value={newServiceTitle}
              onChange={(e) => setNewServiceTitle(e.target.value)}
              className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
            />

            <input
              type="text"
              placeholder="وصف الخدمة"
              value={newServiceDesc}
              onChange={(e) => setNewServiceDesc(e.target.value)}
              className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
            />

            <input
              type="text"
              placeholder="رابط الصورة"
              value={newServiceImage}
              onChange={(e) => setNewServiceImage(e.target.value)}
              className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
            />

            <label className="block mb-3">
              <input
                type="checkbox"
                checked={newServiceFeatured}
                onChange={(e) => setNewServiceFeatured(e.target.checked)}
              />
              Featured
            </label>

            <div className="flex gap-3">
              <button
                onClick={addService}
                className="bg-green-500 px-6 py-2 rounded text-black font-bold"
              >
                حفظ
              </button>

              <button
                onClick={() => setShowServiceModal(false)}
                className="bg-gray-600 px-6 py-2 rounded"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
{/*packages*/}
<section className="py-24 bg-black text-white">
  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-4xl text-green-400 text-center mb-16">
      باقاتنا
    </h2>

    {user && (
      <button
        onClick={() => setEditingPackage({})}
        className="bg-green-600 px-4 py-2 rounded mb-8"
      >
        + إضافة باقة
      </button>
    )}

    <div className="grid md:grid-cols-3 gap-8">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="bg-[#0c1f17] p-8 rounded-2xl border border-green-500/20"
        >
          <h3 className="text-2xl text-green-400 mb-2">
            {pkg.duration}
          </h3>

          <p className="text-3xl mb-6">{pkg.price}</p>

          <ul className="space-y-2 text-gray-300">
            {pkg.features?.map((f: string, i: number) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>

          {user && (
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setEditingPackage(pkg);
                  setPkgTitle(pkg.title);
                  setPkgDuration(pkg.duration);
                  setPkgPrice(pkg.price);
                  setPkgFeatures(pkg.features.join("\n"));
                }}
                className="bg-yellow-500 px-3 py-1 rounded"
              >
                تعديل
              </button>

              <button
                onClick={() => deletePackage(pkg.id)}
                className="bg-red-600 px-3 py-1 rounded"
              >
                حذف
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</section>
      {/* Edit Service Modal */}
      {user && editingServiceId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0c1f17] p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-green-400 mb-4 font-bold">
              تعديل الخدمة
            </h3>

            <input
              value={editServiceTitle}
              onChange={(e) => setEditServiceTitle(e.target.value)}
              className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
            />

            <input
              value={editServiceDesc}
              onChange={(e) => setEditServiceDesc(e.target.value)}
              className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
            />

            <input
              value={editServiceImage}
              onChange={(e) => setEditServiceImage(e.target.value)}
              className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
            />

            <label className="block mb-3">
              <input
                type="checkbox"
                checked={editServiceFeatured}
                onChange={(e) => setEditServiceFeatured(e.target.checked)}
              />
              Featured
            </label>

            <div className="flex gap-3">
              <button
                onClick={saveServiceEdit}
                className="bg-green-500 px-6 py-2 rounded text-black"
              >
                حفظ
              </button>

              <button
                onClick={() => setEditingServiceId(null)}
                className="bg-gray-600 px-6 py-2 rounded"
              >
                إلغاء
              </button>
            </div>

          </div>

        </div>
      )}
      {editingServiceId && (
  <button
    onClick={saveServiceEdit}
    className="bg-blue-500 text-black px-6 py-2 rounded mt-3"
  >
    حفظ التعديل
  </button>
)}
{/*packages model*/}
{editingPackage !== null && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
    <div className="bg-[#0c1f17] p-8 rounded-xl w-full max-w-lg space-y-4">

      <input
        placeholder="اسم الباقة"
        value={pkgTitle}
        onChange={(e) => setPkgTitle(e.target.value)}
        className="w-full p-2 bg-black border border-gray-600"
      />

      <input
        placeholder="المدة"
        value={pkgDuration}
        onChange={(e) => setPkgDuration(e.target.value)}
        className="w-full p-2 bg-black border border-gray-600"
      />
<input
  placeholder="السعر قبل الخصم"
  value={pkgOriginalPrice}
  onChange={(e) => setPkgOriginalPrice(e.target.value)}
  className="w-full p-2 bg-black border border-gray-600"
/>
      <input
        placeholder="السعر بعد الخصم "
        value={pkgPrice}
        onChange={(e) => setPkgPrice(e.target.value)}
        className="w-full p-2 bg-black border border-gray-600"
      />

      <textarea
        placeholder="المميزات (كل ميزة في سطر)"
        value={pkgFeatures}
        onChange={(e) => setPkgFeatures(e.target.value)}
        className="w-full p-2 bg-black border border-gray-600"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={resetPackage}
          className="bg-gray-600 px-4 py-2 rounded"
        >
          إلغاء
        </button>

        <button
          onClick={
            editingPackage.id ? updatePackage : addPackage
          }
          className="bg-green-600 px-4 py-2 rounded"
        >
          حفظ
        </button>
      </div>
    </div>
  </div>
)}

      {/* Add Project Modal */}
      {user && activeTab === "projects" && showProjectModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0c1f17] p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-green-400 mb-4 font-bold">
              إضافة مشروع جديد
            </h3>

            <input
              type="text"
              placeholder="عنوان المشروع"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
            />

            <input
              type="text"
              placeholder="وصف المشروع"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
            />
<input
  type="text"
  placeholder="التحدي (اختياري لو مختلف عن الوصف)"
  value={newProjectChallenge}
  onChange={(e) => setNewProjectChallenge(e.target.value)}
  className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
/>

<input
  type="text"
  placeholder="التصنيف (مثال: E-commerce Case Study)"
  value={newProjectCategory}
  onChange={(e) => setNewProjectCategory(e.target.value)}
  className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
/>

<input
  type="text"
  placeholder="مدة التنفيذ (مثال: خلال 6 أشهر)"
  value={newProjectDuration}
  onChange={(e) => setNewProjectDuration(e.target.value)}
  className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
/>

<textarea
  placeholder="الاستراتيجية (كل نقطة في سطر)"
  value={newProjectStrategy}
  onChange={(e) => setNewProjectStrategy(e.target.value)}
  className="w-full p-3 mb-3 rounded bg-black border border-green-600/30 h-28"
/>

<textarea
  placeholder="النتائج (كل نتيجة في سطر) مثال: +45% زيادة في المبيعات"
  value={newProjectResults}
  onChange={(e) => setNewProjectResults(e.target.value)}
  className="w-full p-3 mb-3 rounded bg-black border border-green-600/30 h-24"
/>
            <input
              type="text"
              placeholder="رابط الصورة"
              value={newProjectImage}
              onChange={(e) => setNewProjectImage(e.target.value)}
              className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
            />

            <div className="flex gap-3">
              <button
                onClick={addProject}
                className="bg-green-500 px-6 py-2 rounded text-black font-bold"
              >
                حفظ
              </button>

              <button
                onClick={() => setShowProjectModal(false)}
                className="bg-gray-600 px-6 py-2 rounded"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {user && editingProjectId && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-[#0c1f17] p-6 rounded-2xl w-full max-w-lg">
      <h3 className="text-green-400 mb-4 font-bold">
        تعديل المشروع
      </h3>

      <input
        value={editProjectTitle}
        onChange={(e) => setEditProjectTitle(e.target.value)}
        className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
      />

      <input
        value={editProjectDesc}
        onChange={(e) => setEditProjectDesc(e.target.value)}
        className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
      />

      <input
        value={editProjectImage}
        onChange={(e) => setEditProjectImage(e.target.value)}
        className="w-full p-3 mb-3 rounded bg-black border border-green-600/30"
      />

      <label className="block mb-3">

       
        Featured
      </label>

      <div className="flex gap-3">
        <button
          onClick={saveProjectEdit}
          className="bg-green-500 px-6 py-2 rounded text-black"
        >
          حفظ
        </button>

        <button
          onClick={() => setEditingProjectId(null)}
          className="bg-gray-600 px-6 py-2 rounded"
        >
          إلغاء
        </button>
      </div>
    </div>

  </div>

)}



{/* CTA */}





 
  
    <section
      id="contact"
      className="relative py-24 bg-black overflow-hidden"
    >
      {/* subtle background glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto px-6">

        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-400 mb-4">
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
          className="bg-white/5 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-10 shadow-[0_0_60px_rgba(16,185,129,0.15)] mb-12"
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
