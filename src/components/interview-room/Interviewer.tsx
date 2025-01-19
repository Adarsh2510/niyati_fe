import { OrbitControls, useTexture } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import { InterviewerAvatar } from "../Avatar";
import { useThree } from "@react-three/fiber";

export default function Interviewer() {
    const backgroundImage = useTexture('/meeting-room.webp');
    const viewPort = useThree((state: any) => state.viewport);
    return (
        <>
        <OrbitControls/>
        <Environment preset="sunset" />
        <mesh>
            <planeGeometry args={[viewPort.width, viewPort.height]} />
            <meshBasicMaterial map={backgroundImage} />
        </mesh>
        </>
    )
}