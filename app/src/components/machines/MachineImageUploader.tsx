import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface MachineImageState {
    id?: string;
    url: string;
    file?: File;
    isNew: boolean;
}

interface MachineImageUploaderProps {
    images: MachineImageState[];
    onAdd: (newImages: MachineImageState[]) => void;
    onRemove: (index: number) => void;
}

export function MachineImageUploader({ images, onAdd, onRemove }: MachineImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (images.length + files.length > 3) {
            toast({
                title: "Limite de imagens",
                description: "Você pode enviar no máximo 3 fotos",
                variant: "destructive"
            });
            return;
        }

        const validFiles = files.filter(file => {
            const isImage = file.type.startsWith('image/');
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

            if (!isImage) {
                toast({
                    title: "Arquivo inválido",
                    description: `${file.name} não é uma imagem`,
                    variant: "destructive"
                });
            }
            if (!isValidSize) {
                toast({
                    title: "Arquivo muito grande",
                    description: `${file.name} excede 5MB`,
                    variant: "destructive"
                });
            }

            return isImage && isValidSize;
        });

        if (validFiles.length > 0) {
            const newImages = validFiles.map(file => ({
                url: URL.createObjectURL(file),
                file,
                isNew: true
            }));
            onAdd(newImages);
        }

        // Clear input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div>
            <h3 className="text-lg font-medium mb-4">Fotos da Máquina</h3>
            <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                        id="machine-images"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={images.length >= 3}
                        className="w-full"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Selecionar Fotos ({images.length}/3)
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        Envie até 3 fotos da máquina (máx. 5MB cada)
                    </p>
                </div>

                {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                        {images.map((img, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={img.url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => onRemove(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                {index === 0 && (
                                    <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                                        Principal
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
