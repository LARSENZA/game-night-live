import { AnswerKeyClient } from "@/app/answer-key-client";
export default async function AnswerKeyPage({params}:{params:Promise<{code:string}>}){const {code}=await params;return <AnswerKeyClient code={code.toUpperCase()}/>}
