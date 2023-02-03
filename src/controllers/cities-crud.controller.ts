import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getDocs, getFirestore, query, where, documentId, setDoc } from "firebase/firestore";
import config from "../config/firebase.config"
import { pick } from "lodash";
import express, { Router, Request, Response } from "express";
const router: Router = express.Router();

// Initialize Firebase
const app = initializeApp(config.firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Get reference to employee collection
const cityRef = collection(db, "cities");

// Add new data
router.post('/', async (req: Request, res: Response) => {
    try {
        const city = pick(req.body, ['name', 'state', 'country']);
        const docRef = await addDoc(cityRef, city);
        console.log("Document written with ID: ", docRef.id);
        return res.send('New City added to DB.')
    } catch (e) {
        return res.status(400).send(e.message)
    }
})

export default router;