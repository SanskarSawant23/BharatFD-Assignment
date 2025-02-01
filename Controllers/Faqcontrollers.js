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
                answer:faq[`answer_${lang}`] || faq.answer
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
        const hindiTranslationQuestion = await translate(question, {to:'hi'})
        const bengaliTranslationQuestion = await translate(question, {to:"bn"})
        const hindiTranslationAnswer = await translate(answer, {to:'hi'});
        const bengaliTranslationAnswer = await translate(answer, {to:'bn'})

        console.log('Hindi Question:', hindiTranslationQuestion.text);
        console.log('Bengali Question:', bengaliTranslationQuestion.text);
        console.log('Hindi Answer:', hindiTranslationAnswer.text);
        console.log('Bengali Answer:', bengaliTranslationAnswer.text);
        
        const prisma = new PrismaClient();

        const newFAQ = await prisma.fAQ.create({
            data:{
                question,
                answer,
                question_hi:hindiTranslationQuestion.text,
                question_bn:bengaliTranslationQuestion.text,
                answer_hi: hindiTranslationAnswer.text,
                answer_bn:bengaliTranslationAnswer.text

            }
        })

        res.status(201).json(newFAQ);
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Error creating FAQ"});
    }
    
    
}


