import { connectToDatabase } from "@/lib/mongodb";
import Skill from "@/models/Skill";

export const revalidate = 3600;

export default async function SkillsPage() {
  await connectToDatabase();
  const allSkills = await Skill.find().sort({ order: 1 }).lean();

  // Group skills by category
  const groupedSkills = allSkills.reduce<Record<string, typeof allSkills>>( (acc, skill) => {
    const category = skill.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <main className="min-h-screen py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Technical Arsenal</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          The frameworks, languages, and tools I use to build scalable digital products.
        </p>
      </div>

      <div className="space-y-16">
        {Object.keys(groupedSkills).map((category) => (
          <section key={category}>
            <h2 className="text-2xl font-bold mb-6 border-b border-neutral-800 pb-2 inline-block">
              {category}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {groupedSkills[category].map((skill) => (
                <div 
                  key={typeof skill._id === "string" ? skill._id : skill._id?.toString() ?? `${skill.name}-${skill.category}`}
                  className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center justify-center hover:border-neutral-600 transition group"
                >
                  {/* Assuming icon is an SVG string or image URL. Render safely. */}
                  <div 
                    className="w-12 h-12 mb-4 text-neutral-400 group-hover:text-white transition"
                    dangerouslySetInnerHTML={{ __html: skill.icon }}
                  />
                  <h3 className="font-semibold text-sm text-center">{skill.name}</h3>
                  <div className="w-full bg-neutral-950 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${skill.percentage}%`,
                        backgroundColor: skill.color || '#3b82f6'
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}