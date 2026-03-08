import type { Metadata } from 'next'; 
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
             
  onClick={() => window.location.href = '/'} 
  className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors mb-8 border border-gray-800 hover:border-green-500/50 px-4 py-2 rounded-full text-sm"
>
  ← الرجوع للرئيسية
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

             {/* ملخص النجاح (بديل كارت العميل) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-3xl mx-auto mt-16 p-8 rounded-3xl bg-gradient-to-b from-[#0c1f17] to-black border border-green-500/20 shadow-[0_0_30px_rgba(0,255,170,0.05)] relative overflow-hidden"
      >
        {/* تأثير جمالي في الخلفية */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 text-center space-y-4">
          {/* أيقونة تعبر عن النجاح بدلاً من صورة العميل */}
          <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/30 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-green-400">
            ملخص الإنجاز
          </h3>
          
          <p className="text-gray-300 leading-relaxed text-lg italic">
            "نجحنا من خلال هذه الاستراتيجية في تحويل التحديات إلى فرص حقيقية، وبناء تواجد رقمي فعال يركز على تحقيق نتائج ملموسة ونمو مستدام في المبيعات، بدلاً من مجرد التواجد الشكلي."
          </p>
        </div>
      </motion.div>
    </div>
  </main>
);
}