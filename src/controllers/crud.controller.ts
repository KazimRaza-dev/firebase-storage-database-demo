import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getDocs, getFirestore, query, where, documentId, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import config from "../config/firebase.config"
import { pick } from "lodash";
import express, { Router, Request, Response } from "express";
const router: Router = express.Router();

// Initialize Firebase
const app = initializeApp(config.firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Get reference to employee collection
const employeesRef = collection(db, "employee");

//Add new Employee
router.post('/', async (req: Request, res: Response) => {
    try {
        const employee = pick(req.body, ['name', 'age', 'position', 'isPermanent']);
        const docRef = await addDoc(employeesRef, employee);
        console.log("Document written with ID: ", docRef.id);
        return res.send('New employee added to DB.')
    } catch (e) {
        return res.status(400).send(e.message)
    }
})

//Get records of all employees
router.get('/', async (req: Request, res: Response) => {
    try {
        const querySnapshot = await getDocs(employeesRef);
        const records = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            records.push(doc.data());
        });
        return res.send({
            'employees records': records
        });
    } catch (err) {
        res.status(400).send(err.message);
    }
})

// Get employee by Id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const employeeId = req.params.id

        const q = query(employeesRef, where(documentId(), "==", employeeId));
        // const q = query(employeesRef, where("isPermanent", "==", true));

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return res.send(`Employee with id ${employeeId} does not exists.`)
        }
        const employeeRecord = querySnapshot.docs[0].data();
        res.send({
            'Employee record': employeeRecord
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// edit employee records 
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const employeeId = req.params.id;
        const UpdatedEmployee = pick(req.body, ['name', 'age', 'position', 'isPermanent']);
        const q = query(employeesRef, where(documentId(), "==", employeeId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return res.send(`Employee with id ${employeeId} does not exists.`)
        }
        //updateDoc can update single or multiple fields
        await updateDoc(doc(db, "employee", employeeId), UpdatedEmployee);
        res.send('Employee record edited.')
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// Delete employee records 
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const employeeId = req.params.id;
        const querySnapshot = await getDocs(query(employeesRef, where(documentId(), "==", employeeId)));
        if (querySnapshot.empty) {
            return res.send(`Employee with id ${employeeId} does not exists.`)
        }
        //deleteDoc delete a document if exists
        await deleteDoc(doc(db, "employee", employeeId));
        res.send('Employee records Deleted.')
    } catch (error) {
        res.status(400).send(error.message)
    }
})

export default router;