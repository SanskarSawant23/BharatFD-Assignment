import { Router } from "express";
import { getFAQs, createFAQ } from "../Controllers/Faqcontrollers.js";

const router = Router();

router.get('/getFAQ', getFAQs);
router.post('/createFAQ', createFAQ);


export default router;

