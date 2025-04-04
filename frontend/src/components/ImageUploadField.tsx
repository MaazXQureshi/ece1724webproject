import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadCloudIcon } from "lucide-react";
import { useRef, useState } from "react";

interface ImageUploadFieldProps {
  onFileSelect: (file: File) => void;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-base">Event Image</Label>

      <div
        className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition cursor-pointer text-center"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloudIcon className="w-8 h-8 text-gray-500 mb-2" />
        <span className="text-sm text-gray-600">
          Click to upload or drag and drop
        </span>
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      {selectedImage && (
        <div className="mt-2 text-green-600">
          Selected file: {selectedImage.name}
        </div>
      )}
    </div>
  );
};
