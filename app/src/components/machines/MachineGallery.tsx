import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  X,
  Star,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface MachineImage {
  id: string;
  url: string;
  fileName: string;
  isCover: boolean;
}

interface MachineGalleryProps {
  machineId: string;
  images: MachineImage[];
  onImagesChange: (images: MachineImage[]) => void;
  readonly?: boolean;
}

export const MachineGallery = ({
  machineId,
  images,
  onImagesChange,
  readonly = false
}: MachineGalleryProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    if (readonly) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      toast({
        title: "Arquivos inválidos",
        description: "Apenas arquivos JPG, PNG e WEBP são permitidos",
        variant: "destructive",
      });
      return;
    }

    // Check file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Arquivos muito grandes",
        description: "Cada arquivo deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const newImages: MachineImage[] = [];

    try {
      for (const file of files) {
        const fileId = crypto.randomUUID();
        const fileName = `${fileId}-${file.name}`;
        const filePath = `machines/${machineId}/gallery/${fileName}`;

        // Upload original image
        const { error: uploadError } = await supabase.storage
          .from('public-machines')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('public-machines')
          .getPublicUrl(filePath);

        newImages.push({
          id: fileId,
          url: publicUrl,
          fileName: file.name,
          isCover: images.length === 0 && newImages.length === 0 // First image is cover
        });
      }

      onImagesChange([...images, ...newImages]);

      toast({
        title: "Upload concluído",
        description: `${files.length} imagem(ns) adicionada(s) com sucesso`,
      });

    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Upload error:', error);
      }
      toast({
        title: "Erro no upload",
        description: error.message || "Falha ao enviar imagens",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSetCover = async (imageId: string) => {
    if (readonly) return;

    const updatedImages = images.map(img => ({
      ...img,
      isCover: img.id === imageId
    }));

    onImagesChange(updatedImages);

    toast({
      title: "Capa definida",
      description: "Imagem definida como capa da máquina",
    });
  };

  const handleDeleteImage = async (imageId: string) => {
    if (readonly) return;

    try {
      const imageToDelete = images.find(img => img.id === imageId);
      if (imageToDelete) {
        // Extract file path from URL
        const url = new URL(imageToDelete.url);
        const filePath = url.pathname.split('/storage/v1/object/public/public-machines/')[1];

        if (filePath) {
          await supabase.storage
            .from('public-machines')
            .remove([filePath]);
        }
      }

      const updatedImages = images.filter(img => img.id !== imageId);

      // If deleted image was cover, set first remaining image as cover
      if (imageToDelete?.isCover && updatedImages.length > 0) {
        updatedImages[0].isCover = true;
      }

      onImagesChange(updatedImages);

      toast({
        title: "Imagem removida",
        description: "Imagem excluída com sucesso",
      });

    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Delete error:', error);
      }
      toast({
        title: "Erro ao excluir",
        description: error.message || "Falha ao excluir imagem",
        variant: "destructive",
      });
    }
  };

  if (readonly && images.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Nenhuma imagem disponível</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {!readonly && (
        <>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                ? 'border-primary bg-primary/10'
                : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInput}
              className="hidden"
            />

            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Enviando imagens...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-2">
                  Arraste imagens aqui ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  JPG, PNG, WEBP até 5MB cada
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Selecionar Arquivos
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="relative overflow-hidden group">
              <AspectRatio ratio={4 / 3}>
                <img
                  src={image.url}
                  alt={image.fileName}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>

              {image.isCover && (
                <Badge
                  className="absolute top-2 left-2"
                  variant="secondary"
                >
                  <Star className="w-3 h-3 mr-1" />
                  Capa
                </Badge>
              )}

              {!readonly && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex gap-2">
                    {!image.isCover && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSetCover(image.id)}
                      >
                        <Star className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};