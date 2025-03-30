import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, Pen, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ELogLevels } from '@/constants/logs';
import { sendLog } from '@/utils/logs';

const WhiteboardCanvas = () => {
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [color, setColor] = useState('#000000');

    const handleSave = async () => {
        if (canvasRef.current) {
            try {
                const dataUrl = await canvasRef.current.exportImage('jpeg');
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'whiteboard-drawing.jpeg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                sendLog({err: error as Error, level: ELogLevels.Error});
                toast.error('Error saving image, Please try again !');
            }
        }
    };

    const handleClear = () => {
        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
        }
    };

    return (
        <div className="w-full h-full flex flex-row">
            <div className="flex flex-col items-center gap-2 p-2 pl-4 pb-4">
                <Button
                    variant={tool === 'pen' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setTool('pen')}
                >
                    <Pen className="h-4 w-4" />
                </Button>
                <Button
                    variant={tool === 'eraser' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setTool('eraser')}
                >
                    <Eraser className="h-4 w-4" />
                </Button>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleClear}
                    className="ml-auto"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="default"
                    size="icon"
                    onClick={handleSave}
                >
                    <Save className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex-1 bg-white p-2">
                <ReactSketchCanvas
                    ref={canvasRef}
                    strokeWidth={4}
                    strokeColor={color}
                    width="100%"
                    height="100%"
                    style={{ border: '1px solid rgb(170, 162, 162)',
                        borderRadius: '10px',
                        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                     }}
                    exportWithBackgroundImage={false}
                    withTimestamp={true}
                    backgroundImage={undefined}
                />
            </div>
        </div>
    );
};

export default WhiteboardCanvas; 