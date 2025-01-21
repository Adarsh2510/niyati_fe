import { OrbitControls, useTexture } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import { InterviewerAvatar } from "../Avatar";
import { useThree } from "@react-three/fiber";
import { useState } from "react";
import { animations } from "@/constants/interviewer";

export default function Interviewer() {
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