interface MachineImageGalleryProps {
    images: string[];
    machineName: string;
    selectedImage: number;
    onSelectImage: (index: number) => void;
}

export function MachineImageGallery({ images, machineName, selectedImage, onSelectImage }: MachineImageGalleryProps) {
    const mainImage = images && images.length > 0
        ? images[selectedImage]
        : "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=600&fit=crop";

    return (
        <>
            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8 h-[250px] sm:h-[350px] md:h-[500px]">
                <div className="md:col-span-3 h-full relative group">
                    <img
                        src={mainImage}
                        alt={machineName}
                        className="w-full h-full object-cover rounded-xl md:rounded-l-xl md:rounded-r-none cursor-pointer"
                    />
                </div>
                <div className="hidden md:flex flex-col gap-4 h-full">
                    {images && images.slice(0, 2).map((img, idx) => (
                        <div key={idx} className="flex-1 relative cursor-pointer" onClick={() => onSelectImage(idx)}>
                            <img
                                src={img}
                                alt={`${machineName} ${idx + 1}`}
                                className={`w-full h-full object-cover ${idx === 0 ? 'rounded-tr-xl' : 'rounded-br-xl'} hover:opacity-90 transition-opacity`}
                            />
                        </div>
                    ))}
                    {(!images || images.length < 2) && (
                        <div className="flex-1 bg-muted rounded-r-xl flex items-center justify-center text-muted-foreground">
                            <span className="text-sm">Sem mais fotos</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile image thumbnails */}
            {images && images.length > 1 && (
                <div className="flex md:hidden gap-2 mb-6 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => onSelectImage(idx)}
                            className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-primary' : 'border-transparent'}`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}
