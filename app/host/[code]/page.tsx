import { RoomClient } from "@/app/room-client";
export default async function HostPage({params}:{params:Promise<{code:string}>}) { const {code}=await params; return <RoomClient code={code.toUpperCase()} role="host"/> }
