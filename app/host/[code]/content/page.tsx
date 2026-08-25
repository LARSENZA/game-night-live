import { ContentManager } from "@/app/content-manager";
export default async function ContentPage({params}:{params:Promise<{code:string}>}) { const {code}=await params; return <ContentManager code={code.toUpperCase()}/> }
