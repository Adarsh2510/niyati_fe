import Image from "next/image";

export default function DashboardHeader() {
    return (
        <div className="w-full bg-white border-b-2 border-gray-200 sticky top-0 z-10">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Image src={require('@/assets/engineer.svg')} alt="logo" width={32} height={32} />
                    <h1 className="text-2xl font-bold">Niyati</h1>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-full p-2">
                    <Image src={require('@/assets/user.svg')} alt="logo" width={32} height={32} />
                    <h1 className="text-2xl">John Doe</h1>
                </div>
            </div>
        </div>
    );
}