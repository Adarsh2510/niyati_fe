import { useTexture } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import { InterviewerAvatar } from "../Avatar";
import { Canvas, useThree } from "@react-three/fiber";
import { memo, useState } from "react";
import { animations } from "@/constants/interviewer";

function InterviewerAvatarCanvas() {
    const backgroundImage = useTexture('/meeting-room.webp');
    const viewPort = useThree((state: any) => state.viewport);
    const [animation, setAnimation] = useState(animations.SittingIdle);

    return (
        <>
        <Environment preset="sunset" />
        <InterviewerAvatar position={[0, -3, -2]} scale={2} animation={animation} />
        </>
    )
}

const MemoizedInterviewer = memo(InterviewerAvatarCanvas);
export default function Interviewer() {
    return (
        <div className="w-full bg-cover bg-center relative" style={{ backgroundImage: `url('/meeting-room.webp')`, height:"43rem" }}>
        <div className="absolute bottom-0 left-0 h-96">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 30 }}>
        <MemoizedInterviewer/>
        </Canvas>
        </div>
    </div>  
    )
}