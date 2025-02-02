
import { PrismaClient } from "@prisma/client";
import {translate} from '@vitalets/google-translate-api';
import redis from "../redisClient.js"




export const getFAQs = async (req, res) =>{
    const {lang} = req.query;
    try{
        const prisma = new PrismaClient();
        let faqs = await prisma.fAQ.findMany();
        
        if(lang && lang!=="en"){
            faqs = await Promise.all(
                faqs.map(async (faq)=> {
                    const translatedQuestion = await getTranslation(faq.question, lang);
                    const translatedAnswerr = await getTranslation(faq.answer, lang);

                    return{
                        id:faq.id,
                        question:translatedQuestion,
                        answer:translatedAnswerr
                    }
                })
            )
        }

        res.status(200).json(faqs)

    }catch(error){
        res.status(500).json({error:"Error Fetching FAQ's"})
    }
}

const getTranslation =async (text, lang) =>{
    const cachedTranslation = await redis.get(`${text}_${lang}`);
    if(cachedTranslation){
        console.log("Cache hit");
        return cachedTranslation;
    }

    console.log("cache miss, translation");
    const translatedText = await translate(text, {to:lang});
    await redis.setex(`${text}_${lang}`, 3600, translatedText.text)
    return translatedText.text
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


