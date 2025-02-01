import { Router } from "express";
import { getFAQs, createFAQ } from "../Controllers/Faqcontrollers.js";

const router = Router();

router.get('/', getFAQs);
router.post('/', createFAQ);


export default router;

