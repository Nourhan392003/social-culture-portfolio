"use client";
import AnimatedNumber from "@/app/components/AnimatedNumber";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Client = {
  id: number;
  client_name: string;
  client_logo?: string;
  website_url?: string;
  project_id: number;
};

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

export default function ProjectCaseStudyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;

      setLoading(true);

      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", Number(params.id))
        .single();

      if (!projectError && projectData) {
        setProject(projectData as Project);
      }

      // Fetch dynamic clients
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("*")
        .eq("project_id", Number(params.id));

      if (!clientsError && clientsData) {
        setClients(clientsData as Client[]);
      }

      setLoading(false);
    };

    load();
  }, [params?.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-gray-300 flex items-center justify-center">
        <span className="text-sm tracking-wide">
          جاري تحميل الدراسة التسويقية...
        </span>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-black text-gray-300 flex flex-col items-center justify-center p-6">
        <p className="mb-6 text-lg text-gray-400">
          لم يتم العثور على هذه الدراسة.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-5 py-2 rounded-full bg-green-500 text-black font-semibold hover:scale-105 transition"
        >
          الرجوع إلى المشاريع
        </button>
        
      </main>
    );
  }
 

  return (
    <main className="min-h-screen bg-black text-gray-200">

      {/* Hero */}
      <section className="relative h-96 w-full overflow-hidden">
        {project.image_url && (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/70 to-black" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-5xl mx-auto px-6 pb-10">
            <div className="mb-4 flex flex-wrap gap-3 items-center">
              <span className="px-4 py-1 rounded-full bg-green-500/10 border border-green-400/40 text-xs text-green-300">
                E-commerce Case Study
              </span>
            </div>

            <motion.h1
              className="text-4xl md:text-5xl font-bold text-green-400 mb-3 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {project.title}
            </motion.h1>

            <motion.p
              className="text-sm md:text-base text-gray-300 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              دراسة حالة تسويقية لمشروع رقمي تم العمل عليه داخل سوشيال
              كالتشر، توضح كيف تم تحويل التحديات إلى نتائج ملموسة ونمو حقيقي
              في الأداء.
            </motion.p>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/15 text-xs md:text-sm text-gray-200 hover:bg-white/10 transition"
              >
                <span>← الرجوع إلى المشاريع</span>
              </button>
            </motion.div>
          </div>
        </div>
         
      </section>
      
      <div className="max-w-5xl mx-auto px-6 py-14 space-y-12">
        {/* Overview */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-green-300 mb-3">
            نظرة عامة
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            عملنا مع عميل في قطاع التجارة الإلكترونية يعاني من ضعف في المبيعات
            الرقمية وتشتت في الهوية الاتصالية عبر المنصات. كان الهدف بناء حضور
            رقمي متماسك وتحويل الجمهور من مجرد متابعين إلى عملاء حقيقيين
            بشكل مستدام.
          </p>
        </motion.section>

    {/* Challenge */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-green-300 mb-3">
            التحدي
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            واجه العميل تحديات في تحويل التفاعل على المنصات الاجتماعية إلى
            نتائج فعلية على مستوى المبيعات. المحتوى كان غير متناسق، الرسائل
            الإعلانية غير واضحة، وتجربة العملاء الرقمية غير سلسة. تم استخدام
            وصف المشروع الأساسي كنقطة انطلاق:
          </p>
          <p className="mt-3 text-sm md:text-base text-gray-400 leading-relaxed">
         {project.details?.challenge ?? project.description}
          </p>
        </motion.section>

        {/* Strategy */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-green-300 mb-3">
            الاستراتيجية
          </h2>
          <ul className="list-disc list-inside text-sm md:text-base text-gray-300 space-y-2 leading-relaxed">
            <li>
              تحليل شامل لسلوك الجمهور ومسار اتخاذ القرار عبر القنوات الرقمية
              المختلفة.
            </li>
            <li>
              تطوير هوية محتوى موحّدة تعكس شخصية العلامة وقيمتها المضافة بشكل
              واضح.
            </li>
            <li>
              إطلاق حملات إعلانية مدفوعة مع رسائل موجهة لكل شريحة وتخصيص رحلات
              إعادة الاستهداف.
            </li>
            <li>
              تحسين صفحات الهبوط وتجربة الشراء لرفع معدل التحويل وتقليل التسرب.
            </li>
            <li>
              متابعة أسبوعية للأرقام وتحسين مستمر بناءً على البيانات الحقيقية.
            </li>
          </ul>
        </motion.section>

        {/* Results */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-green-300 mb-4">
            النتائج
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4">
            خلال فترة ستة أشهر من العمل المتواصل، حقق العميل قفزة نوعية في
            الأداء الرقمي انعكست مباشرة على نمو المبيعات وقيمة العلامة.
          </p>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">

  <div className="text-center">
    <div className="text-4xl font-bold text-green-400">
      +<AnimatedNumber value={45} />%
    </div>
    <p className="text-gray-400 text-sm mt-2">
      زيادة في المبيعات
    </p>
  </div>

  <div className="text-center">
    <div className="text-4xl font-bold text-green-400">
      +<AnimatedNumber value={28} />%
    </div>
    <p className="text-gray-400 text-sm mt-2">
      تحسن في معدل التحويل
    </p>
  </div>

  <div className="text-center">
    <div className="text-4xl font-bold text-green-400">
      <AnimatedNumber value={85} />%
    </div>
    <p className="text-gray-400 text-sm mt-2">
      نمو في التفاعل الرقمي
    </p>
  </div>

  <div className="text-center">
    <div className="text-4xl font-bold text-green-400">
      <AnimatedNumber value={6} />
    </div>
    <p className="text-gray-400 text-sm mt-2">
      أشهر من العمل
    </p>
  </div>

</div>
        </motion.section>

        {/* Testimonial */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-6xl md:text-7xl text-emerald-900/35 font-serif">
                “
              </span>
            </div>

            <div className="relative bg-[#050c09] border border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.5)] rounded-3xl px-6 py-7 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border border-green-400/70 mb-1">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-2xl text-white">
                    {project.title.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-1 text-sm text-yellow-400">
                <span>★★★★★</span>
              </div>

              <div>
                <p className="text-sm md:text-base font-semibold text-green-400">
                  اسم العميل
                </p>
                <p className="text-xs md:text-sm text-gray-400">
                  CEO / Founder
                </p>
              </div>

              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                تجربة العمل مع سوشيال كالتشر كانت نقطة تحول حقيقية في حضورنا
                الرقمي. الفريق فهم التحديات من اليوم الأول، وركز على بناء
                نتائج ملموسة يمكن قياسها وليس مجرد تواجد شكلي على المنصات.
              </p>
            </div>
          </div>
        </motion.section>
{/* Client Logos */}
{clients.length > 0 && (
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="relative pt-20 pb-10"
  >
    {/* Background glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-green-500/5 rounded-full blur-[120px] -z-10" />

    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-4">
        عملاؤنا
      </h2>
      <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
        شركات رائدة وثقت في قدرتنا على صناعة الفارق الرقمي
      </p>
    </div>

    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8"
    >
      {clients.map((client) => (
        <motion.div
          key={client.id}
          variants={{
            hidden: { opacity: 0, scale: 0.9, y: 20 },
            show: { opacity: 1, scale: 1, y: 0 },
          }}
          whileHover={{ y: -8, scale: 1.05 }}
          className="relative flex items-center justify-center p-8 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-green-500/40 transition-all duration-500 group cursor-pointer overflow-hidden shadow-xl"
          onClick={() =>
            client.website_url &&
            window.open(client.website_url, "_blank", "noopener,noreferrer")
          }
        >
          {/* Hover gradient */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 pointer-events-none" />

          {client.client_logo ? (
            <img
              src={client.client_logo}
              alt={client.client_name}
              className="max-h-14 w-auto object-contain transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:brightness-110"
            />
          ) : (
            <span className="text-xs md:text-sm font-bold text-gray-500 group-hover:text-green-400 transition-all duration-500 text-center uppercase tracking-widest leading-tight">
              {client.client_name}
            </span>
          )}
        </motion.div>
      ))}
    </motion.div>
 </motion.section>
)}

      </div>
    </main>
  );
}