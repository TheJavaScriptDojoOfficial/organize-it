import CategoryCard from "../components/organizer/CategoryCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import SectionHeader from "../components/ui/SectionHeader";
import StatusMessage from "../components/ui/StatusMessage";

const categories = [
  { icon: "videocam", label: "Videos", count: "8", sample: "demo_recording.mp4, product_tour.mov" },
  { icon: "description", label: "Docs", count: "15", sample: "project_brief.docx, specs_v3.txt" },
  { icon: "picture_as_pdf", label: "PDF", count: "6", tone: "error" as const },
  { icon: "code", label: "Code", count: "10", tone: "tertiary" as const },
  { icon: "inventory_2", label: "Others", count: "5" },
];

export default function OrganizerPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fb] px-6 py-10 text-[#2a3439]">
      <div className="mx-auto max-w-5xl space-y-10">
        <section className="space-y-3 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-[2.75rem]">Organize Downloads</h1>
          <p className="mx-auto max-w-2xl text-sm text-[#566166]">
            Clean your folders in one click with the precision of a digital atelier. Automated
            categorization at your fingertips.
          </p>
        </section>

        <StatusMessage
          title="Files organized successfully"
          detail="68 files moved • 8 folders created"
          actionLabel="Undo"
        />

        <section className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          <Card className="space-y-5 p-7 md:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#566166]">Selected path</p>
            <div className="flex flex-wrap gap-3">
              <div className="min-w-56 flex-1">
                <Input defaultValue="/Users/demo/Downloads" icon="folder_open" readOnly />
              </div>
              <Button variant="secondary">Browse</Button>
            </div>
          </Card>
          <Card className="space-y-4 p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#566166]">
              Ready to index
            </p>
            <Button variant="primary" size="lg" className="w-full" icon="search_insights">
              Scan Files
            </Button>
          </Card>
        </section>

        <section className="space-y-5">
          <SectionHeader title="File Breakdown" meta="68 files detected" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2">
            <CategoryCard
              icon="image"
              label="Images"
              count="24"
              large
              tone="primary"
              sample="vacation_photo_01.jpg, dashboard_mock.png, logo_v2.svg"
            />
            {categories.map((category) => (
              <CategoryCard key={category.label} {...category} />
            ))}
          </div>
        </section>

        <section className="flex flex-col items-center gap-5 pb-10">
          <Button variant="primary" size="lg" icon="auto_mode" className="rounded-2xl px-12">
            Organize My Files
          </Button>
          <p className="inline-flex items-center gap-2 text-sm text-[#566166]">
            <span className="material-symbols-outlined text-base">info</span>
            Files will be moved into categorized folders
          </p>
        </section>
      </div>
    </main>
  );
}
