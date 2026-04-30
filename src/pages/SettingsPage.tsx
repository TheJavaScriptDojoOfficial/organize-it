import DestinationFolderCard from "../components/settings/DestinationFolderCard";
import SettingToggleRow from "../components/settings/SettingToggleRow";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fb] px-6 py-10 text-[#2a3439]">
      <div className="mx-auto max-w-2xl space-y-8">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#566166]">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to dashboard
        </a>

        <header>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-[2.75rem]">Settings</h1>
          <p className="mt-2 text-sm text-[#566166]">
            Manage how Organize.it handles your files and workspace.
          </p>
        </header>

        <DestinationFolderCard />

        <div className="space-y-4">
          <SettingToggleRow
            title="Ask confirmation before organizing"
            description="Prompt for approval for each batch processing action to prevent accidental moves."
            checked
          />
          <SettingToggleRow
            title="Enable preview before organizing"
            description="Show a generated visualization of folder structure before any changes are applied."
          />
        </div>

        <Card className="bg-[#ffeef1] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#9e3f4e]">Reset configuration</h3>
              <p className="mt-1 text-xs text-[#566166]">
                Revert all organization rules to factory defaults.
              </p>
            </div>
            <Button variant="danger" size="sm">
              Reset
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
