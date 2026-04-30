import { open } from "@tauri-apps/plugin-dialog";
import Button from "../ui/Button";
import Card from "../ui/Card";

interface DestinationFolderCardProps {
  folderPath: string;
  onFolderChange: (path: string) => void;
}

export default function DestinationFolderCard({ folderPath, onFolderChange }: DestinationFolderCardProps) {
  async function handleChangeFolder(): Promise<void> {
    const selected = await open({
      directory: true,
      multiple: false,
      title: "Choose default organization folder",
    });

    if (!selected || Array.isArray(selected)) {
      return;
    }

    onFolderChange(selected);
  }

  return (
    <Card className="p-6">
      <h2 className="mb-1 text-base font-bold text-[#2a3439]">Destination Library</h2>
      <p className="mb-4 text-sm leading-relaxed text-[#566166]">
        Choose the primary folder where organized files will be archived.
      </p>
      <div className="flex flex-wrap items-center gap-4 rounded-xl bg-[#f0f4f7] p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e2dfff] text-[#4d44e3]">
          <span className="material-symbols-outlined">folder_open</span>
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#566166]">Current folder</p>
          <p className="text-sm font-medium text-[#2a3439]">
            {folderPath.length > 0 ? folderPath : "No default folder selected"}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => void handleChangeFolder()}>
          Change
        </Button>
      </div>
    </Card>
  );
}
