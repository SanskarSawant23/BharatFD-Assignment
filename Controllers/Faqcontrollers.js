import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import {translate} from '@vitalets/google-translate-api';




export const getFAQs = async (req, res) =>{
    const {lang} = req.query;
    try{
        const prisma = new PrismaClient();
        let faqs = await prisma.fAQ.findMany();
        
        if(lang && lang !=="en"){
            faqs = faqs.map((faq)=>({
                id:faq.id,
                question:faq[`question_${lang}`] || faq.question,
                answer:faq.answer
            }))
        }

        res.status(200).json(faqs)

    }catch(error){
        res.status(500).json({error:"Error Fetching FAQ's"})
    }
}

export const createFAQ = async (req, res) =>{
    const{question, answer} = req.body;

    try{
        const hindiTranslation = await translate(question, {to:'hi'})
        const bengaliTranslation = await translate(question, {to:"bn"})
        console.log(hindiTranslation)
        const prisma = new PrismaClient();

        const newFAQ = await prisma.fAQ.create({
            data:{
                question,
                answer,
                question_hindi:hindiTranslation.text,
                question_bengali:bengaliTranslation.text
            }
        })

        res.status(201).json(newFAQ);
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Error creating FAQ"});
    }
    
    
}


